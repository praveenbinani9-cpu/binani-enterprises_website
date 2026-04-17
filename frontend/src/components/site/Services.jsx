import { Link } from "react-router-dom";
import {
  MessagesSquare, Rocket, Plug, Layers3, LineChart, ArrowUpRight,
} from "lucide-react";

const services = [
  {
    icon: MessagesSquare,
    title: "Gateway Consultation",
    desc: "We audit your business model, geography, and ticket size to recommend the ideal gateway stack — honestly.",
    span: "md:col-span-3 lg:col-span-3",
    tone: "light",
  },
  {
    icon: Rocket,
    title: "Fast-track Onboarding",
    desc: "KYC, MCC alignment, risk review — we handle the back-and-forth so you go live in days.",
    span: "md:col-span-3 lg:col-span-2",
    tone: "dark",
  },
  {
    icon: Plug,
    title: "Integration Support",
    desc: "Server-to-server, hosted checkout, webhooks, retries — our engineers plug in alongside yours.",
    span: "md:col-span-2 lg:col-span-2",
    tone: "light",
  },
  {
    icon: Layers3,
    title: "Multi-Gateway Setup",
    desc: "Smart routing across Razorpay, Cashfree, PayU, Stripe. Failover, fallback, and best rates per transaction.",
    span: "md:col-span-2 lg:col-span-2",
    tone: "accent",
  },
  {
    icon: LineChart,
    title: "Payment Optimization",
    desc: "Monthly reviews on success rate, MDR, payout cycles. We keep squeezing more yield out of every rupee.",
    span: "md:col-span-2 lg:col-span-1",
    tone: "light",
  },
];

function toneClasses(tone) {
  if (tone === "dark") return "bg-navy-900 text-white border-navy-800";
  if (tone === "accent") return "gradient-accent text-white border-transparent";
  return "bg-white text-navy-900 border-slate-200";
}

export default function Services() {
  return (
    <section id="services" data-testid="services-section" className="relative py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Services</div>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-black tracking-tighter text-navy-900">
              A full-stack partner for your payments infra.
            </h2>
          </div>
          <p className="max-w-md text-slate-600 leading-relaxed">
            From the first "which gateway?" conversation to monthly success-rate optimization — one team, one accountable partner.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 gap-5 md:gap-6 auto-rows-fr">
          {services.map((s) => {
            const Icon = s.icon;
            const isLight = s.tone === "light";
            return (
              <div
                key={s.title}
                data-testid={`service-${s.title.toLowerCase().replace(/\s+/g, "-")}`}
                className={`relative overflow-hidden rounded-2xl border p-7 md:p-9 card-hover ${toneClasses(s.tone)} ${s.span}`}
              >
                {s.tone === "dark" && <div className="absolute inset-0 grid-bg opacity-20" />}
                <div className="relative flex flex-col h-full">
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${
                    isLight ? "bg-navy-900 text-white" : "bg-white/15 text-white"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className={`mt-6 font-display font-bold text-xl leading-tight ${isLight ? "text-navy-900" : "text-white"}`}>
                    {s.title}
                  </h3>
                  <p className={`mt-2.5 text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-white/85"}`}>
                    {s.desc}
                  </p>
                  <div className="mt-auto pt-6">
                    <Link
                      to="/book"
                      className={`inline-flex items-center text-[13px] font-semibold group ${
                        isLight ? "text-navy-900" : "text-white"
                      }`}
                    >
                      Talk to us
                      <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
