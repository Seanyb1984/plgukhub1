// PLG UK Hub - Knowledge Base Sync API Route
// POST /api/cron/sync-kb - Sync Google Sheets knowledge base

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { syncKnowledgeBase } from '@/lib/integrations/google-sheets-kb';

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await syncKnowledgeBase(prisma);

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Knowledge base sync failed:', error);
    return NextResponse.json(
      { error: 'Sync failed', message: String(error) },
      { status: 500 }
    );
  }
}
