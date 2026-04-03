/**
 * Service Categories for Allo Services CI
 * 10 main categories with sub-services
 */

import {
  Wrench,
  Sparkles,
  Scissors,
  GraduationCap,
  Truck,
  PartyPopper,
  Heart,
  Laptop,
  Trees,
  Building,
  type LucideIcon,
} from "lucide-react";

export interface SubService {
  name: string;
  description?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  icon: string; // Icon name as string for serialization
  description?: string;
  subServices: SubService[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "1",
    name: "Bricolage & Réparations",
    slug: "bricolage-reparations",
    icon: "Wrench",
    description: "Travaux manuels et réparations à domicile",
    subServices: [
      { name: "Plomberie", description: "Fuites, installation, dépannage sanitaire" },
      { name: "Électricité", description: "Installation, dépannage, mise aux normes" },
      { name: "Menuiserie", description: "Travaux du bois, portes, fenêtres, meubles" },
      { name: "Peinture", description: "Peinture intérieure et extérieure" },
      { name: "Climatisation", description: "Installation et maintenance climatiseurs" },
      { name: "Carrelage", description: "Pose et réparation carrelage" },
      { name: "Serrurerie", description: "Serrures, portes blindées, clés" },
      { name: "Vitrerie", description: "Pose et réparation vitres" },
    ],
  },
  {
    id: "2",
    name: "Ménage & Nettoyage",
    slug: "menage-nettoyage",
    icon: "Sparkles",
    description: "Services de nettoyage professionnel",
    subServices: [
      { name: "Ménage régulier", description: "Entretien hebdomadaire ou quotidien" },
      { name: "Grand nettoyage", description: "Nettoyage complet en profondeur" },
      { name: "Lavage vitres", description: "Nettoyage vitres et baies vitrées" },
      { name: "Nettoyage après travaux", description: "Remise en état post-travaux" },
      { name: "Nettoyage moquette/tapis", description: "Shampouinage et nettoyage" },
      { name: "Nettoyage bureaux", description: "Entretien locaux professionnels" },
      { name: "Nettoyage fin de bail", description: "État des lieux de sortie" },
    ],
  },
  {
    id: "3",
    name: "Beauté & Bien-être",
    slug: "beaute-bien-etre",
    icon: "Scissors",
    description: "Services esthétiques à domicile",
    subServices: [
      { name: "Coiffure", description: "Coupe, couleur, coiffure femme/homme" },
      { name: "Manucure/Pédicure", description: "Soins ongles, pose vernis" },
      { name: "Massage", description: "Massage bien-être, relaxant" },
      { name: "Maquillage", description: "Maquillage professionnel" },
      { name: "Spa à domicile", description: "Soins complets spa" },
      { name: "Épilation", description: "Épilation toutes zones" },
      { name: "Soins visage", description: "Soin du visage professionnel" },
      { name: "Barbier", description: "Taille barbe et moustache" },
    ],
  },
  {
    id: "4",
    name: "Cours & Formations",
    slug: "cours-formations",
    icon: "GraduationCap",
    description: "Enseignement et formation personnalisée",
    subServices: [
      { name: "Soutien scolaire", description: "Aide aux devoirs, révisions" },
      { name: "Langues", description: "Anglais, Français, langues locales" },
      { name: "Informatique", description: "Initiation, bureautique, programmation" },
      { name: "Musique", description: "Piano, guitare, chant, percussions" },
      { name: "Sport", description: "Coach personnel, fitness, yoga" },
      { name: "Art plastique", description: "Dessin, peinture, sculpture" },
      { name: "Danse", description: "Danses traditionnelles et modernes" },
      { name: "Cuisine", description: "Cours de cuisine, pâtisserie" },
    ],
  },
  {
    id: "5",
    name: "Transport & Livraison",
    slug: "transport-livraison",
    icon: "Truck",
    description: "Solutions de transport et logistique",
    subServices: [
      { name: "Livraison colis", description: "Livraison express et standard" },
      { name: "Déménagement", description: "Déménagement complet ou partiel" },
      { name: "VTC", description: "Transport avec chauffeur" },
      { name: "Location véhicule", description: "Location courte et longue durée" },
      { name: "Transport marchandises", description: "Fret et transport de marchandises" },
      { name: "Moto-taxi", description: "Transport moto rapide" },
      { name: "Coursier", description: "Service de coursier express" },
    ],
  },
  {
    id: "6",
    name: "Événements",
    slug: "evenements",
    icon: "PartyPopper",
    description: "Organisation d'événements",
    subServices: [
      { name: "Organisation mariage", description: "Planification complète" },
      { name: "Anniversaire", description: "Enfants et adultes" },
      { name: "DJ/Animation", description: "DJ, animateur, sonorisation" },
      { name: "Traiteur", description: "Repas et buffets" },
      { name: "Photographie", description: "Photo et vidéo événementiel" },
      { name: "Décoration", description: "Décoration salle et espace" },
      { name: "Location matériel", description: "Tentes, chaises, tables" },
      { name: "Wedding planner", description: "Coordination mariage clé en main" },
    ],
  },
  {
    id: "7",
    name: "Santé à domicile",
    slug: "sante-domicile",
    icon: "Heart",
    description: "Services de santé à domicile",
    subServices: [
      { name: "Infirmier", description: "Soins infirmiers à domicile" },
      { name: "Kinésithérapeute", description: "Rééducation et massage" },
      { name: "Soins seniors", description: "Accompagnement personnes âgées" },
      { name: "Consultation médecin", description: "Visite médicale à domicile" },
      { name: "Auxiliaire de vie", description: "Aide à domicile" },
      { name: "Laboratoire", description: "Prise de sang à domicile" },
      { name: "Soins palliatifs", description: "Accompagnement de fin de vie" },
    ],
  },
  {
    id: "8",
    name: "Informatique & Tech",
    slug: "informatique-tech",
    icon: "Laptop",
    description: "Services informatiques",
    subServices: [
      { name: "Réparation ordinateur", description: "PC et Mac, portable et fixe" },
      { name: "Installation logiciel", description: "Installation et configuration" },
      { name: "Réseau/WiFi", description: "Installation et dépannage réseau" },
      { name: "Formation", description: "Formation informatique personnalisée" },
      { name: "Développement web", description: "Création sites web" },
      { name: "Récupération données", description: "Récupération données perdues" },
      { name: "Sécurité", description: "Protection et antivirus" },
      { name: "Maintenance", description: "Contrat de maintenance" },
    ],
  },
  {
    id: "9",
    name: "Jardinage & Piscine",
    slug: "jardinage-piscine",
    icon: "Trees",
    description: "Entretien espaces verts et piscines",
    subServices: [
      { name: "Entretien jardin", description: "Tonte, désherbage, arrosage" },
      { name: "Taille haies", description: "Taille de haies et arbustes" },
      { name: "Piscine", description: "Nettoyage et maintenance piscine" },
      { name: "Élagage", description: "Élagage d'arbres" },
      { name: "Aménagement", description: "Création et aménagement jardin" },
      { name: "Plantation", description: "Plantation fleurs, arbres" },
      { name: "Arrosage automatique", description: "Installation système irrigation" },
      { name: "Engazonnement", description: "Pelouse et gazon" },
    ],
  },
  {
    id: "10",
    name: "Services aux entreprises",
    slug: "services-entreprises",
    icon: "Building",
    description: "Services professionnels B2B",
    subServices: [
      { name: "Comptabilité", description: "Tenue de comptes, bilan" },
      { name: "Juridique", description: "Conseil juridique, contrats" },
      { name: "Marketing", description: "Stratégie, communication digitale" },
      { name: "Secrétariat", description: "Assistanat, gestion agenda" },
      { name: "Sécurité", description: "Agent de sécurité, surveillance" },
      { name: "Nettoyage bureaux", description: "Entretien locaux professionnels" },
      { name: "Hôtesses", description: "Accueil événements, salons" },
      { name: "Traduction", description: "Traduction documents" },
    ],
  },
];

