-- CreateEnum
CREATE TYPE "public"."Brand" AS ENUM ('MENHANCEMENTS', 'WAX_FOR_MEN', 'WAX_FOR_WOMEN', 'PLG_UK');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'PRACTITIONER', 'RECEPTION');

-- CreateEnum
CREATE TYPE "public"."SubmissionStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'SIGNED', 'LOCKED', 'AMENDED');

-- CreateEnum
CREATE TYPE "public"."RiskLevel" AS ENUM ('NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

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
    "brand" "public"."Brand" NOT NULL,
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
    "marketingEmail" BOOLEAN NOT NULL DEFAULT false,
    "marketingSms" BOOLEAN NOT NULL DEFAULT false,
    "marketingPhone" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "FormSubmission_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "public"."Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_clientId_key" ON "public"."Client"("clientId");

-- CreateIndex
CREATE INDEX "Client_brand_siteId_idx" ON "public"."Client"("brand", "siteId");

-- CreateIndex
CREATE INDEX "Client_email_idx" ON "public"."Client"("email");

-- CreateIndex
CREATE INDEX "Client_phone_idx" ON "public"."Client"("phone");

-- CreateIndex
CREATE INDEX "Client_lastName_firstName_idx" ON "public"."Client"("lastName", "firstName");

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
CREATE INDEX "Amendment_submissionId_idx" ON "public"."Amendment"("submissionId");

-- CreateIndex
CREATE INDEX "AuditLog_submissionId_idx" ON "public"."AuditLog"("submissionId");

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
ALTER TABLE "public"."FormSubmission" ADD CONSTRAINT "FormSubmission_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "public"."Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FormSubmission" ADD CONSTRAINT "FormSubmission_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FormSubmission" ADD CONSTRAINT "FormSubmission_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Amendment" ADD CONSTRAINT "Amendment_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "public"."FormSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Amendment" ADD CONSTRAINT "Amendment_amendedById_fkey" FOREIGN KEY ("amendedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "public"."FormSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
