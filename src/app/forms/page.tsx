import { getAllForms } from "@/lib/forms/registry";
import { ClipboardList, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { requireSession } from "@/lib/auth-helpers";

export default async function FormsListPage() {
  const session = await requireSession();
  
  // 1. Get all forms and sort them by priority
  const forms = getAllForms().sort((a, b) => {
    const priorityA = (a as any).priority || 0;
    const priorityB = (b as any).priority || 0;
    return priorityB - priorityA; // Higher numbers go to the top
  }); 

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">
              Clinical <span className="text-blue-600">Forms</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">
              PLG UK Hub • {session.user.brand}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {forms.map((form) => {
            const isHighPriority = (form as any).priority > 0;
            return (
              <Link 
                key={form.id} 
                href={`/forms/${form.id}`}
                className={`group p-8 rounded-[2rem] border-2 transition-all shadow-sm hover:shadow-xl flex items-center justify-between ${
                  isHighPriority 
                    ? "bg-blue-50 border-blue-200 hover:border-blue-600" 
                    : "bg-white border-transparent hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                    isHighPriority ? "bg-blue-600" : "bg-slate-900 group-hover:bg-blue-600"
                  }`}>
                    <ClipboardList className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                        {form.title}
                      </h3>
                      {isHighPriority && <Star className="w-4 h-4 text-blue-600 fill-blue-600" />}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {form.category || "General"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
