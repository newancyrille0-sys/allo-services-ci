"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  HelpCircle,
  ChevronRight,
  BookOpen,
  CreditCard,
  Shield,
  UserCheck,
  Clock,
  Users,
  MessageCircle,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { APP_CONFIG } from "@/lib/constants/config";

// Catégories de FAQ
const FAQ_CATEGORIES = [
  {
    id: "general",
    title: "Général",
    icon: HelpCircle,
    description: "Questions générales sur Allo Services CI",
    color: "bg-[#00693E]/10 text-[#00693E]",
  },
  {
    id: "reservations",
    title: "Réservations",
    icon: Clock,
    description: "Tout savoir sur les réservations",
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "payments",
    title: "Paiements",
    icon: CreditCard,
    description: "Moyens de paiement et factures",
    color: "bg-green-100 text-green-600",
  },
  {
    id: "providers",
    title: "Espace Prestataires",
    icon: Users,
    description: "Gérer votre activité",
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: "security",
    title: "Sécurité",
    icon: Shield,
    description: "Protection de votre compte",
    color: "bg-red-100 text-red-600",
  },
  {
    id: "verification",
    title: "Vérification",
    icon: UserCheck,
    description: "Vérification d'identité et KYC",
    color: "bg-amber-100 text-amber-600",
  },
];

