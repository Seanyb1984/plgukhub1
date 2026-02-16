import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // We must 'await' params in Next.js 16+ 
  const { id } = await params;
  
  try {
    const submission = await prisma.formSubmission.findUnique({
      where: { id },
      include: { 
        site: true, 
        practitioner: true 
      }
    });

    if (!submission) {
      return NextResponse.json({ error: "Clinical record not found" }, { status: 404 });
    }

    return NextResponse.json(submission);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
