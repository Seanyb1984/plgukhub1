// PLG UK Hub - Treatment Journey API Routes
// Handles the watchdog cron job and knowledge base sync

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { runComplianceScan } from '@/lib/integrations/legal-watchdog';

// POST /api/cron/watchdog - Run the daily compliance scan
// Designed to be called by a cron job service (e.g., Vercel Cron)
export async function POST(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runComplianceScan(prisma);

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Watchdog cron failed:', error);
    return NextResponse.json(
      { error: 'Compliance scan failed', message: String(error) },
      { status: 500 }
    );
  }
}
