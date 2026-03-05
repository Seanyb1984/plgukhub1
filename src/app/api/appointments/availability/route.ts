import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/db';
import { getAvailableSlotsForSite } from '@/lib/booking/availability';

// ============================================
// GET /api/appointments/availability — Calculate available slots
// ============================================
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get('siteId');
  const date = searchParams.get('date');
  const treatmentId = searchParams.get('treatmentId');
  const userId = searchParams.get('userId');

  if (!siteId || !date || !treatmentId) {
    return NextResponse.json(
      { error: 'Missing required params: siteId, date, treatmentId' },
      { status: 400 }
    );
  }

  try {
    const treatment = await prisma.treatment.findUnique({
      where: { id: treatmentId },
      select: { id: true, name: true, durationMins: true, bookingBuffer: true },
    });

    if (!treatment) {
      return NextResponse.json({ error: 'Treatment not found' }, { status: 404 });
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json({ error: 'Invalid date format. Use YYYY-MM-DD' }, { status: 400 });
    }

    const slots = await getAvailableSlotsForSite(
      siteId,
      dateObj,
      treatment.durationMins,
      treatment.bookingBuffer,
      userId || undefined
    );

    return NextResponse.json({
      date,
      treatment: {
        id: treatment.id,
        name: treatment.name,
        durationMins: treatment.durationMins,
        bufferMins: treatment.bookingBuffer,
      },
      slots,
    });
  } catch (error) {
    console.error('Availability calculation error:', error);
    return NextResponse.json({ error: 'Failed to calculate availability' }, { status: 500 });
  }
}
