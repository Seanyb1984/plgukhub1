// PLG UK Hub - Gmail API Integration for Aftercare Emails
// Sends automated aftercare emails after treatment close-out.
//
// Requires environment variables:
//   GOOGLE_SERVICE_ACCOUNT_EMAIL
//   GOOGLE_PRIVATE_KEY
//   GMAIL_SENDER_EMAIL         (The email address to send from)
//   GMAIL_SENDER_NAME          (Display name for sent emails)

interface GmailConfig {
  serviceAccountEmail: string;
  privateKey: string;
  senderEmail: string;
  senderName: string;
}

function getConfig(): GmailConfig {
  return {
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
    privateKey: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    senderEmail: process.env.GMAIL_SENDER_EMAIL || '',
    senderName: process.env.GMAIL_SENDER_NAME || 'PLG UK Hub',
  };
}

async function generateAccessToken(config: GmailConfig): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: config.serviceAccountEmail,
    sub: config.senderEmail, // Impersonate the sender
    scope: 'https://www.googleapis.com/auth/gmail.send',
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
    throw new Error(`Failed to get Gmail access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

// ============================================
// PUBLIC API
// ============================================

export interface AftercareEmailData {
  recipientEmail: string;
  recipientName: string;
  subject: string;
  bodyHtml: string;
  bodyPlain: string;
  brandName: string;
}

/**
 * Send an aftercare email via Gmail API.
 */
export async function sendAftercareEmail(data: AftercareEmailData): Promise<{ messageId: string; sent: boolean }> {
  const config = getConfig();
  if (!config.serviceAccountEmail || !config.privateKey || !config.senderEmail) {
    console.warn('Gmail not configured. Skipping aftercare email.');
    return { messageId: '', sent: false };
  }

  const token = await generateAccessToken(config);

  // Build MIME message
  const boundary = `plgukhub_${Date.now()}`;
  const mimeMessage = [
    `From: ${config.senderName} <${config.senderEmail}>`,
    `To: ${data.recipientName} <${data.recipientEmail}>`,
    `Subject: ${data.subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    data.bodyPlain,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    '',
    data.bodyHtml,
    '',
    `--${boundary}--`,
  ].join('\r\n');

  const encodedMessage = Buffer.from(mimeMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: encodedMessage }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gmail send failed: ${response.statusText} - ${errorText}`);
  }

  const result = await response.json();
  return { messageId: result.id, sent: true };
}

/**
 * Build aftercare email content from template and treatment data.
 */
export function buildAftercareEmail(
  template: { subject: string; bodyHtml: string; bodyPlain: string } | null,
  treatmentData: {
    clientName: string;
    treatmentType: string;
    treatmentDate: string;
    practitionerName: string;
    brandName: string;
    followUpDate?: string;
  }
): { subject: string; bodyHtml: string; bodyPlain: string } {
  // If no template, use default
  if (!template) {
    template = {
      subject: `Aftercare Instructions - ${treatmentData.treatmentType}`,
      bodyHtml: DEFAULT_AFTERCARE_HTML,
      bodyPlain: DEFAULT_AFTERCARE_PLAIN,
    };
  }

  // Replace placeholders
  const replacements: Record<string, string> = {
    '{{clientName}}': treatmentData.clientName,
    '{{treatmentType}}': treatmentData.treatmentType,
    '{{treatmentDate}}': treatmentData.treatmentDate,
    '{{practitionerName}}': treatmentData.practitionerName,
    '{{brandName}}': treatmentData.brandName,
    '{{followUpDate}}': treatmentData.followUpDate || 'To be scheduled',
  };

  let subject = template.subject;
  let bodyHtml = template.bodyHtml;
  let bodyPlain = template.bodyPlain;

  for (const [key, value] of Object.entries(replacements)) {
    subject = subject.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
    bodyHtml = bodyHtml.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
    bodyPlain = bodyPlain.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
  }

  return { subject, bodyHtml, bodyPlain };
}

// ============================================
// DEFAULT TEMPLATES
// ============================================

const DEFAULT_AFTERCARE_HTML = `
<!DOCTYPE html>
<html>
<head><style>
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
  .header { background: #1a1a2e; color: white; padding: 20px; text-align: center; }
  .content { padding: 20px; }
  .footer { background: #f4f4f4; padding: 15px; font-size: 12px; color: #666; text-align: center; }
  h1 { margin: 0; font-size: 20px; }
  h2 { color: #1a1a2e; }
  .important { background: #fff3cd; border: 1px solid #ffc107; padding: 12px; border-radius: 4px; margin: 15px 0; }
</style></head>
<body>
  <div class="header">
    <h1>{{brandName}}</h1>
    <p>Aftercare Instructions</p>
  </div>
  <div class="content">
    <p>Dear {{clientName}},</p>
    <p>Thank you for your visit on <strong>{{treatmentDate}}</strong>. Below are your aftercare instructions following your <strong>{{treatmentType}}</strong> treatment.</p>

    <h2>General Aftercare Guidelines</h2>
    <ul>
      <li>Avoid touching or rubbing the treated area for 24 hours.</li>
      <li>Do not apply makeup to the treated area for at least 12 hours.</li>
      <li>Avoid strenuous exercise for 24-48 hours.</li>
      <li>Stay hydrated and avoid excessive alcohol consumption.</li>
      <li>Avoid direct sun exposure and use SPF 30+ on the treated area.</li>
      <li>Do not have any facial treatments for at least 2 weeks.</li>
    </ul>

    <div class="important">
      <strong>Important:</strong> If you experience any unusual swelling, pain, or discolouration, please contact us immediately.
    </div>

    <h2>Follow-up</h2>
    <p>Your follow-up appointment: <strong>{{followUpDate}}</strong></p>
    <p>Your practitioner: <strong>{{practitionerName}}</strong></p>

    <p>If you have any concerns, please don't hesitate to contact us.</p>
    <p>Best regards,<br>{{brandName}} Team</p>
  </div>
  <div class="footer">
    <p>This email contains medical aftercare information. Please retain for your records.</p>
    <p>&copy; {{brandName}} - PLG UK Hub</p>
  </div>
</body>
</html>
`;

const DEFAULT_AFTERCARE_PLAIN = `
{{brandName}} - Aftercare Instructions

Dear {{clientName}},

Thank you for your visit on {{treatmentDate}}. Below are your aftercare instructions following your {{treatmentType}} treatment.

General Aftercare Guidelines:
- Avoid touching or rubbing the treated area for 24 hours.
- Do not apply makeup to the treated area for at least 12 hours.
- Avoid strenuous exercise for 24-48 hours.
- Stay hydrated and avoid excessive alcohol consumption.
- Avoid direct sun exposure and use SPF 30+ on the treated area.
- Do not have any facial treatments for at least 2 weeks.

IMPORTANT: If you experience any unusual swelling, pain, or discolouration, please contact us immediately.

Follow-up appointment: {{followUpDate}}
Your practitioner: {{practitionerName}}

If you have any concerns, please don't hesitate to contact us.

Best regards,
{{brandName}} Team
`;
