import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: Record<string, string> = {};

  // 1. Check env vars are present (values not exposed)
  results.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING';
  results.DATABASE_URL = process.env.DATABASE_URL ? 'SET' : 'MISSING';
  results.NEXTAUTH_URL = process.env.NEXTAUTH_URL ?? 'MISSING';

  // 2. Test DB connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    results.db_connection = 'OK';
  } catch (e: any) {
    results.db_connection = 'FAIL: ' + e.message;
    return NextResponse.json(results);
  }

  // 3. Check user exists
  let storedHash: string | null = null;
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'admin@plguk.co.uk' },
      select: { id: true, email: true, role: true, passwordHash: true, isActive: true, siteId: true }
    });

    if (!user) {
      results.user_found = 'FAIL: user not found';
      return NextResponse.json(results);
    }

    results.user_found = 'OK: ' + user.email + ' role=' + user.role;
    results.user_isActive = String((user as any).isActive ?? 'N/A');
    results.user_siteId = (user as any).siteId ?? 'NULL';
    results.password_hash_present = user.passwordHash ? 'YES (len=' + user.passwordHash.length + ')' : 'NO';
    storedHash = user.passwordHash;
  } catch (e: any) {
    results.user_found = 'FAIL: ' + e.message;
    return NextResponse.json(results);
  }

  // 4. Test password comparison
  try {
    const match = await bcrypt.compare('e12CX3LAAaW9AM5k', storedHash!);
    results.password_match = match ? 'TRUE' : 'FALSE';
  } catch (e: any) {
    results.password_match = 'FAIL: ' + e.message;
  }

  return NextResponse.json(results);
}
