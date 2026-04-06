"use client";

import * as React from "react";
import Link from "next/link";
import {
  Megaphone,
  Target,
  TrendingUp,
  Users,
  Smartphone,
  BarChart3,
  Zap,
  Shield,
  Check,
  ArrowRight,
  Play,
  Star,
  MapPin,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Formats publicitaires
const AD_FORMATS = [
  {
    icon: Smartphone,
    title: "Bannières Mobile",
    description: "Affiches publicitaires dans l'application mobile",
    features: ["Visibilité maximale", "Ciblage géographique", "Format adaptatif"],
    popular: false,
  },
  {
    icon: Target,
    title: "Sponsorisation Prestataire",
    description: "Mettez en avant vos prestataires partenaires",
    features: ["Position prioritaire", "Badge \"Recommandé\"", "Augmentation des réservations"],
    popular: true,
  },
  {
    icon: Play,
    title: "Vidéos Promotionnelles",
    description: "Diffusez vos vidéos avant les contenus",
    features: ["Engagement élevé", "Format storytelling", "Skip after 5s"],
    popular: false,
  },
  {
    icon: Users,
    title: "Push Notifications",
    description: "Messages push ciblés vers les utilisateurs",
    features: ["Taux d'ouverture 40%+", "Ciblage précis", "Planification flexible"],
    popular: false,
  },
];

// Statistiques de la plateforme
const PLATFORM_STATS = [
  { value: "50K+", label: "Utilisateurs actifs" },
  { value: "5K+", label: "Prestataires vérifiés" },
  { value: "100K+", label: "Réservations/mois" },
  { value: "15+", label: "Villes couvertes" },
];

// Avantages
const BENEFITS = [
  {
    icon: Target,
    title: "Ciblage précis",
    description:
      "Ciblez votre audience par localisation, catégories de services, comportement d'achat et plus encore.",
  },
  {
    icon: TrendingUp,
    title: "ROI mesurable",
    description:
      "Suivez en temps réel les performances de vos campagnes : impressions, clics, conversions et coût par acquisition.",
  },
  {
    icon: Zap,
    title: "Démarrage rapide",
    description:
      "Lancez votre campagne en quelques minutes. Notre équipe vous accompagne dans la création de vos annonces.",
  },
  {
    icon: Shield,
    title: "Environnement sécurisé",
    description:
      "Votre marque est diffusée dans un environnement de confiance, aux côtés de prestataires vérifiés.",
  },
];

// Témoignages
const TESTIMONIALS = [
  {
    company: "BricoPro CI",
    logo: "🔧",
    quote:
      "Grâce à la sponsorisation, nos réservations ont augmenté de 300% en 3 mois. Excellent retour sur investissement !",
    author: "Konan Yao",
    role: "Directeur Marketing",
  },
  {
    company: "Beauty Home Services",
    logo: "💇",
    quote:
      "Le ciblage géographique nous a permis d'atteindre exactement notre clientèle cible à Cocody et Riviera.",
    author: "Aminata Diallo",
    role: "Fondatrice",
  },
];

// Tarifs
const PRICING_PLANS = [
  {
    name: "Starter",
    price: "50 000",
    period: "/mois",
    description: "Idéal pour tester la publicité",
    features: [
      "50 000 impressions",
      "1 format publicitaire",
      "Ciblage géographique",
      "Rapport mensuel",
      "Support email",
    ],
    cta: "Commencer",
    popular: false,
  },
  {
    name: "Business",
    price: "150 000",
    period: "/mois",
    description: "Pour les entreprises en croissance",
    features: [
      "200 000 impressions",
      "3 formats publicitaires",
      "Ciblage avancé",
      "Rapport hebdomadaire",
      "Manager dédié",
      "A/B Testing",
    ],
    cta: "Choisir ce plan",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Sur mesure",
    period: "",
    description: "Solutions sur mesure",
    features: [
      "Impressions illimitées",
      "Tous les formats",
      "API d'intégration",
      "Rapport temps réel",
      "Équipe dédiée",
      "Partenariat stratégique",
    ],
    cta: "Nous contacter",
    popular: false,
  },
];

export default function PublicitePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-white/20 text-white mb-4">
                <Megaphone className="h-3 w-3 mr-1" />
                Publicité
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Touchez des milliers de clients potentiels en Côte d&apos;Ivoire
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Allo Services CI vous offre un accès unique à une audience qualifiée à la recherche de services locaux.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/help/contact?type=advertising">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-white/90">
                    Demander un devis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Voir les tarifs
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {PLATFORM_STATS.map((stat, index) => (
                <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardContent className="pt-6 text-center">
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-white/80">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">Pourquoi publiciter sur Allo Services CI ?</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Une plateforme de confiance dédiée aux services locaux en Côte d&apos;Ivoire
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((benefit, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Formats */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">Formats publicitaires</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Choisissez le format adapté à vos objectifs marketing
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {AD_FORMATS.map((format, index) => (
              <Card
                key={index}
                className={`border-gray-200 relative ${format.popular ? "ring-2 ring-orange-500" : ""}`}
              >
                {format.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white">
                    Populaire
                  </Badge>
                )}
                <CardHeader>
                  <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center mb-3">
                    <format.icon className="h-5 w-5 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">{format.title}</CardTitle>
                  <CardDescription>{format.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {format.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">Tarifs simples et transparents</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Des forfaits adaptés à tous les budgets, sans surprise
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan, index) => (
              <Card
                key={index}
                className={`border-gray-200 relative ${plan.popular ? "ring-2 ring-orange-500" : ""}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white">
                    Le plus choisi
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/help/contact?type=advertising">
                    <Button
                      className={`w-full ${plan.popular ? "bg-orange-500 hover:bg-orange-600" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Ce que disent nos partenaires</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{testimonial.logo}</span>
                    <div>
                      <p className="font-semibold">{testimonial.company}</p>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic mb-4">&quot;{testimonial.quote}&quot;</p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <Megaphone className="h-12 w-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">
            Prêt à développer votre visibilité ?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Contactez notre équipe commerciale pour discuter de vos besoins et obtenir un devis personnalisé.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/help/contact?type=advertising">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Demander un devis gratuit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Voir les exemples de campagnes
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Mini */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-center mb-8">Questions fréquentes</h2>

          <div className="space-y-4">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-base">Quel est le budget minimum pour une campagne ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Le budget minimum est de 50 000 XOF/mois pour le forfait Starter. Nous proposons des solutions adaptées à tous les budgets.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-base">Comment mesurez-vous les performances ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Vous recevez des rapports détaillés avec les impressions, clics, taux de conversion et coût par acquisition. Un tableau de bord temps réel est disponible pour les forfaits Business et Enterprise.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-base">Puis-je cibler une zone géographique précise ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Oui, vous pouvez cibler par ville, commune, quartier ou rayon autour d&apos;un point précis. Le ciblage peut également inclure des critères démographiques et comportementaux.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
