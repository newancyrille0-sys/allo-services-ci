"use client";

import * as React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Calendar,
  Star,
  Wallet,
  TrendingUp,
  Clock,
  MapPin,
  ChevronRight,
  Bell,
  MessageCircle,
  Home,
  BarChart3,
  Settings,
  Crown,
  Video,
  Image as ImageIcon,
  Megaphone,
  Shield,
  Users,
  Eye,
  Target,
  Zap,
  Lightbulb,
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
  totalReservations: 28,
  averageRating: 4.6,
  totalEarnings: 425000,
  thisMonthEarnings: 125000,
  responseRate: 92,
  completionRate: 96,
  acceptanceRate: 88,
  avgResponseTime: "2h 15min",
  profileViews: 312,
  clientSources: [
    { source: "Recherche", percentage: 45 },
    { source: "Recommandation", percentage: 30 },
    { source: "Profil", percentage: 25 },
  ],
};

const WEEKLY_PLANNING = [
  { day: "Lun", date: "12", reservations: 2, hasLive: false },
  { day: "Mar", date: "13", reservations: 3, hasLive: true },
  { day: "Mer", date: "14", reservations: 1, hasLive: false },
  { day: "Jeu", date: "15", reservations: 4, hasLive: false },
  { day: "Ven", date: "16", reservations: 2, hasLive: true },
  { day: "Sam", date: "17", reservations: 3, hasLive: false },
  { day: "Dim", date: "18", reservations: 1, hasLive: false },
];

const MARKETING_POSTS = [
  {
    id: "1",
    type: "image",
    title: "Avant/Après rénovation salle de bain",
    views: 234,
    likes: 45,
    date: "Il y a 2 jours",
  },
  {
    id: "2",
    type: "video",
    title: "Installation d'un chauffe-eau solaire",
    views: 567,
    likes: 89,
    date: "Il y a 5 jours",
  },
  {
    id: "3",
    type: "image",
    title: "Travaux de plomberie - Villa Cocody",
    views: 123,
    likes: 28,
    date: "Il y a 1 semaine",
  },
];

const DAILY_TIPS = [
  "Publiez des photos de vos travaux pour augmenter vos demandes de 40%.",
  "Répondez aux avis clients pour améliorer votre visibilité.",
  "Proposez des créneaux le weekend pour toucher plus de clients.",
];

