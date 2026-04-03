"use client";

import * as React from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  Wallet,
  Plus,
  Search,
  MessageSquare,
  ChevronRight,
  Star,
  MapPin,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ReservationCard } from "@/components/reservations/ReservationCard";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data
const MOCK_STATS = {
  totalReservations: 24,
  enCours: 2,
  terminees: 20,
  depensesTotales: 245000,
};

const MOCK_RESERVATIONS = [
  {
    id: "res-1",
    status: "CONFIRMED",
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    address: "Cocody, Rue des Jardins",
    city: "Abidjan",
    priceTotal: 25000,
    service: { name: "Plomberie" },
    provider: {
      businessName: "Plomberie Express",
      user: { fullName: "Koffi Yao" },
    },
  },
  {
    id: "res-2",
    status: "IN_PROGRESS",
    scheduledDate: new Date(Date.now() - 1000 * 60 * 30),
    address: "Marcory, Boulevard de la République",
    city: "Abidjan",
    priceTotal: 15000,
    service: { name: "Ménage" },
    provider: {
      businessName: "Ménage Pro CI",
      user: { fullName: "Aminata Diallo" },
    },
  },
  {
    id: "res-3",
    status: "PENDING",
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 48),
    address: "Plateau, Avenue Chardy",
    city: "Abidjan",
    priceTotal: 45000,
    service: { name: "Cours particuliers" },
    provider: {
      businessName: "Prof Maths Academy",
      user: { fullName: "Jean Kouassi" },
    },
  },
];

const FAVORITE_PROVIDERS = [
  {
    id: "provider-1",
    businessName: "Plomberie Express Abidjan",
    description: "Expert en plomberie et sanitaires",
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
    description: "Coiffure, manucure et maquillage à domicile",
    averageRating: 4.8,
    totalReviews: 89,
    trustScore: 92,
    subscriptionStatus: "PREMIUM" as const,
    city: "Abidjan",
    hourlyRate: 5000,
    badgeVerified: true,
    serviceCategory: "Beauté & Bien-être",
  },
];

const RECOMMENDED_PROVIDERS = [
  {
    id: "provider-3",
    businessName: "Ménage Pro CI",
    description: "Service de ménage professionnel et régulier",
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
    businessName: "Jardins Verts CI",
    description: "Entretien de jardins et aménagement paysager",
    averageRating: 4.6,
    totalReviews: 45,
    trustScore: 85,
    subscriptionStatus: "MONTHLY" as const,
    city: "Yamoussoukro",
    hourlyRate: 5500,
    badgeVerified: true,
    serviceCategory: "Jardinage & Piscine",
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

export default function ClientDashboardPage() {
  const userName = "Amadou";

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Bonjour, {userName} 👋</h1>
          <p className="text-muted-foreground">
            Bienvenue sur votre tableau de bord
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/client/reservations/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle réservation
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<CalendarDays className="h-5 w-5" />}
          label="Total réservations"
          value={MOCK_STATS.totalReservations}
          variant="default"
        />
        <StatsCard
          icon={<Clock className="h-5 w-5" />}
          label="En cours"
          value={MOCK_STATS.enCours}
          variant="primary"
        />
        <StatsCard
          icon={<CheckCircle className="h-5 w-5" />}
          label="Terminées"
          value={MOCK_STATS.terminees}
          variant="success"
        />
        <StatsCard
          icon={<Wallet className="h-5 w-5" />}
          label="Dépenses totales"
          value={formatPrice(MOCK_STATS.depensesTotales)}
          variant="warning"
        />
      </div>

      {/* Quick Actions */}
      <Card className="border-gray-200/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="h-auto py-4 justify-start"
              asChild
            >
              <Link href="/client/reservations/new">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Nouvelle réservation</p>
                    <p className="text-xs text-muted-foreground">
                      Réserver un service
                    </p>
                  </div>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 justify-start"
              asChild
            >
              <Link href="/services">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10 text-accent">
                    <Search className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Rechercher</p>
                    <p className="text-xs text-muted-foreground">
                      Trouver un prestataire
                    </p>
                  </div>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 justify-start"
              asChild
            >
              <Link href="/client/messages">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Messages</p>
                    <p className="text-xs text-muted-foreground">
                      3 non lus
                    </p>
                  </div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Reservations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Réservations récentes</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/client/reservations">
                Voir tout
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {MOCK_RESERVATIONS.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                userRole="client"
              />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Favorite Providers */}
          <Card className="border-gray-200/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Prestataires favoris</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/client/favorites">
                    Voir tout
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {FAVORITE_PROVIDERS.map((provider) => (
                <Link
                  key={provider.id}
                  href={`/providers/${provider.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {provider.businessName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {provider.businessName}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{provider.averageRating}</span>
                      <span className="mx-1">•</span>
                      <MapPin className="h-3 w-3" />
                      <span>{provider.city}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {formatPrice(provider.hourlyRate)}/h
                  </Badge>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Recommended Providers */}
          <Card className="border-gray-200/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recommandés pour vous</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {RECOMMENDED_PROVIDERS.map((provider) => (
                <Link
                  key={provider.id}
                  href={`/providers/${provider.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-accent/10 text-accent">
                      {provider.businessName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {provider.businessName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {provider.serviceCategory}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{provider.averageRating}</span>
                      <span className="mx-1">•</span>
                      <MapPin className="h-3 w-3" />
                      <span>{provider.city}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
