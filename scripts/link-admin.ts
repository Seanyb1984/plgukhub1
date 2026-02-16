import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function link() {
  const site = await prisma.site.findFirst();
  if (!site) return console.log("❌ No sites found. Create a site first!");
  await prisma.user.update({
    where: { email: "info@plguk.com" },
    data: { siteId: site.id }
  });
  console.log(`✅ Linked admin to: ${site.name}`);
}
link();