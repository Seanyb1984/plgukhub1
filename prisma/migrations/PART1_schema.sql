-- ============================================
-- PART 1: SCHEMA ONLY — Run this FIRST
-- ============================================

-- Enums
DO $$ BEGIN
  CREATE TYPE "AppointmentStatus" AS ENUM ('BOOKED', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'NO_SHOW', 'CANCELLED_BY_CLIENT', 'CANCELLED_BY_CLINIC');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "BookingSource" AS ENUM ('RECEPTION', 'ONLINE', 'PHONE', 'WALK_IN');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Add fields to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "colour" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isBookable" BOOLEAN NOT NULL DEFAULT true;

-- Treatment catalogue
CREATE TABLE IF NOT EXISTS "Treatment" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "brand" "Brand" NOT NULL,
  "category" TEXT NOT NULL,
  "parentId" TEXT,
  "treatmentTypeKey" TEXT,
  "durationMins" INTEGER NOT NULL DEFAULT 30,
  "price" INTEGER NOT NULL DEFAULT 0,
  "bookingBuffer" INTEGER NOT NULL DEFAULT 0,
  "isPom" BOOLEAN NOT NULL DEFAULT false,
  "isOnlineBookable" BOOLEAN NOT NULL DEFAULT true,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "requiresConsent" BOOLEAN NOT NULL DEFAULT false,
  "requiresPatchTest" BOOLEAN NOT NULL DEFAULT false,
  "isAddOn" BOOLEAN NOT NULL DEFAULT false,
  "addOnPrice" INTEGER,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Treatment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Treatment_slug_key" ON "Treatment"("slug");
CREATE INDEX IF NOT EXISTS "Treatment_brand_idx" ON "Treatment"("brand");
CREATE INDEX IF NOT EXISTS "Treatment_category_idx" ON "Treatment"("category");
CREATE INDEX IF NOT EXISTS "Treatment_parentId_idx" ON "Treatment"("parentId");
CREATE INDEX IF NOT EXISTS "Treatment_isActive_idx" ON "Treatment"("isActive");

-- Site-Treatment junction
CREATE TABLE IF NOT EXISTS "SiteTreatment" (
  "siteId" TEXT NOT NULL,
  "treatmentId" TEXT NOT NULL,
  CONSTRAINT "SiteTreatment_pkey" PRIMARY KEY ("siteId", "treatmentId")
);

CREATE INDEX IF NOT EXISTS "SiteTreatment_siteId_idx" ON "SiteTreatment"("siteId");
CREATE INDEX IF NOT EXISTS "SiteTreatment_treatmentId_idx" ON "SiteTreatment"("treatmentId");

-- Staff weekly schedule
CREATE TABLE IF NOT EXISTS "StaffSchedule" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  "siteId" TEXT NOT NULL,
  "dayOfWeek" INTEGER NOT NULL,
  "startTime" TEXT NOT NULL,
  "endTime" TEXT NOT NULL,
  "isAvailable" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StaffSchedule_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "StaffSchedule_userId_siteId_dayOfWeek_key" ON "StaffSchedule"("userId", "siteId", "dayOfWeek");
CREATE INDEX IF NOT EXISTS "StaffSchedule_userId_idx" ON "StaffSchedule"("userId");
CREATE INDEX IF NOT EXISTS "StaffSchedule_siteId_idx" ON "StaffSchedule"("siteId");

-- Schedule overrides
CREATE TABLE IF NOT EXISTS "ScheduleOverride" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  "date" DATE NOT NULL,
  "isAvailable" BOOLEAN NOT NULL DEFAULT false,
  "startTime" TEXT,
  "endTime" TEXT,
  "reason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ScheduleOverride_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ScheduleOverride_userId_date_key" ON "ScheduleOverride"("userId", "date");
CREATE INDEX IF NOT EXISTS "ScheduleOverride_userId_idx" ON "ScheduleOverride"("userId");
CREATE INDEX IF NOT EXISTS "ScheduleOverride_date_idx" ON "ScheduleOverride"("date");

-- Rooms
CREATE TABLE IF NOT EXISTS "Room" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "siteId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Room_siteId_idx" ON "Room"("siteId");

-- Appointments
CREATE TABLE IF NOT EXISTS "Appointment" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "siteId" TEXT NOT NULL,
  "clientId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "treatmentId" TEXT NOT NULL,
  "roomId" TEXT,
  "startTime" TIMESTAMP(3) NOT NULL,
  "endTime" TIMESTAMP(3) NOT NULL,
  "status" "AppointmentStatus" NOT NULL DEFAULT 'BOOKED',
  "source" "BookingSource" NOT NULL DEFAULT 'RECEPTION',
  "notes" TEXT,
  "cancellationReason" TEXT,
  "cancelledAt" TIMESTAMP(3),
  "noShowAt" TIMESTAMP(3),
  "createdById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Appointment_siteId_startTime_idx" ON "Appointment"("siteId", "startTime");
CREATE INDEX IF NOT EXISTS "Appointment_userId_startTime_idx" ON "Appointment"("userId", "startTime");
CREATE INDEX IF NOT EXISTS "Appointment_clientId_idx" ON "Appointment"("clientId");
CREATE INDEX IF NOT EXISTS "Appointment_status_idx" ON "Appointment"("status");
CREATE INDEX IF NOT EXISTS "Appointment_startTime_idx" ON "Appointment"("startTime");

-- Foreign keys (all wrapped in exception handlers so re-runs don't fail)
DO $$ BEGIN ALTER TABLE "Treatment" ADD CONSTRAINT "Treatment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Treatment"("id") ON DELETE SET NULL ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "SiteTreatment" ADD CONSTRAINT "SiteTreatment_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "SiteTreatment" ADD CONSTRAINT "SiteTreatment_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "StaffSchedule" ADD CONSTRAINT "StaffSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "StaffSchedule" ADD CONSTRAINT "StaffSchedule_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "ScheduleOverride" ADD CONSTRAINT "ScheduleOverride_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Room" ADD CONSTRAINT "Room_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
