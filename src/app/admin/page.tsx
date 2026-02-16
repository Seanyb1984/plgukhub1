import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import {
  Syringe,
  Users,
  UserPlus,
  ClipboardList,
  Package,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

async function getKPIs(brand?: string, siteId?: string) {
  const brandFilter = brand ? { brand: brand as 'MENHANCEMENTS' | 'WAX_FOR_MEN' | 'WAX_FOR_WOMEN' | 'PLG_UK' } : {};
  const siteFilter = siteId ? { siteId } : {};
  const where = { ...brandFilter, ...siteFilter };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [
    totalClients,
    prospects,
    activeClients,
    openEpisodes,
    completedEpisodesToday,
    pendingConsents,
    totalBatches,
    expiringBatches,
    unconvertedInquiries,
    recentIncidents,
  ] = await Promise.all([
    prisma.client.count({ where }),
    prisma.client.count({ where: { ...where, isProspect: true } }),
    prisma.client.count({ where: { ...where, status: 'ACTIVE' } }),
    prisma.treatmentEpisode.count({ where: { ...where, status: { in: ['OPEN', 'CONSENT_PENDING', 'CONSENT_SIGNED', 'IN_TREATMENT'] } } }).catch(() => 0),
    prisma.treatmentEpisode.count({ where: { ...where, status: 'CLOSED', completedAt: { gte: today } } }).catch(() => 0),
    prisma.treatmentEpisode.count({ where: { ...where, status: 'CONSENT_PENDING' } }).catch(() => 0),
    prisma.batchRegister.count({ where: { ...brandFilter, isActive: true } }).catch(() => 0),
    prisma.batchRegister.count({
      where: {
        ...brandFilter,
        isActive: true,
        expiryDate: { lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      },
    }).catch(() => 0),
    prisma.inquiry.count({ where: { ...brandFilter, isConverted: false } }),
    prisma.formSubmission.count({
      where: {
        ...where,
        formType: { contains: 'incident' },
        createdAt: { gte: weekAgo },
      },
    }),
  ]);

  return {
    totalClients,
    prospects,
    activeClients,
    openEpisodes,
    completedEpisodesToday,
    pendingConsents,
    totalBatches,
    expiringBatches,
    unconvertedInquiries,
    recentIncidents,
  };
}

export default async function CommandCentre() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const { user } = session;
  const kpis = await getKPIs(
    user.brand === 'PLG_UK' ? undefined : user.brand,
    user.role === 'ADMIN' ? undefined : user.siteId
  );

  const kpiTiles = [
    { label: 'Total Clients', value: kpis.totalClients, icon: Users, color: 'bg-blue-50 text-blue-700', href: '/admin/clients' },
    { label: 'Prospects', value: kpis.prospects, icon: UserPlus, color: 'bg-amber-50 text-amber-700', href: '/admin/enquiries' },
    { label: 'Active Patients', value: kpis.activeClients, icon: CheckCircle2, color: 'bg-green-50 text-green-700', href: '/admin/clients?status=ACTIVE' },
    { label: 'Open Episodes', value: kpis.openEpisodes, icon: Syringe, color: 'bg-purple-50 text-purple-700', href: '/admin/episodes' },
    { label: 'Completed Today', value: kpis.completedEpisodesToday, icon: TrendingUp, color: 'bg-emerald-50 text-emerald-700', href: '/admin/episodes?status=CLOSED' },
    { label: 'Pending Consents', value: kpis.pendingConsents, icon: Clock, color: 'bg-orange-50 text-orange-700', href: '/admin/episodes?status=CONSENT_PENDING' },
    { label: 'Active Batches', value: kpis.totalBatches, icon: Package, color: 'bg-slate-50 text-slate-700', href: '/admin/inventory' },
    { label: 'Expiring (30d)', value: kpis.expiringBatches, icon: AlertTriangle, color: kpis.expiringBatches > 0 ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-500', href: '/admin/inventory?filter=expiring' },
    { label: 'New Enquiries', value: kpis.unconvertedInquiries, icon: ClipboardList, color: 'bg-cyan-50 text-cyan-700', href: '/admin/enquiries' },
    { label: 'Incidents (7d)', value: kpis.recentIncidents, icon: XCircle, color: kpis.recentIncidents > 0 ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-500', href: '/admin/incidents' },
  ];

  const quickActions = [
    { label: 'New Treatment Episode', href: '/forms/pre-consent', icon: Syringe, color: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'Add Enquiry', href: '/admin/enquiries?action=new', icon: UserPlus, color: 'bg-amber-600 hover:bg-amber-700' },
    { label: 'Log Batch', href: '/admin/inventory?action=new', icon: Package, color: 'bg-purple-600 hover:bg-purple-700' },
    { label: 'Governance Check', href: '/command-centre', icon: ShieldCheck, color: 'bg-green-600 hover:bg-green-700' },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Command Centre</h1>
        <p className="text-sm text-slate-500 mt-1">
          {user.brand === 'PLG_UK' ? 'All Brands' : user.brand.replace(/_/g, ' ')} &middot; {user.siteName}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white text-sm font-medium transition-colors ${action.color}`}
            >
              <Icon className="w-5 h-5" />
              {action.label}
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Link>
          );
        })}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {kpiTiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.label}
              href={tile.href}
              className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${tile.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{tile.value}</div>
              <div className="text-xs text-slate-500 mt-1">{tile.label}</div>
            </Link>
          );
        })}
      </div>

      {/* Alerts Section */}
      {(kpis.expiringBatches > 0 || kpis.recentIncidents > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-8">
          <h2 className="text-sm font-semibold text-red-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Attention Required
          </h2>
          <ul className="mt-2 space-y-1 text-sm text-red-700">
            {kpis.expiringBatches > 0 && (
              <li>
                {kpis.expiringBatches} batch(es) expiring within 30 days —{' '}
                <Link href="/admin/inventory?filter=expiring" className="underline font-medium">
                  Review inventory
                </Link>
              </li>
            )}
            {kpis.recentIncidents > 0 && (
              <li>
                {kpis.recentIncidents} incident(s) reported this week —{' '}
                <Link href="/admin/incidents" className="underline font-medium">
                  View reports
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Recent Activity - Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
        <p className="text-sm text-slate-500">
          Treatment episodes, form submissions, and governance logs will appear here once the database is connected.
        </p>
      </div>
    </div>
  );
}
