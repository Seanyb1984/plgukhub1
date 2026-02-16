"use client";

import Link from "next/link";
import { 
  Plus, 
  Search, 
  ShieldCheck, 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  ArrowRight, 
  Activity,
  FileText, // FIXED: Added missing icon
  Package   // FIXED: Added missing icon
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      
      {/* TOP ROW: KPIs */}
      <div className="grid grid-cols-5 gap-6">
        {[
          { label: "New Leads", val: "12", color: "text-blue-600" },
          { label: "Consults Today", val: "8", color: "text-slate-900" },
          { label: "Treatments", val: "5", color: "text-slate-900" },
          { label: "Follow Ups", val: "14", color: "text-slate-900" },
          { label: "Open Incidents", val: "0", color: "text-green-500" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{kpi.label}</p>
            <h4 className={`text-3xl font-black mt-1 ${kpi.color}`}>{kpi.val}</h4>
          </div>
        ))}
      </div>

      {/* MIDDLE ROW: QUICK ACTIONS (BIG BUTTONS) */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { name: "New Lead", icon: Plus, bg: "bg-blue-600 text-white", href: "/admin/enquiries/new" },
          { name: "Start Consult", icon: FileText, bg: "bg-slate-900 text-white", href: "/forms/consultation" },
          { name: "Finalise Consent", icon: ShieldCheck, bg: "bg-slate-900 text-white", href: "/forms/pre-consent" },
          { name: "Log Treatment", icon: Activity, bg: "bg-slate-900 text-white", href: "/forms/post-treatment" },
        ].map((btn) => (
          <Link href={btn.href} key={btn.name} className={`${btn.bg} p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:scale-[1.02] transition-all shadow-xl group cursor-pointer`}>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <btn.icon className="w-6 h-6" />
            </div>
            <span className="font-black uppercase tracking-widest text-xs">{btn.name}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* RECENT ACTIVITY & ALERTS */}
        <div className="col-span-8 space-y-6">
           <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
             <Calendar className="text-blue-600 w-5 h-5" /> Today's Clinical Schedule
           </h2>
           <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Time</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Patient</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Treatment</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { time: "09:30", name: "John Test", type: "Girth Enhancement", status: "Arrived" },
                    { time: "11:00", name: "Sarah Smith", type: "Botox - 3 Areas", status: "Confirmed" },
                    { time: "14:00", name: "Michael Ross", type: "LSWT Session 3", status: "In Treatment" },
                  ].map((apt) => (
                    <tr key={apt.time} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-6 font-black text-sm">{apt.time}</td>
                      <td className="px-8 py-6 font-bold text-sm uppercase">{apt.name}</td>
                      <td className="px-8 py-6 text-xs font-bold text-slate-500">{apt.type}</td>
                      <td className="px-8 py-6">
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-black text-[9px] uppercase">{apt.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>

        {/* SIDEBAR: SYSTEM ALERTS */}
        <div className="col-span-4 space-y-6">
           <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
             <AlertTriangle className="text-red-600 w-5 h-5" /> System Alerts
           </h2>
           <div className="bg-red-50 border-2 border-red-100 p-8 rounded-[2.5rem] space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center text-white shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black uppercase text-xs text-red-900">Batch Expiry Warning</h4>
                  <p className="text-[10px] font-bold text-red-700 uppercase mt-1 leading-tight">Juvederm Volux (Batch #882) expires in 3 days.</p>
                </div>
              </div>
           </div>
           
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Growth Analytics</h3>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Month-on-Month Revenue</span>
                <span className="flex items-center gap-1 text-green-600 font-black text-sm"><TrendingUp className="w-4 h-4" /> +14%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[70%]" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}