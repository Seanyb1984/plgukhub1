const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdminPassword() {
  const email = process.argv[2] || 'seanyb1984@gmail.com'; // Default email or from command line
  const newPassword = process.argv[3] || 'Admin123!';      // Default password

  console.log(`🔒 Resetting password for user: ${email}...`);

  try {
    // 1. Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ Error: User with email '${email}' not found.`);
      process.exit(1);
    }

    // 2. Hash the new password
    const hashed = await hash(newPassword, 12);

    // 3. Update the user (FIXED: Using passwordHash instead of password)
    await prisma.user.update({
      where: { email },
      data: {
        passwordHash: hashed, // <--- 🛠️ FIXED FIELD NAME
      },
    });

    console.log(`✅ SUCCESS: Password for ${email} reset to: ${newPassword}`);
    
  } catch (error) {
    console.error('❌ Failed to reset password:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();