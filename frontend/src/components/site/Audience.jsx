import { ShoppingBag, Cloud, User, Building2 } from "lucide-react";

const audiences = [
  {
    icon: ShoppingBag,
    title: "E-commerce",
    desc: "D2C, marketplaces, and subscription brands needing high-success-rate checkouts.",
    gradient: "from-rose-50 to-white",
    iconBg: "bg-rose-500",
  },
  {
    icon: Cloud,
    title: "SaaS",
    desc: "Recurring billing, MRR tracking, global cards, and failed-payment recovery.",
    gradient: "from-indigo-50 to-white",
    iconBg: "bg-indigo-500",
  },
  {
    icon: User,
    title: "Freelancers",
    desc: "Accept domestic and international payments without the paperwork headache.",
    gradient: "from-cyan-50 to-white",
    iconBg: "bg-cyan-500",
  },
  {
    icon: Building2,
    title: "Agencies",
    desc: "Multi-client, multi-currency invoicing with unified payout reconciliation.",
    gradient: "from-amber-50 to-white",
    iconBg: "bg-amber-500",
  },
];

export default function Audience() {
  return (
    <section id="audience" data-testid="audience-section" className="relative py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Who it's for</div>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-black tracking-tighter text-navy-900">
              Built for businesses that take payments seriously.
            </h2>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {audiences.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.title}
                data-testid={`audience-${a.title.toLowerCase()}`}
                className={`relative rounded-2xl border border-slate-200 bg-gradient-to-br ${a.gradient} p-7 card-hover`}
              >
                <div className={`h-12 w-12 rounded-2xl ${a.iconBg} text-white flex items-center justify-center shadow-lg`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 font-display font-bold text-xl text-navy-900 tracking-tight">{a.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{a.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
