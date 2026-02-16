import DriveFolderButton from "@/components/DriveFolderButton";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth-helpers";
import { notFound } from "next/navigation";
import { formatDateTime } from "@/lib/utils";
import { FileText, ShieldAlert, Calendar, UserCheck } from "lucide-react";
import Link from "next/link";

export default async function ClientHistoryPage(props: { params: Promise<{ id: string }> }) {
  await requireSession();
  
  // NEXT.JS 16 FIX: We must await the params before using them
  const params = await props.params;

  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: { 
      submissions: {
        orderBy: { createdAt: 'desc' },
        include: { practitioner: true }
      }
    }
  });

  if (!client) notFound();

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Client Profile Header */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex justify-between items-start shadow-2xl">
        <div className="flex gap-6 items-center">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-3xl font-black">
                {client.firstName[0]}{client.lastName[0]}
            </div>
            <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter">{client.firstName} {client.lastName}</h1>
                <div className="flex gap-4 mt-2 text-slate-400 text-sm font-bold">
                    <span>{client.email}</span>
                    <span>•</span>
                    <span>{client.phone}</span>
                </div>
            </div>
        </div>
        <div className="text-right">
            <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Status</div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                <UserCheck className="w-4 h-4 text-green-400" />
                <span className="text-xs font-black uppercase">Active Patient</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar: Essential Info */}
        <div className="lg:col-span-4 space-y-6">
            
            {/* Google Drive Integration Section */}
            <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Cloud Storage</h3>
                <DriveFolderButton 
                  clientId={client.id} 
                  clientName={`${client.firstName} ${client.lastName}`} 
                />
            </div>

            {/* NEW: Clinical Actions (Pre-Consent & Post-Treatment) */}
            <div className="space-y-3">
                <Link 
                  href={`/forms/pre-consent?clientId=${client.id}`}
                  className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
                >
                  Stage 1: Pre-Consent
                </Link>
                
                <Link 
                  href={`/forms/post-treatment?clientId=${client.id}`}
                  className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-900 text-slate-900 p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                >
                  Stage 2: Treatment Record
                </Link>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Patient Alerts</h3>
                {client.marketingEmail ? (
                    <div className="flex items-center gap-3 text-green-600 text-xs font-black uppercase mb-4">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Marketing Opt-In
                    </div>
                ) : (
                    <div className="text-slate-300 text-xs font-bold uppercase">No Active Warnings</div>
                )}
            </div>
        </div>

        {/* Main Content: The Timeline */}
        <div className="lg:col-span-8 space-y-8">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                <Calendar className="w-5 h-5 text-blue-600" /> Clinical Timeline
            </h2>
            
            <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {client.submissions.length === 0 ? (
                  <div className="pl-16 text-slate-400 italic font-bold">No clinical records found for this patient yet.</div>
                ) : (
                  client.submissions.map((sub) => (
                    <div key={sub.id} className="relative pl-16 group">
                        <div className="absolute left-4 top-2 w-4 h-4 rounded-full bg-white border-4 border-slate-900 shadow-sm group-hover:scale-125 transition-transform" />
                        
                        <Link href={`/admin/submissions/${sub.id}`} className="block bg-white p-6 rounded-3xl border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        {formatDateTime(sub.submittedAt || sub.createdAt)}
                                    </div>
                                    <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase">
                                        {sub.formType.replace(/_/g, ' ')}
                                    </h4>
                                </div>
                                {sub.riskLevel === 'HIGH' && (
                                    <ShieldAlert className="w-5 h-5 text-red-500 animate-bounce" />
                                )}
                            </div>
                            
                            <div className="flex items-center gap-2 border-t border-slate-50 pt-4">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Practitioner:</div>
                                <div className="text-xs font-black text-slate-600">{sub.practitioner?.name || "System Record"}</div>
                            </div>
                        </Link>
                    </div>
                  ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
