import Link from "next/link";
import { 
  Users, Activity, ShieldCheck, ClipboardList, Zap, 
  BarChart3, Settings, Camera, Package, AlertOctagon, 
  FileText, CheckSquare, Sparkles, MessageSquare 
} from "lucide-react";

const NAV_ITEMS = [
  { group: "OPERATIONS", items: [
    { name: "Leads & Enquiries", icon: MessageSquare, href: "/admin/enquiries" },
    { name: "Patients", icon: Users, href: "/admin/clients" },
    { name: "Consultations", icon: FileText, href: "/admin/consultations" },
    { name: "Treatment Episodes", icon: Activity, href: "/admin/episodes" },
  ]},
  { group: "COMPLIANCE & RISK", items: [
    { name: "Consents", icon: ShieldCheck, href: "/admin/consents" },
    { name: "Aftercare", icon: Zap, href: "/admin/aftercare" },
    { name: "Incidents", icon: AlertOctagon, href: "/admin/incidents" },
    { name: "Batch Registry", icon: Package, href: "/admin/inventory" },
  ]},
  { group: "MANAGEMENT", items: [
    { name: "Checklists", icon: CheckSquare, href: "/admin/checklists" },
    { name: "Staff & Training", icon: Users, href: "/admin/staff" },
    { name: "Photo Library", icon: Camera, href: "/admin/media" },
    { name: "Reports", icon: BarChart3, href: "/admin/reports" },
  ]}
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col fixed h-full shadow-2xl z-50">
        <div className="p-8">
          <h1 className="text-2xl font-black italic tracking-tighter text-blue-500">PLG <span className="text-white">HUB</span></h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Operating System</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 space-y-8">
          {NAV_ITEMS.map((group) => (
            <div key={group.group}>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-4">{group.group}</h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link key={item.name} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all group text-sm font-bold">
                    <item.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-72 p-10">
        {children}
      </main>
    </div>
  );
}