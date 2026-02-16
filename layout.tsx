import { GlobalAlert } from "@/components/layout/GlobalAlert";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen bg-slate-50">
      {/* This blocks the screen if there is a critical MHRA/CQC alert */}
      <GlobalAlert /> 
      
      <div className="flex flex-col">
        {children}
      </div>
    </section>
  );
}