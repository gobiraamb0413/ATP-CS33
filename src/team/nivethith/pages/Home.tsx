import React, { useEffect } from "react";
import { Navbar } from "@/team/nivethith/components/Navbar";
import { Hero } from "@/team/nivethith/components/Hero";
import { Features } from "@/team/nivethith/components/Features";
import { HowItWorks } from "@/team/nivethith/components/HowItWorks";
import { Integrations } from "@/team/nivethith/components/Integrations";
import { Comparison } from "@/team/nivethith/components/Comparison";
import { Blog } from "@/team/nivethith/components/Blog";
import { Testimonials } from "@/team/nivethith/components/Testimonials";
import { Pricing } from "@/team/nivethith/components/Pricing";
import { FAQ } from "@/team/nivethith/components/FAQ";
import { CTA } from "@/team/nivethith/components/CTA";
import { Footer } from "@/team/nivethith/components/Footer";
import { ChatWidget } from "@/team/sarukan/components/ChatWidget";
import { ScrollToTop } from "@/team/nivethith/components/ScrollToTop";
import { ScrollProgressBar } from "@/team/sarukan/components/ui/ScrollProgressBar";
import { initSmoothScroll } from "@/team/sarukan/services/scroll";

export const Home: React.FC = () => {
  useEffect(() => {
    const cleanup = initSmoothScroll();
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-primarylw">
      <ScrollProgressBar />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Features />
        <Integrations />
        <Comparison />
        <Blog />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      <ChatWidget />
      <ScrollToTop />
    </div>
  );
};
