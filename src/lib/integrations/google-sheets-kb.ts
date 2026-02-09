// PLG UK Hub - Google Sheets Knowledge Base Service
// Reads Aftercare Templates and Clinical Protocols from Google Sheets
// Allows Dr. Phil to update medical protocols in real-time without redeploying.
//
// Requires environment variables:
//   GOOGLE_SERVICE_ACCOUNT_EMAIL
//   GOOGLE_PRIVATE_KEY
//   GOOGLE_SHEETS_AFTERCARE_ID       (Spreadsheet ID for aftercare templates)
//   GOOGLE_SHEETS_PROTOCOLS_ID       (Spreadsheet ID for clinical protocols)

import { PrismaClient } from '@prisma/client';

interface SheetConfig {
  serviceAccountEmail: string;
  privateKey: string;
  aftercareSheetId: string;
  protocolsSheetId: string;
}

interface SheetRow {
  [key: string]: string;
}

interface AftercareTemplate {
  id: string;
  title: string;
  brand: string;
  treatmentType: string;
  subject: string;
  bodyHtml: string;
  bodyPlain: string;
  isActive: boolean;
}

interface ClinicalProtocol {
  id: string;
  title: string;
  brand: string;
  category: string;
  content: string;
  version: string;
  lastUpdated: string;
  updatedBy: string;
  isActive: boolean;
}

function getConfig(): SheetConfig {
  return {
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
    privateKey: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    aftercareSheetId: process.env.GOOGLE_SHEETS_AFTERCARE_ID || '',
    protocolsSheetId: process.env.GOOGLE_SHEETS_PROTOCOLS_ID || '',
  };
}

async function generateAccessToken(config: SheetConfig): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: config.serviceAccountEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  const base64url = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url');

  const signInput = `${base64url(header)}.${base64url(payload)}`;

  const crypto = await import('crypto');
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signInput);
  const signature = sign.sign(config.privateKey, 'base64url');

  const jwt = `${signInput}.${signature}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get Google access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function readSheetRange(
  token: string,
  spreadsheetId: string,
  range: string
): Promise<string[][]> {
  const encodedRange = encodeURIComponent(range);
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to read sheet: ${response.statusText}`);
  }

  const data = await response.json();
  return data.values || [];
}

function parseSheetRows(values: string[][]): SheetRow[] {
  if (values.length < 2) return [];
  const headers = values[0].map((h) => h.trim().toLowerCase().replace(/\s+/g, '_'));
  return values.slice(1).map((row) => {
    const obj: SheetRow = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] || '';
    });
    return obj;
  });
}

// ============================================
// PUBLIC API
// ============================================

/**
 * Fetch aftercare templates from Google Sheets.
 * Expected columns: ID, Title, Brand, Treatment Type, Subject, Body HTML, Body Plain, Active
 */
export async function fetchAftercareTemplates(): Promise<AftercareTemplate[]> {
  const config = getConfig();
  if (!config.serviceAccountEmail || !config.aftercareSheetId) {
    console.warn('Google Sheets not configured for aftercare templates.');
    return [];
  }

  const token = await generateAccessToken(config);
  const values = await readSheetRange(token, config.aftercareSheetId, 'Aftercare!A:H');
  const rows = parseSheetRows(values);

  return rows
    .filter((row) => row.active?.toLowerCase() !== 'false')
    .map((row) => ({
      id: row.id || row.title?.toLowerCase().replace(/\s+/g, '_') || '',
      title: row.title || '',
      brand: row.brand || 'ALL',
      treatmentType: row.treatment_type || '',
      subject: row.subject || '',
      bodyHtml: row.body_html || '',
      bodyPlain: row.body_plain || '',
      isActive: row.active?.toLowerCase() !== 'false',
    }));
}

/**
 * Fetch clinical protocols from Google Sheets.
 * Expected columns: ID, Title, Brand, Category, Content, Version, Last Updated, Updated By, Active
 */
