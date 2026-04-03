"use client";

import * as React from "react";
import Link from "next/link";
import {
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  MapPin,
  Download,
  Crown,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ViewsChart,
  RevenueChart,
  ReservationsChart,
  ServicesPieChart,
  AnalyticsStatCard,
} from "@/components/analytics/Charts";
import { formatPrice } from "@/lib/utils/formatters";
import { SUBSCRIPTION_PLANS } from "@/lib/constants/subscription";

// Mock data
const MOCK_SUBSCRIPTION = {
  plan: "MONTHLY" as const,
};

// Views data
const VIEWS_DATA = [
  { date: "01 Jan", views: 45 },
  { date: "02 Jan", views: 52 },
  { date: "03 Jan", views: 38 },
  { date: "04 Jan", views: 65 },
  { date: "05 Jan", views: 78 },
  { date: "06 Jan", views: 82 },
  { date: "07 Jan", views: 56 },
  { date: "08 Jan", views: 71 },
  { date: "09 Jan", views: 89 },
  { date: "10 Jan", views: 95 },
  { date: "11 Jan", views: 102 },
  { date: "12 Jan", views: 88 },
  { date: "13 Jan", views: 76 },
  { date: "14 Jan", views: 91 },
];

// Revenue data
const REVENUE_DATA = [
  { date: "Jan", revenue: 245000 },
  { date: "Fév", revenue: 312000 },
  { date: "Mar", revenue: 285000 },
  { date: "Avr", revenue: 398000 },
  { date: "Mai", revenue: 425000 },
  { date: "Juin", revenue: 387000 },
];

// Reservations data
const RESERVATIONS_DATA = [
  { date: "01 Jan", reservations: 5, completed: 4 },
  { date: "02 Jan", reservations: 7, completed: 6 },
  { date: "03 Jan", reservations: 4, completed: 4 },
  { date: "04 Jan", reservations: 8, completed: 7 },
  { date: "05 Jan", reservations: 6, completed: 5 },
  { date: "06 Jan", reservations: 9, completed: 8 },
  { date: "07 Jan", reservations: 5, completed: 4 },
  { date: "08 Jan", reservations: 7, completed: 6 },
  { date: "09 Jan", reservations: 10, completed: 9 },
  { date: "10 Jan", reservations: 8, completed: 7 },
  { date: "11 Jan", reservations: 6, completed: 5 },
  { date: "12 Jan", reservations: 7, completed: 6 },
];

// Services distribution
const SERVICES_DISTRIBUTION = [
  { name: "Plomberie", value: 45 },
  { name: "Électricité", value: 32 },
  { name: "Climatisation", value: 18 },
  { name: "Serrurerie", value: 12 },
  { name: "Autres", value: 8 },
];

// Top services
const TOP_SERVICES = [
  { name: "Plomberie", reservations: 45, revenue: 425000, avgRating: 4.9 },
  { name: "Électricité", reservations: 32, revenue: 312000, avgRating: 4.8 },
  { name: "Climatisation", reservations: 18, revenue: 285000, avgRating: 4.7 },
  { name: "Serrurerie", reservations: 12, revenue: 156000, avgRating: 4.6 },
];

// Top cities
const TOP_CITIES = [
  { name: "Cocody", reservations: 42, percentage: 35 },
  { name: "Marcory", reservations: 28, percentage: 23 },
  { name: "Plateau", reservations: 24, percentage: 20 },
  { name: "Yopougon", reservations: 15, percentage: 12 },
  { name: "Autres", reservations: 12, percentage: 10 },
];

// Client demographics
const CLIENT_DEMOGRAPHICS = [
  { segment: "Nouveaux clients", count: 45, percentage: 35 },
  { segment: "Clients réguliers", count: 68, percentage: 52 },
  { segment: "Clients VIP (5+ réservations)", count: 17, percentage: 13 },
];

// Analytics access based on subscription
const ANALYTICS_ACCESS = {
  FREE: {
    hasBasicStats: true,
    hasCharts: false,
    hasExport: false,
    hasAdvancedMetrics: false,
  },
  MONTHLY: {
    hasBasicStats: true,
    hasCharts: true,
    hasExport: false,
    hasAdvancedMetrics: false,
  },
  PREMIUM: {
    hasBasicStats: true,
    hasCharts: true,
    hasExport: true,
    hasAdvancedMetrics: true,
  },
};

