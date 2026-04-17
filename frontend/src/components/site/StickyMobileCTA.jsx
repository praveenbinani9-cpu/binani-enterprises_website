import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function StickyMobileCTA() {
  const { pathname } = useLocation();
  if (pathname === "/book") return null;
  return (
    <div
      data-testid="sticky-mobile-cta"
      className="md:hidden fixed bottom-20 inset-x-4 z-40"
    >
      <Link to="/book">
        <Button className="w-full rounded-full h-12 gradient-accent text-white font-semibold shadow-xl shadow-indigo-500/30">
          Book Free Consultation
        </Button>
      </Link>
    </div>
  );
}
