// PLG UK Hub - Treatment Journey Server Actions
// Server-side actions for the 4-phase treatment journey

'use server';

import { prisma } from '@/lib/db';
import { createClientFolder, uploadBeforePhoto, uploadAfterPhoto } from '@/lib/integrations/google-drive';
import { sendAftercareEmail, buildAftercareEmail } from '@/lib/integrations/gmail-aftercare';
import { getAftercareTemplate } from '@/lib/integrations/google-sheets-kb';

// ============================================
// CLIENT SEARCH (Phase 0)
// ============================================

export async function searchClientsAction(
  query: string,
  siteId?: string
): Promise<Array<{ id: string; firstName: string; lastName: string; email?: string; phone?: string; status: string }>> {
  if (!query || query.length < 2) return [];

  const clients = await prisma.client.findMany({
    where: {
      OR: [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { phone: { contains: query } },
      ],
      ...(siteId ? { siteId } : {}),
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      status: true,
    },
    take: 20,
    orderBy: { lastName: 'asc' },
  });

  return clients.map((c) => ({
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email ?? undefined,
    phone: c.phone ?? undefined,
    status: c.status,
  }));
}

// ============================================
// QUICK ADD CLIENT (Phase 0)
// ============================================

export async function quickAddClientAction(data: {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  brand: string;
  siteId: string;
}): Promise<{ id: string; clientId: string }> {
  const client = await prisma.client.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email || null,
      phone: data.phone || null,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      status: 'PROSPECT',
      brands: [data.brand as 'MENHANCEMENTS' | 'WAX_FOR_MEN' | 'WAX_FOR_WOMEN' | 'PLG_UK'],
      siteId: data.siteId,
    },
    select: { id: true, clientId: true },
  });

  // Auto-create Google Drive folder (non-blocking)
  createClientFolder(
    client.clientId,
    `${data.firstName} ${data.lastName}`,
    data.brand
  ).then((result) => {
    if (result.folderId) {
      prisma.client.update({
        where: { id: client.id },
        data: { googleDriveFolderId: result.folderId },
      }).catch(console.error);
    }
  }).catch(console.error);

  return client;
}

// ============================================
// FETCH PRESCRIBERS (Phase 1)
// ============================================

export async function fetchPrescribersAction(): Promise<
  Array<{ id: string; name: string; gmcNumber: string; prescriberType: string }>
> {
  const prescribers = await prisma.prescriber.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      gmcNumber: true,
      prescriberType: true,
    },
    orderBy: { name: 'asc' },
  });

  return prescribers;
}

// ============================================
// SAVE TREATMENT JOURNEY DRAFT
// ============================================

export async function saveTreatmentJourneyDraftAction(
  journeyData: Record<string, unknown>,
  currentPhase: number
): Promise<{ id: string }> {
  const brand = journeyData.brand as string;
  const siteId = journeyData.siteId as string;
  const practitionerId = journeyData.practitionerId as string;
  const client = journeyData.client as { id: string } | null;

  if (!client?.id || client.id === 'new') {
    throw new Error('Client must be saved before creating a draft journey.');
  }

  const phaseMap: Record<number, string> = {
    0: 'IDENTIFICATION',
    1: 'POM_TRIAGE',
    2: 'LEGAL_CONSENT',
    3: 'CLINICAL_RECORD',
    4: 'CLOSE_OUT',
  };

  const journey = await prisma.treatmentJourney.create({
    data: {
      brand: brand as 'MENHANCEMENTS' | 'WAX_FOR_MEN' | 'WAX_FOR_WOMEN' | 'PLG_UK',
      siteId,
      clientId: client.id,
      practitionerId,
      currentPhase: (phaseMap[currentPhase] ?? 'IDENTIFICATION') as 'IDENTIFICATION' | 'POM_TRIAGE' | 'LEGAL_CONSENT' | 'CLINICAL_RECORD' | 'CLOSE_OUT',
      status: 'IN_PROGRESS',
    },
    select: { id: true },
  });

  return journey;
}

// ============================================
// COMPLETE TREATMENT JOURNEY
// ============================================