export default function ProviderAnalyticsPage() {
  const subscriptionPlan = MOCK_SUBSCRIPTION.plan;
  const access = ANALYTICS_ACCESS[subscriptionPlan];
  const isPremium = subscriptionPlan === "PREMIUM";

  const handleExport = () => {
    console.log("Exporting analytics report...");
    // TODO: Implement PDF/Excel export
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Analysez les performances de votre activité
          </p>
        </div>
        {isPremium ? (
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter le rapport
          </Button>
        ) : (
          <Button variant="outline" asChild>
            <Link href="/provider/subscription">
              <Crown className="h-4 w-4 mr-2" />
              Débloquer l'export
            </Link>
          </Button>
        )}
      </div>

      {/* Subscription Notice for FREE users */}
      {subscriptionPlan === "FREE" && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  Accédez à des analytics complets
                </p>
                <p className="text-sm text-muted-foreground">
                  Passez à un plan payant pour débloquer les graphiques, métriques avancées et l'export de rapports.
                </p>
              </div>
              <Button asChild>
                <Link href="/provider/subscription">
                  Voir les plans
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnalyticsStatCard
          title="Vues ce mois"
          value="1,234"
          change={{ value: 12, isPositive: true }}
          icon={<Eye className="h-5 w-5" />}
          color="primary"
        />
        <AnalyticsStatCard
          title="Réservations"
          value="156"
          change={{ value: 8, isPositive: true }}
          icon={<Calendar className="h-5 w-5" />}
          color="success"
        />
        <AnalyticsStatCard
          title="Revenus"
          value={formatPrice(425000)}
          change={{ value: 15, isPositive: true }}
          icon={<DollarSign className="h-5 w-5" />}
          color="warning"
        />
        <AnalyticsStatCard
          title="Taux de conversion"
          value="18.2%"
          change={{ value: 3, isPositive: true }}
          icon={<TrendingUp className="h-5 w-5" />}
          color="primary"
        />
      </div>

      {access.hasCharts ? (
        <>
          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            <ViewsChart data={VIEWS_DATA} />
            <RevenueChart data={REVENUE_DATA} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <ReservationsChart data={RESERVATIONS_DATA} />
            <ServicesPieChart data={SERVICES_DISTRIBUTION} />
          </div>

          {/* Top Services & Cities */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Services */}
            <Card className="border-gray-200/50">
              <CardHeader>
                <CardTitle className="text-base">Top services</CardTitle>
                <CardDescription>
                  Vos services les plus performants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead className="text-right">Réservations</TableHead>
                      <TableHead className="text-right">Revenus</TableHead>
                      <TableHead className="text-right">Note</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TOP_SERVICES.map((service) => (
                      <TableRow key={service.name}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell className="text-right">{service.reservations}</TableCell>
                        <TableCell className="text-right">{formatPrice(service.revenue)}</TableCell>
                        <TableCell className="text-right">
                          <span className="flex items-center justify-end gap-1">
                            {service.avgRating}
                            <svg className="h-3 w-3 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Top Cities */}
            <Card className="border-gray-200/50">
              <CardHeader>
                <CardTitle className="text-base">Top villes</CardTitle>
                <CardDescription>
                  Répartition géographique de vos clients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {TOP_CITIES.map((city) => (
                  <div key={city.name} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 flex-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{city.name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <Progress value={city.percentage} className="h-2 flex-1" />
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {city.percentage}%
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground w-20 text-right">
                      {city.reservations} rés.
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Client Demographics */}
          {access.hasAdvancedMetrics && (
            <Card className="border-gray-200/50">
              <CardHeader>
                <CardTitle className="text-base">Démographie des clients</CardTitle>
                <CardDescription>
                  Types de clients que vous servez
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {CLIENT_DEMOGRAPHICS.map((segment) => (
                    <div
                      key={segment.segment}
                      className="p-4 rounded-lg bg-muted/50 text-center"
                    >
                      <p className="text-2xl font-bold">{segment.count}</p>
                      <p className="text-sm text-muted-foreground">{segment.segment}</p>
                      <Badge variant="outline" className="mt-2">
                        {segment.percentage}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        // Basic Stats for FREE users
        <div className="space-y-6">
          <Card className="border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-base">Statistiques de base</CardTitle>
              <CardDescription>
                Passez à un plan payant pour accéder aux graphiques et analytics avancés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Total réservations</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Total revenus</p>
                  <p className="text-2xl font-bold">{formatPrice(425000)}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Note moyenne</p>
                  <p className="text-2xl font-bold">4.8/5</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Avis reçus</p>
                  <p className="text-2xl font-bold">127</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200/50">
            <CardContent className="p-8 text-center">
              <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg mb-2">Analytics avancés</h3>
              <p className="text-muted-foreground mb-4">
                Débloquez les graphiques, métriques avancées et l'export de rapports avec un plan payant.
              </p>
              <Button asChild>
                <Link href="/provider/subscription">
                  <Crown className="h-4 w-4 mr-2" />
                  Voir les plans
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
