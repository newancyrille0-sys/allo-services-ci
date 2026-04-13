"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Download,
  FileText,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Full press release data
const PRESS_RELEASES_DATA: Record<string, {
  type: string;
  date: string;
  title: string;
  image: string;
  isExternal: boolean;
  externalUrl?: string;
  content: string;
  contact: {
    name: string;
    role: string;
    email: string;
    phone: string;
  };
  relatedDocuments: {
    title: string;
    size: string;
    url: string;
  }[];
}> = {
  "1": {
    type: "Communiqué de presse",
    date: "12 Octobre 2024",
    title: "Allo Services CI lève 1 million d'euros pour son expansion",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=600&fit=crop",
    isExternal: false,
    content: `
## Allo Services CI annonce une levée de fonds historique de 1 million d'euros

**ABIDJAN, Côte d'Ivoire – 12 Octobre 2024** – Allo Services CI, la première plateforme de mise en relation entre particuliers et prestataires de services en Côte d'Ivoire, annonce aujourd'hui avoir levé 1 million d'euros auprès d'investisseurs locaux et internationaux.

### Un financement pour accélérer la croissance

Cette levée de fonds, la plus importante pour une startup ivoirienne dans le secteur des services à la personne, a été menée par le fonds d'investissement panafricain **AfriTech Ventures**, avec la participation de **Singularite Capital** et de plusieurs business angels ivoiriens.

« Cette levée de fonds marque une étape décisive dans notre développement. Elle nous permettra d'accélérer notre expansion géographique tout en renforçant notre plateforme technologique pour offrir une expérience toujours plus qualitative à nos utilisateurs », déclare **Kouamé Laurent**, CEO et fondateur d'Allo Services CI.

### Les objectifs de cette levée

Les fonds seront alloués à trois axes stratégiques :

1. **Expansion géographique** : Déploiement dans 5 nouvelles villes ivoiriennes d'ici fin 2025 (Bouaké, San-Pédro, Yamoussoukro, Korhogo et Daloa)

2. **Innovation technologique** : Renforcement de l'équipe technique avec le recrutement de 20 développeurs et lancement de nouvelles fonctionnalités (IA pour le matching, système de paiement intégré)

3. **Développement commercial** : Acquisition de nouveaux prestataires et formation de 10 000 professionnels d'ici 2026

### Impact économique et social

Depuis sa création en 2023, Allo Services CI a permis à plus de 2 500 prestataires de développer leur activité et a facilité plus de 25 000 réservations. La plateforme compte aujourd'hui plus de 50 000 utilisateurs actifs mensuels.

« Nous sommes fiers de contribuer à la formalisation de l'économie des services en Côte d'Ivoire. Chaque jour, nous créons des opportunités économiques concrètes pour des milliers de professionnels », ajoute **Aminata Koné**, Directrice des Opérations.

### À propos d'Allo Services CI

Allo Services CI est la première plateforme numérique dédiée aux services à domicile en Côte d'Ivoire. Elle connecte les particuliers et entreprises à des prestataires qualifiés pour tous types de services : ménage, plomberie, électricité, jardinage, climatisation, et bien plus encore. La plateforme garantit la qualité des prestataires grâce à un processus de vérification rigoureux et un système d'avis clients.

---

**Contact Presse :**
Nom : Fatou Diallo
Email : press@alloservices.ci
Téléphone : +225 07 00 00 00 00
    `,
    contact: {
      name: "Fatou Diallo",
      role: "Responsable Communication",
      email: "press@alloservices.ci",
      phone: "+225 07 00 00 00 00",
    },
    relatedDocuments: [
      { title: "Communiqué de presse complet (PDF)", size: "245 KB", url: "#" },
      { title: "Dossier de presse 2024", size: "2.1 MB", url: "#" },
      { title: "Kit média (logos, photos)", size: "15 MB", url: "#" },
    ],
  },
  "2": {
    type: "Partenariat",
    date: "28 Septembre 2024",
    title: "Partenariat stratégique avec les mairies d'Abidjan",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop",
    isExternal: false,
    content: `
## Allo Services CI s'associe aux mairies d'Abidjan pour digitaliser les services de proximité

**ABIDJAN, Côte d'Ivoire – 28 Septembre 2024** – Allo Services CI annonce la signature d'un partenariat historique avec les 13 mairies d'Abidjan pour faciliter l'accès aux services de proximité pour tous les citoyens.

### Une première en Côte d'Ivoire

Ce partenariat inédit vise à créer un pont entre les services municipaux et les prestataires privés, permettant aux habitants d'Abidjan de trouver plus facilement des professionnels qualifiés pour leurs besoins quotidiens.

« Cette collaboration illustre notre volonté de travailler main dans la main avec les institutions publiques pour améliorer le quotidien des Ivoiriens. Ensemble, nous créons un écosystème de services plus accessible et plus transparent », déclare **Kouamé Laurent**, CEO d'Allo Services CI.

### Les axes du partenariat

Le partenariat couvre plusieurs volets :

**1. Mise à disposition de la plateforme**
- Accès gratuit à Allo Services CI via les sites web des mairies
- Bornes interactives dans les mairies pour les citoyens sans smartphone

**2. Formation des prestataires locaux**
- Programme de certification pour les artisans des quartiers
- Sessions de formation à la digitalisation de leur activité

**3. Création d'emplois**
- Objectif de 5 000 emplois créés dans les 12 prochains mois
- Focus sur les jeunes et les femmes

### Impact attendu

Ce partenariat bénéficiera à :
- **500 000 ménages** abidjanais qui auront un accès simplifié aux services
- **5 000 prestataires** qui verront leur activité digitalisée
- **100 artisans** formés chaque mois aux outils numériques

### Déploiement progressif

Le partenariat sera déployé progressivement :
- **Octobre 2024** : Communes de Cocody et Plateau
- **Décembre 2024** : Communes de Marcory, Treichville et Yopougon
- **Mars 2025** : Extension aux 8 autres communes

---

**Contact Presse :**
Nom : Fatou Diallo
Email : press@alloservices.ci
Téléphone : +225 07 00 00 00 00
    `,
    contact: {
      name: "Fatou Diallo",
      role: "Responsable Communication",
      email: "press@alloservices.ci",
      phone: "+225 07 00 00 00 00",
    },
    relatedDocuments: [
      { title: "Dossier de partenariat (PDF)", size: "1.8 MB", url: "#" },
      { title: "Photos officielles", size: "8 MB", url: "#" },
    ],
  },
  "3": {
    type: "Media",
    date: "15 Août 2024",
    title: "Le futur de l'emploi domestique selon Allo Services",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&h=600&fit=crop",
    isExternal: true,
    externalUrl: "https://fraternitematin.ci",
    content: `
## Article de Fraternité Matin : Le futur de l'emploi domestique

Cet article a été initialement publié dans **Fraternité Matin**, le premier quotidien ivoirien.

### Résumé de l'article

Dans une enquête approfondie, Fraternité Matin analyse la transformation du secteur de l'emploi domestique en Côte d'Ivoire, avec un focus sur le rôle pionnier d'Allo Services CI.

L'article explore :
- L'évolution du marché des services à domicile depuis 2020
- L'impact de la digitalisation sur les métiers du service
- Les témoignages de prestataires dont la vie a changé grâce à la plateforme
- Les perspectives d'avenir pour le secteur

### Extrait

*"Avec Allo Services CI, nous assistons à une véritable révolution dans la manière dont les services domestiques sont conçus et consommés en Côte d'Ivoire. La plateforme ne se contente pas de mettre en relation ; elle professionnalise, forme et certifie."*

### Accéder à l'article complet

Pour lire l'intégralité de cet article, rendez-vous sur le site de Fraternité Matin.

---

**Note :** Cet article provient d'un média externe. Allo Services CI ne peut être tenu responsable du contenu tiers.
    `,
    contact: {
      name: "Fatou Diallo",
      role: "Responsable Communication",
      email: "press@alloservices.ci",
      phone: "+225 07 00 00 00 00",
    },
    relatedDocuments: [],
  },
};

