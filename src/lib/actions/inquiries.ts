'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

/**
 * convertInquiryToClient
 *
 * Takes an Inquiry ID, creates a Client record with status PROSPECT
 * (isProspect: true), and marks the Inquiry as converted.
 *
 * Returns the newly created Client or throws on failure.
 */
export async function convertInquiryToClient(inquiryId: string) {
  // 1. Fetch the inquiry
  const inquiry = await prisma.inquiry.findUnique({
    where: { id: inquiryId },
  });

  if (!inquiry) {
    throw new Error(`Inquiry ${inquiryId} not found`);
  }

  if (inquiry.isConverted) {
    throw new Error(`Inquiry ${inquiryId} has already been converted`);
  }

  // 2. Resolve a default site for this brand
  const site = await prisma.site.findFirst({
    where: { brand: inquiry.brand, isActive: true },
  });

  if (!site) {
    throw new Error(`No active site found for brand ${inquiry.brand}`);
  }

  // 3. Split name into first/last
  const nameParts = inquiry.name.trim().split(/\s+/);
  const firstName = nameParts[0] || 'Unknown';
  const lastName = nameParts.slice(1).join(' ') || 'Unknown';

  // 4. Create the Client as a PROSPECT inside a transaction
  const client = await prisma.$transaction(async (tx) => {
    const newClient = await tx.client.create({
      data: {
        firstName,
        lastName,
        email: inquiry.email,
        phone: inquiry.phone,
        brands: [inquiry.brand],
        siteId: site.id,
        status: 'PROSPECT',
        isProspect: true,
        marketingConsent: false,
      },
    });

    // 5. Mark the inquiry as converted
    await tx.inquiry.update({
      where: { id: inquiryId },
      data: {
        isConverted: true,
        convertedAt: new Date(),
        convertedClientId: newClient.id,
      },
    });

    return newClient;
  });

  revalidatePath('/admin/inquiries');
  revalidatePath('/admin/clients');

  return client;
}

/**
 * createInquiry — captures a new lead/inquiry
 */
export async function createInquiry(data: {
  name: string;
  email: string;
  phone?: string;
  brand: 'MENHANCEMENTS' | 'WAX_FOR_MEN' | 'WAX_FOR_WOMEN' | 'PLG_UK';
  message?: string;
}) {
  const inquiry = await prisma.inquiry.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      brand: data.brand,
      message: data.message,
    },
  });

  revalidatePath('/admin/inquiries');
  return inquiry;
}

/**
 * getInquiries — lists all inquiries with optional filtering
 */
export async function getInquiries(filters?: {
  brand?: 'MENHANCEMENTS' | 'WAX_FOR_MEN' | 'WAX_FOR_WOMEN' | 'PLG_UK';
  convertedOnly?: boolean;
}) {
  return prisma.inquiry.findMany({
    where: {
      ...(filters?.brand && { brand: filters.brand }),
      ...(filters?.convertedOnly !== undefined && {
        isConverted: filters.convertedOnly,
      }),
    },
    orderBy: { createdAt: 'desc' },
  });
}
