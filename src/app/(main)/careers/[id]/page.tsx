"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Clock,
  ArrowLeft,
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Job details data
const JOB_DETAILS: Record<string, {
  title: string;
  department: string;
  type: string;
  location: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
}> = {
  "1": {
    title: "Développeur Fullstack React/Node.js",
    department: "Tech",
    type: "CDI",
    location: "Abidjan, Cocody",
    description: "Rejoignez notre équipe technique pour développer et maintenir notre plateforme de services. Vous travaillerez sur des défis techniques passionnants tout en contribuant à l'impact social d'Allo Services CI en Côte d'Ivoire.",
    responsibilities: [
      "Développer et maintenir les fonctionnalités frontend (React/Next.js) et backend (Node.js)",
      "Participer à l'architecture technique et aux choix technologiques",
      "Collaborer avec l'équipe Product pour transformer les besoins en solutions techniques",
      "Assurer la qualité du code avec des tests unitaires et d'intégration",
      "Optimiser les performances de l'application",
    ],
    requirements: [
      "3+ ans d'expérience en développement fullstack",
      "Maîtrise de React, Next.js et Node.js",
      "Expérience avec les bases de données SQL et NoSQL",
      "Connaissance des bonnes pratiques de sécurité",
      "Esprit d'équipe et bonne communication",
    ],
    benefits: [
      "Salaire compétitif adapté au marché ivoirien",
      "Mutuelle santé prise en charge à 80%",
      "Télétravail partiel (2 jours/semaine)",
      "Tickets restaurant",
      "Formation continue et certifications",
      "Équipe internationale et ambiance startup",
    ],
  },
  "2": {
    title: "Product Manager Senior",
    department: "Product",
    type: "CDI",
    location: "Abidjan, Plateau",
    description: "Pilotez le développement de nos produits numériques et assurez-vous qu'ils répondent aux besoins de nos utilisateurs ivoiriens. Vous serez au cœur de la transformation digitale des services de proximité.",
    responsibilities: [
      "Définir et prioriser la roadmap produit",
      "Recueillir et analyser les besoins utilisateurs",
      "Collaborer avec les équipes Tech et Business",
      "Piloter le lancement de nouvelles fonctionnalités",
      "Mesurer et optimiser les KPIs produit",
    ],
    requirements: [
      "5+ ans d'expérience en Product Management",
      "Expérience en B2C et/ou marketplace",
      "Maîtrise des outils de data analysis",
      "Excellentes compétences en communication",
      "Anglais professionnel requis",
    ],
    benefits: [
      "Salaire compétitif",
      "Participation aux résultats",
      "Télétravail flexible",
      "Formation continue",
      "Événements d'équipe réguliers",
    ],
  },
  "3": {
    title: "Responsable Marketing Digital",
    department: "Sales",
    type: "Freelance",
    location: "Abidjan, Marcory",
    description: "Développez notre présence digitale et acquérez de nouveaux utilisateurs grâce à des campagnes marketing innovantes adaptées au marché ivoirien.",
    responsibilities: [
      "Définir et exécuter la stratégie marketing digitale",
      "Gérer les campagnes sur les réseaux sociaux",
      "Optimiser le SEO et le contenu web",
      "Analyser les performances et ajuster les stratégies",
      "Collaborer avec les influenceurs locaux",
    ],
    requirements: [
      "3+ ans d'expérience en marketing digital",
      "Expertise en social media marketing",
      "Connaissance du marché ivoirien",
      "Maîtrise des outils d'analyse (Google Analytics, etc.)",
      "Créativité et sens de l'innovation",
    ],
    benefits: [
      "Rémunération attractive au projet",
      "Flexibilité totale des horaires",
      "Travail en remote possible",
      "Possibilité de CDI après période d'essai",
    ],
  },
  "4": {
    title: "Designer UI/UX",
    department: "Tech",
    type: "CDI",
    location: "Abidjan, Cocody",
    description: "Créez des expériences utilisateur exceptionnelles pour des millions d'Ivoiriens. Vous donnons forme à notre vision d'une plateforme de services accessible et intuitive.",
    responsibilities: [
      "Concevoir des interfaces utilisateur intuitives",
      "Réaliser des wireframes et prototypes interactifs",
      "Conduire des tests utilisateurs",
      "Collaborer avec les développeurs pour l'implémentation",
      "Développer et maintenir le design system",
    ],
    requirements: [
      "3+ ans d'expérience en design UI/UX",
      "Maîtrise de Figma et outils de prototypage",
      "Portfolio démontrant des projets réussis",
      "Connaissance des principes d'accessibilité",
      "Sens du détail et de l'esthétique",
    ],
    benefits: [
      "Salaire compétitif",
      "Équipement de travail premium",
      "Télétravail partiel",
      "Formations et conférences",
      "Ambiance créative et stimulante",
    ],
  },
  "5": {
    title: "Community Manager",
    department: "Sales",
    type: "Stage",
    location: "Abidjan, Plateau",
    description: "Animez notre communauté sur les réseaux sociaux et développez l'engagement de nos utilisateurs. Un stage formateur au cœur de la communication digitale.",
    responsibilities: [
      "Animer les communautés sur les réseaux sociaux",
      "Créer du contenu engageant",
      "Répondre aux questions et commentaires",
      "Suivre les tendances et proposer des idées",
      "Réaliser des reportings d'activité",
    ],
    requirements: [
      "Étudiant en communication/marketing (Bac+3 minimum)",
      "Excellente maîtrise des réseaux sociaux",
      "Bonne rédaction en français",
      "Créativité et réactivité",
      "Connaissance du marché ivoirien",
    ],
    benefits: [
      "Indemnité de stage attractive",
      "Encadrement par des professionnels",
      "Possibilité d'embauche après le stage",
      "Accès à tous les outils professionnels",
      "Ambiance jeune et dynamique",
    ],
  },
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const job = JOB_DETAILS[jobId];

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Offre non trouvée</h1>
          <p className="text-muted-foreground mb-6">
            Cette offre d&apos;emploi n&apos;existe pas ou a été supprimée.
          </p>
          <Button asChild>
            <Link href="/careers">Voir toutes les offres</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="text-white/80 hover:text-white hover:bg-white/10 mb-6"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux offres
          </Button>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-white/20 text-white text-xs uppercase tracking-wider">
              {job.department}
            </Badge>
            <Badge className="bg-[#fd7613] text-white text-xs uppercase tracking-wider">
              {job.type}
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{job.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Plein temps</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Description du poste</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {job.description}
                </p>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Responsabilités
                </h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Profil recherché
                </h2>
                <ul className="space-y-3">
                  {job.requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#fd7613] flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Avantages
                </h2>
                <ul className="space-y-3">
                  {job.benefits.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Postuler maintenant</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Rejoignez une équipe passionnée et contribuez à révolutionner les services en Côte d&apos;Ivoire.
                </p>
                <Button
                  asChild
                  className="w-full bg-[#fd7613] hover:bg-[#e5650f] text-white rounded-full py-6"
                >
                  <Link href={`/careers/apply?job=${jobId}`}>
                    Postuler à cette offre
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Réponse sous 48h garantie
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
