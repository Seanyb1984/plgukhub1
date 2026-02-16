import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientId, formType, formData, riskLevel, signatureData } = body;

    // 1. Find the patient in the database
    const client = await prisma.client.findFirst({
      where: {
        OR: [
          { id: clientId },
          { clientId: clientId }
        ]
      }
    });

    if (!client) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // 2. Create the clinical submission record
    const submission = await prisma.formSubmission.create({
      data: {
        clientId: client.id,
        formType: formType || 'GENERAL_CONSENT',
        data: formData,
        riskLevel: riskLevel || 'LOW',
        signatureData: signatureData || '',
        submittedAt: new Date(),
        siteId: client.siteId,
        brand: client.brand
      }
    });

    console.log(`✅ RECORD SAVED: Attached to ${client.firstName} ${client.lastName}`);

    return NextResponse.json({ success: true, submissionId: submission.id });

  } catch (error: any) {
    console.error("❌ SUBMISSION ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
