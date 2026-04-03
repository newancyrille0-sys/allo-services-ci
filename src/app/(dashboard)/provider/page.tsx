"use client";

import * as React from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  Wallet,
  Star,
  Eye,
  MessageSquare,
  TrendingUp,
  ChevronRight,
  AlertTriangle,
  Crown,
  Wrench,
  MapPin,
  Phone,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  formatPrice,
  formatDate,
  formatTime,
  getRelativeTime,
} from "@/lib/utils/formatters";

// Mock data for provider dashboard
const MOCK_PROVIDER = {
  id: "provider-1",
  businessName: "Plomberie Express",
  subscription: {
    plan: "MONTHLY" as const,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10 days from now
  },
};

const MOCK_STATS = {
  totalReservations: 156,
  monthlyReservations: 23,
  monthlyRevenue: 425000,
  averageRating: 4.8,
  newReviews: 5,
  profileViews: 312,
};

const MOCK_RESERVATIONS = [
  {
    id: "res-1",
    status: "PENDING",
    clientName: "Amadou Koné",
    clientPhone: "+225 07 08 09 10 11",
    serviceName: "Plomberie",
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    scheduledTime: "09:00",
    address: "Cocody, Rue des Jardins",
    city: "Abidjan",
    priceTotal: 25000,
    notes: "Fuite d'eau dans la cuisine",
  },
  {
    id: "res-2",
    status: "CONFIRMED",
    clientName: "Fatou Diallo",
    clientPhone: "+225 05 06 07 08 09",
    serviceName: "Installation sanitaire",
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 48),
    scheduledTime: "14:00",
    address: "Marcory, Boulevard de la République",
    city: "Abidjan",
    priceTotal: 75000,
    notes: "Installation d'un nouveau WC",
  },
  {
    id: "res-3",
    status: "IN_PROGRESS",
    clientName: "Jean Kouassi",
    clientPhone: "+225 01 02 03 04 05",
    serviceName: "Dépannage urgence",
    scheduledDate: new Date(Date.now() - 1000 * 60 * 30),
    scheduledTime: "10:00",
    address: "Plateau, Avenue Chardy",
    city: "Abidjan",
    priceTotal: 45000,
    notes: "Canalisation bouchée - urgence",
  },
  {
    id: "res-4",
    status: "COMPLETED",
    clientName: "Awa Sanogo",
    clientPhone: "+225 03 04 05 06 07",
    serviceName: "Plomberie",
    scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    scheduledTime: "16:00",
    address: "Yopougon, Quartier résidentiel",
    city: "Abidjan",
    priceTotal: 35000,
    notes: "Remplacement robinetterie",
  },
  {
    id: "res-5",
    status: "COMPLETED",
    clientName: "Moussa Traoré",
    clientPhone: "+225 09 10 11 12 13",
    serviceName: "Installation",
    scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    scheduledTime: "11:00",
    address: "Treichville, Rue du Commerce",
    city: "Abidjan",
    priceTotal: 120000,
    notes: "Installation complète salle de bain",
  },
];

const MOCK_REVIEWS = [
  {
    id: "review-1",
    clientName: "Awa Sanogo",
    rating: 5,
    comment: "Excellent travail ! Très professionnel et ponctuel. Je recommande vivement.",
    serviceName: "Plomberie",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    responded: false,
  },
  {
    id: "review-2",
    clientName: "Moussa Traoré",
    rating: 5,
    comment: "Travail impeccable, prix honnête. Le plombier a pris le temps d'expliquer ce qu'il faisait.",
    serviceName: "Installation",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    responded: true,
  },
  {
    id: "review-3",
    clientName: "Koffi Yao",
    rating: 4,
    comment: "Bon service dans l'ensemble. Un peu de retard mais travail soigné.",
    serviceName: "Dépannage",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    responded: true,
  },
];

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  PENDING: { color: "bg-amber-500", label: "En attente" },
  CONFIRMED: { color: "bg-primary", label: "Confirmée" },
  IN_PROGRESS: { color: "bg-emerald-500", label: "En cours" },
  COMPLETED: { color: "bg-gray-500", label: "Terminée" },
  CANCELLED: { color: "bg-red-500", label: "Annulée" },
};

