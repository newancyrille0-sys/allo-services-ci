"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
  BookOpen,
  CreditCard,
  Shield,
  UserCheck,
  Clock,
  MapPin,
  Star,
  AlertTriangle,
  FileText,
  Users,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

// Catégories d'aide
const HELP_CATEGORIES = [
  {
    id: "getting-started",
    title: "Pour commencer",
    icon: BookOpen,
    description: "Apprenez les bases de la plateforme",
    articles: [
      "Comment créer un compte client ?",
      "Comment s'inscrire comme prestataire ?",
      "Guide de vérification d'identité",
      "Premiers pas sur Allo Services CI",
    ],
  },
  {
    id: "reservations",
    title: "Réservations",
    icon: Clock,
    description: "Tout savoir sur les réservations",
    articles: [
      "Comment réserver un prestataire ?",
      "Annuler ou modifier une réservation",
      "Politique d'annulation",
      "Suivre l'avancement d'un service",
    ],
  },
  {
    id: "payments",
    title: "Paiements",
    icon: CreditCard,
    description: "Moyens de paiement et factures",
    articles: [
      "Moyens de paiement acceptés",
      "Comment payer un prestataire ?",
      "Problème de paiement",
      "Demander un remboursement",
    ],
  },
  {
    id: "providers",
    title: "Espace Prestataires",
    icon: Users,
    description: "Gérer votre activité",
    articles: [
      "Compléter son profil prestataire",
      "Gérer ses disponibilités",
      "Répondre aux avis clients",
      "Améliorer sa visibilité",
    ],
  },
  {
    id: "security",
    title: "Sécurité",
    icon: Shield,
    description: "Protection de votre compte",
    articles: [
      "Sécuriser mon compte",
      "Signaler un comportement suspect",
      "Politique de confidentialité",
      "Protection des données",
    ],
  },
  {
    id: "verification",
    title: "Vérification",
    icon: UserCheck,
    description: "Vérification d'identité et KYC",
    articles: [
      "Pourquoi vérifier mon identité ?",
      "Documents acceptés pour la vérification",
      "Problème lors de la vérification",
      "Délai de vérification",
    ],
  },
];

// FAQ les plus posées
const FAQ_ITEMS = [
  {
    category: "Réservations",
    question: "Comment annuler une réservation ?",
    answer:
      "Vous pouvez annuler une réservation depuis votre espace client. Allez dans 'Mes réservations', sélectionnez la réservation concernée et cliquez sur 'Annuler'. Notez que des frais d'annulation peuvent s'appliquer selon le délai avant l'intervention.",
  },
  {
    category: "Paiements",
    question: "Quels moyens de paiement sont acceptés ?",
    answer:
      "Allo Services CI accepte les paiements par Mobile Money (Orange Money, MTN Money, Wave, Moov Money), carte bancaire, et paiement en espèces directement au prestataire. Le paiement sécurisé via la plateforme est recommandé pour une meilleure protection.",
  },
  {
    category: "Prestataires",
    question: "Comment devenir prestataire vérifié ?",
    answer:
      "Pour obtenir le badge de vérification, vous devez compléter votre profil avec une photo de profil claire, fournir une pièce d'identité valide (CNI ou passeport), et enregistrer une courte vidéo de vérification. Notre équipe examinera votre dossier sous 24-48h.",
  },
  {
    category: "Sécurité",
    question: "Comment signaler un prestataire ?",
    answer:
      "Si vous rencontrez un problème avec un prestataire, vous pouvez le signaler depuis la page de son profil ou après une réservation. Cliquez sur 'Signaler' et décrivez le problème. Notre équipe traitera votre signalement dans les plus brefs délais.",
  },
  {
    category: "Général",
    question: "Dans quelles villes Allo Services CI est disponible ?",
    answer:
      "Allo Services CI est disponible dans toutes les grandes villes de Côte d'Ivoire : Abidjan et ses communes, Bouaké, Yamoussoukro, San-Pédro, Daloa, Korhogo, Man, et bien d'autres. Nous étendons constamment notre réseau de prestataires.",
  },
  {
    category: "Réservations",
    question: "Que faire si le prestataire ne vient pas ?",
    answer:
      "Si un prestataire ne se présente pas, contactez-le d'abord via la messagerie de l'application. Sans réponse, vous pouvez annuler la réservation et demander un remboursement. Signalez également l'incident pour que notre équipe puisse prendre les mesures nécessaires.",
  },
  {
    category: "Paiements",
    question: "Comment fonctionne le système d'avis ?",
    answer:
      "Après chaque service, vous pouvez noter le prestataire de 1 à 5 étoiles et laisser un commentaire. Les avis sont publics et aident les autres utilisateurs dans leur choix. Les prestataires peuvent également vous noter en tant que client.",
  },
  {
    category: "Prestataires",
    question: "Comment améliorer ma visibilité sur la plateforme ?",
    answer:
      "Pour améliorer votre visibilité : complétez votre profil à 100%, ajoutez des photos de qualité, obtenez le badge vérifié, collectez des avis positifs, répondez rapidement aux demandes de réservation, et envisagez un abonnement Premium pour apparaître en priorité.",
  },
];

