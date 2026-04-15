"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { FeaturedProviders } from "@/components/home/FeaturedProviders";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TrustSection } from "@/components/home/TrustSection";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";
import { AssistantChat } from "@/components/assistant/AssistantChat";
import { PartnerMarquee } from "@/components/partners/PartnerMarquee";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafb]">
      <Header />

      <main className="flex-grow">
        <Hero />
        <PartnerMarquee location="home" />
        <CategoriesGrid />
        <FeaturedProviders />
        <HowItWorks />
        <TrustSection />
        <Testimonials />
        <FAQSection />
        <CTASection />
      </main>

      <Footer />
      
      {/* Assistant IA - Disponible sur toutes les pages */}
      <AssistantChat />
    </div>
  );
}
