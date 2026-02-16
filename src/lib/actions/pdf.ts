'use server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/auth-helpers';
import { formatDateTime, formatBrand } from '@/lib/utils';

export async function generateClinicalPDF(submissionId: string) {
  const session = await requireSession();
  
  // 1. Fetch the full record with all clinical metadata
  const submission = await prisma.formSubmission.findUnique({
    where: { id: submissionId },
    include: { 
      site: true, 
      practitioner: true, 
      client: true 
    }
  });

  if (!submission) throw new Error("Record not found");

  // 2. Prepare the PDF Document Structure
  // In a full implementation, you would use a library like 'react-pdf' or 'puppeteer'
  // to render this into a buffer.
  const reportData = {
    header: {
      clinic: submission.site.name,
      brand: formatBrand(submission.brand),
      timestamp: formatDateTime(submission.submittedAt || submission.createdAt),
      recordId: submission.id
    },
    patient: {
      name: submission.client ? `${submission.client.firstName} ${submission.client.lastName}` : "Internal Log",
      id: submission.client?.clientId
    },
    practitioner: {
      name: submission.practitioner?.name,
      signatureStatus: submission.signatureData ? "Digitally Signed" : "No Signature"
    },
    clinicalContent: submission.data,
    safetyAlerts: {
      riskLevel: submission.riskLevel,
      flags: submission.riskFlags
    }
  };

  // 3. Log the generation for the Audit Trail
  await prisma.auditLog.create({
    data: {
      submissionId,
      action: 'PDF_GENERATE',
      userId: session.user.id,
      newData: { message: "Clinical PDF generated for export" },
      ipAddress: "Secure Admin Panel"
    }
  });

  return { success: true, reportData };
}
