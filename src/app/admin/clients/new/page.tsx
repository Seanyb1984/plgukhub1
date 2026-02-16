import { requireSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function NewClientPage() {
  await requireSession();
  const sites = await prisma.site.findMany();

  async function createClient(formData: FormData) {
    "use server";
    
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const siteId = formData.get("siteId") as string;

    const client = await prisma.client.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        siteId,
        brand: 'PLG_UK',
        clientId: `PLG-${Math.floor(1000 + Math.random() * 9000)}`
      }
    });

    redirect(`/admin/clients/${client.id}`);
  }

  return (
    <div className="max-w-xl mx-auto py-20 px-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">New Patient Record</h1>
        <p className="text-slate-400 font-bold mt-2">Create a new file in the clinical database.</p>
      </div>

      <form action={createClient} className="space-y-6 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">First Name</label>
            <input name="firstName" placeholder="e.g. John" required className="bg-slate-50 p-4 rounded-xl font-bold border-none w-full focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Last Name</label>
            <input name="lastName" placeholder="e.g. Smith" required className="bg-slate-50 p-4 rounded-xl font-bold border-none w-full focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
          <input name="email" type="email" placeholder="patient@example.com" required className="bg-slate-50 p-4 rounded-xl font-bold border-none w-full focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Phone Number</label>
          <input name="phone" placeholder="07123 456789" required className="bg-slate-50 p-4 rounded-xl font-bold border-none w-full focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Clinic Site</label>
          <select name="siteId" className="bg-slate-50 p-4 rounded-xl font-bold border-none w-full appearance-none outline-none focus:ring-2 focus:ring-blue-500">
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-[0.98]">
          Create Record
        </button>
      </form>
    </div>
  );
}
