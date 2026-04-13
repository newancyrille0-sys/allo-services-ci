/**
 * Configuration Allo Services CI
 * Paramètres globaux de l'application
 */

export const APP_CONFIG = {
  // Informations de l'entreprise
  name: "Allo Services CI",
  slogan: "Le bon prestataire, au bon moment, près de chez vous",
  description: "Marketplace de mise en relation clients/prestataires de services en Côte d'Ivoire",
  
  // Contact Administratif
  contact: {
    phone: "0141105707",
    phoneFormatted: "01 41 10 57 07",
    phoneInternational: "+2250141105707",
    email: "admin@alloserviceci.com",
    emailSupport: "support@alloserviceci.com",
    emailAdmin: "admin@alloserviceci.com",
  },
  
  // Adresse
  address: {
    city: "Abidjan",
    country: "Côte d'Ivoire",
    countryCode: "CI",
  },
  
  // Réseaux sociaux
  social: {
    facebook: "https://facebook.com/alloservicesci",
    instagram: "https://instagram.com/alloservicesci",
    twitter: "https://twitter.com/alloservicesci",
    linkedin: "https://linkedin.com/company/alloservicesci",
    whatsapp: "+2250141105707",
  },
  
  // Devise
  currency: {
    code: "XOF",
    symbol: "FCFA",
    name: "Franc CFA",
  },
  
  // URLs
  urls: {
    website: "https://alloservices.ci",
    api: "https://api.alloservices.ci",
    admin: "https://admin.alloservices.ci",
  },
  
  // Limites
  limits: {
    minReservationAmount: 1000, // FCFA
    maxReservationAmount: 5000000, // FCFA
    maxPhotosPerPublication: 10,
    maxVideoDuration: 300, // secondes
    maxServicesPerProvider: 50,
    otpExpirationMinutes: 5,
    reservationReminderHours: 24,
  },
  
  // Taux de commission par défaut
  commission: {
    defaultRate: 0.15, // 15%
    minRate: 0.05, // 5% (Elite)
    maxRate: 0.20, // 20%
  },
  
  // Programme de fidélité
  loyalty: {
    pointsPerReservation: 10, // Points par réservation
    pointsPerFCFA: 0.01, // 1 point pour 100 FCFA
    bonusFirstReservation: 100, // Points bonus première réservation
    referralBonus: 5000, // FCFA pour parrain et filleul
  },
  
  // Cashback
  cashback: {
    rate: 0.05, // 5%
    minAmount: 500, // FCFA
    availabilityDays: 30, // Disponible après 30 jours
  },
  
  // Assurance
  insurance: {
    coverageRate: 0.80, // 80% couverture
    maxCoverage: 500000, // FCFA
    claimDeadline: 48, // heures
  },
  
  // Horaires de travail
  businessHours: {
    start: "08:00",
    end: "18:00",
    timezone: "Africa/Abidjan",
  },
  
  // Support
  support: {
    availableHours: "8h - 20h",
    availableDays: "Lundi - Samedi",
    responseTime: "24h", // temps de réponse max
  },
};

// Tiers des prestataires
export const PROVIDER_TIERS = {
  GRATUIT: {
    name: "Gratuit",
    price: 0,
    commission: 0.15, // 15%
    maxPublications: 5,
    maxLives: 0,
    maxServices: 3,
    features: {
      canViewPhone: false,
      canPriority: false,
      canAnalytics: false,
      canPromo: false,
      canInvoice: false,
      canInsurance: false,
    },
    color: "#6B7280", // Gris
  },
  BASIC: {
    name: "Basic",
    price: 10000, // FCFA/mois
    commission: 0.12, // 12%
    maxPublications: 15,
    maxLives: 2,
    maxServices: 10,
    features: {
      canViewPhone: false,
      canPriority: false,
      canAnalytics: true,
      canPromo: false,
      canInvoice: true,
      canInsurance: false,
    },
    color: "#3B82F6", // Bleu
  },
  PREMIUM: {
    name: "Premium",
    price: 25000, // FCFA/mois
    commission: 0.08, // 8%
    maxPublications: 50,
    maxLives: 5,
    maxServices: 25,
    features: {
      canViewPhone: true,
      canPriority: true,
      canAnalytics: true,
      canPromo: true,
      canInvoice: true,
      canInsurance: true,
    },
    color: "#F59E0B", // Or
  },
  ELITE: {
    name: "Elite",
    price: 50000, // FCFA/mois
    commission: 0.05, // 5%
    maxPublications: -1, // Illimité
    maxLives: -1, // Illimité
    maxServices: -1, // Illimité
    features: {
      canViewPhone: true,
      canPriority: true,
      canAnalytics: true,
      canPromo: true,
      canInvoice: true,
      canInsurance: true,
    },
    color: "#8B5CF6", // Violet
  },
};

// Méthodes de paiement disponibles
export const PAYMENT_METHODS = {
  ORANGE_MONEY: {
    name: "Orange Money",
    code: "orange_money",
    icon: "🟠",
    color: "#FF6600",
  },
  MTN_MONEY: {
    name: "MTN Mobile Money",
    code: "mtn_money",
    icon: "🟡",
    color: "#FFCC00",
  },
  WAVE: {
    name: "Wave",
    code: "wave",
    icon: "🔵",
    color: "#1DC8F2",
  },
  MOOV_MONEY: {
    name: "Moov Money",
    code: "moov_money",
    icon: "🟣",
    color: "#0066CC",
  },
  CARD: {
    name: "Carte Bancaire",
    code: "card",
    icon: "💳",
    color: "#4B5563",
  },
  CASH: {
    name: "Espèces",
    code: "cash",
    icon: "💵",
    color: "#10B981",
  },
};

export default APP_CONFIG;
