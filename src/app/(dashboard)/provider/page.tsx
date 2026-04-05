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
  Image,
  Crown,
  Zap,
  MapPin,
  Phone,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Users,
  Award,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";

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
  {
    id: "3",
    clientName: "Jean Kouassi",
    clientPhone: "+225 01 02 03 04 05",
    clientAvatar: "https://i.pravatar.cc/100?img=3",
    service: "Dépannage",
    time: "17:30",
    duration: "1h30",
    address: "Plateau, Avenue Chardy",
    price: 20000,
    status: "PENDING",
    statusLabel: "En attente",
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
  {
    id: "2",
    clientName: "Moussa Traoré",
    service: "Installation robinet",
    date: "Mercredi, 14:00",
    address: "Treichville",
    price: 15000,
  },
];

const RECENT_REVIEWS = [
  {
    id: "1",
    clientName: "Awa Sanogo",
    clientAvatar: "https://i.pravatar.cc/100?img=9",
    rating: 5,
    comment: "Excellent travail ! Très professionnel et ponctuel.",
    date: "Il y a 2h",
    responded: false,
  },
  {
    id: "2",
    clientName: "Moussa Traoré",
    clientAvatar: "https://i.pravatar.cc/100?img=8",
    rating: 5,
    comment: "Travail impeccable, prix honnête. Je recommande.",
    date: "Hier",
    responded: true,
  },
];

const REVENUE_DATA = [
  { day: "Lun", value: 45000 },
  { day: "Mar", value: 32000 },
  { day: "Mer", value: 68000 },
  { day: "Jeu", value: 25000 },
  { day: "Ven", value: 55000 },
  { day: "Sam", value: 72000 },
  { day: "Dim", value: 48000 },
];

