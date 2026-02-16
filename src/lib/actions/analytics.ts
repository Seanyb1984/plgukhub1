import { prisma } from "@/lib/db";

export async function getComplianceStats() {
  const totalAesthetics = await prisma.formSubmission.count({
    where: { formType: 'treatment-journey', data: { path: ['is_pom'], equals: 'Yes' } }
  });

  const missingPrescriber = await prisma.formSubmission.count({
    where: {
      formType: 'treatment-journey',
      data: { path: ['is_pom'], equals: 'Yes' },
      prescriberId: null // Red Flag: POM treatment with no doctor assigned
    }
  });

  const topTreatments = await prisma.formSubmission.groupBy({
    by: ['formType'],
    _count: { _all: true },
    orderBy: { _count: { formType: 'desc' } },
    take: 5
  });

  return {
    complianceScore: totalAesthetics > 0 ? Math.round(((totalAesthetics - missingPrescriber) / totalAesthetics) * 100) : 100,
    totalAesthetics,
    missingPrescriber,
    topTreatments
  };
}
