"use client";

import * as React from "react";
import Link from "next/link";
import { MapPin, Star, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SubscriptionBadge } from "./SubscriptionBadge";
import { TrustScore } from "./TrustScore";

export interface ProviderCardProps {
  provider: {
    id: string;
    businessName: string;
    description?: string;
    avatarUrl?: string;
    averageRating: number;
    totalReviews: number;
    trustScore: number;
    subscriptionStatus: "FREE" | "MONTHLY" | "PREMIUM";
    city?: string;
    hourlyRate?: number;
    badgeVerified: boolean;
  };
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-CI", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function renderStars(rating: number): React.ReactNode {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star
          key={i}
          className="h-4 w-4 fill-amber-400 text-amber-400"
        />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <Star className="h-4 w-4 text-amber-400" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star key={i} className="h-4 w-4 text-gray-300" />
      );
    }
  }
  return stars;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const {
    id,
    businessName,
    description,
    avatarUrl,
    averageRating,
    totalReviews,
    trustScore,
    subscriptionStatus,
    city,
    hourlyRate,
    badgeVerified,
  } = provider;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10",
        "border border-gray-200/50 hover:border-primary/20"
      )}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Header with Avatar and Badges */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
                  <AvatarImage src={avatarUrl} alt={businessName} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getInitials(businessName)}
                  </AvatarFallback>
                </Avatar>
                {badgeVerified && (
                  <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 rounded-full p-0.5 border-2 border-background">
                    <BadgeCheck className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
                  {businessName}
                </h3>
                {city && (
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="line-clamp-1">{city}</span>
                  </div>
                )}
              </div>
            </div>
            <SubscriptionBadge
              status={subscriptionStatus}
              size="sm"
              showGlow={subscriptionStatus === "PREMIUM"}
            />
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">{renderStars(averageRating)}</div>
            <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              ({totalReviews} avis)
            </span>
          </div>

          {/* Trust Score */}
          <TrustScore score={trustScore} size="sm" />

          {/* Footer with Price and Action */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
            {hourlyRate ? (
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">À partir de</span>
                <span className="font-semibold text-primary">
                  {formatPrice(hourlyRate)}/h
                </span>
              </div>
            ) : (
              <div />
            )}
            <Button variant="default" size="sm" asChild>
              <Link href={`/providers/${id}`}>Voir profil</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
