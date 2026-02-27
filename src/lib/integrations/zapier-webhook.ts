// PLG UK Hub — Zapier Webhook Integration
// Fires on any form submission that triggers an escalation condition.
// Zapier receives the payload and routes to:
//   1. HubSpot — flags contact as MEDICAL_EMERGENCY
//   2. WhatsApp HQ Emergency Group — Patient ID + complication type
//   3. Manchester Medical Director — emergency notification

export interface EscalationPayload {
  // Submission context
  submission_id: string;
  form_type: string;
  brand: string;
  site_id: string;
  timestamp: string;

  // Escalation details
  risk_level: string;
  escalation_reason: string;

  // Patient
  patient_id: string | null;

  // Practitioner
  practitioner_id: string;
  practitioner_name: string;
  practitioner_email: string;

  // Raw event data (key fields for WhatsApp message)
  event_severity?: string;
  event_type?: string;
  event_description?: string;
  complication_type?: string;
}

/**
 * Fires a non-blocking POST to the Zapier catch-hook webhook.
 * Failure is logged but never throws — form submission must succeed regardless.
 */
export async function triggerEscalationWebhook(
  payload: EscalationPayload
): Promise<void> {
  const webhookUrl = process.env.ZAPIER_ADVERSE_EVENT_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn(
      '[Zapier] ZAPIER_ADVERSE_EVENT_WEBHOOK_URL not set — escalation webhook skipped for submission:',
      payload.submission_id
    );
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(
        '[Zapier] Webhook responded with',
        response.status,
        'for submission:',
        payload.submission_id
      );
    } else {
      console.log(
        '[Zapier] Escalation webhook fired successfully for submission:',
        payload.submission_id,
        '| risk:',
        payload.risk_level
      );
    }
  } catch (error) {
    // Never block form submission on webhook failure
    console.error(
      '[Zapier] Webhook fetch failed for submission:',
      payload.submission_id,
      error
    );
  }
}
