import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth-helpers";
import { notFound } from "next/navigation";
import { formatDateTime, formatBrand } from "@/lib/utils";
import { ShieldCheck, Lock, User, MapPin, Calendar, FileCheck, Download } from "lucide-react";
import { lockSubmissionAction } from "@/lib/actions/forms";
import Image from "next/image";

export default async function SubmissionReviewPage({ params }: { params: Promise<{ id: string }> }) {
  await requireSession();
  const { id } = await params;

  const submission = await prisma.formSubmission.findUnique({
    where: { id },
    include: { 
      site: true, 
      practitioner: true, 
      client: true 
    }
  });

  if (!submission) notFound();

  // Fetch photos associated with this record
  const photos = await prisma.fileUpload.findMany({
    where: { submissionId: id }
  });

  const data = submission.data as Record<string, any>;

  // Server Action handler for the lock button
  async function handleLock() {
    'use server';
    await lockSubmissionAction(id);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 p-4">
      {/* 1. Status Banner with Lock and PDF Export */}
      <div className={`p-6 rounded-[2rem] border flex justify-between items-center shadow-sm ${
        submission.isLocked ? "bg-slate-900 border-slate-800 text-white" : "bg-blue-50 border-blue-100 text-blue-900"
      }`}>
        <div className="flex items-center gap-4">
          {submission.isLocked ? <Lock className="w-6 h-6 text-blue-400" /> : <ShieldCheck className="w-6 h-6 text-blue-600" />}
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest">
              {submission.isLocked ? "Finalized Clinical Record" : "Draft Record Review"}
            </h2>
            <p className="text-[10px] opacity-70 font-bold uppercase tracking-tighter">System ID: {submission.id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {submission.isLocked && (
            <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          )}

          {!submission.isLocked && (
            <form action={handleLock}>
              <button type="submit" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
                Lock Record
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Record Metadata Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{submission.practitioner?.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{submission.site.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-600 font-mono italic">
                  {formatDateTime(submission.submittedAt || submission.createdAt)}
                </span>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-50">
              <span className="bg-slate-100 px-3 py-1 rounded-full text-[9px] font-black uppercase text-slate-500 tracking-tighter">
                Brand: {formatBrand(submission.brand)}
              </span>
            </div>
          </div>

          {/* 3. Clinical Photos Grid */}
          {photos.length > 0 && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Media</h3>
                <div className="grid grid-cols-1 gap-4">
                  {photos.map(photo => (
                    <div key={photo.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50">
                      <img 
                        src={photo.storagePath} 
                        alt={photo.fieldName} 
                        className="object-cover w-full h-full transition-transform group-hover:scale-110 duration-500"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 p-3 backdrop-blur-sm">
                        <p className="text-[8px] font-black text-white uppercase tracking-[0.2em]">
                          {photo.fieldName.replace(/_/g, ' ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          )}
        </div>

        {/* 4. Submission Data Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-10">
              <FileCheck className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                {submission.formType.replace(/_/g, ' ')}
              </h1>
            </div>

            <div className="grid grid-cols-1 gap-x-12 gap-y-8">
              {Object.entries(data).map(([key, value]) => {
                if (key === 'signature' || typeof value === 'object') return null;
                return (
                  <div key={key} className="space-y-1.5 pb-4 border-b border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm font-bold text-slate-900 tracking-tight">{String(value)}</p>
                  </div>
                );
              })}
            </div>

            {/* 5. Patient Verification Signature */}
            {submission.signatureData && (
              <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col items-center justify-center">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 underline decoration-blue-600 decoration-2 underline-offset-8">
                  Patient Verified Signature
                </div>
                <img src={submission.signatureData} alt="Client Signature" className="max-w-[240px] grayscale contrast-125 hover:grayscale-0 transition-all duration-500" />
                <p className="mt-6 text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">
                  Signed on {formatDateTime(submission.submittedAt || submission.createdAt)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