// Calculate days until subscription expires
function getDaysUntilExpiration(expiresAt: Date): number {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function ProviderDashboardPage() {
  const businessName = MOCK_PROVIDER.businessName;
  const daysUntilExpiration = getDaysUntilExpiration(MOCK_PROVIDER.subscription.expiresAt);
  const isExpiringSoon = daysUntilExpiration <= 5;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Bonjour, {businessName} 👋</h1>
          <p className="text-muted-foreground">
            Bienvenue sur votre tableau de bord prestataire
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/provider/services">
              <Wrench className="h-4 w-4 mr-2" />
              Mes services
            </Link>
          </Button>
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <Link href="/provider/reservations">
              <CalendarDays className="h-4 w-4 mr-2" />
              Gérer les réservations
            </Link>
          </Button>
        </div>
      </div>

      {/* Subscription Warning Banner */}
      {isExpiringSoon && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-amber-800">
                  Votre abonnement expire dans {daysUntilExpiration} jour{daysUntilExpiration > 1 ? "s" : ""}
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Renouvelez votre abonnement pour continuer à recevoir des réservations et bénéficier de tous les avantages.
                </p>
              </div>
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700" asChild>
                <Link href="/provider/subscription">
                  Renouveler
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard
          icon={<CalendarDays className="h-5 w-5" />}
          label="Total réservations"
          value={MOCK_STATS.totalReservations}
          variant="default"
        />
        <StatsCard
          icon={<Clock className="h-5 w-5" />}
          label="Ce mois"
          value={MOCK_STATS.monthlyReservations}
          variant="primary"
        />
        <StatsCard
          icon={<Wallet className="h-5 w-5" />}
          label="Revenus du mois"
          value={formatPrice(MOCK_STATS.monthlyRevenue)}
          variant="success"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          icon={<Star className="h-5 w-5" />}
          label="Note moyenne"
          value={MOCK_STATS.averageRating.toFixed(1)}
          variant="warning"
        />
        <StatsCard
          icon={<MessageSquare className="h-5 w-5" />}
          label="Nouveaux avis"
          value={MOCK_STATS.newReviews}
          variant="primary"
        />
        <StatsCard
          icon={<Eye className="h-5 w-5" />}
          label="Vues du profil"
          value={MOCK_STATS.profileViews}
          variant="default"
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Quick Actions */}
      <Card className="border-gray-200/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-auto py-4 justify-start"
              asChild
            >
              <Link href="/provider/services">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Mes services</p>
                    <p className="text-xs text-muted-foreground">
                      Gérer vos services
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
              <Link href="/provider/reservations">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10 text-accent">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Réservations</p>
                    <p className="text-xs text-muted-foreground">
                      Gérer les demandes
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
              <Link href="/provider/reviews">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                    <Star className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Avis clients</p>
                    <p className="text-xs text-muted-foreground">
                      Répondre aux avis
                    </p>
                  </div>
                </div>
              </Link>
            </Button>
            {MOCK_PROVIDER.subscription.plan !== "PREMIUM" && (
              <Button
                variant="outline"
                className="h-auto py-4 justify-start"
                asChild
              >
                <Link href="/provider/subscription">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-400 text-white">
                      <Crown className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Upgrade</p>
                      <p className="text-xs text-muted-foreground">
                        Passer à Premium
                      </p>
                    </div>
                  </div>
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <Card className="border-gray-200/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Réservations récentes</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/provider/reservations">
                  Voir tout
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {MOCK_RESERVATIONS.slice(0, 5).map((reservation) => (
                <Link
                  key={reservation.id}
                  href={`/provider/reservations/${reservation.id}`}
                  className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${STATUS_CONFIG[reservation.status].color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">
                        {reservation.clientName}
                      </p>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {reservation.serviceName}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(reservation.scheduledDate)}</span>
                      <span>•</span>
                      <span>{reservation.scheduledTime}</span>
                      <span>•</span>
                      <span>{formatPrice(reservation.priceTotal)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{reservation.address}</span>
                    </div>
                  </div>
                  <Badge
                    variant={reservation.status === "PENDING" ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {STATUS_CONFIG[reservation.status].label}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card className="border-gray-200/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Avis récents</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/provider/reviews">
                  Voir tout
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {MOCK_REVIEWS.map((review) => (
                <div key={review.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {review.clientName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{review.clientName}</p>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {review.comment}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {review.serviceName}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {getRelativeTime(review.createdAt)}
                        </span>
                        {!review.responded && (
                          <Badge className="text-xs bg-amber-500">
                            À répondre
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Reservations Alert */}
      {MOCK_RESERVATIONS.filter((r) => r.status === "PENDING").length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {MOCK_RESERVATIONS.filter((r) => r.status === "PENDING").length} réservation(s) en attente
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Répondez rapidement aux demandes de vos clients
                  </p>
                </div>
              </div>
              <Button asChild>
                <Link href="/provider/reservations?status=PENDING">
                  Voir les demandes
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
