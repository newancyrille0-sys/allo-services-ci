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
  ChevronRight,
  Bell,
  MessageCircle,
  Home,
  BarChart3,
  Settings,
  Crown,
  Video,
  Shield,
  Users,
  Eye,
  Zap,
  Radio,
  Play,
  Gift,
  CheckCircle,
  Sparkles,
  Timer,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

// Mock data
const STATS = {
  totalReservations: 45,
  averageRating: 4.8,
  totalEarnings: 1250000,
  thisMonthEarnings: 450000,
  liveViews: 1250,
  liveConversion: 8.5,
  liveRevenue: 85000,
  bestTimeSlot: "Samedi 14h-16h",
  responseRate: 98,
  completionRate: 99,
};

const WEEKLY_PLANNING = [
  { day: "Lun", date: "12", reservations: 3, hasLive: false },
  { day: "Mar", date: "13", reservations: 4, hasLive: true, liveTitle: "Installation plomberie" },
  { day: "Mer", date: "14", reservations: 2, hasLive: false },
  { day: "Jeu", date: "15", reservations: 5, hasLive: false },
  { day: "Ven", date: "16", reservations: 3, hasLive: true, liveTitle: "Q&A Conseils" },
  { day: "Sam", date: "17", reservations: 4, hasLive: false },
  { day: "Dim", date: "18", reservations: 2, hasLive: false },
];

const PREMIUM_TOOLS = [
  { name: "Codes promo", icon: Gift, enabled: true },
  { name: "Stats post-live", icon: BarChart3, enabled: true },
  { name: "Replay auto", icon: Play, enabled: true },
  { name: "Multi-cam", icon: Video, enabled: false, requiresElite: true },
];

const LIVE_CATEGORIES = [
  { id: "tutorial", label: "Tutoriel" },
  { id: "qanda", label: "Q&R" },
  { id: "behind-scenes", label: "Backstage" },
  { id: "demonstration", label: "Démonstration" },
];

