import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  const results: Record<string, any> = {};

  // 1. Test DB connection
  try {
    await prisma.$queryRaw`SELECT 1`;
    results.db_connection = 'OK';
  } catch (e: any) {
    results.db_connection = 'FAIL: ' + e.message;
    return NextResponse.json(results);
  }

  // 2. Check user exists
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'admin@plguk.co.uk' },
      select: { id: true, email: true, role: true, passwordHash: true }
    });

    if (!user) {
      results.user_found = 'FAIL: user not found';
      return NextResponse.json(results);
    }

    results.user_found = 'OK';
    results.user_role = user.role;
    results.hash_prefix = user.passwordHash.substring(0, 20);

    // 3. Test password match
    const match = await bcrypt.compare('e12CX3LAAaW9AM5k', user.passwordHash);
    results.password_match = match ? 'OK' : 'FAIL';

  } catch (e: any) {
    results.user_lookup = 'FAIL: ' + e.message;
  }

  return NextResponse.json(results);
}
