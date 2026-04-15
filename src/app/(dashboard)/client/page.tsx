"use client";

import * as React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Search,
  Bell,
  MessageCircle,
  Calendar,
  Star,
  Wallet,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Clock,
  Shield,
  Gift,
  Headphones,
  Filter,
  Heart,
  Home,
  User,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { PartnerNotification } from "@/components/partners/PartnerMarquee";

// Mock data
const MOCK_BALANCE = 45000;

const UPCOMING_RESERVATIONS = [
  {
    id: "1",
    providerName: "Plomberie Express",
    providerAvatar: "https://i.pravatar.cc/100?img=11",
    service: "Réparation fuite d'eau",
    date: "Aujourd'hui, 14:00",
    duration: "2h",
    address: "Cocody, Rue des Jardins",
    price: 25000,
    status: "CONFIRMED",
    statusLabel: "Confirmée",
    isVerified: true,
    rating: 4.9,
  },
  {
    id: "2",
    providerName: "Électro Pro",
    providerAvatar: "https://i.pravatar.cc/100?img=12",
    service: "Installation tableau électrique",
    date: "Demain, 09:00",
    duration: "4h",
    address: "Marcory, Zone 4",
    price: 75000,
    status: "PENDING",
    statusLabel: "En attente",
    isVerified: true,
    rating: 4.7,
  },
  {
    id: "3",
    providerName: "Ménage Plus",
    providerAvatar: "https://i.pravatar.cc/100?img=13",
    service: "Grand ménage mensuel",
    date: "Samedi, 08:00",
    duration: "3h",
    address: "Plateau, Rue Commerce",
    price: 35000,
    status: "CONFIRMED",
    statusLabel: "Confirmée",
    isVerified: false,
    rating: 4.5,
  },
];

const RECOMMENDED_PROVIDERS = [
  {
    id: "1",
    name: "Plomberie Express",
    avatar: "https://i.pravatar.cc/100?img=11",
    service: "Plomberie",
    rating: 4.9,
    reviews: 156,
    price: "À partir de 15 000 FCFA",
    isVerified: true,
    isPremium: true,
    distance: "2.5 km",
  },
  {
    id: "2",
    name: "Électro Pro Services",
    avatar: "https://i.pravatar.cc/100?img=12",
    service: "Électricité",
    rating: 4.8,
    reviews: 98,
    price: "À partir de 20 000 FCFA",
    isVerified: true,
    isPremium: false,
    distance: "3.2 km",
  },
  {
    id: "3",
    name: "Climatisation Expert",
    avatar: "https://i.pravatar.cc/100?img=15",
    service: "Climatisation",
    rating: 4.7,
    reviews: 67,
    price: "À partir de 25 000 FCFA",
    isVerified: true,
    isPremium: true,
    distance: "1.8 km",
  },
  {
    id: "4",
    name: "Peinture Pro",
    avatar: "https://i.pravatar.cc/100?img=16",
    service: "Peinture",
    rating: 4.6,
    reviews: 45,
    price: "À partir de 30 000 FCFA",
    isVerified: false,
    isPremium: false,
    distance: "4.1 km",
  },
];

const CURRENT_OFFERS = [
  {
    id: "1",
    title: "-20% sur votre première réservation",
    description: "Nouveaux clients uniquement",
    code: "BIENVENUE20",
    expiresAt: "Expire dans 3 jours",
    color: "from-[#001e40] to-[#003366]",
  },
  {
    id: "2",
    title: "Offre Spéciale Plomberie",
    description: "Intervention urgente à tarif réduit",
    code: "PLOMBERIE15",
    expiresAt: "Expire dans 5 jours",
    color: "from-[#7b5800] to-[#a67c00]",
  },
  {
    id: "3",
    title: "Pack Ménage Premium",
    description: "3 prestations au prix de 2",
    code: "PACK3",
    expiresAt: "Expire dans 7 jours",
    color: "from-emerald-600 to-teal-600",
  },
];

const RECENT_DISCUSSIONS = [
  {
    id: "1",
    providerName: "Plomberie Express",
    providerAvatar: "https://i.pravatar.cc/100?img=11",
    lastMessage: "Parfait, je serai là à 14h comme prévu.",
    timestamp: "Il y a 5 min",
    unread: 2,
  },
  {
    id: "2",
    providerName: "Électro Pro",
    providerAvatar: "https://i.pravatar.cc/100?img=12",
    lastMessage: "Voici le devis pour l'installation.",
    timestamp: "Il y a 1h",
    unread: 0,
  },
  {
    id: "3",
    providerName: "Ménage Plus",
    providerAvatar: "https://i.pravatar.cc/100?img=13",
    lastMessage: "Merci pour votre confiance !",
    timestamp: "Hier",
    unread: 0,
  },
];

