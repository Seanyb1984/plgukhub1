import { PrismaClient, Brand, Role } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // ============================================
  // CREATE SITES
  // ============================================
  console.log('Creating sites...');

  const sites = await Promise.all([
    // Menhancements sites
    prisma.site.upsert({
      where: { name_brand: { name: 'London Clinic', brand: 'MENHANCEMENTS' } },
      update: {},
      create: {
        name: 'London Clinic',
        brand: 'MENHANCEMENTS',
        address: '123 Harley Street, London W1G 7JU',
        phone: '020 1234 5678',
        email: 'london@menhancements.co.uk',
      },
    }),
    prisma.site.upsert({
      where: { name_brand: { name: 'Manchester Clinic', brand: 'MENHANCEMENTS' } },
      update: {},
      create: {
        name: 'Manchester Clinic',
        brand: 'MENHANCEMENTS',
        address: '45 King Street, Manchester M2 4LQ',
        phone: '0161 234 5678',
        email: 'manchester@menhancements.co.uk',
      },
    }),

    // Wax for Men sites
    prisma.site.upsert({
      where: { name_brand: { name: 'London Studio', brand: 'WAX_FOR_MEN' } },
      update: {},
      create: {
        name: 'London Studio',
        brand: 'WAX_FOR_MEN',
        address: '78 Old Street, London EC1V 9HX',
        phone: '020 2345 6789',
        email: 'london@waxformen.co.uk',
      },
    }),
    prisma.site.upsert({
      where: { name_brand: { name: 'Birmingham Studio', brand: 'WAX_FOR_MEN' } },
      update: {},
      create: {
        name: 'Birmingham Studio',
        brand: 'WAX_FOR_MEN',
        address: '12 Bull Street, Birmingham B4 6AF',
        phone: '0121 345 6789',
        email: 'birmingham@waxformen.co.uk',
      },
    }),

    // Wax for Women sites
    prisma.site.upsert({
      where: { name_brand: { name: 'London Salon', brand: 'WAX_FOR_WOMEN' } },
      update: {},
      create: {
        name: 'London Salon',
        brand: 'WAX_FOR_WOMEN',
        address: '56 Marylebone High Street, London W1U 5HZ',
        phone: '020 3456 7890',
        email: 'london@waxforwomen.co.uk',
      },
    }),
    prisma.site.upsert({
      where: { name_brand: { name: 'Leeds Salon', brand: 'WAX_FOR_WOMEN' } },
      update: {},
      create: {
        name: 'Leeds Salon',
        brand: 'WAX_FOR_WOMEN',
        address: '89 Briggate, Leeds LS1 6LH',
        phone: '0113 456 7890',
        email: 'leeds@waxforwomen.co.uk',
      },
    }),

    // PLG UK HQ
    prisma.site.upsert({
      where: { name_brand: { name: 'Head Office', brand: 'PLG_UK' } },
      update: {},
      create: {
        name: 'Head Office',
        brand: 'PLG_UK',
        address: '100 Victoria Street, London SW1E 5JL',
        phone: '020 4567 8901',
        email: 'hq@plguk.co.uk',
      },
    }),
  ]);

  console.log(`Created ${sites.length} sites`);

  // ============================================
  // CREATE USERS
  // ============================================
  console.log('Creating users...');

  const passwordHash = await hash('password123', 12);

  const users = await Promise.all([
    // PLG UK Admin (super admin)
    prisma.user.upsert({
      where: { email: 'admin@plguk.co.uk' },
      update: {},
      create: {
        email: 'admin@plguk.co.uk',
        name: 'System Administrator',
        passwordHash,
        role: 'ADMIN',
        brand: 'PLG_UK',
        siteId: sites.find((s) => s.name === 'Head Office')!.id,
      },
    }),

    // Menhancements staff
    prisma.user.upsert({
      where: { email: 'practitioner@menhancements.co.uk' },
      update: {},
      create: {
        email: 'practitioner@menhancements.co.uk',
        name: 'Dr. James Wilson',
        passwordHash,
        role: 'PRACTITIONER',
        brand: 'MENHANCEMENTS',
        siteId: sites.find((s) => s.name === 'London Clinic' && s.brand === 'MENHANCEMENTS')!.id,
      },
    }),
    prisma.user.upsert({
      where: { email: 'reception@menhancements.co.uk' },
      update: {},
      create: {
        email: 'reception@menhancements.co.uk',
        name: 'Sarah Johnson',
        passwordHash,
        role: 'STAFF',
        brand: 'MENHANCEMENTS',
        siteId: sites.find((s) => s.name === 'London Clinic' && s.brand === 'MENHANCEMENTS')!.id,
      },
    }),
    prisma.user.upsert({
      where: { email: 'admin@menhancements.co.uk' },
      update: {},
      create: {
        email: 'admin@menhancements.co.uk',
        name: 'Michael Brown',
        passwordHash,
        role: 'ADMIN',
        brand: 'MENHANCEMENTS',
        siteId: sites.find((s) => s.name === 'London Clinic' && s.brand === 'MENHANCEMENTS')!.id,
      },
    }),

    // Wax for Men staff
    prisma.user.upsert({
      where: { email: 'therapist@waxformen.co.uk' },
      update: {},
      create: {
        email: 'therapist@waxformen.co.uk',
        name: 'Tom Harris',
        passwordHash,
        role: 'PRACTITIONER',
        brand: 'WAX_FOR_MEN',
        siteId: sites.find((s) => s.name === 'London Studio')!.id,
      },
    }),
    prisma.user.upsert({
      where: { email: 'reception@waxformen.co.uk' },
      update: {},
      create: {
        email: 'reception@waxformen.co.uk',
        name: 'Emma Davis',
        passwordHash,
        role: 'STAFF',
        brand: 'WAX_FOR_MEN',
        siteId: sites.find((s) => s.name === 'London Studio')!.id,
      },
    }),

    // Wax for Women staff
    prisma.user.upsert({
      where: { email: 'therapist@waxforwomen.co.uk' },
      update: {},
      create: {
        email: 'therapist@waxforwomen.co.uk',
        name: 'Lisa Taylor',
        passwordHash,
        role: 'PRACTITIONER',
        brand: 'WAX_FOR_WOMEN',
        siteId: sites.find((s) => s.name === 'London Salon')!.id,
      },
    }),
    prisma.user.upsert({
      where: { email: 'reception@waxforwomen.co.uk' },
      update: {},
      create: {
        email: 'reception@waxforwomen.co.uk',
        name: 'Amy White',
        passwordHash,
        role: 'STAFF',
        brand: 'WAX_FOR_WOMEN',
        siteId: sites.find((s) => s.name === 'London Salon')!.id,
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // ============================================
  // CREATE DEMO CLIENTS
  // ============================================
  console.log('Creating demo clients...');

  const clients = await Promise.all([
    // Menhancements clients
    prisma.client.upsert({
      where: { clientId: 'MENH-001' },
      update: {},
      create: {
        clientId: 'MENH-001',
        firstName: 'Robert',
        lastName: 'Smith',
        email: 'robert.smith@example.com',
        phone: '07700 900001',
        dateOfBirth: new Date('1985-03-15'),
        gender: 'male',
        addressLine1: '42 Baker Street',
        city: 'London',
        postcode: 'W1U 3BW',
        brands: ['MENHANCEMENTS'],
        siteId: sites.find((s) => s.name === 'London Clinic' && s.brand === 'MENHANCEMENTS')!.id,
        emergencyName: 'Jane Smith',
        emergencyPhone: '07700 900002',
        emergencyRelation: 'Wife',
        isProspect: false,
        marketingConsent: true,
        marketingEmail: true,
        status: 'ACTIVE',
      },
    }),
    prisma.client.upsert({
      where: { clientId: 'MENH-002' },
      update: {},
      create: {
        clientId: 'MENH-002',
        firstName: 'David',
        lastName: 'Jones',
        email: 'david.jones@example.com',
        phone: '07700 900003',
        dateOfBirth: new Date('1978-07-22'),
        gender: 'male',
        addressLine1: '15 Oxford Street',
        city: 'London',
        postcode: 'W1D 2DW',
        brands: ['MENHANCEMENTS'],
        siteId: sites.find((s) => s.name === 'London Clinic' && s.brand === 'MENHANCEMENTS')!.id,
        isProspect: true,
        marketingConsent: false,
      },
    }),

    // Wax for Men clients
    prisma.client.upsert({
      where: { clientId: 'WFM-001' },
      update: {},
      create: {
        clientId: 'WFM-001',
        firstName: 'Mark',
        lastName: 'Williams',
        email: 'mark.williams@example.com',
        phone: '07700 900004',
        dateOfBirth: new Date('1990-11-08'),
        gender: 'male',
        addressLine1: '8 Regent Street',
        city: 'London',
        postcode: 'SW1Y 4PE',
        brands: ['WAX_FOR_MEN'],
        siteId: sites.find((s) => s.name === 'London Studio')!.id,
        isProspect: false,
        marketingConsent: true,
        marketingSms: true,
        status: 'ACTIVE',
      },
    }),

    // Wax for Women clients
    prisma.client.upsert({
      where: { clientId: 'WFW-001' },
      update: {},
      create: {
        clientId: 'WFW-001',
        firstName: 'Sophie',
        lastName: 'Brown',
        email: 'sophie.brown@example.com',
        phone: '07700 900005',
        dateOfBirth: new Date('1992-04-18'),
        gender: 'female',
        addressLine1: '23 Bond Street',
        city: 'London',
        postcode: 'W1S 4EG',
        brands: ['WAX_FOR_WOMEN'],
        siteId: sites.find((s) => s.name === 'London Salon')!.id,
        isProspect: false,
        marketingConsent: true,
        marketingEmail: true,
        marketingSms: true,
        status: 'ACTIVE',
      },
    }),
    prisma.client.upsert({
      where: { clientId: 'WFW-002' },
      update: {},
      create: {
        clientId: 'WFW-002',
        firstName: 'Emily',
        lastName: 'Johnson',
        email: 'emily.johnson@example.com',
        phone: '07700 900006',
        dateOfBirth: new Date('1988-09-25'),
        gender: 'female',
        addressLine1: '56 High Street',
        city: 'London',
        postcode: 'W8 4AA',
        brands: ['WAX_FOR_WOMEN'],
        siteId: sites.find((s) => s.name === 'London Salon')!.id,
        isProspect: true,
        marketingConsent: false,
      },
    }),
  ]);

  console.log(`Created ${clients.length} demo clients`);

  // ============================================
  // CREATE DEMO INQUIRIES
  // ============================================
  console.log('Creating demo inquiries...');

  const inquiries = await Promise.all([
    prisma.inquiry.create({
      data: {
        name: 'James Carter',
        email: 'james.carter@example.com',
        phone: '07700 900010',
        brand: 'MENHANCEMENTS',
        message: 'Interested in Botox treatment for forehead lines.',
      },
    }),
    prisma.inquiry.create({
      data: {
        name: 'Sarah Mitchell',
        email: 'sarah.mitchell@example.com',
        phone: '07700 900011',
        brand: 'WAX_FOR_WOMEN',
        message: 'Would like to book a full leg wax, first time client.',
      },
    }),
    prisma.inquiry.create({
      data: {
        name: 'Tom Edwards',
        email: 'tom.edwards@example.com',
        brand: 'WAX_FOR_MEN',
        message: 'Enquiry about back and shoulder waxing prices.',
      },
    }),
  ]);

  console.log(`Created ${inquiries.length} demo inquiries`);

  // ============================================
  // CREATE DEMO SUBMISSIONS
  // ============================================
  console.log('Creating demo submissions...');

  const adminUser = users.find((u) => u.email === 'admin@plguk.co.uk')!;
  const practitioner = users.find((u) => u.email === 'practitioner@menhancements.co.uk')!;

  const submissions = await Promise.all([
    // Completed patient registration
    prisma.formSubmission.create({
      data: {
        formType: 'menh_patient_registration',
        formVersion: '1.0',
        brand: 'MENHANCEMENTS',
        siteId: sites.find((s) => s.name === 'London Clinic' && s.brand === 'MENHANCEMENTS')!.id,
        clientId: clients.find((c) => c.clientId === 'MENH-001')!.id,
        status: 'SIGNED',
        isLocked: true,
        lockedAt: new Date(),
        lockedReason: 'Signed by client',
        signedAt: new Date(),
        signedByName: 'Robert Smith',
        submittedAt: new Date(),
        practitionerId: practitioner.id,
        data: {
          title: 'mr',
          first_name: 'Robert',
          last_name: 'Smith',
          date_of_birth: '1985-03-15',
          email: 'robert.smith@example.com',
          phone: '07700 900001',
          address_line_1: '42 Baker Street',
          city: 'London',
          postcode: 'W1U 3BW',
          emergency_name: 'Jane Smith',
          emergency_phone: '07700 900002',
          emergency_relationship: 'Wife',
          referral_source: 'google',
        },
      },
    }),

    // Draft consultation notes
    prisma.formSubmission.create({
      data: {
        formType: 'menh_consultation_notes',
        formVersion: '1.0',
        brand: 'MENHANCEMENTS',
        siteId: sites.find((s) => s.name === 'London Clinic' && s.brand === 'MENHANCEMENTS')!.id,
        clientId: clients.find((c) => c.clientId === 'MENH-001')!.id,
        status: 'DRAFT',
        draftSavedAt: new Date(),
        resumeToken: 'demo-resume-token-001',
        practitionerId: practitioner.id,
        data: {
          consultation_date: new Date().toISOString().split('T')[0],
          consultation_type: 'initial',
          practitioner_name: 'Dr. James Wilson',
          presenting_complaint: 'Patient presents with concerns about...',
        },
      },
    }),

    // Incident report with escalation
    prisma.formSubmission.create({
      data: {
        formType: 'plg_incident_near_miss',
        formVersion: '1.0',
        brand: 'PLG_UK',
        siteId: sites.find((s) => s.name === 'Head Office')!.id,
        status: 'SUBMITTED',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        riskLevel: 'MEDIUM',
        riskFlags: ['Injury reported - ensure first aid records are complete'],
        requiresEscalation: false,
        practitionerId: adminUser.id,
        data: {
          incident_type: 'incident',
          incident_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          incident_time: '14:30',
          location: 'Reception area',
          person_type: ['staff'],
          persons_details: 'Staff member slipped on wet floor',
          description: 'A staff member slipped on the wet floor in the reception area. The floor had just been mopped and warning signs were not visible.',
          injury_occurred: true,
          injury_details: 'Minor bruising to knee',
          first_aid: true,
          hospital_visit: false,
          damage_occurred: false,
          actions_taken: 'First aid administered. Area cordoned off. Warning signs repositioned.',
          area_secured: true,
        },
      },
    }),

    // Complaint form
    prisma.formSubmission.create({
      data: {
        formType: 'plg_complaint_form',
        formVersion: '1.0',
        brand: 'WAX_FOR_WOMEN',
        siteId: sites.find((s) => s.name === 'London Salon')!.id,
        clientId: clients.find((c) => c.clientId === 'WFW-002')!.id,
        status: 'SUBMITTED',
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        riskLevel: 'LOW',
        data: {
          customer_name: 'Emily Johnson',
          customer_email: 'emily.johnson@example.com',
          customer_phone: '07700 900006',
          preferred_contact: 'email',
          service_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          location_visited: 'London Salon',
          complaint_type: 'wait_time',
          complaint_description: 'I arrived on time for my appointment but had to wait over 30 minutes before being seen. No apology or explanation was offered.',
          resolution_sought: 'I would like an apology and a discount on my next visit.',
          previous_contact: false,
        },
      },
    }),

    // Wax treatment notes
    prisma.formSubmission.create({
      data: {
        formType: 'wfm_treatment_notes',
        formVersion: '1.0',
        brand: 'WAX_FOR_MEN',
        siteId: sites.find((s) => s.name === 'London Studio')!.id,
        clientId: clients.find((c) => c.clientId === 'WFM-001')!.id,
        status: 'SIGNED',
        isLocked: true,
        lockedAt: new Date(),
        signedAt: new Date(),
        signedByName: 'Tom Harris',
        submittedAt: new Date(),
        practitionerId: users.find((u) => u.email === 'therapist@waxformen.co.uk')!.id,
        data: {
          treatment_date: new Date().toISOString().split('T')[0],
          therapist_name: 'Tom Harris',
          treatment_areas: ['back', 'shoulders', 'chest'],
          wax_type: 'hot_wax',
          skin_condition: 'normal',
          hair_growth: 'coarse',
          client_tolerance: 'good',
          immediate_reaction: 'mild_redness',
          aftercare_provided: true,
          recommended_next: '4 weeks',
        },
      },
    }),
  ]);

  console.log(`Created ${submissions.length} demo submissions`);

  // ============================================
  // CREATE DATA RETENTION POLICIES
  // ============================================
  console.log('Creating data retention policies...');

  const retentionPolicies = await Promise.all([
    prisma.dataRetentionPolicy.upsert({
      where: { formType: 'menh_patient_registration' },
      update: {},
      create: {
        formType: 'menh_patient_registration',
        retentionDays: 3650, // 10 years
        description: 'Patient registration forms retained for 10 years as per medical records guidelines',
      },
    }),
    prisma.dataRetentionPolicy.upsert({
      where: { formType: 'menh_consultation_notes' },
      update: {},
      create: {
        formType: 'menh_consultation_notes',
        retentionDays: 3650,
        description: 'Clinical consultation notes retained for 10 years',
      },
    }),
    prisma.dataRetentionPolicy.upsert({
      where: { formType: 'plg_incident_near_miss' },
      update: {},
      create: {
        formType: 'plg_incident_near_miss',
        retentionDays: 3650,
        description: 'Incident reports retained for 10 years for legal and insurance purposes',
      },
    }),
    prisma.dataRetentionPolicy.upsert({
      where: { formType: 'plg_safeguarding_concern' },
      update: {},
      create: {
        formType: 'plg_safeguarding_concern',
        retentionDays: 9125, // 25 years
        description: 'Safeguarding records retained for 25 years',
      },
    }),
    prisma.dataRetentionPolicy.upsert({
      where: { formType: 'plg_complaint_form' },
      update: {},
      create: {
        formType: 'plg_complaint_form',
        retentionDays: 2555, // 7 years
        description: 'Complaint records retained for 7 years',
      },
    }),
    prisma.dataRetentionPolicy.upsert({
      where: { formType: 'wfm_treatment_notes' },
      update: {},
      create: {
        formType: 'wfm_treatment_notes',
        retentionDays: 2555,
        description: 'Treatment records retained for 7 years',
      },
    }),
    prisma.dataRetentionPolicy.upsert({
      where: { formType: 'wfw_treatment_notes' },
      update: {},
      create: {
        formType: 'wfw_treatment_notes',
        retentionDays: 2555,
        description: 'Treatment records retained for 7 years',
      },
    }),
  ]);

  console.log(`Created ${retentionPolicies.length} data retention policies`);

  console.log('\nSeed completed successfully!');
  console.log('\nDemo accounts:');
  console.log('  Admin:        admin@plguk.co.uk / password123');
  console.log('  Practitioner: practitioner@menhancements.co.uk / password123');
  console.log('  Staff:        reception@menhancements.co.uk / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
