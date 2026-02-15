import Link from 'next/link';

export const metadata = {
  title: 'Treatments - Wax for Men - Male Waxing Services',
  description: 'Professional male waxing services. Private rooms, specialist therapists, and premium wax blends. Intimate waxing, body waxing, facials and massage.',
};

export default function WaxForMenLanding() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-amber-400 selection:text-black">

      {/* ============================================ */}
      {/* NAVIGATION — Minimal brutalist bar */}
      {/* ============================================ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/90 backdrop-blur-sm border-b border-neutral-800">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 rotate-3 flex items-center justify-center">
              <span className="text-black font-black text-sm -rotate-3">W</span>
            </div>
            <span className="text-lg font-bold tracking-[0.2em] uppercase">Wax for Men</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-medium tracking-wider uppercase text-neutral-400">
            <a href="#services" className="hover:text-amber-400 transition-colors">Services</a>
            <a href="#process" className="hover:text-amber-400 transition-colors">Process</a>
            <a href="#pricing" className="hover:text-amber-400 transition-colors">Pricing</a>
            <Link
              href="/wax-for-men/unlimiwax"
              className="text-amber-400 hover:text-amber-300 transition-colors"
            >
              UnlimiWax
            </Link>
          </div>
          <Link
            href="/login"
            className="px-6 py-2.5 bg-amber-400 text-black font-bold text-sm tracking-wider uppercase hover:bg-amber-300 transition-colors"
          >
            Book Now
          </Link>
        </div>
      </nav>

      {/* ============================================ */}
      {/* HERO — Full-bleed, asymmetric editorial */}
      {/* ============================================ */}
      <section className="relative min-h-screen flex items-end pt-20">
        {/* Background geometric blocks */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[60%] h-full bg-neutral-900" />
          <div className="absolute bottom-0 left-[15%] w-[45%] h-[70%] bg-neutral-900/50 -skew-x-3" />
          {/* Texture overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-[1800px] mx-auto px-6 md:px-12 pb-16 md:pb-24">
          <div className="grid grid-cols-12 gap-4 items-end">
            {/* Left column — Title block */}
            <div className="col-span-12 lg:col-span-7 mb-8 lg:mb-0">
              <div className="mb-6">
                <span className="inline-block px-4 py-1.5 border border-amber-400/40 text-amber-400 text-xs font-bold tracking-[0.3em] uppercase">
                  Professional Male Grooming
                </span>
              </div>

              <h1 className="text-[clamp(3rem,8vw,9rem)] font-black leading-[0.85] tracking-tighter uppercase">
                <span className="block text-white">Sharp</span>
                <span className="block text-white">Clean</span>
                <span className="block text-amber-400 -ml-1">Defined</span>
              </h1>

              <div className="mt-8 max-w-lg">
                <p className="text-lg md:text-xl text-neutral-400 leading-relaxed font-light">
                  Expert male waxing by specialists who understand male skin and hair growth.
                  No awkwardness. No compromises. Just results.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-amber-400 text-black font-bold text-sm tracking-wider uppercase hover:bg-amber-300 transition-all"
                >
                  Book Appointment
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/wax-for-men/unlimiwax"
                  className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white/20 text-white font-bold text-sm tracking-wider uppercase hover:border-amber-400 hover:text-amber-400 transition-all"
                >
                  Unlimited Waxing &rarr;
                </Link>
              </div>
            </div>

            {/* Right column — Stats strip */}
            <div className="col-span-12 lg:col-span-5">
              <div className="bg-neutral-900 border border-neutral-800 p-8 lg:p-10">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-4xl md:text-5xl font-black text-amber-400">15K+</div>
                    <div className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-500 mt-2">Treatments Completed</div>
                  </div>
                  <div>
                    <div className="text-4xl md:text-5xl font-black text-white">4.9</div>
                    <div className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-500 mt-2">Client Rating</div>
                  </div>
                  <div>
                    <div className="text-4xl md:text-5xl font-black text-white">8+</div>
                    <div className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-500 mt-2">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-4xl md:text-5xl font-black text-amber-400">100%</div>
                    <div className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-500 mt-2">Male Specialists</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
      </section>

      {/* ============================================ */}
      {/* EDITORIAL DIVIDER — Magazine pull quote */}
      {/* ============================================ */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute left-0 top-0 w-1 h-full bg-amber-400" />
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-2 flex items-start">
              <span className="text-[8rem] md:text-[12rem] font-black text-neutral-900 leading-none select-none">&ldquo;</span>
            </div>
            <div className="col-span-12 md:col-span-8">
              <blockquote className="text-2xl md:text-4xl lg:text-5xl font-light leading-snug text-neutral-300 italic">
                Male grooming isn&apos;t vanity.
                <span className="text-white font-medium not-italic"> It&apos;s precision.</span>{' '}
                It&apos;s the discipline of presenting your best self to the world.
              </blockquote>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-px bg-amber-400" />
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-500">The Wax for Men Philosophy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SERVICES — The Menu */}
      {/* ============================================ */}
      <section id="services" className="relative py-24 md:py-32">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          {/* Section header */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-px bg-amber-400" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-amber-400">Treatments</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              The Menu
            </h2>
            <p className="text-neutral-400 text-lg mt-6 max-w-2xl">
              Precision grooming for men. Private rooms, specialist therapists, and premium wax blends that reduce discomfort.
            </p>
          </div>

          {/* Service cards — 3-column grid with images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Intimate Waxing */}
            <div className="group relative bg-neutral-900 border border-neutral-800 overflow-hidden hover:border-amber-400/30 transition-colors">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="https://www.waxformen.co.uk/wp-content/uploads/2025/11/intimate.png"
                  alt="Male Intimate Waxing Studio"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Intimate Waxing</h3>
                <p className="text-neutral-400 leading-relaxed mb-6">
                  Our signature service. Performed by male specialists who do thousands of these treatments a year. Discreet, professional, and hygiene-focused.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-amber-400 text-amber-400 text-sm font-bold tracking-wider uppercase hover:bg-amber-400 hover:text-black transition-all"
                >
                  Book Intimate Wax
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Back, Chest & Abs */}
            <div className="group relative bg-neutral-900 border border-neutral-800 overflow-hidden hover:border-amber-400/30 transition-colors">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="https://www.waxformen.co.uk/wp-content/uploads/2025/11/back.png"
                  alt="Male Back Waxing"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Back, Chest & Abs</h3>
                <p className="text-neutral-400 leading-relaxed mb-6">
                  Achieve a defined physique or simply feel cleaner. Waxing lasts weeks longer than shaving and avoids the itch of blunt stubble regrowth.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-amber-400 text-amber-400 text-sm font-bold tracking-wider uppercase hover:bg-amber-400 hover:text-black transition-all"
                >
                  Book Body Wax
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Legs & Arms */}
            <div className="group relative bg-neutral-900 border border-neutral-800 overflow-hidden hover:border-amber-400/30 transition-colors">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="https://www.waxformen.co.uk/wp-content/uploads/2025/11/arms-and-legs-1.png"
                  alt="Male Leg Waxing"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Legs & Arms</h3>
                <p className="text-neutral-400 leading-relaxed mb-6">
                  Popular with cyclists, swimmers, and bodybuilders. We can remove everything for muscle definition or thin out density.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-amber-400 text-amber-400 text-sm font-bold tracking-wider uppercase hover:bg-amber-400 hover:text-black transition-all"
                >
                  Book Sports Wax
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Face & Detail */}
            <div className="group relative bg-neutral-900 border border-neutral-800 overflow-hidden hover:border-amber-400/30 transition-colors">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="https://www.waxformen.co.uk/wp-content/uploads/2025/11/beard-after.png"
                  alt="Male Grooming Face"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Face & Detail</h3>
                <p className="text-neutral-400 leading-relaxed mb-6">
                  Small details make the biggest difference. Sharp brows and clean ears instantly refresh your appearance.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-amber-400 text-amber-400 text-sm font-bold tracking-wider uppercase hover:bg-amber-400 hover:text-black transition-all"
                >
                  Book Face Wax
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Body Clippering */}
            <div className="group relative bg-neutral-900 border border-neutral-800 overflow-hidden hover:border-amber-400/30 transition-colors">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="https://www.waxformen.co.uk/wp-content/uploads/2025/11/banana-edit-1763779858589.png"
                  alt="Body Clippering"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Body Clippering</h3>
                <p className="text-neutral-400 leading-relaxed mb-6">
                  Not ready to wax? We offer professional body clippering to shorten and tidy hair without full removal. Ideal for a natural, groomed look.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-amber-400 text-amber-400 text-sm font-bold tracking-wider uppercase hover:bg-amber-400 hover:text-black transition-all"
                >
                  Book Clippering
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Facials & Massage */}
            <div className="group relative bg-neutral-900 border border-neutral-800 overflow-hidden hover:border-amber-400/30 transition-colors">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="https://www.waxformen.co.uk/wp-content/uploads/2025/11/facials2-1.png"
                  alt="Male Facials"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Facials & Massage</h3>
                <p className="text-neutral-400 leading-relaxed mb-6">
                  Skin health and muscle recovery. Our facials are designed for male skin (thicker, more oil production), and our massages target deep tension.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-amber-400 text-amber-400 text-sm font-bold tracking-wider uppercase hover:bg-amber-400 hover:text-black transition-all"
                >
                  Book Treatment
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PROCESS — Brutalist numbered steps */}
      {/* ============================================ */}
      <section id="process" className="relative py-24 md:py-32 bg-neutral-900/50">
        <div className="absolute top-0 left-0 right-0 h-px bg-neutral-800" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-800" />

        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-8 md:gap-12">
            {/* Left — Section title */}
            <div className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-px bg-amber-400" />
                  <span className="text-xs font-bold tracking-[0.3em] uppercase text-amber-400">The Process</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none mb-6">
                  How It<br />
                  <span className="text-neutral-600">Works</span>
                </h2>
                <p className="text-neutral-400 text-lg leading-relaxed">
                  Every visit follows our structured protocol to ensure
                  consistency, safety, and the best possible results.
                </p>
              </div>
            </div>

            {/* Right — Steps */}
            <div className="col-span-12 lg:col-span-8">
              <div className="space-y-0">
                {[
                  {
                    num: '01',
                    title: 'Consultation',
                    desc: 'We review your medical history, previous waxing experience, and any skin sensitivities. First-timers get a thorough walkthrough of what to expect.',
                  },
                  {
                    num: '02',
                    title: 'Contraindications Check',
                    desc: 'A quick screening ensures your skin is ready for treatment. We check for sunburn, medications, recent procedures, and any conditions that could affect results.',
                  },
                  {
                    num: '03',
                    title: 'Preparation',
                    desc: 'The treatment area is cleaned and prepped with pre-wax oil. We select the right wax system for your skin and hair type — hot wax, strip wax, or combination.',
                  },
                  {
                    num: '04',
                    title: 'Treatment',
                    desc: 'Precise, efficient waxing with expert technique. We work methodically to minimise discomfort and maximise clean results.',
                  },
                  {
                    num: '05',
                    title: 'Aftercare',
                    desc: 'Post-treatment products are applied and you receive detailed aftercare instructions covering the first 48 hours and ongoing maintenance.',
                  },
                ].map((step) => (
                  <div
                    key={step.num}
                    className="group border-b border-neutral-800 py-10 md:py-12 flex gap-6 md:gap-10 items-start hover:border-amber-400/30 transition-colors"
                  >
                    <div className="flex-shrink-0 text-5xl md:text-6xl font-black text-neutral-800 group-hover:text-amber-400 transition-colors leading-none">
                      {step.num}
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-3 group-hover:text-amber-400 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-neutral-400 leading-relaxed max-w-xl">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PRICING — Stark grid with brutalist accents */}
      {/* ============================================ */}
      <section id="pricing" className="relative py-24 md:py-32">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-px bg-amber-400" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-amber-400">Pricing</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                Transparent<br />
                <span className="text-neutral-600">Pricing</span>
              </h2>
              <p className="text-neutral-400 text-lg max-w-md">
                No hidden costs. No membership required. Pay per session or go unlimited with UnlimiWax.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-800">
            {[
              { service: 'Full Back', price: '25', duration: '30 min' },
              { service: 'Chest', price: '25', duration: '25 min' },
              { service: 'Shoulders', price: '15', duration: '15 min' },
              { service: 'Stomach', price: '15', duration: '15 min' },
              { service: 'Full Legs', price: '35', duration: '45 min' },
              { service: 'Half Legs', price: '22', duration: '25 min' },
              { service: 'Full Arms', price: '22', duration: '25 min' },
              { service: 'Underarms', price: '12', duration: '10 min' },
              { service: 'Eyebrows', price: '10', duration: '10 min' },
              { service: 'Intimate Standard', price: '35', duration: '30 min' },
              { service: 'Intimate Full', price: '45', duration: '40 min' },
              { service: 'Full Body', price: '120', duration: '90 min', featured: true },
            ].map((item) => (
              <div
                key={item.service}
                className={`bg-neutral-950 p-8 flex items-center justify-between group hover:bg-neutral-900 transition-colors ${
                  item.featured ? 'border-l-2 border-l-amber-400' : ''
                }`}
              >
                <div>
                  <h3 className={`text-lg font-bold uppercase tracking-tight ${item.featured ? 'text-amber-400' : 'text-white'}`}>
                    {item.service}
                  </h3>
                  <span className="text-xs text-neutral-500 tracking-wider">{item.duration}</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black">
                    <span className="text-sm font-bold text-neutral-500 mr-0.5">&pound;</span>
                    {item.price}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* UnlimiWax CTA strip */}
          <div className="mt-12 bg-amber-400 p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-black uppercase tracking-tight">
                Go Unlimited with UnlimiWax
              </h3>
              <p className="text-black/70 text-lg mt-2">
                One monthly fee. Unlimited waxing. No per-session costs.
              </p>
            </div>
            <Link
              href="/wax-for-men/unlimiwax"
              className="inline-flex items-center gap-3 px-8 py-4 bg-black text-amber-400 font-bold text-sm tracking-wider uppercase hover:bg-neutral-900 transition-colors flex-shrink-0"
            >
              Learn More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TRUST — Editorial strip with badges */}
      {/* ============================================ */}
      <section className="relative py-24 md:py-32 bg-neutral-900/50">
        <div className="absolute top-0 left-0 right-0 h-px bg-neutral-800" />
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-5">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-px bg-amber-400" />
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-amber-400">Why Trust Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
                Standards<br />
                <span className="text-neutral-600">Matter</span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Male Specialists Only',
                    desc: 'Every therapist is trained exclusively in male waxing, understanding the specific needs of male skin and hair growth patterns.',
                  },
                  {
                    title: 'Clinical Hygiene',
                    desc: 'Single-use applicators, medical-grade sanitation, and strict cross-contamination protocols on every treatment.',
                  },
                  {
                    title: 'Full Contraindication Screening',
                    desc: 'Digital pre-treatment checks cover medications, skin conditions, and medical history before every session.',
                  },
                  {
                    title: 'GDPR Compliant Records',
                    desc: 'All client data stored securely with full audit trails, electronic signatures, and data retention policies.',
                  },
                ].map((item) => (
                  <div key={item.title} className="border border-neutral-800 p-6 hover:border-amber-400/30 transition-colors">
                    <h3 className="text-lg font-bold uppercase tracking-tight mb-3">{item.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA — Full-width brutalist block */}
      {/* ============================================ */}
      <section className="relative py-32 md:py-40">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-[10%] w-[40%] h-full bg-amber-400/[0.03] skew-x-6" />
          <div className="absolute bottom-0 right-[5%] w-[30%] h-[60%] bg-amber-400/[0.02] -skew-x-12" />
        </div>

        <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12 text-center">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-none mb-8">
            Ready to Get<br />
            <span className="text-amber-400">Started?</span>
          </h2>
          <p className="text-neutral-400 text-xl max-w-lg mx-auto mb-12">
            Book your first appointment or sign up for UnlimiWax unlimited membership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-10 py-5 bg-amber-400 text-black font-bold text-sm tracking-wider uppercase hover:bg-amber-300 transition-colors"
            >
              Book Appointment
            </Link>
            <Link
              href="/wax-for-men/unlimiwax"
              className="px-10 py-5 border-2 border-white/20 text-white font-bold text-sm tracking-wider uppercase hover:border-amber-400 hover:text-amber-400 transition-colors"
            >
              Explore UnlimiWax
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOTER — Minimal brutalist */}
      {/* ============================================ */}
      <footer className="border-t border-neutral-800 py-12">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-amber-400 rotate-3 flex items-center justify-center">
                  <span className="text-black font-black text-xs -rotate-3">W</span>
                </div>
                <span className="text-sm font-bold tracking-[0.2em] uppercase">Wax for Men</span>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Professional male waxing services.<br />
                Part of the PLG UK family of brands.
              </p>
            </div>
            <div className="col-span-6 md:col-span-2">
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400 mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><a href="#services" className="hover:text-amber-400 transition-colors">Intimate Waxing</a></li>
                <li><a href="#services" className="hover:text-amber-400 transition-colors">Back, Chest & Abs</a></li>
                <li><a href="#services" className="hover:text-amber-400 transition-colors">Legs & Arms</a></li>
                <li><a href="#services" className="hover:text-amber-400 transition-colors">Face & Detail</a></li>
                <li><a href="#services" className="hover:text-amber-400 transition-colors">Body Clippering</a></li>
                <li><a href="#services" className="hover:text-amber-400 transition-colors">Facials & Massage</a></li>
              </ul>
            </div>
            <div className="col-span-6 md:col-span-2">
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><Link href="/wax-for-men/unlimiwax" className="hover:text-amber-400 transition-colors">UnlimiWax</Link></li>
                <li><Link href="/login" className="hover:text-amber-400 transition-colors">Client Portal</Link></li>
                <li><Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-amber-400 transition-colors">Terms</Link></li>
              </ul>
            </div>
            <div className="col-span-12 md:col-span-4">
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400 mb-4">Get in Touch</h4>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 border border-amber-400 text-amber-400 text-sm font-bold tracking-wider uppercase hover:bg-amber-400 hover:text-black transition-all"
              >
                Book Appointment
              </Link>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-neutral-600">&copy; {new Date().getFullYear()} PLG UK. All rights reserved.</span>
            <span className="text-xs text-neutral-700 tracking-wider uppercase">Precision. Confidence. Results.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