export async function completeTreatmentJourneyAction(
  journeyData: Record<string, unknown>
): Promise<{ id: string; journeyNumber: string }> {
  const brand = journeyData.brand as string;
  const siteId = journeyData.siteId as string;
  const practitionerId = journeyData.practitionerId as string;
  const isNewClient = journeyData.isNewClient as boolean;
  const selectedClient = journeyData.client as { id: string; firstName: string; lastName: string; email?: string } | null;
  const newClientData = journeyData.newClientData as { firstName: string; lastName: string; email?: string; phone?: string; dateOfBirth?: string } | null;
  const pomData = journeyData.pomData as { prescriberId: string; gmcNumber: string; faceToFaceDate: string; pomNotes?: string } | null;
  const screeningResponses = journeyData.screeningResponses as Record<string, boolean | string>;
  const signatureData = journeyData.signatureData as string | null;
  const signedByName = journeyData.signedByName as string;
  const clinicalData = journeyData.clinicalData as {
    treatmentType: string;
    treatmentArea: string[];
    productUsed: string;
    batchNumber: string;
    lotNumber?: string;
    expiryDate?: string;
    dosage?: string;
    clinicalNotes?: string;
  };
  const beforePhotos = (journeyData.beforePhotos as string[]) || [];
  const afterPhotos = (journeyData.afterPhotos as string[]) || [];
  const aftercareProvided = journeyData.aftercareProvided as boolean;
  const sendEmail = journeyData.sendAftercareEmail as boolean;
  const aftercareTemplateId = journeyData.aftercareTemplateId as string | undefined;
  const followUpDate = journeyData.followUpDate as string | undefined;
  const followUpNotes = journeyData.followUpNotes as string | undefined;

  // 1. Create or resolve client
  let clientId: string;
  let clientEmail: string | undefined;
  let clientName: string;

  if (isNewClient && newClientData) {
    const newClient = await quickAddClientAction({
      ...newClientData,
      brand,
      siteId,
    });
    clientId = newClient.id;
    clientEmail = newClientData.email;
    clientName = `${newClientData.firstName} ${newClientData.lastName}`;
  } else if (selectedClient) {
    clientId = selectedClient.id;
    clientEmail = selectedClient.email;
    clientName = `${selectedClient.firstName} ${selectedClient.lastName}`;
  } else {
    throw new Error('No client selected or created.');
  }

  // 2. Promote client to ACTIVE
  await prisma.client.update({
    where: { id: clientId },
    data: {
      status: 'ACTIVE',
      brands: {
        push: brand as 'MENHANCEMENTS' | 'WAX_FOR_MEN' | 'WAX_FOR_WOMEN' | 'PLG_UK',
      },
    },
  });

  // 3. Create Treatment Journey
  const journey = await prisma.treatmentJourney.create({
    data: {
      brand: brand as 'MENHANCEMENTS' | 'WAX_FOR_MEN' | 'WAX_FOR_WOMEN' | 'PLG_UK',
      siteId,
      clientId,
      practitionerId,
      currentPhase: 'CLOSE_OUT',
      status: 'COMPLETED',
      identificationCompletedAt: new Date(),

      // POM Triage (Phase 1)
      isPomTreatment: !!pomData,
      prescriberId: pomData?.prescriberId || null,
      gmcNumberVerified: pomData?.gmcNumber || null,
      faceToFaceDate: pomData?.faceToFaceDate ? new Date(pomData.faceToFaceDate) : null,
      pomTriageCompletedAt: pomData ? new Date() : null,
      pomNotes: pomData?.pomNotes || null,

      // Legal Consent (Phase 2)
      safetyScreeningData: screeningResponses,
      safetyScreeningPassed: true,
      signatureData: signatureData || null,
      signedByName: signedByName || null,
      signedAt: signatureData ? new Date() : null,
      consentCompletedAt: new Date(),

      // Clinical Record (Phase 3)
      treatmentType: clinicalData.treatmentType,
      treatmentArea: clinicalData.treatmentArea,
      productUsed: clinicalData.productUsed,
      batchNumber: clinicalData.batchNumber,
      lotNumber: clinicalData.lotNumber || null,
      expiryDate: clinicalData.expiryDate ? new Date(clinicalData.expiryDate) : null,
      dosage: clinicalData.dosage || null,
      clinicalNotes: clinicalData.clinicalNotes || null,
      clinicalRecordCompletedAt: new Date(),

      // Close-out (Phase 4)
      aftercareProvided,
      aftercareEmailSent: false,
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      followUpNotes: followUpNotes || null,
      closeOutCompletedAt: new Date(),
      completedAt: new Date(),
    },
    select: { id: true, journeyNumber: true },
  });

  // 4. Save clinical photos (non-blocking)
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { googleDriveFolderId: true },
  });

  const saveTasks: Promise<unknown>[] = [];

  for (let i = 0; i < beforePhotos.length; i++) {
    saveTasks.push(
      prisma.clinicalPhoto.create({
        data: {
          treatmentJourneyId: journey.id,
          clientId,
          photoType: 'before',
          phase: 'CLINICAL_RECORD',
          imageData: beforePhotos[i],
          capturedById: practitionerId,
        },
      })
    );

    // Upload to Google Drive
    if (client?.googleDriveFolderId) {
      saveTasks.push(
        uploadBeforePhoto(client.googleDriveFolderId, beforePhotos[i], journey.id, i).catch(console.error)
      );
    }
  }

  for (let i = 0; i < afterPhotos.length; i++) {
    saveTasks.push(
      prisma.clinicalPhoto.create({
        data: {
          treatmentJourneyId: journey.id,
          clientId,
          photoType: 'after',
          phase: 'CLOSE_OUT',
          imageData: afterPhotos[i],
          capturedById: practitionerId,
        },
      })
    );

    if (client?.googleDriveFolderId) {
      saveTasks.push(
        uploadAfterPhoto(client.googleDriveFolderId, afterPhotos[i], journey.id, i).catch(console.error)
      );
    }
  }

  await Promise.allSettled(saveTasks);

  // 5. Send aftercare email (non-blocking)
  if (sendEmail && clientEmail) {
    (async () => {
      try {
        const template = aftercareTemplateId
          ? await getAftercareTemplate(prisma, clinicalData.treatmentType, brand)
          : null;

        const emailContent = buildAftercareEmail(template, {
          clientName,
          treatmentType: clinicalData.treatmentType,
          treatmentDate: new Date().toLocaleDateString('en-GB'),
          practitionerName: 'Practitioner', // Would resolve from session
          brandName: brand,
          followUpDate,
        });

        const result = await sendAftercareEmail({
          recipientEmail: clientEmail!,
          recipientName: clientName,
          ...emailContent,
          brandName: brand,
        });

        if (result.sent) {
          await prisma.treatmentJourney.update({
            where: { id: journey.id },
            data: {
              aftercareEmailSent: true,
              aftercareEmailSentAt: new Date(),
            },
          });
        }
      } catch (error) {
        console.error('Failed to send aftercare email:', error);
      }
    })();
  }

  // 6. Create audit log
  await prisma.auditLog.create({
    data: {
      treatmentJourneyId: journey.id,
      action: 'JOURNEY_COMPLETED',
      userId: practitionerId,
      newData: {
        brand,
        clientId,
        treatmentType: clinicalData.treatmentType,
        batchNumber: clinicalData.batchNumber,
      },
      changedFields: ['status'],
    },
  });

  return journey;
}

