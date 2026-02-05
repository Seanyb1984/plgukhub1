import { prisma } from '@/lib/db';
import type { Prisma } from '@prisma/client';

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'SIGN'
  | 'LOCK'
  | 'AMEND'
  | 'EXPORT'
  | 'VIEW'
  | 'DELETE'
  | 'DRAFT_SAVE'
  | 'RESUME';

export interface AuditContext {
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditEntry {
  submissionId?: string;
  action: AuditAction;
  previousData?: Prisma.JsonValue;
  newData?: Prisma.JsonValue;
  changedFields?: string[];
  context: AuditContext;
}

/**
 * Create an immutable audit log entry
 * Audit logs cannot be updated or deleted
 */
export async function createAuditLog(entry: AuditEntry): Promise<void> {
  await prisma.auditLog.create({
    data: {
      submissionId: entry.submissionId,
      action: entry.action,
      userId: entry.context.userId,
      previousData: entry.previousData ?? Prisma.JsonNull,
      newData: entry.newData ?? Prisma.JsonNull,
      changedFields: entry.changedFields ?? [],
      ipAddress: entry.context.ipAddress,
      userAgent: entry.context.userAgent,
    },
  });
}

/**
 * Get audit trail for a specific submission
 */
export async function getSubmissionAuditTrail(submissionId: string) {
  return prisma.auditLog.findMany({
    where: { submissionId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Get recent audit logs for a user
 */
export async function getUserAuditTrail(userId: string, limit: number = 50) {
  return prisma.auditLog.findMany({
    where: { userId },
    include: {
      submission: {
        select: {
          id: true,
          formType: true,
          client: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

/**
 * Compare two objects and return the changed fields
 */
export function getChangedFields(
  previous: Record<string, unknown>,
  current: Record<string, unknown>
): string[] {
  const changedFields: string[] = [];
  const allKeys = new Set([...Object.keys(previous), ...Object.keys(current)]);

  for (const key of allKeys) {
    const prevValue = JSON.stringify(previous[key]);
    const currValue = JSON.stringify(current[key]);

    if (prevValue !== currValue) {
      changedFields.push(key);
    }
  }

  return changedFields;
}

/**
 * Format audit action for display
 */
export function formatAuditAction(action: AuditAction): string {
  const actionLabels: Record<AuditAction, string> = {
    CREATE: 'Created',
    UPDATE: 'Updated',
    SIGN: 'Signed',
    LOCK: 'Locked',
    AMEND: 'Amended',
    EXPORT: 'Exported',
    VIEW: 'Viewed',
    DELETE: 'Deleted',
    DRAFT_SAVE: 'Saved as draft',
    RESUME: 'Resumed',
  };

  return actionLabels[action] || action;
}
