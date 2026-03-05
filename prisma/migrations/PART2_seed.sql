-- ============================================
-- PART 2: SEED DATA — Run this AFTER Part 1 succeeds
-- ============================================

-- WAX FOR WOMEN — standalone
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

-- WAX FOR WOMEN — parents
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

-- WAX FOR MEN — standalone
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

-- MENHANCEMENTS — parents
INSERT INTO "Treatment" ("id","name","slug","brand","category","durationMins","price","isPom","requiresConsent","isOnlineBookable") VALUES
('t-menh-shock-p','Shockwave Therapy for Improved Erections','menh-shockwave-parent','MENHANCEMENTS','menhancements',30,0,false,true,false),
('t-menh-vet-p','Vacuum Erection Therapy','menh-vacuum-parent','MENHANCEMENTS','menhancements',30,3000,false,true,false),
('t-menh-prp-p','PRP Prick for increased penis size and sensitivity','menh-prp-parent','MENHANCEMENTS','menhancements',45,79900,false,true,false)
ON CONFLICT ("id") DO NOTHING;

-- MENHANCEMENTS — children
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

-- MENHANCEMENTS — standalone
INSERT INTO "Treatment" ("id","name","slug","brand","category","durationMins","price","requiresConsent") VALUES
('t-menh-prp-hair','PRP Hair Restoration x 4 sessions','menh-prp-hair','MENHANCEMENTS','menhancements',45,49900,true),
('t-menh-holetox','Holetox - Consultation','menh-holetox-consult','MENHANCEMENTS','menhancements',15,0,true),
('t-menh-antiwrinkle','Anti Wrinkle Injections - Consultation','menh-antiwrinkle-consult','MENHANCEMENTS','menhancements',15,0,true)
ON CONFLICT ("id") DO NOTHING;

-- SKINCARE
INSERT INTO "Treatment" ("id","name","slug","brand","category","durationMins","price") VALUES
('t-skin-facial-men','Deep Cleansing Facial for Men','skin-facial-men','WAX_FOR_MEN','skincare',30,3500),
('t-skin-vajacial','Vajacial - Female Intimate Skincare','skin-vajacial','WAX_FOR_WOMEN','skincare',30,4000),
('t-skin-penacial','Penacial - Male Intimate Skincare','skin-penacial','WAX_FOR_MEN','skincare',30,4000),
('t-skin-bacial-w','Back Facial - Bacial for Women','skin-bacial-women','WAX_FOR_WOMEN','skincare',30,4000),
('t-skin-bacial-m','Back Facial - Bacial for Men','skin-bacial-men','WAX_FOR_MEN','skincare',30,4000),
('t-skin-butt-m','Butt Facial for Men','skin-butt-facial-men','WAX_FOR_MEN','skincare',30,4000),
('t-skin-backbutt-m','Back and Butt Facial Combo for Men','skin-back-butt-combo-men','WAX_FOR_MEN','skincare',50,7000)
ON CONFLICT ("id") DO NOTHING;

-- CLIPPERING
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

-- MASSAGE MEN
INSERT INTO "Treatment" ("id","name","slug","brand","category","durationMins","price") VALUES
('t-mass-m-15','Body Massage for Men approx 15 minutes','massage-men-15','WAX_FOR_MEN','massage_men',15,2500),
('t-mass-m-30','Body Massage for Men approx 30 minutes','massage-men-30','WAX_FOR_MEN','massage_men',30,5000),
('t-mass-m-60','Body Massage for Men approx 60 minutes','massage-men-60','WAX_FOR_MEN','massage_men',60,7500),
('t-mass-m-90','Body Massage for Men approx 90 minutes','massage-men-90','WAX_FOR_MEN','massage_men',90,10000),
('t-mass-couples-30-m','Couples Massage approx 30 minutes (Men)','massage-couples-30-men','WAX_FOR_MEN','massage_men',30,7000),
('t-mass-couples-60-m','Couples Massage approx 60 minutes (Men)','massage-couples-60-men','WAX_FOR_MEN','massage_men',60,10000),
('t-mass-couples-train','Couples Massage Training','massage-couples-training','WAX_FOR_MEN','massage_men',60,8000)
ON CONFLICT ("id") DO NOTHING;

-- MASSAGE WOMEN
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

