import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  Syringe,
  Package,
  FolderOpen,
  ShieldCheck,
  AlertTriangle,
  GraduationCap,
  Calendar,
  Settings,
  BarChart3,
  Bell,
  Search,
  HardDrive,
  Flame,
  UserPlus,
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    heading: 'Overview',
    items: [
      { label: 'Command Centre', href: '/admin', icon: LayoutDashboard },
      { label: 'Notifications', href: '/admin/notifications', icon: Bell },
      { label: 'Search', href: '/admin/search', icon: Search },
    ],
  },
  {
    heading: 'Clinical',
    items: [
      { label: 'Treatment Episodes', href: '/admin/episodes', icon: Syringe },
      { label: 'Pre-Consent Forms', href: '/forms/pre-consent', icon: ClipboardList },
      { label: 'Post-Treatment', href: '/forms/post-treatment', icon: FileText },
      { label: 'Batch Register', href: '/admin/inventory', icon: Package },
    ],
  },
  {
    heading: 'Clients',
    items: [
      { label: 'Client Database', href: '/admin/clients', icon: Users },
      { label: 'Enquiries', href: '/admin/enquiries', icon: UserPlus },
      { label: 'Appointments', href: '/admin/appointments', icon: Calendar },
    ],
  },
  {
    heading: 'Governance',
    items: [
      { label: 'Compliance Hub', href: '/command-centre', icon: ShieldCheck },
      { label: 'Fire Safety', href: '/command-centre?form=FIRE_SAFETY_CHECK', icon: Flame },
      { label: 'Incident Reports', href: '/admin/incidents', icon: AlertTriangle },
      { label: 'Staff Training', href: '/admin/training', icon: GraduationCap },
    ],
  },
  {
    heading: 'System',
    items: [
      { label: 'Reports & Exports', href: '/admin/exports', icon: BarChart3 },
      { label: 'Google Drive', href: '/admin/drive', icon: HardDrive },
      { label: 'Form Submissions', href: '/admin/submissions', icon: FolderOpen },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const { user } = session;

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col overflow-y-auto">
        {/* Brand Header */}
        <div className="px-5 py-5 border-b border-slate-700">
          <Link href="/admin" className="block">
            <h1 className="text-lg font-bold tracking-tight">PLG UK Hub</h1>
            <p className="text-xs text-slate-400 mt-0.5">Clinical Operating System</p>
          </Link>
        </div>

        {/* User Badge */}
        <div className="px-5 py-3 border-b border-slate-800">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
              {user.role}
            </span>
            <span className="text-[10px] text-slate-500">{user.siteName}</span>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 py-3">
          {NAV_SECTIONS.map((section) => (
            <div key={section.heading} className="mb-1">
              <h3 className="px-5 py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                {section.heading}
              </h3>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-5 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800">
          <Link
            href="/api/auth/signout"
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
