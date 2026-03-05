import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// ============================================
// GET /api/treatments — List treatments (public, no auth required)
// ============================================
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get('brand');
  const category = searchParams.get('category');
  const siteId = searchParams.get('siteId');
  const isActive = searchParams.get('isActive');

  try {
    const where: Record<string, unknown> = {};

    if (brand) where.brand = brand;
    if (category) where.category = category;
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    } else {
      where.isActive = true;
    }

    if (siteId) {
      where.siteOfferings = { some: { siteId } };
    }

    const treatments = await prisma.treatment.findMany({
      where,
      include: {
        parent: {
          select: { id: true, name: true, slug: true },
        },
        children: {
          where: { isActive: true },
          select: {
            id: true, name: true, slug: true, durationMins: true,
            price: true, isOnlineBookable: true, isAddOn: true,
            addOnPrice: true, description: true,
          },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    return NextResponse.json({ treatments });
  } catch (error) {
    console.error('Treatment list error:', error);
    return NextResponse.json({ error: 'Failed to list treatments' }, { status: 500 });
  }
}
