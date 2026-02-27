// PLG UK Hub - Prisma Configuration for Prisma 7
// Connection URLs are managed here, NOT in schema.prisma
//
// Required .env variables:
//   DATABASE_URL       - Pooled connection string (for Prisma Client queries)
//   DIRECT_URL         - Direct connection string (for Prisma Migrate / db push)
//
// For Supabase, these look like:
//   DATABASE_URL="postgresql://postgres.REF:PASSWORD@aws-0-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
//   DIRECT_URL="postgresql://postgres.REF:PASSWORD@aws-0-eu-west-2.pooler.supabase.com:5432/postgres"

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // The pooled URL used by Prisma Client at runtime
    url: process.env["DATABASE_URL"]!,
    // The direct URL used by Prisma Migrate / db push (bypasses pgBouncer)
    directUrl: process.env["DIRECT_URL"],
  },
});
