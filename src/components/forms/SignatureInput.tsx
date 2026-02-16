"use client";

import { useEffect, useRef } from "react";
import SignaturePad from "signature_pad";

export function SignatureInput({ onSave }: { onSave: (base64: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      signaturePadRef.current = new SignaturePad(canvasRef.current);
      
      // Make canvas responsive
      const resizeCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ratio = Math.max(window.devicePixelRatio || 1, 1);
          canvas.width = canvas.offsetWidth * ratio;
          canvas.height = canvas.offsetHeight * ratio;
          canvas.getContext("2d")?.scale(ratio, ratio);
          signaturePadRef.current?.clear();
        }
      };

      window.addEventListener("resize", resizeCanvas);
      resizeCanvas();
      return () => window.removeEventListener("resize", resizeCanvas);
    }
  }, []);

  const clear = () => signaturePadRef.current?.clear();
  const save = () => {
    if (signaturePadRef.current?.isEmpty()) {
      alert("Please provide a signature first.");
      return;
    }
    const dataUrl = signaturePadRef.current?.toDataURL();
    onSave(dataUrl || "");
    alert("Signature Captured!");
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 overflow-hidden shadow-inner">
        <canvas 
          ref={canvasRef} 
          className="w-full h-48 touch-none cursor-crosshair" 
        />
      </div>
      <div className="flex gap-4">
        <button 
          type="button" 
          onClick={clear} 
          className="flex-1 py-3 text-sm font-bold text-slate-500 bg-white border-2 border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
        >
          Clear Pad
        </button>
        <button 
          type="button" 
          onClick={save} 
          className="flex-1 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
        >
          Confirm Signature
        </button>
      </div>
    </div>
  );
}
