-- ============================================
-- PLG Hub Booking System — COMPLETE SETUP
-- Paste this ENTIRE script into Supabase SQL Editor and run
-- Part 1: Schema (tables, indexes, FK constraints)
-- Part 2: Seed (treatments, rooms, staff schedules)
-- ============================================

-- ============================================
-- PART 1: SCHEMA MIGRATION
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
DO $$ BEGIN
  ALTER TABLE "Treatment" ADD CONSTRAINT "Treatment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Treatment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Site-Treatment junction
CREATE TABLE IF NOT EXISTS "SiteTreatment" (
  "siteId" TEXT NOT NULL,
  "treatmentId" TEXT NOT NULL,
  CONSTRAINT "SiteTreatment_pkey" PRIMARY KEY ("siteId", "treatmentId")
);
CREATE INDEX IF NOT EXISTS "SiteTreatment_siteId_idx" ON "SiteTreatment"("siteId");
CREATE INDEX IF NOT EXISTS "SiteTreatment_treatmentId_idx" ON "SiteTreatment"("treatmentId");
DO $$ BEGIN
  ALTER TABLE "SiteTreatment" ADD CONSTRAINT "SiteTreatment_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "SiteTreatment" ADD CONSTRAINT "SiteTreatment_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

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
DO $$ BEGIN
  ALTER TABLE "StaffSchedule" ADD CONSTRAINT "StaffSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "StaffSchedule" ADD CONSTRAINT "StaffSchedule_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

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
DO $$ BEGIN
  ALTER TABLE "ScheduleOverride" ADD CONSTRAINT "ScheduleOverride_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

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
DO $$ BEGIN
  ALTER TABLE "Room" ADD CONSTRAINT "Room_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

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
DO $$ BEGIN
  ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ============================================
-- PART 2: SEED DATA
-- ============================================

-- ============================================
-- 2A: TREATMENTS (prices in pence)
-- ============================================

-- WAX FOR WOMEN — standalone treatments
INSERT INTO "Treatment" ("id","name","slug","brand","category","durationMins","price","isPom","requiresConsent","requiresPatchTest") VALUES
('t-wfw-hollywood','Hollywood Wax for Women','wfw-hollywood','WAX_FOR_WOMEN','wax_women',30,3000,false,false,false),
('t-wfw-brazilian','Brazilian Wax for Women','wfw-brazilian','WAX_FOR_WOMEN','wax_women',25,2500,false,false,false),
('t-wfw-buttocks','Buttocks Wax for Women','wfw-buttocks','WAX_FOR_WOMEN','wax_women',15,1000,false,false,false),
('t-wfw-underarm','Underarm Wax for Women','wfw-underarm','WAX_FOR_WOMEN','wax_women',10,1000,false,false,false),
('t-wfw-breast','Breast Wax for Women','wfw-breast','WAX_FOR_WOMEN','wax_women',10,1000,false,false,false),
('t-wfw-stomach','Stomach Wax for Women','wfw-stomach','WAX_FOR_WOMEN','wax_women',10,1000,false,false,false),
('t-wfw-fullbody-ex','Full Body Wax for Women (excl Intimate)','wfw-fullbody-excl','WAX_FOR_WOMEN','wax_women',75,8000,false,false,false),
('t-wfw-fullbody-in','Full Body Wax for Women (incl Intimate)','wfw-fullbody-incl','WAX_FOR_WOMEN','wax_women',90,9000,false,false,false),
('t-wfw-eyebrow','Eyebrow Wax for Women','wfw-eyebrow','WAX_FOR_WOMEN','wax_women',10,1000,false,false,false),
('t-wfw-lip','Lip Wax for Women','wfw-lip','WAX_FOR_WOMEN','wax_women',5,500,false,false,false),
('t-wfw-chin','Chin Wax for Women','wfw-chin','WAX_FOR_WOMEN','wax_women',5,500,false,false,false),
('t-wfw-ear','Ear Wax for Women','wfw-ear','WAX_FOR_WOMEN','wax_women',5,500,false,false,false),
('t-wfw-nostril','Nostril Wax for Women','wfw-nostril','WAX_FOR_WOMEN','wax_women',5,500,false,false,false),
('t-wfw-fullface-nb','Full Face Wax (no Brows) for Women','wfw-fullface-no-brows','WAX_FOR_WOMEN','wax_women',15,1500,false,false,false),
('t-wfw-fullface-wb','Full Face Wax (incl Brows) for Women','wfw-fullface-with-brows','WAX_FOR_WOMEN','wax_women',20,2000,false,false,false)
ON CONFLICT ("id") DO NOTHING;

