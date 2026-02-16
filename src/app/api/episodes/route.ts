import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-helpers";

export async function POST(req: Request) {
  try {
    // 1. Check Authentication
    const session = await requireSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { clientId, stage, data } = body;

    // 2. Find the client and their site info
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { siteId: true, brand: true }
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // 3. Create or Update the Treatment Episode
    // If we are in CONSENT stage, we create a new episode.
    // If we are in TREATMENT stage, we find the latest open episode and update it.
    
    let episode;

    if (stage === "CONSENT") {
      episode = await prisma.treatmentEpisode.create({
        data: {
          clientId,
          siteId: client.siteId,
          practitionerId: session.userId,
          brand: client.brand,
          status: "CONSENTED",
          treatmentType: data.treatmentType,
          medicalSnapshot: data.medicalSnapshot || {},
          signatureData: data.signatureData,
          signedAt: new Date(data.signedAt),
          procedureNotes: `Pre-Consent Captured. Photo stored in Clinical Vault.`,
          // Note: In a production app, you'd store the photo URL here after uploading to Drive
        }
      });
    } else if (stage === "TREATMENT") {
      // Find the most recent episode for this client that isn't finished
      const activeEpisode = await prisma.treatmentEpisode.findFirst({
        where: { clientId, status: "CONSENTED" },
        orderBy: { createdAt: 'desc' }
      });

      if (!activeEpisode) {
        return NextResponse.json({ error: "No active consent found for this treatment" }, { status: 400 });
      }

      episode = await prisma.treatmentEpisode.update({
        where: { id: activeEpisode.id },
        data: {
          status: "TREATED",
          batchNumber: data.batchNumber,
          productUsed: data.productUsed,
          volumeUsed: data.volumeUsed,
          procedureNotes: data.procedureNotes,
          aftercareSent: true
        }
      });
    }

    return NextResponse.json({ success: true, episodeId: episode?.id });

  } catch (error: any) {
    console.error("❌ EPISODE API ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}