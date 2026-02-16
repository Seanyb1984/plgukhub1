import { prisma } from "@/lib/db";
import { AlertTriangle, ShieldAlert, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";

export async function HighRiskWidget({ brand }: { brand: string }) {
  // Fetch active high-risk submissions
  const highRiskItems = await prisma.formSubmission.findMany({
    where: {
      brand: brand as any,
      OR: [
        { riskLevel: 'HIGH' },
        { riskLevel: 'CRITICAL' },
        { requiresEscalation: true }
      ],
      status: { not: 'LOCKED' } // Only show items that still need review
    },
    include: { practitioner: true, client: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-50 bg-red-50/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 p-2 rounded-xl text-white">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Urgent Clinical Alerts</h2>
        </div>
        <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-[10px] font-black">
          {highRiskItems.length} ACTIVE
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {highRiskItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-10 text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
               <ShieldAlert className="w-6 h-6 text-slate-200" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">No clinical risks detected</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {highRiskItems.map((item) => (
              <Link 
                key={item.id} 
                href={`/admin/submissions/${item.id}`}
                className="block p-5 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${
                    item.riskLevel === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {item.riskLevel} Risk
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">{formatDateTime(item.createdAt)}</span>
                </div>
                <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase">
                  {item.client ? `${item.client.firstName} ${item.client.lastName}` : "Internal Log"}
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-1 italic">
                  Flagged: {item.formType.replace(/_/g, ' ')}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">
                    By: {item.practitioner?.name}
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-600 transition-all group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <Link href="/admin/submissions" className="p-4 bg-slate-50 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-colors">
        View All Records
      </Link>
    </div>
  );
}