-- WAX FOR WOMEN — parent items
INSERT INTO "Treatment" ("id","name","slug","brand","category","durationMins","price","isOnlineBookable") VALUES
('t-wfw-bikini-p','Bikini Wax for Women','wfw-bikini-parent','WAX_FOR_WOMEN','wax_women',15,1000,false),
('t-wfw-arm-p','Arm Waxing for Women','wfw-arm-parent','WAX_FOR_WOMEN','wax_women',15,500,false),
('t-wfw-leg-p','Full Leg Waxing for Women','wfw-leg-parent','WAX_FOR_WOMEN','wax_women',20,500,false),
('t-wfw-back-p','Back Wax for Women','wfw-back-parent','WAX_FOR_WOMEN','wax_women',10,1000,false)
ON CONFLICT ("id") DO NOTHING;

-- WAX FOR WOMEN — children
INSERT INTO "Treatment" ("id","name","slug","brand","category","parentId","durationMins","price") VALUES
('t-wfw-bikini-basic','Basic Bikini','wfw-bikini-basic','WAX_FOR_WOMEN','wax_women','t-wfw-bikini-p',15,1000),
('t-wfw-bikini-high','High Bikini Wax','wfw-bikini-high','WAX_FOR_WOMEN','wax_women','t-wfw-bikini-p',15,1500),
('t-wfw-bikini-g','G String Bikini Wax','wfw-bikini-gstring','WAX_FOR_WOMEN','wax_women','t-wfw-bikini-p',20,2000),
('t-wfw-arm-full','Full Arm Wax (Women)','wfw-arm-full','WAX_FOR_WOMEN','wax_women','t-wfw-arm-p',20,2000),
('t-wfw-arm-half','Half Arm Wax (Women)','wfw-arm-half','WAX_FOR_WOMEN','wax_women','t-wfw-arm-p',15,1000),
('t-wfw-arm-hand','Hand Wax (Women)','wfw-arm-hand','WAX_FOR_WOMEN','wax_women','t-wfw-arm-p',10,500),
('t-wfw-leg-full','Full Leg (Women)','wfw-leg-full','WAX_FOR_WOMEN','wax_women','t-wfw-leg-p',30,2500),
('t-wfw-leg-half','Half Leg Wax (Women)','wfw-leg-half','WAX_FOR_WOMEN','wax_women','t-wfw-leg-p',20,1500),
('t-wfw-leg-feet','Feet Wax (Women)','wfw-leg-feet','WAX_FOR_WOMEN','wax_women','t-wfw-leg-p',10,500),
('t-wfw-back-full','Back Wax (Women)','wfw-back-full','WAX_FOR_WOMEN','wax_women','t-wfw-back-p',15,1500),
('t-wfw-back-lower','Lower Back Wax (Women)','wfw-back-lower','WAX_FOR_WOMEN','wax_women','t-wfw-back-p',10,1000)
ON CONFLICT ("id") DO NOTHING;

-- WAX FOR WOMEN — add-on
INSERT INTO "Treatment" ("id","name","slug","brand","category","durationMins","price","isAddOn","addOnPrice") VALUES
('t-wfw-addon-jelly','Luxury Healing Jelly Mask (Women)','wfw-addon-jelly-mask','WAX_FOR_WOMEN','wax_women',10,2000,true,2000)
ON CONFLICT ("id") DO NOTHING;

