import Link from 'next/link';

export const metadata = {
  title: 'UnlimiWax | Lock In Your Waxing Price for 2 Years | Wax for Men',
  description:
    'Save up to 30% on professional male waxing with UnlimiWax 24-month plans. 0% APR finance. Soft credit check only. Lock in 2026 prices.',
};

export default function UnlimiWaxLanding() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-amber-400 selection:text-black">

      {/* ============================================ */}
      {/* NAVIGATION */}
      {/* ============================================ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/90 backdrop-blur-sm border-b border-neutral-800">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/wax-for-men" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-amber-400 rotate-3 flex items-center justify-center">
                <span className="text-black font-black text-sm -rotate-3">W</span>
              </div>
              <span className="text-lg font-bold tracking-[0.2em] uppercase">Wax for Men</span>
            </Link>
            <span className="text-neutral-600 mx-2">/</span>
            <span className="text-amber-400 font-bold tracking-wider text-sm uppercase">UnlimiWax</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-medium tracking-wider uppercase text-neutral-400">
            <a href="#how-it-works" className="hover:text-amber-400 transition-colors">How It Works</a>
            <a href="#plans" className="hover:text-amber-400 transition-colors">Plans</a>
            <a href="#calculator" className="hover:text-amber-400 transition-colors">Calculator</a>
          </div>
          <a
            href="#plans"
            className="px-6 py-2.5 bg-amber-400 text-black font-bold text-sm tracking-wider uppercase hover:bg-amber-300 transition-colors"
          >
            See Plans
          </a>
        </div>
      </nav>

      {/* ============================================ */}
      {/* HERO — Bold brutalist with financial hook */}
      {/* ============================================ */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background geometry */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[55%] h-full bg-neutral-900/60 -skew-x-6 origin-top-right" />
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-400 via-amber-400/20 to-transparent" />
          <div className="absolute top-[20%] right-[10%] w-64 h-64 border border-amber-400/10 rotate-12" />
          <div className="absolute bottom-[15%] right-[25%] w-40 h-40 border border-amber-400/5 -rotate-6" />
        </div>

        <div className="relative z-10 w-full max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-6 items-center">
            {/* Left — Main messaging */}
            <div className="col-span-12 lg:col-span-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="px-3 py-1 bg-amber-400 text-black text-xs font-black tracking-wider uppercase">
                  New
                </div>
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-500">
                  24-Month Waxing Plan
                </span>
              </div>

              <h1 className="text-[clamp(2.5rem,7vw,8rem)] font-black leading-[0.85] tracking-tighter uppercase">
                <span className="block text-white">Stop Paying</span>
                <span className="block text-white">Full Price</span>
                <span className="block text-amber-400">Every Time</span>
              </h1>

              <div className="mt-8 max-w-xl">
                <p className="text-xl md:text-2xl text-neutral-300 leading-relaxed font-light">
                  Lock in <span className="text-white font-semibold">2026 prices</span> and save up to{' '}
                  <span className="text-amber-400 font-bold">30%</span> on your regular waxing with a fixed
                  24-month plan. 0% APR. No catches.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#plans"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-amber-400 text-black font-bold text-sm tracking-wider uppercase hover:bg-amber-300 transition-all"
                >
                  View Plans &amp; Pricing
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white/20 text-white font-bold text-sm tracking-wider uppercase hover:border-amber-400 hover:text-amber-400 transition-all"
                >
                  How It Works
                </a>
              </div>

              {/* Trust signals */}
              <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-neutral-500 font-medium tracking-wider uppercase">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  0% APR
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Soft Credit Check
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No Impact on Credit Score
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  FCA Regulated
                </div>
              </div>
            </div>

            {/* Right — Savings highlight card */}
            <div className="col-span-12 lg:col-span-5">
              <div className="bg-neutral-900 border border-neutral-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 -skew-x-12" />

                {/* Featured example */}
                <div className="p-8 md:p-10">
                  <div className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-500 mb-6">
                    Example: Hollywood Wax
                  </div>

                  {/* PAYG vs UnlimiWax comparison */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
                      <div>
                        <div className="text-sm text-neutral-500 mb-1">Pay-as-you-go</div>
                        <div className="text-xs text-neutral-600">26 sessions over 2 years</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-neutral-500 line-through">&pound;1,300</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
                      <div>
                        <div className="text-sm text-amber-400 font-bold mb-1">UnlimiWax Plan</div>
                        <div className="text-xs text-neutral-500">Same 26 sessions, fixed price</div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-white">&pound;910</div>
                      </div>
                    </div>

                    <div className="bg-amber-400/10 border border-amber-400/20 p-4 flex items-center justify-between">
                      <span className="text-sm font-bold text-amber-400 uppercase tracking-wider">You Save</span>
                      <span className="text-2xl font-black text-amber-400">&pound;390</span>
                    </div>
                  </div>

                  {/* Monthly payment */}
                  <div className="mt-8 text-center">
                    <div className="text-xs text-neutral-500 tracking-wider uppercase mb-2">From just</div>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-lg font-bold text-neutral-500">&pound;</span>
                      <span className="text-6xl font-black text-white">34</span>
                      <span className="text-lg font-bold text-neutral-500">.12</span>
                      <span className="text-sm text-neutral-500 ml-1">/mo</span>
                    </div>
                    <div className="text-xs text-neutral-600 mt-2">at 0% APR over 24 months</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* EDITORIAL PULL QUOTE — Inflation angle */}
      {/* ============================================ */}
      <section className="relative py-20 md:py-28">
        <div className="absolute left-0 top-0 w-1 h-full bg-amber-400" />
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-2 flex items-start">
              <span className="text-[8rem] md:text-[10rem] font-black text-neutral-900 leading-none select-none">&pound;</span>
            </div>
            <div className="col-span-12 md:col-span-8">
              <blockquote className="text-2xl md:text-4xl font-light leading-snug text-neutral-300">
                Think of it as{' '}
                <span className="text-white font-semibold">buying wholesale</span>.
                You&apos;re a regular. You know you&apos;ll be coming back every 4 weeks.
                Why pay retail every time when you can{' '}
                <span className="text-amber-400 font-bold">lock in today&apos;s prices</span>{' '}
                for the next two years?
              </blockquote>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-px bg-amber-400" />
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-500">
                  Inflation-Proof Your Grooming
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* HOW IT WORKS — Brutalist numbered steps */}
      {/* ============================================ */}
      <section id="how-it-works" className="relative py-24 md:py-32 bg-neutral-900/50">
        <div className="absolute top-0 left-0 right-0 h-px bg-neutral-800" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-800" />

        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-px bg-amber-400" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-amber-400">How It Works</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              Simple as<br />
              <span className="text-neutral-600">1&ndash;2&ndash;3</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-800">
            {[
              {
                num: '01',
                title: '60-Second Check',
                desc: 'Quick soft credit check online. No impact on your credit score. Get an instant decision on your eligibility.',
                detail: 'Soft search only — invisible to other lenders',
              },
              {
                num: '02',
                title: 'Choose Your Plan',
                desc: 'Pick the waxing plan that matches your routine. Whether it\'s a single area or full body, we\'ll build a 24-month course at wholesale pricing.',
                detail: '0% APR — no interest, no hidden fees',
              },
              {
                num: '03',
                title: 'Book & Go',
                desc: 'Your sessions are pre-paid and ready to book. Come in every 4 weeks, just like always — but at a locked-in price.',
                detail: 'Fixed monthly payments via direct debit',
              },
            ].map((step) => (
              <div key={step.num} className="bg-neutral-950 p-8 md:p-12 group">
                <div className="text-6xl md:text-7xl font-black text-neutral-800 group-hover:text-amber-400 transition-colors leading-none mb-8">
                  {step.num}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{step.title}</h3>
                <p className="text-neutral-400 leading-relaxed mb-6">{step.desc}</p>
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-amber-400/70">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {step.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PLANS / PRICING — Core conversion section */}
      {/* ============================================ */}
      <section id="plans" className="relative py-24 md:py-32">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-px bg-amber-400" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-amber-400">Plans</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                Choose Your<br />
                <span className="text-neutral-600">Plan</span>
              </h2>
              <p className="text-neutral-400 text-lg max-w-md">
                All plans run for 24 months at 0% APR. Pick the one that fits your routine.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Plan: Essentials */}
            <div className="group bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors relative overflow-hidden">
              <div className="p-8 md:p-10">
                <div className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-500 mb-3">Essentials</div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Single Area</h3>
                <p className="text-neutral-500 text-sm mb-8">
                  Perfect for maintaining one key area on a regular schedule.
                </p>

                <div className="mb-6">
                  <div className="text-xs text-neutral-500 tracking-wider uppercase mb-2">From</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-neutral-500">&pound;</span>
                    <span className="text-5xl font-black text-white">19</span>
                    <span className="text-sm text-neutral-500">/mo</span>
                  </div>
                  <div className="text-xs text-neutral-600 mt-1">over 24 months at 0% APR</div>
                </div>

                <ul className="space-y-3 mb-8 text-sm text-neutral-400">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    26 sessions (every 4 weeks)
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Choose: Back, Chest, or Legs
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Up to 30% off PAYG rates
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Price locked for 2 years
                  </li>
                </ul>

                <a
                  href="#apply"
                  className="block w-full text-center px-6 py-4 border border-neutral-700 text-white font-bold text-sm tracking-wider uppercase hover:border-amber-400 hover:text-amber-400 transition-all"
                >
                  Check Eligibility
                </a>
              </div>
            </div>

            {/* Plan: Pro — Featured */}
            <div className="group bg-neutral-900 border-2 border-amber-400 relative overflow-hidden">
              <div className="bg-amber-400 py-2 text-center">
                <span className="text-xs font-black tracking-[0.3em] uppercase text-black">Most Popular</span>
              </div>
              <div className="p-8 md:p-10">
                <div className="text-xs font-bold tracking-[0.3em] uppercase text-amber-400 mb-3">Pro</div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Multi-Area</h3>
                <p className="text-neutral-500 text-sm mb-8">
                  Combine two or more areas for maximum savings on your regular routine.
                </p>

                <div className="mb-6">
                  <div className="text-xs text-neutral-500 tracking-wider uppercase mb-2">From</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-neutral-500">&pound;</span>
                    <span className="text-5xl font-black text-amber-400">34</span>
                    <span className="text-sm text-neutral-500">/mo</span>
                  </div>
                  <div className="text-xs text-neutral-600 mt-1">over 24 months at 0% APR</div>
                </div>

                <ul className="space-y-3 mb-8 text-sm text-neutral-400">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    26 sessions per area
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    2+ areas combined
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Includes intimate waxing options
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Up to 30% off PAYG rates
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Priority booking
                  </li>
                </ul>

                <a
                  href="#apply"
                  className="block w-full text-center px-6 py-4 bg-amber-400 text-black font-bold text-sm tracking-wider uppercase hover:bg-amber-300 transition-colors"
                >
                  Check Eligibility
                </a>
              </div>
            </div>

            {/* Plan: Total */}
            <div className="group bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors relative overflow-hidden">
              <div className="p-8 md:p-10">
                <div className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-500 mb-3">Total</div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Full Body</h3>
                <p className="text-neutral-500 text-sm mb-8">
                  The complete package. Every area covered, every visit, for two years.
                </p>

                <div className="mb-6">
                  <div className="text-xs text-neutral-500 tracking-wider uppercase mb-2">From</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-neutral-500">&pound;</span>
                    <span className="text-5xl font-black text-white">65</span>
                    <span className="text-sm text-neutral-500">/mo</span>
                  </div>
                  <div className="text-xs text-neutral-600 mt-1">over 24 months at 0% APR</div>
                </div>

                <ul className="space-y-3 mb-8 text-sm text-neutral-400">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    26 full-body sessions
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    All areas: back, chest, legs, arms, intimate
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Maximum savings vs PAYG
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Priority booking + VIP perks
                  </li>
                </ul>

                <a
                  href="#apply"
                  className="block w-full text-center px-6 py-4 border border-neutral-700 text-white font-bold text-sm tracking-wider uppercase hover:border-amber-400 hover:text-amber-400 transition-all"
                >
                  Check Eligibility
                </a>
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* FCA REPRESENTATIVE EXAMPLE — Required */}
          {/* ============================================ */}
          <div className="mt-12 bg-neutral-900 border border-neutral-800 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 border border-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-500">
                i
              </div>
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-400">
                Representative Example
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div>
                <div className="text-xs text-neutral-500 tracking-wider uppercase mb-1">Course Price</div>
                <div className="text-xl font-black text-white">&pound;910.00</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 tracking-wider uppercase mb-1">24 Monthly Payments</div>
                <div className="text-xl font-black text-white">&pound;34.12</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 tracking-wider uppercase mb-1">Total Payable</div>
                <div className="text-xl font-black text-white">&pound;910.00</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 tracking-wider uppercase mb-1">Representative APR</div>
                <div className="text-xl font-black text-amber-400">0% APR</div>
              </div>
            </div>
            <p className="mt-6 text-xs text-neutral-600 leading-relaxed max-w-3xl">
              Representative example based on a Hollywood Wax course. 26 sessions over 24 months.
              Pay-as-you-go price: &pound;50.00 per session (&pound;1,300.00 total). UnlimiWax course
              price: &pound;910.00. 24 monthly payments of &pound;34.12. Total amount payable:
              &pound;910.00. Representative 0% APR. Credit is subject to status and affordability.
              Terms and conditions apply.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SAVINGS CALCULATOR — Magazine editorial */}
      {/* ============================================ */}
      <section id="calculator" className="relative py-24 md:py-32 bg-neutral-900/50">
        <div className="absolute top-0 left-0 right-0 h-px bg-neutral-800" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-800" />

        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-px bg-amber-400" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-amber-400">The Maths</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              Do The<br />
              <span className="text-neutral-600">Numbers</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                area: 'Full Back',
                payg: 25,
                sessions: 26,
                discount: 0.30,
              },
              {
                area: 'Chest',
                payg: 25,
                sessions: 26,
                discount: 0.30,
              },
              {
                area: 'Full Legs',
                payg: 35,
                sessions: 26,
                discount: 0.30,
              },
              {
                area: 'Hollywood Wax',
                payg: 50,
                sessions: 26,
                discount: 0.30,
              },
              {
                area: 'Back + Chest',
                payg: 50,
                sessions: 26,
                discount: 0.30,
              },
              {
                area: 'Full Body',
                payg: 120,
                sessions: 26,
                discount: 0.30,
              },
            ].map((item) => {
              const paygTotal = item.payg * item.sessions;
              const unlimiwaxTotal = Math.round(paygTotal * (1 - item.discount));
              const saving = paygTotal - unlimiwaxTotal;
              const monthly = (unlimiwaxTotal / 24).toFixed(2);
              return (
                <div key={item.area} className="bg-neutral-950 border border-neutral-800 p-8 hover:border-amber-400/20 transition-colors">
                  <h3 className="text-lg font-black uppercase tracking-tight mb-6">{item.area}</h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">PAYG (&pound;{item.payg} x {item.sessions})</span>
                      <span className="text-neutral-400 line-through">&pound;{paygTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">UnlimiWax Price</span>
                      <span className="font-bold text-white">&pound;{unlimiwaxTotal.toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-neutral-800" />
                    <div className="flex justify-between">
                      <span className="text-amber-400 font-bold">You Save</span>
                      <span className="text-amber-400 font-black">&pound;{saving.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-neutral-800 text-center">
                    <div className="text-xs text-neutral-600 mb-1">Monthly payment</div>
                    <div className="text-2xl font-black">
                      <span className="text-sm text-neutral-500">&pound;</span>{monthly}
                      <span className="text-sm text-neutral-500">/mo</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* OBJECTION HANDLING — FAQ brutalist accordion */}
      {/* ============================================ */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-8 md:gap-12">
            <div className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-px bg-amber-400" />
                  <span className="text-xs font-bold tracking-[0.3em] uppercase text-amber-400">FAQ</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                  Common<br />
                  <span className="text-neutral-600">Questions</span>
                </h2>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-8">
              <div className="space-y-0">
                {[
                  {
                    q: 'Is this a contract or a subscription?',
                    a: 'It\'s a fixed-term course of treatments, financed over 24 months. Think of it like buying in bulk at a wholesale price — you know exactly what you\'re getting and exactly what you\'ll pay. It\'s not a rolling subscription and there are no surprise renewals.',
                  },
                  {
                    q: 'Will checking my eligibility affect my credit score?',
                    a: 'No. We use a soft credit check to assess eligibility. This is invisible to other lenders and has zero impact on your credit score. It takes about 60 seconds and you\'ll get an instant decision.',
                  },
                  {
                    q: 'What does 0% APR actually mean?',
                    a: 'It means you pay no interest whatsoever. The total you pay over 24 months is the same as the course price. There are no hidden fees, arrangement charges, or early repayment penalties.',
                  },
                  {
                    q: 'What if I need to cancel?',
                    a: 'You have a 14-day cooling-off period after signing. After that, the course is a fixed commitment. If you do need to cancel, any refund is calculated as: Total Finance Amount minus (sessions used x full PAYG price). We also offer a 3-month grace period for rescheduling missed sessions.',
                  },
                  {
                    q: 'How is this regulated?',
                    a: 'UnlimiWax finance is provided through an FCA-authorised lender. We operate as a Secondary Credit Broker, meaning we introduce you to the finance provider but don\'t lend directly. All advertising complies with FCA CONC 3 requirements.',
                  },
                  {
                    q: 'Can I add more areas later?',
                    a: 'Yes. You can add additional areas at any point by starting a new plan for those areas. Your existing plan continues unchanged.',
                  },
                ].map((item, i) => (
                  <div key={i} className="border-b border-neutral-800 py-8 md:py-10">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-4">{item.q}</h3>
                    <p className="text-neutral-400 leading-relaxed max-w-2xl">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA — Full-width conversion block */}
      {/* ============================================ */}
      <section id="apply" className="relative py-32 md:py-40">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-[5%] w-[50%] h-full bg-amber-400/[0.03] skew-x-6" />
          <div className="absolute bottom-0 right-[10%] w-[35%] h-[50%] bg-amber-400/[0.02] -skew-x-12" />
        </div>

        <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12 text-center">
          <div className="inline-block px-4 py-1.5 bg-amber-400 text-black text-xs font-black tracking-wider uppercase mb-8">
            60-Second Eligibility Check
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-none mb-6">
            Lock In Your<br />
            <span className="text-amber-400">Price Today</span>
          </h2>
          <p className="text-neutral-400 text-xl max-w-lg mx-auto mb-4">
            Soft credit check. No impact on your score. Instant decision.
          </p>
          <p className="text-neutral-600 text-sm max-w-md mx-auto mb-12">
            From &pound;19/month. 0% APR. 24 months. Up to 30% off pay-as-you-go prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-10 py-5 bg-amber-400 text-black font-bold text-sm tracking-wider uppercase hover:bg-amber-300 transition-colors"
            >
              Check My Eligibility
            </Link>
            <Link
              href="/wax-for-men"
              className="px-10 py-5 border-2 border-white/20 text-white font-bold text-sm tracking-wider uppercase hover:border-amber-400 hover:text-amber-400 transition-colors"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <footer className="border-t border-neutral-800 py-12">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-amber-400 rotate-3 flex items-center justify-center">
                  <span className="text-black font-black text-xs -rotate-3">W</span>
                </div>
                <span className="text-sm font-bold tracking-[0.2em] uppercase">Wax for Men</span>
                <span className="text-neutral-600 mx-1">/</span>
                <span className="text-amber-400 text-sm font-bold">UnlimiWax</span>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed mb-4">
                Professional male waxing, financed sensibly.<br />
                Part of the PLG UK family of brands.
              </p>
              <p className="text-neutral-700 text-xs leading-relaxed max-w-md">
                Credit is provided by an FCA-authorised lender. Wax for Men acts as a credit
                broker and not a lender. Credit is subject to status and affordability.
                Applicants must be 18 or over. Terms and conditions apply.
              </p>
            </div>
            <div className="col-span-6 md:col-span-2">
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400 mb-4">Plans</h4>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><a href="#plans" className="hover:text-amber-400 transition-colors">Essentials</a></li>
                <li><a href="#plans" className="hover:text-amber-400 transition-colors">Pro</a></li>
                <li><a href="#plans" className="hover:text-amber-400 transition-colors">Total</a></li>
                <li><a href="#calculator" className="hover:text-amber-400 transition-colors">Calculator</a></li>
              </ul>
            </div>
            <div className="col-span-6 md:col-span-2">
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Finance T&amp;Cs</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Complaints</a></li>
              </ul>
            </div>
            <div className="col-span-12 md:col-span-3">
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400 mb-4">Get Started</h4>
              <a
                href="#apply"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-black text-sm font-bold tracking-wider uppercase hover:bg-amber-300 transition-colors"
              >
                Check Eligibility
              </a>
            </div>
          </div>

          {/* FCA disclosure footer */}
          <div className="mt-12 pt-8 border-t border-neutral-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-xs text-neutral-600">&copy; {new Date().getFullYear()} PLG UK. All rights reserved.</span>
              <span className="text-xs text-neutral-700 tracking-wider">
                FCA Secondary Credit Broker
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
