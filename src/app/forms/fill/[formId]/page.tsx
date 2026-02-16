"use client";

import { use } from "react";
import { formRegistry } from "@/lib/forms/registry";
import { FormRenderer } from "@/components/forms/FormRenderer";
import { submitFormAction } from "@/lib/actions/forms";
import { useRouter, notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FillFormPage({ params }: { params: Promise<{ formId: string }> }) {
  const resolvedParams = use(params);
  const form = formRegistry.get(resolvedParams.formId);
  const router = useRouter();

  if (!form) return notFound();

  const handleFormSubmit = async (data: any) => {
    const result = await submitFormAction(form.id, data);
    if (result.success) {
      router.push("/admin/submissions");
    } else {
      alert("Error saving clinical record. Please contact IT.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/forms/new" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 text-xs font-black uppercase tracking-widest mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Cancel & Return
        </Link>
        
        <div className="mb-10 text-center">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]"> Branded Digital Record </span>
            <h1 className="text-4xl font-black text-slate-900 mt-2 uppercase tracking-tighter">{form.name || form.title}</h1>
            <p className="text-slate-500 mt-2 font-medium">{form.description}</p>
        </div>

        <FormRenderer definition={form} onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
}
