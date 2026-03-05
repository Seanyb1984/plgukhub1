// PLG UK Hub - Appointments Calendar Page (Server Component)
export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/db';
import CalendarClient from './CalendarClient';

export default async function AppointmentsPage() {
  let sites: { id: string; name: string; brand: string }[] = [];
  try {
    sites = await prisma.site.findMany({
      where: { isActive: true },
      select: { id: true, name: true, brand: true },
      orderBy: { name: 'asc' },
    });
  } catch {
    sites = [];
  }

  return <CalendarClient sites={sites} />;
}
