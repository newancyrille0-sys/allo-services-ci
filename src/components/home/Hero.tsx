"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin, ArrowRight, Users, CheckCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERVICE_CATEGORIES } from "@/lib/constants/services";
import { POPULAR_CITIES } from "@/lib/constants/cities";

export function Hero() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedService) params.set("service", selectedService);
    if (selectedCity) params.set("city", selectedCity);
    router.push(`/services?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[870px] flex items-center justify-center overflow-hidden px-4 md:px-10">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient opacity-85" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl text-center space-y-10 pt-20">
        {/* Title */}
        <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-extrabold text-white text-editorial leading-[1.1]">
          L&apos;excellence à votre{" "}
          <br />
          <span className="text-primary-fixed-dim">porte en un clic.</span>
        </h1>

        {/* Slogan */}
        <p className="text-white font-semibold text-xl md:text-2xl max-w-2xl mx-auto">
          Le bon prestataire, au bon moment, près de chez vous.
        </p>

        {/* Search Bento */}
        <div className="glass-card p-2 rounded-[2rem] shadow-2xl flex flex-col md:flex-row items-stretch gap-2">
          {/* Service Input */}
          <div className="flex-1 flex items-center gap-3 px-6 py-4 bg-white rounded-2xl md:rounded-l-[1.8rem]">
            <Search className="text-[#004150] h-5 w-5" />
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="w-full border-none focus:ring-0 bg-transparent text-[#181c1d]">
                <SelectValue placeholder="Quel service recherchez-vous ?" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_CATEGORIES.map((service) => (
                  <SelectItem key={service.id} value={service.slug}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City Input */}
          <div className="flex-1 flex items-center gap-3 px-6 py-4 bg-white md:border-l border-gray-200 rounded-2xl md:rounded-none">
            <MapPin className="text-[#004150] h-5 w-5" />
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full border-none focus:ring-0 bg-transparent text-[#181c1d]">
                <SelectValue placeholder="Ville ou quartier (Abidjan...)" />
              </SelectTrigger>
              <SelectContent>
                {POPULAR_CITIES.slice(0, 15).map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="bg-[#fd7613] text-white px-10 py-4 rounded-2xl md:rounded-r-[1.8rem] font-bold text-lg hover:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            Trouver
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 pt-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-white">2 500+</p>
              <p className="text-sm text-white/70">Prestataires</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-white">15 000+</p>
              <p className="text-sm text-white/70">Clients satisfaits</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-white">65+</p>
              <p className="text-sm text-white/70">Villes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
