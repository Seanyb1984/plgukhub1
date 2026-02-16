'use server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/auth-helpers';

export async function exportClientData(clientId: string) {
  await requireSession();

  // 1. Fetch the full patient history
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      submissions: {
        orderBy: { submittedAt: 'desc' },
        include: { site: true, practitioner: true }
      }
    }
  });

  if (!client) throw new Error("Client not found");

  // 2. Prepare the SAR data payload
  const sarData = {
    requestDate: new Date().toISOString(),
    patientInfo: {
      name: `${client.firstName} ${client.lastName}`,
      dob: client.dateOfBirth,
      email: client.email,
      phone: client.phone,
      address: `${client.addressLine1}, ${client.postcode}`
    },
    records: client.submissions.map(s => ({
      date: s.submittedAt,
      type: s.formType,
      site: s.site.name,
      practitioner: s.practitioner?.name,
      content: s.data
    }))
  };

  // 3. Log the export event for the CQC audit trail
  await prisma.auditLog.create({
    data: {
      submissionId: null,
      action: 'EXPORT',
      userId: (await requireSession()).user.id,
      newData: { action: 'GDPR_SAR_EXPORT', patientName: sarData.patientInfo.name },
      ipAddress: 'System Export Tool'
    }
  });

  // For now, we return a JSON string which can be downloaded. 
  // Next, we can connect this to the PDF engine for a professional report.
  return JSON.stringify(sarData, null, 2);
}