-- WAX FOR MEN — standalone treatments
INSERT INTO "Treatment" ("id","name","slug","brand","category","durationMins","price") VALUES
('t-wfm-chest-arms-full','Chest Abdomen & Full Arms Wax for Men','wfm-chest-abdomen-fullarms','WAX_FOR_MEN','wax_men',45,6000),
('t-wfm-chest-arms-half','Chest Abdomen & Half Arms Wax for Men','wfm-chest-abdomen-halfarms','WAX_FOR_MEN','wax_men',40,5500),
('t-wfm-chest-shoulders','Chest Abdomen & Shoulders Wax for Men','wfm-chest-abdomen-shoulders','WAX_FOR_MEN','wax_men',30,4000),
('t-wfm-abdomen','Abdomen Wax for Men','wfm-abdomen','WAX_FOR_MEN','wax_men',15,2000),
('t-wfm-chest','Chest Wax for Men','wfm-chest','WAX_FOR_MEN','wax_men',20,2500),
('t-wfm-back','Back Wax for Men','wfm-back','WAX_FOR_MEN','wax_men',25,3500),
('t-wfm-back-shoulders','Back & Shoulders for Men','wfm-back-shoulders','WAX_FOR_MEN','wax_men',30,4000),
('t-wfm-back-upperarms','Back & Upper Arms for Men','wfm-back-upper-arms','WAX_FOR_MEN','wax_men',40,5500),
('t-wfm-back-fullarms','Back & Full Arms for Men','wfm-back-full-arms','WAX_FOR_MEN','wax_men',45,6000),
('t-wfm-shoulder','Shoulder Wax for Men','wfm-shoulder','WAX_FOR_MEN','wax_men',15,1500),
('t-wfm-lowerback','Lower Back Wax for Men','wfm-lower-back','WAX_FOR_MEN','wax_men',15,2000),
('t-wfm-underarm','Underarm Wax for Men','wfm-underarm','WAX_FOR_MEN','wax_men',15,2000),
('t-wfm-speedo','Speedo Line','wfm-speedo-line','WAX_FOR_MEN','wax_men',15,2000),
('t-wfm-penis-scrotum','Penis & Scrotum Wax','wfm-penis-scrotum','WAX_FOR_MEN','wax_men',20,3000),
('t-wfm-pubic','Pubic Triangle Wax','wfm-pubic-triangle','WAX_FOR_MEN','wax_men',10,1000),
('t-wfm-crack','Crack Wax (Gluteal Crease)','wfm-crack-wax','WAX_FOR_MEN','wax_men',15,2000),
('t-wfm-buttocks','Buttocks Wax for Men','wfm-buttocks','WAX_FOR_MEN','wax_men',15,1000),
('t-wfm-fullbody-ex','Full Body Wax for Men (excl Intimate)','wfm-fullbody-excl','WAX_FOR_MEN','wax_men',90,14000),
('t-wfm-fullbody-in','Full Body Wax for Men (incl Intimate)','wfm-fullbody-incl','WAX_FOR_MEN','wax_men',120,18000),
('t-wfm-eyebrow','Eyebrow Wax for Men','wfm-eyebrow','WAX_FOR_MEN','wax_men',10,1500)
ON CONFLICT ("id") DO NOTHING;

-- WAX FOR MEN — parents
INSERT INTO "Treatment" ("id","name","slug","brand","category","durationMins","price","isOnlineBookable") VALUES
('t-wfm-chestab-p','Chest & Abdomen Wax for Men','wfm-chest-abdomen-parent','WAX_FOR_MEN','wax_men',20,2000,false),
('t-wfm-arm-p','Arm Waxing for Men','wfm-arm-parent','WAX_FOR_MEN','wax_men',20,1000,false),
('t-wfm-leg-p','Leg Waxing for Men','wfm-leg-parent','WAX_FOR_MEN','wax_men',25,1000,false)
ON CONFLICT ("id") DO NOTHING;

