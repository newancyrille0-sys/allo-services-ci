"use client";

import Link from "next/link";
import { Star, MapPin, Calendar, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const providers = [
  {
    id: 1,
    name: "Koffi Kouadio",
    service: "Plomberie & Installations Sanitaires",
    city: "Cocody",
    rating: 4.9,
    price: "15.000",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    verified: true,
    badge: "verified",
  },
  {
    id: 2,
    name: "Awa Bakayoko",
    service: "Coiffure à Domicile & Esthétique",
    city: "Riviera",
    rating: 5.0,
    price: "10.000",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    verified: true,
    badge: "verified",
  },
  {
    id: 3,
    name: "Jean-Marc Yao",
    service: "Électricité & Domotique",
    city: "Marcory",
    rating: 4.8,
    price: "20.000",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
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
            {/* Image */}
            <div className="relative h-64 overflow-hidden rounded-[2rem] mb-6">
              <img
                src={provider.image}
                alt={provider.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
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
