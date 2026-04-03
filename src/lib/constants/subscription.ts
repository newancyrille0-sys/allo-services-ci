/**
 * Subscription Plans for Allo Services CI
 * Provider subscription tiers
 */

export type SubscriptionPlanKey = "FREE" | "MONTHLY" | "PREMIUM";

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
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlanKey, SubscriptionPlan> = {
  FREE: {
    key: "FREE",
    name: "Gratuit",
    price: 0,
    currency: "XOF",
    billingPeriod: "monthly",
    features: [
      "Profil visible sur la plateforme",
      "5 services maximum",
      "Réception des réservations",
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
    },
    color: "gray",
  },
  MONTHLY: {
    key: "MONTHLY",
    name: "Standard",
    price: 15000,
    currency: "XOF",
    billingPeriod: "monthly",
    features: [
      "Badge Vérifié ✓",
      "15 services maximum",
      "Statistiques de base",
      "Support par email",
      "Messagerie illimitée",
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
    },
    color: "emerald",
    popular: true,
  },
  PREMIUM: {
    key: "PREMIUM",
    name: "Premium",
    price: 50000,
    currency: "XOF",
    billingPeriod: "monthly",
    features: [
      "TOP des résultats de recherche",
      "Services illimités",
      "Badge Premium ⭐",
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
    },
    color: "gold",
    gradient: "from-amber-500 via-yellow-400 to-amber-600",
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
  const planOrder: SubscriptionPlanKey[] = ["FREE", "MONTHLY", "PREMIUM"];
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
    feature: "Nombre de services",
    FREE: "5",
    MONTHLY: "15",
    PREMIUM: "Illimité",
  },
  {
    feature: "Badge vérifié",
    FREE: false,
    MONTHLY: true,
    PREMIUM: true,
  },
  {
    feature: "Statistiques",
    FREE: false,
    MONTHLY: "Basiques",
    PREMIUM: "Avancées",
  },
  {
    feature: "Priorité recherche",
    FREE: "Normale",
    MONTHLY: "Haute",
    PREMIUM: "Maximum",
  },
  {
    feature: "Support client",
    FREE: "Email",
    MONTHLY: "Email prioritaire",
    PREMIUM: "24/7 Téléphone",
  },
  {
    feature: "Mise en avant homepage",
    FREE: false,
    MONTHLY: false,
    PREMIUM: true,
  },
  {
    feature: "Profil personnalisable",
    FREE: "Basique",
    MONTHLY: "Basique",
    PREMIUM: "Avancé",
  },
  {
    feature: "Alertes SMS",
    FREE: false,
    MONTHLY: true,
    PREMIUM: true,
  },
  {
    feature: "Formations",
    FREE: false,
    MONTHLY: false,
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