export default function ProviderPremiumDashboardPage() {
  const { user } = useAuth();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [liveTitle, setLiveTitle] = useState("");
  const [liveDate, setLiveDate] = useState("");
  const [liveTime, setLiveTime] = useState("");
  const [liveCategory, setLiveCategory] = useState("");

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
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#7b5800] to-[#a67c00] shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo & Badge */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                  <span className="text-[#7b5800] font-bold text-lg font-headline">A</span>
                </div>
              </Link>
              <Badge className="bg-white/20 text-white border border-white/30 gap-1.5">
                <Crown className="h-3 w-3" />
                <span className="text-[10px] font-bold">NIVEAU PREMIUM</span>
              </Badge>
            </div>

            {/* Commission Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full">
              <Percent className="h-4 w-4 text-white/70" />
              <span className="text-sm text-white">Commission: </span>
              <span className="text-sm font-bold text-white">10%</span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full text-[10px] font-bold text-[#7b5800] flex items-center justify-center">
                  4
                </span>
              </Button>
              <Link href="/provider/messages">
                <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
                  <MessageCircle className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full text-[10px] font-bold text-[#7b5800] flex items-center justify-center">
                    2
                  </span>
                </Button>
              </Link>
              <Avatar className="h-9 w-9 border-2 border-white">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className="bg-white text-[#7b5800] text-sm font-bold">
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
          {/* Welcome Banner with Badges */}
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
                  <Badge className="bg-gradient-to-r from-[#7b5800] to-[#a67c00] text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                </div>
                <p className="text-gray-600">
                  Profitez de tous vos avantages Premium pour maximiser vos revenus.
                </p>
              </div>
              <Link href="/provider/subscription">
                <Button className="bg-gradient-to-r from-[#001e40] to-[#003366] hover:from-[#001e40] hover:to-[#003366] text-white gap-2">
                  <Crown className="h-4 w-4" />
                  Passer Elite
                </Button>
              </Link>
            </div>
          </div>

          {/* Live Streaming Studio */}
          <Card className="glass-panel shadow-ambient border-2 border-[#7b5800]/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-red-500 animate-pulse" />
                  <CardTitle className="text-lg font-headline text-[#001e40]">
                    Live Streaming Studio
                  </CardTitle>
                </div>
                <Badge className="bg-gradient-to-r from-[#7b5800] to-[#a67c00] text-white">
                  Premium Feature
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Live Now */}
                <div className="p-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Video className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Démarrer un live maintenant</p>
                      <p className="text-sm text-white/70">Connectez-vous avec votre audience</p>
                    </div>
                  </div>
                  <Link href="/provider/lives">
                    <Button className="w-full bg-white text-red-500 hover:bg-gray-100">
                      <Radio className="h-4 w-4 mr-2" />
                      Go Live
                    </Button>
                  </Link>
                </div>

                {/* Schedule Live */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#001e40]/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-[#001e40]" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Planifier un live</p>
                      <p className="text-sm text-gray-500">Programmez à l'avance</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Input
                      placeholder="Titre du live..."
                      value={liveTitle}
                      onChange={(e) => setLiveTitle(e.target.value)}
                      className="bg-white"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        value={liveDate}
                        onChange={(e) => setLiveDate(e.target.value)}
                        className="bg-white"
                      />
                      <Input
                        type="time"
                        value={liveTime}
                        onChange={(e) => setLiveTime(e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <Select value={liveCategory} onValueChange={setLiveCategory}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {LIVE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button className="w-full bg-[#001e40] hover:bg-[#003366] text-white">
                      Planifier
                    </Button>
                  </div>
                </div>
              </div>

              {/* Premium Tools */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-600 mb-3">Outils Premium débloqués</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {PREMIUM_TOOLS.map((tool, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg",
                        tool.enabled ? "bg-[#7b5800]/10" : "bg-gray-100 opacity-50"
                      )}
                    >
                      <tool.icon className={cn("h-5 w-5", tool.enabled ? "text-[#7b5800]" : "text-gray-400")} />
                      <div className="flex-1">
                        <p className={cn("text-sm font-medium", tool.enabled ? "text-gray-900" : "text-gray-500")}>
                          {tool.name}
                        </p>
                        {tool.requiresElite && (
                          <p className="text-xs text-[#7b5800]">Elite requis</p>
                        )}
                      </div>
                      {tool.enabled && <CheckCircle className="h-4 w-4 text-[#7b5800]" />}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats with Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="glass-panel shadow-ambient">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Eye className="h-5 w-5 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{STATS.liveViews.toLocaleString('fr-FR')}</p>
                <p className="text-xs text-gray-500">Vues Live</p>
              </CardContent>
            </Card>
            <Card className="glass-panel shadow-ambient">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{STATS.liveConversion}%</p>
                <p className="text-xs text-gray-500">Conversion Live</p>
              </CardContent>
            </Card>
            <Card className="glass-panel shadow-ambient">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Wallet className="h-5 w-5 text-[#7b5800]" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{(STATS.liveRevenue / 1000).toFixed(0)}k</p>
                <p className="text-xs text-gray-500">Revenus Live (FCFA)</p>
              </CardContent>
            </Card>
            <Card className="glass-panel shadow-ambient">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Timer className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-lg font-bold text-gray-900">{STATS.bestTimeSlot}</p>
                <p className="text-xs text-gray-500">Meilleur créneau</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Balance Widget */}
              <Card className="glass-panel shadow-ambient border-l-4 border-l-[#7b5800]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Solde disponible</p>
                      <p className="text-4xl font-bold text-[#001e40]">
                        {(STATS.thisMonthEarnings / 1000).toFixed(0)}.000 FCFA
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-gray-500">
                          Commission: <span className="font-bold text-[#7b5800]">10%</span>
                        </span>
                        <span className="text-sm text-green-600 flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          +23% ce mois
                        </span>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-[#7b5800] to-[#a67c00] hover:from-[#7b5800] hover:to-[#a67c00] text-white">
                      Retirer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Planning with Live */}
              <Card className="glass-panel shadow-ambient">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-headline text-[#001e40]">
                      Planning de la semaine
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-100 text-red-600">
                        <Radio className="h-3 w-3 mr-1" />
                        2 Lives programmés
                      </Badge>
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
                          index === 0 ? "bg-[#001e40] text-white" : "bg-gray-50 hover:bg-gray-100",
                          day.hasLive && "ring-2 ring-red-400"
                        )}
                      >
                        {day.hasLive && (
                          <div className="absolute -top-1 -right-1 flex items-center gap-0.5">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          </div>
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
                        {day.hasLive && (
                          <p className="text-[8px] text-red-500 mt-1 truncate">{day.liveTitle}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Active Premium Benefits */}
              <Card className="glass-panel shadow-ambient">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-headline text-[#001e40]">
                    Vos avantages Premium actifs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-700">Badge Vérifié</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-700">TOP Recherche</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-700">Support 24/7</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-700">Live Illimité</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-700">Analytics Pro</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-700">Codes Promo</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Upsell to Elite */}
              <Card className="bg-gradient-to-br from-[#001e40] to-[#003366] text-white shadow-ambient">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <Crown className="h-6 w-6 text-[#fdc34d]" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Passez Elite</p>
                      <p className="text-sm text-white/70">Le niveau suprême</p>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-4 text-sm">
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#fdc34d]" />
                      Commission réduite à 5%
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#fdc34d]" />
                      Account Manager dédié
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#fdc34d]" />
                      Multi-Cam Support
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#fdc34d]" />
                      Predictive Analytics
                    </li>
                  </ul>
                  <Link href="/provider/subscription">
                    <Button className="w-full bg-[#fdc34d] text-[#001e40] hover:bg-[#fdc34d]/90 font-bold">
                      Découvrir Elite
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Recent Live Stats */}
              <Card className="glass-panel shadow-ambient">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-headline text-[#001e40]">
                    Derniers Lives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900">Installation chauffe-eau</p>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Terminé
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" /> 456 vues
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> 12 réservations
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900">Q&R Plomberie</p>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Terminé
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" /> 324 vues
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> 8 réservations
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="glass-panel shadow-ambient">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-headline text-[#001e40]">
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Taux de réponse</span>
                        <span className="font-bold text-green-600">{STATS.responseRate}%</span>
                      </div>
                      <Progress value={STATS.responseRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Taux de complétion</span>
                        <span className="font-bold text-green-600">{STATS.completionRate}%</span>
                      </div>
                      <Progress value={STATS.completionRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Note moyenne</span>
                        <span className="font-bold text-[#7b5800] flex items-center gap-1">
                          {STATS.averageRating} <Star className="h-4 w-4 fill-[#fdc34d] text-[#fdc34d]" />
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glass-panel shadow-ambient">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/provider/services">
                      <Button variant="outline" className="w-full h-auto py-3 flex flex-col gap-1">
                        <Settings className="h-5 w-5 text-gray-600" />
                        <span className="text-xs">Services</span>
                      </Button>
                    </Link>
                    <Link href="/provider/analytics">
                      <Button variant="outline" className="w-full h-auto py-3 flex flex-col gap-1">
                        <BarChart3 className="h-5 w-5 text-gray-600" />
                        <span className="text-xs">Stats</span>
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
          <Link href="/provider/premium" className="flex flex-col items-center gap-1 p-2 text-[#7b5800]">
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-medium">Accueil</span>
          </Link>
          <Link href="/provider/reservations" className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <Calendar className="h-5 w-5" />
            <span className="text-[10px]">RDV</span>
          </Link>
          <Link href="/provider/lives" className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <Radio className="h-5 w-5" />
            <span className="text-[10px]">Live</span>
          </Link>
          <Link href="/provider/messages" className="flex flex-col items-center gap-1 p-2 text-gray-400 relative">
            <MessageCircle className="h-5 w-5" />
            <span className="text-[10px]">Messages</span>
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
