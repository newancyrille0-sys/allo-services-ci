"use client";

import * as React from "react";
import Link from "next/link";
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

const tableOfContents = [
  { id: "introduction", title: "1. Introduction" },
  { id: "collecte", title: "2. Données collectées" },
  { id: "finalites", title: "3. Finalités du traitement" },
  { id: "base", title: "4. Base légale" },
  { id: "destinataires", title: "5. Destinataires des données" },
  { id: "transfert", title: "6. Transfert des données" },
  { id: "duree", title: "7. Durée de conservation" },
  { id: "droits", title: "8. Vos droits" },
  { id: "cookies", title: "9. Cookies" },
  { id: "securite", title: "10. Sécurité" },
  { id: "modifications", title: "11. Modifications" },
  { id: "contact", title: "12. Contact" },
];

export default function PrivacyPage() {
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
    <div className="min-h-screen pb-12">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Politique de Confidentialité</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-secondary mb-4">
          Politique de Confidentialité
        </h1>
        <p className="text-muted-foreground">
          Dernière mise à jour : Janvier 2024
        </p>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents - Sidebar */}
          <aside className="hidden lg:block">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Table des matières</h3>
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <nav className="space-y-1">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={cn(
                          "block py-2 px-3 text-sm rounded-lg transition-colors",
                          activeSection === item.id
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-gray-100"
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
            <Card>
              <CardContent className="p-6 prose prose-sm max-w-none">
                <section id="introduction" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
                  <p className="text-muted-foreground mb-4">
                    Allo Services CI s&apos;engage à protéger la vie privée de ses utilisateurs.
                    Cette politique de confidentialité explique comment nous collectons,
                    utilisons, partageons et protégeons vos données personnelles.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    En utilisant notre plateforme, vous acceptez les pratiques décrites
                    dans cette politique. Si vous n&apos;acceptez pas ces pratiques, veuillez
                    ne pas utiliser nos services.
                  </p>
                  <p className="text-muted-foreground">
                    Nous nous conformons à la réglementation ivoirienne en matière de
                    protection des données à caractère personnel et aux meilleures
                    pratiques internationales.
                  </p>
                </section>

                <section id="collecte" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4">2. Données collectées</h2>
                  <p className="text-muted-foreground mb-4">
                    Nous collectons les données suivantes :
                  </p>

                  <h3 className="text-lg font-semibold mt-4 mb-2">Données d&apos;inscription</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                    <li>Nom et prénom</li>
                    <li>Adresse email</li>
                    <li>Numéro de téléphone</li>
                    <li>Mot de passe (chiffré)</li>
                  </ul>

                  <h3 className="text-lg font-semibold mt-4 mb-2">Données prestataires</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                    <li>Nom de l&apos;entreprise</li>
                    <li>Description de l&apos;activité</li>
                    <li>Adresse professionnelle</li>
                    <li>Tarifs et services proposés</li>
                    <li>Documents justificatifs (CNI, registre de commerce)</li>
                    <li>Photo de profil</li>
                  </ul>

                  <h3 className="text-lg font-semibold mt-4 mb-2">Données d&apos;utilisation</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1 mb-4">
                    <li>Historique de navigation sur la plateforme</li>
                    <li>Réservations effectuées</li>
                    <li>Avis et évaluations</li>
                    <li>Messages échangés</li>
                    <li>Données de paiement (sans stockage du numéro de carte)</li>
                  </ul>

                  <h3 className="text-lg font-semibold mt-4 mb-2">Données techniques</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Adresse IP</li>
                    <li>Type de navigateur et appareil</li>
                    <li>Cookies et technologies similaires</li>
                  </ul>
                </section>

                <section id="finalites" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4">3. Finalités du traitement</h2>
                  <p className="text-muted-foreground mb-4">
                    Vos données sont utilisées pour :
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Gérer votre compte et votre profil</li>
                    <li>Faciliter les mises en relation clients-prestataires</li>
                    <li>Traiter les réservations et les paiements</li>
                    <li>Communiquer avec vous (notifications, support)</li>
                    <li>Améliorer nos services et l&apos;expérience utilisateur</li>
                    <li>Assurer la sécurité de la plateforme</li>
                    <li>Respecter nos obligations légales</li>
                    <li>Lutter contre la fraude</li>
                  </ul>
                </section>

                <section id="base" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4">4. Base légale</h2>
                  <p className="text-muted-foreground mb-4">
                    Le traitement de vos données repose sur :
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>
                      <strong>Votre consentement :</strong> pour l&apos;inscription et les
                      communications marketing
                    </li>
                    <li>
                      <strong>L&apos;exécution du contrat :</strong> pour la fourniture de nos
                      services
                    </li>
                    <li>
                      <strong>Notre intérêt légitime :</strong> pour améliorer nos services
                      et assurer la sécurité
                    </li>
                    <li>
                      <strong>Nos obligations légales :</strong> pour la conservation des
                      données de facturation
                    </li>
                  </ul>
                </section>

                <section id="destinataires" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4">5. Destinataires des données</h2>
                  <p className="text-muted-foreground mb-4">
                    Vos données peuvent être partagées avec :
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Les prestataires concernés par vos réservations</li>
                    <li>Les clients concernés par vos services (pour les prestataires)</li>
                    <li>Nos partenaires de paiement (Orange, MTN, Wave, Moov)</li>
                    <li>Nos sous-traitants techniques (hébergement, analytics)</li>
                    <li>Les autorités compétentes si requis par la loi</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Nous ne vendons jamais vos données personnelles à des tiers.
                  </p>
                </section>

                <section id="transfert" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4">6. Transfert des données</h2>
                  <p className="text-muted-foreground mb-4">
                    Vos données sont principalement hébergées en Côte d&apos;Ivoire. Si un
                    transfert vers un pays tiers est nécessaire, nous nous assurons que :
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Le pays assure un niveau de protection adéquat</li>
                    <li>Des clauses contractuelles appropriées sont en place</li>
                    <li>Vos droits restent protégés</li>
                  </ul>
                </section>

                <section id="duree" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4">7. Durée de conservation</h2>
                  <p className="text-muted-foreground mb-4">
                    Nous conservons vos données pendant :
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>La durée de votre compte actif</li>
                    <li>3 ans après la dernière activité pour les données de compte</li>
                    <li>5 ans pour les données de transaction (obligation légale)</li>
                    <li>1 an pour les données de navigation</li>
                    <li>Suppression sur demande après vérification</li>
                  </ul>
                </section>

                <section id="droits" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4">8. Vos droits</h2>
                  <p className="text-muted-foreground mb-4">
                    Vous disposez des droits suivants :
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>
                      <strong>Droit d&apos;accès :</strong> obtenir une copie de vos données
                    </li>
                    <li>
                      <strong>Droit de rectification :</strong> corriger vos données inexactes
                    </li>
                    <li>
                      <strong>Droit à l&apos;effacement :</strong> demander la suppression de vos données
                    </li>
                    <li>
                      <strong>Droit à la limitation :</strong> limiter le traitement de vos données
                    </li>
                    <li>
                      <strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré
                    </li>
                    <li>
                      <strong>Droit d&apos;opposition :</strong> vous opposer à certains traitements
                    </li>
                    <li>
                      <strong>Droit de retirer votre consentement :</strong> à tout moment
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Pour exercer ces droits, contactez-nous à : privacy@alloservices.ci
                  </p>
                </section>

                <section id="cookies" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4">9. Cookies</h2>
                  <p className="text-muted-foreground mb-4">
                    Nous utilisons des cookies pour :
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                    <li>Assurer le bon fonctionnement de la plateforme (cookies essentiels)</li>
                    <li>Mémoriser vos préférences (cookies de préférence)</li>
                    <li>Analyser l&apos;utilisation de la plateforme (cookies analytiques)</li>
                  </ul>
                  <p className="text-muted-foreground">
                    Vous pouvez gérer vos préférences de cookies via les paramètres de
                    votre navigateur ou notre bandeau de cookies.
                  </p>
                </section>

                <section id="securite" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4">10. Sécurité</h2>
                  <p className="text-muted-foreground mb-4">
                    Nous mettons en œuvre des mesures de sécurité appropriées :
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Chiffrement des données en transit (HTTPS)</li>
                    <li>Chiffrement des mots de passe</li>
                    <li>Accès restreint aux données personnelles</li>
                    <li>Surveillance et détection des anomalies</li>
                    <li>Sauvegardes régulières</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    En cas de violation de données, nous vous informerons dans les
                    meilleurs délais conformément à la réglementation applicable.
                  </p>
                </section>

                <section id="modifications" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4">11. Modifications</h2>
                  <p className="text-muted-foreground">
                    Nous pouvons modifier cette politique à tout moment. Les modifications
                    significatives vous seront notifiées par email ou via la plateforme.
                    La date de dernière mise à jour est indiquée en haut de ce document.
                  </p>
                </section>

                <section id="contact" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4">12. Contact</h2>
                  <p className="text-muted-foreground mb-4">
                    Pour toute question relative à cette politique ou pour exercer vos
                    droits :
                  </p>
                  <ul className="list-none text-muted-foreground space-y-2">
                    <li>Email : privacy@alloservices.ci</li>
                    <li>Téléphone : +225 07 00 00 00 00</li>
                    <li>Adresse : Abidjan, Plateau, Côte d&apos;Ivoire</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Vous pouvez également déposer une réclamation auprès de l&apos;Autorité
                    de Régulation des Télécommunications de Côte d&apos;Ivoire (ARTCI).
                  </p>
                </section>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
