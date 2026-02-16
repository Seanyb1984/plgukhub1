import { formRegistry } from "@/lib/forms/registry";
import { requireSession } from "@/lib/auth-helpers";
import { formatBrand } from "@/lib/utils";
import { FilePlus, Search, ChevronRight, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function NewFormSelectorPage() {
  const session = await requireSession();
  const userBrand = session.user.brand;

  // Get forms allowed for this user's brand or 'ALL'
  const availableForms = formRegistry.getByBrand(userBrand);
  const categories = Array.from(new Set(availableForms.map(f => f.category || "General")));

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">New Clinical Record</h1>
          <p className="text-slate-500 font-medium">Select a form to begin for {formatBrand(userBrand)}</p>
        </div>
        <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
          <div className="px-4 py-2 text-xs font-black uppercase text-slate-400">Search Forms</div>
          <div className="bg-white px-3 py-2 rounded-lg shadow-sm flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input type="text" placeholder="Start typing..." className="text-xs font-bold outline-none w-40" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {categories.sort().map(category => (
          <section key={category} className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 whitespace-nowrap">{category}</h2>
              <div className="h-[1px] w-full bg-slate-200" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableForms
                .filter(f => (f.category || "General") === category)
                .map(form => (
                  <Link 
                    key={form.id} 
                    href={`/forms/fill/${form.id}`}
                    className="group bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-slate-50 p-3 rounded-2xl group-hover:bg-blue-50 transition-colors">
                          <FilePlus className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
                        </div>
                        {form.hasStopLogic && (
                          <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-lg text-[8px] font-black uppercase flex items-center gap-1">
                            <ShieldAlert className="w-2 h-2" /> Risk Control
                          </span>
                        )}
                      </div>
                      <h3 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{form.name || form.title}</h3>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">{form.description || "Standard clinical documentation form."}</p>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>v{form.version}</span>
                      <div className="flex items-center gap-1 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Start Form <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
