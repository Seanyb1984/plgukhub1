import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function reset() {
  const email = "info@plguk.com";
  const newPassword = "Admin123!";
  const hashed = await bcrypt.hash(newPassword, 10);

  try {
    await prisma.user.update({
      where: { email },
      data: { password: hashed }
    });
    console.log(`✅ SUCCESS: Password for ${email} reset to: ${newPassword}`);
  } catch (error) {
    console.error("❌ ERROR: Could not find that email in the database.");
  } finally {
    await prisma.$disconnect();
  }
}

reset();