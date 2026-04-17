const partners = [
  { name: "Razorpay", tagline: "Domestic UPI & Cards" },
  { name: "Cashfree", tagline: "Payouts & Subscriptions" },
  { name: "PayU", tagline: "Enterprise checkout" },
  { name: "Stripe", tagline: "Global payments" },
  { name: "PhonePe", tagline: "UPI at scale" },
  { name: "CCAvenue", tagline: "Legacy integrations" },
];

export default function TrustBar() {
  return (
    <section data-testid="trust-bar" className="relative bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <p className="text-center text-[11px] uppercase tracking-[0.25em] font-semibold text-slate-500">
          We work with leading payment providers
        </p>

        <div className="mt-8 relative overflow-hidden">
          <div className="flex gap-10 md:gap-16 animate-marquee whitespace-nowrap">
            {[...partners, ...partners].map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                data-testid={`partner-${p.name.toLowerCase()}`}
                className="flex items-center gap-3 shrink-0 group"
              >
                <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-display font-black text-navy-900">
                  {p.name.charAt(0)}
                </div>
                <div className="leading-tight">
                  <div className="font-display font-bold text-navy-900 text-lg tracking-tight">{p.name}</div>
                  <div className="text-[11px] text-slate-500">{p.tagline}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>
    </section>
  );
}
