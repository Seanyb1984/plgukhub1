import Link from 'next/link';

export const metadata = {
  title: 'WAX FOR MEN | Premium Male Waxing',
  description: 'Professional male waxing services. Precision. Confidence. Results.',
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
      {/* SERVICES — Asymmetric magazine grid */}
      {/* ============================================ */}
      <section id="services" className="relative py-24 md:py-32">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          {/* Section header */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-px bg-amber-400" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-amber-400">Our Services</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              Every Area<br />
              <span className="text-neutral-600">Covered</span>
            </h2>
          </div>

          {/* Service grid — magazine asymmetric layout */}
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            {/* Large featured card */}
            <div className="col-span-12 md:col-span-7 row-span-2 group relative bg-neutral-900 border border-neutral-800 overflow-hidden hover:border-amber-400/30 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 -skew-x-12" />
              <div className="p-8 md:p-12">
                <div className="text-[7rem] md:text-[10rem] font-black text-neutral-900 leading-none absolute -top-6 -right-4 select-none group-hover:text-neutral-800 transition-colors">01</div>
                <div className="relative z-10">
                  <div className="w-14 h-14 border-2 border-amber-400 flex items-center justify-center mb-8">
                    <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">Body Waxing</h3>
                  <p className="text-neutral-400 text-lg leading-relaxed mb-8 max-w-md">
                    Full body waxing services including back, chest, stomach, shoulders, and arms.
                    Clean lines and smooth results using premium hot and strip wax systems.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-400" />
                      <span className="text-neutral-300">Full Back</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-400" />
                      <span className="text-neutral-300">Chest</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-400" />
                      <span className="text-neutral-300">Shoulders</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-400" />
                      <span className="text-neutral-300">Stomach</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-400" />
                      <span className="text-neutral-300">Full Arms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-400" />
                      <span className="text-neutral-300">Half Arms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top-right card */}
            <div className="col-span-12 md:col-span-5 group relative bg-neutral-900 border border-neutral-800 overflow-hidden hover:border-amber-400/30 transition-colors">
              <div className="p-8">
                <div className="text-[5rem] font-black text-neutral-900 leading-none absolute -top-2 -right-2 select-none group-hover:text-neutral-800 transition-colors">02</div>
                <div className="relative z-10">
                  <div className="w-14 h-14 border-2 border-amber-400 flex items-center justify-center mb-6">
                    <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Leg Waxing</h3>
                  <p className="text-neutral-400 leading-relaxed mb-4">
                    Full and half leg waxing for athletes, cyclists, swimmers, and men who demand clean definition.
                  </p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-neutral-300">Full Legs</span>
                    <span className="text-neutral-600">|</span>
                    <span className="text-neutral-300">Half Legs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom-right card */}
            <div className="col-span-12 md:col-span-5 group relative bg-neutral-900 border border-neutral-800 overflow-hidden hover:border-amber-400/30 transition-colors">
              <div className="p-8">
                <div className="text-[5rem] font-black text-neutral-900 leading-none absolute -top-2 -right-2 select-none group-hover:text-neutral-800 transition-colors">03</div>
                <div className="relative z-10">
                  <div className="w-14 h-14 border-2 border-amber-400 flex items-center justify-center mb-6">
                    <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Face & Detail</h3>
                  <p className="text-neutral-400 leading-relaxed mb-4">
                    Precision eyebrow shaping and facial detail work for sharp, well-groomed presentation.
                  </p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-neutral-300">Eyebrows</span>
                    <span className="text-neutral-600">|</span>
                    <span className="text-neutral-300">Underarms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Full-width intimate card */}
            <div className="col-span-12 group relative bg-neutral-900 border border-neutral-800 overflow-hidden hover:border-amber-400/30 transition-colors">
              <div className="p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="text-[5rem] font-black text-neutral-800 leading-none select-none">04</div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">Intimate Waxing</h3>
                  <p className="text-neutral-400 text-lg leading-relaxed max-w-2xl">
                    Professional, discreet intimate waxing in a comfortable environment. Our specialists are trained
                    exclusively in male intimate waxing with the highest hygiene and safety standards.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-amber-400 text-amber-400 text-sm font-bold tracking-wider uppercase hover:bg-amber-400 hover:text-black transition-all"
                  >
                    Enquire
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
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
                <li><a href="#services" className="hover:text-amber-400 transition-colors">Body Waxing</a></li>
                <li><a href="#services" className="hover:text-amber-400 transition-colors">Leg Waxing</a></li>
                <li><a href="#services" className="hover:text-amber-400 transition-colors">Face & Detail</a></li>
                <li><a href="#services" className="hover:text-amber-400 transition-colors">Intimate</a></li>
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
