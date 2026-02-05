import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDashboardStats, getFormTypeStats } from '@/lib/search';
import { formatBrand, formatDateTime, formatRiskLevel, getRiskLevelColor, getStatusColor } from '@/lib/utils';
import Link from 'next/link';

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const stats = await getDashboardStats(
    session.user.brand === 'PLG_UK' ? undefined : session.user.brand,
    session.user.role === 'ADMIN' ? undefined : session.user.siteId
  );

  const formTypeStats = await getFormTypeStats(
    session.user.brand === 'PLG_UK' ? undefined : session.user.brand,
    session.user.role === 'ADMIN' ? undefined : session.user.siteId
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-xl font-bold text-slate-900">
                PLG UK Hub
              </Link>
              <span className="text-sm text-slate-500">
                {formatBrand(session.user.brand)} - {session.user.siteName}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">{session.user.name}</span>
              <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full">
                {session.user.role}
              </span>
              <Link
                href="/api/auth/signout"
                className="text-sm text-red-600 hover:text-red-700"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 h-12">
            <Link
              href="/admin"
              className="flex items-center border-b-2 border-blue-600 text-blue-600 text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/submissions"
              className="flex items-center border-b-2 border-transparent text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              Submissions
            </Link>
            <Link
              href="/admin/clients"
              className="flex items-center border-b-2 border-transparent text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              Clients
            </Link>
            <Link
              href="/admin/forms"
              className="flex items-center border-b-2 border-transparent text-slate-600 hover:text-slate-900 text-sm font-medium"
            >
              New Form
            </Link>
            {session.user.role === 'ADMIN' && (
              <Link
                href="/admin/exports"
                className="flex items-center border-b-2 border-transparent text-slate-600 hover:text-slate-900 text-sm font-medium"
              >
                Exports
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="text-sm font-medium text-slate-500">Total Submissions</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">{stats.counts.total}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="text-sm font-medium text-slate-500">Today</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">{stats.counts.today}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="text-sm font-medium text-slate-500">This Week</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">{stats.counts.week}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="text-sm font-medium text-slate-500">This Month</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">{stats.counts.month}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent High Risk */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">High Risk Items</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {stats.recentHighRisk.length === 0 ? (
                <div className="px-6 py-8 text-center text-slate-500">
                  No high-risk items
                </div>
              ) : (
                stats.recentHighRisk.map((item) => (
                  <Link
                    key={item.id}
                    href={`/admin/submissions/${item.id}`}
                    className="block px-6 py-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-slate-900">
                          {item.formType.replace(/_/g, ' ')}
                        </div>
                        <div className="text-sm text-slate-500">
                          {item.client
                            ? `${item.client.firstName} ${item.client.lastName}`
                            : 'No client'}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {item.site.name}
                        </div>
                      </div>
                      <span className={getRiskLevelColor(item.riskLevel)}>
                        {formatRiskLevel(item.riskLevel)}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Recent Incidents */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Recent Incidents</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {stats.recentIncidents.length === 0 ? (
                <div className="px-6 py-8 text-center text-slate-500">
                  No recent incidents
                </div>
              ) : (
                stats.recentIncidents.map((item) => (
                  <Link
                    key={item.id}
                    href={`/admin/submissions/${item.id}`}
                    className="block px-6 py-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-slate-900">
                          {item.formType.replace(/_/g, ' ')}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {item.site.name}
                        </div>
                      </div>
                      <div className="text-xs text-slate-400">
                        {formatDateTime(item.createdAt)}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Recent Complaints */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Recent Complaints</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {stats.recentComplaints.length === 0 ? (
                <div className="px-6 py-8 text-center text-slate-500">
                  No recent complaints
                </div>
              ) : (
                stats.recentComplaints.map((item) => (
                  <Link
                    key={item.id}
                    href={`/admin/submissions/${item.id}`}
                    className="block px-6 py-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-slate-900">
                          {item.client
                            ? `${item.client.firstName} ${item.client.lastName}`
                            : 'Anonymous'}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {item.site.name}
                        </div>
                      </div>
                      <div className="text-xs text-slate-400">
                        {formatDateTime(item.createdAt)}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Status and Form Type Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* By Status */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">By Status</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {Object.entries(stats.byStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
                      {status}
                    </span>
                    <span className="font-medium text-slate-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Form Types */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Top Form Types</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {formTypeStats.slice(0, 10).map((stat) => (
                  <div key={stat.formType} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 truncate max-w-[200px]">
                      {stat.formType.replace(/_/g, ' ')}
                    </span>
                    <span className="font-medium text-slate-900">{stat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
