import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Binani took our checkout success rate from 91% to 98.6% in six weeks. Just the failover routing setup paid for itself in the first month.",
    name: "Aarav Mehta",
    role: "Co-founder, Threadlane (D2C)",
    avatar: "https://images.unsplash.com/photo-1762522927402-f390672558d8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0JTIwc21pbGluZ3xlbnwwfHx8fDE3NzY0MjI1MzN8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    quote:
      "We were stuck in KYC hell for 5 weeks. Their team closed the loop with the gateway's risk desk in 4 days. Live on Razorpay + Cashfree now.",
    name: "Priya Shenoy",
    role: "Head of Finance, Layerloop SaaS",
    avatar: "https://images.pexels.com/photos/30161439/pexels-photo-30161439.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    quote:
      "Honest, fast, and genuinely knowledgeable. They told us not to go with the gateway we were leaning toward — saved us months.",
    name: "Rohan Kapoor",
    role: "Founder, Parley Studio",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?crop=entropy&cs=srgb&fm=jpg&q=85&w=400",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" data-testid="testimonials-section" className="relative py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Client stories</div>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-black tracking-tighter text-navy-900">
            Teams that stopped losing sleep over payments.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <figure
              key={t.name}
              data-testid={`testimonial-${i}`}
              className={`relative rounded-3xl p-8 card-hover ${
                i === 1
                  ? "bg-navy-900 text-white border border-navy-800"
                  : "bg-white border border-slate-200"
              }`}
            >
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className={`h-4 w-4 ${i === 1 ? "text-amber-300 fill-amber-300" : "text-amber-500 fill-amber-500"}`} />
                ))}
              </div>
              <blockquote className={`mt-5 font-display text-lg md:text-xl leading-snug tracking-tight ${i === 1 ? "text-white" : "text-navy-900"}`}>
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-white/50"
                  loading="lazy"
                />
                <div className="leading-tight">
                  <div className={`font-semibold ${i === 1 ? "text-white" : "text-navy-900"}`}>{t.name}</div>
                  <div className={`text-xs ${i === 1 ? "text-slate-300" : "text-slate-500"}`}>{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