/**
 * Get all main categories
 */
export function getMainCategories(): ServiceCategory[] {
  return SERVICE_CATEGORIES;
}

/**
 * Get category by slug
 */
export function getCategoryBySlug(slug: string): ServiceCategory | undefined {
  return SERVICE_CATEGORIES.find(cat => cat.slug === slug);
}

/**
 * Get category by ID
 */
export function getCategoryById(id: string): ServiceCategory | undefined {
  return SERVICE_CATEGORIES.find(cat => cat.id === id);
}

/**
 * Get sub-services for a category
 */
export function getSubServices(categorySlug: string): SubService[] {
  const category = getCategoryBySlug(categorySlug);
  return category?.subServices || [];
}

/**
 * Search services by query
 */
export function searchServices(query: string): ServiceCategory[] {
  const normalizedQuery = query.toLowerCase().trim();
  return SERVICE_CATEGORIES.filter(category => 
    category.name.toLowerCase().includes(normalizedQuery) ||
    category.subServices.some(sub => 
      sub.name.toLowerCase().includes(normalizedQuery)
    )
  );
}

/**
 * Get icon component name from string
 */
export function getIconName(iconString: string): string {
  return iconString;
}

/**
 * All sub-services flattened with category reference
 */
export interface FlattenedSubService extends SubService {
  categoryName: string;
  categorySlug: string;
  categoryId: string;
}

export function getAllSubServices(): FlattenedSubService[] {
  const result: FlattenedSubService[] = [];
  for (const category of SERVICE_CATEGORIES) {
    for (const subService of category.subServices) {
      result.push({
        ...subService,
        categoryName: category.name,
        categorySlug: category.slug,
        categoryId: category.id,
      });
    }
  }
  return result;
}
