import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

// ============================================
// POST /api/episodes — Create episode from pre-consent
// ============================================
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = session.user as any;

  try {
    const body = await request.json();
    const {
      clientId,
      brand,
      treatmentType,
      medicalHistory,
      allergyDetails,
      medicationDetails,
      additionalNotes,
      riskFlags,
      signatureData,
      signedByName,
      webcamCapture,
      beforePhotos,
    } = body;

    // Validate hard stops
    const hasHardStop = riskFlags?.some((r: { type: string }) => r.type === 'hard_stop');
    if (hasHardStop) {
      return NextResponse.json(
        { error: 'Cannot create episode — safety screening has hard stop(s).' },
        { status: 422 }
      );
    }

    // Resolve or create client
    let resolvedClientId = clientId;
    if (!resolvedClientId) {
      // If no client selected, create a placeholder prospect
      const site = await prisma.site.findFirst({
        where: { brand: brand, isActive: true },
      });
      if (!site) {
        return NextResponse.json({ error: 'No active site for brand' }, { status: 400 });
      }
      const prospect = await prisma.client.create({
        data: {
          firstName: signedByName?.split(' ')[0] || 'Walk-in',
          lastName: signedByName?.split(' ').slice(1).join(' ') || 'Client',
          brands: [brand],
          siteId: site.id,
          status: 'PROSPECT',
          isProspect: true,
          marketingConsent: false,
        },
      });
      resolvedClientId = prospect.id;
    }

    // Look up practitioner site
    const practitioner = await prisma.user.findUnique({
      where: { id: token.id as string },
      select: { siteId: true },
    });

    if (!practitioner) {
      return NextResponse.json({ error: 'Practitioner not found' }, { status: 400 });
    }

    // Determine POM requirement
    const isPom = brand === 'MENHANCEMENTS';

    // Create the episode in a transaction
    const episode = await prisma.$transaction(async (tx) => {
      const ep = await tx.treatmentEpisode.create({
        data: {
          brand,
          siteId: practitioner.siteId,
          clientId: resolvedClientId,
          practitionerId: token.id as string,
          isPom,
          status: signatureData ? 'CONSENT_SIGNED' : 'CONSENT_PENDING',
          treatmentType,
          medicalHistory: medicalHistory || {},
          safetyScreening: medicalHistory || {},
          safetyScreeningPass: !hasHardStop,
          dynamicRisks: riskFlags || [],
          consentDeclaration: 'Signed via PLG UK Hub digital consent form',
          signatureData: signatureData || null,
          signedByName: signedByName || null,
          signedAt: signatureData ? new Date() : null,
          webcamCaptureData: webcamCapture || null,
          beforePhotoIds: [],
          afterPhotoIds: [],
          clinicalNotes: [
            allergyDetails ? `Allergies: ${allergyDetails}` : '',
            medicationDetails ? `Medications: ${medicationDetails}` : '',
            additionalNotes || '',
          ].filter(Boolean).join('\n') || null,
        },
      });

      // Save before photos as ClinicalPhoto records
      if (beforePhotos?.length > 0) {
        const photoIds: string[] = [];
        for (let i = 0; i < beforePhotos.length; i++) {
          const photo = await tx.clinicalPhoto.create({
            data: {
              treatmentJourneyId: ep.id, // Re-use the relation field
              clientId: resolvedClientId,
              photoType: 'before',
              phase: 'LEGAL_CONSENT',
              imageData: beforePhotos[i],
              mimeType: 'image/jpeg',
              fileName: `before_${ep.episodeRef}_${i + 1}.jpg`,
            },
          });
          photoIds.push(photo.id);
        }
        // Update episode with photo IDs
        await tx.treatmentEpisode.update({
          where: { id: ep.id },
          data: { beforePhotoIds: photoIds },
        });
      }

      return ep;
    });

    return NextResponse.json({
      id: episode.id,
      episodeRef: episode.episodeRef,
      status: episode.status,
      message: 'Episode created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Episode creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create episode' },
      { status: 500 }
    );
  }
}

// ============================================
// GET /api/episodes?ref=xxx — Lookup episode
// ============================================
export async function GET(request: NextRequest) {
  // Public endpoint — returns only non-sensitive episode metadata for forms
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get('ref');

  if (!ref) {
    return NextResponse.json({ error: 'Episode ref required' }, { status: 400 });
  }

  try {
    const episode = await prisma.treatmentEpisode.findUnique({
      where: { episodeRef: ref },
      include: {
        client: { select: { firstName: true, lastName: true, email: true } },
      },
    });

    if (!episode) {
      return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: episode.id,
      episodeRef: episode.episodeRef,
      clientName: `${episode.client.firstName} ${episode.client.lastName}`,
      clientEmail: episode.client.email,
      treatmentType: episode.treatmentType,
      brand: episode.brand,
      status: episode.status,
      productUsed: episode.productUsed,
      isLocked: episode.isLocked,
    });
  } catch (error) {
    console.error('Episode lookup error:', error);
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 });
  }
}

