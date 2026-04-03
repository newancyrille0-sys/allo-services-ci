"use client";

import { useState } from "react";
import {
  Users,
  UserCheck,
  CalendarDays,
  Wallet,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Ban,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminStatsCard } from "@/components/admin";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Mock data for charts
const revenueData = [
  { month: "Jan", revenue: 2500000, subscriptions: 800000 },
  { month: "Fév", revenue: 3200000, subscriptions: 950000 },
  { month: "Mar", revenue: 3800000, subscriptions: 1100000 },
  { month: "Avr", revenue: 4200000, subscriptions: 1250000 },
  { month: "Mai", revenue: 4500000, subscriptions: 1400000 },
  { month: "Juin", revenue: 5200000, subscriptions: 1600000 },
];

const userGrowthData = [
  { month: "Jan", clients: 1200, providers: 150 },
  { month: "Fév", clients: 1450, providers: 190 },
  { month: "Mar", clients: 1780, providers: 240 },
  { month: "Avr", clients: 2100, providers: 310 },
  { month: "Mai", clients: 2540, providers: 380 },
  { month: "Juin", clients: 2890, providers: 450 },
];

// Mock activity feed
const recentActivity = [
  {
    id: 1,
    type: "registration",
    title: "Nouveau prestataire inscrit",
    description: "Kouassi Jean - Électricien à Abidjan",
    time: "Il y a 5 min",
    icon: UserCheck,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/20",
  },
  {
    id: 2,
    type: "reservation",
    title: "Nouvelle réservation",
    description: "Plomberie - Marc à Yao Serge",
    time: "Il y a 12 min",
    icon: CalendarDays,
    iconColor: "text-primary",
    iconBg: "bg-primary/20",
  },
  {
    id: 3,
    type: "review",
    title: "Nouvel avis publié",
    description: "5 étoiles pour Traoré Amadou",
    time: "Il y a 25 min",
    icon: Star,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/20",
  },
  {
    id: 4,
    type: "fraud",
    title: "Alerte fraude détectée",
    description: "IP suspecte - 192.168.1.45",
    time: "Il y a 35 min",
    icon: AlertTriangle,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/20",
  },
  {
    id: 5,
    type: "kyc",
    title: "KYC en attente",
    description: "Diallo Ibrahim - Documents à vérifier",
    time: "Il y a 1h",
    icon: Clock,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/20",
  },
];

const chartConfig = {
  revenue: {
    label: "Revenus",
    color: "#0066FF",
  },
  subscriptions: {
    label: "Abonnements",
    color: "#10B981",
  },
  clients: {
    label: "Clients",
    color: "#0066FF",
  },
  providers: {
    label: "Prestataires",
    color: "#F59E0B",
  },
} satisfies ChartConfig;

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
          <p className="text-gray-400 mt-1">
            Vue d&apos;ensemble de la plateforme Allo Services CI
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            Exporter le rapport
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <AdminStatsCard
          icon={Users}
          label="Total Clients"
          value={2890}
          change={{ value: 12.5, isPositive: true }}
          variant="default"
        />
        <AdminStatsCard
          icon={UserCheck}
          label="Total Prestataires"
          value={450}
          change={{ value: 8.3, isPositive: true }}
          variant="primary"
        />
        <AdminStatsCard
          icon={CheckCircle}
          label="Prestataires Actifs"
          value={312}
          change={{ value: 5.2, isPositive: true }}
          variant="success"
        />
        <AdminStatsCard
          icon={CalendarDays}
          label="Réservations ce mois"
          value={847}
          change={{ value: 15.8, isPositive: true }}
          variant="primary"
        />
        <AdminStatsCard
          icon={Wallet}
          label="Revenus Totaux"
          value="6.8M XOF"
          change={{ value: 22.4, isPositive: true }}
          variant="success"
        />
        <AdminStatsCard
          icon={CreditCard}
          label="Abonnements Actifs"
          value={285}
          change={{ value: 3.2, isPositive: true }}
          variant="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-lg">Revenus mensuels</CardTitle>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-gray-400">Réservations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-gray-400">Abonnements</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="subscriptionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `${value / 1000000}M`} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => formatPrice(value)}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0066FF"
                  fill="url(#revenueGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="subscriptions"
                  stroke="#10B981"
                  fill="url(#subscriptionsGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-lg">Croissance utilisateurs</CardTitle>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-gray-400">Clients</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-gray-400">Prestataires</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="clients" fill="#0066FF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="providers" fill="#F59E0B" radius={[4, 4, 0,0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-white text-lg">Activité récente</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              Voir tout
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-700/30 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${activity.iconBg}`}>
                    <activity.icon className={`w-4 h-4 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{activity.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{activity.description}</p>
                  </div>
                  <span className="text-gray-500 text-xs shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white h-12"
            >
              <UserCheck className="w-5 h-5 mr-3 text-emerald-400" />
              Valider un prestataire
              <Badge className="ml-auto bg-amber-500/20 text-amber-400 border-amber-500/30">5</Badge>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white h-12"
            >
              <AlertTriangle className="w-5 h-5 mr-3 text-red-400" />
              Gérer les signalements
              <Badge className="ml-auto bg-red-500/20 text-red-400 border-red-500/30">12</Badge>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white h-12"
            >
              <Wallet className="w-5 h-5 mr-3 text-primary" />
              Voir les paiements
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white h-12"
            >
              <Ban className="w-5 h-5 mr-3 text-red-400" />
              Utilisateurs bloqués
              <Badge className="ml-auto bg-gray-500/20 text-gray-400 border-gray-500/30">8</Badge>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Taux de confirmation</p>
                <p className="text-2xl font-bold text-white mt-1">94.2%</p>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span>+2.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Note moyenne</p>
                <p className="text-2xl font-bold text-white mt-1">4.7/5</p>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span>+0.2</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Taux de fraude</p>
                <p className="text-2xl font-bold text-white mt-1">0.8%</p>
              </div>
              <div className="flex items-center gap-1 text-red-400 text-sm">
                <ArrowDownRight className="w-4 h-4" />
                <span>-0.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Temps de réponse</p>
                <p className="text-2xl font-bold text-white mt-1">&lt; 2h</p>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-sm">
                <ArrowDownRight className="w-4 h-4" />
                <span>-15min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
