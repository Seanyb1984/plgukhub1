// PLG UK Hub - Client Search API Route
// GET /api/clients/search?q=query&siteId=optional

import { NextResponse } from 'next/server';
import { searchClientsAction } from '@/lib/actions/treatment-journey';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const siteId = searchParams.get('siteId') || undefined;

  if (query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const results = await searchClientsAction(query, siteId);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Client search failed:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