// Toutes les questions fréquentes organisées par catégorie
const ALL_FAQ_ITEMS = [
  // Général
  {
    category: "general",
    question: "Qu'est-ce qu'Allo Services CI ?",
    answer:
      "Allo Services CI est la première plateforme de mise en relation entre particuliers et prestataires de services en Côte d'Ivoire. Nous connectons les personnes ayant besoin de services (ménage, plomberie, électricité, etc.) avec des professionnels qualifiés et vérifiés dans leur région.",
  },
  {
    category: "general",
    question: "Dans quelles villes Allo Services CI est disponible ?",
    answer:
      "Allo Services CI est disponible dans toutes les grandes villes de Côte d'Ivoire : Abidjan et ses communes (Plateau, Cocody, Marcory, Treichville, Yopougon, Abobo, etc.), Bouaké, Yamoussoukro, San-Pédro, Daloa, Korhogo, Man, et bien d'autres. Nous étendons constamment notre réseau de prestataires.",
  },
  {
    category: "general",
    question: "Comment créer un compte client ?",
    answer:
      "Pour créer un compte client, cliquez sur 'Inscription' en haut à droite de la page d'accueil. Remplissez le formulaire avec vos informations (nom, email, téléphone), validez votre compte via le code SMS reçu, et vous pouvez immédiatement commencer à rechercher et réserver des prestataires.",
  },
  {
    category: "general",
    question: "L'inscription est-elle gratuite ?",
    answer:
      "Oui, l'inscription est entièrement gratuite pour les clients. Vous pouvez créer votre compte, parcourir les profils des prestataires et réserver des services sans frais d'inscription. Les prestataires ont également accès à un plan gratuit avec des fonctionnalités de base.",
  },
  // Réservations
  {
    category: "reservations",
    question: "Comment réserver un prestataire ?",
    answer:
      "Pour réserver un prestataire : 1) Recherchez le service dont vous avez besoin, 2) Consultez les profils et avis des prestataires disponibles, 3) Sélectionnez celui qui vous convient, 4) Choisissez une date et heure, 5) Confirmez votre réservation. Vous recevrez une confirmation par SMS et email.",
  },
  {
    category: "reservations",
    question: "Comment annuler une réservation ?",
    answer:
      "Vous pouvez annuler une réservation depuis votre espace client. Allez dans 'Mes réservations', sélectionnez la réservation concernée et cliquez sur 'Annuler'. Notez que des frais d'annulation peuvent s'appliquer selon le délai avant l'intervention. Une annulation plus de 24h avant est généralement sans frais.",
  },
  {
    category: "reservations",
    question: "Puis-je modifier une réservation ?",
    answer:
      "Oui, vous pouvez modifier une réservation jusqu'à 24h avant l'intervention prévue. Allez dans 'Mes réservations', sélectionnez la réservation et cliquez sur 'Modifier'. Vous pourrez changer la date, l'heure ou ajouter des informations supplémentaires. Le prestataire recevra une notification de la modification.",
  },
  {
    category: "reservations",
    question: "Que faire si le prestataire ne vient pas ?",
    answer:
      "Si un prestataire ne se présente pas, contactez-le d'abord via la messagerie de l'application. Sans réponse, vous pouvez annuler la réservation et demander un remboursement. Signalez également l'incident pour que notre équipe puisse prendre les mesures nécessaires. Nous prenons très au sérieux ces situations.",
  },
  {
    category: "reservations",
    question: "Quel est le délai de confirmation d'une réservation ?",
    answer:
      "Les prestataires ont généralement 2 heures pour confirmer une demande de réservation. S'ils ne répondent pas dans ce délai, la réservation expire automatiquement et vous êtes immédiatement informé pour pouvoir réserver un autre prestataire. Les prestataires Premium ont un délai de réponse plus court.",
  },
  // Paiements
  {
    category: "payments",
    question: "Quels moyens de paiement sont acceptés ?",
    answer:
      "Allo Services CI accepte les paiements par Mobile Money (Orange Money, MTN Money, Wave, Moov Money), carte bancaire (Visa, Mastercard), et paiement en espèces directement au prestataire. Le paiement sécurisé via la plateforme est recommandé pour une meilleure protection.",
  },
  {
    category: "payments",
    question: "Comment payer un prestataire ?",
    answer:
      "Après la confirmation de votre réservation, vous pouvez payer directement via l'application en choisissant votre moyen de paiement préféré. Le paiement est sécurisé et bloqué jusqu'à la confirmation de la prestation. Vous pouvez aussi payer en espèces au prestataire si cette option est acceptée.",
  },
  {
    category: "payments",
    question: "Comment demander un remboursement ?",
    answer:
      "Pour demander un remboursement, allez dans 'Mes réservations', sélectionnez la prestation concernée et cliquez sur 'Demander un remboursement'. Décrivez le motif de votre demande. Notre équipe examinera votre dossier sous 48h. Les remboursements sont effectués sur le moyen de paiement original.",
  },
  {
    category: "payments",
    question: "Le paiement sur la plateforme est-il sécurisé ?",
    answer:
      "Oui, tous les paiements effectués via Allo Services CI sont 100% sécurisés. Nous utilisons un système de paiement crypté SSL et nos partenaires de paiement sont certifiés. De plus, vos fonds sont protégés par notre système de paiement à la confirmation de service.",
  },
  // Prestataires
  {
    category: "providers",
    question: "Comment devenir prestataire sur Allo Services CI ?",
    answer:
      "Pour devenir prestataire : 1) Créez un compte prestataire, 2) Complétez votre profil avec vos compétences et expériences, 3) Téléchargez vos documents d'identité, 4) Enregistrez votre vidéo de vérification, 5) Attendez la validation de votre compte (24-48h). Une fois validé, vous pourrez recevoir des demandes de réservation.",
  },
  {
    category: "providers",
    question: "Comment devenir prestataire vérifié ?",
    answer:
      "Pour obtenir le badge de vérification, vous devez compléter votre profil avec une photo de profil claire, fournir une pièce d'identité valide (CNI ou passeport), et enregistrer une courte vidéo de vérification. Notre équipe examinera votre dossier sous 24-48h. Le badge vérifié augmente votre crédibilité.",
  },
  {
    category: "providers",
    question: "Quels sont les différents abonnements prestataires ?",
    answer:
      "Nous proposons 4 plans : Gratuit (visibilité limitée), Basic (plus de demandes), Premium (priorité dans les recherches et plus de fonctionnalités), et Elite (visibilité maximale et support dédié). Chaque plan offre des avantages différents pour développer votre activité.",
  },
  {
    category: "providers",
    question: "Comment améliorer ma visibilité sur la plateforme ?",
    answer:
      "Pour améliorer votre visibilité : complétez votre profil à 100%, ajoutez des photos de qualité de vos travaux, obtenez le badge vérifié, collectez des avis positifs, répondez rapidement aux demandes de réservation, et envisagez un abonnement Premium ou Elite pour apparaître en priorité dans les recherches.",
  },
  {
    category: "providers",
    question: "Comment fonctionnent les commissions ?",
    answer:
      "Allo Services CI prélève une commission sur chaque transaction réalisée via la plateforme. Le taux varie selon votre plan d'abonnement : Gratuit (15%), Basic (12%), Premium (10%), Elite (8%). Plus votre abonnement est élevé, plus la commission est avantageuse pour vous.",
  },
  // Sécurité
  {
    category: "security",
    question: "Comment sécuriser mon compte ?",
    answer:
      "Pour sécuriser votre compte : utilisez un mot de passe fort et unique, activez l'authentification à deux facteurs (2FA), ne partagez jamais vos identifiants, vérifiez régulièrement vos connexions dans les paramètres, et signalez immédiatement toute activité suspecte à notre support.",
  },
  {
    category: "security",
    question: "Comment signaler un prestataire ou un client ?",
    answer:
      "Si vous rencontrez un problème avec un prestataire ou un client, vous pouvez le signaler depuis la page de son profil ou après une réservation. Cliquez sur 'Signaler' et décrivez le problème en détail. Notre équipe traitera votre signalement dans les plus brefs délais.",
  },
  {
    category: "security",
    question: "Que faites-vous de mes données personnelles ?",
    answer:
      "Vos données personnelles sont traitées conformément à notre politique de confidentialité et à la réglementation ivoirienne. Nous ne vendons jamais vos données à des tiers. Elles sont utilisées uniquement pour le bon fonctionnement de la plateforme et l'amélioration de nos services.",
  },
  // Vérification
  {
    category: "verification",
    question: "Pourquoi vérifier mon identité ?",
    answer:
      "La vérification d'identité protège tous les utilisateurs de la plateforme. Elle permet de confirmer que vous êtes bien la personne que vous prétendez être, d'augmenter la confiance des autres utilisateurs, et de bénéficier de fonctionnalités supplémentaires comme des limites de paiement plus élevées.",
  },
  {
    category: "verification",
    question: "Quels documents sont acceptés pour la vérification ?",
    answer:
      "Nous acceptons les documents suivants pour la vérification d'identité : Carte Nationale d'Identité (CNI) ivoirienne, Passeport valide, Permis de conduire ivoirien, Carte de séjour. Le document doit être valide et lisible. Les documents expirés ne sont pas acceptés.",
  },
  {
    category: "verification",
    question: "Combien de temps prend la vérification ?",
    answer:
      "Le processus de vérification prend généralement 24 à 48 heures ouvrées. Vous serez notifié par email et SMS dès que votre vérification sera terminée. En cas de problème avec vos documents, notre équipe vous contactera pour vous guider.",
  },
  {
    category: "verification",
    question: "Ma vidéo de vérification est-elle visible publiquement ?",
    answer:
      "Non, votre vidéo de vérification est strictement confidentielle et n'est jamais visible publiquement. Elle est uniquement utilisée par notre équipe de modération pour vérifier votre identité. Après validation, elle est stockée de manière sécurisée et supprimée conformément à nos politiques de conservation des données.",
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [filteredFaq, setFilteredFaq] = React.useState(ALL_FAQ_ITEMS);

  // Filtrer la FAQ
  React.useEffect(() => {
    let filtered = ALL_FAQ_ITEMS;

    // Filtre par catégorie
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      );
    }

    setFilteredFaq(filtered);
  }, [searchQuery, selectedCategory]);

  const getCategoryInfo = (categoryId: string) => {
    return FAQ_CATEGORIES.find((cat) => cat.id === categoryId) || FAQ_CATEGORIES[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#00693E]/5 to-background">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-[#00693E] hover:text-[#00693E]/80">
                Accueil
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900">FAQ</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#00693E] to-[#00693E]/80 text-white py-16 px-4 mt-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="bg-white/20 text-white mb-4">Foire Aux Questions</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Comment pouvons-nous vous aider ?
          </h1>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Trouvez rapidement des réponses à vos questions. Utilisez la recherche ou parcourez par catégorie.
          </p>

          {/* Barre de recherche */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher une question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg rounded-2xl bg-white text-gray-900 shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-[#00693E] hover:bg-[#00693E]/90" : "border-gray-200"}
            >
              Toutes les questions ({ALL_FAQ_ITEMS.length})
            </Button>
            {FAQ_CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-[#00693E] hover:bg-[#00693E]/90" : "border-gray-200"}
              >
                <category.icon className="h-4 w-4 mr-2" />
                {category.title}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {filteredFaq.length} question{filteredFaq.length > 1 ? "s" : ""} trouvée
              {filteredFaq.length > 1 ? "s" : ""}
            </h2>
            {(searchQuery || selectedCategory) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="text-[#00693E]"
              >
                Réinitialiser les filtres
              </Button>
            )}
          </div>

          {filteredFaq.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <HelpCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Aucun résultat trouvé</p>
              <p className="text-sm text-gray-500 mb-4">
                Essayez de modifier vos critères de recherche
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="bg-[#00693E] hover:bg-[#00693E]/90"
              >
                Voir toutes les questions
              </Button>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-3">
              {filteredFaq.map((item, index) => {
                const categoryInfo = getCategoryInfo(item.category);
                return (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-white rounded-xl px-6 border border-gray-200"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-start gap-3 text-left">
                        <Badge className={`mt-1 shrink-0 ${categoryInfo.color}`}>
                          {categoryInfo.title}
                        </Badge>
                        <span className="font-medium text-gray-900">{item.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pb-4 leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <Card className="border border-gray-200">
            <CardHeader className="text-center">
              <CardTitle>Vous n&apos;avez pas trouvé votre réponse ?</CardTitle>
              <CardDescription>
                Notre équipe de support est disponible pour vous aider
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-[#00693E]/10 flex items-center justify-center mx-auto mb-3">
                    <Phone className="h-6 w-6 text-[#00693E]" />
                  </div>
                  <h3 className="font-semibold mb-1">Téléphone</h3>
                  <p className="text-[#00693E] font-medium">{APP_CONFIG.contact.phoneFormatted}</p>
                  <p className="text-sm text-gray-500">Lun - Sam: 8h - 18h</p>
                </div>
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-[#00693E]/10 flex items-center justify-center mx-auto mb-3">
                    <Mail className="h-6 w-6 text-[#00693E]" />
                  </div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-[#00693E] font-medium">{APP_CONFIG.contact.email}</p>
                  <p className="text-sm text-gray-500">Réponse sous 24h</p>
                </div>
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-[#00693E]/10 flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="h-6 w-6 text-[#00693E]" />
                  </div>
                  <h3 className="font-semibold mb-1">Centre d&apos;aide</h3>
                  <p className="text-sm text-gray-500">Articles et guides</p>
                  <Link href="/help" className="text-[#00693E] text-sm font-medium hover:underline">
                    Consulter
                  </Link>
                </div>
              </div>
              <div className="text-center">
                <Link href="/contact">
                  <Button className="bg-[#00693E] hover:bg-[#00693E]/90">
                    Contacter le support
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
