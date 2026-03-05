import { prisma } from '@/lib/db';
import {
  startOfDay,
  endOfDay,
  addMinutes,
  isBefore,
  isAfter,
  areIntervalsOverlapping,
  getDay,
  format,
  parse,
} from 'date-fns';

// ============================================
// Availability Calculation Engine
// ============================================

export interface TimeSlot {
  start: Date;
  end: Date;
}

export interface AvailableSlot {
  startTime: string; // ISO string
  endTime: string;
  userId: string;
  userName: string;
  userColour: string | null;
}

/**
 * Convert "HH:mm" string to a Date on the given day.
 */
function timeStringToDate(timeStr: string, day: Date): Date {
  return parse(timeStr, 'HH:mm', day);
}

/**
 * Convert JS getDay() (0=Sun) to our schema convention (0=Mon).
 */
function jsDayToSchemaDow(jsDay: number): number {
  return jsDay === 0 ? 6 : jsDay - 1;
}

/**
 * Get the working hours for a staff member on a specific date.
 * Returns null if not working that day.
 */
export async function getStaffWorkingHours(
  userId: string,
  siteId: string,
  date: Date
): Promise<{ start: Date; end: Date } | null> {
  const dayStart = startOfDay(date);

  // Check for override first
  const override = await prisma.scheduleOverride.findUnique({
    where: { userId_date: { userId, date: dayStart } },
  });

  if (override) {
    if (!override.isAvailable) return null;
    if (override.startTime && override.endTime) {
      return {
        start: timeStringToDate(override.startTime, dayStart),
        end: timeStringToDate(override.endTime, dayStart),
      };
    }
  }

  // Fall back to weekly template
  const dow = jsDayToSchemaDow(getDay(date));
  const schedule = await prisma.staffSchedule.findUnique({
    where: { userId_siteId_dayOfWeek: { userId, siteId, dayOfWeek: dow } },
  });

  if (!schedule || !schedule.isAvailable) return null;

  return {
    start: timeStringToDate(schedule.startTime, dayStart),
    end: timeStringToDate(schedule.endTime, dayStart),
  };
}

/**
 * Get existing appointments for a practitioner on a given date.
 */
async function getExistingAppointments(
  userId: string,
  date: Date
): Promise<TimeSlot[]> {
  const dayS = startOfDay(date);
  const dayE = endOfDay(date);

  const appointments = await prisma.appointment.findMany({
    where: {
      userId,
      startTime: { gte: dayS, lte: dayE },
      status: {
        notIn: ['CANCELLED_BY_CLIENT', 'CANCELLED_BY_CLINIC', 'NO_SHOW'],
      },
    },
    select: { startTime: true, endTime: true },
    orderBy: { startTime: 'asc' },
  });

  return appointments.map((a) => ({ start: a.startTime, end: a.endTime }));
}

/**
 * Calculate available time slots for a specific practitioner on a date.
 */
export async function getAvailableSlots(
  userId: string,
  siteId: string,
  date: Date,
  durationMins: number,
  bufferMins: number = 0
): Promise<TimeSlot[]> {
  const workingHours = await getStaffWorkingHours(userId, siteId, date);
  if (!workingHours) return [];

  const existingAppts = await getExistingAppointments(userId, date);
  const totalMins = durationMins + bufferMins;
  const slots: TimeSlot[] = [];
  const now = new Date();

  // Walk in 15-minute increments from start to end of working hours
  let cursor = workingHours.start;
  while (isBefore(cursor, workingHours.end)) {
    const slotEnd = addMinutes(cursor, totalMins);

    // Slot must fit within working hours
    if (isAfter(slotEnd, workingHours.end)) break;

    // Slot must be in the future
    if (isAfter(cursor, now) || cursor.getTime() === now.getTime()) {
      // Check no overlap with existing appointments
      const overlaps = existingAppts.some((appt) =>
        areIntervalsOverlapping(
          { start: cursor, end: slotEnd },
          { start: appt.start, end: appt.end }
        )
      );

      if (!overlaps) {
        slots.push({ start: new Date(cursor), end: addMinutes(cursor, durationMins) });
      }
    }

    cursor = addMinutes(cursor, 15);
  }

  return slots;
}

/**
 * Get available slots for ALL bookable practitioners at a site on a date.
 */
export async function getAvailableSlotsForSite(
  siteId: string,
  date: Date,
  durationMins: number,
  bufferMins: number = 0,
  practitionerId?: string
): Promise<AvailableSlot[]> {
  // Get bookable staff at this site
  const staffFilter: Record<string, unknown> = {
    siteId,
    isActive: true,
    isBookable: true,
  };
  if (practitionerId) {
    staffFilter.id = practitionerId;
  }

  const staff = await prisma.user.findMany({
    where: staffFilter,
    select: { id: true, name: true, colour: true },
  });

  const allSlots: AvailableSlot[] = [];

  for (const member of staff) {
    const slots = await getAvailableSlots(
      member.id,
      siteId,
      date,
      durationMins,
      bufferMins
    );

    for (const slot of slots) {
      allSlots.push({
        startTime: slot.start.toISOString(),
        endTime: slot.end.toISOString(),
        userId: member.id,
        userName: member.name,
        userColour: member.colour,
      });
    }
  }

  // Sort by start time
  allSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));
  return allSlots;
}

/**
 * Get all appointments for a site on a given date (for calendar view).
 */
export async function getAppointmentsForDate(
  siteId: string,
  date: Date,
  practitionerIds?: string[]
) {
  const dayS = startOfDay(date);
  const dayE = endOfDay(date);

  const where: Record<string, unknown> = {
    siteId,
    startTime: { gte: dayS, lte: dayE },
  };
  if (practitionerIds?.length) {
    where.userId = { in: practitionerIds };
  }

  return prisma.appointment.findMany({
    where,
    include: {
      client: { select: { id: true, firstName: true, lastName: true } },
      user: { select: { id: true, name: true, colour: true } },
      treatment: { select: { id: true, name: true, category: true, durationMins: true } },
      room: { select: { id: true, name: true } },
    },
    orderBy: { startTime: 'asc' },
  });
}

/**
 * Get practitioners working at a site on a date (with their hours).
 */
export async function getWorkingStaff(siteId: string, date: Date) {
  const staff = await prisma.user.findMany({
    where: { siteId, isActive: true, isBookable: true },
    select: { id: true, name: true, colour: true, role: true },
  });

  const result: Array<{
    id: string;
    name: string;
    colour: string | null;
    role: string;
    startTime: string;
    endTime: string;
  }> = [];

  for (const member of staff) {
    const hours = await getStaffWorkingHours(member.id, siteId, date);
    if (hours) {
      result.push({
        ...member,
        startTime: format(hours.start, 'HH:mm'),
        endTime: format(hours.end, 'HH:mm'),
      });
    }
  }

  return result;
}
