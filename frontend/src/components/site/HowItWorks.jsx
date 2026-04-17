import { ClipboardList, Wrench, Rocket } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: ClipboardList,
    title: "Consultation",
    desc: "A 30-min call to understand your business, volumes, and goals. You leave with a clear gateway recommendation — free.",
  },
  {
    n: "02",
    icon: Wrench,
    title: "Setup & Approval",
    desc: "We drive KYC, MCC alignment, account activation, and API integration with your engineering team.",
  },
  {
    n: "03",
    icon: Rocket,
    title: "Go Live",
    desc: "Test mode → production. Smart routing, retries, and webhooks wired in. Ongoing optimization from day one.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" data-testid="how-it-works-section" className="relative py-20 md:py-32 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">How it works</div>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-black tracking-tighter text-navy-900">
            From "I'm stuck" to "we're live" — in three steps.
          </h2>
        </div>

        <div className="mt-16 relative">
          {/* connector line */}
          <div className="hidden md:block absolute top-8 left-8 right-8 h-px bg-gradient-to-r from-indigo-200 via-indigo-300 to-cyan-200" />

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.n} data-testid={`step-${s.n}`} className="relative">
                  <div className="flex items-center gap-4">
                    <div className="relative z-10 h-16 w-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center font-display font-black text-navy-900 text-lg">
                      {s.n}
                      <span className="absolute -bottom-1.5 -right-1.5 h-7 w-7 rounded-xl gradient-accent text-white flex items-center justify-center">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                  <h3 className="mt-6 font-display font-bold text-2xl text-navy-900 tracking-tight">{s.title}</h3>
                  <p className="mt-2.5 text-slate-600 leading-relaxed text-[15px]">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
