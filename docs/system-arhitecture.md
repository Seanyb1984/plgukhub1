# PLG UK HUB: System Architecture (V1.0)

## 1. Project Overview
A dual-branded, multi-site management system built to handle both recruitment/admin (PLG_UK) and CQC-regulated clinical aesthetics (MENHANCEMENTS).

## 2. Technical Stack
- **Framework:** Next.js 15.5 (App Router)
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Auth:** Auth.js (v5 / NextAuth)
- **Storage:** Google Clinical Vault (Google Drive API via Service Account)

## 3. Database Schema Logic (Multi-Tenancy)
The database uses a brand-based logic to toggle UI features and data visibility:
- **User:** id, email, name, role (ADMIN/USER), brand (PLG_UK/MENHANCEMENTS), siteId.
- **Site:** id, name, location, brand (Links users to specific clinics like Manchester/Leeds).
- **Clinical Tables:** TreatmentEpisode, MedicalHistory, ConsentLog, BatchRegister.

## 4. The "Cream Build" Logic
When `user.brand === 'MENHANCEMENTS'`:
- **Theme:** Cream/Gold/Navy palette.
- **Sidebar:** Switches from "Recruitment Hub" to "Clinical Operating System."
- **Pathways:** Enforces the 10 CQC compliance steps (e.g., 24-hour cooling-off periods, V300 prescriptions).

## 5. Storage Architecture (The Clinical Vault)
- **Public Assets:** Supabase Storage (Logos, Icons).
- **Private Records:** Google Drive "Clinical Vault" via `.env` credentials.
- **Hierarchy:** - Root (GOOGLE_DRIVE_PARENT_ID) 
    - [Site Name] 
      - [Patient Name]_[DOB] 
        - [Treatment Date] -> [Photos, Signed Consents, Batch Logs]

## 6. Authentication & Security
- **NextAuth Middleware:** Protects all routes except `/login` and `/api/auth`.
- **JWT Strategy:** Stores `role` and `brand` in the token to prevent unauthorized database access.
- **Bypass Mode:** Current build has an emergency bypass `isPasswordCorrect = true` for dev testing.