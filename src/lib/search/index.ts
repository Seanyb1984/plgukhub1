import { prisma } from '@/lib/db';
import type { Brand } from '@prisma/client';

export interface SearchFilters {
  query?: string;
  brand?: Brand;
  siteId?: string;
  formType?: string;
  status?: string;
  riskLevel?: string;
  startDate?: Date;
  endDate?: Date;
  clientId?: string;
  appointmentId?: string;
}

export interface SearchResult {
  submissions: Awaited<ReturnType<typeof searchSubmissions>>;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Search submissions with flexible filtering
 */
export async function searchSubmissions(
  filters: SearchFilters,
  page: number = 1,
  pageSize: number = 20
) {
  const where: Record<string, unknown> = {};

  // Text search across multiple fields
  if (filters.query) {
    const query = filters.query.trim();

    // Check if it looks like an ID
    if (query.length > 20) {
      where.OR = [
        { id: { contains: query, mode: 'insensitive' } },
        { appointmentId: { contains: query, mode: 'insensitive' } },
      ];
    } else {
      // Search client name, email, phone
      where.OR = [
        { id: { contains: query, mode: 'insensitive' } },
        { appointmentId: { contains: query, mode: 'insensitive' } },
        {
          client: {
            OR: [
              { firstName: { contains: query, mode: 'insensitive' } },
              { lastName: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
              { phone: { contains: query, mode: 'insensitive' } },
              { clientId: { contains: query, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }
  }

  // Exact filters
  if (filters.brand) {
    where.brand = filters.brand;
  }
  if (filters.siteId) {
    where.siteId = filters.siteId;
  }
  if (filters.formType) {
    where.formType = filters.formType;
  }
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.riskLevel) {
    where.riskLevel = filters.riskLevel;
  }
  if (filters.clientId) {
    where.clientId = filters.clientId;
  }
  if (filters.appointmentId) {
    where.appointmentId = filters.appointmentId;
  }

  // Date range
  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) {
      (where.createdAt as Record<string, Date>).gte = filters.startDate;
    }
    if (filters.endDate) {
      (where.createdAt as Record<string, Date>).lte = filters.endDate;
    }
  }

  const [submissions, total] = await Promise.all([
    prisma.formSubmission.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            clientId: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        site: {
          select: {
            id: true,
            name: true,
            brand: true,
          },
        },
        practitioner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.formSubmission.count({ where }),
  ]);

  return {
    submissions,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Search clients
 */
export async function searchClients(
  query: string,
  brand?: Brand,
  siteId?: string,
  limit: number = 20
) {
  const where: Record<string, unknown> = {};

  if (query) {
    where.OR = [
      { firstName: { contains: query, mode: 'insensitive' } },
      { lastName: { contains: query, mode: 'insensitive' } },
      { email: { contains: query, mode: 'insensitive' } },
      { phone: { contains: query, mode: 'insensitive' } },
      { clientId: { contains: query, mode: 'insensitive' } },
    ];
  }

  if (brand) {
    where.brand = brand;
  }
  if (siteId) {
    where.siteId = siteId;
  }

  return prisma.client.findMany({
    where,
    include: {
      site: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          submissions: true,
        },
      },
    },
    orderBy: { lastName: 'asc' },
    take: limit,
  });
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(brand?: Brand, siteId?: string) {
  const where: Record<string, unknown> = {};
  if (brand) where.brand = brand;
  if (siteId) where.siteId = siteId;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const [
    totalSubmissions,
    todaySubmissions,
    weekSubmissions,
    monthSubmissions,
    byStatus,
    byRiskLevel,
    recentHighRisk,
    recentIncidents,
    recentComplaints,
  ] = await Promise.all([
    // Total submissions
    prisma.formSubmission.count({ where }),

    // Today's submissions
    prisma.formSubmission.count({
      where: {
        ...where,
        createdAt: { gte: today },
      },
    }),

    // This week's submissions
    prisma.formSubmission.count({
      where: {
        ...where,
        createdAt: { gte: lastWeek },
      },
    }),

    // This month's submissions
    prisma.formSubmission.count({
      where: {
        ...where,
        createdAt: { gte: lastMonth },
      },
    }),

    // By status
    prisma.formSubmission.groupBy({
      by: ['status'],
      where,
      _count: true,
    }),

    // By risk level
    prisma.formSubmission.groupBy({
      by: ['riskLevel'],
      where,
      _count: true,
    }),

    // Recent high-risk submissions
    prisma.formSubmission.findMany({
      where: {
        ...where,
        riskLevel: { in: ['HIGH', 'CRITICAL'] },
      },
      include: {
        client: {
          select: { firstName: true, lastName: true },
        },
        site: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),

    // Recent incidents
    prisma.formSubmission.findMany({
      where: {
        ...where,
        formType: { contains: 'incident' },
      },
      include: {
        site: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),

    // Recent complaints
    prisma.formSubmission.findMany({
      where: {
        ...where,
        formType: { contains: 'complaint' },
      },
      include: {
        client: { select: { firstName: true, lastName: true } },
        site: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  return {
    counts: {
      total: totalSubmissions,
      today: todaySubmissions,
      week: weekSubmissions,
      month: monthSubmissions,
    },
    byStatus: Object.fromEntries(
      byStatus.map((s) => [s.status, s._count])
    ),
    byRiskLevel: Object.fromEntries(
      byRiskLevel.map((r) => [r.riskLevel, r._count])
    ),
    recentHighRisk,
    recentIncidents,
    recentComplaints,
  };
}

/**
 * Get form type statistics
 */
export async function getFormTypeStats(brand?: Brand, siteId?: string) {
  const where: Record<string, unknown> = {};
  if (brand) where.brand = brand;
  if (siteId) where.siteId = siteId;

  const stats = await prisma.formSubmission.groupBy({
    by: ['formType'],
    where,
    _count: true,
    orderBy: {
      _count: {
        formType: 'desc',
      },
    },
  });

  return stats.map((s) => ({
    formType: s.formType,
    count: s._count,
  }));
}
