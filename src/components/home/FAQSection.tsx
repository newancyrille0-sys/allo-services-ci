"use client";

import * as React from "react";
import Link from "next/link";
import { HelpCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Questions fréquentes principales pour la page d'accueil
const HOME_FAQ_ITEMS = [
  {
    question: "Comment fonctionne Allo Services CI ?",
    answer:
      "Allo Services CI est une plateforme de mise en relation entre particuliers et prestataires de services en Côte d'Ivoire. Recherchez le service dont vous avez besoin, consultez les profils des prestataires disponibles, réservez en quelques clics et payez de manière sécurisée via Mobile Money ou carte bancaire.",
  },
  {
    question: "Quels types de services puis-je trouver ?",
    answer:
      "Vous trouverez des prestataires pour de nombreux services : ménage, plomberie, électricité, jardinage, coiffure, cours particuliers, réparation informatique, déménagement, et bien d'autres. Nous couvrons tous les besoins du quotidien dans les grandes villes de Côte d'Ivoire.",
  },
  {
    question: "Comment sont vérifiés les prestataires ?",
    answer:
      "Tous nos prestataires passent par un processus de vérification qui inclut la vérification de leur identité (CNI ou passeport), une vidéo de présentation, et la validation de leurs compétences. Les prestataires avec le badge 'Vérifié' ont été approuvés par notre équipe.",
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer:
      "Nous acceptons Orange Money, MTN Money, Wave, Moov Money, les cartes bancaires (Visa, Mastercard), et le paiement en espèces. Tous les paiements via la plateforme sont sécurisés et protégés.",
  },
  {
    question: "Comment devenir prestataire sur la plateforme ?",
    answer:
      "Pour devenir prestataire, créez un compte prestataire, complétez votre profil avec vos compétences et expériences, téléchargez vos documents d'identité, et enregistrez une vidéo de vérification. Votre compte sera validé sous 24-48h.",
  },
];

export function FAQSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-screen-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-bold tracking-widest text-sm uppercase">
            Foire aux questions
          </span>
          <h2 className="font-headline text-4xl font-extrabold text-editorial text-[#181c1d] mt-2">
            Questions fréquentes
          </h2>
          <p className="text-[#70787c] mt-4 max-w-2xl mx-auto">
            Trouvez rapidement des réponses à vos questions sur notre plateforme de services
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {HOME_FAQ_ITEMS.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-[#f7fafb] rounded-xl px-6 border border-gray-200"
              >
                <AccordionTrigger className="hover:no-underline text-left">
                  <span className="font-medium text-[#181c1d]">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-[#3f484c] pb-4 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Voir plus */}
          <div className="mt-8 text-center">
            <Link href="/faq">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                Voir toutes les questions
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
