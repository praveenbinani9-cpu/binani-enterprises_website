import { TrendingUp, ArrowUpRight, CreditCard, Wallet, CheckCircle2 } from "lucide-react";

export default function DashboardPreview() {
  const bars = [28, 44, 36, 58, 50, 72, 66, 84, 78, 96, 88, 112, 104, 128];
  return (
    <section data-testid="dashboard-preview" className="relative py-20 md:py-32 bg-slate-50/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">What you get</div>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-black tracking-tighter text-navy-900">
            One dashboard to watch every payment land.
          </h2>
          <p className="mt-5 text-slate-600 text-base md:text-lg leading-relaxed">
            We help you stand up a unified analytics view across every gateway you run —
            so success rate, MDR, and payout cycles stay under one roof.
          </p>
        </div>

        <div className="mt-14 relative">
          {/* Gradient frame */}
          <div className="absolute inset-0 rounded-[32px] gradient-accent opacity-90 blur-2xl opacity-30" aria-hidden />

          <div className="relative rounded-3xl border border-slate-200 bg-white hard-shadow overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-200 bg-slate-50">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="ml-3 text-xs text-slate-500 font-medium">app.binanienterprises.com/dashboard</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Sidebar */}
              <div className="hidden lg:flex lg:col-span-2 border-r border-slate-200 bg-white flex-col p-5">
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Overview</div>
                <div className="mt-3 space-y-1.5">
                  {["Payments", "Settlements", "Customers", "Routes", "Webhooks"].map((l, i) => (
                    <div key={l} className={`px-3 py-2 rounded-lg text-sm font-medium ${i === 0 ? "bg-navy-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
                      {l}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main */}
              <div className="lg:col-span-10 p-6 md:p-8">
                {/* KPI row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Transactions", value: "24,812", delta: "+14.3%", icon: CreditCard, tone: "bg-indigo-50 text-indigo-600" },
                    { label: "Success rate", value: "99.2%", delta: "+0.8%", icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600" },
                    { label: "Revenue", value: "₹ 4.82 Cr", delta: "+22.1%", icon: TrendingUp, tone: "bg-cyan-50 text-cyan-600" },
                    { label: "Avg MDR", value: "1.78%", delta: "-0.12%", icon: Wallet, tone: "bg-amber-50 text-amber-600" },
                  ].map((k) => {
                    const Icon = k.icon;
                    return (
                      <div key={k.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between">
                          <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${k.tone}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="text-[11px] font-semibold text-emerald-600 inline-flex items-center gap-0.5">
                            <ArrowUpRight className="h-3 w-3" /> {k.delta}
                          </div>
                        </div>
                        <div className="mt-3 text-[11px] uppercase tracking-wider text-slate-500 font-medium">{k.label}</div>
                        <div className="font-display font-black text-xl md:text-2xl text-navy-900 tracking-tight">{k.value}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Chart + routes */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Revenue — last 14 days</div>
                        <div className="mt-0.5 font-display font-black text-lg text-navy-900">₹ 4,82,14,902</div>
                      </div>
                      <div className="text-xs text-slate-500">in ₹</div>
                    </div>
                    <div className="mt-5 flex items-end gap-2 h-36">
                      {bars.map((b, i) => (
                        <div key={i} className="flex-1 flex items-end">
                          <div
                            className="w-full rounded-t-md bg-gradient-to-t from-indigo-500 to-cyan-400"
                            style={{ height: `${b}px` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Gateway split</div>
                    <div className="mt-4 space-y-3">
                      {[
                        { n: "Razorpay", v: 42, color: "bg-indigo-500" },
                        { n: "Cashfree", v: 28, color: "bg-cyan-500" },
                        { n: "PayU", v: 18, color: "bg-emerald-500" },
                        { n: "Stripe", v: 12, color: "bg-amber-500" },
                      ].map((g) => (
                        <div key={g.n}>
                          <div className="flex items-center justify-between text-sm">
                            <div className="font-medium text-navy-900">{g.n}</div>
                            <div className="text-slate-500">{g.v}%</div>
                          </div>
                          <div className="mt-1.5 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div className={`h-full ${g.color}`} style={{ width: `${g.v}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
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
