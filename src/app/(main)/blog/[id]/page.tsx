"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Bookmark,
  Heart,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Complete article data with full content
const ARTICLES_DATA: Record<string, {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar: string;
  authorBio: string;
  readTime: string;
  category: string;
  categoryColor: string;
  image: string;
  createdAt: string;
  tags: string[];
  relatedArticles: string[];
}> = {
  "featured-1": {
    title: "Comment choisir un prestataire de confiance à Abidjan?",
    excerpt: "Découvrez les critères essentiels pour sélectionner le meilleur prestataire de services pour vos besoins domestiques et professionnels.",
    content: `
## Introduction

Dans une ville dynamique comme Abidjan, le recours à des prestataires de services est devenu incontournable. Que ce soit pour l'entretien de votre maison, la réparation de vos équipements ou des services professionnels, trouver le bon prestataire peut faire toute la différence.

## 1. Vérifiez les avis et recommandations

La première étape pour choisir un prestataire de confiance est de consulter les avis laissés par d'autres clients. Sur Allo Services CI, chaque prestataire dispose d'une page profil avec des évaluations authentiques. Prenez le temps de lire plusieurs avis pour vous faire une idée précise de la qualité du service.

**Conseil pratique :** Ne vous fiez pas uniquement à la note globale. Lisez les commentaires détaillés pour comprendre les points forts et les éventuels points d'amélioration du prestataire.

## 2. Examinez le portfolio et les réalisations

Un prestataire sérieux aura souvent un portfolio de ses réalisations. Pour les métiers comme la plomberie, l'électricité ou le jardinage, demandez à voir des photos de travaux précédents. Cela vous donnera un aperçu concret de ses compétences.

Sur notre plateforme, de nombreux prestataires partagent fièrement leurs réalisations. N'hésitez pas à parcourir leur galerie avant de prendre votre décision.

## 3. Vérifiez les certifications et formations

Certains métiers requièrent des qualifications spécifiques. Un électricien certifié, un plombier diplômé ou un jardinier formé aux techniques modernes vous garantiront un travail de qualité.

Les prestataires vérifiés sur Allo Services CI affichent leurs certifications directement sur leur profil. Recherchez le badge "Vérifié" pour identifier les professionnels qui ont passé notre processus de validation.

## 4. Comparez les tarifs de manière intelligente

Le prix ne doit pas être le seul critère de choix, mais il reste important. Demandez plusieurs devis pour comparer les offres. Attention toutefois aux prix anormalement bas qui pourraient cacher un travail de mauvaise qualité.

**Notre recommandation :** Sur Allo Services CI, vous pouvez recevoir jusqu'à 5 devis gratuits pour chaque demande de service. Profitez de cette fonctionnalité pour faire le meilleur choix.

## 5. La communication est clé

Un bon prestataire sait communiquer. Il répond rapidement à vos questions, explique clairement ce qu'il va faire et vous tient informé de l'avancement des travaux.

Lors de vos premiers échanges, évaluez :
- La rapidité de réponse
- La clarté des explications
- La disponibilité pour répondre à vos questions

## 6. Privilégiez la proximité

Un prestataire basé près de chez vous sera plus réactif en cas d'urgence et ses frais de déplacement seront généralement moins élevés.

La fonction de recherche géolocalisée d'Allo Services CI vous permet de trouver les prestataires les plus proches de votre domicile ou de votre bureau.

## Conclusion

Choisir un prestataire de confiance à Abidjan nécessite un peu de recherche, mais le jeu en vaut la chandelle. En suivant ces conseils, vous mettrez toutes les chances de votre côté pour bénéficier de services de qualité.

La plateforme Allo Services CI a été conçue pour faciliter cette recherche en vous offrant tous les outils nécessaires : avis vérifiés, portfolios, système de messagerie sécurisé et garantie satisfaction.
    `,
    author: "Jean-Marc Kouadio",
    authorAvatar: "https://i.pravatar.cc/100?img=12",
    authorBio: "Rédacteur en chef du Mag Allo, passionné par l'innovation dans les services à domicile.",
    readTime: "8 min",
    category: "À LA UNE",
    categoryColor: "bg-[#fd7613] text-white",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=600&fit=crop",
    createdAt: "2024-10-15",
    tags: ["Conseils", "Prestataires", "Abidjan", "Services"],
    relatedArticles: ["1", "3", "5"],
  },
  "1": {
    title: "5 astuces pour entretenir votre jardin en saison des pluies",
    excerpt: "Prévenez l'érosion et protégez vos plantes tropicales avec nos conseils d'experts locaux pour faire face aux intempéries.",
    content: `
## Introduction

La saison des pluies à Abidjan apporte son lot de défis pour les amateurs de jardinage. Entre les pluies torrentielles et l'humidité élevée, votre jardin nécessite une attention particulière pour rester en bonne santé.

## 1. Améliorez le drainage de votre sol

Un bon drainage est essentiel pour éviter que l'eau ne stagne au niveau des racines. Voici comment procéder :

- **Créez des canaux d'évacuation** : Creusez de petites tranchées pour guider l'excès d'eau vers les zones de drainage.
- **Utilisez du gravier** : Ajoutez une couche de gravier au fond de vos pots et jardinières.
- **Surélevez vos plates-bandes** : Cela permet à l'eau de s'écouler naturellement.

## 2. Protégez les plantes sensibles

Certaines plantes tropicales apprécient l'humidité, mais d'autres craignent l'excès d'eau. Identifiez les plantes vulnérables de votre jardin et :

- Installez des bâches de protection temporaires
- Déplacez les pots sous un abri
- Réduisez l'arrosage pendant les périodes de forte pluie

## 3. Taillez régulièrement

La taille est particulièrement importante en saison des pluies. Elle permet de :

- Éliminer les branches mortes ou malades
- Aérer la plante pour éviter le développement de champignons
- Stimuler une nouvelle croissance saine

**Conseil d'expert :** Taillez de préférence pendant les accalmies, lorsque le feuillage est sec.

## 4. Surveillez les maladies fongiques

L'humidité favorise l'apparition de champignons et maladies. Inspectez régulièrement vos plantes et agissez rapidement si vous remarquez :

- Des taches sur les feuilles
- Un feutrage blanc ou gris
- Un jaunissement anormal

En cas de maladie, traitez rapidement avec un fongicide adapté et isolez la plante affectée.

## 5. Enrichissez le sol après les pluies

Après de fortes pluies, le sol peut perdre des nutriments essentiels. Compensez ces pertes en :

- Ajoutant du compost bien décomposé
- Utilisant un engrais organique à libération lente
- Paillant le sol pour protéger les racines

## Conclusion

Avec ces quelques précautions, votre jardin traversera la saison des pluies sans encombre. N'hésitez pas à faire appel à un jardinier professionnel via Allo Services CI pour un entretien régulier et des conseils personnalisés.
    `,
    author: "Awa Moussa",
    authorAvatar: "https://i.pravatar.cc/100?img=5",
    authorBio: "Experte en jardinage tropical avec 15 ans d'expérience à Abidjan.",
    readTime: "5 min",
    category: "ASTUCES",
    categoryColor: "bg-green-100 text-green-800",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
    createdAt: "2024-10-10",
    tags: ["Jardinage", "Saison des pluies", "Entretien"],
    relatedArticles: ["featured-1", "3"],
  },
  "2": {
    title: "Pourquoi externaliser le ménage de vos bureaux ?",
    excerpt: "Découvrez comment une équipe professionnelle peut transformer la productivité de vos employés grâce à un environnement sain.",
    content: `
## Introduction

Dans un environnement professionnel, la propreté des locaux est souvent sous-estimée. Pourtant, elle joue un rôle crucial dans la productivité et le bien-être des employés. Découvrez pourquoi confier le ménage de vos bureaux à des professionnels est un investissement rentable.

## 1. Gagnez du temps précieux

Vos employés sont payés pour leurs compétences professionnelles, pas pour faire le ménage. En externalisant cette tâche :

- Vos collaborateurs se concentrent sur leur cœur de métier
- Vous éliminez les distractions non productives
- L'entretien se fait en dehors des heures de travail

## 2. Bénéficiez d'un savoir-faire professionnel

Les entreprises de nettoyage professionnelles disposent de :

- **Équipements adaptés** : Aspirateurs industriels, autolaveuses, produits spécifiques
- **Techniques éprouvées** : Méthodes de nettoyage efficaces et rapides
- **Formation continue** : Personnel formé aux dernières normes d'hygiène

## 3. Améliorez la santé de vos employés

Un environnement propre réduit significativement les risques de :

- Allergies et problèmes respiratoires
- Propagation de virus et bactéries
- Absentéisme lié aux maladies

Selon une étude, les bureaux régulièrement nettoyés par des professionnels enregistrent 30% moins d'absences pour maladie.

## 4. Une image professionnelle soignée

Vos locaux reflètent votre entreprise. Des bureaux impeccables :

- Impressionnent favorablement vos clients et visiteurs
- Valorisent votre marque employeur
- Créent un environnement de travail agréable

## 5. Flexibilité et adaptabilité

Les prestataires professionnels s'adaptent à vos besoins :

- Fréquence de passage personnalisée
- Interventions ponctuelles pour événements
- Services supplémentaires (vitres, moquettes, etc.)

## Conclusion

Externaliser le ménage de vos bureaux n'est pas une dépense, c'est un investissement dans la productivité et l'image de votre entreprise. Sur Allo Services CI, trouvez des prestataires spécialisés dans le nettoyage professionnel, vérifiés et évalués par d'autres entreprises.
    `,
    author: "David Sylla",
    authorAvatar: "https://i.pravatar.cc/100?img=8",
    authorBio: "Consultant en gestion d'entreprise, spécialisé dans l'optimisation des services.",
    readTime: "12 min",
    category: "SERVICES",
    categoryColor: "bg-blue-100 text-blue-800",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
    createdAt: "2024-10-05",
    tags: ["Entreprise", "Ménage", "Productivité", "Bureaux"],
    relatedArticles: ["4", "6"],
  },
  "3": {
    title: "Maintenance clim : le guide complet pour les particuliers",
    excerpt: "Tout ce qu'il faut savoir pour prolonger la durée de vie de vos climatiseurs et réduire votre facture d'électricité.",
    content: `
## Introduction

Avec des températures souvent supérieures à 30°C à Abidjan, la climatisation n'est plus un luxe mais une nécessité. Pourtant, beaucoup ignorent comment entretenir correctement leur équipement. Ce guide vous aidera à prolonger la vie de votre clim et à réduire vos factures.

## 1. Nettoyez les filtres régulièrement

C'est l'opération la plus simple et la plus importante. Des filtres encrassés :

- Réduisent l'efficacité de la climatisation de 5 à 15%
- Augmentent la consommation électrique
- Dégradent la qualité de l'air intérieur

**Fréquence recommandée :** Tous les mois en usage intensif, tous les 3 mois sinon.

## 2. Vérifiez les unités extérieures

L'unité extérieure doit être :

- Dégagée de toute végétation (minimum 50 cm autour)
- Protegée de la poussière et des débris
- Sur un sol stable et nivelé

Nettoyez les ailettes avec un jet d'eau douce, en prenant soin de ne pas les plier.

## 3. Surveillez les fuites et les odeurs

Une climatisation en bon état ne doit pas :

- Produire d'odeurs désagréables (signe de moisissures)
- Présenter de traces d'eau autour de l'unité intérieure
- Faire de bruits inhabituels

En cas de doute, faites appel à un technicien qualifié.

## 4. Programmation et utilisation optimale

Pour optimiser votre consommation :

- Réglez la température entre 24°C et 26°C
- Utilisez le mode "Éco" ou "Nuit"
- Éteignez la clim en cas d'absence prolongée
- Fermez portes et fenêtres pendant le fonctionnement

## 5. Faites appel à un professionnel annuellement

Un technicien certifié effectuera :

- La vérification du niveau de réfrigérant
- Le contrôle des connexions électriques
- Le nettoyage approfondi des composants internes
- La détection des fuites potentielles

## Conclusion

Un entretien régulier de votre climatisation vous permet d'économiser jusqu'à 25% sur votre facture électrique et de prolonger la durée de vie de votre équipement. Sur Allo Services CI, trouvez des techniciens qualifiés pour l'entretien et la réparation de vos climatiseurs.
    `,
    author: "Marie Traoré",
    authorAvatar: "https://i.pravatar.cc/100?img=9",
    authorBio: "Technicienne en climatisation, formatrice auprès des particuliers.",
    readTime: "6 min",
    category: "CONSEILS",
    categoryColor: "bg-orange-100 text-orange-800",
    image: "https://images.unsplash.com/photo-1631545806609-a5e6b6b4e0d2?w=600&h=400&fit=crop",
    createdAt: "2024-09-28",
    tags: ["Climatisation", "Entretien", "Économies d'énergie"],
    relatedArticles: ["1", "5"],
  },
  "4": {
    title: "Les avantages du service à domicile post-Covid",
    excerpt: "Comment la pandémie a transformé nos habitudes et popularisé les services à domicile en Côte d'Ivoire.",
    content: `
## Introduction

La pandémie de COVID-19 a profondément transformé nos modes de vie. Parmi les changements durables, l'essor des services à domicile occupe une place particulière en Côte d'Ivoire.

## 1. Une prise de conscience hygiéniste

Avant 2020, peu de gens faisaient nettoyer régulièrement leurs canapés, matelas ou rideaux. Aujourd'hui :

- 65% des Ivoiriens déclarent être plus attentifs à l'hygiène de leur logement
- Les services de désinfection ont explosé
- Le nettoyage professionnel est devenu la norme

## 2. La généralisation du télétravail

Le travail à domicile a créé de nouveaux besoins :

- Besoin d'un environnement de travail agréable
- Difficulté à concilier travail et tâches ménagères
- Recherche de prestataires de confiance

## 3. La digitalisation des services

Les plateformes comme Allo Services CI ont révolutionné la mise en relation :

- Réservation en quelques clics
- Paiement mobile money
- Suivi en temps réel des interventions
- Avis et évaluations pour garantir la qualité

## 4. De nouveaux services émergents

La crise a fait naître de nouvelles demandes :

- Livraison de repas à domicile
- Cours particuliers en ligne et à domicile
- Services de garde d'enfants flexibles
- Maintenance informatique à domicile

## 5. Un secteur créateur d'emplois

Le secteur des services à domicile est devenu un moteur de l'économie ivoirienne :

- Des milliers d'emplois créés depuis 2020
- Opportunités pour les jeunes et les femmes
- Formation professionnelle accrue

## Conclusion

La pandémie a agi comme un accélérateur pour les services à domicile en Côte d'Ivoire. Cette tendance est durable et continue de croître, offrant à la fois des opportunités pour les prestataires et un confort accru pour les particuliers.
    `,
    author: "Yao Koné",
    authorAvatar: "https://i.pravatar.cc/100?img=11",
    authorBio: "Journaliste et analyste des tendances de consommation en Afrique.",
    readTime: "7 min",
    category: "ACTUALITÉS",
    categoryColor: "bg-purple-100 text-purple-800",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
    createdAt: "2024-09-20",
    tags: ["COVID", "Tendances", "Services à domicile", "Économie"],
    relatedArticles: ["2", "6"],
  },
  "5": {
    title: "Comment préparer votre maison pour l'intervention d'un prestataire",
    excerpt: "Les étapes à suivre pour une collaboration efficace avec votre plombier, électricien ou agent de ménage.",
    content: `
## Introduction

L'arrivée d'un prestataire à votre domicile nécessite une certaine préparation. Une bonne organisation garantit une intervention efficace et une expérience positive pour toutes les parties.

## 1. Préparez la zone d'intervention

Avant l'arrivée du prestataire :

- **Dégagez les accès** : Assurez-vous que la zone de travail est accessible
- **Rangez les objets personnels** : Protégez vos affaires et facilitez le travail
- **Identifiez les prises et points d'eau** : Le prestataire aura besoin d'y accéder rapidement

## 2. Rassemblez les informations utiles

Préparez les éléments suivants :

- Historique des interventions précédentes
- Manuel des équipements concernés
- Photos du problème si applicable
- Questions spécifiques à poser

## 3. Sécurisez vos biens et vos proches

Pensez à :

- Mettre les objets de valeur en lieu sûr
- Éloigner les enfants et animaux de la zone de travail
- Signaler tout danger potentiel (sol glissant, câbles, etc.)

## 4. Préparez le paiement

Évitez les situations embarrassantes :

- Confirmez le mode de paiement accepté par le prestataire
- Préparez la somme exacte ou assurez-vous d'avoir du liquide
- Vérifiez les modalités de paiement sur Allo Services CI

## 5. Soyez présent et disponible

Votre présence est importante pour :

- Accueillir le prestataire
- Répondre à ses questions
- Valider le travail effectué
- Signer le rapport d'intervention

## 6. Après l'intervention

Quelques bonnes pratiques :

- Vérifiez le travail effectué avant le départ
- Demandez des conseils d'entretien
- Laissez un avis sur Allo Services CI
- Conservez la facture pour garantie

## Conclusion

Une bonne préparation facilite l'intervention du prestataire et garantit un résultat optimal. Sur Allo Services CI, vous pouvez échanger avec le prestataire avant l'intervention pour clarifier tous les détails.
    `,
    author: "Fatou Diallo",
    authorAvatar: "https://i.pravatar.cc/100?img=20",
    authorBio: "Experte en organisation et gestion du quotidien, auteure de plusieurs guides pratiques.",
    readTime: "4 min",
    category: "CONSEILS",
    categoryColor: "bg-orange-100 text-orange-800",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
    createdAt: "2024-09-15",
    tags: ["Organisation", "Prestataires", "Conseils"],
    relatedArticles: ["featured-1", "3"],
  },
  "6": {
    title: "Top 10 des services les plus demandés à Abidjan en 2024",
    excerpt: "Découvrez les tendances du marché des services à domicile dans la capitale économique ivoirienne.",
    content: `
## Introduction

Le marché des services à domicile à Abidjan ne cesse de croître. Voici le classement des services les plus demandés en 2024, basé sur les données d'Allo Services CI.

## 1. Ménage et nettoyage

Sans surprise, le ménage reste le service n°1 :

- Demande croissante de +35% par rapport à 2023
- Pic de demandes en début et fin de mois
- Services réguliers privilégiés

## 2. Plomberie

Interventions les plus fréquentes :

- Fuites d'eau et robinetterie
- Installation de sanitaires
- Débouchage de canalisations

## 3. Électricité

Une demande soutenue pour :

- Installation et réparation de prises
- Mise aux normes électriques
- Installation de luminaires

## 4. Jardinage et espaces verts

En forte croissance (+40%) :

- Entretien de pelouses
- Taille de haies
- Aménagement paysager

## 5. Climatisation

Essentiel à Abidjan :

- Installation de nouvelles unités
- Entretien et recharge de gaz
- Réparation et dépannage

## 6. Repassage

Un service en plein essor :

- Formules hebdomadaires populaires
- Service de livraison inclus
- Demande croissante des familles

## 7. Peinture et rénovation

Travaux les plus demandés :

- Ravalement de façades
- Peinture intérieure
- Petits travaux de rénovation

## 8. Garde d'enfants

Services populaires :

- Baby-sitting occasionnel
- Aide aux devoirs
- Garde après l'école

## 9. Cuisine et traiteur

Pour vos événements :

- Cuisiniers à domicile
- Service traiteur pour fêtes
- Préparation de repas hebdomadaires

## 10. Déménagement et manutention

Service saisonnier :

- Déménagement résidentiel
- Montage de meubles
- Transport de marchandises

## Conclusion

Ce classement reflète les besoins quotidiens des Abidjanais. Sur Allo Services CI, vous trouverez des prestataires qualifiés dans toutes ces catégories, prêts à intervenir rapidement.
    `,
    author: "Ibrahim Sanogo",
    authorAvatar: "https://i.pravatar.cc/100?img=15",
    authorBio: "Analyste de marché spécialisé dans l'économie des services en Afrique de l'Ouest.",
    readTime: "10 min",
    category: "ACTUALITÉS",
    categoryColor: "bg-purple-100 text-purple-800",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    createdAt: "2024-09-10",
    tags: ["Tendances", "Abidjan", "Services", "Classement"],
    relatedArticles: ["2", "4"],
  },
};

