import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getWorkingStaff } from '@/lib/booking/availability';

// ============================================
// GET /api/staff/working — Get staff working at a site on a date
// ============================================
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get('siteId');
  const date = searchParams.get('date');

  if (!siteId || !date) {
    return NextResponse.json({ error: 'siteId and date are required' }, { status: 400 });
  }

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    const staff = await getWorkingStaff(siteId, dateObj);
    return NextResponse.json({ staff });
  } catch (error) {
    console.error('Working staff fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch working staff' }, { status: 500 });
  }
}
