import Link from 'next/link';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold text-white">
            PLG UK Hub
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/treatment-journey"
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors font-medium"
            >
              Treatment Journey
            </Link>
            <Link
              href="/command-centre"
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors font-medium"
            >
              Command Centre
            </Link>
            <Link
              href="/login"
              className="px-6 py-2.5 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-500/20 rounded-full text-teal-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
            CQC-Compliant Clinical Management
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Multi-Brand Clinical
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
              Management Hub
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Unified treatment journeys for Menhancements, Wax for Men, and Wax for Women.
            Phased clinical workflows with POM triage, digital consent, and automated aftercare.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/treatment-journey"
              className="px-8 py-4 bg-teal-600 text-white rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors"
            >
              Start Treatment Journey
            </Link>
            <Link
              href="/command-centre"
              className="px-8 py-4 bg-white/10 text-white rounded-lg font-semibold text-lg hover:bg-white/20 transition-colors border border-white/20"
            >
              Command Centre
            </Link>
          </div>

          {/* Brand Cards */}
          <div className="grid md:grid-cols-3 gap-6 text-left mb-12">
            <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#1a1a2e]/40 backdrop-blur-sm rounded-xl p-6 border border-[#c9a84c]/30">
              <div className="w-12 h-12 bg-[#c9a84c]/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-[#c9a84c] text-xl font-bold">M</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Menhancements</h3>
              <p className="text-slate-400 text-sm mb-3">
                Premium Medical Aesthetics. Full POM triage with prescriber verification,
                facial mapping, and CQC-compliant consent flows.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-[#c9a84c]/20 text-[#c9a84c] px-2 py-1 rounded">Botox</span>
                <span className="text-xs bg-[#c9a84c]/20 text-[#c9a84c] px-2 py-1 rounded">Fillers</span>
                <span className="text-xs bg-[#c9a84c]/20 text-[#c9a84c] px-2 py-1 rounded">PRP</span>
                <span className="text-xs bg-[#c9a84c]/20 text-[#c9a84c] px-2 py-1 rounded">POM</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#2b4162]/80 to-[#2b4162]/40 backdrop-blur-sm rounded-xl p-6 border border-[#4a90d9]/30">
              <div className="w-12 h-12 bg-[#4a90d9]/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-[#4a90d9] text-xl font-bold">WM</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Wax for Men</h3>
              <p className="text-slate-400 text-sm mb-3">
                Professional male grooming. Streamlined consent, skin sensitivity screening,
                and efficient batch tracking.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-[#4a90d9]/20 text-[#4a90d9] px-2 py-1 rounded">Back & Chest</span>
                <span className="text-xs bg-[#4a90d9]/20 text-[#4a90d9] px-2 py-1 rounded">Full Body</span>
                <span className="text-xs bg-[#4a90d9]/20 text-[#4a90d9] px-2 py-1 rounded">Facial</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#7c3a5e]/80 to-[#7c3a5e]/40 backdrop-blur-sm rounded-xl p-6 border border-[#d4758b]/30">
              <div className="w-12 h-12 bg-[#d4758b]/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-[#d4758b] text-xl font-bold">WW</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Wax for Women</h3>
              <p className="text-slate-400 text-sm mb-3">
                Professional beauty & waxing. Clean workflows with patch test tracking,
                consent management, and aftercare automation.
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs bg-[#d4758b]/20 text-[#d4758b] px-2 py-1 rounded">Brazilian</span>
                <span className="text-xs bg-[#d4758b]/20 text-[#d4758b] px-2 py-1 rounded">Legs</span>
                <span className="text-xs bg-[#d4758b]/20 text-[#d4758b] px-2 py-1 rounded">Facial</span>
              </div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-4 gap-4 text-left">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <h4 className="text-sm font-semibold text-white mb-1">4-Phase Stepper</h4>
              <p className="text-xs text-slate-400">Identification, POM Triage, Consent, Clinical Record, Close-out</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <h4 className="text-sm font-semibold text-white mb-1">Stop-Logic</h4>
              <p className="text-xs text-slate-400">CQC safety screening with hard stops for blood disorders & allergies</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <h4 className="text-sm font-semibold text-white mb-1">Facial Mapping</h4>
              <p className="text-xs text-slate-400">Canvas-based injection point tracking with longitudinal coordinates</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <h4 className="text-sm font-semibold text-white mb-1">Google Workspace</h4>
              <p className="text-xs text-slate-400">Drive storage, Sheets protocols, Gmail aftercare automation</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-sm">
          <div>
            &copy; {new Date().getFullYear()} PLG UK. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