export default function ProviderHomePage() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Bonjour");
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bonjour");
    else if (hour < 18) setGreeting("Bon après-midi");
    else setGreeting("Bonsoir");
  }, []);

  const businessName = user?.businessName || user?.fullName?.split(" ")[0] || "Prestataire";
  const maxRevenue = Math.max(...REVENUE_DATA.map(d => d.value));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#fd7613]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#004150]/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-[#fd7613]">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-[#fd7613] to-[#f59542] text-white text-lg font-bold">
                  {businessName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  {greeting}, {businessName} !
                </h1>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#fd7613] text-white text-xs">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                  <div className="flex items-center gap-1 text-white/60 text-sm">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{STATS.averageRating}</span>
                    <span>({STATS.totalReviews} avis)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#fd7613] rounded-full text-[10px] flex items-center justify-center">
                  5
                </span>
              </Button>
              <Link href="/provider/settings">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Aujourd'hui</p>
                    <p className="text-2xl font-bold text-white">{STATS.todayReservations}</p>
                    <p className="text-xs text-green-400">réservations</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Cette semaine</p>
                    <p className="text-2xl font-bold text-white">{(STATS.weeklyRevenue / 1000).toFixed(0)}k</p>
                    <p className="text-xs text-white/60">FCFA gagnés</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Vues profil</p>
                    <p className="text-2xl font-bold text-white">{STATS.profileViews}</p>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3" /> +12%
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Taux réponse</p>
                    <p className="text-2xl font-bold text-white">{STATS.responseRate}%</p>
                    <p className="text-xs text-green-400">Excellent</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fd7613] to-[#f59542] flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        
        {/* Alert Banner */}
        {PENDING_REQUESTS.length > 0 && (
          <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/30 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">
                    {PENDING_REQUESTS.length} nouvelle(s) demande(s) en attente
                  </p>
                  <p className="text-sm text-white/60">
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
            <Card className="h-full bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardContent className="p-5 text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#004150] to-[#005a6e] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="h-7 w-7 text-white" />
                </div>
                <p className="font-semibold text-white">Réservations</p>
                <p className="text-xs text-white/60 mt-1">Gérer mes RDV</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/provider/services" className="group">
            <Card className="h-full bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardContent className="p-5 text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#fd7613] to-[#f59542] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Settings className="h-7 w-7 text-white" />
                </div>
                <p className="font-semibold text-white">Mes services</p>
                <p className="text-xs text-white/60 mt-1">Tarifs & détails</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/provider/publications" className="group">
            <Card className="h-full bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardContent className="p-5 text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Image className="h-7 w-7 text-white" />
                </div>
                <p className="font-semibold text-white">Publications</p>
                <p className="text-xs text-white/60 mt-1">Photos & vidéos</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/provider/analytics" className="group">
            <Card className="h-full bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardContent className="p-5 text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <p className="font-semibold text-white">Statistiques</p>
                <p className="text-xs text-white/60 mt-1">Performance</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Planning du jour</h2>
                <p className="text-sm text-white/60">{STATS.todayReservations} prestation(s) programmée(s)</p>
              </div>
              <Link href="/provider/reservations" className="text-[#fd7613] text-sm flex items-center">
                Voir tout <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {TODAY_RESERVATIONS.map((reservation) => (
                <Card key={reservation.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        reservation.status === "IN_PROGRESS" 
                          ? "bg-green-500/20 text-green-400"
                          : reservation.status === "CONFIRMED"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}>
                        <Clock className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={reservation.clientAvatar} />
                              <AvatarFallback className="bg-white/10 text-white text-xs">
                                {reservation.clientName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-white">{reservation.clientName}</p>
                              <p className="text-xs text-white/60">{reservation.service}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={`text-xs ${
                              reservation.status === "IN_PROGRESS" 
                                ? "bg-green-500"
                                : reservation.status === "CONFIRMED"
                                ? "bg-blue-500"
                                : "bg-amber-500"
                            }`}>
                              {reservation.statusLabel}
                            </Badge>
                            <p className="text-sm font-semibold text-white mt-1">
                              {(reservation.price / 1000).toFixed(0)}k FCFA
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-white/60">
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Revenue Chart */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-white">Revenus de la semaine</CardTitle>
                  <Badge className="bg-green-500/20 text-green-400">
                    <TrendingUp className="h-3 w-3 mr-1" /> +18%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2 h-24">
                  {REVENUE_DATA.map((data, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className="w-full rounded-t-sm bg-gradient-to-t from-[#fd7613] to-[#f59542]"
                        style={{ height: `${(data.value / maxRevenue) * 100}%` }}
                      />
                      <span className="text-[10px] text-white/40">{data.day}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Total cette semaine</span>
                    <span className="text-lg font-bold text-white">
                      {(REVENUE_DATA.reduce((a, b) => a + b.value, 0) / 1000).toFixed(0)}k FCFA
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-white">Derniers avis</CardTitle>
                  <Link href="/provider/reviews" className="text-[#fd7613] text-xs">
                    Tout voir
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {RECENT_REVIEWS.map((review) => (
                  <div key={review.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={review.clientAvatar} />
                      <AvatarFallback className="bg-white/10 text-white text-xs">
                        {review.clientName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-white text-sm">{review.clientName}</p>
                        <span className="text-xs text-white/40">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1 my-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-white/20 text-white/20"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-white/60 line-clamp-2">{review.comment}</p>
                      {!review.responded && (
                        <Button size="sm" variant="link" className="h-auto p-0 mt-2 text-[#fd7613]">
                          Répondre
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance Score */}
            <Card className="bg-gradient-to-br from-[#fd7613]/20 to-[#f59542]/20 border-[#fd7613]/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fd7613] flex items-center justify-center">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Score de performance</p>
                    <p className="text-xs text-white/60">Basé sur vos statistiques</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-white/60">Taux de réponse</span>
                      <span className="text-white font-medium">95%</span>
                    </div>
                    <Progress value={95} className="h-2 bg-white/10" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-white/60">Ponctualité</span>
                      <span className="text-white font-medium">98%</span>
                    </div>
                    <Progress value={98} className="h-2 bg-white/10" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-white/60">Satisfaction client</span>
                      <span className="text-white font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2 bg-white/10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Go Live CTA */}
        <Card className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                <Video className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">
                  Lancez un live pour attirer plus de clients !
                </h3>
                <p className="text-sm text-white/60">
                  Montrez votre travail en temps réel et gagnez en visibilité. Les prestataires qui font des lives reçoivent 3x plus de demandes.
                </p>
              </div>
              <Link href="/provider/lives">
                <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white">
                  <Video className="h-4 w-4 mr-2" />
                  Démarrer un live
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
