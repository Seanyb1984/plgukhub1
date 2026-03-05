import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/db';

// ============================================
// GET /api/staff/schedule — Get staff 7-day schedule template
// ============================================
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const siteId = searchParams.get('siteId');

  if (!userId || !siteId) {
    return NextResponse.json({ error: 'userId and siteId are required' }, { status: 400 });
  }

  try {
    const schedules = await prisma.staffSchedule.findMany({
      where: { userId, siteId },
      orderBy: { dayOfWeek: 'asc' },
    });

    const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const fullSchedule = DAY_NAMES.map((name, i) => {
      const existing = schedules.find((s) => s.dayOfWeek === i);
      return {
        dayOfWeek: i,
        dayName: name,
        startTime: existing?.startTime || '09:00',
        endTime: existing?.endTime || '18:00',
        isAvailable: existing?.isAvailable ?? false,
        id: existing?.id || null,
      };
    });

    return NextResponse.json({ userId, siteId, schedules: fullSchedule });
  } catch (error) {
    console.error('Staff schedule fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
  }
}

// ============================================
// PUT /api/staff/schedule — Set/update full 7-day schedule
// ============================================
export async function PUT(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, siteId, schedules } = body;

    if (!userId || !siteId || !schedules || !Array.isArray(schedules)) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, siteId, schedules (array)' },
        { status: 400 }
      );
    }

    for (const entry of schedules) {
      if (entry.dayOfWeek === undefined || entry.dayOfWeek < 0 || entry.dayOfWeek > 6) {
        return NextResponse.json(
          { error: `Invalid dayOfWeek: ${entry.dayOfWeek}. Must be 0 (Mon) to 6 (Sun)` },
          { status: 400 }
        );
      }
      if (entry.isAvailable && (!entry.startTime || !entry.endTime)) {
        return NextResponse.json(
          { error: `startTime and endTime required when isAvailable is true (day ${entry.dayOfWeek})` },
          { status: 400 }
        );
      }
    }

    const result = await prisma.$transaction(
      schedules.map((entry: { dayOfWeek: number; startTime: string; endTime: string; isAvailable: boolean }) =>
        prisma.staffSchedule.upsert({
          where: {
            userId_siteId_dayOfWeek: {
              userId,
              siteId,
              dayOfWeek: entry.dayOfWeek,
            },
          },
          update: {
            startTime: entry.startTime || '09:00',
            endTime: entry.endTime || '18:00',
            isAvailable: entry.isAvailable ?? false,
          },
          create: {
            userId,
            siteId,
            dayOfWeek: entry.dayOfWeek,
            startTime: entry.startTime || '09:00',
            endTime: entry.endTime || '18:00',
            isAvailable: entry.isAvailable ?? false,
          },
        })
      )
    );

    return NextResponse.json({ message: 'Schedule updated', count: result.length });
  } catch (error) {
    console.error('Staff schedule update error:', error);
    return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 });
  }
}
