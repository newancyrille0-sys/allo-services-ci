"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { FeaturedProviders } from "@/components/home/FeaturedProviders";
import { ProviderMapSection } from "@/components/providers/ProviderMapSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TrustSection } from "@/components/home/TrustSection";
import { Testimonials } from "@/components/home/Testimonials";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafb]">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        <CategoriesGrid />
        <FeaturedProviders />
        <ProviderMapSection />
        <HowItWorks />
        <TrustSection />
        <Testimonials />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}
