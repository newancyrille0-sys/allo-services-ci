/**
 * Subscription Plans for Allo Services CI
 * Provider subscription tiers
 */

export type SubscriptionPlanKey = "STARTER" | "STANDARD" | "PREMIUM";

export interface SubscriptionPlanFeatures {
  maxServices: number;
  hasVerifiedBadge: boolean;
  hasAnalytics: boolean;
  prioritySearch: number; // 0 = normal, 1 = higher, 2 = top
  hasPrioritySupport: boolean;
  hasHomepageFeatured: boolean;
  hasCustomProfile: boolean;
  hasAdvancedAnalytics: boolean;
  hasUnlimitedMessaging: boolean;
  hasVideoPublishing: boolean;
  hasLiveStreaming: boolean;
  maxVideosPerMonth: number;
  maxLivesPerMonth: number;
}

export interface SubscriptionPlan {
  key: SubscriptionPlanKey;
  name: string;
  price: number;
  currency: string;
  billingPeriod: "monthly" | "yearly" | "one-time";
  features: string[];
  limits: SubscriptionPlanFeatures;
  color: string;
  gradient?: string;
  popular?: boolean;
  badge?: string;
  badgeColor?: string;
}

// Plans d'abonnement prestataire: 5 000, 15 000, 25 000 FCFA/mois
export const SUBSCRIPTION_PLANS: Record<SubscriptionPlanKey, SubscriptionPlan> = {
  STARTER: {
    key: "STARTER",
    name: "Starter",
    price: 5000,
    currency: "XOF",
    billingPeriod: "monthly",
    features: [
      "Profil visible sur la plateforme",
      "5 services maximum",
      "Badge Starter",
      "Publication de vidéos (5/mois)",
      "Live streaming (2/mois)",
      "Messagerie basique",
      "Affichage dans les résultats",
    ],
    limits: {
      maxServices: 5,
      hasVerifiedBadge: false,
      hasAnalytics: false,
      prioritySearch: 0,
      hasPrioritySupport: false,
      hasHomepageFeatured: false,
      hasCustomProfile: false,
      hasAdvancedAnalytics: false,
      hasUnlimitedMessaging: false,
      hasVideoPublishing: true,
      hasLiveStreaming: true,
      maxVideosPerMonth: 5,
      maxLivesPerMonth: 2,
    },
    color: "#3B82F6", // Bleu
    badge: "Starter",
    badgeColor: "bg-blue-500",
  },
  STANDARD: {
    key: "STANDARD",
    name: "Standard",
    price: 15000,
    currency: "XOF",
    billingPeriod: "monthly",
    features: [
      "Badge Vérifié ✓",
      "15 services maximum",
      "Statistiques de base",
      "Support par email prioritaire",
      "Messagerie illimitée",
      "Publication de vidéos (20/mois)",
      "Live streaming illimité",
      "Priorité dans les recherches",
      "Alertes réservations par SMS",
    ],
    limits: {
      maxServices: 15,
      hasVerifiedBadge: true,
      hasAnalytics: true,
      prioritySearch: 1,
      hasPrioritySupport: false,
      hasHomepageFeatured: false,
      hasCustomProfile: false,
      hasAdvancedAnalytics: false,
      hasUnlimitedMessaging: true,
      hasVideoPublishing: true,
      hasLiveStreaming: true,
      maxVideosPerMonth: 20,
      maxLivesPerMonth: -1, // illimité
    },
    color: "#10B981", // Vert
    gradient: "from-emerald-500 to-green-600",
    popular: true,
    badge: "Vérifié",
    badgeColor: "bg-emerald-500",
  },
  PREMIUM: {
    key: "PREMIUM",
    name: "Premium",
    price: 25000,
    currency: "XOF",
    billingPeriod: "monthly",
    features: [
      "TOP des résultats de recherche",
      "Services illimités",
      "Badge Premium ⭐",
      "Vidéos illimitées",
      "Live streaming illimité",
      "Analytics avancés",
      "Support prioritaire 24/7",
      "Mise en avant sur la page d'accueil",
      "Personnalisation avancée du profil",
      "Rapports mensuels détaillés",
      "Accès aux formations exclusives",
      "Commission réduite",
    ],
    limits: {
      maxServices: -1, // unlimited
      hasVerifiedBadge: true,
      hasAnalytics: true,
      prioritySearch: 2,
      hasPrioritySupport: true,
      hasHomepageFeatured: true,
      hasCustomProfile: true,
      hasAdvancedAnalytics: true,
      hasUnlimitedMessaging: true,
      hasVideoPublishing: true,
      hasLiveStreaming: true,
      maxVideosPerMonth: -1, // illimité
      maxLivesPerMonth: -1, // illimité
    },
    color: "#F59E0B", // Or/Ambré
    gradient: "from-amber-500 via-yellow-400 to-amber-600",
    badge: "Premium ⭐",
    badgeColor: "bg-gradient-to-r from-amber-500 to-yellow-400",
  },
};

