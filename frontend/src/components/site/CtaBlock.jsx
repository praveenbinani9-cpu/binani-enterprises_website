import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CtaBlock() {
  return (
    <section data-testid="cta-section" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="relative overflow-hidden rounded-[32px] gradient-primary hard-shadow">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

          <div className="relative px-8 md:px-16 py-14 md:py-20 grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-8 text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3.5 py-1.5 text-xs font-medium">
                <Sparkles className="h-3.5 w-3.5" /> Free 30-min consultation · No obligations
              </div>
              <h2 className="mt-5 font-display text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.05]">
                Start Accepting Payments Today.
              </h2>
              <p className="mt-5 text-white/80 max-w-xl text-base md:text-lg leading-relaxed">
                Bring us your stack, your confusion, your blockers. We'll map a live path to production in a single call.
              </p>
            </div>
            <div className="md:col-span-4 flex md:justify-end">
              <Link to="/book" data-testid="cta-book-button">
                <Button className="h-14 px-7 rounded-full bg-white text-navy-900 hover:bg-slate-100 text-[15px] font-bold shadow-xl group">
                  Book Free Consultation
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
