import Hero from "@/components/site/Hero";
import TrustBar from "@/components/site/TrustBar";
import Problems from "@/components/site/Problems";
import Services from "@/components/site/Services";
import HowItWorks from "@/components/site/HowItWorks";
import Audience from "@/components/site/Audience";
import DashboardPreview from "@/components/site/DashboardPreview";
import Testimonials from "@/components/site/Testimonials";
import CtaBlock from "@/components/site/CtaBlock";

export default function Home() {
  return (
    <div data-testid="home-page">
      <Hero />
      <TrustBar />
      <Problems />
      <Services />
      <HowItWorks />
      <Audience />
      <DashboardPreview />
      <Testimonials />
      <CtaBlock />
    </div>
  );
}