-- LASH & BROW
INSERT INTO "Treatment" ("id","name","slug","brand","category","durationMins","price","requiresPatchTest") VALUES
('t-lash-patch','Patch Test (Lash & Brow)','lash-brow-patch-test','WAX_FOR_WOMEN','lash_brow',5,0,false),
('t-lash-brow-tint','Eyebrow Tint','lash-eyebrow-tint','WAX_FOR_WOMEN','lash_brow',15,1000,true),
('t-lash-eyelash-tint','Eyelash Tint','lash-eyelash-tint','WAX_FOR_WOMEN','lash_brow',20,1500,true),
('t-lash-combo','Lash and Brow Tint','lash-brow-combo-tint','WAX_FOR_WOMEN','lash_brow',25,2000,true)
ON CONFLICT ("id") DO NOTHING;

-- LINK ALL TREATMENTS TO ALL ACTIVE SITES
INSERT INTO "SiteTreatment" ("siteId", "treatmentId")
SELECT s."id", t."id"
FROM "Site" s
CROSS JOIN "Treatment" t
WHERE s."isActive" = true
ON CONFLICT DO NOTHING;

-- ROOMS (2 per site)
INSERT INTO "Room" ("siteId", "name")
SELECT s."id", 'Room 1'
FROM "Site" s WHERE s."isActive" = true
ON CONFLICT DO NOTHING;

INSERT INTO "Room" ("siteId", "name")
SELECT s."id", 'Room 2'
FROM "Site" s WHERE s."isActive" = true
ON CONFLICT DO NOTHING;

-- STAFF SCHEDULES: Mon-Sat 09:00-18:00
INSERT INTO "StaffSchedule" ("userId", "siteId", "dayOfWeek", "startTime", "endTime", "isAvailable")
SELECT u."id", u."siteId", d.dow, '09:00', '18:00', true
FROM "User" u
CROSS JOIN (VALUES (0),(1),(2),(3),(4),(5)) AS d(dow)
WHERE u."isActive" = true
ON CONFLICT ("userId", "siteId", "dayOfWeek") DO NOTHING;

-- Sunday off
INSERT INTO "StaffSchedule" ("userId", "siteId", "dayOfWeek", "startTime", "endTime", "isAvailable")
SELECT u."id", u."siteId", 6, '09:00', '18:00', false
FROM "User" u
WHERE u."isActive" = true
ON CONFLICT ("userId", "siteId", "dayOfWeek") DO NOTHING;

-- STAFF COLOURS
UPDATE "User" SET "colour" = '#6366f1' WHERE "colour" IS NULL AND "id" = (SELECT "id" FROM "User" WHERE "colour" IS NULL ORDER BY "createdAt" LIMIT 1);
UPDATE "User" SET "colour" = '#f59e0b' WHERE "colour" IS NULL AND "id" = (SELECT "id" FROM "User" WHERE "colour" IS NULL ORDER BY "createdAt" LIMIT 1);
UPDATE "User" SET "colour" = '#10b981' WHERE "colour" IS NULL AND "id" = (SELECT "id" FROM "User" WHERE "colour" IS NULL ORDER BY "createdAt" LIMIT 1);
UPDATE "User" SET "colour" = '#ef4444' WHERE "colour" IS NULL AND "id" = (SELECT "id" FROM "User" WHERE "colour" IS NULL ORDER BY "createdAt" LIMIT 1);
UPDATE "User" SET "colour" = '#8b5cf6' WHERE "colour" IS NULL AND "id" = (SELECT "id" FROM "User" WHERE "colour" IS NULL ORDER BY "createdAt" LIMIT 1);
UPDATE "User" SET "colour" = '#ec4899' WHERE "colour" IS NULL AND "id" = (SELECT "id" FROM "User" WHERE "colour" IS NULL ORDER BY "createdAt" LIMIT 1);
UPDATE "User" SET "colour" = '#14b8a6' WHERE "colour" IS NULL AND "id" = (SELECT "id" FROM "User" WHERE "colour" IS NULL ORDER BY "createdAt" LIMIT 1);
UPDATE "User" SET "colour" = '#3b82f6' WHERE "colour" IS NULL AND "id" = (SELECT "id" FROM "User" WHERE "colour" IS NULL ORDER BY "createdAt" LIMIT 1);
