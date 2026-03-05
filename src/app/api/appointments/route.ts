import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/db';
import { startOfDay, endOfDay } from 'date-fns';

// ============================================
// GET /api/appointments — List appointments for a site + date
// Also returns staff, rooms, and treatments for calendar rendering
// ============================================
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get('siteId');
  const date = searchParams.get('date');
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');

  if (!siteId) {
    return NextResponse.json({ error: 'siteId is required' }, { status: 400 });
  }

  try {
    const where: Record<string, unknown> = { siteId };

    if (date) {
      const dayDate = new Date(date);
      where.startTime = { gte: startOfDay(dayDate), lte: endOfDay(dayDate) };
    }
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const [appointments, staff, rooms, treatments] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          client: {
            select: { id: true, firstName: true, lastName: true, email: true, phone: true },
          },
          user: {
            select: { id: true, name: true, colour: true, role: true },
          },
          treatment: {
            select: { id: true, name: true, category: true, durationMins: true, price: true, isPom: true },
          },
          room: {
            select: { id: true, name: true },
          },
        },
        orderBy: { startTime: 'asc' },
      }),
      prisma.user.findMany({
        where: { siteId, isActive: true, isBookable: true },
        select: { id: true, name: true, colour: true, role: true },
        orderBy: { name: 'asc' },
      }),
      prisma.room.findMany({
        where: { siteId, isActive: true },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      }),
      prisma.treatment.findMany({
        where: {
          isActive: true,
          siteOfferings: { some: { siteId } },
        },
        select: {
          id: true, name: true, category: true, durationMins: true,
          isPom: true, price: true, brand: true,
        },
        orderBy: [{ category: 'asc' }, { name: 'asc' }],
      }),
    ]);

    return NextResponse.json({ appointments, staff, rooms, treatments });
  } catch (error) {
    console.error('Appointment list error:', error);
    return NextResponse.json({ error: 'Failed to list appointments' }, { status: 500 });
  }
}

// ============================================
// POST /api/appointments — Create appointment
// ============================================
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { siteId, clientId, userId, treatmentId, startTime, endTime, roomId, notes, source } = body;

    if (!siteId || !clientId || !userId || !treatmentId || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields: siteId, clientId, userId, treatmentId, startTime, endTime' },
        { status: 400 }
      );
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: 'Invalid startTime or endTime' }, { status: 400 });
    }
    if (start >= end) {
      return NextResponse.json({ error: 'startTime must be before endTime' }, { status: 400 });
    }

    // Validate no overlapping appointments for this practitioner
    const overlapping = await prisma.appointment.findFirst({
      where: {
        userId,
        status: { notIn: ['CANCELLED_BY_CLIENT', 'CANCELLED_BY_CLINIC', 'NO_SHOW'] },
        AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
      },
    });

    if (overlapping) {
      return NextResponse.json(
        { error: 'Practitioner has an overlapping appointment at this time' },
        { status: 409 }
      );
    }

    // Validate room availability if roomId provided
    if (roomId) {
      const roomOverlap = await prisma.appointment.findFirst({
        where: {
          roomId,
          status: { notIn: ['CANCELLED_BY_CLIENT', 'CANCELLED_BY_CLINIC', 'NO_SHOW'] },
          AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
        },
      });
      if (roomOverlap) {
        return NextResponse.json({ error: 'Room is already booked at this time' }, { status: 409 });
      }
    }

    const appointment = await prisma.appointment.create({
      data: {
        siteId,
        clientId,
        userId,
        treatmentId,
        startTime: start,
        endTime: end,
        roomId: roomId || null,
        notes: notes || null,
        source: source || 'RECEPTION',
        status: 'BOOKED',
        createdById: token.id as string,
      },
      include: {
        client: { select: { id: true, firstName: true, lastName: true } },
        user: { select: { id: true, name: true } },
        treatment: { select: { id: true, name: true, durationMins: true } },
        room: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    console.error('Appointment creation error:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