export async function fetchClinicalProtocols(): Promise<ClinicalProtocol[]> {
  const config = getConfig();
  if (!config.serviceAccountEmail || !config.protocolsSheetId) {
    console.warn('Google Sheets not configured for clinical protocols.');
    return [];
  }

  const token = await generateAccessToken(config);
  const values = await readSheetRange(token, config.protocolsSheetId, 'Protocols!A:I');
  const rows = parseSheetRows(values);

  return rows
    .filter((row) => row.active?.toLowerCase() !== 'false')
    .map((row) => ({
      id: row.id || row.title?.toLowerCase().replace(/\s+/g, '_') || '',
      title: row.title || '',
      brand: row.brand || 'ALL',
      category: row.category || '',
      content: row.content || '',
      version: row.version || '1.0',
      lastUpdated: row.last_updated || '',
      updatedBy: row.updated_by || '',
      isActive: row.active?.toLowerCase() !== 'false',
    }));
}

/**
 * Sync Google Sheets data into the local KnowledgeBaseEntry table.
 * Called on a schedule or manually from the admin panel.
 */
export async function syncKnowledgeBase(prisma: PrismaClient): Promise<{
  aftercareCount: number;
  protocolCount: number;
}> {
  const [aftercareTemplates, protocols] = await Promise.all([
    fetchAftercareTemplates().catch(() => [] as AftercareTemplate[]),
    fetchClinicalProtocols().catch(() => [] as ClinicalProtocol[]),
  ]);

  // Upsert aftercare templates
  for (const template of aftercareTemplates) {
    await prisma.knowledgeBaseEntry.upsert({
      where: { id: template.id || `aftercare_${template.title}` },
      create: {
        id: template.id || `aftercare_${template.title}`,
        category: 'aftercare_template',
        brand: template.brand === 'ALL' ? null : (template.brand as 'MENHANCEMENTS' | 'WAX_FOR_MEN' | 'WAX_FOR_WOMEN' | 'PLG_UK'),
        title: template.title,
        content: JSON.stringify({
          subject: template.subject,
          bodyHtml: template.bodyHtml,
          bodyPlain: template.bodyPlain,
          treatmentType: template.treatmentType,
        }),
        lastSyncedAt: new Date(),
        isActive: template.isActive,
      },
      update: {
        title: template.title,
        content: JSON.stringify({
          subject: template.subject,
          bodyHtml: template.bodyHtml,
          bodyPlain: template.bodyPlain,
          treatmentType: template.treatmentType,
        }),
        lastSyncedAt: new Date(),
        isActive: template.isActive,
      },
    });
  }

  // Upsert clinical protocols
  for (const protocol of protocols) {
    await prisma.knowledgeBaseEntry.upsert({
      where: { id: protocol.id || `protocol_${protocol.title}` },
      create: {
        id: protocol.id || `protocol_${protocol.title}`,
        category: 'clinical_protocol',
        brand: protocol.brand === 'ALL' ? null : (protocol.brand as 'MENHANCEMENTS' | 'WAX_FOR_MEN' | 'WAX_FOR_WOMEN' | 'PLG_UK'),
        title: protocol.title,
        content: protocol.content,
        version: protocol.version,
        lastSyncedAt: new Date(),
        isActive: protocol.isActive,
      },
      update: {
        title: protocol.title,
        content: protocol.content,
        version: protocol.version,
        lastSyncedAt: new Date(),
        isActive: protocol.isActive,
      },
    });
  }

  return {
    aftercareCount: aftercareTemplates.length,
    protocolCount: protocols.length,
  };
}

/**
 * Get a specific aftercare template by treatment type and brand.
 */
export async function getAftercareTemplate(
  prisma: PrismaClient,
  treatmentType: string,
  brand?: string
): Promise<{ subject: string; bodyHtml: string; bodyPlain: string } | null> {
  const entry = await prisma.knowledgeBaseEntry.findFirst({
    where: {
      category: 'aftercare_template',
      isActive: true,
      OR: [
        { brand: brand as 'MENHANCEMENTS' | 'WAX_FOR_MEN' | 'WAX_FOR_WOMEN' | 'PLG_UK' | undefined },
        { brand: null },
      ],
    },
    orderBy: { updatedAt: 'desc' },
  });

  if (!entry) return null;

  try {
    const parsed = JSON.parse(entry.content);
    return {
      subject: parsed.subject || '',
      bodyHtml: parsed.bodyHtml || '',
      bodyPlain: parsed.bodyPlain || '',
    };
  } catch {
    return null;
  }
}
