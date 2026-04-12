"use client";

import * as React from "react";
import Link from "next/link";
import { useState } from "react";
import {
  Calendar,
  Star,
  Wallet,
  TrendingUp,
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
  Sparkles,
  Award,
  Target,
  Globe,
  Briefcase,
  Headphones,
  LineChart,
  Layers,
  CheckCircle,
  ArrowUpRight,
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
  revenueMTD: 1250000,
  conversionRate: 12.5,
  avgRating: 4.95,
  topPlacement: 3,
  impressions: 45678,
  ctr: 3.2,
  liveRevenue: 185000,
  totalClients: 312,
};

const ELITE_FEATURES = {
  multiCam: { enabled: true, sources: 4 },
  dynamicOverlays: { enabled: true },
  crossPlatform: { enabled: true, platforms: ["Facebook", "YouTube", "Instagram"] },
};

const COMPETITOR_DATA = [
  { name: "Moyenne secteur", rating: 4.2, revenue: 850000 },
  { name: "Top 10%", rating: 4.7, revenue: 1100000 },
  { name: "Vous (Elite)", rating: 4.95, revenue: 1250000 },
];

const CERTIFICATIONS = [
  { name: "Elite Shop", status: "active", icon: Briefcase },
  { name: "Sovereign Certification", status: "pending", icon: Award },
];

const WEEKLY_PLANNING = [
  { day: "Lun", date: "12", reservations: 5, hasLive: false },
  { day: "Mar", date: "13", reservations: 6, hasLive: true, liveTitle: "Masterclass Elite" },
  { day: "Mer", date: "14", reservations: 4, hasLive: false },
  { day: "Jeu", date: "15", reservations: 7, hasLive: true, liveTitle: "Q&A Premium" },
  { day: "Ven", date: "16", reservations: 5, hasLive: false },
  { day: "Sam", date: "17", reservations: 6, hasLive: true, liveTitle: "Live Croisé" },
  { day: "Dim", date: "18", reservations: 3, hasLive: false },
];

