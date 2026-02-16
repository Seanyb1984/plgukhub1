import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth-helpers";
import { formatBrand, formatDateTime } from "@/lib/utils";
import { MessageCircle, CheckCircle, Clock, XCircle, Plus } from "lucide-react";
import { updateEnquiryStatus } from "@/lib/actions/enquiries";
import { AddEnquiryForm } from "@/components/forms/AddEnquiryForm";

export default async function EnquiriesPage() {
  const session = await requireSession();
  
  // 1. Get enquiries filtered by user's brand access
  const enquiries = await prisma.enquiry.findMany({
    where: session.user.brand === "PLG_UK" ? {} : { brand: session.user.brand },
    include: { site: true },
    orderBy: { createdAt: 'desc' }
  });

  // 2. Get sites for the "Add Manual Lead" dropdown
  const sites = await prisma.site.findMany({
    where: session.user.brand === "PLG_UK" ? {} : { brand: session.user.brand },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Centralized Enquiries</h1>
          <p className="text-sm text-slate-500 italic">
            Currently managing leads for <span className="font-semibold text-blue-600">{session.user.brand.replace('_', ' ')}</span>
          </p>
        </div>
        
        {/* The Add Manual Lead Popup Component */}
        <AddEnquiryForm sites={sites} userBrand={session.user.brand} />
      </div>

      {/* Main Enquiries Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client / Source</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Inquiry Notes</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Brand / Site</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Set Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Connect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <MessageCircle className="w-8 h-8 opacity-20" />
                    <p>No enquiries found. Leads will appear here once submitted via Web or WhatsApp.</p>
                  </div>
                </td>
              </tr>
            ) : (
              enquiries.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">{e.firstName} {e.lastName}</div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold mt-1 tracking-wider ${
                      e.source === 'WHATSAPP' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}>
                      {e.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-xs text-slate-600 italic line-clamp-2">"{e.message}"</p>
                    <p className="text-[10px] text-slate-400 mt-1">{formatDateTime(e.createdAt)}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {formatBrand(e.brand)} 
                    <div className="text-[10px] text-slate-400 font-medium">{e.site.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <form action={async () => { 'use server'; await updateEnquiryStatus(e.id, 'CONTACTED'); }}>
                        <button title="Mark Contacted" className={`p-2 rounded-lg border transition-all ${e.status === 'CONTACTED' ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'border-slate-200 text-slate-400 hover:border-blue-300 hover:bg-blue-50'}`}>
                          <Clock className="w-4 h-4" />
                        </button>
                      </form>
                      <form action={async () => { 'use server'; await updateEnquiryStatus(e.id, 'BOOKED'); }}>
                        <button title="Mark Booked" className={`p-2 rounded-lg border transition-all ${e.status === 'BOOKED' ? 'bg-green-600 border-green-600 text-white shadow-md' : 'border-slate-200 text-slate-400 hover:border-green-300 hover:bg-green-50'}`}>
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </form>
                      <form action={async () => { 'use server'; await updateEnquiryStatus(e.id, 'LOST'); }}>
                        <button title="Mark Lost" className={`p-2 rounded-lg border transition-all ${e.status === 'LOST' ? 'bg-slate-700 border-slate-700 text-white shadow-md' : 'border-slate-200 text-slate-400 hover:border-red-300 hover:bg-red-50'}`}>
                          <XCircle className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {e.phone && (
                      <a 
                        href={`https://wa.me/${e.phone.replace(/\s+/g, '')}`} 
                        target="_blank" 
                        className="bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-full inline-flex items-center shadow-sm transition-all hover:scale-110 active:scale-95"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
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
