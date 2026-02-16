"use client";

import { FormRenderer } from "@/components/forms/FormRenderer";
import { TreatmentJourney } from "@/lib/forms/definitions/treatment-journey";
import { UnifiedIntake } from "@/lib/forms/definitions/unified-intake";
import { submitFormAction } from "@/lib/actions/forms";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FormTestPage() {
  const [activeForm, setActiveForm] = useState<"intake" | "treatment">("treatment");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleFormSubmit = async (data: any) => {
    setIsSaving(true);
    const result = await submitFormAction(activeForm === "treatment" ? "treatment_journey" : "unified_intake", data);
    setIsSaving(false);

    if (result.success) {
      alert("Success! Record saved to database and audit-logged.");
      router.push("/admin/submissions"); // Take user to the list
    } else {
      alert("Error saving form. Check terminal.");
    }
  };

  return (
    <div className={`min-h-screen bg-slate-100 py-12 px-4 ${isSaving ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-10 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 w-fit mx-auto">
          <button onClick={() => setActiveForm("treatment")} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeForm === "treatment" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"}`}>Treatment Record</button>
          <button onClick={() => setActiveForm("intake")} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeForm === "intake" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"}`}>Client Intake</button>
        </div>

        <FormRenderer 
          definition={activeForm === "treatment" ? TreatmentJourney : UnifiedIntake} 
          onSubmit={handleFormSubmit} 
        />
        
        {isSaving && <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-[100] font-bold text-blue-600">Saving Secure Record...</div>}
      </div>
    </div>
  );
}
