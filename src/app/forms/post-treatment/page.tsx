"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Webcam from "react-webcam";
import { 
  ClipboardCheck, Camera, Send, Loader2, 
  Activity, RefreshCw, FlaskConical, AlertCircle, Map 
} from "lucide-react";

function PostTreatmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  
  const [clientId] = useState(searchParams.get("clientId") || "");
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState(1); // 1: Product Log, 2: After Photo & Notes

  const capturePhoto = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) setPhoto(imageSrc);
  };

  const handleFinalise = async () => {
    if (!photo) return alert("Clinical requirement: Capture 'After' photo.");
    setIsSaving(true);

    try {
      const res = await fetch("/api/episodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          stage: "TREATMENT",
          data: {
            status: "TREATED",
            // You would pull these from your form inputs
            batchNumber: "BN-9921", 
            volumeUsed: "1.5ml",
            photoAfter: photo,
            aftercareSent: true
          }
        }),
      });

      if (res.ok) {
        alert("✅ Treatment Episode Closed. Aftercare package dispatched.");
        router.push(`/admin/clients/${clientId}`);
      }
    } catch (err) {
      alert("Error sealing record.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Stepper */}
        <div className="flex gap-4 mb-10">
          <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
          <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
        </div>

        <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          
          {/* STEP 1: PRODUCT & COMPLIANCE */}
          {step === 1 && (
            <div className="p-12 space-y-10 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black uppercase tracking-tighter italic">1. Product Traceability</h1>
                <FlaskConical className="text-blue-600 w-8 h-8" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Brand & Product</label>
                    <input className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-600" placeholder="e.g. Juvederm Volux" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Batch Number (Critical)</label>
                    <input className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-600" placeholder="Look for B/N on vial" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Volume / Units used</label>
                    <input className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-600" placeholder="e.g. 50 Units / 2ml" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Injection Depth / Method</label>
                    <input className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-600" placeholder="e.g. Supraperiosteal / 25g Cannula" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-900 rounded-[2rem] flex items-center gap-4 text-white">
                 <Map className="text-blue-500 w-6 h-6" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Procedural mapping confirmed via clinical chart</span>
              </div>

              <button onClick={() => setStep(2)} className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 shadow-xl transition-all">
                Next: Post-Op Evidence →
              </button>
            </div>
          )}

          {/* STEP 2: AFTER PHOTO & AUTOMATION */}
          {step === 2 && (
            <div className="p-12 space-y-10 animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black uppercase tracking-tighter italic">2. Treatment Record</h1>
                <Camera className="text-blue-600 w-8 h-8" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Clinical "After" Capture</h3>
                  <div className="aspect-square bg-slate-900 rounded-[2.5rem] border-4 border-slate-100 relative overflow-hidden shadow-2xl">
                    {photo ? (
                      <>
                        <img src={photo} className="w-full h-full object-cover" />
                        <button onClick={() => setPhoto(null)} className="absolute top-4 right-4 bg-red-600 text-white p-2 px-4 rounded-full text-[10px] font-black uppercase flex items-center gap-2">
                           <RefreshCw className="w-3 h-3" /> Retake
                        </button>
                      </>
                    ) : (
                      <>
                        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={{ facingMode: "environment" }} className="w-full h-full object-cover" />
                        <button onClick={capturePhoto} className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white w-14 h-14 rounded-full border-4 border-blue-600 flex items-center justify-center shadow-2xl active:scale-90 transition-all">
                           <div className="w-10 h-10 bg-slate-900 rounded-full border-2 border-white" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Clinical Procedure Notes</label>
                    <textarea rows={6} className="w-full bg-slate-50 p-6 rounded-[2rem] font-bold border-none outline-none resize-none focus:ring-2 focus:ring-blue-600" placeholder="Any adverse events? Patient feedback?"></textarea>
                  </div>
                  
                  <div className="bg-slate-900 p-8 rounded-[2rem] text-white flex items-center justify-between">
                     <div className="space-y-1">
                        <h4 className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Aftercare Dispatch</h4>
                        <p className="text-[9px] font-bold text-slate-500 uppercase">Auto-trigger on seal</p>
                     </div>
                     <Send className="text-blue-600 w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 bg-slate-100 text-slate-600 py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200">Back</button>
                <button 
                  onClick={handleFinalise}
                  disabled={isSaving || !photo}
                  className={`flex-[2] py-8 rounded-[2.5rem] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4 shadow-2xl ${
                    !photo ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-slate-900'
                  }`}
                >
                  {isSaving ? <Loader2 className="animate-spin" /> : <ClipboardCheck />}
                  {isSaving ? "Locking Record..." : "Seal Record & Close Episode"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PostTreatmentPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-black uppercase text-slate-400 tracking-widest italic">Synchronising Treatment Record...</div>}>
      <PostTreatmentContent />
    </Suspense>
  );
}