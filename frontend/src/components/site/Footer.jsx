import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="bg-navy-900 text-slate-200 mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-navy-900 font-display font-black text-lg">B</span>
              <div>
                <div className="font-display font-black text-lg text-white tracking-tight">Binani Enterprises</div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Payment Solutions Partner</div>
              </div>
            </div>
            <p className="text-slate-400 mt-5 max-w-md leading-relaxed">
              We help businesses choose, set up, and optimize the right payment gateway.
              Faster onboarding. Higher success rates. Less friction.
            </p>
            <div className="mt-6 space-y-2.5 text-sm">
              <a href="mailto:hello@binanienterprises.com" className="flex items-center gap-2.5 text-slate-300 hover:text-white transition" data-testid="footer-email">
                <Mail className="h-4 w-4 text-indigo-300" /> hello@binanienterprises.com
              </a>
              <a href="tel:+919000000000" className="flex items-center gap-2.5 text-slate-300 hover:text-white transition" data-testid="footer-phone">
                <Phone className="h-4 w-4 text-indigo-300" /> +91 90000 00000
              </a>
              <div className="flex items-center gap-2.5 text-slate-300">
                <MapPin className="h-4 w-4 text-indigo-300" /> Mumbai • Bengaluru • Remote
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="text-white font-semibold mb-4">Company</div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="/#services" className="hover:text-white">Services</a></li>
              <li><a href="/#how-it-works" className="hover:text-white">How it works</a></li>
              <li><a href="/#audience" className="hover:text-white">Who it's for</a></li>
              <li><a href="/#testimonials" className="hover:text-white">Testimonials</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-white font-semibold mb-4">Solutions</div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Gateway Consultation</li>
              <li>Fast-track Onboarding</li>
              <li>Integration Support</li>
              <li>Payment Optimization</li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-white font-semibold mb-4">Get started</div>
            <p className="text-sm text-slate-400 mb-4">
              Book a free 30-minute consultation and we'll map the best gateway stack for your business.
            </p>
            <Link
              to="/book"
              data-testid="footer-cta-book"
              className="inline-flex items-center rounded-full bg-white text-navy-900 px-5 py-2.5 text-sm font-semibold hover:bg-slate-100 transition"
            >
              Book Free Consultation
            </Link>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Binani Enterprises. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 max-w-xl md:text-right">
            <span className="text-slate-300 font-medium">Disclaimer:</span> We are not a payment gateway.
            We partner with leading providers including Razorpay, Cashfree, PayU, and Stripe to deliver
            tailored payment infrastructure for our clients.
          </p>
        </div>
      </div>
    </footer>
  );
}