// ============================================
// PATCH /api/episodes — Complete treatment, lock record, trigger automations
// ============================================
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = session.user as any;

  try {
    const body = await request.json();
    const { episodeRef, action } = body;

    if (!episodeRef) {
      return NextResponse.json({ error: 'Episode ref required' }, { status: 400 });
    }

    const episode = await prisma.treatmentEpisode.findUnique({
      where: { episodeRef },
      include: { client: true },
    });

    if (!episode) {
      return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
    }

    if (episode.isLocked) {
      return NextResponse.json({ error: 'Episode is locked and cannot be modified' }, { status: 403 });
    }

    if (action === 'complete_treatment') {
      const {
        productUsed,
        batchNumber,
        lotNumber,
        expiryDate,
        dosage,
        treatmentAreas,
        clinicalNotes,
        complications,
        afterPhotos,
        aftercareProvided,
        sendAftercareEmail,
        followUpDate,
        followUpNotes,
      } = body;

      // Complete the episode in a transaction
      const updated = await prisma.$transaction(async (tx) => {
        // Save after photos
        const afterPhotoIds: string[] = [];
        if (afterPhotos?.length > 0) {
          for (let i = 0; i < afterPhotos.length; i++) {
            const photo = await tx.clinicalPhoto.create({
              data: {
                treatmentJourneyId: episode.id,
                clientId: episode.clientId,
                photoType: 'after',
                phase: 'CLOSE_OUT',
                imageData: afterPhotos[i],
                mimeType: 'image/jpeg',
                fileName: `after_${episodeRef}_${i + 1}.jpg`,
              },
            });
            afterPhotoIds.push(photo.id);
          }
        }

        // Link to batch register if exists, or create entry
        let batchRegisterId: string | null = null;
        if (batchNumber) {
          const existingBatch = await tx.batchRegister.findFirst({
            where: { batchNumber, productName: productUsed || '', brand: episode.brand },
          });

          if (existingBatch) {
            batchRegisterId = existingBatch.id;
            await tx.batchRegister.update({
              where: { id: existingBatch.id },
              data: { quantityUsed: { increment: 1 }, quantityRemaining: { decrement: 1 } },
            });
          }
        }

        // Update episode
        const ep = await tx.treatmentEpisode.update({
          where: { id: episode.id },
          data: {
            status: 'CLOSED',
            productUsed,
            batchNumber,
            lotNumber,
            dosage,
            batchRegisterId,
            treatmentAreas: treatmentAreas || [],
            clinicalNotes: clinicalNotes || null,
            complications: complications || null,
            afterPhotoIds,
            aftercareProvided: aftercareProvided || false,
            aftercareEmailSent: sendAftercareEmail || false,
            aftercareEmailSentAt: sendAftercareEmail ? new Date() : null,
            followUpDate: followUpDate ? new Date(followUpDate) : null,
            followUpNotes: followUpNotes || null,
            completedAt: new Date(),
            isLocked: true,
            lockedAt: new Date(),
            lockedById: token.id as string,
            lockReason: 'Treatment completed and signed off',
            expiryDate: expiryDate ? new Date(expiryDate) : null,
          },
        });

        // Promote client from PROSPECT to ACTIVE
        if (episode.client.isProspect) {
          await tx.client.update({
            where: { id: episode.clientId },
            data: { isProspect: false, status: 'ACTIVE' },
          });
        }

        return ep;
      });

      // Trigger aftercare email asynchronously (fire-and-forget)
      if (sendAftercareEmail && episode.client.email) {
        triggerAftercareEmail(episode.client.email, episode.client.firstName, updated.treatmentType || '', episode.brand)
          .catch((err) => console.error('Aftercare email failed:', err));
      }

      return NextResponse.json({
        id: updated.id,
        episodeRef: updated.episodeRef,
        status: updated.status,
        isLocked: updated.isLocked,
        message: 'Treatment completed and episode locked',
      });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (error) {
    console.error('Episode update error:', error);
    return NextResponse.json({ error: 'Failed to update episode' }, { status: 500 });
  }
}

// ============================================
// Aftercare Email Helper (Gmail API integration)
// ============================================
async function triggerAftercareEmail(
  clientEmail: string,
  clientName: string,
  treatmentType: string,
  brand: string
) {
  try {
    const { sendAftercareEmail } = await import('@/lib/integrations/gmail-aftercare');
    const brandLabel = brand.replace(/_/g, ' ');
    await sendAftercareEmail({
      recipientEmail: clientEmail,
      recipientName: clientName,
      subject: `Your ${treatmentType} Aftercare – ${brandLabel}`,
      bodyHtml: `<p>Dear ${clientName},</p><p>Thank you for your ${treatmentType} treatment with ${brandLabel}. Please follow the aftercare instructions provided during your visit.</p><p>If you have any concerns, contact us immediately.</p><p>Best regards,<br/>PLG UK Hub</p>`,
      bodyPlain: `Dear ${clientName},\n\nThank you for your ${treatmentType} treatment with ${brandLabel}. Please follow the aftercare instructions provided during your visit.\n\nIf you have any concerns, contact us immediately.\n\nBest regards,\nPLG UK Hub`,
    });
  } catch (error) {
    console.error('Gmail aftercare email error:', error);
  }
}
