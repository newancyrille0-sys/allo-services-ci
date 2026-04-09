"use client";

import * as React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Calendar,
  TrendingUp,
  Wallet,
  Star,
  Eye,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Settings,
  Bell,
  Video,
  Image as ImageIcon,
  Crown,
  MapPin,
  Phone,
  ArrowUpRight,
  BarChart3,
  Award,
  Target,
  Search,
  Heart,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { FeedPage } from "@/components/feed";
import { cn } from "@/lib/utils";

// Subscription tier colors
const TIER_COLORS: Record<string, { bg: string; border: string; badge: string; gradient: string }> = {
  STARTER: {
    bg: "from-slate-600 to-slate-700",
    border: "border-slate-400",
    badge: "bg-slate-500",
    gradient: "from-slate-500/20 to-slate-600/20",
  },
  STANDARD: {
    bg: "from-emerald-500 to-teal-600",
    border: "border-emerald-400",
    badge: "bg-emerald-500",
    gradient: "from-emerald-500/20 to-teal-600/20",
  },
  PREMIUM: {
    bg: "from-amber-400 to-yellow-500",
    border: "border-amber-300",
    badge: "bg-gradient-to-r from-amber-400 to-yellow-500",
    gradient: "from-amber-400/20 to-yellow-500/20",
  },
};

// Mock data
const STATS = {
  todayReservations: 3,
  weeklyRevenue: 125000,
  monthlyRevenue: 425000,
  totalClients: 156,
  averageRating: 4.8,
  totalReviews: 89,
  profileViews: 312,
  responseRate: 95,
};

const TODAY_RESERVATIONS = [
  {
    id: "1",
    clientName: "Amadou Koné",
    clientPhone: "+225 07 08 09 10 11",
    clientAvatar: "https://i.pravatar.cc/100?img=1",
    service: "Plomberie urgente",
    time: "09:00",
    duration: "2h",
    address: "Cocody, Rue des Jardins",
    price: 25000,
    status: "IN_PROGRESS",
    statusLabel: "En cours",
  },
  {
    id: "2",
    clientName: "Fatou Diallo",
    clientPhone: "+225 05 06 07 08 09",
    clientAvatar: "https://i.pravatar.cc/100?img=5",
    service: "Installation sanitaire",
    time: "14:00",
    duration: "3h",
    address: "Marcory, Boulevard de la République",
    price: 45000,
    status: "CONFIRMED",
    statusLabel: "Confirmée",
  },
];

const PENDING_REQUESTS = [
  {
    id: "1",
    clientName: "Awa Sanogo",
    service: "Fuite d'eau",
    date: "Demain, 10:00",
    address: "Yopougon",
    price: 35000,
  },
];

