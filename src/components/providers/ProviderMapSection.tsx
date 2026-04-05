"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, BadgeCheck, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Provider {
  id: string;
  name: string;
  service: string;
  city: string;
  rating: number;
  reviewCount: number;
  image: string;
  isVerified: boolean;
  isPremium: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export function ProviderMapSection() {
  const [providers, setProviders] = React.useState<Provider[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedCity, setSelectedCity] = React.useState<string | null>(null);

  // Fetch providers
  React.useEffect(() => {
    const fetchProviders = async () => {
      try {
        const url = selectedCity 
          ? `/api/providers/map?city=${encodeURIComponent(selectedCity)}`
          : "/api/providers/map";
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setProviders(data.providers);
        }
      } catch (error) {
        console.error("Error fetching providers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, [selectedCity]);

  return (
    <section className="container mx-auto px-4 pb-16 lg:px-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <Badge className="bg-[#fd7613]/10 text-[#fd7613] text-xs uppercase tracking-widest mb-2">
            Localisation
          </Badge>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Trouvez un pro près de vous
          </h2>
          <p className="text-muted-foreground mt-2">
            Des prestataires vérifiés dans toute la Côte d&apos;Ivoire
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map - Google Maps Embed centré sur la Côte d'Ivoire */}
        <div className="lg:col-span-2 rounded-2xl border border-border/50 overflow-hidden bg-muted">
          <iframe
            title="Carte des prestataires Allo Services CI"
            width="100%"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=5.35,-3.98&zoom=11&maptype=roadmap`}
            allowFullScreen
            className="w-full"
          />
        </div>

        {/* Liste latérale des prestataires */}
        <div className="space-y-3">
          {/* Filtres par ville */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCity(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                !selectedCity
                  ? "bg-primary text-white"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              }`}
            >
              Tous
            </button>
            {["Cocody", "Plateau", "Marcory", "Yopougon", "Bingerville"].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCity === city
                    ? "bg-primary text-white"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Liste des prestataires */}
          <ScrollArea className="h-[380px] pr-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : providers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucun prestataire trouvé</p>
              </div>
            ) : (
              <div className="space-y-3">
                {providers.map((provider) => (
                  <Link key={provider.id} href={`/providers/${provider.id}`}>
                    <Card className="overflow-hidden border-border/50 hover:shadow-lg transition-all cursor-pointer group">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="relative">
                            <div className="h-12 w-12 rounded-xl overflow-hidden bg-muted">
                              <Image
                                src={provider.image}
                                alt={provider.name}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full group-hover:scale-110 transition-transform"
                              />
                            </div>
                            {provider.isVerified && (
                              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5">
                                <BadgeCheck className="h-3 w-3" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold truncate">{provider.name}</p>
                              {provider.isPremium && (
                                <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-[9px] px-1.5 py-0">
                                  PRO
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{provider.service}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" /> {provider.city}
                              </span>
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="text-right shrink-0">
                            <div className="flex items-center gap-0.5 text-xs">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span className="font-semibold">{provider.rating}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {provider.reviewCount} avis
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </section>
  );
}

export default ProviderMapSection;
