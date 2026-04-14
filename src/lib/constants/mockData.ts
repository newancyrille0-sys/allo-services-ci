/**
 * Mock Data for Allo Services CI
 * Used for homepage and development purposes
 */

import { SubscriptionPlanKey } from "./subscription";

export interface MockProvider {
  id: string;
  businessName: string;
  description: string;
  avatarUrl?: string;
  averageRating: number;
  totalReviews: number;
  trustScore: number;
  subscriptionStatus: SubscriptionPlanKey;
  city: string;
  hourlyRate: number;
  badgeVerified: boolean;
  serviceCategory: string;
}

export interface MockTestimonial {
  id: string;
  clientName: string;
  clientCity: string;
  avatarUrl?: string;
  rating: number;
  text: string;
  serviceUsed: string;
  date: string;
}

export interface MockStats {
  totalProviders: number;
  satisfiedClients: number;
  citiesCovered: number;
  reservationsCompleted: number;
}

/**
 * Featured Providers - Mix of subscription tiers
 */
export const FEATURED_PROVIDERS: MockProvider[] = [
  {
    id: "provider-1",
    businessName: "Plomberie Express Abidjan",
    description: "Expert en plomberie et sanitaires. Intervention rapide 7j/7 sur Abidjan et environs. Devis gratuit.",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    averageRating: 4.9,
    totalReviews: 127,
    trustScore: 95,
    subscriptionStatus: "PREMIUM",
    city: "Abidjan",
    hourlyRate: 8000,
    badgeVerified: true,
    serviceCategory: "Bricolage & Réparations",
  },
  {
    id: "provider-2",
    businessName: "Beauty Home Services",
    description: "Coiffure, manucure et maquillage à domicile. Nous venons chez vous pour sublimer votre beauté.",
    avatarUrl: "https://i.pravatar.cc/150?img=45",
    averageRating: 4.8,
    totalReviews: 89,
    trustScore: 92,
    subscriptionStatus: "PREMIUM",
    city: "Abidjan",
    hourlyRate: 5000,
    badgeVerified: true,
    serviceCategory: "Beauté & Bien-être",
  },
  {
    id: "provider-3",
    businessName: "Ménage Pro CI",
    description: "Service de ménage professionnel et régulier. Grand nettoyage, repassage, organisation.",
    avatarUrl: "https://i.pravatar.cc/150?img=32",
    averageRating: 4.7,
    totalReviews: 156,
    trustScore: 88,
    subscriptionStatus: "MONTHLY",
    city: "Abidjan",
    hourlyRate: 4000,
    badgeVerified: true,
    serviceCategory: "Ménage & Nettoyage",
  },
  {
    id: "provider-4",
    businessName: "Prof Maths Academy",
    description: "Cours particuliers de mathématiques et physique. Collège, lycée et université. Résultats garantis.",
    avatarUrl: "https://i.pravatar.cc/150?img=53",
    averageRating: 4.9,
    totalReviews: 68,
    trustScore: 91,
    subscriptionStatus: "MONTHLY",
    city: "Bouaké",
    hourlyRate: 6000,
    badgeVerified: true,
    serviceCategory: "Cours & Formations",
  },
  {
    id: "provider-5",
    businessName: "Transport & Livraison Rapide",
    description: "Livraison de colis, courses et déménagement. Service rapide et sécurisé dans tout Abidjan.",
    avatarUrl: "https://i.pravatar.cc/150?img=59",
    averageRating: 4.5,
    totalReviews: 234,
    trustScore: 82,
    subscriptionStatus: "FREE",
    city: "Abidjan",
    hourlyRate: 3500,
    badgeVerified: false,
    serviceCategory: "Transport & Livraison",
  },
  {
    id: "provider-6",
    businessName: "Jardins Verts CI",
    description: "Entretien de jardins, tonte, taille de haies et aménagement paysager. Créez votre espace vert.",
    avatarUrl: "https://i.pravatar.cc/150?img=60",
    averageRating: 4.6,
    totalReviews: 45,
    trustScore: 85,
    subscriptionStatus: "MONTHLY",
    city: "Yamoussoukro",
    hourlyRate: 5500,
    badgeVerified: true,
    serviceCategory: "Jardinage & Piscine",
  },
];

/**
 * Client Testimonials
 */
export const CLIENT_TESTIMONIALS: MockTestimonial[] = [
  {
    id: "testimonial-1",
    clientName: "Aminata Koné",
    clientCity: "Abidjan, Cocody",
    avatarUrl: "https://i.pravatar.cc/150?img=23",
    rating: 5,
    text: "Excellent service ! Le plombier est arrivé en moins d'une heure et a réparé ma fuite parfaitement. Je recommande vivement.",
    serviceUsed: "Plomberie",
    date: "2024-01-15",
  },
  {
    id: "testimonial-2",
    clientName: "Jean-Baptiste Yao",
    clientCity: "Abidjan, Plateau",
    avatarUrl: "https://i.pravatar.cc/150?img=51",
    rating: 5,
    text: "Ma fille a amélioré ses notes en maths grâce aux cours particuliers. Professeur patient et pédagogue. Très satisfait !",
    serviceUsed: "Soutien scolaire",
    date: "2024-01-10",
  },
  {
    id: "testimonial-3",
    clientName: "Fatou Diallo",
    clientCity: "Bouaké",
    avatarUrl: "https://i.pravatar.cc/150?img=25",
    rating: 4,
    text: "Le service de ménage était impeccable. Mon appartement n'a jamais été aussi propre. Je prends un forfait mensuel maintenant.",
    serviceUsed: "Ménage",
    date: "2024-01-08",
  },
  {
    id: "testimonial-4",
    clientName: "Kouamé Laurent",
    clientCity: "Abidjan, Yopougon",
    avatarUrl: "https://i.pravatar.cc/150?img=57",
    rating: 5,
    text: "Coiffeuse très professionnelle venue à domicile pour mon mariage. Tout le monde a adoré ma coiffure ! Merci encore.",
    serviceUsed: "Coiffure",
    date: "2024-01-05",
  },
];

/**
 * Platform Statistics
 */
export const PLATFORM_STATS: MockStats = {
  totalProviders: 2500,
  satisfiedClients: 15000,
  citiesCovered: 65,
  reservationsCompleted: 25000,
};

/**
 * Service category provider counts (mock data)
 */
export const SERVICE_PROVIDER_COUNTS: Record<string, number> = {
  "bricolage-reparations": 342,
  "menage-nettoyage": 287,
  "beaute-bien-etre": 198,
  "cours-formations": 156,
  "transport-livraison": 234,
  "evenements": 145,
  "sante-domicile": 89,
  "informatique-tech": 123,
  "jardinage-piscine": 67,
  "services-entreprises": 78,
};

/**
 * Get providers by subscription tier
 */
export function getProvidersByTier(tier: SubscriptionPlanKey): MockProvider[] {
  return FEATURED_PROVIDERS.filter((p) => p.subscriptionStatus === tier);
}

/**
 * Get premium and featured providers
 */
export function getPremiumProviders(): MockProvider[] {
  return FEATURED_PROVIDERS.filter(
    (p) => p.subscriptionStatus === "PREMIUM" || p.subscriptionStatus === "MONTHLY"
  );
}
