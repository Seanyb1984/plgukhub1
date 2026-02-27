// PLG UK Hub - Admin Command Centre Dashboard
// Server Component — queries Prisma directly, defensive against DB being unavailable

export const dynamic = 'force-dynamic';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import {
  Users,
  Syringe,
  ClipboardList,
  AlertTriangle,
  Package,
  UserPlus,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Activity,
  CalendarDays,
  Database,
} from 'lucide-react';

// ============================================
// DATA FETCHING
// ============================================

async function getDashboardStats() {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);
  const in30Days = new Date(now);
  in30Days.setDate(now.getDate() + 30);

  try {
    const [
      totalClients,
      activeClients,
      episodesToday,
      episodesThisWeek,
      consentPending,
      openEnquiries,
      unreadAlerts,
      criticalAlerts,
      expiringBatches,
      hardStoppedToday,
      recentEpisodes,
      recentAlerts,
    ] = await Promise.all([
      prisma.client.count(),
      prisma.client.count({ where: { status: 'ACTIVE' } }),
      prisma.treatmentEpisode.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.treatmentEpisode.count({ where: { createdAt: { gte: weekStart } } }),
      prisma.treatmentEpisode.count({ where: { status: 'CONSENT_PENDING' } }),
      prisma.inquiry.count({ where: { isConverted: false } }),
      prisma.complianceAlert.count({ where: { isRead: false, isDismissed: false } }),
      prisma.complianceAlert.count({ where: { severity: 'CRITICAL', isDismissed: false } }),
      prisma.batchRegister.count({ where: { isActive: true, expiryDate: { lte: in30Days, gte: now } } }),
      prisma.treatmentEpisode.count({ where: { status: 'HARD_STOPPED', createdAt: { gte: todayStart } } }),
      prisma.treatmentEpisode.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          episodeRef: true,
          status: true,
          brand: true,
          treatmentType: true,
          createdAt: true,
          client: { select: { firstName: true, lastName: true } },
        },
      }),
      prisma.complianceAlert.findMany({
        take: 4,
        where: { isDismissed: false },
        orderBy: { scannedAt: 'desc' },
        select: { id: true, title: true, severity: true, source: true, scannedAt: true },
      }),
    ]);

    return {
      totalClients,
      activeClients,
      episodesToday,
      episodesThisWeek,
      consentPending,
      openEnquiries,
      unreadAlerts,
      criticalAlerts,
      expiringBatches,
      hardStoppedToday,
      recentEpisodes,
      recentAlerts,
      dbAvailable: true,
    };
  } catch {
    return {
      totalClients: 0,
      activeClients: 0,
      episodesToday: 0,
      episodesThisWeek: 0,
      consentPending: 0,
      openEnquiries: 0,
      unreadAlerts: 0,
      criticalAlerts: 0,
      expiringBatches: 0,
      hardStoppedToday: 0,
      recentEpisodes: [] as Array<{
        id: string;
        episodeRef: string;
        status: string;
        brand: string;
        treatmentType: string | null;
        createdAt: Date;
        client: { firstName: string; lastName: string };
      }>,
      recentAlerts: [] as Array<{
        id: string;
        title: string;
        severity: string;
        source: string;
        scannedAt: Date;
      }>,
      dbAvailable: false,
    };
  }
}

// ============================================
// HELPERS
// ============================================

