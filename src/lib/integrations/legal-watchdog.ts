// PLG UK Hub - Legal Watchdog Service
// Scans for MHRA, CQC, and GMC regulatory updates related to
// "Aesthetics" and "Prescribing" once per day.
// Displays a "Compliance Status" badge on the Admin Dashboard.
//
// Requires environment variable:
//   GOOGLE_CUSTOM_SEARCH_API_KEY
//   GOOGLE_CUSTOM_SEARCH_ENGINE_ID

import { PrismaClient } from '@prisma/client';

interface WatchdogConfig {
  apiKey: string;
  searchEngineId: string;
}

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  source: string;
}

function getConfig(): WatchdogConfig {
  return {
    apiKey: process.env.GOOGLE_CUSTOM_SEARCH_API_KEY || '',
    searchEngineId: process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID || '',
  };
}

// ============================================
// SEARCH QUERIES
// ============================================

const WATCHDOG_QUERIES = [
  {
    source: 'CQC',
    queries: [
      'CQC aesthetics regulation update',
      'CQC inspection guidance cosmetic procedures',
      'CQC registered manager aesthetics',
    ],
  },
  {
    source: 'MHRA',
    queries: [
      'MHRA dermal filler safety alert',
      'MHRA botulinum toxin regulation',
      'MHRA cosmetic device safety notice',
      'MHRA prescription only medicine aesthetics',
    ],
  },
  {
    source: 'GMC',
    queries: [
      'GMC prescribing guidance aesthetics',
      'GMC remote prescribing cosmetic',
      'GMC good medical practice cosmetic procedures',
    ],
  },
];

// ============================================
// GOOGLE CUSTOM SEARCH
// ============================================

async function searchGoogle(
  config: WatchdogConfig,
  query: string,
  dateRestrict: string = 'd1' // Last 1 day
): Promise<SearchResult[]> {
  const params = new URLSearchParams({
    key: config.apiKey,
    cx: config.searchEngineId,
    q: query,
    dateRestrict,
    num: '5',
    safe: 'active',
  });

  const response = await fetch(`https://www.googleapis.com/customsearch/v1?${params}`);

  if (!response.ok) {
    if (response.status === 429) {
      console.warn('Google Search API rate limited. Will retry later.');
      return [];
    }
    throw new Error(`Google Search failed: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.items) return [];

  return data.items.map((item: { title: string; link: string; snippet: string }) => ({
    title: item.title,
    link: item.link,
    snippet: item.snippet,
    source: '', // Will be set by caller
  }));
}

// ============================================
// PUBLIC API
// ============================================

/**
 * Run the daily compliance scan.
 * Searches for regulatory updates and stores new alerts in the database.
 */
export async function runComplianceScan(prisma: PrismaClient): Promise<{
  newAlerts: number;
  totalScanned: number;
}> {
  const config = getConfig();
  if (!config.apiKey || !config.searchEngineId) {
    console.warn('Legal Watchdog not configured (missing API key or search engine ID).');
    return { newAlerts: 0, totalScanned: 0 };
  }

  let newAlerts = 0;
  let totalScanned = 0;

  for (const sourceConfig of WATCHDOG_QUERIES) {
    for (const query of sourceConfig.queries) {
      try {
        const results = await searchGoogle(config, query);
        totalScanned += results.length;

        for (const result of results) {
          // Check if we've already seen this URL
          const existing = await prisma.complianceAlert.findFirst({
            where: { url: result.link },
          });

          if (!existing) {
            // Determine severity based on keywords
            const severity = determineSeverity(result.title, result.snippet);
            const relevance = determineRelevance(result.title, result.snippet);

            await prisma.complianceAlert.create({
              data: {
                source: sourceConfig.source,
                title: result.title,
                summary: result.snippet,
                url: result.link,
                relevance,
                severity,
                scannedAt: new Date(),
              },
            });

            newAlerts++;
          }
        }

        // Rate limiting: pause between queries
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Watchdog query failed for "${query}":`, error);
      }
    }
  }

  return { newAlerts, totalScanned };
}

