'use server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';
import { formRegistry } from '@/lib/forms/registry';

// --- ACTION 1: SUBMIT NEW FORM ---
export async function submitFormAction(formType: string, formData: any) {
  const session = await requireSession();
  const { brand, siteId, id: userId } = session.user;

  // 1. Fetch form rules to scan for risks
  const definition = formRegistry.get(formType);
  let finalRiskLevel = 'NONE';
  let riskFlags: string[] = [];

  // 2. Automated Safety Check
  if (definition) {
    definition.fields.forEach(field => {
      if (field.stopCondition && formData[field.id]) {
        const result = field.stopCondition(formData[field.id]);
        if (result) {
          finalRiskLevel = result.riskLevel; // e.g., 'HIGH' or 'CRITICAL'
          riskFlags.push(result.message);
        }
      }
    });
  }

  try {
    const submission = await prisma.formSubmission.create({
      data: {
        formType,
        brand,
        siteId,
        data: formData,
        status: 'SIGNED',
        riskLevel: finalRiskLevel as any, 
        riskFlags: riskFlags,
        requiresEscalation: finalRiskLevel === 'CRITICAL' || finalRiskLevel === 'HIGH',
        practitionerId: userId,
        signatureData: formData.signature || null,
        submittedAt: new Date(),
      },
    });

    // 3. CQC Audit Log
    await prisma.auditLog.create({
      data: {
        submissionId: submission.id,
        action: 'CREATE',
        userId: userId,
        newData: formData,
        ipAddress: 'Secure Hub Dashboard',
      }
    });

    revalidatePath('/admin');
    revalidatePath('/admin/submissions');
    
    return { success: true, id: submission.id, riskLevel: finalRiskLevel };
  } catch (error) {
    console.error('Clinical Save Error:', error);
    return { success: false, error: 'Failed to save clinical record' };
  }
}

// --- ACTION 2: LOCK COMPLETED RECORD ---
export async function lockSubmissionAction(id: string) {
  const session = await requireSession(); 
  
  try {
    await prisma.formSubmission.update({
      where: { id },
      data: { 
        isLocked: true, 
        lockedAt: new Date(),
        // We use the ID from the active session to track who finalized it
        lockedById: session.user.id 
      }
    });

    // 4. Log the finalization in the Audit Log
    await prisma.auditLog.create({
      data: {
        submissionId: id,
        action: 'LOCK',
        userId: session.user.id,
        newData: { status: 'LOCKED', message: 'Clinical record finalized.' },
        ipAddress: 'Secure Admin Panel',
      }
    });

    revalidatePath(`/admin/submissions/${id}`);
    revalidatePath('/admin/submissions');
    return { success: true };
  } catch (error) {
    console.error('Lock Action Error:', error);
    return { success: false, error: 'Failed to lock record' };
  }
}
