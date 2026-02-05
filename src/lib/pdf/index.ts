import PDFDocument from 'pdfkit';
import { getFormDefinition } from '@/lib/forms';
import { formatDate, formatDateTime, formatBrand } from '@/lib/utils';
import type { FormSubmission, Client, Site, User } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

type SubmissionWithRelations = FormSubmission & {
  client: Client | null;
  site: Site;
  practitioner: User | null;
};

export async function generateSubmissionPDF(
  submission: SubmissionWithRelations
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: `${submission.formType} - ${submission.id}`,
        Author: 'PLG UK Hub',
        Subject: 'Form Submission',
      },
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const form = getFormDefinition(submission.formType);

    // Header
    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text(form?.name || submission.formType, { align: 'center' });

    doc.moveDown(0.5);

    // Brand and site
    doc
      .fontSize(12)
      .font('Helvetica')
      .fillColor('#666666')
      .text(`${formatBrand(submission.brand)} - ${submission.site.name}`, {
        align: 'center',
      });

    doc.moveDown(1);

    // Submission details box
    doc.fillColor('#000000');
    const startY = doc.y;
    doc
      .rect(50, startY, 495, 80)
      .fillAndStroke('#f8f9fa', '#dee2e6');

    doc.fillColor('#000000');
    doc.fontSize(10);

    // Left column
    doc.text(`Submission ID: ${submission.id}`, 60, startY + 10);
    doc.text(`Status: ${submission.status}`, 60, startY + 25);
    doc.text(`Created: ${formatDateTime(submission.createdAt)}`, 60, startY + 40);
    if (submission.submittedAt) {
      doc.text(`Submitted: ${formatDateTime(submission.submittedAt)}`, 60, startY + 55);
    }

    // Right column
    if (submission.client) {
      doc.text(
        `Client: ${submission.client.firstName} ${submission.client.lastName}`,
        300,
        startY + 10
      );
    }
    if (submission.practitioner) {
      doc.text(`Practitioner: ${submission.practitioner.name}`, 300, startY + 25);
    }
    if (submission.signedAt) {
      doc.text(`Signed: ${formatDateTime(submission.signedAt)}`, 300, startY + 40);
      if (submission.signedByName) {
        doc.text(`Signed by: ${submission.signedByName}`, 300, startY + 55);
      }
    }

    doc.y = startY + 95;

    // Risk flags
    if (submission.riskFlags.length > 0) {
      doc.moveDown(0.5);
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .fillColor('#dc3545')
        .text('Risk Flags:', { underline: true });

      doc.font('Helvetica').fontSize(10);
      for (const flag of submission.riskFlags) {
        doc.text(`• ${flag}`);
      }
      doc.fillColor('#000000');
      doc.moveDown(0.5);
    }

    // Form sections and data
    if (form) {
      const data = submission.data as Record<string, unknown>;

      for (const section of form.sections) {
        doc.moveDown(1);

        // Section header
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text(section.title);

        if (section.description) {
          doc
            .fontSize(9)
            .font('Helvetica-Oblique')
            .fillColor('#666666')
            .text(section.description);
          doc.fillColor('#000000');
        }

        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica');

        // Section fields
        for (const field of section.fields) {
          // Skip display-only fields
          if (['heading', 'paragraph', 'divider'].includes(field.type)) {
            continue;
          }

          const value = data[field.id];
          if (value === undefined || value === null || value === '') {
            continue;
          }

          let displayValue = '';

          if (field.type === 'yesNo') {
            displayValue = value === true ? 'Yes' : 'No';
          } else if (field.type === 'yesNoNa') {
            displayValue = value === 'yes' ? 'Yes' : value === 'no' ? 'No' : 'N/A';
          } else if (field.type === 'checkbox') {
            displayValue = value === true ? 'Yes' : 'No';
          } else if (field.type === 'checkboxGroup' && Array.isArray(value)) {
            const selectedLabels = value.map((v) => {
              const option = field.options?.find((o) => o.value === v);
              return option?.label || v;
            });
            displayValue = selectedLabels.join(', ');
          } else if (field.type === 'select' || field.type === 'radio') {
            const option = field.options?.find((o) => o.value === value);
            displayValue = option?.label || String(value);
          } else if (field.type === 'date') {
            displayValue = formatDate(value as string);
          } else if (field.type === 'rating' || field.type === 'nps') {
            displayValue = `${value}`;
          } else if (Array.isArray(value)) {
            displayValue = JSON.stringify(value, null, 2);
          } else if (typeof value === 'object') {
            displayValue = JSON.stringify(value, null, 2);
          } else {
            displayValue = String(value);
          }

          // Field label and value
          doc.font('Helvetica-Bold').text(`${field.label}:`, { continued: false });
          doc.font('Helvetica').text(displayValue);
          doc.moveDown(0.3);

          // Page break check
          if (doc.y > 700) {
            doc.addPage();
          }
        }
      }
    } else {
      // Raw data output for unknown form types
      doc.moveDown(1);
      doc.fontSize(12).font('Helvetica-Bold').text('Form Data:');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');
      doc.text(JSON.stringify(submission.data, null, 2));
    }

    // Signature
    if (submission.signatureData) {
      if (doc.y > 550) {
        doc.addPage();
      }

      doc.moveDown(2);
      doc.fontSize(12).font('Helvetica-Bold').text('Signature:');
      doc.moveDown(0.5);

      try {
        // Add signature image
        const signatureBuffer = Buffer.from(
          submission.signatureData.replace(/^data:image\/\w+;base64,/, ''),
          'base64'
        );
        doc.image(signatureBuffer, {
          width: 200,
          height: 80,
        });
      } catch {
        doc.text('[Signature on file]');
      }

      doc.moveDown(0.5);
      if (submission.signedByName) {
        doc.fontSize(10).text(`Name: ${submission.signedByName}`);
      }
      if (submission.signedAt) {
        doc.text(`Date: ${formatDateTime(submission.signedAt)}`);
      }
    }

    // Footer on each page
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);

      doc
        .fontSize(8)
        .fillColor('#999999')
        .text(
          `Generated by PLG UK Hub | Page ${i + 1} of ${pages.count} | ${formatDateTime(new Date())}`,
          50,
          780,
          { align: 'center', width: 495 }
        );
    }

    doc.end();
  });
}

export async function saveSubmissionPDF(
  submission: SubmissionWithRelations
): Promise<string> {
  const pdfBuffer = await generateSubmissionPDF(submission);

  const pdfDir = process.env.PDF_STORAGE_PATH || './pdfs';
  const fileName = `${submission.formType}_${submission.id}_${Date.now()}.pdf`;
  const filePath = path.join(pdfDir, fileName);

  // Ensure directory exists
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
  }

  fs.writeFileSync(filePath, pdfBuffer);

  return filePath;
}
