"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, FileText, Users, LogOut } from "lucide-react";

export function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();
  
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
    { name: "Forms", href: "/admin/submissions", icon: FileText },
    { name: "Clients", href: "/admin/clients", icon: Users },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 text-white flex flex-col z-50">
      <div className="p-6 text-xl font-bold text-blue-400 border-b border-slate-800 flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        PLG HUB
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`flex items-center p-3 rounded-lg transition-all ${
                isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="px-2 mb-4">
          <div className="text-sm font-semibold truncate text-slate-200">{user.name}</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            {user.brand.replace('_', ' ')} • {user.role}
          </div>
        </div>
        <Link 
          href="/api/auth/signout" 
          className="flex items-center w-full p-2 text-sm text-red-400 hover:bg-red-950/30 rounded-md transition-colors"
        >
          <LogOut className="mr-2 h-4 w-4" /> 
          Sign Out
        </Link>
      </div>
    </div>
  );
}
