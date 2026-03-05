import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/db';

// ============================================
// GET /api/appointments/[id] — Single appointment detail
// ============================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true, firstName: true, lastName: true, email: true, phone: true,
            dateOfBirth: true, gender: true, hasAllergies: true, allergyDetails: true,
            currentMedications: true, medicalNotes: true,
          },
        },
        user: {
          select: { id: true, name: true, email: true, colour: true, role: true },
        },
        treatment: {
          select: {
            id: true, name: true, slug: true, category: true, brand: true,
            durationMins: true, price: true, isPom: true, requiresConsent: true,
            requiresPatchTest: true, description: true,
          },
        },
        room: { select: { id: true, name: true } },
        site: { select: { id: true, name: true, brand: true, address: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error('Appointment detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 });
  }
}

// ============================================
// PATCH /api/appointments/[id] — Update appointment
// ============================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    if (['CANCELLED_BY_CLIENT', 'CANCELLED_BY_CLINIC', 'COMPLETED'].includes(existing.status)) {
      return NextResponse.json(
        { error: `Cannot modify appointment with status ${existing.status}` },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { userId, startTime, endTime, treatmentId, roomId, notes, status } = body;

    const newUserId = userId || existing.userId;
    const newStart = startTime ? new Date(startTime) : existing.startTime;
    const newEnd = endTime ? new Date(endTime) : existing.endTime;

    // If changing time or practitioner, validate no overlap
    if (userId || startTime || endTime) {
      const overlapping = await prisma.appointment.findFirst({
        where: {
          id: { not: id },
          userId: newUserId,
          status: { notIn: ['CANCELLED_BY_CLIENT', 'CANCELLED_BY_CLINIC', 'NO_SHOW'] },
          AND: [{ startTime: { lt: newEnd } }, { endTime: { gt: newStart } }],
        },
      });

      if (overlapping) {
        return NextResponse.json(
          { error: 'Practitioner has an overlapping appointment at the new time' },
          { status: 409 }
        );
      }
    }

    // If changing room, validate room availability
    const newRoomId = roomId !== undefined ? (roomId || null) : existing.roomId;
    if (roomId && (roomId !== existing.roomId || startTime || endTime)) {
      const roomOverlap = await prisma.appointment.findFirst({
        where: {
          id: { not: id },
          roomId: newRoomId,
          status: { notIn: ['CANCELLED_BY_CLIENT', 'CANCELLED_BY_CLINIC', 'NO_SHOW'] },
          AND: [{ startTime: { lt: newEnd } }, { endTime: { gt: newStart } }],
        },
      });

      if (roomOverlap) {
        return NextResponse.json({ error: 'Room is already booked at the new time' }, { status: 409 });
      }
    }

    const updateData: Record<string, unknown> = {};
    if (userId) updateData.userId = userId;
    if (startTime) updateData.startTime = newStart;
    if (endTime) updateData.endTime = newEnd;
    if (treatmentId) updateData.treatmentId = treatmentId;
    if (roomId !== undefined) updateData.roomId = roomId || null;
    if (notes !== undefined) updateData.notes = notes || null;
    if (status) updateData.status = status;

    const updated = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        client: { select: { id: true, firstName: true, lastName: true } },
        user: { select: { id: true, name: true } },
        treatment: { select: { id: true, name: true, durationMins: true } },
        room: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ appointment: updated });
  } catch (error) {
    console.error('Appointment update error:', error);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

// ============================================
// DELETE /api/appointments/[id] — Soft-delete (cancel by clinic)
// ============================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    if (['CANCELLED_BY_CLIENT', 'CANCELLED_BY_CLINIC'].includes(existing.status)) {
      return NextResponse.json({ error: 'Appointment is already cancelled' }, { status: 400 });
    }

    let cancellationReason = 'Cancelled by clinic';
    try {
      const body = await request.json();
      if (body.cancellationReason) cancellationReason = body.cancellationReason;
    } catch {
      // No body provided — use default reason
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED_BY_CLINIC',
        cancellationReason,
        cancelledAt: new Date(),
      },
    });

    return NextResponse.json({
      id: updated.id,
      status: updated.status,
      message: 'Appointment cancelled',
    });
  } catch (error) {
    console.error('Appointment delete error:', error);
    return NextResponse.json({ error: 'Failed to cancel appointment' }, { status: 500 });
  }
}
