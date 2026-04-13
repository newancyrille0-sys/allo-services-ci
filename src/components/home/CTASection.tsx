"use client";

import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="max-w-screen-2xl mx-auto px-6 mt-32 mb-16">
      <div className="bg-gradient-to-r from-primary to-primary-container rounded-[3rem] p-10 md:p-20 overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <Briefcase className="w-[30rem] h-[30rem] rotate-12 text-white" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Prêt à rejoindre l&apos;aventure ?
            </h2>
            <p className="text-white/80 text-lg max-w-xl">
              Que vous soyez client à la recherche de services de qualité ou prestataire souhaitant développer votre activité, Allo Services CI est fait pour vous.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/services">
                <Button className="bg-white text-primary px-8 py-4 rounded-2xl font-bold text-lg hover:scale-95 transition-transform flex items-center gap-2">
                  Trouver un prestataire
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register/provider">
                <Button className="bg-[#fd7613] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-95 transition-transform flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Devenir prestataire
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <p className="text-4xl font-bold text-white mb-2">2 500+</p>
              <p className="text-white/70">Prestataires actifs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <p className="text-4xl font-bold text-white mb-2">15 000+</p>
              <p className="text-white/70">Clients satisfaits</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <p className="text-4xl font-bold text-white mb-2">65+</p>
              <p className="text-white/70">Villes couvertes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <p className="text-4xl font-bold text-white mb-2">4.8/5</p>
              <p className="text-white/70">Note moyenne</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