export default function ProviderHomePage() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Bonjour");
  const [activeTab, setActiveTab] = useState<"feed" | "dashboard">("feed");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bonjour");
    else if (hour < 18) setGreeting("Bon après-midi");
    else setGreeting("Bonsoir");
  }, []);

  const businessName = user?.businessName || user?.fullName?.split(" ")[0] || "Prestataire";

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Top Header Bar - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#004150] via-[#005a6e] to-[#004150] shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#fd7613] flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">Allo Services</span>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-white/10 rounded-full p-1">
              <button
                onClick={() => setActiveTab("feed")}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  activeTab === "feed"
                    ? "bg-white text-[#004150]"
                    : "text-white/70 hover:text-white"
                )}
              >
                Publications
              </button>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  activeTab === "dashboard"
                    ? "bg-white text-[#004150]"
                    : "text-white/70 hover:text-white"
                )}
              >
                Tableau de bord
              </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Link href="/provider/publications/new">
                <Button size="sm" className="bg-[#fd7613] hover:bg-[#e5650f] hidden sm:flex">
                  <Plus className="h-4 w-4 mr-1" />
                  Publier
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#fd7613] rounded-full text-[10px] flex items-center justify-center text-white">
                  5
                </span>
              </Button>
              <Avatar className="h-9 w-9 border-2 border-[#fd7613]">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className="bg-[#fd7613] text-white text-sm font-bold">
                  {businessName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-4">
        {activeTab === "feed" ? (
          /* Feed View */
          <FeedPage
            userType="PROVIDER"
            userId={user?.id}
            userName={user?.fullName}
            userAvatar={user?.avatarUrl}
          />
        ) : (
          /* Dashboard View */
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
            {/* Welcome & Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Aujourd'hui</p>
                      <p className="text-2xl font-bold text-gray-900">{STATS.todayReservations}</p>
                      <p className="text-xs text-green-600">réservations</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Cette semaine</p>
                      <p className="text-2xl font-bold text-gray-900">{(STATS.weeklyRevenue / 1000).toFixed(0)}k</p>
                      <p className="text-xs text-gray-500">FCFA gagnés</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <Wallet className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Vues profil</p>
                      <p className="text-2xl font-bold text-gray-900">{STATS.profileViews}</p>
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <ArrowUpRight className="h-3 w-3" /> +12%
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Taux réponse</p>
                      <p className="text-2xl font-bold text-gray-900">{STATS.responseRate}%</p>
                      <p className="text-xs text-green-600">Excellent</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fd7613] to-[#f59542] flex items-center justify-center">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alert Banner */}
            {PENDING_REQUESTS.length > 0 && (
              <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {PENDING_REQUESTS.length} nouvelle(s) demande(s) en attente
                      </p>
                      <p className="text-sm text-gray-600">
                        Répondez rapidement pour améliorer votre taux de réponse
                      </p>
                    </div>
                    <Link href="/provider/reservations?status=PENDING">
                      <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                        Voir les demandes
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/provider/reservations" className="group">
                <Card className="h-full bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-5 text-center">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#004150] to-[#005a6e] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Calendar className="h-7 w-7 text-white" />
                    </div>
                    <p className="font-semibold text-gray-900">Réservations</p>
                    <p className="text-xs text-gray-500 mt-1">Gérer mes RDV</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/provider/services" className="group">
                <Card className="h-full bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-5 text-center">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#fd7613] to-[#f59542] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Settings className="h-7 w-7 text-white" />
                    </div>
                    <p className="font-semibold text-gray-900">Mes services</p>
                    <p className="text-xs text-gray-500 mt-1">Tarifs & détails</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/provider/publications" className="group">
                <Card className="h-full bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-5 text-center">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ImageIcon className="h-7 w-7 text-white" />
                    </div>
                    <p className="font-semibold text-gray-900">Publications</p>
                    <p className="text-xs text-gray-500 mt-1">Photos & vidéos</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/provider/analytics" className="group">
                <Card className="h-full bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-5 text-center">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BarChart3 className="h-7 w-7 text-white" />
                    </div>
                    <p className="font-semibold text-gray-900">Statistiques</p>
                    <p className="text-xs text-gray-500 mt-1">Performance</p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Today's Schedule */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-gray-900">Planning du jour</CardTitle>
                    <p className="text-sm text-gray-500">{STATS.todayReservations} prestation(s) programmée(s)</p>
                  </div>
                  <Link href="/provider/reservations" className="text-[#fd7613] text-sm flex items-center">
                    Voir tout <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {TODAY_RESERVATIONS.map((reservation) => (
                    <div key={reservation.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        reservation.status === "IN_PROGRESS"
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600"
                      )}>
                        <Clock className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={reservation.clientAvatar} />
                              <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                                {reservation.clientName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-900">{reservation.clientName}</p>
                              <p className="text-xs text-gray-500">{reservation.service}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={cn(
                              "text-xs",
                              reservation.status === "IN_PROGRESS" ? "bg-green-500" : "bg-blue-500"
                            )}>
                              {reservation.statusLabel}
                            </Badge>
                            <p className="text-sm font-semibold text-gray-900 mt-1">
                              {(reservation.price / 1000).toFixed(0)}k FCFA
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{reservation.time} ({reservation.duration})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{reservation.address}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{reservation.clientPhone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Go Live CTA */}
            <Card className="bg-gradient-to-r from-red-500 to-pink-500 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Video className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">
                      Lancez un live pour attirer plus de clients !
                    </h3>
                    <p className="text-sm text-white/80">
                      Montrez votre travail en temps réel et gagnez en visibilité. Les prestataires qui font des lives reçoivent 3x plus de demandes.
                    </p>
                  </div>
                  <Link href="/provider/lives">
                    <Button className="bg-white text-red-500 hover:bg-gray-100">
                      <Video className="h-4 w-4 mr-2" />
                      Démarrer un live
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
        <div className="flex items-center justify-around py-2">
          <Button
            variant="ghost"
            className={cn("flex flex-col gap-1 h-auto py-2", activeTab === "feed" ? "text-[#004150]" : "text-gray-500")}
            onClick={() => setActiveTab("feed")}
          >
            <Heart className="h-5 w-5" />
            <span className="text-[10px]">Publications</span>
          </Button>
          <Button
            variant="ghost"
            className={cn("flex flex-col gap-1 h-auto py-2", activeTab === "dashboard" ? "text-[#004150]" : "text-gray-500")}
            onClick={() => setActiveTab("dashboard")}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-[10px]">Tableau</span>
          </Button>
          <Link href="/provider/reservations">
            <Button variant="ghost" className="flex flex-col gap-1 h-auto py-2 text-gray-500">
              <Calendar className="h-5 w-5" />
              <span className="text-[10px]">RDV</span>
            </Button>
          </Link>
          <Link href="/provider/messages">
            <Button variant="ghost" className="flex flex-col gap-1 h-auto py-2 text-gray-500">
              <MessageCircle className="h-5 w-5" />
              <span className="text-[10px]">Messages</span>
            </Button>
          </Link>
          <Link href="/provider/profile">
            <Button variant="ghost" className="flex flex-col gap-1 h-auto py-2 text-gray-500">
              <Settings className="h-5 w-5" />
              <span className="text-[10px]">Profil</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
