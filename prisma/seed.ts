import { PrismaClient, Brand, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const LOCATIONS = [
  { name: "Manchester", address: "6 Minshull Street, Manchester, M1 3ED" },
  { name: "Wilmslow", address: "Unit 6D, 3A Hawthorn Ln, Wilmslow, SK9 1AA" },
  { name: "Leeds", address: "First Floor, Kilkenny House, 7 King St, Leeds, LS1 2DR" },
  { name: "Wigan", address: "16 Royal Arcade, Wigan, WN1 1QH" },
];

const BRANDS: Brand[] = ["PLG_UK", "MENHANCEMENTS", "WAX_FOR_MEN", "WAX_FOR_WOMEN"];

async function main() {
  console.log("Seeding sites...");
  const siteIdByKey = new Map<string, string>();

  for (const brand of BRANDS) {
    for (const loc of LOCATIONS) {
      const site = await prisma.site.upsert({
        where: { name_brand: { name: loc.name, brand } },
        update: { address: loc.address },
        create: { name: loc.name, brand, address: loc.address },
      });
      siteIdByKey.set(`${brand}:${loc.name}`, site.id);
    }
  }

  console.log("Seeding users...");
  const passwordHash = await bcrypt.hash("Password123!", 10);
  const mcrPlgId = siteIdByKey.get("PLG_UK:Manchester")!;
  const mcrMenId = siteIdByKey.get("MENHANCEMENTS:Manchester")!;

  const users = [
    { email: "sean@plg.uk", name: "Sean Boyle", role: Role.ADMIN, brand: Brand.PLG_UK, siteId: mcrPlgId },
    { email: "steph@plg.uk", name: "Steph Rust", role: Role.ADMIN, brand: Brand.PLG_UK, siteId: mcrPlgId },
    { email: "jamie@plguk.com", name: "Jamie", role: Role.PRACTITIONER, brand: Brand.PLG_UK, siteId: mcrPlgId },
    { email: "robbie@plguk.com", name: "Robbie", role: Role.PRACTITIONER, brand: Brand.PLG_UK, siteId: mcrPlgId },
    { email: "dr.phil@plguk.com", name: "Dr Phil", role: Role.PRACTITIONER, brand: Brand.MENHANCEMENTS, siteId: mcrMenId },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: u,
      create: { ...u, passwordHash },
    });
  }

  console.log("Seeding test enquiries...");
  const enquiries = [
    {
      firstName: "David",
      lastName: "Smith",
      phone: "07700900123",
      message: "WhatsApp enquiry: Interested in hair optimization.",
      source: "WHATSAPP",
      brand: Brand.MENHANCEMENTS,
      siteId: mcrMenId,
    },
    {
      firstName: "Sarah",
      lastName: "Jones",
      email: "sarah@example.com",
      message: "Web Form: Booking request for Leeds location.",
      source: "WEB",
      brand: Brand.WAX_FOR_WOMEN,
      siteId: siteIdByKey.get("WAX_FOR_WOMEN:Leeds")!,
    },
  ];

  for (const enq of enquiries) {
    await prisma.enquiry.create({ data: enq });
  }

  console.log("Seed complete! Logins ready.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());