import { AlertTriangle, Clock, Compass, Wallet } from "lucide-react";

const problems = [
  {
    icon: AlertTriangle,
    title: "Payment failures hurt revenue",
    desc: "Checkout drop-offs, declined cards, and unreliable UPI intents silently eat 8–15% of your revenue every month.",
    accent: "from-rose-500/10 to-rose-500/0",
    iconBg: "bg-rose-100 text-rose-600",
  },
  {
    icon: Clock,
    title: "Approvals take forever",
    desc: "KYC back-and-forth, missing documents, and unclear MCC codes push onboarding to weeks — when it should be days.",
    accent: "from-amber-500/10 to-amber-500/0",
    iconBg: "bg-amber-100 text-amber-600",
  },
  {
    icon: Compass,
    title: "Confused which gateway to pick?",
    desc: "Razorpay? Cashfree? PayU? Stripe? The wrong choice costs you on fees, success rate, and payout speed.",
    accent: "from-indigo-500/10 to-indigo-500/0",
    iconBg: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: Wallet,
    title: "No one optimizes your stack",
    desc: "Most businesses set it and forget it. A monthly optimization review unlocks higher success rates and lower MDR.",
    accent: "from-cyan-500/10 to-cyan-500/0",
    iconBg: "bg-cyan-100 text-cyan-600",
  },
];

export default function Problems() {
  return (
    <section data-testid="problems-section" className="relative py-20 md:py-28 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">The problem</div>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-black tracking-tighter text-navy-900">
            Payments shouldn't be the hardest part of running your business.
          </h2>
          <p className="mt-5 text-slate-600 text-base md:text-lg leading-relaxed">
            Yet for most founders and operators, it is. Here's where teams get stuck.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {problems.map((p) => (
            <div
              key={p.title}
              data-testid={`problem-card-${p.title.split(" ")[0].toLowerCase()}`}
              className="relative rounded-2xl bg-white border border-slate-200 p-7 card-hover overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${p.accent} opacity-60`} />
              <div className="relative">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${p.iconBg}`}>
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display font-bold text-[17px] text-navy-900 leading-snug">{p.title}</h3>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