-- WAX FOR MEN — children
INSERT INTO "Treatment" ("id","name","slug","brand","category","parentId","durationMins","price") VALUES
('t-wfm-chestab-both','Chest & Abdomen (Men)','wfm-chest-abdomen','WAX_FOR_MEN','wax_men','t-wfm-chestab-p',30,3500),
('t-wfm-chestab-upper','Upper Chest Only (Men)','wfm-upper-chest','WAX_FOR_MEN','wax_men','t-wfm-chestab-p',20,2500),
('t-wfm-chestab-ab','Abdomen Only (Men)','wfm-abdomen-only','WAX_FOR_MEN','wax_men','t-wfm-chestab-p',15,2000),
('t-wfm-arm-full','Full Arm Wax (Men)','wfm-arm-full','WAX_FOR_MEN','wax_men','t-wfm-arm-p',25,3500),
('t-wfm-arm-half','Half Arm Wax (Men)','wfm-arm-half','WAX_FOR_MEN','wax_men','t-wfm-arm-p',20,2500),
('t-wfm-arm-hand','Hand Wax (Men)','wfm-arm-hand','WAX_FOR_MEN','wax_men','t-wfm-arm-p',10,1000),
('t-wfm-leg-full','Full Leg (Men)','wfm-leg-full','WAX_FOR_MEN','wax_men','t-wfm-leg-p',35,4000),
('t-wfm-leg-half','Half Leg Wax (Men)','wfm-leg-half','WAX_FOR_MEN','wax_men','t-wfm-leg-p',25,3000),
('t-wfm-leg-feet','Feet (Men)','wfm-leg-feet','WAX_FOR_MEN','wax_men','t-wfm-leg-p',10,1000)
ON CONFLICT ("id") DO NOTHING;

-- WAX FOR MEN — add-on
INSERT INTO "Treatment" ("id","name","slug","brand","category","durationMins","price","isAddOn","addOnPrice") VALUES
('t-wfm-addon-jelly','Luxury Healing Jelly Mask (Men)','wfm-addon-jelly-mask','WAX_FOR_MEN','wax_men',10,2000,true,2000)
ON CONFLICT ("id") DO NOTHING;

-- MENHANCEMENTS
INSERT INTO "Treatment" ("id","name","slug","brand","category","durationMins","price","isPom","requiresConsent","isOnlineBookable") VALUES
('t-menh-shock-p','Shockwave Therapy for Improved Erections','menh-shockwave-parent','MENHANCEMENTS','menhancements',30,0,false,true,false),
('t-menh-vet-p','Vacuum Erection Therapy','menh-vacuum-parent','MENHANCEMENTS','menhancements',30,3000,false,true,false),
('t-menh-prp-p','PRP Prick for increased penis size and sensitivity','menh-prp-parent','MENHANCEMENTS','menhancements',45,79900,false,true,false)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Treatment" ("id","name","slug","brand","category","parentId","durationMins","price","requiresConsent") VALUES
('t-menh-shock-single','Shockwave Therapy (single session)','menh-shockwave-single','MENHANCEMENTS','menhancements','t-menh-shock-p',30,39900,true),
('t-menh-shock-case','Shockwave - Case Study','menh-shockwave-case-study','MENHANCEMENTS','menhancements','t-menh-shock-p',30,19900,true),
('t-menh-shock-demo','Shockwave - Demonstration','menh-shockwave-demo','MENHANCEMENTS','menhancements','t-menh-shock-p',15,0,true),
('t-menh-shock-combo','6x Shockwave & PRP Prick Combo (SALE)','menh-shockwave-prp-combo','MENHANCEMENTS','menhancements','t-menh-shock-p',30,174900,true),
('t-menh-vet-therapist','Vacuum Erection Therapy (with therapist)','menh-vacuum-therapist','MENHANCEMENTS','menhancements','t-menh-vet-p',30,5000,true),
('t-menh-vet-solo','Vacuum Pump Solo - use our equipment','menh-vacuum-solo','MENHANCEMENTS','menhancements','t-menh-vet-p',20,3000,true),
('t-menh-prp-single','PRP Prick (single session)','menh-prp-single','MENHANCEMENTS','menhancements','t-menh-prp-p',45,79900,true),
('t-menh-prp-combo','6x PRP Prick and Shockwave Combo (SALE)','menh-prp-shockwave-combo','MENHANCEMENTS','menhancements','t-menh-prp-p',45,174900,true)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Treatment" ("id","name","slug","brand","category","durationMins","price","requiresConsent") VALUES
('t-menh-prp-hair','PRP Hair Restoration x 4 sessions','menh-prp-hair','MENHANCEMENTS','menhancements',45,49900,true),
('t-menh-holetox','Holetox - Consultation','menh-holetox-consult','MENHANCEMENTS','menhancements',15,0,true),
('t-menh-antiwrinkle','Anti Wrinkle Injections - Consultation','menh-antiwrinkle-consult','MENHANCEMENTS','menhancements',15,0,true)
ON CONFLICT ("id") DO NOTHING;

