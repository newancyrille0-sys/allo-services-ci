"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { APP_CONFIG } from "@/lib/constants/config";

const tableOfContents = [
  { id: "introduction", title: "1. Introduction" },
  { id: "definitions", title: "2. Définitions" },
  { id: "inscription", title: "3. Inscription et compte" },
  { id: "services", title: "4. Utilisation des services" },
  { id: "prestataires", title: "5. Obligations des prestataires" },
  { id: "clients", title: "6. Obligations des clients" },
  { id: "reservations", title: "7. Réservations et paiements" },
  { id: "avis", title: "8. Avis et évaluations" },
  { id: "propriete", title: "9. Propriété intellectuelle" },
  { id: "responsabilite", title: "10. Responsabilité" },
  { id: "suspension", title: "11. Suspension et résiliation" },
  { id: "modifications", title: "12. Modifications des CGU" },
  { id: "droit", title: "13. Droit applicable" },
  { id: "contact", title: "14. Contact" },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = React.useState("introduction");

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -35% 0%" }
    );

    tableOfContents.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

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
              <BreadcrumbPage className="text-gray-900">Conditions Générales d&apos;Utilisation</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Conditions Générales d&apos;Utilisation
        </h1>
        <p className="text-gray-600">
          Dernière mise à jour : Janvier 2024
        </p>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents - Sidebar */}
          <aside className="hidden lg:block">
            <Card className="sticky top-24 bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 text-gray-900">Table des matières</h3>
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <nav className="space-y-1">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={cn(
                          "block py-2 px-3 text-sm rounded-lg transition-colors",
                          activeSection === item.id
                            ? "bg-blue-100 text-blue-600 font-medium"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        )}
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </ScrollArea>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6 prose prose-sm max-w-none">
                <section id="introduction" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">1. Introduction</h2>
                  <p className="text-gray-600 mb-4">
                    Bienvenue sur Allo Services CI. Les présentes Conditions Générales
                    d&apos;Utilisation (CGU) régissent l&apos;accès et l&apos;utilisation de la
                    plateforme Allo Services CI, qui met en relation des clients et des
                    prestataires de services en Côte d&apos;Ivoire.
                  </p>
                  <p className="text-gray-600 mb-4">
                    En accédant ou en utilisant notre plateforme, vous acceptez d&apos;être
                    lié par ces CGU. Si vous n&apos;acceptez pas ces conditions, veuillez ne
                    pas utiliser nos services.
                  </p>
                </section>

                <section id="definitions" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">2. Définitions</h2>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>
                      <strong className="text-gray-900">Plateforme :</strong> Le site web et l&apos;application mobile
                      Allo Services CI
                    </li>
                    <li>
                      <strong className="text-gray-900">Client :</strong> Toute personne physique ou morale recherchant
                      un prestataire de services
                    </li>
                    <li>
                      <strong className="text-gray-900">Prestataire :</strong> Toute personne physique ou morale
                      proposant des services sur la plateforme
                    </li>
                    <li>
                      <strong className="text-gray-900">Service :</strong> Toute prestation proposée par un prestataire
                      via la plateforme
                    </li>
                    <li>
                      <strong className="text-gray-900">Réservation :</strong> La demande de service effectuée par un
                      client auprès d&apos;un prestataire
                    </li>
                  </ul>
                </section>

                <section id="inscription" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">3. Inscription et compte</h2>
                  <p className="text-gray-600 mb-4">
                    Pour utiliser certaines fonctionnalités de la plateforme, vous devez
                    créer un compte. Vous vous engagez à :
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Fournir des informations exactes et complètes</li>
                    <li>Maintenir la confidentialité de vos identifiants</li>
                    <li>Notifier immédiatement toute utilisation non autorisée</li>
                    <li>Ne pas créer plusieurs comptes pour une même personne</li>
                  </ul>
                  <p className="text-gray-600 mt-4">
                    Les prestataires doivent en plus fournir des documents justificatifs
                    (pièce d&apos;identité, registre de commerce si applicable) et accepter
                    notre processus de vérification.
                  </p>
                </section>

                <section id="services" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">4. Utilisation des services</h2>
                  <p className="text-gray-600 mb-4">
                    La plateforme permet de rechercher, comparer et réserver des services
                    auprès de prestataires vérifiés. Allo Services CI agit comme
                    intermédiaire et n&apos;est pas partie au contrat entre client et
                    prestataire.
                  </p>
                  <p className="text-gray-600">
                    Nous nous réservons le droit de modifier, suspendre ou interrompre
                    tout ou partie des services à tout moment.
                  </p>
                </section>

                <section id="prestataires" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">5. Obligations des prestataires</h2>
                  <p className="text-gray-600 mb-4">
                    Les prestataires s&apos;engagent à :
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Fournir des services de qualité professionnelle</li>
                    <li>Respecter les lois et réglementations en vigueur</li>
                    <li>Honorer les réservations confirmées</li>
                    <li>Répondre aux demandes de clients dans un délai raisonnable</li>
                    <li>Maintenir à jour leurs informations et tarifs</li>
                    <li>Respecter les conditions d&apos;annulation annoncées</li>
                  </ul>
                </section>

                <section id="clients" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">6. Obligations des clients</h2>
                  <p className="text-gray-600 mb-4">
                    Les clients s&apos;engagent à :
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Fournir des informations exactes lors des réservations</li>
                    <li>Payer les services réservés aux conditions convenues</li>
                    <li>Respecter les conditions d&apos;annulation</li>
                    <li>Ne pas harceler ou maltraiter les prestataires</li>
                    <li>Publier des avis honnêtes et objectifs</li>
                  </ul>
                </section>

                <section id="reservations" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">7. Réservations et paiements</h2>
                  <p className="text-gray-600 mb-4">
                    Les paiements s&apos;effectuent via les méthodes acceptées sur la plateforme
                    (Orange Money, MTN Money, Wave, Moov Money, carte bancaire).
                  </p>
                  <p className="text-gray-600 mb-4">
                    Allo Services CI perçoit une commission sur chaque transaction. Le
                    montant est clairement indiqué avant confirmation.
                  </p>
                  <p className="text-gray-600">
                    En cas d&apos;annulation, les conditions de remboursement dépendent du
                    délai d&apos;annulation et des politiques du prestataire.
                  </p>
                </section>

                <section id="avis" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">8. Avis et évaluations</h2>
                  <p className="text-gray-600 mb-4">
                    Les clients peuvent noter et commenter les prestataires après chaque
                    service. Les avis doivent être :
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Basés sur une expérience réelle</li>
                    <li>Objectifs et respectueux</li>
                    <li>Non diffamatoires</li>
                  </ul>
                  <p className="text-gray-600 mt-4">
                    Nous nous réservons le droit de supprimer tout avis ne respectant
                    pas ces critères.
                  </p>
                </section>

                <section id="propriete" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">9. Propriété intellectuelle</h2>
                  <p className="text-gray-600 mb-4">
                    Tous les contenus de la plateforme (logo, textes, images, design)
                    sont la propriété d&apos;Allo Services CI ou de ses partenaires et sont
                    protégés par le droit d&apos;auteur.
                  </p>
                  <p className="text-gray-600">
                    Toute reproduction, distribution ou utilisation non autorisée est
                    strictement interdite.
                  </p>
                </section>

                <section id="responsabilite" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">10. Responsabilité</h2>
                  <p className="text-gray-600 mb-4">
                    Allo Services CI s&apos;efforce de garantir la qualité de la plateforme
                    mais ne peut être tenu responsable :
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>De l&apos;inexécution ou mauvaise exécution d&apos;un service</li>
                    <li>Des dommages résultant de l&apos;utilisation de la plateforme</li>
                    <li>Des comportements frauduleux d&apos;utilisateurs</li>
                    <li>Des interruptions techniques indépendantes de notre volonté</li>
                  </ul>
                </section>

                <section id="suspension" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">11. Suspension et résiliation</h2>
                  <p className="text-gray-600 mb-4">
                    Nous pouvons suspendre ou résilier votre compte en cas de :
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Violation des CGU</li>
                    <li>Comportement frauduleux</li>
                    <li>Fausses déclarations</li>
                    <li>Non-respect des obligations légales</li>
                  </ul>
                </section>

                <section id="modifications" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">12. Modifications des CGU</h2>
                  <p className="text-gray-600">
                    Nous nous réservons le droit de modifier ces CGU à tout moment.
                    Les utilisateurs seront informés des modifications significatives
                    par email ou notification sur la plateforme. L&apos;utilisation
                    continue de la plateforme vaut acceptation des nouvelles conditions.
                  </p>
                </section>

                <section id="droit" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">13. Droit applicable</h2>
                  <p className="text-gray-600">
                    Les présentes CGU sont régies par le droit ivoirien. Tout litige
                    sera soumis aux tribunaux compétents d&apos;Abidjan, sous réserve
                    des dispositions d&apos;ordre public relatives à la compétence
                    territoriale.
                  </p>
                </section>

                <section id="contact" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">14. Contact</h2>
                  <p className="text-gray-600 mb-4">
                    Pour toute question concernant ces CGU, vous pouvez nous contacter :
                  </p>
                  <ul className="list-none text-gray-600 space-y-2">
                    <li>Email : {APP_CONFIG.contact.email}</li>
                    <li>Téléphone : {APP_CONFIG.contact.phoneFormatted}</li>
                    <li>Adresse : Abidjan, Plateau, Côte d&apos;Ivoire</li>
                  </ul>
                </section>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
