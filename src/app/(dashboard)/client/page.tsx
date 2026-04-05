"use client";

import * as React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  Calendar,
  Star,
  MapPin,
  Clock,
  TrendingUp,
  Gift,
  Sparkles,
  ChevronRight,
  Zap,
  Shield,
  Heart,
  MessageCircle,
  Bell,
  Wallet,
  ArrowRight,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";

// Service categories avec icônes et couleurs
const SERVICE_CATEGORIES = [
  { id: "plomberie", name: "Plomberie", icon: "🔧", color: "from-teal-500 to-cyan-500", count: 245 },
  { id: "electricite", name: "Électricité", icon: "⚡", color: "from-amber-500 to-yellow-500", count: 189 },
  { id: "coiffure", name: "Coiffure", icon: "✂️", color: "from-pink-500 to-rose-500", count: 312 },
  { id: "menage", name: "Ménage", icon: "🏠", color: "from-violet-500 to-purple-500", count: 456 },
  { id: "jardinage", name: "Jardinage", icon: "🌿", color: "from-green-500 to-emerald-500", count: 134 },
  { id: "livraison", name: "Livraison", icon: "🚚", color: "from-blue-500 to-indigo-500", count: 567 },
  { id: "reparation", name: "Réparation", icon: "🛠️", color: "from-slate-500 to-gray-500", count: 223 },
  { id: "beaute", name: "Beauté", icon: "💅", color: "from-fuchsia-500 to-pink-500", count: 289 },
];

// Prestataires en vedette
const FEATURED_PROVIDERS = [
  {
    id: "1",
    name: "Plomberie Express",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    category: "Plomberie",
    rating: 4.9,
    reviews: 127,
    location: "Cocody",
    verified: true,
    premium: true,
    price: "15 000",
  },
  {
    id: "2",
    name: "Beauty Home Services",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    category: "Coiffure & Esthétique",
    rating: 5.0,
    reviews: 89,
    location: "Riviera",
    verified: true,
    premium: true,
    price: "10 000",
  },
  {
    id: "3",
    name: "Élec Pro CI",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    category: "Électricité",
    rating: 4.8,
    reviews: 156,
    location: "Marcory",
    verified: true,
    premium: false,
    price: "20 000",
  },
  {
    id: "4",
    name: "Ménage Premium",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    category: "Ménage",
    rating: 4.9,
    reviews: 234,
    location: "Plateau",
    verified: true,
    premium: true,
    price: "8 000",
  },
];

// Promotions du moment
const PROMOTIONS = [
  {
    id: "1",
    title: "-20% sur votre première réservation",
    description: "Profitez de 20% de réduction sur votre tout premier service réservé",
    code: "BIENVENUE20",
    color: "from-orange-500 to-red-500",
    expires: "Expire dans 3 jours",
  },
  {
    id: "2",
    title: "Pack Ménage Premium",
    description: "3 séances de ménage pour le prix de 2",
    code: "MENAGE3X2",
    color: "from-violet-500 to-purple-500",
    expires: "Offre limitée",
  },
];

// Réservations récentes
const RECENT_BOOKINGS = [
  {
    id: "1",
    service: "Plomberie",
    provider: "Plomberie Express",
    date: "Aujourd'hui, 14h00",
    status: "CONFIRMED",
    statusLabel: "Confirmée",
    price: "25 000 FCFA",
  },
  {
    id: "2",
    service: "Coiffure",
    provider: "Beauty Home",
    date: "Demain, 10h00",
    status: "PENDING",
    statusLabel: "En attente",
    price: "15 000 FCFA",
  },
];

