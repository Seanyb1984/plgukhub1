import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth-helpers";
import Link from "next/link";
import { UserPlus, Search, User } from "lucide-react";

export default async function ClientDirectoryPage() {
  await requireSession();

  const clients = await prisma.client.findMany({
    orderBy: { lastName: 'asc' },
    include: { site: true }
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-6xl font-black tracking-tighter uppercase text-slate-900">Directory</h1>
          <p className="text-slate-400 font-bold mt-2">Manage clinical records and vaults.</p>
        </div>
        
        <Link 
          href="/admin/clients/new" 
          className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl"
        >
          <UserPlus className="w-5 h-5" /> Add New Client
        </Link>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Patient</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Clinic</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {clients.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-8 py-20 text-center text-slate-300 italic font-bold">
                  No clients found. Click "Add New Client" to begin.
                </td>
              </tr>
            ) : (
              clients.map((c) => (
                <tr key={c.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-900 uppercase group-hover:text-blue-600 transition-colors">{c.firstName} {c.lastName}</div>
                    <div className="text-[10px] font-mono text-slate-400">ID: {c.clientId}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-slate-600">{c.site?.name || "Main Site"}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link 
                      href={`/admin/clients/${c.id}`}
                      className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
                    >
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
