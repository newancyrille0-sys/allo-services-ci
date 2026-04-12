"use client";

import * as React from "react";
import Link from "next/link";
import { useState } from "react";
import {
  Calendar,
  Star,
  Wallet,
  TrendingUp,
  Clock,
  MapPin,
  Phone,
  ChevronRight,
  Bell,
  MessageCircle,
  Home,
  BarChart3,
  Settings,
  Crown,
  Lock,
  ArrowUpRight,
  Video,
  Image as ImageIcon,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

// Mock data
const STATS = {
  totalReservations: 12,
  averageRating: 4.2,
  totalEarnings: 185000,
  thisMonthEarnings: 45000,
  responseRate: 78,
  completionRate: 85,
};

const WEEKLY_PLANNING = [
  { day: "Lun", date: "12", reservations: 2, hasLive: false },
  { day: "Mar", date: "13", reservations: 1, hasLive: false },
  { day: "Mer", date: "14", reservations: 0, hasLive: false },
  { day: "Jeu", date: "15", reservations: 3, hasLive: false },
  { day: "Ven", date: "16", reservations: 1, hasLive: false },
  { day: "Sam", date: "17", reservations: 2, hasLive: false },
  { day: "Dim", date: "18", reservations: 0, hasLive: false },
];

const RECENT_RESERVATIONS = [
  {
    id: "1",
    clientName: "Amadou Koné",
    clientAvatar: "https://i.pravatar.cc/100?img=1",
    service: "Plomberie urgente",
    time: "Aujourd'hui, 14:00",
    address: "Cocody",
    price: 25000,
    status: "CONFIRMED",
  },
  {
    id: "2",
    clientName: "Fatou Diallo",
    clientAvatar: "https://i.pravatar.cc/100?img=5",
    service: "Installation sanitaire",
    time: "Demain, 09:00",
    address: "Marcory",
    price: 45000,
    status: "PENDING",
  },
];

export default function ProviderFreeDashboardPage() {
  const { user } = useAuth();

  // Compute greeting based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };
  const greeting = getGreeting();

  const businessName = user?.businessName || user?.fullName?.split(" ")[0] || "Prestataire";

  return (
    <div className="min-h-screen bg-[#f4faff]">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo & Badge */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-premium-gradient flex items-center justify-center">
                  <span className="text-white font-bold text-lg font-headline">A</span>
                </div>
              </Link>
              <Badge className="bg-slate-500 text-white gap-1.5">
                <span className="text-[10px] font-bold">NIVEAU FREE</span>
              </Badge>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#001e40] rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                  5
                </span>
              </Button>
              <Link href="/provider/messages">
                <Button variant="ghost" size="icon" className="relative">
                  <MessageCircle className="h-5 w-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#7b5800] rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                    2
                  </span>
                </Button>
              </Link>
              <Avatar className="h-9 w-9 border-2 border-slate-300">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className="bg-slate-500 text-white text-sm font-bold">
                  {businessName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Welcome Banner */}
          <div className="glass-panel rounded-2xl p-6 shadow-ambient">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#001e40] font-headline">
                  {greeting}, {businessName} !
                </h1>
                <p className="text-gray-600 mt-1">
                  Bienvenue sur votre espace prestataire. Commencez à développer votre activité !
                </p>
              </div>
              <Link href="/provider/subscription">
                <Button className="bg-gradient-to-r from-[#7b5800] to-[#a67c00] hover:from-[#7b5800] hover:to-[#a67c00] text-white gap-2">
                  <Crown className="h-4 w-4" />
                  Passer à Premium
                </Button>
              </Link>
            </div>
          </div>

          {/* Basic Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="glass-panel shadow-ambient">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="h-5 w-5 text-[#001e40]" />
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{STATS.totalReservations}</p>
                <p className="text-xs text-gray-500">Réservations</p>
              </CardContent>
            </Card>
            <Card className="glass-panel shadow-ambient">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Star className="h-5 w-5 text-[#7b5800]" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{STATS.averageRating}</p>
                <p className="text-xs text-gray-500">Note moyenne</p>
              </CardContent>
            </Card>
            <Card className="glass-panel shadow-ambient">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Wallet className="h-5 w-5 text-green-600" />
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{(STATS.thisMonthEarnings / 1000).toFixed(0)}k</p>
                <p className="text-xs text-gray-500">FCFA ce mois</p>
              </CardContent>
            </Card>
            <Card className="glass-panel shadow-ambient">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{STATS.completionRate}%</p>
                <p className="text-xs text-gray-500">Taux complétion</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Weekly Planning */}
              <Card className="glass-panel shadow-ambient">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-headline text-[#001e40]">
                      Planning de la semaine
                    </CardTitle>
                    <Link href="/provider/reservations" className="text-sm text-[#001e40] flex items-center">
                      Voir tout <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {WEEKLY_PLANNING.map((day, index) => (
                      <div
                        key={index}
                        className={cn(
                          "text-center p-3 rounded-xl transition-colors",
                          index === 0 ? "bg-[#001e40] text-white" : "bg-gray-50 hover:bg-gray-100"
                        )}
                      >
                        <p className={cn("text-xs", index === 0 ? "text-white/70" : "text-gray-500")}>
                          {day.day}
                        </p>
                        <p className="text-lg font-bold">{day.date}</p>
                        <div className="mt-2">
                          <span className={cn(
                            "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                            index === 0 ? "bg-white/20 text-white" : "bg-[#001e40]/10 text-[#001e40]"
                          )}>
                            {day.reservations}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Reservations */}
              <Card className="glass-panel shadow-ambient">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-headline text-[#001e40]">
                    Réservations récentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {RECENT_RESERVATIONS.map((reservation) => (
                      <div key={reservation.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                          <AvatarImage src={reservation.clientAvatar} />
                          <AvatarFallback className="bg-gray-200 text-gray-600">
                            {reservation.clientName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-gray-900">{reservation.clientName}</p>
                            <Badge
                              variant="outline"
                              className={cn(
                                reservation.status === "CONFIRMED"
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : "bg-amber-100 text-amber-700 border-amber-200"
                              )}
                            >
                              {reservation.status === "CONFIRMED" ? "Confirmée" : "En attente"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{reservation.service}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {reservation.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {reservation.address}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#001e40]">{(reservation.price / 1000).toFixed(0)}k</p>
                          <p className="text-xs text-gray-500">FCFA</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Balance & Withdrawals */}
              <Card className="glass-panel shadow-ambient">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-headline text-[#001e40]">
                    Solde & Retraits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#001e40] to-[#003366] rounded-xl text-white">
                    <div>
                      <p className="text-white/70 text-sm">Solde disponible</p>
                      <p className="text-3xl font-bold">{(STATS.thisMonthEarnings / 1000).toFixed(0)} 000 FCFA</p>
                    </div>
                    <Button className="bg-white text-[#001e40] hover:bg-gray-100">
                      Retirer
                    </Button>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Ce mois</p>
                      <p className="font-bold text-gray-900">{(STATS.thisMonthEarnings / 1000).toFixed(0)}k FCFA</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Total gagné</p>
                      <p className="font-bold text-gray-900">{(STATS.totalEarnings / 1000).toFixed(0)}k FCFA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Marketing Section - Locked */}
              <Card className="glass-panel shadow-ambient relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                  <Lock className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="font-semibold text-gray-600">Premium Only</p>
                  <Link href="/provider/subscription">
                    <Button size="sm" className="mt-2 bg-[#7b5800] hover:bg-[#7b5800]/80 text-white">
                      Débloquer
                    </Button>
                  </Link>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-headline text-[#001e40]">
                    Marketing & Visibilité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg opacity-50">
                    <Megaphone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Promotions</p>
                      <p className="text-xs text-gray-400">Créez des offres</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg opacity-50">
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Publications</p>
                      <p className="text-xs text-gray-400">Partagez votre travail</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg opacity-50">
                    <Video className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Live Streaming</p>
                      <p className="text-xs text-gray-400">2 lives/mois inclus</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upsell to Premium */}
              <Card className="bg-gradient-to-br from-[#7b5800] to-[#a67c00] text-white shadow-ambient">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Crown className="h-8 w-8" />
                    <div>
                      <p className="font-bold text-lg">Passez Premium</p>
                      <p className="text-sm text-white/70">15 000 FCFA/mois</p>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-4 text-sm">
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#fdc34d]" fill="#fdc34d" />
                      Badge Vérifié
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#fdc34d]" fill="#fdc34d" />
                      Statistiques avancées
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#fdc34d]" fill="#fdc34d" />
                      Live streaming illimité
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#fdc34d]" fill="#fdc34d" />
                      Support prioritaire
                    </li>
                  </ul>
                  <Link href="/provider/subscription">
                    <Button className="w-full bg-white text-[#7b5800] hover:bg-gray-100">
                      Voir les offres
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Performance Tips */}
              <Card className="glass-panel shadow-ambient">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-headline text-[#001e40]">
                    Conseils pour débuter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold shrink-0">
                        1
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Complétez votre profil</p>
                        <p className="text-xs text-gray-500">Ajoutez une photo et une description</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold shrink-0">
                        2
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Répondez rapidement</p>
                        <p className="text-xs text-gray-500">Améliorez votre taux de réponse</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                        3
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Demandez des avis</p>
                        <p className="text-xs text-gray-500">Les avis augmentent votre visibilité</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-panel border-t border-gray-100 md:hidden z-50">
        <div className="flex items-center justify-around py-2">
          <Link href="/provider" className="flex flex-col items-center gap-1 p-2 text-[#001e40]">
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-medium">Accueil</span>
          </Link>
          <Link href="/provider/reservations" className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <Calendar className="h-5 w-5" />
            <span className="text-[10px]">RDV</span>
          </Link>
          <Link href="/provider/messages" className="flex flex-col items-center gap-1 p-2 text-gray-400 relative">
            <MessageCircle className="h-5 w-5" />
            <span className="text-[10px]">Messages</span>
          </Link>
          <Link href="/provider/analytics" className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <BarChart3 className="h-5 w-5" />
            <span className="text-[10px]">Stats</span>
          </Link>
          <Link href="/provider/settings" className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <Settings className="h-5 w-5" />
            <span className="text-[10px]">Paramètres</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