export default function ProviderEliteDashboardPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-[#001e40] via-[#003366] to-[#001e40]">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#001e40]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo & Badge */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fdc34d] to-[#7b5800] flex items-center justify-center">
                  <span className="text-white font-bold text-lg font-headline">A</span>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-[#fdc34d] to-[#7b5800] text-white gap-1.5 border-0">
                  <Crown className="h-3 w-3" />
                  <span className="text-[10px] font-bold">ELITE TIER</span>
                </Badge>
              </div>
            </div>

            {/* Commission Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20">
              <span className="text-sm text-white/70">Commission:</span>
              <span className="text-sm font-bold text-[#fdc34d]">5%</span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#fdc34d] rounded-full text-[10px] font-bold text-[#001e40] flex items-center justify-center">
                  2
                </span>
              </Button>
              <Link href="/provider/messages">
                <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
                  <MessageCircle className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#fdc34d] rounded-full text-[10px] font-bold text-[#001e40] flex items-center justify-center">
                    1
                  </span>
                </Button>
              </Link>
              <Avatar className="h-9 w-9 border-2 border-[#fdc34d]">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className="bg-[#fdc34d] text-[#001e40] text-sm font-bold">
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
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-white font-headline">
                    {greeting}, {businessName} !
                  </h1>
                  <Badge className="bg-[#00460e] text-white">
                    <Shield className="h-3 w-3 mr-1" />
                    Vérifié
                  </Badge>
                  <Badge className="bg-gradient-to-r from-[#fdc34d] to-[#7b5800] text-white border-0">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Elite
                  </Badge>
                </div>
                <p className="text-white/70">
                  Bienvenue dans l'expérience exclusive Elite. Profitez de tous vos avantages premium.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#fdc34d]/20 rounded-xl border border-[#fdc34d]/30">
                  <Crown className="h-5 w-5 text-[#fdc34d]" />
                  <div>
                    <p className="text-xs text-white/70">Statut Elite</p>
                    <p className="text-sm font-bold text-[#fdc34d]">Actif</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Wallet className="h-5 w-5 text-[#fdc34d]" />
                  <ArrowUpRight className="h-4 w-4 text-green-400" />
                </div>
                <p className="text-2xl font-bold">{(STATS.revenueMTD / 1000).toFixed(0)}k</p>
                <p className="text-xs text-white/60">Revenue MTD (FCFA)</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Target className="h-5 w-5 text-green-400" />
                </div>
                <p className="text-2xl font-bold">{STATS.conversionRate}%</p>
                <p className="text-xs text-white/60">Conversion Rate</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Star className="h-5 w-5 text-[#fdc34d]" fill="#fdc34d" />
                </div>
                <p className="text-2xl font-bold">{STATS.avgRating}</p>
                <p className="text-xs text-white/60">Avg. Rating</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-2xl font-bold">{STATS.totalClients}</p>
                <p className="text-xs text-white/60">Total Clients</p>
              </CardContent>
            </Card>
          </div>

          {/* Visibility Spotlight */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-[#fdc34d]" />
                  <CardTitle className="text-lg font-headline text-white">
                    Visibility Spotlight
                  </CardTitle>
                </div>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Top Performer
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-[#fdc34d]" />
                    <span className="text-white/70 text-sm">Top Search Placement</span>
                  </div>
                  <p className="text-3xl font-bold text-white">#{STATS.topPlacement}</p>
                  <p className="text-xs text-white/50">Plomberie - Abidjan</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-5 w-5 text-blue-400" />
                    <span className="text-white/70 text-sm">Impressions</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{STATS.impressions.toLocaleString()}</p>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" /> +18% vs last month
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <LineChart className="h-5 w-5 text-purple-400" />
                    <span className="text-white/70 text-sm">CTR</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{STATS.ctr}%</p>
                  <p className="text-xs text-white/50">Above average (2.1%)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Elite Support */}
              <Card className="bg-gradient-to-br from-[#fdc34d]/20 to-[#7b5800]/20 border-[#fdc34d]/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-[#fdc34d]/20 flex items-center justify-center">
                        <Headphones className="h-7 w-7 text-[#fdc34d]" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white">Elite Support</p>
                        <p className="text-sm text-white/70">Account Manager dédié</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white/70">Votre manager</p>
                      <p className="font-medium text-[#fdc34d]">Marie Kone</p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button className="flex-1 bg-[#fdc34d] text-[#001e40] hover:bg-[#fdc34d]/90 font-medium">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contacter
                    </Button>
                    <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                      <Calendar className="h-4 w-4 mr-2" />
                      Planifier appel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Live Streaming Studio Elite */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio className="h-5 w-5 text-red-400 animate-pulse" />
                      <CardTitle className="text-lg font-headline text-white">
                        Live Streaming Studio Elite
                      </CardTitle>
                    </div>
                    <Badge className="bg-[#fdc34d]/20 text-[#fdc34d] border-[#fdc34d]/30">
                      Elite Only
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Multi-Cam Support */}
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <Video className="h-5 w-5 text-[#fdc34d]" />
                        <span className="text-white font-medium">Multi-Cam Support</span>
                      </div>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4].map((cam) => (
                          <div
                            key={cam}
                            className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white text-xs font-bold"
                          >
                            CAM{cam}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-white/50 mt-2">{ELITE_FEATURES.multiCam.sources} sources</p>
                    </div>

                    {/* Dynamic Overlays */}
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <Layers className="h-5 w-5 text-blue-400" />
                        <span className="text-white font-medium">Dynamic Overlays</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-8 bg-white/10 rounded text-white text-xs flex items-center justify-center">
                          Prix
                        </div>
                        <div className="h-8 bg-white/10 rounded text-white text-xs flex items-center justify-center">
                          Contact
                        </div>
                      </div>
                      <p className="text-xs text-white/50 mt-2">Personnalisables</p>
                    </div>

                    {/* Cross-Platform Relay */}
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <Globe className="h-5 w-5 text-green-400" />
                        <span className="text-white font-medium">Cross-Platform</span>
                      </div>
                      <div className="flex gap-2">
                        {ELITE_FEATURES.crossPlatform.platforms.map((platform) => (
                          <div
                            key={platform}
                            className="px-2 py-1 bg-white/10 rounded text-white text-xs"
                          >
                            {platform}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-white/50 mt-2">Multi-diffusion</p>
                    </div>
                  </div>

                  <Link href="/provider/lives">
                    <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                      <Radio className="h-4 w-4 mr-2" />
                      Démarrer un Live Elite
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Predictive Analytics */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                    <CardTitle className="text-lg font-headline text-white">
                      Predictive Analytics
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Demand Forecasting */}
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-5 w-5 text-green-400" />
                        <span className="text-white font-medium">Demand Forecasting</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/70">Cette semaine</span>
                          <span className="text-green-400 font-medium">+15% demandes</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/70">Meilleur jour</span>
                          <span className="text-white font-medium">Samedi</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/70">Pic horaire</span>
                          <span className="text-white font-medium">14h-16h</span>
                        </div>
                      </div>
                    </div>

                    {/* Competitor Benchmarking */}
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-5 w-5 text-[#fdc34d]" />
                        <span className="text-white font-medium">Competitor Benchmarking</span>
                      </div>
                      <div className="space-y-2">
                        {COMPETITOR_DATA.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className={item.name === "Vous (Elite)" ? "text-[#fdc34d]" : "text-white/70"}>
                              {item.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-white/50">{item.rating} ★</span>
                              <span className={item.name === "Vous (Elite)" ? "text-[#fdc34d] font-medium" : "text-white/50"}>
                                {(item.revenue / 1000).toFixed(0)}k
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Planning */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-headline text-white">
                      Planning de la semaine
                    </CardTitle>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      <Radio className="h-3 w-3 mr-1" />
                      3 Lives programmés
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {WEEKLY_PLANNING.map((day, index) => (
                      <div
                        key={index}
                        className={cn(
                          "text-center p-3 rounded-xl transition-colors relative",
                          index === 0 ? "bg-[#fdc34d] text-[#001e40]" : "bg-white/5 hover:bg-white/10",
                          day.hasLive && "ring-2 ring-red-400"
                        )}
                      >
                        {day.hasLive && (
                          <div className="absolute -top-1 -right-1 flex items-center gap-0.5">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          </div>
                        )}
                        <p className={cn("text-xs", index === 0 ? "text-[#001e40]/70" : "text-white/50")}>
                          {day.day}
                        </p>
                        <p className="text-lg font-bold">{day.date}</p>
                        <div className="mt-2">
                          <span className={cn(
                            "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                            index === 0 ? "bg-[#001e40]/20 text-[#001e40]" : "bg-[#fdc34d]/20 text-[#fdc34d]"
                          )}>
                            {day.reservations}
                          </span>
                        </div>
                        {day.hasLive && (
                          <p className="text-[8px] text-red-400 mt-1 truncate">{day.liveTitle}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Balance Widget */}
              <Card className="bg-gradient-to-br from-[#fdc34d] to-[#7b5800] text-[#001e40]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[#001e40]/70 text-sm">Solde disponible</p>
                      <p className="text-3xl font-bold">{(STATS.revenueMTD / 1000).toFixed(0)}.000 FCFA</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#001e40]/70">Commission</p>
                      <p className="font-bold">5%</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-2 bg-white/20 rounded-lg text-center">
                      <p className="text-xs text-[#001e40]/70">Ce mois</p>
                      <p className="font-bold">{(STATS.revenueMTD / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="p-2 bg-white/20 rounded-lg text-center">
                      <p className="text-xs text-[#001e40]/70">Live Revenue</p>
                      <p className="font-bold">{(STATS.liveRevenue / 1000).toFixed(0)}k</p>
                    </div>
                  </div>
                  <Button className="w-full bg-[#001e40] text-white hover:bg-[#001e40]/90">
                    Retirer
                  </Button>
                </CardContent>
              </Card>

              {/* Expansion & Certifications */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-headline text-white">
                    Expansion & Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {CERTIFICATIONS.map((cert, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          cert.status === "active" ? "bg-green-500/20" : "bg-amber-500/20"
                        )}>
                          <cert.icon className={cn(
                            "h-5 w-5",
                            cert.status === "active" ? "text-green-400" : "text-amber-400"
                          )} />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{cert.name}</p>
                          <p className={cn(
                            "text-xs",
                            cert.status === "active" ? "text-green-400" : "text-amber-400"
                          )}>
                            {cert.status === "active" ? "Actif" : "En attente"}
                          </p>
                        </div>
                        {cert.status === "active" && <CheckCircle className="h-5 w-5 text-green-400" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Summary */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-headline text-white">
                    Performance Elite
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-white/70">Taux de conversion</span>
                        <span className="font-bold text-[#fdc34d]">{STATS.conversionRate}%</span>
                      </div>
                      <Progress value={STATS.conversionRate * 8} className="h-2 bg-white/10" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-white/70">Note moyenne</span>
                        <span className="font-bold text-[#fdc34d] flex items-center gap-1">
                          {STATS.avgRating} <Star className="h-4 w-4 fill-[#fdc34d] text-[#fdc34d]" />
                        </span>
                      </div>
                      <Progress value={STATS.avgRating * 20} className="h-2 bg-white/10" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-white/70">Clients totaux</span>
                        <span className="font-bold text-white">{STATS.totalClients}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/provider/services">
                      <Button variant="outline" className="w-full h-auto py-3 flex flex-col gap-1 bg-white/5 border-white/20 text-white hover:bg-white/10">
                        <Settings className="h-5 w-5" />
                        <span className="text-xs">Services</span>
                      </Button>
                    </Link>
                    <Link href="/provider/analytics">
                      <Button variant="outline" className="w-full h-auto py-3 flex flex-col gap-1 bg-white/5 border-white/20 text-white hover:bg-white/10">
                        <BarChart3 className="h-5 w-5" />
                        <span className="text-xs">Analytics</span>
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
      <nav className="fixed bottom-0 left-0 right-0 bg-[#001e40]/90 backdrop-blur-xl border-t border-white/10 md:hidden z-50">
        <div className="flex items-center justify-around py-2">
          <Link href="/provider/elite" className="flex flex-col items-center gap-1 p-2 text-[#fdc34d]">
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-medium">Accueil</span>
          </Link>
          <Link href="/provider/reservations" className="flex flex-col items-center gap-1 p-2 text-white/50">
            <Calendar className="h-5 w-5" />
            <span className="text-[10px]">RDV</span>
          </Link>
          <Link href="/provider/lives" className="flex flex-col items-center gap-1 p-2 text-white/50">
            <Radio className="h-5 w-5" />
            <span className="text-[10px]">Live</span>
          </Link>
          <Link href="/provider/messages" className="flex flex-col items-center gap-1 p-2 text-white/50 relative">
            <MessageCircle className="h-5 w-5" />
            <span className="text-[10px]">Messages</span>
          </Link>
          <Link href="/provider/settings" className="flex flex-col items-center gap-1 p-2 text-white/50">
            <Settings className="h-5 w-5" />
            <span className="text-[10px]">Paramètres</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
