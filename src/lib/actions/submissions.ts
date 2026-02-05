'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { createAuditLog, getChangedFields } from '@/lib/audit';
import { getFormDefinition, validateForm, evaluateStopConditions } from '@/lib/forms';
import { generateResumeToken } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import type { Brand, SubmissionStatus, RiskLevel, Prisma } from '@prisma/client';

interface SubmissionResult {
  success: boolean;
  submissionId?: string;
  resumeToken?: string;
  errors?: Record<string, string>;
  stopConditions?: Array<{
    message: string;
    action: string;
    riskLevel?: string;
  }>;
}

interface CreateSubmissionData {
  formType: string;
  brand: Brand;
  siteId: string;
  clientId?: string;
  appointmentId?: string;
  data: Record<string, unknown>;
  isDraft?: boolean;
  signatureData?: string;
  signedByName?: string;
}

export async function createSubmission(
  input: CreateSubmissionData
): Promise<SubmissionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, errors: { _form: 'Unauthorized' } };
  }

  const form = getFormDefinition(input.formType);
  if (!form) {
    return { success: false, errors: { _form: 'Form type not found' } };
  }

  // Validate form data (skip validation for drafts)
  const validation = validateForm(form, input.data, input.isDraft);

  // Check for stop conditions
  const stopConditions = evaluateStopConditions(form, input.data);
  const hasStopAction = stopConditions.some((c) => c.action === 'stop');

  if (hasStopAction && !input.isDraft) {
    return {
      success: false,
      stopConditions: stopConditions.map((c) => ({
        message: c.message,
        action: c.action,
        riskLevel: c.riskLevel,
      })),
    };
  }

  if (!validation.isValid && !input.isDraft) {
    return { success: false, errors: validation.errors };
  }

  // Determine risk level
  let riskLevel: RiskLevel = 'NONE';
  const riskFlags: string[] = [];

  for (const condition of stopConditions) {
    riskFlags.push(condition.message);
    if (condition.riskLevel) {
      const levels: RiskLevel[] = ['NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
      const currentIndex = levels.indexOf(riskLevel);
      const conditionIndex = levels.indexOf(condition.riskLevel as RiskLevel);
      if (conditionIndex > currentIndex) {
        riskLevel = condition.riskLevel as RiskLevel;
      }
    }
  }

  const requiresEscalation = stopConditions.some(
    (c) => c.action === 'escalate'
  );

  // Determine status
  let status: SubmissionStatus = 'SUBMITTED';
  if (input.isDraft) {
    status = 'DRAFT';
  } else if (input.signatureData && form.requiresSignature) {
    status = 'SIGNED';
  }

  // Generate resume token for drafts
  const resumeToken = input.isDraft ? generateResumeToken() : undefined;

  try {
    const submission = await prisma.formSubmission.create({
      data: {
        formType: input.formType,
        formVersion: form.version,
        brand: input.brand,
        siteId: input.siteId,
        clientId: input.clientId,
        appointmentId: input.appointmentId,
        data: input.data as Prisma.JsonObject,
        status,
        riskLevel,
        riskFlags,
        requiresEscalation,
        escalationReason: requiresEscalation
          ? stopConditions
              .filter((c) => c.action === 'escalate')
              .map((c) => c.message)
              .join('; ')
          : null,
        signatureData: input.signatureData,
        signedAt: input.signatureData ? new Date() : null,
        signedByName: input.signedByName,
        practitionerId: session.user.id,
        draftSavedAt: input.isDraft ? new Date() : null,
        resumeToken,
        submittedAt: input.isDraft ? null : new Date(),
      },
    });

    // Create audit log
    await createAuditLog({
      submissionId: submission.id,
      action: input.isDraft ? 'DRAFT_SAVE' : 'CREATE',
      newData: input.data as Prisma.JsonValue,
      context: {
        userId: session.user.id,
      },
    });

    revalidatePath('/admin/submissions');

    return {
      success: true,
      submissionId: submission.id,
      resumeToken,
      stopConditions:
        stopConditions.length > 0
          ? stopConditions.map((c) => ({
              message: c.message,
              action: c.action,
              riskLevel: c.riskLevel,
            }))
          : undefined,
    };
  } catch (error) {
    console.error('Failed to create submission:', error);
    return { success: false, errors: { _form: 'Failed to save submission' } };
  }
}