/**
 * Get plan by key
 */
export function getPlanByKey(key: SubscriptionPlanKey): SubscriptionPlan {
  return SUBSCRIPTION_PLANS[key];
}

/**
 * Get all plans as array
 */
export function getAllPlans(): SubscriptionPlan[] {
  return Object.values(SUBSCRIPTION_PLANS);
}

/**
 * Compare plans and get upgrade path
 */
export function getUpgradePath(currentPlan: SubscriptionPlanKey): SubscriptionPlan[] {
  const planOrder: SubscriptionPlanKey[] = ["STARTER", "STANDARD", "PREMIUM"];
  const currentIndex = planOrder.indexOf(currentPlan);
  return planOrder.slice(currentIndex + 1).map(key => SUBSCRIPTION_PLANS[key]);
}

/**
 * Calculate annual savings (20% off)
 */
export function calculateAnnualPrice(monthlyPrice: number): number {
  // 20% discount for annual subscription
  return Math.round(monthlyPrice * 12 * 0.8);
}

/**
 * Payment methods available in Côte d'Ivoire
 */
export const PAYMENT_METHODS = [
  {
    id: "orange_money",
    name: "Orange Money",
    icon: "smartphone",
    color: "#FF6600",
    description: "Paiement via Orange Money",
    enabled: true,
  },
  {
    id: "mtn_money",
    name: "MTN Mobile Money",
    icon: "smartphone",
    color: "#FFCC00",
    description: "Paiement via MTN Mobile Money",
    enabled: true,
  },
  {
    id: "wave",
    name: "Wave",
    icon: "smartphone",
    color: "#00AEEF",
    description: "Paiement via Wave",
    enabled: true,
  },
  {
    id: "moov",
    name: "Moov Money",
    icon: "smartphone",
    color: "#0099DA",
    description: "Paiement via Moov Money",
    enabled: true,
  },
  {
    id: "card",
    name: "Carte bancaire",
    icon: "credit-card",
    color: "#1A1A1A",
    description: "Visa, Mastercard",
    enabled: true,
  },
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];

export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  icon: string;
  color: string;
  description: string;
  enabled: boolean;
}

/**
 * Get enabled payment methods
 */
export function getEnabledPaymentMethods(): PaymentMethod[] {
  return PAYMENT_METHODS.filter(method => method.enabled);
}

/**
 * Subscription benefits comparison
 */
export const SUBSCRIPTION_COMPARISON = [
  {
    feature: "Prix mensuel",
    STARTER: "5 000 FCFA",
    STANDARD: "15 000 FCFA",
    PREMIUM: "25 000 FCFA",
  },
  {
    feature: "Nombre de services",
    STARTER: "5",
    STANDARD: "15",
    PREMIUM: "Illimité",
  },
  {
    feature: "Badge",
    STARTER: "Starter",
    STANDARD: "Vérifié ✓",
    PREMIUM: "Premium ⭐",
  },
  {
    feature: "Publication de vidéos",
    STARTER: "5/mois",
    STANDARD: "20/mois",
    PREMIUM: "Illimité",
  },
  {
    feature: "Live streaming",
    STARTER: "2/mois",
    STANDARD: "Illimité",
    PREMIUM: "Illimité",
  },
  {
    feature: "Statistiques",
    STARTER: false,
    STANDARD: "Basiques",
    PREMIUM: "Avancées",
  },
  {
    feature: "Priorité recherche",
    STARTER: "Normale",
    STANDARD: "Haute",
    PREMIUM: "Maximum",
  },
  {
    feature: "Support client",
    STARTER: "Email",
    STANDARD: "Email prioritaire",
    PREMIUM: "24/7 Téléphone",
  },
  {
    feature: "Mise en avant homepage",
    STARTER: false,
    STANDARD: false,
    PREMIUM: true,
  },
  {
    feature: "Profil personnalisable",
    STARTER: "Basique",
    STANDARD: "Basique",
    PREMIUM: "Avancé",
  },
  {
    feature: "Alertes SMS",
    STARTER: false,
    STANDARD: true,
    PREMIUM: true,
  },
  {
    feature: "Formations",
    STARTER: false,
    STANDARD: false,
    PREMIUM: true,
  },
] as const;

/**
 * Currency formatting for XOF
 */
export function formatXOF(amount: number): string {
  return new Intl.NumberFormat("fr-CI", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
