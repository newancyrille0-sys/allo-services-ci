"use client";

import Link from "next/link";
import { Star, MapPin, Calendar, Shield, Zap, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const providers = [
  {
    id: 1,
    name: "Koffi Kouadio",
    initials: "KK",
    service: "Plomberie & Installations Sanitaires",
    city: "Cocody",
    rating: 4.9,
    price: "15.000",
    bgColor: "bg-gradient-to-br from-teal-500 to-teal-700",
    verified: true,
    badge: "verified",
  },
  {
    id: 2,
    name: "Awa Bakayoko",
    initials: "AB",
    service: "Coiffure à Domicile & Esthétique",
    city: "Riviera",
    rating: 5.0,
    price: "10.000",
    bgColor: "bg-gradient-to-br from-rose-500 to-rose-700",
    verified: true,
    badge: "verified",
  },
  {
    id: 3,
    name: "Jean-Marc Yao",
    initials: "JY",
    service: "Électricité & Domotique",
    city: "Marcory",
    rating: 4.8,
    price: "20.000",
    bgColor: "bg-gradient-to-br from-amber-500 to-amber-700",
    verified: true,
    badge: "urgent",
  },
];

export function FeaturedProviders() {
  return (
    <section className="max-w-screen-2xl mx-auto px-6 mt-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <span className="text-primary font-bold tracking-widest text-sm uppercase">
            Nos Élites
          </span>
          <h2 className="font-headline text-4xl font-extrabold text-editorial text-[#181c1d]">
            Prestataires Vedettes
          </h2>
        </div>
        <Link 
          href="/providers"
          className="text-primary font-bold flex items-center gap-2 hover:translate-x-2 transition-transform"
        >
          Voir tout l&apos;annuaire
          <span>→</span>
        </Link>
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="group relative bg-white rounded-[2.5rem] p-4 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
          >
            {/* Avatar */}
            <div className={`relative h-64 overflow-hidden rounded-[2rem] mb-6 ${provider.bgColor} flex items-center justify-center`}>
              <div className="flex flex-col items-center justify-center text-white">
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold">{provider.initials}</span>
                </div>
                <User className="w-16 h-16 opacity-30" />
              </div>
              {/* Badge */}
              <div className={`absolute top-4 left-4 ${provider.badge === 'urgent' ? 'bg-[#9c4400]' : 'bg-[#00460e]'} text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1`}>
                {provider.badge === 'urgent' ? (
                  <>
                    <Zap className="h-3 w-3" />
                    URGENT
                  </>
                ) : (
                  <>
                    <Shield className="h-3 w-3" />
                    VÉRIFIÉ
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="px-4 pb-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-headline text-xl font-bold text-[#181c1d]">
                  {provider.name}
                </h3>
                <div className="flex items-center gap-1 text-[#fd7613] font-bold">
                  <Star className="h-4 w-4 fill-current" />
                  {provider.rating}
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#3f484c] text-sm mb-6">
                <MapPin className="h-4 w-4" />
                {provider.service} • {provider.city}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#70787c]">À partir de</span>
                  <p className="font-bold text-lg text-primary">{provider.price} FCFA</p>
                </div>
                <Link href={`/providers/${provider.id}`}>
                  <Button className="bg-[#e5e9ea] text-[#181c1d] hover:bg-primary hover:text-white transition-all duration-300 rounded-2xl p-3">
                    <Calendar className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProviders;
