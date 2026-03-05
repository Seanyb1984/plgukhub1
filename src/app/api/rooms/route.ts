import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/db';

// ============================================
// GET /api/rooms — List rooms for a site
// ============================================
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get('siteId');

  if (!siteId) {
    return NextResponse.json({ error: 'siteId is required' }, { status: 400 });
  }

  try {
    const rooms = await prisma.room.findMany({
      where: { siteId, isActive: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error('Room list error:', error);
    return NextResponse.json({ error: 'Failed to list rooms' }, { status: 500 });
  }
}

// ============================================
// POST /api/rooms — Create room
// ============================================
export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { siteId, name } = body;

    if (!siteId || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: siteId, name' },
        { status: 400 }
      );
    }

    const site = await prisma.site.findUnique({ where: { id: siteId } });
    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    const room = await prisma.room.create({
      data: { siteId, name, isActive: true },
    });

    return NextResponse.json({ room }, { status: 201 });
  } catch (error) {
    console.error('Room creation error:', error);
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}
