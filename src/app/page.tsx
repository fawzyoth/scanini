import { LandingNavbar } from "@/components/landing/navbar";
import { LandingHero } from "@/components/landing/hero";
import { LandingFeatures } from "@/components/landing/features";
import { LandingDemo } from "@/components/landing/demo-section";
import { LandingTestimonials } from "@/components/landing/testimonials";
import { LandingPricing } from "@/components/landing/pricing";
import { LandingWhyScanini } from "@/components/landing/why-scanini";
import { LandingFaq } from "@/components/landing/faq";
import { LandingCta } from "@/components/landing/cta-section";
import { LandingFooter } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      <LandingHero />
      <LandingFeatures />
      <LandingDemo />
      <LandingTestimonials />
      <LandingPricing />
      <LandingWhyScanini />
      <LandingFaq />
      <LandingCta />
      <LandingFooter />
    </div>
  );
}
