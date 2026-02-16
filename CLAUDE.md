# CLAUDE.md - PLG UK Hub

## Project Overview

PLG UK Hub is a full-stack digital forms platform for clinical practices and service businesses (clinics, waxing salons). It supports multi-brand, multi-site operations with GDPR-compliant form management, e-signatures, treatment episode tracking, and audit trails.

**Stack**: Next.js 16 (App Router) / React 19 / TypeScript 5 / PostgreSQL / Prisma 6 / Tailwind CSS 4

## Quick Reference Commands

```bash
# Development
npm run dev            # Start dev server (runs prisma generate first)
npm run build          # Production build
npm run lint           # ESLint check

# Database
npm run db:push        # Push schema changes to database
npm run db:seed        # Seed demo data (ts-node prisma/seed.ts)
npm run db:studio      # Open Prisma Studio GUI
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin dashboard (clients, submissions, forms, enquiries)
│   ├── api/                # API routes (auth, forms, submissions, clients, episodes)
│   ├── forms/              # Public-facing form pages
│   └── login/              # Auth page
├── components/
│   ├── ui/                 # Base UI primitives (Radix UI + shadcn pattern)
│   ├── forms/              # Form-specific components (FormRenderer, SignatureInput)
│   ├── layout/             # Layout components (Sidebar, SiteSwitcher, GlobalAlert)
│   ├── signature/          # E-signature (SignaturePad)
│   └── dashboard/          # Dashboard widgets
└── lib/
    ├── forms/              # Form engine (core system)
    │   ├── definitions/    # Form definitions per brand (large files)
    │   ├── registry.ts     # Singleton FormRegistry
    │   ├── types.ts        # FormDefinition & FieldType interfaces
    │   └── validation.ts   # Validation engine
    ├── actions/            # Server actions ("use server")
    ├── auth/               # NextAuth config
    ├── db/                 # Prisma client
    ├── pdf/                # PDF generation (pdfkit)
    ├── audit/              # Audit trail
    ├── permissions.ts      # RBAC utilities
    └── utils.ts            # Shared utilities (cn, formatDate, etc.)
prisma/
├── schema.prisma           # Database schema
├── seed.ts                 # Demo data seeder
└── migrations/             # Migration history
docs/                       # Project documentation
```

## Architecture & Key Patterns

### Multi-Brand System
Four brands: `MENHANCEMENTS`, `WAX_FOR_MEN`, `WAX_FOR_WOMEN`, `PLG_UK` (headquarters). Each brand has its own form definitions in `src/lib/forms/definitions/`. Users are scoped to brands via their Site assignment.

### Form Engine
The form system is the core of the application (~5000+ lines of definitions):
- **Definitions** in `src/lib/forms/definitions/` define fields, sections, conditional logic, and risk escalation
- **Registry** (`registry.ts`) uses a singleton pattern to register/query forms
- **Validation** (`validation.ts`) processes form submissions against definitions
- **Rendering** (`FormRenderer` component) dynamically renders forms from definitions
- Form IDs follow the pattern: `brand_form_name` (e.g., `menh_patient_registration`)
- Field IDs use snake_case (e.g., `date_of_birth`)

### Server Actions
All data mutations use Next.js server actions in `src/lib/actions/`. Each action file handles a domain: `forms.ts`, `submissions.ts`, `gdpr.ts`, `pdf.ts`, `media.ts`, `enquiries.ts`, `analytics.ts`.

### RBAC (Role-Based Access Control)
Three roles: `ADMIN`, `PRACTITIONER`, `RECEPTION`. Permissions are checked via `src/lib/permissions.ts`. Admin routes redirect unauthorized users. See `docs/roles-permissions.md` for the full permission matrix.

### Component Patterns
- Server components are the default (Next.js App Router)
- Client components use `'use client'` directive
- UI components follow the shadcn/Radix UI pattern with `cn()` utility for class merging
- Styling is Tailwind CSS utility-first

## Database

PostgreSQL via Prisma ORM. Key models:

| Model | Purpose |
|-------|---------|
| Site | Clinic/practice locations |
| User | Staff (ADMIN, PRACTITIONER, RECEPTION roles) |
| Client | Patient/customer records |
| TreatmentEpisode | Treatment/consultation tracking |
| FormSubmission | Form responses with risk flags, signatures, audit metadata |
| Amendment | Post-submission amendments with audit trail |
| AuditLog | Full compliance audit trail |
| Enquiry | Lead/inquiry management |
| BatchRegister | Product batch tracking |

Risk levels: `NONE`, `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
Episode statuses: `CONSULTATION`, `CONSENTED`, `TREATED`, `FOLLOW_UP`, `CLOSED`

## Code Conventions

### Naming
- **Files**: kebab-case (`add-enquiry-form.tsx`)
- **Components**: PascalCase (`FormRenderer`)
- **Functions/variables**: camelCase (`submitFormAction`)
- **Constants**: UPPER_SNAKE_CASE for enums, camelCase for exports
- **Database fields**: camelCase (Prisma convention)

### Imports
- Path alias: `@/*` maps to `./src/*`
- Example: `import { cn } from '@/lib/utils'`

### TypeScript
- Strict mode enabled
- Use Prisma-generated types for database models
- Zod for runtime validation (v4)
- React Hook Form for form state management

## Testing & Quality

- **No formal test framework** is currently configured
- **Linting**: ESLint with Next.js core-web-vitals + TypeScript rules (`npm run lint`)
- **Build warnings**: Both TypeScript errors and ESLint warnings are currently ignored during builds (`ignoreBuildErrors: true`, `ignoreDuringBuilds: true` in next.config.ts)
- Always run `npm run lint` before committing

## Environment Variables

Required in `.env.local`:
- `DATABASE_URL` - PostgreSQL connection string (Supabase)
- `DIRECT_URL` - Direct database connection
- `NEXTAUTH_URL` - App URL for auth
- `NEXTAUTH_SECRET` - Auth secret key
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` - Google Drive integration
- `GOOGLE_PRIVATE_KEY` - Google Drive integration
- `GOOGLE_DRIVE_PARENT_ID` - Root Drive folder

## Deployment

- **Platform**: Vercel
- **Build command**: `prisma generate && next build`
- Database hosted on Supabase (PostgreSQL)

## Key Documentation

- `docs/setup.md` - Development environment setup, demo accounts
- `docs/adding-forms.md` - How to create/modify form definitions (field types, conditional logic, risk escalation)
- `docs/roles-permissions.md` - RBAC system, permission matrix, route protection
- `docs/data-retention.md` - GDPR compliance, retention periods, SAR process

## Common Tasks

### Adding a New Form
1. Create or update a definition file in `src/lib/forms/definitions/`
2. Register the form in `registry.ts`
3. Follow the naming convention: `brand_form_name` for form IDs
4. See `docs/adding-forms.md` for field types and conditional logic

### Adding a New API Route
Create a `route.ts` file in `src/app/api/<resource>/`. Use NextAuth session checks and RBAC from `src/lib/permissions.ts`.

### Modifying the Database Schema
1. Edit `prisma/schema.prisma`
2. Run `npm run db:push` to apply changes
3. Prisma client regenerates automatically on `dev` and `build`
