
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."Brand" AS ENUM ('MENHANCEMENTS', 'WAX_FOR_MEN', 'WAX_FOR_WOMEN', 'PLG_UK');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'PRESCRIBER', 'PRACTITIONER', 'STAFF');

-- CreateEnum
CREATE TYPE "public"."SubmissionStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'SIGNED', 'LOCKED', 'AMENDED');

-- CreateEnum
CREATE TYPE "public"."RiskLevel" AS ENUM ('NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."ClientStatus" AS ENUM ('PROSPECT', 'ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."TreatmentPhase" AS ENUM ('IDENTIFICATION', 'POM_TRIAGE', 'LEGAL_CONSENT', 'CLINICAL_RECORD', 'CLOSE_OUT');

-- CreateEnum
CREATE TYPE "public"."TreatmentJourneyStatus" AS ENUM ('IN_PROGRESS', 'STOPPED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."GovernanceFormType" AS ENUM ('FIRE_SAFETY_CHECK', 'CLEANING_LOG', 'STAFF_TRAINING_SIGNOFF', 'EQUIPMENT_CHECK', 'INCIDENT_REPORT', 'WASTE_DISPOSAL_LOG');

-- CreateEnum
CREATE TYPE "public"."EpisodeStatus" AS ENUM ('OPEN', 'CONSENT_PENDING', 'CONSENT_SIGNED', 'IN_TREATMENT', 'TREATMENT_COMPLETE', 'CLOSED', 'CANCELLED', 'HARD_STOPPED');

-- CreateTable
CREATE TABLE "public"."Site" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" "public"."Brand" NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL,
    "brand" "public"."Brand" NOT NULL,
    "siteId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Prescriber" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "gmcNumber" TEXT NOT NULL,
    "prescriberType" TEXT NOT NULL DEFAULT 'Doctor',
    "specialisations" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "licenceVerifiedAt" TIMESTAMP(3),
    "licenceExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prescriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Client" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "status" "public"."ClientStatus" NOT NULL DEFAULT 'PROSPECT',
    "isProspect" BOOLEAN NOT NULL DEFAULT true,
    "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
    "brands" "public"."Brand"[],
    "siteId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "postcode" TEXT,
    "country" TEXT DEFAULT 'United Kingdom',
    "emergencyName" TEXT,
    "emergencyPhone" TEXT,
    "emergencyRelation" TEXT,
    "hasBloodDisorder" BOOLEAN NOT NULL DEFAULT false,
    "isPregnant" BOOLEAN NOT NULL DEFAULT false,
    "hasAllergies" BOOLEAN NOT NULL DEFAULT false,
    "allergyDetails" TEXT,
    "currentMedications" TEXT,
    "medicalNotes" TEXT,
    "marketingEmail" BOOLEAN NOT NULL DEFAULT false,
    "marketingSms" BOOLEAN NOT NULL DEFAULT false,
    "marketingPhone" BOOLEAN NOT NULL DEFAULT false,
    "googleDriveFolderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Inquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "brand" "public"."Brand" NOT NULL,
    "message" TEXT,
    "isConverted" BOOLEAN NOT NULL DEFAULT false,
    "convertedAt" TIMESTAMP(3),
    "convertedClientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TreatmentEpisode" (
    "id" TEXT NOT NULL,
    "episodeRef" TEXT NOT NULL,
    "brand" "public"."Brand" NOT NULL,
    "siteId" TEXT NOT NULL,
    "status" "public"."EpisodeStatus" NOT NULL DEFAULT 'OPEN',
    "clientId" TEXT NOT NULL,
    "practitionerId" TEXT NOT NULL,
    "isPom" BOOLEAN NOT NULL DEFAULT false,
    "prescriberId" TEXT,
    "prescriberUserId" TEXT,
    "gmcNumberAtTime" TEXT,
    "faceToFaceDate" TIMESTAMP(3),
    "medicalHistory" JSONB,
    "safetyScreening" JSONB,
    "safetyScreeningPass" BOOLEAN,
    "hardStopReason" TEXT,
    "dynamicRisks" JSONB,
    "consentDeclaration" TEXT,
    "signatureData" TEXT,
    "signedByName" TEXT,
    "signedAt" TIMESTAMP(3),
    "beforePhotoIds" TEXT[],
    "webcamCaptureData" TEXT,
    "treatmentType" TEXT,
    "treatmentAreas" TEXT[],
    "productUsed" TEXT,
    "batchRegisterId" TEXT,
    "batchNumber" TEXT,
    "lotNumber" TEXT,
    "dosage" TEXT,
    "injectionSites" JSONB,
    "clinicalNotes" TEXT,
    "complications" TEXT,
    "afterPhotoIds" TEXT[],
    "aftercareProvided" BOOLEAN NOT NULL DEFAULT false,
    "aftercareEmailSent" BOOLEAN NOT NULL DEFAULT false,
    "aftercareEmailSentAt" TIMESTAMP(3),
    "aftercareTemplateId" TEXT,
    "followUpDate" TIMESTAMP(3),
    "followUpNotes" TEXT,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedAt" TIMESTAMP(3),
    "lockedById" TEXT,
    "lockReason" TEXT,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancelReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TreatmentEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BatchRegister" (
    "id" TEXT NOT NULL,
    "brand" "public"."Brand" NOT NULL,
    "siteId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "manufacturer" TEXT,
    "batchNumber" TEXT NOT NULL,
    "lotNumber" TEXT,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "supplier" TEXT,
    "quantityReceived" INTEGER NOT NULL DEFAULT 0,
    "quantityUsed" INTEGER NOT NULL DEFAULT 0,
    "quantityRemaining" INTEGER NOT NULL DEFAULT 0,
    "unitOfMeasure" TEXT NOT NULL DEFAULT 'units',
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receivedById" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BatchRegister_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TreatmentJourney" (
    "id" TEXT NOT NULL,
    "journeyNumber" TEXT NOT NULL,
    "brand" "public"."Brand" NOT NULL,
    "siteId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "practitionerId" TEXT NOT NULL,
    "currentPhase" "public"."TreatmentPhase" NOT NULL DEFAULT 'IDENTIFICATION',
    "status" "public"."TreatmentJourneyStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "identificationCompletedAt" TIMESTAMP(3),
    "isPomTreatment" BOOLEAN NOT NULL DEFAULT false,
    "prescriberId" TEXT,
    "prescriberUserId" TEXT,
    "gmcNumberVerified" TEXT,
    "faceToFaceDate" TIMESTAMP(3),
    "pomTriageCompletedAt" TIMESTAMP(3),
    "pomNotes" TEXT,
    "safetyScreeningData" JSONB,
    "safetyScreeningPassed" BOOLEAN,
    "stopReason" TEXT,
    "consentDeclaration" TEXT,
    "signatureData" TEXT,
    "signedByName" TEXT,
    "signedAt" TIMESTAMP(3),
    "consentCompletedAt" TIMESTAMP(3),
    "treatmentType" TEXT,
    "treatmentArea" TEXT[],
    "productUsed" TEXT,
    "batchNumber" TEXT,
    "lotNumber" TEXT,
    "expiryDate" TIMESTAMP(3),
    "dosage" TEXT,
    "injectionSites" JSONB,
    "clinicalNotes" TEXT,
    "complications" TEXT,
    "clinicalRecordCompletedAt" TIMESTAMP(3),
    "aftercareProvided" BOOLEAN NOT NULL DEFAULT false,
    "aftercareEmailSent" BOOLEAN NOT NULL DEFAULT false,
    "aftercareEmailSentAt" TIMESTAMP(3),
    "followUpDate" TIMESTAMP(3),
    "followUpNotes" TEXT,
    "closeOutCompletedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancelReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TreatmentJourney_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ClinicalPhoto" (
    "id" TEXT NOT NULL,
    "treatmentJourneyId" TEXT,
    "treatmentEpisodeId" TEXT,
    "clientId" TEXT NOT NULL,
    "photoType" TEXT NOT NULL,
    "phase" "public"."TreatmentPhase" NOT NULL,
    "imageData" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT 'image/jpeg',
    "fileName" TEXT,
    "facialMappingData" JSONB,
    "googleDriveFileId" TEXT,
    "googleDriveSynced" BOOLEAN NOT NULL DEFAULT false,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "capturedById" TEXT,

    CONSTRAINT "ClinicalPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FormSubmission" (
    "id" TEXT NOT NULL,
    "formType" TEXT NOT NULL,
    "formVersion" TEXT NOT NULL DEFAULT '1.0',
    "brand" "public"."Brand" NOT NULL,
    "siteId" TEXT NOT NULL,
    "clientId" TEXT,
    "appointmentId" TEXT,
    "data" JSONB NOT NULL,
    "status" "public"."SubmissionStatus" NOT NULL DEFAULT 'DRAFT',
    "riskLevel" "public"."RiskLevel" NOT NULL DEFAULT 'NONE',
    "riskFlags" TEXT[],
    "requiresEscalation" BOOLEAN NOT NULL DEFAULT false,
    "escalationReason" TEXT,
    "escalatedAt" TIMESTAMP(3),
    "escalatedToId" TEXT,
    "signatureData" TEXT,
    "signedAt" TIMESTAMP(3),
    "signedByName" TEXT,
    "signedByIp" TEXT,
    "practitionerId" TEXT,
    "draftSavedAt" TIMESTAMP(3),
    "resumeToken" TEXT,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedAt" TIMESTAMP(3),
    "lockedReason" TEXT,
    "pdfPath" TEXT,
    "pdfGeneratedAt" TIMESTAMP(3),
    "googleDriveFileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "FormSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GovernanceLog" (
    "id" TEXT NOT NULL,
    "formType" "public"."GovernanceFormType" NOT NULL,
    "brand" "public"."Brand" NOT NULL,
    "siteId" TEXT NOT NULL,
    "completedById" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "notes" TEXT,
    "signatureData" TEXT,
    "isCompliant" BOOLEAN NOT NULL DEFAULT true,
    "issues" TEXT[],
    "followUpRequired" BOOLEAN NOT NULL DEFAULT false,
    "followUpDate" TIMESTAMP(3),
    "followUpNotes" TEXT,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GovernanceLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StaffTraining" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trainingType" TEXT NOT NULL,
    "trainingDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "certReference" TEXT,
    "signatureData" TEXT,
    "assessorName" TEXT,
    "assessorSignature" TEXT,
    "notes" TEXT,
    "isPassed" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StaffTraining_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ComplianceAlert" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "url" TEXT,
    "relevance" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'INFO',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isDismissed" BOOLEAN NOT NULL DEFAULT false,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComplianceAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KnowledgeBaseEntry" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "brand" "public"."Brand",
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "sheetId" TEXT,
    "sheetRange" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeBaseEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Amendment" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "changedFields" JSONB NOT NULL,
    "newData" JSONB NOT NULL,
    "signatureData" TEXT,
    "signedAt" TIMESTAMP(3),
    "signedByName" TEXT,
    "amendedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Amendment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT,
    "treatmentJourneyId" TEXT,
    "action" TEXT NOT NULL,
    "userId" TEXT,
    "previousData" JSONB,
    "newData" JSONB,
    "changedFields" TEXT[],
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FileUpload" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT,
    "fieldName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "googleDriveFileId" TEXT,
    "uploadedById" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DataRetentionPolicy" (
    "id" TEXT NOT NULL,
    "formType" TEXT NOT NULL,
    "retentionDays" INTEGER NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataRetentionPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubjectAccessRequest" (
    "id" TEXT NOT NULL,
    "requestorEmail" TEXT NOT NULL,
    "requestorPhone" TEXT,
    "requestorName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "processedAt" TIMESTAMP(3),
    "processedById" TEXT,
    "exportPath" TEXT,
    "downloadToken" TEXT,
    "downloadExpires" TIMESTAMP(3),
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubjectAccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Site_brand_idx" ON "public"."Site"("brand");

-- CreateIndex
CREATE UNIQUE INDEX "Site_name_brand_key" ON "public"."Site"("name", "brand");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_brand_siteId_idx" ON "public"."User"("brand", "siteId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "public"."User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Prescriber_userId_key" ON "public"."Prescriber"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Prescriber_gmcNumber_key" ON "public"."Prescriber"("gmcNumber");

-- CreateIndex
CREATE INDEX "Prescriber_gmcNumber_idx" ON "public"."Prescriber"("gmcNumber");

-- CreateIndex
CREATE INDEX "Prescriber_isActive_idx" ON "public"."Prescriber"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "public"."Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_clientId_key" ON "public"."Client"("clientId");

-- CreateIndex
CREATE INDEX "Client_status_idx" ON "public"."Client"("status");

-- CreateIndex
CREATE INDEX "Client_email_idx" ON "public"."Client"("email");

-- CreateIndex
CREATE INDEX "Client_phone_idx" ON "public"."Client"("phone");

-- CreateIndex
CREATE INDEX "Client_lastName_firstName_idx" ON "public"."Client"("lastName", "firstName");

-- CreateIndex
CREATE INDEX "Client_siteId_idx" ON "public"."Client"("siteId");

-- CreateIndex
CREATE INDEX "Inquiry_brand_idx" ON "public"."Inquiry"("brand");

-- CreateIndex
CREATE INDEX "Inquiry_isConverted_idx" ON "public"."Inquiry"("isConverted");

-- CreateIndex
CREATE INDEX "Inquiry_email_idx" ON "public"."Inquiry"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TreatmentEpisode_episodeRef_key" ON "public"."TreatmentEpisode"("episodeRef");

-- CreateIndex
CREATE INDEX "TreatmentEpisode_brand_siteId_idx" ON "public"."TreatmentEpisode"("brand", "siteId");

-- CreateIndex
CREATE INDEX "TreatmentEpisode_clientId_idx" ON "public"."TreatmentEpisode"("clientId");

-- CreateIndex
CREATE INDEX "TreatmentEpisode_practitionerId_idx" ON "public"."TreatmentEpisode"("practitionerId");

-- CreateIndex
CREATE INDEX "TreatmentEpisode_status_idx" ON "public"."TreatmentEpisode"("status");

-- CreateIndex
CREATE INDEX "TreatmentEpisode_createdAt_idx" ON "public"."TreatmentEpisode"("createdAt");

-- CreateIndex
CREATE INDEX "TreatmentEpisode_batchRegisterId_idx" ON "public"."TreatmentEpisode"("batchRegisterId");

-- CreateIndex
CREATE INDEX "BatchRegister_brand_siteId_idx" ON "public"."BatchRegister"("brand", "siteId");

-- CreateIndex
CREATE INDEX "BatchRegister_productName_idx" ON "public"."BatchRegister"("productName");

-- CreateIndex
CREATE INDEX "BatchRegister_expiryDate_idx" ON "public"."BatchRegister"("expiryDate");

-- CreateIndex
CREATE INDEX "BatchRegister_isActive_idx" ON "public"."BatchRegister"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "BatchRegister_batchNumber_productName_brand_key" ON "public"."BatchRegister"("batchNumber", "productName", "brand");

-- CreateIndex
CREATE UNIQUE INDEX "TreatmentJourney_journeyNumber_key" ON "public"."TreatmentJourney"("journeyNumber");

-- CreateIndex
CREATE INDEX "TreatmentJourney_brand_siteId_idx" ON "public"."TreatmentJourney"("brand", "siteId");

-- CreateIndex
CREATE INDEX "TreatmentJourney_clientId_idx" ON "public"."TreatmentJourney"("clientId");

-- CreateIndex
CREATE INDEX "TreatmentJourney_practitionerId_idx" ON "public"."TreatmentJourney"("practitionerId");

-- CreateIndex
CREATE INDEX "TreatmentJourney_status_idx" ON "public"."TreatmentJourney"("status");

-- CreateIndex
CREATE INDEX "TreatmentJourney_currentPhase_idx" ON "public"."TreatmentJourney"("currentPhase");

-- CreateIndex
CREATE INDEX "TreatmentJourney_createdAt_idx" ON "public"."TreatmentJourney"("createdAt");

-- CreateIndex
CREATE INDEX "ClinicalPhoto_treatmentJourneyId_idx" ON "public"."ClinicalPhoto"("treatmentJourneyId");

-- CreateIndex
CREATE INDEX "ClinicalPhoto_clientId_idx" ON "public"."ClinicalPhoto"("clientId");

-- CreateIndex
CREATE INDEX "ClinicalPhoto_photoType_idx" ON "public"."ClinicalPhoto"("photoType");

-- CreateIndex
CREATE UNIQUE INDEX "FormSubmission_resumeToken_key" ON "public"."FormSubmission"("resumeToken");

-- CreateIndex
CREATE INDEX "FormSubmission_brand_siteId_idx" ON "public"."FormSubmission"("brand", "siteId");

-- CreateIndex
CREATE INDEX "FormSubmission_formType_idx" ON "public"."FormSubmission"("formType");

-- CreateIndex
CREATE INDEX "FormSubmission_clientId_idx" ON "public"."FormSubmission"("clientId");

-- CreateIndex
CREATE INDEX "FormSubmission_appointmentId_idx" ON "public"."FormSubmission"("appointmentId");

-- CreateIndex
CREATE INDEX "FormSubmission_status_idx" ON "public"."FormSubmission"("status");

-- CreateIndex
CREATE INDEX "FormSubmission_riskLevel_idx" ON "public"."FormSubmission"("riskLevel");

-- CreateIndex
CREATE INDEX "FormSubmission_createdAt_idx" ON "public"."FormSubmission"("createdAt");

-- CreateIndex
CREATE INDEX "GovernanceLog_formType_idx" ON "public"."GovernanceLog"("formType");

-- CreateIndex
CREATE INDEX "GovernanceLog_brand_siteId_idx" ON "public"."GovernanceLog"("brand", "siteId");

-- CreateIndex
CREATE INDEX "GovernanceLog_completedAt_idx" ON "public"."GovernanceLog"("completedAt");

-- CreateIndex
CREATE INDEX "GovernanceLog_isCompliant_idx" ON "public"."GovernanceLog"("isCompliant");

-- CreateIndex
CREATE INDEX "StaffTraining_userId_idx" ON "public"."StaffTraining"("userId");

-- CreateIndex
CREATE INDEX "StaffTraining_trainingType_idx" ON "public"."StaffTraining"("trainingType");

-- CreateIndex
CREATE INDEX "StaffTraining_expiryDate_idx" ON "public"."StaffTraining"("expiryDate");

-- CreateIndex
CREATE INDEX "ComplianceAlert_source_idx" ON "public"."ComplianceAlert"("source");

-- CreateIndex
CREATE INDEX "ComplianceAlert_severity_idx" ON "public"."ComplianceAlert"("severity");

-- CreateIndex
CREATE INDEX "ComplianceAlert_isRead_idx" ON "public"."ComplianceAlert"("isRead");

-- CreateIndex
CREATE INDEX "ComplianceAlert_scannedAt_idx" ON "public"."ComplianceAlert"("scannedAt");

-- CreateIndex
CREATE INDEX "KnowledgeBaseEntry_category_idx" ON "public"."KnowledgeBaseEntry"("category");

-- CreateIndex
CREATE INDEX "KnowledgeBaseEntry_brand_idx" ON "public"."KnowledgeBaseEntry"("brand");

-- CreateIndex
CREATE INDEX "KnowledgeBaseEntry_isActive_idx" ON "public"."KnowledgeBaseEntry"("isActive");

-- CreateIndex
CREATE INDEX "Amendment_submissionId_idx" ON "public"."Amendment"("submissionId");

-- CreateIndex
CREATE INDEX "AuditLog_submissionId_idx" ON "public"."AuditLog"("submissionId");

-- CreateIndex
CREATE INDEX "AuditLog_treatmentJourneyId_idx" ON "public"."AuditLog"("treatmentJourneyId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "public"."AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "public"."AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "public"."AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "FileUpload_submissionId_idx" ON "public"."FileUpload"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "DataRetentionPolicy_formType_key" ON "public"."DataRetentionPolicy"("formType");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectAccessRequest_downloadToken_key" ON "public"."SubjectAccessRequest"("downloadToken");

-- CreateIndex
CREATE INDEX "SubjectAccessRequest_requestorEmail_idx" ON "public"."SubjectAccessRequest"("requestorEmail");

-- CreateIndex
CREATE INDEX "SubjectAccessRequest_status_idx" ON "public"."SubjectAccessRequest"("status");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "public"."Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Client" ADD CONSTRAINT "Client_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "public"."Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TreatmentEpisode" ADD CONSTRAINT "TreatmentEpisode_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "public"."Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TreatmentEpisode" ADD CONSTRAINT "TreatmentEpisode_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TreatmentEpisode" ADD CONSTRAINT "TreatmentEpisode_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TreatmentEpisode" ADD CONSTRAINT "TreatmentEpisode_prescriberId_fkey" FOREIGN KEY ("prescriberId") REFERENCES "public"."Prescriber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TreatmentEpisode" ADD CONSTRAINT "TreatmentEpisode_prescriberUserId_fkey" FOREIGN KEY ("prescriberUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TreatmentEpisode" ADD CONSTRAINT "TreatmentEpisode_batchRegisterId_fkey" FOREIGN KEY ("batchRegisterId") REFERENCES "public"."BatchRegister"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TreatmentJourney" ADD CONSTRAINT "TreatmentJourney_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "public"."Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TreatmentJourney" ADD CONSTRAINT "TreatmentJourney_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TreatmentJourney" ADD CONSTRAINT "TreatmentJourney_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TreatmentJourney" ADD CONSTRAINT "TreatmentJourney_prescriberId_fkey" FOREIGN KEY ("prescriberId") REFERENCES "public"."Prescriber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TreatmentJourney" ADD CONSTRAINT "TreatmentJourney_prescriberUserId_fkey" FOREIGN KEY ("prescriberUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClinicalPhoto" ADD CONSTRAINT "ClinicalPhoto_treatmentJourneyId_fkey" FOREIGN KEY ("treatmentJourneyId") REFERENCES "public"."TreatmentJourney"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClinicalPhoto" ADD CONSTRAINT "ClinicalPhoto_treatmentEpisodeId_fkey" FOREIGN KEY ("treatmentEpisodeId") REFERENCES "public"."TreatmentEpisode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClinicalPhoto" ADD CONSTRAINT "ClinicalPhoto_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FormSubmission" ADD CONSTRAINT "FormSubmission_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "public"."Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FormSubmission" ADD CONSTRAINT "FormSubmission_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FormSubmission" ADD CONSTRAINT "FormSubmission_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GovernanceLog" ADD CONSTRAINT "GovernanceLog_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "public"."Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GovernanceLog" ADD CONSTRAINT "GovernanceLog_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StaffTraining" ADD CONSTRAINT "StaffTraining_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Amendment" ADD CONSTRAINT "Amendment_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "public"."FormSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Amendment" ADD CONSTRAINT "Amendment_amendedById_fkey" FOREIGN KEY ("amendedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "public"."FormSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_treatmentJourneyId_fkey" FOREIGN KEY ("treatmentJourneyId") REFERENCES "public"."TreatmentJourney"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