export default function ProviderBasicDashboardPage() {
  const { user } = useAuth();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Compute greeting based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };
  const greeting = getGreeting();

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % DAILY_TIPS.length);
    }, 10000);
    return () => clearInterval(tipInterval);
  }, []);

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
              <Badge className="bg-emerald-500 text-white gap-1.5">
                <Shield className="h-3 w-3" />
                <span className="text-[10px] font-bold">NIVEAU BASIC</span>
              </Badge>
            </div>

            {/* Commission Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
              <span className="text-xs text-emerald-700">Commission:</span>
              <span className="text-sm font-bold text-emerald-600">12%</span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#001e40] rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                  3
                </span>
              </Button>
              <Link href="/provider/messages">
                <Button variant="ghost" size="icon" className="relative">
                  <MessageCircle className="h-5 w-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                    1
                  </span>
                </Button>
              </Link>
              <Avatar className="h-9 w-9 border-2 border-emerald-500">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className="bg-emerald-500 text-white text-sm font-bold">
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
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-[#001e40] font-headline">
                    {greeting}, {businessName} !
                  </h1>
                  <Badge className="bg-[#00460e] text-white">
                    <Shield className="h-3 w-3 mr-1" />
                    Vérifié
                  </Badge>
                </div>
                <p className="text-gray-600">
                  Votre profil est vérifié. Continuez à développer votre activité !
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/provider/publications/new">
                  <Button variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Publier
                  </Button>
                </Link>
                <Link href="/provider/subscription">
                  <Button className="bg-gradient-to-r from-[#7b5800] to-[#a67c00] hover:from-[#7b5800] hover:to-[#a67c00] text-white gap-2">
                    <Crown className="h-4 w-4" />
                    Premium
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="glass-panel shadow-ambient">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="h-5 w-5 text-[#001e40]" />
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{STATS.totalReservations}</p>
                <p className="text-xs text-gray-500">Réservations ce mois</p>
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
                </div>
                <p className="text-2xl font-bold text-gray-900">{(STATS.thisMonthEarnings / 1000).toFixed(0)}k</p>
                <p className="text-xs text-gray-500">FCFA ce mois</p>
              </CardContent>
            </Card>
            <Card className="glass-panel shadow-ambient">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Eye className="h-5 w-5 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{STATS.profileViews}</p>
                <p className="text-xs text-gray-500">Vues du profil</p>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-panel shadow-ambient">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-5 w-5 text-emerald-500" />
                  <span className="font-medium text-gray-900">Taux d'acceptation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={STATS.acceptanceRate} className="flex-1 h-2" />
                  <span className="text-lg font-bold text-emerald-600">{STATS.acceptanceRate}%</span>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-panel shadow-ambient">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="font-medium text-gray-900">Temps de réponse</span>
                </div>
                <p className="text-lg font-bold text-blue-600">{STATS.avgResponseTime}</p>
                <p className="text-xs text-gray-500">Moyenne</p>
              </CardContent>
            </Card>
            <Card className="glass-panel shadow-ambient">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  <span className="font-medium text-gray-900">Sources clients</span>
                </div>
                <div className="space-y-1">
                  {STATS.clientSources.map((source, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{source.source}</span>
                      <span className="font-medium text-gray-900">{source.percentage}%</span>
                    </div>
                  ))}
                </div>
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
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                        <Video className="h-3 w-3 mr-1" />
                        2 Lives
                      </Badge>
                      <Link href="/provider/reservations" className="text-sm text-[#001e40] flex items-center">
                        Voir tout <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {WEEKLY_PLANNING.map((day, index) => (
                      <div
                        key={index}
                        className={cn(
                          "text-center p-3 rounded-xl transition-colors relative",
                          index === 0 ? "bg-[#001e40] text-white" : "bg-gray-50 hover:bg-gray-100"
                        )}
                      >
                        {day.hasLive && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        )}
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

              {/* Marketing & Visibility */}
              <Card className="glass-panel shadow-ambient">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-headline text-[#001e40]">
                      Marketing & Visibilité
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                        3 posts/semaine
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <Link href="/provider/publications/new">
                      <div className="flex flex-col items-center p-3 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer">
                        <ImageIcon className="h-6 w-6 text-emerald-600 mb-1" />
                        <span className="text-xs font-medium text-emerald-700">Photo</span>
                      </div>
                    </Link>
                    <Link href="/provider/publications/new">
                      <div className="flex flex-col items-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer">
                        <Video className="h-6 w-6 text-blue-600 mb-1" />
                        <span className="text-xs font-medium text-blue-700">Vidéo</span>
                      </div>
                    </Link>
                    <Link href="/provider/lives">
                      <div className="flex flex-col items-center p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors cursor-pointer">
                        <Megaphone className="h-6 w-6 text-red-600 mb-1" />
                        <span className="text-xs font-medium text-red-700">Live</span>
                      </div>
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {MARKETING_POSTS.map((post) => (
                      <div key={post.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          post.type === "video" ? "bg-blue-100" : "bg-emerald-100"
                        )}>
                          {post.type === "video" ? (
                            <Video className="h-4 w-4 text-blue-600" />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-emerald-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                          <p className="text-xs text-gray-500">{post.date}</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {post.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" /> {post.likes}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Balance Widget */}
              <Card className="glass-panel shadow-ambient">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-headline text-[#001e40]">
                    Solde & Gains
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-white">
                    <div>
                      <p className="text-white/70 text-sm">Solde disponible</p>
                      <p className="text-3xl font-bold">{(STATS.thisMonthEarnings / 1000).toFixed(0)} 000 FCFA</p>
                    </div>
                    <Button className="bg-white text-emerald-600 hover:bg-gray-100">
                      Retirer
                    </Button>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Aujourd'hui</p>
                      <p className="font-bold text-gray-900">25k FCFA</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Cette semaine</p>
                      <p className="font-bold text-gray-900">85k FCFA</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="font-bold text-gray-900">425k FCFA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Daily Tip */}
              <Card className="glass-panel shadow-ambient border-l-4 border-l-amber-400">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                      <Lightbulb className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-amber-600 font-medium mb-1">Conseil du jour</p>
                      <p className="text-sm text-gray-700">{DAILY_TIPS[currentTipIndex]}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quota Progress */}
              <Card className="glass-panel shadow-ambient">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-headline text-[#001e40]">
                    Quotas Marketing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Publications</span>
                        <span className="font-medium text-gray-900">2/3</span>
                      </div>
                      <Progress value={66} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Videos</span>
                        <span className="font-medium text-gray-900">1/3</span>
                      </div>
                      <Progress value={33} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Live streaming</span>
                        <span className="font-medium text-emerald-600">Illimité ✓</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upsell to Premium/Elite */}
              <Card className="bg-gradient-to-br from-[#7b5800] to-[#a67c00] text-white shadow-ambient">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Crown className="h-8 w-8" />
                    <div>
                      <p className="font-bold text-lg">Passez Premium</p>
                      <p className="text-sm text-white/70">25 000 FCFA/mois</p>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-4 text-sm">
                    <li className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-[#fdc34d]" />
                      Commission réduite à 10%
                    </li>
                    <li className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-[#fdc34d]" />
                      Live Streaming Studio
                    </li>
                    <li className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-[#fdc34d]" />
                      Analytics avancés
                    </li>
                    <li className="flex items-center gap-2">
                      <Megaphone className="h-4 w-4 text-[#fdc34d]" />
                      Publications illimitées
                    </li>
                  </ul>
                  <Link href="/provider/subscription">
                    <Button className="w-full bg-white text-[#7b5800] hover:bg-gray-100">
                      Voir les offres
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glass-panel shadow-ambient">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-headline text-[#001e40]">
                    Actions rapides
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/provider/services">
                      <Button variant="outline" className="w-full h-auto py-3 flex flex-col gap-1">
                        <Settings className="h-5 w-5 text-gray-600" />
                        <span className="text-xs">Mes services</span>
                      </Button>
                    </Link>
                    <Link href="/provider/profile/edit">
                      <Button variant="outline" className="w-full h-auto py-3 flex flex-col gap-1">
                        <Users className="h-5 w-5 text-gray-600" />
                        <span className="text-xs">Mon profil</span>
                      </Button>
                    </Link>
                    <Link href="/provider/reviews">
                      <Button variant="outline" className="w-full h-auto py-3 flex flex-col gap-1">
                        <Star className="h-5 w-5 text-gray-600" />
                        <span className="text-xs">Mes avis</span>
                      </Button>
                    </Link>
                    <Link href="/provider/analytics">
                      <Button variant="outline" className="w-full h-auto py-3 flex flex-col gap-1">
                        <BarChart3 className="h-5 w-5 text-gray-600" />
                        <span className="text-xs">Statistiques</span>
                      </Button>
                    </Link>
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
          <Link href="/provider/basic" className="flex flex-col items-center gap-1 p-2 text-emerald-600">
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
