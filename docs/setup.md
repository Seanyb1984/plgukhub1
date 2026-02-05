# PLG UK Hub - Setup Guide

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- npm or yarn

## Quick Start

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd plgukhub
npm install
```

### 2. Environment Setup

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Database (default works with Docker)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/plgukhub?schema=public"

# NextAuth - Generate a secret: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# Storage
STORAGE_TYPE="local"
STORAGE_LOCAL_PATH="./uploads"
```

### 3. Start Database

Using Docker (recommended):

```bash
npm run docker:up
```

Or use an existing PostgreSQL database by updating `DATABASE_URL` in `.env`.

### 4. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with demo data
npm run db:seed
```

Or run all setup at once:

```bash
npm run setup
```

### 5. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Demo Accounts

After seeding, you can log in with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@plguk.co.uk | password123 |
| Practitioner | practitioner@menhancements.co.uk | password123 |
| Reception | reception@menhancements.co.uk | password123 |

## Project Structure

```
plgukhub/
├── docs/                    # Documentation
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Demo data seeder
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── admin/           # Admin dashboard
│   │   ├── api/             # API routes
│   │   ├── forms/           # Public form pages
│   │   └── login/           # Authentication
│   ├── components/
│   │   ├── forms/           # Form components
│   │   ├── signature/       # E-signature component
│   │   └── ui/              # Base UI components
│   └── lib/
│       ├── actions/         # Server actions
│       ├── audit/           # Audit trail
│       ├── auth/            # Authentication
│       ├── db/              # Database client
│       ├── exports/         # CSV export
│       ├── forms/
│       │   ├── definitions/ # Form definitions
│       │   ├── registry.ts  # Form registry
│       │   ├── types.ts     # Type definitions
│       │   └── validation.ts # Validation engine
│       ├── pdf/             # PDF generation
│       └── search/          # Search functionality
├── docker-compose.yml       # Local development services
└── package.json
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes
npm run db:migrate       # Create migration
npm run db:seed          # Seed demo data
npm run db:studio        # Open Prisma Studio

# Docker
npm run docker:up        # Start containers
npm run docker:down      # Stop containers
```

## Production Deployment

### Environment Variables

Set these in your production environment:

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secure-secret"

# For S3 storage
STORAGE_TYPE="s3"
S3_BUCKET="your-bucket"
S3_REGION="eu-west-2"
S3_ACCESS_KEY="your-key"
S3_SECRET_KEY="your-secret"
```

### Build and Deploy

```bash
npm run build
npm run start
```

### Database Migration

For production, use migrations instead of `db push`:

```bash
npx prisma migrate deploy
```