// Contacts d'urgence
const CONTACT_INFO = [
  {
    icon: Phone,
    title: "Téléphone",
    value: "+225 07 00 00 00 00",
    description: "Du lundi au samedi, 8h - 20h",
  },
  {
    icon: Mail,
    title: "Email",
    value: "support@alloservices.ci",
    description: "Réponse sous 24h",
  },
  {
    icon: MessageCircle,
    title: "Chat en direct",
    value: "Discuter maintenant",
    description: "Assistance immédiate",
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredFaq, setFilteredFaq] = React.useState(FAQ_ITEMS);

  // Filtrer la FAQ
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFaq(FAQ_ITEMS);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = FAQ_ITEMS.filter(
      (item) =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
    setFilteredFaq(filtered);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="bg-white/20 text-white mb-4">Centre d&apos;aide</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Comment pouvons-nous vous aider ?
          </h1>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Trouvez rapidement des réponses à vos questions ou contactez notre équipe de support
          </p>

          {/* Barre de recherche */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher une réponse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg rounded-2xl bg-white text-gray-900 shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Catégories d'aide */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-center mb-8">Parcourir par catégorie</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {HELP_CATEGORIES.map((category) => (
              <Card
                key={category.id}
                className="hover:shadow-lg transition-shadow cursor-pointer border-gray-200"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <category.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                  <CardDescription className="mt-2">{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.slice(0, 3).map((article, idx) => (
                      <li key={idx}>
                        <Link
                          href={`/help/article/${category.id}-${idx}`}
                          className="text-sm text-gray-600 hover:text-primary flex items-center gap-2"
                        >
                          <ChevronRight className="h-4 w-4" />
                          {article}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-2">Questions fréquentes</h2>
          <p className="text-gray-600 text-center mb-8">
            {filteredFaq.length} question{filteredFaq.length > 1 ? "s" : ""} trouvée
            {filteredFaq.length > 1 ? "s" : ""}
          </p>

          {filteredFaq.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <HelpCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Aucun résultat trouvé pour &quot;{searchQuery}&quot;</p>
              <Button
                variant="link"
                onClick={() => setSearchQuery("")}
                className="mt-2"
              >
                Effacer la recherche
              </Button>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-3">
              {filteredFaq.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white rounded-xl px-6 border-gray-200"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-start gap-3 text-left">
                      <Badge variant="secondary" className="mt-1 shrink-0">
                        {item.category}
                      </Badge>
                      <span className="font-medium">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-2">Besoin d&apos;aide supplémentaire ?</h2>
          <p className="text-gray-600 text-center mb-8">
            Notre équipe de support est disponible pour vous aider
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {CONTACT_INFO.map((contact, index) => (
              <Card key={index} className="text-center border-gray-200">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <contact.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{contact.title}</h3>
                  <p className="text-primary font-medium mb-1">{contact.value}</p>
                  <p className="text-sm text-gray-500">{contact.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form CTA */}
          <div className="mt-8 text-center">
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 max-w-lg mx-auto">
              <CardContent className="pt-6">
                <AlertTriangle className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Urgence ou litige ?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Pour les situations urgentes ou les litiges avec un prestataire, contactez-nous directement.
                </p>
                <Link href="/help/contact">
                  <Button className="bg-primary hover:bg-primary/90">
                    Contacter le support
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-xl font-bold text-center mb-6">Liens utiles</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/terms">
              <Button variant="outline" className="border-gray-200">
                <FileText className="h-4 w-4 mr-2" />
                Conditions d&apos;utilisation
              </Button>
            </Link>
            <Link href="/privacy">
              <Button variant="outline" className="border-gray-200">
                <Shield className="h-4 w-4 mr-2" />
                Politique de confidentialité
              </Button>
            </Link>
            <Link href="/register/provider">
              <Button variant="outline" className="border-gray-200">
                <Users className="h-4 w-4 mr-2" />
                Devenir prestataire
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
