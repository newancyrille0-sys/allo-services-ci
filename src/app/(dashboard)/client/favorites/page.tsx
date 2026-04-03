"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, Star, MapPin, Calendar, Trash2, Loader2 } from "lucide-react";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock favorite providers
const MOCK_FAVORITES = [
  {
    id: "provider-1",
    businessName: "Plomberie Express Abidjan",
    description: "Expert en plomberie et sanitaires. Intervention rapide 7j/7 sur Abidjan et environs.",
    averageRating: 4.9,
    totalReviews: 127,
    trustScore: 95,
    subscriptionStatus: "PREMIUM" as const,
    city: "Abidjan",
    hourlyRate: 8000,
    badgeVerified: true,
    serviceCategory: "Bricolage & Réparations",
  },
  {
    id: "provider-2",
    businessName: "Beauty Home Services",
    description: "Coiffure, manucure et maquillage à domicile. Nous venons chez vous pour sublimer votre beauté.",
    averageRating: 4.8,
    totalReviews: 89,
    trustScore: 92,
    subscriptionStatus: "PREMIUM" as const,
    city: "Abidjan",
    hourlyRate: 5000,
    badgeVerified: true,
    serviceCategory: "Beauté & Bien-être",
  },
  {
    id: "provider-3",
    businessName: "Ménage Pro CI",
    description: "Service de ménage professionnel et régulier. Grand nettoyage, repassage, organisation.",
    averageRating: 4.7,
    totalReviews: 156,
    trustScore: 88,
    subscriptionStatus: "MONTHLY" as const,
    city: "Abidjan",
    hourlyRate: 4000,
    badgeVerified: true,
    serviceCategory: "Ménage & Nettoyage",
  },
  {
    id: "provider-4",
    businessName: "Prof Maths Academy",
    description: "Cours particuliers de mathématiques et physique. Collège, lycée et université. Résultats garantis.",
    averageRating: 4.9,
    totalReviews: 68,
    trustScore: 91,
    subscriptionStatus: "MONTHLY" as const,
    city: "Bouaké",
    hourlyRate: 6000,
    badgeVerified: true,
    serviceCategory: "Cours & Formations",
  },
];

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-CI", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = React.useState(MOCK_FAVORITES);
  const [removingId, setRemovingId] = React.useState<string | null>(null);

  const handleRemove = async (providerId: string) => {
    setRemovingId(providerId);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setFavorites((prev) => prev.filter((p) => p.id !== providerId));
    setRemovingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Mes favoris</h1>
        <p className="text-muted-foreground">
          {favorites.length} prestataire{favorites.length > 1 ? "s" : ""} sauvegardé{favorites.length > 1 ? "s" : ""}
        </p>
      </div>

      {favorites.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-lg">Aucun favori</h3>
            <p className="text-muted-foreground text-center mt-1 mb-4">
              Vous n'avez pas encore sauvegardé de prestataires
            </p>
            <Button asChild>
              <Link href="/services">
                Découvrir des prestataires
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((provider) => (
            <Card
              key={provider.id}
              className="border-gray-200/50 hover:border-primary/20 transition-all"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {provider.businessName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{provider.businessName}</h3>
                      {provider.badgeVerified && (
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          Vérifié
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {provider.serviceCategory}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {provider.description}
                </p>

                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{provider.averageRating}</span>
                    <span className="text-muted-foreground">({provider.totalReviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{provider.city}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-primary font-semibold">
                    {formatPrice(provider.hourlyRate)}/h
                  </span>
                  <Badge
                    variant={
                      provider.subscriptionStatus === "PREMIUM"
                        ? "default"
                        : provider.subscriptionStatus === "MONTHLY"
                        ? "secondary"
                        : "outline"
                    }
                    className={
                      provider.subscriptionStatus === "PREMIUM"
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white"
                        : ""
                    }
                  >
                    {provider.subscriptionStatus === "PREMIUM"
                      ? "Premium"
                      : provider.subscriptionStatus === "MONTHLY"
                      ? "Standard"
                      : "Gratuit"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/client/reservations/new?provider=${provider.id}`}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Réserver
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemove(provider.id)}
                    disabled={removingId === provider.id}
                  >
                    {removingId === provider.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
