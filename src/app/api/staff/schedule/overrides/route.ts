import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/db';
import { startOfDay } from 'date-fns';

// ============================================
// GET /api/staff/schedule/overrides — List overrides for a user
// ============================================
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    const where: Record<string, unknown> = { userId };

    if (from || to) {
      const dateFilter: Record<string, Date> = {};
      if (from) dateFilter.gte = startOfDay(new Date(from));
      if (to) dateFilter.lte = startOfDay(new Date(to));
      where.date = dateFilter;
    }

    const overrides = await prisma.scheduleOverride.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({ overrides });
  } catch (error) {
    console.error('Schedule overrides fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch overrides' }, { status: 500 });
  }
}

// ============================================
// POST /api/staff/schedule/overrides — Create override
// ============================================
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, date, isAvailable, startTime, endTime, reason } = body;

    if (!userId || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, date' },
        { status: 400 }
      );
    }

    if (isAvailable && (!startTime || !endTime)) {
      return NextResponse.json(
        { error: 'startTime and endTime are required when isAvailable is true' },
        { status: 400 }
      );
    }

    const dateObj = startOfDay(new Date(date));
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    const override = await prisma.scheduleOverride.upsert({
      where: {
        userId_date: { userId, date: dateObj },
      },
      update: {
        isAvailable: isAvailable ?? false,
        startTime: startTime || null,
        endTime: endTime || null,
        reason: reason || null,
      },
      create: {
        userId,
        date: dateObj,
        isAvailable: isAvailable ?? false,
        startTime: startTime || null,
        endTime: endTime || null,
        reason: reason || null,
      },
    });

    return NextResponse.json({ override }, { status: 201 });
  } catch (error) {
    console.error('Schedule override creation error:', error);
    return NextResponse.json({ error: 'Failed to create override' }, { status: 500 });
  }
}

// ============================================
// DELETE /api/staff/schedule/overrides — Delete override
// ============================================
export async function DELETE(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  try {
    const existing = await prisma.scheduleOverride.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Override not found' }, { status: 404 });
    }

    await prisma.scheduleOverride.delete({ where: { id } });

    return NextResponse.json({ message: 'Override deleted' });
  } catch (error) {
    console.error('Schedule override delete error:', error);
    return NextResponse.json({ error: 'Failed to delete override' }, { status: 500 });
  }
}
