'use server';

import { prisma } from '@/lib/db';
import { requireSession } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';

export async function updateEnquiryStatus(enquiryId: string, status: string) {
  const session = await requireSession();
  
  try {
    await prisma.enquiry.update({
      where: { id: enquiryId },
      data: { status }
    });

    // This refreshes the page automatically so you see the change instantly
    revalidatePath('/admin/enquiries');
    return { success: true };
  } catch (error) {
    console.error('Failed to update status:', error);
    return { success: false };
  }
}export async function createManualEnquiry(formData: FormData) {
  const session = await requireSession();
  const siteId = formData.get('siteId') as string;
  const site = await prisma.site.findUnique({ where: { id: siteId } });

  await prisma.enquiry.create({
    data: {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string || null,
      phone: formData.get('phone') as string || null,
      message: formData.get('message') as string,
      source: formData.get('source') as string, // Now uses the dropdown choice
      brand: site?.brand || session.user.brand,
      siteId: siteId,
    }
  });
  revalidatePath('/admin/enquiries');
}
