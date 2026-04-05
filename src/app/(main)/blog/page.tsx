"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for blog articles
const FEATURED_ARTICLE = {
  id: "featured-1",
  title: "Comment choisir un prestataire de confiance à Abidjan?",
  excerpt: "Découvrez les critères essentiels pour sélectionner le meilleur prestataire de services pour vos besoins domestiques et professionnels.",
  author: "Jean-Marc Kouadio",
  authorAvatar: "https://i.pravatar.cc/100?img=12",
  readTime: "8 min",
  category: "À LA UNE",
  image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=600&fit=crop",
  createdAt: "2024-10-15",
};

const ARTICLES = [
  {
    id: "1",
    title: "5 astuces pour entretenir votre jardin en saison des pluies",
    excerpt: "Prévenez l'érosion et protégez vos plantes tropicales avec nos conseils d'experts locaux pour faire face aux intempéries.",
    author: "Awa Moussa",
    authorAvatar: "https://i.pravatar.cc/100?img=5",
    authorInitials: "AM",
    readTime: "5 min",
    category: "ASTUCES",
    categoryColor: "bg-green-100 text-green-800",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
  },
  {
    id: "2",
    title: "Pourquoi externaliser le ménage de vos bureaux ?",
    excerpt: "Découvrez comment une équipe professionnelle peut transformer la productivité de vos employés grâce à un environnement sain.",
    author: "David Sylla",
    authorAvatar: "https://i.pravatar.cc/100?img=8",
    authorInitials: "DS",
    readTime: "12 min",
    category: "SERVICES",
    categoryColor: "bg-blue-100 text-blue-800",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
  },
  {
    id: "3",
    title: "Maintenance clim : le guide complet pour les particuliers",
    excerpt: "Tout ce qu'il faut savoir pour prolonger la durée de vie de vos climatiseurs et réduire votre facture d'électricité.",
    author: "Marie Traoré",
    authorAvatar: "https://i.pravatar.cc/100?img=9",
    authorInitials: "MT",
    readTime: "6 min",
    category: "CONSEILS",
    categoryColor: "bg-orange-100 text-orange-800",
    image: "https://images.unsplash.com/photo-1631545806609-a5e6b6b4e0d2?w=600&h=400&fit=crop",
  },
  {
    id: "4",
    title: "Les avantages du service à domicile post-Covid",
    excerpt: "Comment la pandémie a transformé nos habitudes et popularisé les services à domicile en Côte d'Ivoire.",
    author: "Yao Koné",
    authorAvatar: "https://i.pravatar.cc/100?img=11",
    authorInitials: "YK",
    readTime: "7 min",
    category: "ACTUALITÉS",
    categoryColor: "bg-purple-100 text-purple-800",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
  },
  {
    id: "5",
    title: "Comment préparer votre maison pour l'intervention d'un prestataire",
    excerpt: "Les étapes à suivre pour une collaboration efficace avec votre plombier, électricien ou agent de ménage.",
    author: "Fatou Diallo",
    authorAvatar: "https://i.pravatar.cc/100?img=20",
    authorInitials: "FD",
    readTime: "4 min",
    category: "CONSEILS",
    categoryColor: "bg-orange-100 text-orange-800",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
  },
  {
    id: "6",
    title: "Top 10 des services les plus demandés à Abidjan en 2024",
    excerpt: "Découvrez les tendances du marché des services à domicile dans la capitale économique ivoirienne.",
    author: "Ibrahim Sanogo",
    authorAvatar: "https://i.pravatar.cc/100?img=15",
    authorInitials: "IS",
    readTime: "10 min",
    category: "ACTUALITÉS",
    categoryColor: "bg-purple-100 text-purple-800",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
  },
];

const CATEGORIES = [
  { id: "all", label: "Tous les articles" },
  { id: "conseils", label: "Conseils" },
  { id: "services", label: "Services" },
  { id: "astuces", label: "Astuces" },
  { id: "actualites", label: "Actualités" },
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [email, setEmail] = React.useState("");

  const filteredArticles = ARTICLES.filter((article) => {
    if (activeCategory === "all") return true;
    return article.category.toLowerCase().includes(activeCategory);
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <Badge className="bg-[#fd7613] text-white text-xs uppercase tracking-widest mb-4">
              L&apos;Actualité des Services
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4">
              Le Mag <span className="text-primary italic">Allo</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Conseils, astuces et actualités sur les services à domicile en Côte d&apos;Ivoire
            </p>
          </div>
          <div className="w-full md:w-80">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-full bg-muted border-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-8">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-6 whitespace-nowrap ${
                activeCategory === cat.id
                  ? "bg-primary text-white"
                  : "bg-white hover:bg-muted"
              }`}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Featured Article */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-16">
        <Link href={`/blog/${FEATURED_ARTICLE.id}`}>
          <Card className="overflow-hidden border-0 rounded-3xl group cursor-pointer">
            <div className="relative aspect-[21/9]">
              <Image
                src={FEATURED_ARTICLE.image}
                alt={FEATURED_ARTICLE.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-3xl">
                <Badge className="bg-[#fd7613] text-white text-xs uppercase tracking-wider mb-4">
                  {FEATURED_ARTICLE.category}
                </Badge>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                  {FEATURED_ARTICLE.title}
                </h2>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={FEATURED_ARTICLE.authorAvatar} />
                      <AvatarFallback>{FEATURED_ARTICLE.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-white">{FEATURED_ARTICLE.author}</span>
                  </div>
                  <span className="w-1 h-1 bg-white/40 rounded-full" />
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {FEATURED_ARTICLE.readTime} de lecture
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </section>

      {/* Article Grid */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <Link key={article.id} href={`/blog/${article.id}`}>
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`text-xs font-bold ${article.categoryColor}`}>
                      {article.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold leading-snug mb-3 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={article.authorAvatar} />
                        <AvatarFallback className="text-xs">{article.authorInitials}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-semibold">{article.author}</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-16">
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#006b3f] opacity-20 -skew-x-12 translate-x-1/2" />
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
                Restez informé des meilleurs services.
              </h2>
              <p className="text-white/80 text-lg">
                Inscrivez-vous à notre newsletter hebdomadaire pour recevoir nos astuces et offres exclusives.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-14 bg-white/10 border-white/20 rounded-full px-6 text-white placeholder:text-white/60 focus:ring-[#fd7613]"
              />
              <Button className="h-14 px-8 rounded-full bg-[#fd7613] hover:bg-[#e5650f] text-white font-bold whitespace-nowrap">
                S&apos;abonner
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
