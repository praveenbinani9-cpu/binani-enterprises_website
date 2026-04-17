import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, CalendarCheck, Sparkles, TrendingUp, ShieldCheck, Zap,
} from "lucide-react";

export default function Hero() {
  return (
    <section data-testid="hero-section" className="relative overflow-hidden gradient-hero">
      <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-24 md:pb-32">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          {/* Copy */}
          <div className="md:col-span-7 animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Trusted by 120+ businesses across India
            </div>

            <h1 className="mt-6 font-display text-[44px] leading-[1.02] sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-navy-900">
              Accept Payments <br className="hidden md:block" />
              the <span className="gradient-text">Smart Way</span> —<br className="hidden md:block" />
              Not the Hard Way.
            </h1>

            <p className="mt-6 max-w-xl text-slate-600 text-base md:text-lg leading-relaxed">
              Binani Enterprises is your payment solutions partner — we help you choose, set up, and
              optimize the right payment gateway stack across Razorpay, Cashfree, PayU, and Stripe.
              No more failed payments. No more onboarding delays.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link to="/book" data-testid="hero-get-started-btn">
                <Button className="h-12 px-6 rounded-full bg-navy-900 hover:bg-navy-800 text-white text-[15px] font-semibold shadow-xl shadow-navy-900/10 group">
                  Get Started
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link to="/book" data-testid="hero-book-consultation-btn">
                <Button
                  variant="outline"
                  className="h-12 px-6 rounded-full border-slate-300 text-navy-900 hover:bg-white hover:border-navy-900 text-[15px] font-semibold"
                >
                  <CalendarCheck className="mr-1.5 h-4 w-4" />
                  Book Free Consultation
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> PCI-DSS compliant partners</div>
              <div className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-500" /> Onboarding in days, not weeks</div>
              <div className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-indigo-500" /> No vendor lock-in</div>
            </div>
          </div>

          {/* Visual */}
          <div className="md:col-span-5 relative animate-fade-up" style={{ animationDelay: "120ms" }}>
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto">
              {/* Background blob */}
              <div className="absolute -top-8 -right-8 h-72 w-72 rounded-full bg-indigo-300/40 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 h-72 w-72 rounded-full bg-cyan-300/40 blur-3xl" />

              {/* Main card */}
              <div className="relative h-full w-full rounded-3xl border border-slate-200 bg-white hard-shadow overflow-hidden">
                <div className="absolute inset-0 gradient-primary opacity-[0.97]" />
                <div className="absolute inset-0 grid-bg opacity-20" />
                <div className="relative h-full w-full p-7 flex flex-col text-white">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-white/70">Payments overview</div>
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse-ring" />
                  </div>

                  <div className="mt-5">
                    <div className="text-xs text-white/60">Total processed (today)</div>
                    <div className="mt-1 font-display font-black text-4xl tracking-tight">₹ 12,84,920</div>
                    <div className="mt-1 text-xs text-emerald-300 inline-flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5" /> +18.2% vs yesterday
                    </div>
                  </div>

                  {/* mini chart */}
                  <div className="mt-7">
                    <div className="flex items-end gap-1.5 h-24">
                      {[34, 58, 46, 72, 62, 88, 80, 94, 76, 98, 84, 108].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t-md bg-gradient-to-t from-indigo-400/60 to-cyan-300"
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-white/60">Success rate</div>
                      <div className="font-display font-black text-xl">99.2%</div>
                    </div>
                    <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-white/60">Gateways</div>
                      <div className="font-display font-black text-xl">4 live</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating card 1: success rate */}
              <div className="absolute -top-6 -left-10 glass-card rounded-2xl p-4 w-56 animate-float" style={{ animationDelay: "300ms" }}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 uppercase tracking-wider">Success rate</div>
                    <div className="font-display font-black text-lg text-navy-900">99.2%</div>
                  </div>
                </div>
              </div>

              {/* Floating card 2: payment */}
              <div className="absolute bottom-16 -right-8 glass-card rounded-2xl p-4 w-60 animate-float" style={{ animationDelay: "600ms" }}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl gradient-accent text-white flex items-center justify-center">
                    <Zap className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 uppercase tracking-wider">New payment</div>
                    <div className="font-display font-bold text-sm text-navy-900">₹ 24,500 · Razorpay</div>
                  </div>
                </div>
              </div>

              {/* Floating card 3 */}
              <div className="absolute -bottom-4 left-6 glass-card rounded-2xl p-4 w-52 animate-float" style={{ animationDelay: "900ms" }}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 uppercase tracking-wider">KYC approved</div>
                    <div className="font-display font-bold text-sm text-navy-900">Live in 48h</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
