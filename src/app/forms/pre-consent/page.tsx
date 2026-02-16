"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SignatureCanvas from "react-signature-canvas";
import Webcam from "react-webcam";
import { 
  ShieldCheck, AlertTriangle, Camera, PenTool, 
  Loader2, ArrowLeft, Activity, CheckCircle2, RefreshCw 
} from "lucide-react";

const TREATMENT_DETAILS = {
  "LSWT": {
    name: "Linear Shockwave Therapy",
    risks: ["Temporary redness", "Mild discomfort", "No visible improvement risk"],
  },
  "PRP": {
    name: "Platelet Rich Plasma (PRP)",
    risks: ["Bruising", "Infection at site", "No visible improvement", "Pain during draw"],
  },
  "FILLER": {
    name: "Dermal Filler / Girth Enhancement",
    risks: ["Vascular compromise", "Nodules", "Asymmetry", "Migration", "Infection"],
  },
  "BOTOX": {
    name: "Anti-Wrinkle (Tox)",
    risks: ["Ptosis (drooping)", "Asymmetry", "Headache", "Localized swelling"],
  }
};

function PreConsentForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sigCanvas = useRef<SignatureCanvas>(null);
  const webcamRef = useRef<Webcam>(null);
  
  const [clientId] = useState(searchParams.get("clientId") || "");
  const [step, setStep] = useState(1); 
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Photo State
  const [photo, setPhoto] = useState<string | null>(null);

  const toggleTreatment = (id: string) => {
    setSelectedTreatments(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) setPhoto(imageSrc);
  };

  const handleFinalSubmit = async () => {
    if (!photo) return alert("Please capture a clinical 'Before' photo.");
    if (sigCanvas.current?.isEmpty()) return alert("Patient signature is required.");

    setIsSubmitting(true);
    const signature = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png");

    try {
      const response = await fetch("/api/episodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          stage: "CONSENT",
          data: {
            status: "CONSENTED",
            treatmentType: selectedTreatments.join(", "),
            medicalSnapshot: { /* Gathered from form inputs */ },
            photoBefore: photo,
            signatureData: signature,
            signedAt: new Date().toISOString(),
          }
        }),
      });

      if (response.ok) {
        alert("Clinical Episode Started Successfully.");
        router.push(`/admin/clients/${clientId}`);
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving record. Please check connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Progress Stepper */}
        <div className="flex gap-4 mb-10">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-all ${step >= i ? 'bg-blue-600' : 'bg-slate-200'}`} />
          ))}
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
          
          {/* SECTION 1: MEDICAL & LIFESTYLE */}
          {step === 1 && (
            <div className="p-12 space-y-10 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">1. Clinical Assessment</h2>
                <Activity className="text-blue-600 w-8 h-8" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Medical Screening</h3>
                  {["Blood thinning medication", "Diabetes / Cardiovascular history", "Autoimmune disease", "Active Infection", "Previous Surgery in Area"].map(q => (
                    <label key={q} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <span className="text-xs font-bold text-slate-700">{q}</span>
                      <input type="checkbox" className="w-6 h-6 rounded-lg accent-blue-600" />
                    </label>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Lifestyle Factors</h3>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Smoking / Alcohol Status</label>
                    <input className="w-full bg-slate-50 p-4 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Non-smoker, Social" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Dissatisfaction Reason</label>
                    <textarea className="w-full bg-slate-50 p-4 rounded-xl font-bold border-none outline-none h-24 resize-none focus:ring-2 focus:ring-blue-500" placeholder="Primary goal for today..."></textarea>
                  </div>
                </div>
              </div>

              <button onClick={() => setStep(2)} className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-[0.98]">
                Next: Treatment & Risks →
              </button>
            </div>
          )}

          {/* SECTION 2: TREATMENT & RISKS */}
          {step === 2 && (
            <div className="p-12 space-y-10 animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">2. Risk Disclosure</h2>
                <ShieldCheck className="text-blue-600 w-8 h-8" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.keys(TREATMENT_DETAILS).map(t => (
                  <button key={t} onClick={() => toggleTreatment(t)} className={`p-4 rounded-2xl text-[10px] font-black uppercase border-2 transition-all ${selectedTreatments.includes(t) ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
                    {t}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {selectedTreatments.length === 0 && <p className="text-center py-10 text-slate-400 font-bold uppercase text-xs">Select a treatment to view specific risks</p>}
                {selectedTreatments.map(t => {
                  const detail = (TREATMENT_DETAILS as any)[t];
                  return (
                    <div key={t} className="bg-amber-50 border-2 border-amber-100 p-6 rounded-[2rem] space-y-4">
                      <div className="flex items-center gap-2 text-amber-700 font-black uppercase text-[10px]">
                        <AlertTriangle className="w-4 h-4" /> Specific Risks: {detail.name}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {detail.risks.map((risk: string) => (
                          <label key={risk} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-amber-100 cursor-pointer shadow-sm">
                            <input type="checkbox" required className="w-5 h-5 accent-amber-600" />
                            <span className="text-[10px] font-bold text-amber-900 uppercase">{risk}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 text-slate-600 py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200">Back</button>
                <button onClick={() => setStep(3)} className="flex-[2] bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600">Next: Finalize Consent →</button>
              </div>
            </div>
          )}

          {/* SECTION 3: PHOTO & SIGNATURE */}
          {step === 3 && (
            <div className="p-12 space-y-10 animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-center text-slate-900">
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">3. Final Authorization</h2>
                <PenTool className="text-blue-600 w-8 h-8" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Fixed Camera Section */}
                <div className="space-y-4">
                   <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Clinical Record (Before)</h3>
                   <div className="aspect-video bg-slate-900 rounded-[2.5rem] border-4 border-slate-100 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                      {photo ? (
                        <>
                          <img src={photo} className="w-full h-full object-cover" />
                          <button onClick={() => setPhoto(null)} className="absolute top-4 right-4 bg-red-600 text-white p-2 px-4 rounded-full text-[10px] font-black uppercase flex items-center gap-2">
                             <RefreshCw className="w-3 h-3" /> Retake
                          </button>
                        </>
                      ) : (
                        <>
                          <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ facingMode: "environment" }}
                            className="w-full h-full object-cover"
                          />
                          <button onClick={capturePhoto} className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white w-14 h-14 rounded-full border-4 border-blue-600 flex items-center justify-center shadow-2xl active:scale-90 transition-all">
                             <div className="w-10 h-10 bg-slate-900 rounded-full border-2 border-white" />
                          </button>
                        </>
                      )}
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Patient Signature</h3>
                   <div className="bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 overflow-hidden relative">
                      <SignatureCanvas 
                        ref={sigCanvas}
                        penColor="black"
                        canvasProps={{ className: "w-full h-48 cursor-crosshair" }}
                      />
                      <button onClick={() => sigCanvas.current?.clear()} className="absolute bottom-4 right-4 text-[10px] font-black uppercase text-slate-400 hover:text-red-500">Clear Pad</button>
                   </div>
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input type="checkbox" required className="w-6 h-6 mt-1 rounded-lg accent-blue-600" />
                  <span className="text-[11px] font-bold text-slate-300 leading-relaxed uppercase tracking-tight">
                    I confirm that I have fully disclosed my medical history, understand the risks associated with my treatment, 
                    and voluntarily consent to proceed. I acknowledge that results vary and no guarantee is implied.
                  </span>
                </label>
              </div>

              <button 
                onClick={handleFinalSubmit}
                disabled={isSubmitting || !photo} 
                className={`w-full py-8 rounded-[2rem] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4 shadow-2xl ${
                  !photo ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-slate-900'
                }`}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                {isSubmitting ? "Locking Record..." : photo ? "Confirm & Start Episode" : "Capture Photo to Enable"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function MasterConsentPage() {
  return <Suspense fallback={<div className="p-20 text-center font-black uppercase text-slate-400 tracking-widest">Initializing Clinical Environment...</div>}>
    <PreConsentForm />
  </Suspense>;
}