"use client";

import { useState } from "react";
import { Brand } from "@prisma/client";
import { createManualEnquiry } from "@/lib/actions/enquiries";

export function AddEnquiryForm({ sites, userBrand }: { sites: any[], userBrand: Brand }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-shadow shadow-md flex items-center gap-2"
    >
      <span>+ Add Manual Lead</span>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Capture New Lead</h2>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">✕</button>
        </div>
        
        <form action={async (formData) => {
          await createManualEnquiry(formData);
          setIsOpen(false);
        }} className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">First Name</label>
              <input name="firstName" required className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Last Name</label>
              <input name="lastName" required className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Email Address</label>
            <input name="email" type="email" placeholder="client@example.com" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Phone Number</label>
            <input name="phone" placeholder="07123 456789" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Preferred Contact Method</label>
            <select name="source" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="WHATSAPP">WhatsApp (Primary)</option>
              <option value="EMAIL">Email</option>
              <option value="PHONE">Phone Call</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Assign to Site</label>
            <select name="siteId" required className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
              {sites.map(s => <option key={s.id} value={s.id}>{s.brand} - {s.name}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Inquiry Details</label>
            <textarea name="message" placeholder="e.g. Interested in PRP therapy..." required className="w-full p-2.5 border border-slate-200 rounded-lg text-sm h-20 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            Create & Save Lead
          </button>
        </form>
      </div>
    </div>
  );
}
