import { useEffect } from 'react';
import { HeroSection } from '@/sections/HeroSection';
import { CategoriesSection } from '@/sections/CategoriesSection';
import { PopularProvidersSection } from '@/sections/PopularProvidersSection';
import { TestimonialsSection } from '@/sections/TestimonialsSection';
import { CTASection } from '@/sections/CTASection';
import { initializeMockData } from '@/lib/storage';

export function HomePage() {
  useEffect(() => {
    // Initialiser les données de démonstration
    initializeMockData();
  }, []);

  return (
    <main className="min-h-screen">
      <HeroSection />
      <CategoriesSection />
      <PopularProvidersSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
