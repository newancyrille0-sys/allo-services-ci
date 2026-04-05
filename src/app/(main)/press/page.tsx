"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  ArrowRight,
  ExternalLink,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for press releases
const PRESS_RELEASES = [
  {
    id: "1",
    type: "Communiqué de presse",
    date: "12 Octobre 2024",
    title: "Allo Services CI lève 1 million d'euros pour son expansion",
    excerpt: "Cette injection de capital permettra à la startup de renforcer sa présence dans les villes secondaires et d'améliorer sa plateforme technologique pour les prestataires de services locaux.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
    isExternal: false,
  },
  {
    id: "2",
    type: "Partenariat",
    date: "28 Septembre 2024",
    title: "Partenariat stratégique avec les mairies d'Abidjan",
    excerpt: "Allo Services CI annonce une collaboration historique visant à digitaliser l'accès aux services de proximité pour tous les citoyens de la capitale économique ivoirienne.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    isExternal: false,
  },
  {
    id: "3",
    type: "Media",
    date: "15 Août 2024",
    title: "Le futur de l'emploi domestique selon Allo Services",
    excerpt: "Une analyse profonde de Fraternité Matin sur la professionnalisation des métiers du service à la personne via notre plateforme technologique.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=400&fit=crop",
    isExternal: true,
  },
];

const MEDIA_MENTIONS = [
  {
    id: "1",
    source: "RTI 1",
    title: 'Reportage : "La tech au service de l\'Ivoirien"',
    date: "Journal de 20h - 05/09/24",
  },
  {
    id: "2",
    source: "Abidjan.net",
    title: "Digital : Top 10 des startups ivoiriennes à suivre",
    date: "Économie - 12/08/24",
  },
  {
    id: "3",
    source: "Forbes Afrique",
    title: "Allo Services CI, le pionnier du service à domicile",
    date: "Edition Web - 30/07/24",
  },
];

const PRESS_CONTACT = {
  email: "press@alloservices.ci",
  phone: "+225 07 00 00 00 00",
};

export default function PressPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="relative py-16 md:py-24">
          <div className="absolute top-0 right-0 -z-10 w-1/3 h-full bg-primary/5 rounded-3xl transform translate-x-12 -rotate-3" />
          <Badge className="bg-[#fd7613]/10 text-[#fd7613] text-xs uppercase tracking-widest mb-4">
            Espace Presse
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            Espace Presse & <span className="text-primary">Actualités.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
            Découvrez l&apos;évolution d&apos;Allo Services CI, nos levées de fonds et nos partenariats stratégiques pour transformer le paysage des services en Côte d&apos;Ivoire.
          </p>
        </div>
      </section>

      {/* Media Logos Section */}
      <section className="bg-muted/50 py-12 mb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mb-10">
            Ils parlent de nous
          </p>
          <div className="flex flex-wrap justify-between items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="h-10 flex items-center">
              <span className="text-xl font-black text-foreground tracking-tight">FRATERNITÉ MATIN</span>
            </div>
            <div className="h-10 flex items-center">
              <span className="text-xl font-black text-foreground tracking-tight italic">Abidjan.net</span>
            </div>
            <div className="h-10 flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center text-white font-bold text-xs italic">RTI</div>
                <span className="text-xl font-black text-foreground tracking-tight">RTI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Press Releases Column */}
          <div className="lg:col-span-2 space-y-8">
            {PRESS_RELEASES.map((release) => (
              <Card key={release.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all group cursor-pointer">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 md:h-auto relative">
                    <Image
                      src={release.image}
                      alt={release.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="flex-1 p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge className="bg-[#fd7613]/10 text-[#fd7613] text-xs uppercase tracking-wider">
                        {release.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{release.date}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {release.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {release.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:underline underline-offset-4">
                      {release.isExternal ? "Voir l'article" : "Lire le communiqué"}
                      {release.isExternal ? (
                        <ExternalLink className="h-4 w-4" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Card */}
            <Card className="bg-primary text-white overflow-hidden rounded-3xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 tracking-tight">Contact Presse</h3>
                <p className="text-white/80 mb-6">
                  Pour toute demande d&apos;interview ou de documentation supplémentaire.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Mail className="h-5 w-5 text-white/60 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold uppercase text-white/60">Email</p>
                      <p className="font-medium">{PRESS_CONTACT.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-5 w-5 text-white/60 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold uppercase text-white/60">Téléphone</p>
                      <p className="font-medium">{PRESS_CONTACT.phone}</p>
                    </div>
                  </div>
                </div>
                <Button className="mt-8 w-full py-4 bg-white text-primary rounded-full font-bold hover:bg-white/90 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le Kit Média
                </Button>
              </CardContent>
            </Card>

            {/* Mentions Card */}
            <Card className="bg-muted/50 overflow-hidden rounded-3xl">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4">Nos Mentions</h3>
                <ul className="space-y-6">
                  {MEDIA_MENTIONS.map((mention, index) => (
                    <li key={mention.id} className={index < MEDIA_MENTIONS.length - 1 ? "border-b border-border pb-4" : ""}>
                      <p className="text-xs font-bold text-[#fd7613] mb-1">{mention.source}</p>
                      <p className="text-sm font-semibold">{mention.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 italic">{mention.date}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
