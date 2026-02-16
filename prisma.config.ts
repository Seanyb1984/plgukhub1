import 'dotenv/config';
import { config } from "dotenv";
import { defineConfig } from "prisma/config";
import path from "path";

// 1. Manually tell Prisma to look at .env.local
config({ path: path.resolve(process.cwd(), ".env.local") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // 2. Use process.env directly to avoid the 'env' function error
  datasource: {
    url: process.env.DATABASE_URL,
  },
});