-- SKINCARE TREATMENTS
INSERT INTO "Treatment" ("id","name","slug","brand","category","durationMins","price") VALUES
('t-skin-facial-men','Deep Cleansing Facial for Men','skin-facial-men','WAX_FOR_MEN','skincare',30,3500),
('t-skin-vajacial','Vajacial - Female Intimate Skincare','skin-vajacial','WAX_FOR_WOMEN','skincare',30,4000),
('t-skin-penacial','Penacial - Male Intimate Skincare','skin-penacial','WAX_FOR_MEN','skincare',30,4000),
('t-skin-bacial-w','Back Facial - Bacial for Women','skin-bacial-women','WAX_FOR_WOMEN','skincare',30,4000),
('t-skin-bacial-m','Back Facial - Bacial for Men','skin-bacial-men','WAX_FOR_MEN','skincare',30,4000),
('t-skin-butt-m','Butt Facial for Men','skin-butt-facial-men','WAX_FOR_MEN','skincare',30,4000),
('t-skin-backbutt-m','Back and Butt Facial Combo for Men','skin-back-butt-combo-men','WAX_FOR_MEN','skincare',50,7000)
ON CONFLICT ("id") DO NOTHING;

-- BODY CLIPPERING
INSERT INTO "Treatment" ("id","name","slug","brand","category","durationMins","price") VALUES
('t-clip-back-shoulder','Back and Shoulder Clippering','clip-back-shoulder','WAX_FOR_MEN','clippering',30,4000),
('t-clip-chest-ab','Chest & Abdomen Clippering','clip-chest-abdomen','WAX_FOR_MEN','clippering',25,3500),
('t-clip-crack-butt','Crack and Buttocks Clippering','clip-crack-buttocks','WAX_FOR_MEN','clippering',25,4000),
('t-clip-pubic-scrot','Pubic Area and Scrotum Clippering','clip-pubic-scrotum','WAX_FOR_MEN','clippering',25,4000),
('t-clip-legs','Full Legs Clippering','clip-full-legs','WAX_FOR_MEN','clippering',30,4000),
('t-clip-arms','Full Arms Clippering','clip-full-arms','WAX_FOR_MEN','clippering',25,3500),
('t-clip-fullbody-ex','Full Body Clippering (excl intimate)','clip-fullbody-excl','WAX_FOR_MEN','clippering',75,13000),
('t-clip-fullbody-in','Full Body Clippering (incl intimate)','clip-fullbody-incl','WAX_FOR_MEN','clippering',90,16000)
ON CONFLICT ("id") DO NOTHING;

