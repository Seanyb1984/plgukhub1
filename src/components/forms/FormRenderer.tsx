"use client";

import { useState, useEffect } from "react";
import { FormDefinition } from "@/lib/forms/types";
import { SignatureInput } from "./SignatureInput";
import { Camera, ShieldAlert, CheckCircle2, User, Search, Loader2 } from "lucide-react";

export function FormRenderer({ 
  definition, 
  onSubmit 
}: { 
  definition: FormDefinition, 
  onSubmit: (data: any) => void 
}) {
  const [formData, setFormData] = useState<any>({});
  const [uploading, setUploading] = useState<string | null>(null);
  
  // Client Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const handleChange = (id: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  // Logic to search clients via a debounced fetch
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 2) {
        setIsSearching(true);
        try {
          // This calls your internal search endpoint
          const response = await fetch(`/api/clients/search?q=${searchTerm}`);
          const data = await response.json();
          setSearchResults(data);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const selectClient = (client: any) => {
    setSelectedClient(client);
    handleChange('clientId', client.id);
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleFileUpload = async (fieldId: string, file: File) => {
    setUploading(fieldId);
    // Simulation: In production, this would use a Server Action to upload to S3/Minio
    setTimeout(() => {
      handleChange(fieldId, `SUCCESS: ${file.name}`);
      setUploading(null);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-[3rem] overflow-hidden border border-slate-200 mb-10">
      {/* 1. HEADER & BRANDING */}
      <div className="bg-slate-900 p-10 text-white">
        <h1 className="text-3xl font-black tracking-tight uppercase">{definition.title}</h1>
        <div className="mt-4 flex items-center gap-3">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest">
            {definition.version}
          </span>
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
            <CheckCircle2 className="w-3 h-3 text-blue-500" /> Secure Clinical Engine
          </div>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="p-10 space-y-12">
        
        {/* 2. CLIENT SELECTION (MANDATORY) */}
        <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border-2 border-blue-100/50 space-y-6">
          <label className="block text-[11px] font-black uppercase tracking-widest text-blue-600 ml-1">
            Clinical Accountability: Select Patient
          </label>
          
          {!selectedClient ? (
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search by Name, Email, or DOB..."
                className="w-full pl-14 pr-5 py-5 bg-white border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-slate-900 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {isSearching && <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-blue-500" />}
              
              {searchResults.length > 0 && (
                <div className="absolute z-20 w-full mt-3 bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden">
                  {searchResults.map((client) => (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => selectClient(client)}
                      className="w-full text-left p-5 hover:bg-blue-50 border-b last:border-0 border-slate-100 transition-colors flex justify-between items-center group"
                    >
                      <div>
                        <p className="font-black text-slate-900 uppercase">{client.firstName} {client.lastName}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
                          {client.email} • DOB: {client.dateOfBirth}
                        </p>
                      </div>
                      <User className="w-5 h-5 text-slate-200 group-hover:text-blue-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between p-5 bg-white rounded-2xl border-2 border-blue-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-black text-slate-900 uppercase">{selectedClient.firstName} {selectedClient.lastName}</p>
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Patient Verified & Linked</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => {setSelectedClient(null); handleChange('clientId', null);}}
                className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest px-4 py-2 hover:bg-red-50 rounded-lg transition-all"
              >
                Change
              </button>
            </div>
          )}
        </div>

        {/* 3. DYNAMIC FORM FIELDS */}
        {definition.fields.map((field) => {
          
          // --- 🧠 LOGIC ENGINE ---
          let isVisible = true;
          if (field.id === 'clin_sec' || field.id === 'product_batch') {
            isVisible = ["Facial Aesthetics", "Sexual Wellness", "Advanced Skincare"].includes(formData.treatmentType);
          }
          if (field.id === 'device_settings') {
            isVisible = formData.treatmentType === "Sexual Wellness";
          }
          if (field.id === 'wax_sec') {
            isVisible = formData.treatmentType?.includes("Waxing");
          }
          if (field.id === 'pregnancy_status') {
            isVisible = formData.treatmentType === "Intimate Waxing";
          }
          if (field.id === 'before_photo' || field.id === 'after_photo') {
            isVisible = formData.photo_consent_obtained && formData.photo_consent_obtained !== "No - Consent Refused";
          }

          if (!isVisible) return null;

          // --- 🛑 STOP-LOGIC ---
          let stopWarning = null;
          if (field.id === 'blood_disorder' && formData[field.id] === 'Yes') {
            stopWarning = { message: "STOP: Procedure contraindicated for blood disorders.", riskLevel: "CRITICAL" };
          }
          if (field.id === 'active_infection' && formData[field.id] === 'Yes') {
            stopWarning = { message: "STOP: Cannot treat area with active infection.", riskLevel: "HIGH" };
          }

          if (field.type === 'section') {
            return (
              <div key={field.id} className="pt-10 first:pt-0">
                <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] flex items-center gap-4">
                  {field.label}
                  <div className="h-[1px] flex-1 bg-slate-100" />
                </h2>
              </div>
            );
          }

          return (
            <div key={field.id} className="space-y-4 group">
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 ml-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              
              {field.type === 'select' && (
                <select 
                  className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold"
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  required={field.required}
                  value={formData[field.id] || ""}
                >
                  <option value="">Select Option...</option>
                  {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              )}

              {field.type === 'signature' && (
                <div className="bg-slate-50 p-4 rounded-3xl border-2 border-slate-100">
                    <SignatureInput onSave={(val) => handleChange(field.id, val)} />
                </div>
              )}

              {field.type === 'file' && (
                <div className={`relative p-8 rounded-[2rem] border-2 border-dashed transition-all text-center ${
                    formData[field.id] ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200 hover:border-blue-400"
                }`}>
                    <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment" 
                        className="hidden" 
                        id={`file-${field.id}`}
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(field.id, e.target.files[0])}
                    />
                    <label htmlFor={`file-${field.id}`} className="cursor-pointer flex flex-col items-center gap-3">
                        {uploading === field.id ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                        ) : formData[field.id] ? (
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        ) : (
                            <Camera className="w-10 h-10 text-slate-300" />
                        )}
                        <span className="text-xs font-black uppercase tracking-tight text-slate-900">
                            {formData[field.id] ? "Photo Captured Successfully" : "Tap to Snap Clinical Photo"}
                        </span>
                    </label>
                </div>
              )}

              {field.type === 'radio' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {field.options?.map(opt => (
                    <label key={opt} className={`p-5 border-2 rounded-2xl text-center cursor-pointer font-black text-xs uppercase tracking-tight transition-all ${
                        formData[field.id] === opt ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-100 hover:bg-slate-50 text-slate-900"
                    }`}>
                      <input 
                        type="radio" 
                        name={field.id} 
                        value={opt} 
                        className="hidden" 
                        onChange={(e) => handleChange(field.id, e.target.value)} 
                        required={field.required}
                        checked={formData[field.id] === opt}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {(field.type === 'text' || field.type === 'date' || field.type === 'number') && (
                <input 
                  type={field.type} 
                  placeholder={field.placeholder}
                  className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold" 
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  required={field.required}
                  value={formData[field.id] || ""}
                />
              )}

              {field.type === 'checkbox' && (
                <label className={`flex items-start gap-5 p-6 rounded-3xl cursor-pointer border-2 transition-all ${
                    formData[field.id] ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-transparent hover:border-slate-200"
                }`}>
                  <input 
                    type="checkbox" 
                    className="w-6 h-6 rounded-lg border-2 border-slate-300 text-blue-600 mt-0.5" 
                    onChange={(e) => handleChange(field.id, e.target.checked)}
                    required={field.required}
                  />
                  <span className="text-xs text-slate-700 font-bold leading-relaxed uppercase tracking-tight">
                    {field.label}
                  </span>
                </label>
              )}

              {stopWarning && (
                <div className="p-6 bg-red-50 border-2 border-red-200 rounded-[2rem] flex items-start gap-4">
                    <ShieldAlert className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                    <div>
                        <p className="text-xs font-black text-red-900 uppercase tracking-tight">{stopWarning.message}</p>
                        <p className="text-[10px] font-bold text-red-600 uppercase mt-1">Risk Level: {stopWarning.riskLevel}</p>
                    </div>
                </div>
              )}
            </div>
          );
        })}

        {/* 4. SUBMIT ACTION */}
        <div className="pt-12">
          <button 
            type="submit" 
            disabled={!formData.clientId}
            className="w-full bg-slate-900 text-white py-8 rounded-[2.5rem] font-black text-2xl shadow-2xl hover:bg-blue-600 transition-all flex flex-col items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>SUBMIT SECURE RECORD</span>
            <span className="text-[9px] font-bold opacity-50 uppercase tracking-[0.4em]">
              {!formData.clientId ? "Select Patient to Enable" : `Audit Trail ID: ${definition.id.toUpperCase()}`}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