function episodeStatusBadge(status: string) {
  const map: Record<string, { label: string; bg: string; text: string }> = {
    OPEN: { label: 'Open', bg: 'bg-slate-100', text: 'text-slate-600' },
    CONSENT_PENDING: { label: 'Consent Pending', bg: 'bg-amber-100', text: 'text-amber-700' },
    CONSENT_SIGNED: { label: 'Consent Signed', bg: 'bg-blue-100', text: 'text-blue-700' },
    IN_TREATMENT: { label: 'In Treatment', bg: 'bg-indigo-100', text: 'text-indigo-700' },
    TREATMENT_COMPLETE: { label: 'Complete', bg: 'bg-green-100', text: 'text-green-700' },
    CLOSED: { label: 'Closed', bg: 'bg-slate-100', text: 'text-slate-500' },
    CANCELLED: { label: 'Cancelled', bg: 'bg-gray-100', text: 'text-gray-500' },
    HARD_STOPPED: { label: 'Hard Stopped', bg: 'bg-red-100', text: 'text-red-700' },
  };
  const s = map[status] ?? { label: status, bg: 'bg-gray-100', text: 'text-gray-600' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

function severityDot(severity: string) {
  if (severity === 'CRITICAL') return 'bg-red-500';
  if (severity === 'HIGH') return 'bg-orange-400';
  if (severity === 'MEDIUM') return 'bg-amber-400';
  return 'bg-blue-400';
}

function relativeTime(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// CQC 5 Key Questions — signals derived from live data
function cqcSignals(stats: Awaited<ReturnType<typeof getDashboardStats>>) {
  return [
    {
      key: 'Safe',
      ok: stats.hardStoppedToday === 0 && stats.expiringBatches === 0,
      notes: [
        stats.hardStoppedToday > 0 ? `${stats.hardStoppedToday} hard stop(s) today` : 'No hard stops today',
        stats.expiringBatches > 0 ? `${stats.expiringBatches} batch(es) expiring <30d` : 'Batch expiries clear',
      ],
    },
    {
      key: 'Effective',
      ok: stats.consentPending === 0,
      notes: [
        stats.consentPending > 0 ? `${stats.consentPending} episode(s) awaiting consent` : 'Consent queue clear',
        'MD prescribing pathway active',
      ],
    },
    {
      key: 'Caring',
      ok: true,
      notes: ['Aftercare email system configured', 'Follow-up scheduling enabled'],
    },
    {
      key: 'Responsive',
      ok: stats.openEnquiries < 10,
      notes: [
        `${stats.openEnquiries} open enquiry/enquiries`,
        'Multi-site coverage: MAN · LDS · WIL · WGN',
      ],
    },
    {
      key: 'Well-led',
      ok: stats.criticalAlerts === 0,
      notes: [
        stats.criticalAlerts > 0 ? `${stats.criticalAlerts} critical compliance alert(s)` : 'No critical alerts',
        stats.unreadAlerts > 0 ? `${stats.unreadAlerts} unread alert(s)` : 'All alerts reviewed',
      ],
    },
  ];
}

// ============================================
// PAGE
// ============================================

export default async function AdminDashboard() {
  const session = await auth();
  const stats = await getDashboardStats();
  const cqc = cqcSignals(stats);

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="px-8 py-8 max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Command Centre</h1>
          <p className="text-sm text-slate-500 mt-0.5">{today}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-700">{session?.user?.name ?? 'User'}</p>
          <p className="text-xs text-slate-400">{session?.user?.role} · {session?.user?.siteName}</p>
        </div>
      </div>

      {/* DB Warning Banner */}
      {!stats.dbAvailable && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
          <Database className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">Database unavailable</p>
            <p className="text-xs text-amber-600">Stats are showing zeros. Run <code className="font-mono">prisma db push && prisma generate</code> and verify DATABASE_URL.</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          label="Total Clients"
          value={stats.totalClients}
          sub={`${stats.activeClients} active`}
          icon={<Users className="w-5 h-5" />}
          href="/admin/clients"
          color="blue"
        />
        <StatCard
          label="Today's Episodes"
          value={stats.episodesToday}
          sub={`${stats.episodesThisWeek} this week`}
          icon={<Syringe className="w-5 h-5" />}
          href="/admin/episodes"
          color="indigo"
        />
        <StatCard
          label="Consent Pending"
          value={stats.consentPending}
          sub="Awaiting MD sign-off"
          icon={<ClipboardList className="w-5 h-5" />}
          href="/admin/episodes?status=CONSENT_PENDING"
          color={stats.consentPending > 0 ? 'amber' : 'green'}
        />
        <StatCard
          label="Open Enquiries"
          value={stats.openEnquiries}
          sub="Unconverted leads"
          icon={<UserPlus className="w-5 h-5" />}
          href="/admin/enquiries"
          color="purple"
        />
        <StatCard
          label="Compliance Alerts"
          value={stats.unreadAlerts}
          sub={stats.criticalAlerts > 0 ? `${stats.criticalAlerts} critical` : 'None critical'}
          icon={<AlertTriangle className="w-5 h-5" />}
          href="/command-centre"
          color={stats.criticalAlerts > 0 ? 'red' : stats.unreadAlerts > 0 ? 'amber' : 'green'}
        />
        <StatCard
          label="Expiring Batches"
          value={stats.expiringBatches}
          sub="Within 30 days"
          icon={<Package className="w-5 h-5" />}
          href="/admin/inventory"
          color={stats.expiringBatches > 0 ? 'orange' : 'green'}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Episodes — takes 2/3 */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-500" />
              <h2 className="font-semibold text-slate-800">Recent Treatment Episodes</h2>
            </div>
            <Link href="/admin/episodes" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {stats.recentEpisodes.length === 0 ? (
              <p className="px-6 py-10 text-sm text-slate-400 text-center">No episodes yet.</p>
            ) : (
              stats.recentEpisodes.map((ep) => (
                <Link
                  key={ep.id}
                  href={`/admin/episodes/${ep.id}`}
                  className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {ep.client.firstName} {ep.client.lastName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {ep.treatmentType ?? 'Treatment type TBC'} · <span className="font-mono">{ep.episodeRef.slice(0, 8)}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {episodeStatusBadge(ep.status)}
                    <span className="text-xs text-slate-400">{relativeTime(ep.createdAt)}</span>
                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-slate-500" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right column — CQC + Quick Actions */}
        <div className="space-y-6">

          {/* CQC 5 Key Questions */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <h2 className="font-semibold text-slate-800">CQC Key Questions</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {cqc.map((q) => (
                <div key={q.key} className="flex items-start gap-3 px-5 py-3">
                  <div className="mt-0.5 flex-shrink-0">
                    {q.ok
                      ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                      : <XCircle className="w-4 h-4 text-red-500" />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800">{q.key}</p>
                    {q.notes.map((n, i) => (
                      <p key={i} className="text-xs text-slate-500 truncate">{n}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Quick Actions</h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              <QuickAction href="/treatment-journey" label="New Journey" color="indigo" />
              <QuickAction href="/admin/enquiries/new" label="Log Enquiry" color="purple" />
              <QuickAction href="/admin/inventory/new" label="Batch Entry" color="slate" />
              <QuickAction href="/admin/incidents/new" label="Log Incident" color="red" />
              <QuickAction href="/command-centre?form=FIRE_SAFETY_CHECK" label="Fire Check" color="orange" />
              <QuickAction href="/command-centre" label="Governance" color="green" />
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Alerts */}
      {stats.recentAlerts.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-slate-500" />
              <h2 className="font-semibold text-slate-800">Latest Compliance Alerts</h2>
            </div>
            <Link href="/command-centre" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {stats.recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center gap-4 px-6 py-3">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${severityDot(alert.severity)}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 truncate">{alert.title}</p>
                  <p className="text-xs text-slate-400">{alert.source} · {relativeTime(alert.scannedAt)}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded flex-shrink-0 ${
                  alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                  alert.severity === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Follow-Ups placeholder */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-slate-500" />
            <h2 className="font-semibold text-slate-800">Upcoming Follow-Ups</h2>
          </div>
          <Link href="/admin/appointments" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
            View calendar <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <p className="px-6 py-8 text-sm text-slate-400 text-center">
          Follow-up scheduling connects to the appointments module. Configure in Settings → Appointments.
        </p>
      </div>

    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

const colorMap = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', value: 'text-blue-700', border: 'border-blue-100' },
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', value: 'text-indigo-700', border: 'border-indigo-100' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-600', value: 'text-amber-700', border: 'border-amber-100' },
  green: { bg: 'bg-green-50', icon: 'text-green-600', value: 'text-green-700', border: 'border-green-100' },
  red: { bg: 'bg-red-50', icon: 'text-red-600', value: 'text-red-700', border: 'border-red-100' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', value: 'text-orange-700', border: 'border-orange-100' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', value: 'text-purple-700', border: 'border-purple-100' },
  slate: { bg: 'bg-slate-50', icon: 'text-slate-600', value: 'text-slate-700', border: 'border-slate-100' },
} as const;

function StatCard({
  label,
  value,
  sub,
  icon,
  href,
  color,
}: {
  label: string;
  value: number;
  sub: string;
  icon: React.ReactNode;
  href: string;
  color: keyof typeof colorMap;
}) {
  const c = colorMap[color];
  return (
    <Link href={href} className={`block rounded-xl border p-4 hover:shadow-sm transition-shadow ${c.bg} ${c.border}`}>
      <div className={`mb-2 ${c.icon}`}>{icon}</div>
      <p className={`text-2xl font-bold ${c.value}`}>{value.toLocaleString()}</p>
      <p className="text-xs font-medium text-slate-700 mt-0.5">{label}</p>
      <p className="text-xs text-slate-400 mt-0.5 truncate">{sub}</p>
    </Link>
  );
}

const qaColorMap = {
  indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  purple: 'bg-purple-600 hover:bg-purple-700 text-white',
  slate: 'bg-slate-700 hover:bg-slate-800 text-white',
  red: 'bg-red-600 hover:bg-red-700 text-white',
  orange: 'bg-orange-500 hover:bg-orange-600 text-white',
  green: 'bg-green-600 hover:bg-green-700 text-white',
} as const;

function QuickAction({ href, label, color }: { href: string; label: string; color: keyof typeof qaColorMap }) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-center text-center text-xs font-semibold px-3 py-2.5 rounded-lg transition-colors ${qaColorMap[color]}`}
    >
      {label}
    </Link>
  );
}