export default function ClientHomePage() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Bonjour");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bonjour");
    else if (hour < 18) setGreeting("Bon après-midi");
    else setGreeting("Bonsoir");
  }, []);

  const userName = user?.fullName?.split(" ")[0] || "Cher client";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#004150] via-[#005a6e] to-[#004150]">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fd7613]/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#8ed0e7]/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-8 md:py-12">
          {/* Welcome Message */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-white/20">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-[#fd7613] text-white text-lg font-bold">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  {greeting}, {userName} !
                </h1>
                <p className="text-white/70 text-sm">Que souhaitez-vous faire aujourd'hui ?</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#fd7613] rounded-full text-[10px] flex items-center justify-center">
                  3
                </span>
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative bg-white rounded-2xl shadow-2xl shadow-black/20">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Rechercher un service, un prestataire..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 pr-32 border-0 rounded-2xl text-lg focus:ring-0 focus:outline-none"
              />
              <Button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#fd7613] hover:bg-[#e5650f] rounded-xl px-6">
                Rechercher
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <div className="p-2 bg-white/10 rounded-lg">
                <Calendar className="h-4 w-4" />
              </div>
              <span>2 réservations à venir</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <div className="p-2 bg-white/10 rounded-lg">
                <Wallet className="h-4 w-4" />
              </div>
              <span>245 000 FCFA dépensés</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <div className="p-2 bg-white/10 rounded-lg">
                <Heart className="h-4 w-4" />
              </div>
              <span>5 favoris</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/client/reservations/new" className="group">
            <Card className="h-full border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/70 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-5 text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#004150] to-[#005a6e] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="h-7 w-7 text-white" />
                </div>
                <p className="font-semibold text-gray-900">Réserver</p>
                <p className="text-xs text-gray-500 mt-1">Nouveau service</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/services" className="group">
            <Card className="h-full border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/70 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-5 text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#fd7613] to-[#f59542] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Search className="h-7 w-7 text-white" />
                </div>
                <p className="font-semibold text-gray-900">Explorer</p>
                <p className="text-xs text-gray-500 mt-1">Trouver un pro</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/client/favorites" className="group">
            <Card className="h-full border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/70 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-5 text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                <p className="font-semibold text-gray-900">Favoris</p>
                <p className="text-xs text-gray-500 mt-1">5 prestataires</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/client/reservations" className="group">
            <Card className="h-full border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/70 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-5 text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <p className="font-semibold text-gray-900">Mes RDV</p>
                <p className="text-xs text-gray-500 mt-1">2 à venir</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Service Categories */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Catégories de services</h2>
              <p className="text-sm text-gray-500">Trouvez le service dont vous avez besoin</p>
            </div>
            <Link href="/services" className="text-[#004150] font-semibold text-sm flex items-center hover:underline">
              Voir tout <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4 pb-4">
              {SERVICE_CATEGORIES.map((category) => (
                <Link key={category.id} href={`/services/${category.id}`} className="flex-shrink-0">
                  <Card className="w-36 border-0 shadow-md shadow-slate-200/50 hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardContent className="p-4 text-center">
                      <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                        {category.icon}
                      </div>
                      <p className="font-medium text-gray-900 text-sm">{category.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{category.count} pros</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        {/* Promotions */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Gift className="h-5 w-5 text-[#fd7613]" />
            <h2 className="text-xl font-bold text-gray-900">Offres spéciales</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {PROMOTIONS.map((promo) => (
              <Card key={promo.id} className="border-0 overflow-hidden">
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-r ${promo.color} p-6 text-white relative overflow-hidden`}>
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full" />
                    <Sparkles className="h-6 w-6 mb-2" />
                    <h3 className="text-lg font-bold mb-1">{promo.title}</h3>
                    <p className="text-sm text-white/80 mb-3">{promo.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="bg-white/20 rounded-lg px-3 py-1.5 text-sm font-mono font-bold">
                        {promo.code}
                      </div>
                      <span className="text-xs text-white/70">{promo.expires}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Providers */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Prestataires en vedette</h2>
              <p className="text-sm text-gray-500">Les mieux notés de la semaine</p>
            </div>
            <Link href="/providers" className="text-[#004150] font-semibold text-sm flex items-center hover:underline">
              Voir tout <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_PROVIDERS.map((provider) => (
              <Link key={provider.id} href={`/providers/${provider.id}`}>
                <Card className="h-full border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <CardContent className="p-5">
                    <div className="relative mb-4">
                      <Avatar className="h-16 w-16 border-2 border-white shadow-lg">
                        <AvatarImage src={provider.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-[#004150] to-[#005a6e] text-white text-xl">
                          {provider.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {provider.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                          <Shield className="h-3 w-3" />
                        </div>
                      )}
                      {provider.premium && (
                        <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-[10px] px-2 py-0.5">
                          PREMIUM
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#004150] transition-colors">
                      {provider.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{provider.category}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-gray-900">{provider.rating}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{provider.reviews} avis</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>{provider.location}</span>
                      </div>
                      <span className="text-sm font-semibold text-[#004150]">{provider.price} FCFA/h</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Bookings */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Mes réservations récentes</h2>
              <p className="text-sm text-gray-500">Suivez vos prestations</p>
            </div>
            <Link href="/client/reservations" className="text-[#004150] font-semibold text-sm flex items-center hover:underline">
              Voir tout <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-3">
            {RECENT_BOOKINGS.map((booking) => (
              <Card key={booking.id} className="border-0 shadow-md shadow-slate-200/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        booking.status === "CONFIRMED" 
                          ? "bg-green-100 text-green-600" 
                          : "bg-amber-100 text-amber-600"
                      }`}>
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{booking.service}</h3>
                        <p className="text-sm text-gray-500">{booking.provider}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{booking.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={booking.status === "CONFIRMED" ? "bg-green-500" : "bg-amber-500"}>
                        {booking.statusLabel}
                      </Badge>
                      <p className="text-sm font-semibold text-gray-900 mt-2">{booking.price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Trust Section */}
        <section className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-3xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Pourquoi nous faire confiance ?</h2>
            <p className="text-gray-500">Votre satisfaction est notre priorité</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Prestataires vérifiés</h3>
              <p className="text-sm text-gray-500">Tous nos prestataires passent par un processus de vérification rigoureux</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#fd7613] to-[#f59542] flex items-center justify-center">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Paiement sécurisé</h3>
              <p className="text-sm text-gray-500">Vos transactions sont protégées via Mobile Money</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Support 24/7</h3>
              <p className="text-sm text-gray-500">Notre équipe est disponible à tout moment pour vous aider</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
