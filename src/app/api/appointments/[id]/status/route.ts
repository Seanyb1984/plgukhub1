import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/db';

const STATUS_TRANSITIONS: Record<string, string[]> = {
  BOOKED: ['CONFIRMED', 'CHECKED_IN', 'CANCELLED_BY_CLIENT', 'CANCELLED_BY_CLINIC', 'NO_SHOW'],
  CONFIRMED: ['CHECKED_IN', 'CANCELLED_BY_CLIENT', 'CANCELLED_BY_CLINIC', 'NO_SHOW'],
  CHECKED_IN: ['IN_PROGRESS', 'CANCELLED_BY_CLIENT', 'CANCELLED_BY_CLINIC', 'NO_SHOW'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED_BY_CLINIC'],
  COMPLETED: [],
  NO_SHOW: [],
  CANCELLED_BY_CLIENT: [],
  CANCELLED_BY_CLINIC: [],
};

const ACTION_MAP: Record<string, string> = {
  check_in: 'CHECKED_IN',
  start: 'IN_PROGRESS',
  complete: 'COMPLETED',
  cancel_client: 'CANCELLED_BY_CLIENT',
  cancel_clinic: 'CANCELLED_BY_CLINIC',
  no_show: 'NO_SHOW',
  confirm: 'CONFIRMED',
};

// ============================================
// POST /api/appointments/[id]/status — Change appointment status
// ============================================
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { action, cancellationReason } = body;

    if (!action) {
      return NextResponse.json({ error: 'action is required' }, { status: 400 });
    }

    const targetStatus = ACTION_MAP[action];
    if (!targetStatus) {
      return NextResponse.json(
        { error: `Invalid action: ${action}. Valid actions: ${Object.keys(ACTION_MAP).join(', ')}` },
        { status: 400 }
      );
    }

    if ((action === 'cancel_client' || action === 'cancel_clinic') && !cancellationReason) {
      return NextResponse.json(
        { error: 'cancellationReason is required for cancellation actions' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const allowedTransitions = STATUS_TRANSITIONS[appointment.status] || [];
    if (!allowedTransitions.includes(targetStatus)) {
      return NextResponse.json(
        { error: `Cannot transition from ${appointment.status} to ${targetStatus}` },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = { status: targetStatus };

    if (action === 'cancel_client' || action === 'cancel_clinic') {
      updateData.cancellationReason = cancellationReason;
      updateData.cancelledAt = new Date();
    }

    if (action === 'no_show') {
      updateData.noShowAt = new Date();
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        client: { select: { id: true, firstName: true, lastName: true } },
        user: { select: { id: true, name: true } },
        treatment: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({
      appointment: updated,
      message: `Status changed to ${targetStatus}`,
    });
  } catch (error) {
    console.error('Appointment status change error:', error);
    return NextResponse.json({ error: 'Failed to change appointment status' }, { status: 500 });
  }
}