export async function updateSubmission(
  submissionId: string,
  data: Record<string, unknown>,
  isDraft: boolean = false
): Promise<SubmissionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, errors: { _form: 'Unauthorized' } };
  }

  const existing = await prisma.formSubmission.findUnique({
    where: { id: submissionId },
  });

  if (!existing) {
    return { success: false, errors: { _form: 'Submission not found' } };
  }

  if (existing.isLocked) {
    return {
      success: false,
      errors: { _form: 'Submission is locked. Use amendment flow.' },
    };
  }

  const form = getFormDefinition(existing.formType);
  if (!form) {
    return { success: false, errors: { _form: 'Form type not found' } };
  }

  const validation = validateForm(form, data, isDraft);
  if (!validation.isValid && !isDraft) {
    return { success: false, errors: validation.errors };
  }

  const changedFields = getChangedFields(
    existing.data as Record<string, unknown>,
    data
  );

  try {
    await prisma.formSubmission.update({
      where: { id: submissionId },
      data: {
        data: data as Prisma.JsonObject,
        status: isDraft ? 'DRAFT' : 'SUBMITTED',
        draftSavedAt: isDraft ? new Date() : null,
        submittedAt: isDraft ? null : new Date(),
      },
    });

    await createAuditLog({
      submissionId,
      action: isDraft ? 'DRAFT_SAVE' : 'UPDATE',
      previousData: existing.data,
      newData: data as Prisma.JsonValue,
      changedFields,
      context: {
        userId: session.user.id,
      },
    });

    revalidatePath('/admin/submissions');

    return { success: true, submissionId };
  } catch (error) {
    console.error('Failed to update submission:', error);
    return { success: false, errors: { _form: 'Failed to update submission' } };
  }
}

export async function signSubmission(
  submissionId: string,
  signatureData: string,
  signedByName: string
): Promise<SubmissionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, errors: { _form: 'Unauthorized' } };
  }

  const submission = await prisma.formSubmission.findUnique({
    where: { id: submissionId },
  });

  if (!submission) {
    return { success: false, errors: { _form: 'Submission not found' } };
  }

  if (submission.isLocked) {
    return { success: false, errors: { _form: 'Submission is already locked' } };
  }

  try {
    await prisma.formSubmission.update({
      where: { id: submissionId },
      data: {
        signatureData,
        signedByName,
        signedAt: new Date(),
        status: 'SIGNED',
        isLocked: true,
        lockedAt: new Date(),
        lockedReason: 'Signed by client',
      },
    });

    await createAuditLog({
      submissionId,
      action: 'SIGN',
      context: {
        userId: session.user.id,
      },
    });

    revalidatePath('/admin/submissions');

    return { success: true, submissionId };
  } catch (error) {
    console.error('Failed to sign submission:', error);
    return { success: false, errors: { _form: 'Failed to sign submission' } };
  }
}

export async function createAmendment(
  submissionId: string,
  reason: string,
  newData: Record<string, unknown>,
  signatureData?: string,
  signedByName?: string
): Promise<SubmissionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, errors: { _form: 'Unauthorized' } };
  }

  const submission = await prisma.formSubmission.findUnique({
    where: { id: submissionId },
  });

  if (!submission) {
    return { success: false, errors: { _form: 'Submission not found' } };
  }

  if (!submission.isLocked) {
    return {
      success: false,
      errors: { _form: 'Can only amend locked submissions' },
    };
  }

  const changedFields = getChangedFields(
    submission.data as Record<string, unknown>,
    newData
  );

  try {
    const amendment = await prisma.amendment.create({
      data: {
        submissionId,
        reason,
        changedFields: Object.fromEntries(
          changedFields.map((field) => [
            field,
            {
              old: (submission.data as Record<string, unknown>)[field],
              new: newData[field],
            },
          ])
        ),
        newData: newData as Prisma.JsonObject,
        signatureData,
        signedByName,
        signedAt: signatureData ? new Date() : null,
        amendedById: session.user.id,
      },
    });

    // Update submission status
    await prisma.formSubmission.update({
      where: { id: submissionId },
      data: {
        status: 'AMENDED',
      },
    });

    await createAuditLog({
      submissionId,
      action: 'AMEND',
      previousData: submission.data,
      newData: newData as Prisma.JsonValue,
      changedFields,
      context: {
        userId: session.user.id,
      },
    });

    revalidatePath('/admin/submissions');

    return { success: true, submissionId: amendment.id };
  } catch (error) {
    console.error('Failed to create amendment:', error);
    return { success: false, errors: { _form: 'Failed to create amendment' } };
  }
}

export async function getSubmission(submissionId: string) {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  return prisma.formSubmission.findUnique({
    where: { id: submissionId },
    include: {
      client: true,
      practitioner: true,
      site: true,
      amendments: {
        orderBy: { createdAt: 'desc' },
      },
      auditLogs: {
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
    },
  });
}

export async function resumeSubmission(resumeToken: string) {
  return prisma.formSubmission.findUnique({
    where: { resumeToken },
    include: {
      client: true,
      site: true,
    },
  });
}
