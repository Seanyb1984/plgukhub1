# PLG UK Hub — Project Status & Handoff
> Last updated: 2026-02-26 | Branch: `claude/romantic-bohr` | Worktree: `romantic-bohr`

---

## What This Project Is (Finished Vision)

A **private, multi-brand clinical management platform** for PLG UK — covering three brands:
- **MENHANCEMENTS** — Medical aesthetics (POM pathway: Botulinum Toxin etc.)
- **WAX FOR MEN** — Professional male grooming
- **WAX FOR WOMEN** — Professional beauty & waxing

When finished, practitioners at clinics in Manchester, Leeds, Wilmslow, and Wigan will use this app to:

1. **Run the full clinical episode lifecycle** — from initial client consent right through to treatment close-out and aftercare, fully digitally and CQC-compliant.
2. **Log every batch/product used** — traceable batch register for regulatory audit.
3. **Capture before/after photos** — stored securely in Google Drive, linked to the client record.
4. **Send automated aftercare emails** — via Gmail API immediately after treatment.
5. **Complete governance/compliance forms** — Fire Safety, Cleaning Logs, Incident Reports, Staff Training sign-offs, Equipment Checks, Waste Disposal Logs — all stored in the DB with digital signatures.
6. **Run the full POM prescribing pathway** — Medical Director in Manchester prescribes, practitioners treat; the app enforces this split and hard-stops anything that fails safety screening.
7. **Admin oversight** — ADMIN and PRESCRIBER roles can see all episodes, client records, and compliance status across all sites.
8. **Legal watchdog (automated)** — background job monitors regulatory/legal updates and flags compliance alerts.
9. **Knowledge base sync** — aftercare and protocol docs synced from Google Sheets into the DB for use in forms.

The stack: **Next.js 15 App Router · TypeScript · Prisma ORM · PostgreSQL · NextAuth v5 · Tailwind CSS · Google Workspace APIs**.

---

## Current State (What Works Right Now)

### ✅ Infrastructure
- PostgreSQL running in **Docker** locally (`localhost:5432`, db: `plgukhub`, user/pass: `postgres`)
- Prisma schema fully pushed and client generated
- Dev server runs on port 3000 (`npm run dev` in the worktree directory)
- `.env` file exists at project root with local DB URL and NextAuth config (Google API keys are blank — not yet wired)

### ✅ Authentication
- NextAuth v5 credentials login working at `/login`
- Seed data: `admin@plguk.co.uk / password123` (ADMIN role)
- JWT includes `id` and `role` — used by middleware and API routes
- Middleware protects `/admin` (ADMIN/PRESCRIBER only), all other protected routes require login, `/forms/*` is public

### ✅ Pre-Consent Form (`/forms/pre-consent`)
- Full client search (autocomplete against DB)
- Medical history questionnaire with dynamic risk flag logic
- Hard-stop enforcement (refuses to proceed if `hard_stop` flag present)
- Digital signature capture
- Webcam photo capture
- Creates `TreatmentEpisode` in DB with status `CONSENT_SIGNED`
- Returns `episodeRef` to practitioner for handoff to post-treatment form
- **Tested end-to-end — PASS**

### ✅ Post-Treatment Form (`/forms/post-treatment`)
- Loads episode by `episodeRef` via public GET `/api/episodes?ref=...`
- Batch number, product used, lot number, expiry date, dosage, treatment areas, clinical notes, complications
- Aftercare checkbox + optional aftercare email trigger
- Follow-up date and notes
- After-photo capture (camera opens, photos stored — but see known bug below)
- Locks episode: sets `status = CLOSED`, `isLocked = true`, `completedAt`, `lockedAt`
- **Tested end-to-end — PASS**

### ✅ DB Models (all created and migrated)
`User`, `Site`, `Client`, `TreatmentEpisode`, `ClinicalPhoto`, `BatchRegister`, `TreatmentJourney`, `GovernanceLog`, `FormSubmission`, `AuditLog`, `ComplianceAlert`, `KnowledgeBaseEntry`, `StaffTraining`, `Prescriber`, `Inquiry`, `SubjectAccessRequest`, `DataRetentionPolicy`, `FileUpload`, `Amendment`, `Session`

### ✅ Integration Stubs (built, not yet wired to real credentials)
- `src/lib/integrations/gmail-aftercare.ts` — Gmail API via Google Service Account (gracefully skips if `.env` keys missing)
- `src/lib/integrations/google-drive.ts` — Before/after photo upload to client Drive folder
- `src/lib/integrations/google-sheets-kb.ts` — Aftercare/protocol knowledge base sync from Sheets
- `src/lib/integrations/legal-watchdog.ts` — CQC/legal compliance monitoring via Google Custom Search

---

## Known Bugs (Fix Before Production)

### 🔴 CRITICAL — ClinicalPhoto FK Mismatch
**File:** `src/app/api/episodes/route.ts` — PATCH handler, lines ~244–258 (after photos) and ~112–124 (before photos)

**Problem:** When creating `ClinicalPhoto` records, the code sets:
```typescript
treatmentJourneyId: episode.id  // ← WRONG: episode.id is a TreatmentEpisode ID
```
But `ClinicalPhoto.treatmentJourneyId` is a FK to the `TreatmentJourney` model, not `TreatmentEpisode`.
This will throw a Prisma FK violation error whenever photos are submitted through the forms.

**Fix options (pick one):**
1. Add a `treatmentEpisodeId String?` relation directly on `ClinicalPhoto` in the schema, and use that instead.
2. Skip inline DB storage and upload photos straight to Google Drive via the `/api/integrations/google-drive/upload-photo` endpoint — store only the Drive file ID on the episode.

Currently safe because test had no photos. Will break in real use.