// Related articles simplified data
const RELATED_ARTICLES_INFO = [
  { id: "1", title: "5 astuces pour entretenir votre jardin", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=200&fit=crop", category: "ASTUCES" },
  { id: "2", title: "Pourquoi externaliser le ménage de vos bureaux", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=200&fit=crop", category: "SERVICES" },
  { id: "3", title: "Maintenance clim : le guide complet", image: "https://images.unsplash.com/photo-1631545806609-a5e6b6b4e0d2?w=400&h=200&fit=crop", category: "CONSEILS" },
  { id: "4", title: "Les avantages du service à domicile post-Covid", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=200&fit=crop", category: "ACTUALITÉS" },
  { id: "5", title: "Comment préparer votre maison", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop", category: "CONSEILS" },
  { id: "6", title: "Top 10 des services les plus demandés", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop", category: "ACTUALITÉS" },
  { id: "featured-1", title: "Comment choisir un prestataire de confiance", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=200&fit=crop", category: "À LA UNE" },
];

export default function BlogArticlePage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;

  const [liked, setLiked] = React.useState(false);
  const [bookmarked, setBookmarked] = React.useState(false);
  const [shareMessage, setShareMessage] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [comments, setComments] = React.useState([
    { id: 1, author: "Kouamé Jean", avatar: "https://i.pravatar.cc/50?img=3", content: "Article très instructif ! Merci pour ces conseils.", date: "2024-10-14" },
    { id: 2, author: "Aminata D.", avatar: "https://i.pravatar.cc/50?img=4", content: "J'ai appliqué vos conseils et je vois déjà la différence.", date: "2024-10-13" },
  ]);

  const article = ARTICLES_DATA[articleId];

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
          <p className="text-muted-foreground mb-6">
            Cet article n&apos;existe pas ou a été supprimé.
          </p>
          <Button asChild>
            <Link href="/blog">Voir tous les articles</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = article.title;

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

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && comment) {
      setComments([
        { id: Date.now(), author: name, avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=004150&color=fff`, content: comment, date: new Date().toISOString().split("T")[0] },
        ...comments,
      ]);
      setName("");
      setComment("");
    }
  };

  const relatedArticlesData = article.relatedArticles
    .map((id) => RELATED_ARTICLES_INFO.find((a) => a.id === id))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <Image
          src={article.image}
          alt={article.title}
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
            Retour au blog
          </Button>
          <Badge className={`${article.categoryColor} text-xs uppercase tracking-wider mb-4`}>
            {article.category}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={article.authorAvatar} />
                <AvatarFallback>{article.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{article.author}</p>
                <p className="text-xs">{article.authorBio}</p>
              </div>
            </div>
            <span className="w-1 h-1 bg-muted-foreground/40 rounded-full hidden sm:block" />
            <span className="flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4" />
              {new Date(article.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="w-1 h-1 bg-muted-foreground/40 rounded-full hidden sm:block" />
            <span className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4" />
              {article.readTime} de lecture
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
              <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, "<br/>").replace(/## (.*)/g, "<h2>$1</h2>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
            </article>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-full">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-8 border-t">
              <div className="flex items-center gap-4">
                <Button
                  variant={liked ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLiked(!liked)}
                  className={liked ? "bg-red-500 hover:bg-red-600" : ""}
                >
                  <Heart className={`h-4 w-4 mr-2 ${liked ? "fill-current" : ""}`} />
                  J&apos;aime
                </Button>
                <Button
                  variant={bookmarked ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBookmarked(!bookmarked)}
                  className={bookmarked ? "bg-primary" : ""}
                >
                  <Bookmark className={`h-4 w-4 mr-2 ${bookmarked ? "fill-current" : ""}`} />
                  Sauvegarder
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground mr-2">Partager :</span>
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

            {/* Author Card */}
            <Card className="mt-8">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={article.authorAvatar} />
                    <AvatarFallback>{article.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">{article.author}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{article.authorBio}</p>
                    <Button variant="outline" size="sm">
                      Suivre cet auteur
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Commentaires ({comments.length})
              </h3>

              {/* Comment Form */}
              <form onSubmit={handleSubmitComment} className="mb-8">
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <Input
                    placeholder="Votre nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Textarea
                  placeholder="Partagez votre avis..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="mb-4"
                  required
                />
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Publier le commentaire
                </Button>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((c) => (
                  <Card key={c.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={c.avatar} />
                          <AvatarFallback>{c.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{c.author}</span>
                            <span className="text-xs text-muted-foreground">{c.date}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{c.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Newsletter */}
            <Card className="sticky top-24 bg-gradient-to-br from-primary to-primary/80 text-white">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Newsletter</h3>
                <p className="text-white/80 text-sm mb-4">
                  Recevez nos meilleurs articles directement dans votre boîte mail.
                </p>
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 mb-3"
                />
                <Button className="w-full bg-[#fd7613] hover:bg-[#e5650f] text-white">
                  S&apos;abonner
                </Button>
              </CardContent>
            </Card>

            {/* Related Articles */}
            <div className="mt-8">
              <h3 className="font-bold text-lg mb-4">Articles similaires</h3>
              <div className="space-y-4">
                {relatedArticlesData.map((relArticle) => (
                  relArticle && (
                    <Link key={relArticle.id} href={`/blog/${relArticle.id}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                        <div className="relative h-24">
                          <Image
                            src={relArticle.image}
                            alt={relArticle.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-3">
                          <Badge variant="outline" className="text-xs mb-2">
                            {relArticle.category}
                          </Badge>
                          <h4 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                            {relArticle.title}
                          </h4>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