-- MASSAGE FOR MEN
INSERT INTO "Treatment" ("id","name","slug","brand","category","durationMins","price") VALUES
('t-mass-m-15','Body Massage for Men approx 15 minutes','massage-men-15','WAX_FOR_MEN','massage_men',15,2500),
('t-mass-m-30','Body Massage for Men approx 30 minutes','massage-men-30','WAX_FOR_MEN','massage_men',30,5000),
('t-mass-m-60','Body Massage for Men approx 60 minutes','massage-men-60','WAX_FOR_MEN','massage_men',60,7500),
('t-mass-m-90','Body Massage for Men approx 90 minutes','massage-men-90','WAX_FOR_MEN','massage_men',90,10000),
('t-mass-couples-30-m','Couples Massage approx 30 minutes (Men)','massage-couples-30-men','WAX_FOR_MEN','massage_men',30,7000),
('t-mass-couples-60-m','Couples Massage approx 60 minutes (Men)','massage-couples-60-men','WAX_FOR_MEN','massage_men',60,10000),
('t-mass-couples-train','Couples Massage Training','massage-couples-training','WAX_FOR_MEN','massage_men',60,8000)
ON CONFLICT ("id") DO NOTHING;

-- MASSAGE FOR WOMEN
INSERT INTO "Treatment" ("id","name","slug","brand","category","durationMins","price") VALUES
('t-mass-w-30','Body Massage for Women approx 30 minutes','massage-women-30','WAX_FOR_WOMEN','massage_women',30,4000),
('t-mass-w-60','Body Massage for Women approx 60 minutes','massage-women-60','WAX_FOR_WOMEN','massage_women',60,6000),
('t-mass-couples-30-w','Couples Massage approx 30 minutes (Women)','massage-couples-30-women','WAX_FOR_WOMEN','massage_women',30,7000),
('t-mass-couples-60-w','Couples Massage approx 60 minutes (Women)','massage-couples-60-women','WAX_FOR_WOMEN','massage_women',60,10000)
ON CONFLICT ("id") DO NOTHING;

-- SPRAY TANNING
INSERT INTO "Treatment" ("id","name","slug","brand","category","durationMins","price","requiresPatchTest") VALUES
('t-spray-patch-m','Spray Tan Patch Test (Men)','spray-patch-test-men','WAX_FOR_MEN','spray_tanning',10,0,false),
('t-spray-patch-w','Spray Tan Patch Test (Women)','spray-patch-test-women','WAX_FOR_WOMEN','spray_tanning',10,0,false),
('t-spray-full-w','Full Body Spray Tan for Women','spray-full-women','WAX_FOR_WOMEN','spray_tanning',20,2500,true),
('t-spray-full-m','Full Body Spray Tan for Men','spray-full-men','WAX_FOR_MEN','spray_tanning',20,2500,true)
ON CONFLICT ("id") DO NOTHING;

-- LASH & BROW TINT
INSERT INTO "Treatment" ("id","name","slug","brand","category","durationMins","price","requiresPatchTest") VALUES
('t-lash-patch','Patch Test (Lash & Brow)','lash-brow-patch-test','WAX_FOR_WOMEN','lash_brow',5,0,false),
('t-lash-brow-tint','Eyebrow Tint','lash-eyebrow-tint','WAX_FOR_WOMEN','lash_brow',15,1000,true),
('t-lash-eyelash-tint','Eyelash Tint','lash-eyelash-tint','WAX_FOR_WOMEN','lash_brow',20,1500,true),
('t-lash-combo','Lash and Brow Tint','lash-brow-combo-tint','WAX_FOR_WOMEN','lash_brow',25,2000,true)
ON CONFLICT ("id") DO NOTHING;


-- ============================================
-- 2B: LINK ALL TREATMENTS TO ALL ACTIVE SITES
-- ============================================
INSERT INTO "SiteTreatment" ("siteId", "treatmentId")
SELECT s."id", t."id"
FROM "Site" s
CROSS JOIN "Treatment" t
WHERE s."isActive" = true
ON CONFLICT DO NOTHING;


