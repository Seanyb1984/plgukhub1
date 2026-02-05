import { prisma } from '@/lib/db';
import { getFormDefinition } from '@/lib/forms';
import { formatDate, formatDateTime } from '@/lib/utils';
import type { Brand } from '@prisma/client';

interface CSVExportFilters {
  brand?: Brand;
  siteId?: string;
  formType?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
}

interface CSVRow {
  [key: string]: string | number | boolean | null;
}

/**
 * Export submissions to CSV format
 */
export async function exportSubmissionsToCSV(
  filters: CSVExportFilters
): Promise<string> {
  const whereClause: Record<string, unknown> = {};

  if (filters.brand) {
    whereClause.brand = filters.brand;
  }
  if (filters.siteId) {
    whereClause.siteId = filters.siteId;
  }
  if (filters.formType) {
    whereClause.formType = filters.formType;
  }
  if (filters.status) {
    whereClause.status = filters.status;
  }
  if (filters.startDate || filters.endDate) {
    whereClause.createdAt = {};
    if (filters.startDate) {
      (whereClause.createdAt as Record<string, Date>).gte = filters.startDate;
    }
    if (filters.endDate) {
      (whereClause.createdAt as Record<string, Date>).lte = filters.endDate;
    }
  }

  const submissions = await prisma.formSubmission.findMany({
    where: whereClause,
    include: {
      client: true,
      site: true,
      practitioner: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (submissions.length === 0) {
    return 'No submissions found';
  }

  // Group by form type to get appropriate headers
  const formTypes = [...new Set(submissions.map((s) => s.formType))];

  // If single form type, use form-specific headers
  if (formTypes.length === 1) {
    return exportSingleFormType(submissions, formTypes[0]);
  }

  // Mixed form types - use generic headers
  return exportMixedFormTypes(submissions);
}

function exportSingleFormType(
  submissions: Array<{
    id: string;
    formType: string;
    brand: string;
    status: string;
    riskLevel: string;
    createdAt: Date;
    submittedAt: Date | null;
    signedAt: Date | null;
    data: unknown;
    client: { firstName: string; lastName: string; email: string | null } | null;
    site: { name: string };
    practitioner: { name: string } | null;
  }>,
  formType: string
): string {
  const form = getFormDefinition(formType);
  const rows: CSVRow[] = [];

  // Build headers from form definition
  const baseHeaders = [
    'Submission ID',
    'Brand',
    'Site',
    'Status',
    'Risk Level',
    'Client Name',
    'Client Email',
    'Practitioner',
    'Created At',
    'Submitted At',
    'Signed At',
  ];

  // Get all field IDs from form
  const fieldHeaders: string[] = [];
  if (form) {
    for (const section of form.sections) {
      for (const field of section.fields) {
        if (!['heading', 'paragraph', 'divider'].includes(field.type)) {
          fieldHeaders.push(field.label);
        }
      }
    }
  }

  const allHeaders = [...baseHeaders, ...fieldHeaders];

  // Build rows
  for (const submission of submissions) {
    const data = submission.data as Record<string, unknown>;
    const row: CSVRow = {
      'Submission ID': submission.id,
      Brand: submission.brand,
      Site: submission.site.name,
      Status: submission.status,
      'Risk Level': submission.riskLevel,
      'Client Name': submission.client
        ? `${submission.client.firstName} ${submission.client.lastName}`
        : '',
      'Client Email': submission.client?.email || '',
      Practitioner: submission.practitioner?.name || '',
      'Created At': formatDateTime(submission.createdAt),
      'Submitted At': submission.submittedAt
        ? formatDateTime(submission.submittedAt)
        : '',
      'Signed At': submission.signedAt
        ? formatDateTime(submission.signedAt)
        : '',
    };

    // Add form field values
    if (form) {
      for (const section of form.sections) {
        for (const field of section.fields) {
          if (!['heading', 'paragraph', 'divider'].includes(field.type)) {
            const value = data[field.id];
            row[field.label] = formatFieldValue(value, field.type);
          }
        }
      }
    }

    rows.push(row);
  }

  return convertToCSV(allHeaders, rows);
}

function exportMixedFormTypes(
  submissions: Array<{
    id: string;
    formType: string;
    brand: string;
    status: string;
    riskLevel: string;
    createdAt: Date;
    submittedAt: Date | null;
    signedAt: Date | null;
    data: unknown;
    client: { firstName: string; lastName: string; email: string | null } | null;
    site: { name: string };
    practitioner: { name: string } | null;
  }>
): string {
  const headers = [
    'Submission ID',
    'Form Type',
    'Brand',
    'Site',
    'Status',
    'Risk Level',
    'Client Name',
    'Client Email',
    'Practitioner',
    'Created At',
    'Submitted At',
    'Signed At',
    'Data (JSON)',
  ];

  const rows: CSVRow[] = submissions.map((submission) => ({
    'Submission ID': submission.id,
    'Form Type': submission.formType,
    Brand: submission.brand,
    Site: submission.site.name,
    Status: submission.status,
    'Risk Level': submission.riskLevel,
    'Client Name': submission.client
      ? `${submission.client.firstName} ${submission.client.lastName}`
      : '',
    'Client Email': submission.client?.email || '',
    Practitioner: submission.practitioner?.name || '',
    'Created At': formatDateTime(submission.createdAt),
    'Submitted At': submission.submittedAt
      ? formatDateTime(submission.submittedAt)
      : '',
    'Signed At': submission.signedAt ? formatDateTime(submission.signedAt) : '',
    'Data (JSON)': JSON.stringify(submission.data),
  }));

  return convertToCSV(headers, rows);
}

function formatFieldValue(
  value: unknown,
  fieldType: string
): string | number | boolean | null {
  if (value === undefined || value === null) {
    return '';
  }

  switch (fieldType) {
    case 'yesNo':
    case 'checkbox':
      return value === true ? 'Yes' : 'No';
    case 'yesNoNa':
      return value === 'yes' ? 'Yes' : value === 'no' ? 'No' : 'N/A';
    case 'checkboxGroup':
    case 'multiselect':
      return Array.isArray(value) ? value.join('; ') : String(value);
    case 'date':
      return formatDate(value as string);
    case 'medicationList':
    case 'allergyList':
      if (Array.isArray(value)) {
        return value
          .map((item) => {
            if (typeof item === 'object' && item !== null) {
              const obj = item as { name?: string; details?: string };
              return obj.details ? `${obj.name} (${obj.details})` : obj.name;
            }
            return String(item);
          })
          .join('; ');
      }
      return String(value);
    default:
      if (typeof value === 'object') {
        return JSON.stringify(value);
      }
      return String(value);
  }
}

function convertToCSV(headers: string[], rows: CSVRow[]): string {
  const escapeCSV = (value: unknown): string => {
    if (value === null || value === undefined) {
      return '';
    }
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(escapeCSV).join(',');
  const dataLines = rows.map((row) =>
    headers.map((header) => escapeCSV(row[header])).join(',')
  );

  return [headerLine, ...dataLines].join('\n');
}

/**
 * Export client data for SAR (Subject Access Request)
 */
export async function exportClientDataForSAR(
  clientEmail?: string,
  clientPhone?: string
): Promise<{ submissions: string; client: string }> {
  // Find client
  const client = await prisma.client.findFirst({
    where: {
      OR: [
        clientEmail ? { email: clientEmail } : {},
        clientPhone ? { phone: clientPhone } : {},
      ].filter((c) => Object.keys(c).length > 0),
    },
  });

  if (!client) {
    throw new Error('Client not found');
  }

  // Get all submissions for this client
  const submissions = await prisma.formSubmission.findMany({
    where: { clientId: client.id },
    include: {
      site: true,
      practitioner: true,
      amendments: true,
      auditLogs: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Export client data
  const clientHeaders = [
    'Field',
    'Value',
  ];

  const clientRows: CSVRow[] = [
    { Field: 'Client ID', Value: client.clientId },
    { Field: 'First Name', Value: client.firstName },
    { Field: 'Last Name', Value: client.lastName },
    { Field: 'Email', Value: client.email || '' },
    { Field: 'Phone', Value: client.phone || '' },
    { Field: 'Date of Birth', Value: client.dateOfBirth ? formatDate(client.dateOfBirth) : '' },
    { Field: 'Gender', Value: client.gender || '' },
    { Field: 'Address Line 1', Value: client.addressLine1 || '' },
    { Field: 'Address Line 2', Value: client.addressLine2 || '' },
    { Field: 'City', Value: client.city || '' },
    { Field: 'Postcode', Value: client.postcode || '' },
    { Field: 'Country', Value: client.country || '' },
    { Field: 'Emergency Contact Name', Value: client.emergencyName || '' },
    { Field: 'Emergency Contact Phone', Value: client.emergencyPhone || '' },
    { Field: 'Emergency Contact Relationship', Value: client.emergencyRelation || '' },
    { Field: 'Marketing Email Consent', Value: client.marketingEmail ? 'Yes' : 'No' },
    { Field: 'Marketing SMS Consent', Value: client.marketingSms ? 'Yes' : 'No' },
    { Field: 'Marketing Phone Consent', Value: client.marketingPhone ? 'Yes' : 'No' },
    { Field: 'Created At', Value: formatDateTime(client.createdAt) },
    { Field: 'Last Updated', Value: formatDateTime(client.updatedAt) },
  ];

  const clientCSV = convertToCSV(clientHeaders, clientRows);

  // Export all submissions with full data
  const submissionsCSV = exportMixedFormTypes(
    submissions.map((s) => ({
      ...s,
      client: {
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
      },
    }))
  );

  return {
    submissions: submissionsCSV,
    client: clientCSV,
  };
}
