"use client";

import { useState } from "react";
import { MapPin, ChevronDown, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export function SiteSwitcher({ 
  currentSite, 
  availableSites 
}: { 
  currentSite: { id: string, name: string }, 
  availableSites: { id: string, name: string }[] 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSiteChange = async (siteId: string) => {
    // In a real app, you'd call a Server Action to update the user's active siteId in the session/DB
    console.log("Switching to site:", siteId);
    setIsOpen(false);
    router.refresh(); 
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-all border border-slate-200 group"
      >
        <div className="bg-white p-1.5 rounded-lg shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
        </div>
        <div className="text-left">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active Location</p>
          <p className="text-xs font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
            {currentSite.name}
            <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="px-4 py-2 border-b border-slate-50 mb-2">
            <p className="text-[10px] font-black text-slate-400 uppercase">Switch Clinic</p>
          </div>
          {availableSites.map((site) => (
            <button
              key={site.id}
              onClick={() => handleSiteChange(site.id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition-colors text-left group"
            >
              <span className={`text-xs font-bold ${currentSite.id === site.id ? 'text-blue-600' : 'text-slate-600'}`}>
                {site.name}
              </span>
              {currentSite.id === site.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