const CATEGORIES = [
  { id: "all", label: "Toutes catégories" },
  { id: "plomberie", label: "Plomberie" },
  { id: "electricite", label: "Électricité" },
  { id: "menage", label: "Ménage" },
  { id: "climatisation", label: "Climatisation" },
  { id: "peinture", label: "Peinture" },
];

export default function ClientDashboardPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [minRating, setMinRating] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [offerIndex, setOfferIndex] = useState(0);

  // Compute greeting based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };
  const greeting = getGreeting();

  const userName = user?.fullName?.split(" ")[0] || "Amadou";

  const nextOffer = () => {
    setOfferIndex((prev) => (prev + 1) % CURRENT_OFFERS.length);
  };

  const prevOffer = () => {
    setOfferIndex((prev) => (prev - 1 + CURRENT_OFFERS.length) % CURRENT_OFFERS.length);
  };

  return (
    <div className="min-h-screen bg-[#f4faff]">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel shadow-ambient">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-premium-gradient flex items-center justify-center">
                <span className="text-white font-bold text-lg font-headline">A</span>
              </div>
              <span className="text-xl font-bold text-[#001e40] hidden sm:block font-headline">
                Allo Services
              </span>
            </Link>

            {/* Desktop Search */}
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un service, prestataire..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 bg-white/80 border-gray-200 focus:border-[#001e40]"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Balance */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm">
                <Wallet className="h-4 w-4 text-[#7b5800]" />
                <span className="text-sm font-semibold text-gray-900">
                  {(MOCK_BALANCE / 1000).toFixed(0)}k FCFA
                </span>
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative hover:bg-white/50">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#fdc34d] rounded-full text-[10px] font-bold text-[#7b5800] flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* Messages */}
              <Link href="/client/messages">
                <Button variant="ghost" size="icon" className="relative hover:bg-white/50">
                  <MessageCircle className="h-5 w-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#001e40] rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                    2
                  </span>
                </Button>
              </Link>

              {/* Avatar */}
              <Avatar className="h-9 w-9 border-2 border-[#001e40] cursor-pointer">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className="bg-[#001e40] text-white text-sm font-bold">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Partner Notifications - Shows after 3h of session */}
          <PartnerNotification />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Welcome Section */}
              <div className="glass-panel rounded-2xl p-6 shadow-ambient">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-[#001e40] font-headline">
                      {greeting}, {userName} !
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Trouvez les meilleurs prestataires pour vos besoins
                    </p>
                  </div>
                  <Badge className="bg-[#00460e] text-white gap-1.5 px-3 py-1">
                    <Shield className="h-3.5 w-3.5" />
                    Compte vérifié
                  </Badge>
                </div>
              </div>

              {/* Hero Search Bar with Filters */}
              <div className="glass-panel rounded-2xl p-6 shadow-ambient">
                <div className="flex flex-col gap-4">
                  {/* Main Search Input */}
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Que recherchez-vous ? Plomberie, électricité, ménage..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-12 h-12 text-base bg-white border-gray-200 focus:border-[#001e40]"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <SlidersHorizontal className={cn("h-5 w-5", showFilters ? "text-[#001e40]" : "text-gray-400")} />
                    </Button>
                  </div>

                  {/* Filters */}
                  {showFilters && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4 border-t border-gray-200">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Disponibilité" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">Aujourd'hui</SelectItem>
                          <SelectItem value="tomorrow">Demain</SelectItem>
                          <SelectItem value="week">Cette semaine</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={budgetRange} onValueChange={setBudgetRange}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Budget" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Moins de 20k FCFA</SelectItem>
                          <SelectItem value="medium">20k - 50k FCFA</SelectItem>
                          <SelectItem value="high">Plus de 50k FCFA</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={minRating} onValueChange={setMinRating}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Note min." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4.5">4.5+ ★</SelectItem>
                          <SelectItem value="4">4+ ★</SelectItem>
                          <SelectItem value="3.5">3.5+ ★</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant={verifiedOnly ? "default" : "outline"}
                        className={cn(
                          "h-10",
                          verifiedOnly && "bg-[#001e40] hover:bg-[#003366]"
                        )}
                        onClick={() => setVerifiedOnly(!verifiedOnly)}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Vérifiés
                      </Button>
                    </div>
                  )}

                  <Button className="w-full h-12 bg-[#001e40] hover:bg-[#003366] text-white">
                    <Search className="h-5 w-5 mr-2" />
                    Rechercher
                  </Button>
                </div>
              </div>

              {/* Quick Dashboard Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Link href="/client/reservations">
                  <Card className="glass-panel shadow-ambient hover:shadow-ambient-lg transition-shadow cursor-pointer group">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-[#001e40]/10 flex items-center justify-center group-hover:bg-[#001e40]/20 transition-colors">
                        <Calendar className="h-6 w-6 text-[#001e40]" />
                      </div>
                      <p className="text-2xl font-bold text-[#001e40]">3</p>
                      <p className="text-xs text-gray-500">Réservations</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/client/messages">
                  <Card className="glass-panel shadow-ambient hover:shadow-ambient-lg transition-shadow cursor-pointer group">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-[#7b5800]/10 flex items-center justify-center group-hover:bg-[#7b5800]/20 transition-colors">
                        <MessageCircle className="h-6 w-6 text-[#7b5800]" />
                      </div>
                      <p className="text-2xl font-bold text-[#7b5800]">5</p>
                      <p className="text-xs text-gray-500">Messages</p>
                    </CardContent>
                  </Card>
                </Link>
                <Card className="glass-panel shadow-ambient">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-[#fdc34d]/20 flex items-center justify-center">
                      <Star className="h-6 w-6 text-[#7b5800]" />
                    </div>
                    <p className="text-2xl font-bold text-[#7b5800]">4.8</p>
                    <p className="text-xs text-gray-500">Note Moyenne</p>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Reservations */}
              <div className="glass-panel rounded-2xl shadow-ambient overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#001e40] font-headline">
                    Vos prochaines prestations
                  </h2>
                  <Link href="/client/reservations" className="text-sm text-[#001e40] flex items-center hover:underline">
                    Voir tout <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {UPCOMING_RESERVATIONS.map((reservation) => (
                    <div key={reservation.id} className="p-4 hover:bg-white/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                          <AvatarImage src={reservation.providerAvatar} />
                          <AvatarFallback className="bg-[#001e40] text-white">
                            {reservation.providerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">
                                {reservation.providerName}
                              </p>
                              {reservation.isVerified && (
                                <Shield className="h-4 w-4 text-[#00460e] shrink-0" />
                              )}
                            </div>
                            <Badge
                              variant="outline"
                              className={cn(
                                "shrink-0",
                                reservation.status === "CONFIRMED"
                                  ? "bg-[#00460e]/10 text-[#00460e] border-[#00460e]/20"
                                  : "bg-[#7b5800]/10 text-[#7b5800] border-[#7b5800]/20"
                              )}
                            >
                              {reservation.statusLabel}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-0.5">{reservation.service}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{reservation.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              <span className="truncate max-w-[150px]">{reservation.address}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-[#001e40]">
                            {(reservation.price / 1000).toFixed(0)}k
                          </p>
                          <p className="text-xs text-gray-500">FCFA</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Providers */}
              <div className="glass-panel rounded-2xl shadow-ambient overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#001e40] font-headline">
                    Sélectionnés pour vous
                  </h2>
                  <Link href="/providers" className="text-sm text-[#001e40] flex items-center hover:underline">
                    Voir plus <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                  {RECOMMENDED_PROVIDERS.map((provider) => (
                    <Link key={provider.id} href={`/providers/${provider.id}`}>
                      <Card className="h-full bg-white hover:shadow-ambient-lg transition-all cursor-pointer group">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <Avatar className="h-14 w-14 border-2 border-white shadow-md">
                                <AvatarImage src={provider.avatar} />
                                <AvatarFallback className="bg-[#001e40] text-white">
                                  {provider.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {provider.isVerified && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#00460e] flex items-center justify-center">
                                  <Shield className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900 truncate group-hover:text-[#001e40]">
                                  {provider.name}
                                </p>
                                {provider.isPremium && (
                                  <Badge className="bg-gradient-to-r from-[#7b5800] to-[#a67c00] text-white text-[10px] px-1.5 py-0.5">
                                    Premium
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">{provider.service}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-[#fdc34d] fill-[#fdc34d]" />
                                  <span className="text-sm font-medium">{provider.rating}</span>
                                  <span className="text-xs text-gray-400">({provider.reviews})</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <MapPin className="h-3 w-3" />
                                  {provider.distance}
                                </div>
                              </div>
                              <p className="text-sm text-[#001e40] font-medium mt-2">
                                {provider.price}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="hidden lg:block space-y-6">
              {/* Current Offers Carousel */}
              <Card className="glass-panel shadow-ambient overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-headline text-[#001e40]">
                    Offres du moment
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className={cn(
                    "rounded-xl p-4 text-white bg-gradient-to-br",
                    CURRENT_OFFERS[offerIndex].color
                  )}>
                    <h3 className="font-bold text-lg">{CURRENT_OFFERS[offerIndex].title}</h3>
                    <p className="text-sm text-white/80 mt-1">{CURRENT_OFFERS[offerIndex].description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <code className="bg-white/20 px-2 py-1 rounded text-sm font-mono">
                        {CURRENT_OFFERS[offerIndex].code}
                      </code>
                      <span className="text-xs text-white/70">{CURRENT_OFFERS[offerIndex].expiresAt}</span>
                    </div>
                  </div>
                  {CURRENT_OFFERS.length > 1 && (
                    <div className="flex items-center justify-between mt-3">
                      <Button variant="ghost" size="icon" onClick={prevOffer} className="h-8 w-8">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex gap-1">
                        {CURRENT_OFFERS.map((_, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "w-2 h-2 rounded-full transition-colors",
                              idx === offerIndex ? "bg-[#001e40]" : "bg-gray-300"
                            )}
                          />
                        ))}
                      </div>
                      <Button variant="ghost" size="icon" onClick={nextOffer} className="h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Discussions */}
              <Card className="glass-panel shadow-ambient">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-headline text-[#001e40]">
                      Discussions récentes
                    </CardTitle>
                    <Link href="/client/messages" className="text-xs text-[#001e40] hover:underline">
                      Voir tout
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {RECENT_DISCUSSIONS.map((discussion) => (
                      <Link key={discussion.id} href={`/client/messages/${discussion.id}`}>
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors cursor-pointer">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={discussion.providerAvatar} />
                            <AvatarFallback className="bg-[#001e40] text-white text-xs">
                              {discussion.providerName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm text-gray-900 truncate">
                                {discussion.providerName}
                              </p>
                              <span className="text-xs text-gray-400 shrink-0">
                                {discussion.timestamp}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 truncate">{discussion.lastMessage}</p>
                          </div>
                          {discussion.unread > 0 && (
                            <span className="w-5 h-5 rounded-full bg-[#001e40] text-white text-xs flex items-center justify-center shrink-0">
                              {discussion.unread}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Loyalty Program */}
              <Card className="glass-panel shadow-ambient">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-headline text-[#001e40]">
                    Programme de fidélité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                      <Gift className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Niveau Argent</p>
                      <p className="text-xs text-gray-500">250 points jusqu'au niveau Or</p>
                    </div>
                  </div>
                  <Progress value={60} className="h-2" />
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>750 points</span>
                    <span>1000 points (Or)</span>
                  </div>
                  <div className="mt-4 p-3 bg-[#7b5800]/10 rounded-lg">
                    <p className="text-xs text-[#7b5800]">
                      <strong>Conseil:</strong> Réservez 3 prestations ce mois pour gagner 50 points bonus !
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Support */}
              <Card className="glass-panel shadow-ambient bg-gradient-to-br from-[#001e40] to-[#003366]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <Headphones className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Besoin d'aide ?</p>
                      <p className="text-xs text-white/70">Notre équipe est là pour vous</p>
                    </div>
                  </div>
                  <Button className="w-full mt-3 bg-white text-[#001e40] hover:bg-gray-100">
                    Contacter le support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-panel border-t border-gray-100 md:hidden z-50">
        <div className="flex items-center justify-around py-2">
          <Link href="/client" className="flex flex-col items-center gap-1 p-2 text-[#001e40]">
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-medium">Accueil</span>
          </Link>
          <Link href="/client/reservations" className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <Calendar className="h-5 w-5" />
            <span className="text-[10px]">Réservations</span>
          </Link>
          <Link href="/providers" className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <Search className="h-5 w-5" />
            <span className="text-[10px]">Rechercher</span>
          </Link>
          <Link href="/client/messages" className="flex flex-col items-center gap-1 p-2 text-gray-400 relative">
            <MessageCircle className="h-5 w-5" />
            <span className="text-[10px]">Messages</span>
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#001e40] rounded-full text-[10px] text-white flex items-center justify-center">
              2
            </span>
          </Link>
          <Link href="/client/profile" className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <User className="h-5 w-5" />
            <span className="text-[10px]">Profil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
