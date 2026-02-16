import { getComplianceStats } from "@/lib/actions/analytics";
import { ShieldAlert, CheckCircle, TrendingUp, Activity, Users, Clock } from "lucide-react";

export default async function CommandCenter() {
  // This pulls from the Analytics Action we defined earlier
  const stats = await getComplianceStats();

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-12">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* 1. HEADER SECTION */}
        <div className="flex justify-between items-end border-b pb-8 border-slate-200">
          <div>
            <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic">
              Command <span className="text-blue-600">Center</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em] mt-2">
              Clinical Oversight • Site Audit v4.0
            </p>
          </div>
          <div className="hidden md:flex gap-4">
             <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
               <div className={`w-3 h-3 rounded-full ${stats.complianceScore === 100 ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
               <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase">Compliance Health</p>
                 <p className="text-xl font-black text-slate-900">{stats.complianceScore}%</p>
               </div>
             </div>
          </div>
        </div>

        {/* 2. STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Treatments" value={stats.totalAesthetics} icon={<Activity />} color="blue" />
          <StatCard title="Oversight Gaps" value={stats.missingPrescriber} icon={<ShieldAlert />} color={stats.missingPrescriber > 0 ? "red" : "green"} />
          <StatCard title="Active Prospects" value="24" icon={<Users />} color="white" />
          <StatCard title="Site Growth" value="+18%" icon={<TrendingUp />} color="blue" />
        </div>

        {/* 3. MAIN AUDIT LOG */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Dr. Phil's Oversight List */}
          <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm space-y-8">
            <h3 className="text-xl font-black uppercase text-slate-900 flex items-center gap-3">
              <CheckCircle className="text-blue-600 w-6 h-6" /> Live Audit Trail
            </h3>
            
            <div className="space-y-4">
               {/* Real-time Row Examples */}
               <AuditRow patient="John Doe" type="Botox (Aesthetics)" doctor="Dr. Phil" status="Verified" time="10m ago" />
               <AuditRow patient="Mike Ross" type="Vit B12 Injection" doctor="Dr. Phil" status="Verified" time="1h ago" />
               <AuditRow patient="Sarah J." type="Aesthetics Triage" doctor="PENDING" status="Action Required" time="2h ago" alert />
            </div>
          </div>

          {/* System Health / Sync */}
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl space-y-10">
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-blue-400 mb-6">Integration Status</h3>
              <div className="space-y-6">
                <SyncItem label="Google Drive Vault" status="Connected" />
                <SyncItem label="MHRA Watchdog" status="Scanning..." />
                <SyncItem label="Gmail Automations" status="98% Sent" />
                <SyncItem label="Facial Mapping" status="Ready" />
              </div>
            </div>

            <div className="pt-10 border-t border-white/10">
              <p className="text-[10px] font-black uppercase text-slate-500 mb-4">GMC Prescriber Log</p>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                 <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black">P</div>
                 <div>
                   <p className="text-xs font-black uppercase">Dr. Phil Verified</p>
                   <p className="text-[9px] opacity-40 font-bold uppercase">GMC: 1234567 • Active</p>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// UI HELPER COMPONENTS
function StatCard({ title, value, icon, color }: any) {
  const themes: any = {
    blue: "bg-blue-600 text-white shadow-blue-200",
    red: "bg-red-500 text-white animate-pulse shadow-red-200",
    green: "bg-green-500 text-white",
    white: "bg-white text-slate-900 border border-slate-200"
  };
  return (
    <div className={`p-8 rounded-[2.5rem] relative overflow-hidden group shadow-xl ${themes[color]}`}>
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">{title}</p>
        <p className="text-5xl font-black mt-2 tracking-tighter italic">{value}</p>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-all duration-500">
        {icon}
      </div>
    </div>
  );
}

function AuditRow({ patient, type, doctor, status, time, alert }: any) {
  return (
    <div className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${
      alert ? "bg-red-50 border-red-100" : "bg-slate-50 border-transparent hover:bg-white hover:border-slate-200 hover:shadow-md"
    }`}>
      <div className="flex items-center gap-5">
        <div className={`w-3 h-3 rounded-full ${alert ? "bg-red-500" : "bg-green-500"}`} />
        <div>
          <p className="font-black text-slate-900 uppercase text-sm">{patient}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{type}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black text-slate-900 uppercase">{doctor}</p>
        <div className="flex items-center justify-end gap-2 mt-1">
          <Clock className="w-3 h-3 text-slate-300" />
          <p className="text-[9px] font-black text-slate-300 uppercase">{time}</p>
        </div>
      </div>
    </div>
  );
}

function SyncItem({ label, status }: any) {
  return (
    <div className="flex justify-between items-center border-b border-white/5 pb-4">
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{label}</span>
      <span className="text-[10px] font-black uppercase text-blue-400">{status}</span>
    </div>
  );
}