/**
 * Get the current compliance status for the dashboard badge.
 */
export async function getComplianceStatus(prisma: PrismaClient): Promise<{
  status: 'GREEN' | 'AMBER' | 'RED';
  unreadCount: number;
  actionRequiredCount: number;
  lastScanAt: Date | null;
  recentAlerts: Array<{
    id: string;
    source: string;
    title: string;
    severity: string;
    scannedAt: Date;
  }>;
}> {
  const [unreadCount, actionRequiredCount, lastAlert, recentAlerts] = await Promise.all([
    prisma.complianceAlert.count({
      where: { isRead: false, isDismissed: false },
    }),
    prisma.complianceAlert.count({
      where: { severity: 'ACTION_REQUIRED', isDismissed: false },
    }),
    prisma.complianceAlert.findFirst({
      orderBy: { scannedAt: 'desc' },
      select: { scannedAt: true },
    }),
    prisma.complianceAlert.findMany({
      where: { isDismissed: false },
      orderBy: { scannedAt: 'desc' },
      take: 10,
      select: {
        id: true,
        source: true,
        title: true,
        severity: true,
        scannedAt: true,
      },
    }),
  ]);

  // Determine status
  let status: 'GREEN' | 'AMBER' | 'RED' = 'GREEN';
  if (actionRequiredCount > 0) {
    status = 'RED';
  } else if (unreadCount > 5) {
    status = 'AMBER';
  }

  return {
    status,
    unreadCount,
    actionRequiredCount,
    lastScanAt: lastAlert?.scannedAt ?? null,
    recentAlerts,
  };
}

/**
 * Mark an alert as read.
 */
export async function markAlertAsRead(prisma: PrismaClient, alertId: string): Promise<void> {
  await prisma.complianceAlert.update({
    where: { id: alertId },
    data: { isRead: true },
  });
}

/**
 * Dismiss an alert.
 */
export async function dismissAlert(prisma: PrismaClient, alertId: string): Promise<void> {
  await prisma.complianceAlert.update({
    where: { id: alertId },
    data: { isDismissed: true },
  });
}

// ============================================
// INTERNAL HELPERS
// ============================================

function determineSeverity(title: string, snippet: string): string {
  const text = `${title} ${snippet}`.toLowerCase();

  // Action required keywords
  if (
    text.includes('safety alert') ||
    text.includes('recall') ||
    text.includes('enforcement') ||
    text.includes('urgent') ||
    text.includes('suspension') ||
    text.includes('prohibition') ||
    text.includes('ban')
  ) {
    return 'ACTION_REQUIRED';
  }

  // Warning keywords
  if (
    text.includes('warning') ||
    text.includes('caution') ||
    text.includes('investigation') ||
    text.includes('review') ||
    text.includes('concern') ||
    text.includes('adverse')
  ) {
    return 'WARNING';
  }

  return 'INFO';
}

function determineRelevance(title: string, snippet: string): string {
  const text = `${title} ${snippet}`.toLowerCase();
  const reasons: string[] = [];

  if (text.includes('aesthetics') || text.includes('aesthetic')) reasons.push('Aesthetics');
  if (text.includes('botox') || text.includes('botulinum')) reasons.push('Botulinum toxin');
  if (text.includes('filler') || text.includes('dermal filler')) reasons.push('Dermal fillers');
  if (text.includes('prescrib')) reasons.push('Prescribing');
  if (text.includes('cqc')) reasons.push('CQC regulation');
  if (text.includes('mhra')) reasons.push('MHRA safety');
  if (text.includes('gmc')) reasons.push('GMC guidance');
  if (text.includes('cosmetic')) reasons.push('Cosmetic procedures');

  return reasons.length > 0 ? `Relevant to: ${reasons.join(', ')}` : 'General regulatory update';
}