-- ============================================
-- 2C: ROOMS (2 rooms at each site)
-- ============================================
INSERT INTO "Room" ("siteId", "name")
SELECT s."id", 'Room 1'
FROM "Site" s WHERE s."isActive" = true
ON CONFLICT DO NOTHING;

INSERT INTO "Room" ("siteId", "name")
SELECT s."id", 'Room 2'
FROM "Site" s WHERE s."isActive" = true
ON CONFLICT DO NOTHING;


-- ============================================
-- 2D: DEFAULT STAFF SCHEDULES
-- Mon-Sat 09:00-18:00 for all active users
-- Sunday off
-- ============================================
INSERT INTO "StaffSchedule" ("userId", "siteId", "dayOfWeek", "startTime", "endTime", "isAvailable")
SELECT u."id", u."siteId", d.dow, '09:00', '18:00', true
FROM "User" u
CROSS JOIN (VALUES (0),(1),(2),(3),(4),(5)) AS d(dow)
WHERE u."isActive" = true
ON CONFLICT ("userId", "siteId", "dayOfWeek") DO NOTHING;

-- Sunday = off
INSERT INTO "StaffSchedule" ("userId", "siteId", "dayOfWeek", "startTime", "endTime", "isAvailable")
SELECT u."id", u."siteId", 6, '09:00', '18:00', false
FROM "User" u
WHERE u."isActive" = true
ON CONFLICT ("userId", "siteId", "dayOfWeek") DO NOTHING;


-- ============================================
-- 2E: SET STAFF COLOURS
-- ============================================
UPDATE "User" SET "colour" = '#6366f1' WHERE "role" = 'PRACTITIONER' AND "colour" IS NULL AND "id" = (SELECT "id" FROM "User" WHERE "role" = 'PRACTITIONER' ORDER BY "createdAt" LIMIT 1);
UPDATE "User" SET "colour" = '#f59e0b' WHERE "role" = 'PRACTITIONER' AND "colour" IS NULL AND "id" = (SELECT "id" FROM "User" WHERE "role" = 'PRACTITIONER' AND "colour" IS NULL ORDER BY "createdAt" LIMIT 1);
UPDATE "User" SET "colour" = '#10b981' WHERE "role" = 'PRACTITIONER' AND "colour" IS NULL AND "id" = (SELECT "id" FROM "User" WHERE "role" = 'PRACTITIONER' AND "colour" IS NULL ORDER BY "createdAt" LIMIT 1);
UPDATE "User" SET "colour" = '#ef4444' WHERE "role" = 'ADMIN' AND "colour" IS NULL AND "id" = (SELECT "id" FROM "User" WHERE "role" = 'ADMIN' AND "colour" IS NULL ORDER BY "createdAt" LIMIT 1);
UPDATE "User" SET "colour" = '#8b5cf6' WHERE "role" = 'ADMIN' AND "colour" IS NULL AND "id" = (SELECT "id" FROM "User" WHERE "role" = 'ADMIN' AND "colour" IS NULL ORDER BY "createdAt" LIMIT 1);
UPDATE "User" SET "colour" = '#ec4899' WHERE "colour" IS NULL AND "id" = (SELECT "id" FROM "User" WHERE "colour" IS NULL ORDER BY "createdAt" LIMIT 1);
UPDATE "User" SET "colour" = '#14b8a6' WHERE "colour" IS NULL AND "id" = (SELECT "id" FROM "User" WHERE "colour" IS NULL ORDER BY "createdAt" LIMIT 1);
UPDATE "User" SET "colour" = '#3b82f6' WHERE "colour" IS NULL AND "id" = (SELECT "id" FROM "User" WHERE "colour" IS NULL ORDER BY "createdAt" LIMIT 1);


-- Done!
-- After running this, your booking system is ready.
-- Treatments: ~100+ across all brands
-- Rooms: 2 per active site
-- Staff schedules: Mon-Sat 09:00-18:00, Sunday off
-- All treatments linked to all active sites
