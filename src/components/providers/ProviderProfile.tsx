"use client";

import * as React from "react";
import Link from "next/link";
import {
  MapPin,
  Star,
  BadgeCheck,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  Users,
  Award,
  ChevronRight,
  Map,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SubscriptionBadge } from "./SubscriptionBadge";
import { TrustScore } from "./TrustScore";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { Skeleton } from "@/components/ui/skeleton";

export interface ProviderProfileData {
  id: string;
  businessName: string;
  description?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  averageRating: number;
  totalReviews: number;
  trustScore: number;
  subscriptionStatus: "FREE" | "MONTHLY" | "PREMIUM";
  city: string;
  address?: string;
  phone?: string;
  email?: string;
  badgeVerified: boolean;
  hourlyRate?: number;
  services: {
    id: string;
    name: string;
    category: string;
    price?: number;
  }[];
  stats: {
    totalReservations: number;
    totalReviews: number;
    averageRating: number;
    responseTime: string;
  };
  memberSince: Date;
  reviews: {
    id: string;
    rating: number;
    comment?: string;
    createdAt: Date;
    client: {
      fullName: string;
      avatarUrl?: string;
    };
  }[];
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ProviderProfileProps {
  provider: ProviderProfileData;
  isLoading?: boolean;
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-CI", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function renderStars(rating: number): React.ReactNode {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      );
    } else {
      stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
    }
  }
  return stars;
}

export function ProviderProfile({ provider, isLoading = false }: ProviderProfileProps) {
  if (isLoading) {
    return <ProviderProfileSkeleton />;
  }

  const totalReviewsForBreakdown =
    provider.ratingBreakdown[5] +
    provider.ratingBreakdown[4] +
    provider.ratingBreakdown[3] +
    provider.ratingBreakdown[2] +
    provider.ratingBreakdown[1];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 md:h-48 bg-gradient-to-r from-primary/20 to-primary/5 relative">
          {provider.coverImageUrl && (
            <img
              src={provider.coverImageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <CardContent className="relative pt-0">
          {/* Avatar */}
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 md:-mt-16">
            <div className="relative">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-lg">
                <AvatarImage src={provider.avatarUrl} alt={provider.businessName} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {getInitials(provider.businessName)}
                </AvatarFallback>
              </Avatar>
              {provider.badgeVerified && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-white">
                  <BadgeCheck className="h-5 w-5 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 pb-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-secondary">
                  {provider.businessName}
                </h1>
                <SubscriptionBadge
                  status={provider.subscriptionStatus}
                  size="md"
                  showGlow={provider.subscriptionStatus === "PREMIUM"}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{provider.city}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex">{renderStars(Math.round(provider.averageRating))}</div>
                  <span className="font-medium text-secondary">
                    {provider.averageRating.toFixed(1)}
                  </span>
                  <span>({provider.totalReviews} avis)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Membre depuis {formatDate(provider.memberSince)}</span>
                </div>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="flex gap-2 pb-2">
              {provider.phone && (
                <Button variant="outline" asChild>
                  <a href={`tel:${provider.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </a>
                </Button>
              )}
              <Button>
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
            </div>
          </div>

          {/* Trust Score */}
          <div className="mt-4 pt-4 border-t">
            <TrustScore score={provider.trustScore} size="md" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">À propos</CardTitle>
            </CardHeader>
            <CardContent>
              {provider.description ? (
                <p className="text-muted-foreground leading-relaxed">
                  {provider.description}
                </p>
              ) : (
                <p className="text-muted-foreground italic">
                  Aucune description disponible.
                </p>
              )}

              {provider.hourlyRate && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Tarif horaire:</span>
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(provider.hourlyRate)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold text-secondary">
                    {provider.stats.totalReservations}
                  </p>
                  <p className="text-sm text-muted-foreground">Réservations</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold text-secondary">
                    {provider.stats.totalReviews}
                  </p>
                  <p className="text-sm text-muted-foreground">Avis clients</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Star className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold text-secondary">
                    {provider.stats.averageRating.toFixed(1)}
                  </p>
                  <p className="text-sm text-muted-foreground">Note moyenne</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold text-secondary">
                    {provider.stats.responseTime}
                  </p>
                  <p className="text-sm text-muted-foreground">Temps de réponse</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Services proposés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {provider.services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {service.category}
                        </p>
                      </div>
                    </div>
                    {service.price && (
                      <Badge variant="secondary">{formatPrice(service.price)}</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Avis clients</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Rating Breakdown */}
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                {/* Average Rating */}
                <div className="text-center md:text-left">
                  <p className="text-5xl font-bold text-secondary">
                    {provider.averageRating.toFixed(1)}
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
                    {renderStars(Math.round(provider.averageRating))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {provider.totalReviews} avis
                  </p>
                </div>

                {/* Rating Bars */}
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = provider.ratingBreakdown[stars as keyof typeof provider.ratingBreakdown];
                    const percentage = totalReviewsForBreakdown > 0
                      ? (count / totalReviewsForBreakdown) * 100
                      : 0;
                    return (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="text-sm w-8">{stars} ★</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Review List */}
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {provider.reviews.length > 0 ? (
                  provider.reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Aucun avis pour le moment.
                  </p>
                )}
              </div>

              {provider.reviews.length > 3 && (
                <Button variant="outline" className="w-full mt-4">
                  Voir plus d&apos;avis
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* CTA Card */}
          <Card className="sticky top-24">
            <CardContent className="pt-6">
              <Button className="w-full" size="lg" asChild>
                <Link href={`/reservation/${provider.id}`}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Réserver ce prestataire
                </Link>
              </Button>

              {provider.hourlyRate && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  À partir de {formatPrice(provider.hourlyRate)}/heure
                </p>
              )}
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Localisation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Map Placeholder */}
              <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <Map className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Carte</p>
                </div>
              </div>

              <p className="font-medium">{provider.city}</p>
              {provider.address && (
                <p className="text-sm text-muted-foreground">{provider.address}</p>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          {(provider.phone || provider.email) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {provider.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${provider.phone}`}
                      className="text-primary hover:underline"
                    >
                      {provider.phone}
                    </a>
                  </div>
                )}
                {provider.email && (
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${provider.email}`}
                      className="text-primary hover:underline"
                    >
                      {provider.email}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProviderProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <Skeleton className="h-32 md:h-48 w-full" />
        <CardContent className="relative pt-0">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 md:-mt-16">
            <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white" />
            <div className="flex-1 space-y-2 pb-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