export default function PressReleaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const releaseId = params.id as string;

  const [shareMessage, setShareMessage] = React.useState("");

  const release = PRESS_RELEASES_DATA[releaseId];

  // If external, redirect - must be before conditional return
  React.useEffect(() => {
    if (release?.isExternal && release?.externalUrl) {
      window.open(release.externalUrl, "_blank");
    }
  }, [release?.isExternal, release?.externalUrl]);

  if (!release) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Communiqué non trouvé</h1>
          <p className="text-muted-foreground mb-6">
            Ce communiqué de presse n&apos;existe pas ou a été supprimé.
          </p>
          <Button asChild>
            <Link href="/press">Retour à l&apos;espace presse</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = release.title;

    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, "_blank");
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
        break;
      case "copy":
        await navigator.clipboard.writeText(url);
        setShareMessage("Lien copié !");
        setTimeout(() => setShareMessage(""), 2000);
        break;
    }
  };

  const handleDownload = (doc: { title: string; url: string }) => {
    // Simulate download
    alert(`Téléchargement de : ${doc.title}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-[40vh] md:h-[50vh]">
        <Image
          src={release.image}
          alt={release.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="text-foreground hover:bg-foreground/10 mb-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l&apos;espace presse
          </Button>
          <Badge className="bg-[#fd7613] text-white text-xs uppercase tracking-wider mb-4">
            {release.type}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-4">
            {release.title}
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              {release.date}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Article Body */}
            <article className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-muted-foreground">
              <div dangerouslySetInnerHTML={{ 
                __html: release.content
                  .replace(/\n/g, "<br/>")
                  .replace(/## (.*)/g, "<h2>$1</h2>")
                  .replace(/### (.*)/g, "<h3>$1</h3>")
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\*(.*?)\*/g, "<em>$1</em>")
                  .replace(/- (.*)/g, "<li>$1</li>")
              }} />
            </article>

            {/* External Article Button */}
            {release.isExternal && release.externalUrl && (
              <div className="mt-8 p-6 bg-muted rounded-xl">
                <p className="text-muted-foreground mb-4">
                  Cet article a été publié sur un site externe.
                </p>
                <Button 
                  asChild
                  className="bg-[#fd7613] hover:bg-[#e5650f] text-white"
                >
                  <a href={release.externalUrl} target="_blank" rel="noopener noreferrer">
                    Lire l&apos;article complet
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </a>
                </Button>
              </div>
            )}

            {/* Share */}
            <div className="flex flex-wrap items-center gap-4 mt-8 pt-8 border-t">
              <span className="text-sm font-medium">Partager :</span>
              <Button variant="outline" size="icon" onClick={() => handleShare("facebook")}>
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleShare("twitter")}>
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleShare("linkedin")}>
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleShare("copy")}>
                <Link2 className="h-4 w-4" />
              </Button>
              {shareMessage && (
                <span className="text-sm text-emerald-600">{shareMessage}</span>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Card */}
            <Card className="bg-primary text-white overflow-hidden rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Contact Presse</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-white/60 text-xs uppercase">Nom</p>
                    <p className="font-medium">{release.contact.name}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase">Fonction</p>
                    <p className="font-medium">{release.contact.role}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase">Email</p>
                    <a href={`mailto:${release.contact.email}`} className="font-medium hover:underline">
                      {release.contact.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase">Téléphone</p>
                    <a href={`tel:${release.contact.phone}`} className="font-medium hover:underline">
                      {release.contact.phone}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            {release.relatedDocuments.length > 0 && (
              <Card className="overflow-hidden rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Documents associés</h3>
                  <div className="space-y-3">
                    {release.relatedDocuments.map((doc, index) => (
                      <button
                        key={index}
                        onClick={() => handleDownload(doc)}
                        className="flex items-center gap-3 w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
                      >
                        <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">{doc.size}</p>
                        </div>
                        <Download className="h-4 w-4 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Back to Press */}
            <Button asChild variant="outline" className="w-full">
              <Link href="/press">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Tous les communiqués
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