// ============================================
// GOVERNANCE FORM SUBMISSION
// ============================================

export async function submitGovernanceFormAction(data: {
  formType: string;
  brand: string;
  siteId: string;
  completedById: string;
  formData: Record<string, unknown>;
  signatureData: string;
  isCompliant: boolean;
  issues: string[];
}): Promise<{ id: string }> {
  const log = await prisma.governanceLog.create({
    data: {
      formType: data.formType as 'FIRE_SAFETY_CHECK' | 'CLEANING_LOG' | 'STAFF_TRAINING_SIGNOFF' | 'EQUIPMENT_CHECK' | 'INCIDENT_REPORT' | 'WASTE_DISPOSAL_LOG',
      brand: data.brand as 'MENHANCEMENTS' | 'WAX_FOR_MEN' | 'WAX_FOR_WOMEN' | 'PLG_UK',
      siteId: data.siteId,
      completedById: data.completedById,
      data: data.formData,
      signatureData: data.signatureData,
      isCompliant: data.isCompliant,
      issues: data.issues,
      followUpRequired: !data.isCompliant,
    },
    select: { id: true },
  });

  // Audit
  await prisma.auditLog.create({
    data: {
      action: `GOVERNANCE_${data.formType}_SUBMITTED`,
      userId: data.completedById,
      newData: { formType: data.formType, isCompliant: data.isCompliant, issues: data.issues },
      changedFields: ['status'],
    },
  });

  return log;
}

// ============================================
// COMPLIANCE WATCHDOG API
// ============================================

export async function getComplianceStatusAction(): Promise<{
  status: 'GREEN' | 'AMBER' | 'RED';
  unreadCount: number;
  actionRequiredCount: number;
  lastScanAt: string | null;
  recentAlerts: Array<{
    id: string;
    source: string;
    title: string;
    severity: string;
    scannedAt: string;
  }>;
}> {
  const { getComplianceStatus } = await import('@/lib/integrations/legal-watchdog');
  const result = await getComplianceStatus(prisma);

  return {
    ...result,
    lastScanAt: result.lastScanAt?.toISOString() ?? null,
    recentAlerts: result.recentAlerts.map((a) => ({
      ...a,
      scannedAt: a.scannedAt.toISOString(),
    })),
  };
}
