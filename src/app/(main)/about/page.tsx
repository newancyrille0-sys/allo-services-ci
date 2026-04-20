"use client";

import * as React from "react";
import Link from "next/link";
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PLATFORM_STATS } from "@/lib/constants/mockData";
import { APP_CONFIG } from "@/lib/constants/config";

const values = [
  {
    icon: Heart,
    title: "Confiance",
    description:
      "Nous mettons la confiance au cœur de chaque interaction entre clients et prestataires.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "Nous visons l&apos;excellence dans la qualité des services proposés sur notre plateforme.",
  },
  {
    icon: Users,
    title: "Communauté",
    description:
      "Nous construisons une communauté solidaire de professionnels ivoiriens.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description:
      "Nous innovons constamment pour faciliter la mise en relation et améliorer l&apos;expérience utilisateur.",
  },
];

const milestones = [
  {
    year: "2023",
    title: "Création d'Allo Services CI",
    description:
      "Lancement de la plateforme avec une vision claire : révolutionner les services locaux en Côte d'Ivoire.",
  },
  {
    year: "2023",
    title: "500 premiers prestataires",
    description:
      "Atteinte du cap symbolique des 500 prestataires vérifiés sur la plateforme.",
  },
  {
    year: "2024",
    title: "Expansion nationale",
    description:
      "Déploiement dans les grandes villes du pays : Bouaké, Yamoussoukro, San-Pédro, Korhogo.",
  },
  {
    year: "2024",
    title: "2500+ prestataires",
    description:
      "Plus de 2500 prestataires actifs et 25000 réservations réalisées avec succès.",
  },
];

const team = [
  {
    name: "Kouamé Laurent",
    role: "CEO & Fondateur",
    description: "Entrepreneur passionné par l'innovation digitale en Afrique.",
  },
  {
    name: "Aminata Koné",
    role: "Directrice des Opérations",
    description: "Experte en gestion de services et relation client.",
  },
  {
    name: "Jean-Baptiste Yao",
    role: "Directeur Technique",
    description: "Ingénieur logiciel avec 10 ans d'expérience.",
  },
  {
    name: "Fatou Diallo",
    role: "Responsable Marketing",
    description: "Spécialiste en marketing digital et communication.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-blue-600 hover:text-blue-700">Accueil</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900">À propos</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Notre histoire
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Allo Services CI est né d&apos;une conviction simple : chaque Ivoirien mérite
            d&apos;avoir accès à des prestataires de services de qualité, vérifiés et
            proches de chez lui. Notre mission est de faciliter la mise en relation
            entre clients et professionnels pour créer des opportunités économiques
            et améliorer le quotidien de tous.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-white py-12 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border border-gray-200 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold mb-3 text-gray-900">Notre Mission</h2>
                <p className="text-gray-600">
                  Connecter les Ivoiriens aux meilleurs prestataires de services
                  locaux, en garantissant qualité, confiance et transparence dans
                  chaque interaction.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold mb-3 text-gray-900">Notre Vision</h2>
                <p className="text-gray-600">
                  Devenir la première plateforme de services en Afrique de l&apos;Ouest,
                  reconnue pour son impact social et économique sur les communautés
                  locales.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Nos valeurs</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <Card key={value.title} className="text-center hover:shadow-lg transition-shadow bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <value.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2 text-gray-900">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-blue-600 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-white mb-8">
            Allo Services CI en chiffres
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center text-white">
              <p className="text-4xl font-bold mb-2">
                {PLATFORM_STATS.totalProviders.toLocaleString('fr-FR')}+
              </p>
              <p className="text-blue-100">Prestataires</p>
            </div>
            <div className="text-center text-white">
              <p className="text-4xl font-bold mb-2">
                {PLATFORM_STATS.satisfiedClients.toLocaleString('fr-FR')}+
              </p>
              <p className="text-blue-100">Clients satisfaits</p>
            </div>
            <div className="text-center text-white">
              <p className="text-4xl font-bold mb-2">{PLATFORM_STATS.citiesCovered}</p>
              <p className="text-blue-100">Villes couvertes</p>
            </div>
            <div className="text-center text-white">
              <p className="text-4xl font-bold mb-2">
                {PLATFORM_STATS.reservationsCompleted.toLocaleString('fr-FR')}+
              </p>
              <p className="text-blue-100">Réservations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Notre parcours</h2>
        <div className="max-w-2xl mx-auto">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex gap-4 mb-6 last:mb-0">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {milestone.year.slice(2)}
                </div>
                {index < milestones.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-200 my-2" />
                )}
              </div>
              <div className="flex-1 pb-6">
                <p className="text-sm text-blue-600 font-medium mb-1">
                  {milestone.year}
                </p>
                <h3 className="font-semibold mb-1 text-gray-900">{milestone.title}</h3>
                <p className="text-sm text-gray-600">
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="bg-white py-12 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Notre équipe</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {team.map((member) => (
              <Card key={member.name} className="text-center hover:shadow-lg transition-shadow bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-blue-600 mb-2">{member.role}</p>
                  <p className="text-xs text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto text-center bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Contactez-nous</h2>
            <p className="text-gray-600 mb-6">
              Une question ? Une suggestion ? N&apos;hésitez pas à nous contacter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-gray-700">Abidjan, Côte d&apos;Ivoire</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-blue-600" />
                <span className="text-gray-700">{APP_CONFIG.contact.phoneFormatted}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="text-gray-700">{APP_CONFIG.contact.email}</span>
              </div>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
