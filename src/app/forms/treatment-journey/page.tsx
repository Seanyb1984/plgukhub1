"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, UserCheck, ClipboardCheck, Loader2, ArrowLeft, ShieldCheck, Activity } from "lucide-react";

function MasterTreatmentForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [clientId, setClientId] = useState(searchParams.get("clientId") || "");
  const [clientName, setClientName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);

  const treatmentOptions = [
    { id: "LSWT", label: "Linear Shockwave Therapy" },
    { id: "PRP_SEXUAL", label: "PRP (Sexual Health/P-Shot)" },
    { id: "PRP_HAIR", label: "PRP Hair Restoration" },
    { id: "HOLETOX", label: "Holetox" },
    { id: "SCROTOX", label: "Scrotox" },
    { id: "SHORT_TOX", label: "Short Tox" },
    { id: "ANTERIOR_ANKLE", label: "Anterior Ankle Treatment" },
    { id: "ANTI_WRINKLE", label: "Anti-Wrinkle (Botox)" },
    { id: "RHINOPLASTY", label: "Non-Surgical Rhinoplasty" },
    { id: "FILLER_FACE", label: "Dermal Filler (Face/Jawline)" }
  ];

  useEffect(() => {
    if (searchQuery.length > 2) {
      fetch(`/api/clients/search?q=${searchQuery}`).then(res => res.json()).then(data => setSearchResults(data));
    }
  }, [searchQuery]);

  const toggleTreatment = (id: string) => {
    setSelectedTreatments(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!clientId) return alert("Select a patient!");
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      ...Object.fromEntries(formData.entries()),
      selectedTreatments,
      timestamp: new Date().toISOString()
    };

    try {
      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          formType: "MASTER_CONSENT",
          formData: data,
          riskLevel: selectedTreatments.includes("RHINOPLASTY") ? "HIGH" : "LOW"
        }),
      });

      if (res.ok) {
        alert("Clinical Record & Consent Saved.");
        router.push(`/admin/clients/${clientId}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!clientId) {
    return (
      <div className="max-w-xl mx-auto py-20 px-6">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">Patient Lookup</h2>
          <input 
            className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-none mb-6 outline-none focus:ring-2 focus:ring-blue-600" 
            placeholder="Search Name..." 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
          <div className="space-y-2">
            {searchResults.map((c: any) => (
              <button key={c.id} onClick={() => { setClientId(c.id); setClientName(`${c.firstName} ${c.lastName}`); }} className="w-full p-4 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-xl transition-all font-black uppercase text-xs flex justify-between">
                <span>{c.firstName} {c.lastName}</span>
                <span className="opacity-40">{c.clientId}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-10 rounded-[3rem] flex justify-between items-center shadow-2xl">
          <div>
            <button onClick={() => setClientId("")} className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
               <ArrowLeft className="w-3 h-3" /> Back
            </button>
            <h1 className="text-4xl font-black uppercase tracking-tighter">{clientName}</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Master Clinical Consent & Treatment Record</p>
          </div>
          <Activity className="text-blue-600 w-12 h-12" />
        </div>

        {/* Treatment Selection */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <h3 className="text-xs font-black uppercase text-blue-600 tracking-widest mb-6">1. Select Treatments Applied Today</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {treatmentOptions.map(t => (
              <button 
                key={t.id} 
                type="button"
                onClick={() => toggleTreatment(t.id)}
                className={`p-4 rounded-2xl text-left font-bold text-xs transition-all border-2 ${selectedTreatments.includes(t.id) ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-50 bg-slate-50 text-slate-500'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clinical Assessment */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
          <h3 className="text-xs font-black uppercase text-blue-600 tracking-widest">2. Clinical Assessment & Notes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Batch Numbers (Tox/Filler/PRP)</label>
              <input name="batchNumbers" className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-none outline-none" placeholder="e.g. Allergan B123 / Juvederm X45" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">LSWT Settings (mJ/Hz/Shots)</label>
              <input name="shockwaveSettings" className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-none outline-none" placeholder="e.g. 90mJ / 15Hz / 3000 shots" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Practitioner Procedure Notes</label>
            <textarea name="procedureNotes" rows={5} className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-none outline-none resize-none" placeholder="Detailed treatment notes..."></textarea>
          </div>
        </div>

        {/* Legal Consent Toggle */}
        <div className="bg-blue-600 p-10 rounded-[3rem] text-white space-y-4 shadow-xl">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-8 h-8 flex-shrink-0" />
            <div>
              <h4 className="font-black uppercase tracking-tight">Combined Clinical Consent</h4>
              <p className="text-sm font-medium text-blue-100 mt-1">
                The patient confirms they have been informed of the risks associated with the selected treatments, including bruising, swelling, and infection. They have had the opportunity to ask questions and wish to proceed.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl">
            <input type="checkbox" required className="w-6 h-6 rounded-lg accent-blue-400" />
            <span className="font-black uppercase text-xs">Patient Electronically Consents</span>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-slate-900 text-white py-8 rounded-[2.5rem] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-[0.98]"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <ClipboardCheck />}
          {isSubmitting ? "Processing..." : "Secure Record & Upload to Drive"}
        </button>
      </form>
    </div>
  );
}

export default function MasterFormPage() {
  return <Suspense fallback={<div>Loading...</div>}><MasterTreatmentForm /></Suspense>;
}
