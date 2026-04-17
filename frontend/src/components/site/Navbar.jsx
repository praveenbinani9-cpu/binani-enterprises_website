import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";

const navItems = [
  { label: "Services", href: "/#services" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Who it's for", href: "/#audience" },
  { label: "Testimonials", href: "/#testimonials" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header
      data-testid="site-navbar"
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-white/80 border-b border-slate-200/70"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" data-testid="logo-link" className="flex items-center gap-2.5 group">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-navy-900 text-white font-display font-black">
            <span className="absolute inset-0 rounded-xl gradient-accent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative">B</span>
          </span>
          <div className="leading-tight">
            <div className="font-display font-black text-[17px] tracking-tight text-navy-900">Binani</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 -mt-0.5">Enterprises</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-testid={`nav-link-${item.label.toLowerCase().replace(/\s|'/g, "-")}`}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-navy-900 rounded-lg hover:bg-slate-100/70 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/book" data-testid="nav-book-btn">
            <Button
              variant="ghost"
              className="rounded-full text-navy-900 hover:bg-slate-100"
            >
              Book Consultation
            </Button>
          </Link>
          <Link to="/book" data-testid="nav-get-started-btn">
            <Button className="rounded-full bg-navy-900 hover:bg-navy-800 text-white shadow-lg shadow-navy-900/10 group">
              Get Started
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>

        <button
          data-testid="mobile-menu-toggle"
          onClick={() => setOpen(!open)}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div data-testid="mobile-menu" className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl">
          <div className="px-5 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-3 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
              >
                {item.label}
              </a>
            ))}
            <Link to="/book" className="mt-2">
              <Button className="w-full rounded-full bg-navy-900 hover:bg-navy-800 text-white">
                Book Free Consultation
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
