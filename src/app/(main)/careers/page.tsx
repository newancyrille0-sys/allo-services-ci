"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  Users,
  Sparkles,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mission cards data
const MISSION_CARDS = [
  {
    icon: Eye,
    title: "Vision",
    description: "Devenir le leader incontesté des services numériques en Afrique de l'Ouest, en commençant par le dynamisme d'Abidjan.",
    borderColor: "border-emerald-600",
    iconColor: "text-emerald-600",
  },
  {
    icon: Users,
    title: "Culture",
    description: "L'audace, la bienveillance et l'excellence sont au cœur de tout ce que nous entreprenons au quotidien.",
    borderColor: "border-[#fd7613]",
    iconColor: "text-[#fd7613]",
  },
  {
    icon: Sparkles,
    title: "Impact",
    description: "Chaque ligne de code et chaque vente contribue directement à formaliser et valoriser le travail de nos partenaires.",
    borderColor: "border-[#2f4669]",
    iconColor: "text-[#2f4669]",
  },
];

// Job offers data
const JOB_OFFERS = [
  {
    id: "1",
    title: "Développeur Fullstack React/Node.js",
    department: "Tech",
    type: "CDI",
    location: "Abidjan, Cocody",
  },
  {
    id: "2",
    title: "Product Manager Senior",
    department: "Product",
    type: "CDI",
    location: "Abidjan, Plateau",
  },
  {
    id: "3",
    title: "Responsable Marketing Digital",
    department: "Sales",
    type: "Freelance",
    location: "Abidjan, Marcory",
  },
  {
    id: "4",
    title: "Designer UI/UX",
    department: "Tech",
    type: "CDI",
    location: "Abidjan, Cocody",
  },
  {
    id: "5",
    title: "Community Manager",
    department: "Sales",
    type: "Stage",
    location: "Abidjan, Plateau",
  },
];

const DEPARTMENTS = [
  { id: "all", label: "Tous" },
  { id: "tech", label: "Tech" },
  { id: "sales", label: "Sales" },
  { id: "ops", label: "Ops" },
];

export default function CareersPage() {
  const [activeFilter, setActiveFilter] = React.useState("all");

  const filteredJobs = JOB_OFFERS.filter((job) => {
    if (activeFilter === "all") return true;
    return job.department.toLowerCase() === activeFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <Badge className="bg-[#fd7613]/10 text-[#fd7613] text-sm uppercase tracking-widest mb-6">
              Carrières
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary mb-8">
              Rejoignez-nous
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-10 leading-relaxed">
              Construisez l&apos;avenir des services de proximité en Côte d&apos;Ivoire. Nous recherchons des talents passionnés pour transformer le quotidien de millions d&apos;Ivoiriens.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="px-8 h-14 rounded-full bg-gradient-to-r from-primary to-[#006b3f] text-white font-semibold shadow-lg hover:opacity-90 transition-all">
                Voir les offres
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[2.5rem] overflow-hidden rotate-3 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=800&fit=crop"
                alt="Équipe Allo Services CI"
                fill
                className="object-cover -rotate-3 scale-110"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-[#fd7613] rounded-3xl -z-10 opacity-20" />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-muted/50 py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary mb-4">
              Notre Mission
            </h2>
            <div className="w-20 h-1.5 bg-[#fd7613] rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {MISSION_CARDS.map((card) => (
              <Card key={card.title} className={`bg-background overflow-hidden border-l-4 ${card.borderColor}`}>
                <CardContent className="p-8">
                  <card.icon className={`h-10 w-10 ${card.iconColor} mb-6`} />
                  <h3 className="text-xl font-bold mb-4">{card.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Job Offers Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary mb-4">
              Offres disponibles
            </h2>
            <p className="text-muted-foreground">
              Trouvez le rôle qui vous correspond parmi nos ouvertures actuelles.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {DEPARTMENTS.map((dept) => (
              <Button
                key={dept.id}
                variant={activeFilter === dept.id ? "default" : "outline"}
                onClick={() => setActiveFilter(dept.id)}
                className={`rounded-full px-6 ${
                  activeFilter === dept.id
                    ? "bg-primary text-white"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {dept.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Job Cards */}
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all group">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-primary/10 text-primary text-xs uppercase tracking-wider">
                        {job.department}
                      </Badge>
                      <Badge className="bg-muted text-muted-foreground text-xs uppercase tracking-wider">
                        {job.type}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-[#fd7613] transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center text-muted-foreground gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-medium">{job.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" className="rounded-full px-6 border-primary text-primary hover:bg-primary hover:text-white transition-all">
                      Détails
                    </Button>
                    <Button className="rounded-full px-6 bg-[#fd7613] hover:bg-[#e5650f] text-white">
                      Postuler maintenant
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Spontaneous Application Section */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto py-20">
        <div className="bg-gradient-to-r from-primary to-[#006b3f] rounded-[2rem] p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Pas de poste correspondant ?</h2>
            <p className="text-white/80 max-w-xl mx-auto mb-10">
              Envoyez-nous votre candidature spontanée. Nous sommes toujours à la recherche de profils exceptionnels.
            </p>
            <Button className="bg-white text-primary px-10 py-6 rounded-full font-bold hover:bg-white/90 transition-all">
              Candidature Spontanée
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