### 🟡 MEDIUM — Login Redirects to `/admin` for Everyone
**File:** `src/app/login/page.tsx`

Login page hardcodes `router.push('/admin')` after successful sign-in. Non-admin practitioners (who don't have ADMIN or PRESCRIBER role) get bounced to `/dashboard` by middleware (which doesn't exist yet) and hit a 404.

**Fix:** Make the post-login redirect role-aware:
```typescript
if (role === 'ADMIN' || role === 'PRESCRIBER') router.push('/admin');
else router.push('/forms/pre-consent'); // or /dashboard when built
```

### 🟡 MEDIUM — `/dashboard` Page Missing
Middleware error redirect points to `/dashboard` but the page doesn't exist. Need to either create it or update the redirect target.

---

## What Still Needs Building

### 1. Fix the bugs above (start here)

### 2. Wire Google Integrations
Fill in `.env` (and Vercel env vars for production) with real values:
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx@xxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
GOOGLE_DRIVE_PARENT_ID=<root folder ID for client photos>
GMAIL_SENDER_EMAIL=noreply@plguk.co.uk
GMAIL_SENDER_NAME=PLG UK Hub
GOOGLE_SHEETS_AFTERCARE_ID=<sheet ID>
GOOGLE_SHEETS_PROTOCOLS_ID=<sheet ID>
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=<CSE ID>
NEXTAUTH_SECRET=<random 32-char string>
```
Then test: aftercare email sends on episode close, Drive folder created per client, photos upload.

### 3. Admin Dashboard (`/admin`)
Currently a static placeholder. Needs to be a real dashboard showing:
- All episodes (filterable by brand, site, status, date)
- Client search/lookup
- Batch register overview
- User/site management (create users, assign sites, set roles)
- Compliance alerts from the legal watchdog

### 4. Command Centre (`/command-centre`)
Governance forms are built (`CommandCentreClient.tsx` + `GovernanceFormRenderer`). Needs:
- End-to-end test of each form type (Fire Safety, Cleaning Log, Incident Report, Staff Training, Equipment Check, Waste Disposal)
- Verify `GovernanceLog` records are written to DB correctly on submission
- Signature capture working in all forms

### 5. Treatment Journey (`/treatment-journey`)
Multi-phase journey with facial mapping canvas is built (`TreatmentJourneyClient.tsx`). Needs:
- End-to-end test against DB
- Verify `TreatmentJourney` records created/updated correctly
- Facial mapping canvas verified working
- Prescriber selection (POM pathway) tested

### 6. `/dashboard` Page
Create a practitioner-facing dashboard (non-admin landing page) showing:
- Today's episodes
- Quick links to pre-consent and post-treatment forms
- Pending follow-ups

### 7. Client Record View
No page yet to view a single client's full history (episodes, photos, notes). Needed for admin and prescriber workflows.

### 8. PDF Generation (`src/lib/pdf/`)
Stub exists. Needs implementing — generate a signed consent PDF per episode for the client record.

### 9. Subject Access Request / Data Retention
`SubjectAccessRequest` and `DataRetentionPolicy` models exist. No UI or automation yet. GDPR requirement.

### 10. Production Deployment
- Vercel project configured, previous deployment commits show build issues were fixed
- Need real `DATABASE_URL` (production Postgres — Neon, Railway, or Supabase recommended)
- Set all env vars in Vercel dashboard
- Run `npx prisma migrate deploy` against production DB (not `db push`)
- Seed production with real site and user data

---

## File Map (Key Files)

```
src/
  app/
    login/page.tsx              ← Fix: hardcoded /admin redirect
    admin/page.tsx              ← Placeholder — needs real dashboard
    forms/
      pre-consent/page.tsx      ← ✅ Working
      post-treatment/page.tsx   ← ✅ Working
    command-centre/
      page.tsx                  ← Untested
      CommandCentreClient.tsx   ← Built
    treatment-journey/
      page.tsx                  ← Untested
      TreatmentJourneyClient.tsx ← Built
    api/
      episodes/route.ts         ← ✅ GET public, POST+PATCH auth — fix photo FK
      clients/search/route.ts   ← ✅ Client autocomplete
      integrations/
        google-drive/upload-photo/route.ts ← Built, untested with real creds
  lib/
    integrations/
      gmail-aftercare.ts        ← Built, needs env vars
      google-drive.ts           ← Built, needs env vars
      google-sheets-kb.ts       ← Built, needs env vars
      legal-watchdog.ts         ← Built, needs env vars
  middleware.ts                 ← ✅ Role-based route protection
  auth.ts                       ← ✅ NextAuth v5 credentials
prisma/
  schema.prisma                 ← ✅ All models, pushed to local DB
.env                            ← Local dev only — Google keys blank
```

---

## How to Resume Development

```bash
# 1. Start Docker DB (if not running)
docker start plgukhub-db

# 2. Start dev server
cd "C:\Users\m3nha\Desktop\Seany CLaude\Forms\plgukhub\.claude\worktrees\romantic-bohr"
npm run dev

# 3. Login
# URL: http://localhost:3000/login
# Email: admin@plguk.co.uk
# Password: password123

# 4. Test forms
# Pre-consent:    http://localhost:3000/forms/pre-consent
# Post-treatment: http://localhost:3000/forms/post-treatment
```

---

## Recommended Next Session Order
1. **Fix ClinicalPhoto FK bug** (critical — breaks photo capture in production)
2. **Fix login redirect** (role-aware, add `/dashboard` page stub)
3. **Test Command Centre forms end-to-end**
4. **Test Treatment Journey end-to-end**
5. **Build real Admin Dashboard**
6. **Wire Google integrations with real credentials and test**
7. **PDF consent generation**
8. **Production deployment**
