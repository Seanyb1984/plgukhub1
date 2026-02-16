import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth-helpers";
import { formatBrand, formatDateTime } from "@/lib/utils";
import { Eye, ShieldCheck } from "lucide-react";

export default async function SubmissionsPage() {
  const session = await requireSession();
  
  // 1. Incorporate Site Switching: Filter by active siteId
  // Uses optional chaining to prevent query errors if session data is still syncing
  const submissions = await prisma.formSubmission.findMany({
    where: {
      siteId: session.user.siteId || undefined, 
      // Only filter by brand if they aren't the PLG_UK master admin
      ...(session.user.brand === "PLG_UK" ? {} : { brand: session.user.brand })
    },
    include: { site: true, practitioner: true },
    orderBy: { submittedAt: 'desc' }
  });

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Form Submissions</h1>
          <p className="text-slate-500 font-medium tracking-tight">
            {/* FIXED: Added optional chaining to prevent 'undefined' crash */}
            Managing records for <span className="text-blue-600 font-bold">{session.user.site?.name || "Global Headquarters"}</span>
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-100 px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">CQC Audit Ready</span>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Form Type</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Practitioner</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold italic uppercase text-xs tracking-widest">
                  No clinical records found for this location.
                </td>
              </tr>
            ) : (
              submissions.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6 text-sm font-bold text-slate-600 font-mono">
                    {formatDateTime(s.submittedAt || s.createdAt)}
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                      {s.formType.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-slate-900 leading-none mb-1">{s.practitioner?.name || "System"}</div>
                    <div className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">{formatBrand(s.brand)}</div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <a 
                      href={`/admin/submissions/${s.id}`} 
                      className="inline-flex items-center gap-2 text-slate-900 hover:text-blue-600 font-black text-[10px] uppercase tracking-widest bg-slate-50 hover:bg-blue-50 px-5 py-2.5 rounded-xl transition-all border border-slate-200 hover:border-blue-200"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </a>
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
