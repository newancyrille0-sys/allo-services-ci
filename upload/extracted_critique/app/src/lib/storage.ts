// Système de stockage local pour Allo Services CI
// Simule une base de données avec localStorage

import type { User, Provider, Booking, Review, FraudAlert, Testimonial } from '@/types';

export type { User, Provider, Booking, Review, FraudAlert, Testimonial };

// Clés de stockage
const STORAGE_KEYS = {
  USERS: 'alloservices_users',
  PROVIDERS: 'alloservices_providers',
  BOOKINGS: 'alloservices_bookings',
  REVIEWS: 'alloservices_reviews',
  FRAUD_ALERTS: 'alloservices_fraud_alerts',
  TESTIMONIALS: 'alloservices_testimonials',
  CURRENT_USER: 'alloservices_current_user',
  CURRENT_PROVIDER: 'alloservices_current_provider',
  ADMIN_SESSION: 'alloservices_admin_session',
} as const;

// Fonctions utilitaires
const getItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Erreur de stockage:', error);
  }
};

// Génération d'ID unique
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Génération d'OTP à 6 chiffres
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ==================== USERS ====================
export const getUsers = (): User[] => getItem(STORAGE_KEYS.USERS, []);

export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  setItem(STORAGE_KEYS.USERS, users);
};

export const getUserByPhone = (phone: string): User | undefined => {
  return getUsers().find(u => u.phone === phone);
};

export const getUserByEmail = (email: string): User | undefined => {
  return getUsers().find(u => u.email === email);
};

export const getUserById = (id: string): User | undefined => {
  return getUsers().find(u => u.id === id);
};

// ==================== PROVIDERS ====================
export const getProviders = (): Provider[] => getItem(STORAGE_KEYS.PROVIDERS, []);

export const saveProvider = (provider: Provider): void => {
  const providers = getProviders();
  const existingIndex = providers.findIndex(p => p.id === provider.id);
  if (existingIndex >= 0) {
    providers[existingIndex] = provider;
  } else {
    providers.push(provider);
  }
  setItem(STORAGE_KEYS.PROVIDERS, providers);
};

export const getProviderByPhone = (phone: string): Provider | undefined => {
  return getProviders().find(p => p.phone === phone);
};

export const getProviderById = (id: string): Provider | undefined => {
  return getProviders().find(p => p.id === id);
};

export const getActiveProviders = (): Provider[] => {
  return getProviders().filter(p => p.isActive && p.isValidated && !p.isSuspended);
};

export const getPendingProviders = (): Provider[] => {
  return getProviders().filter(p => !p.isValidated || !p.isPaid);
};

export const getPremiumProviders = (): Provider[] => {
  return getActiveProviders().filter(p => p.isPremium);
};

// ==================== BOOKINGS ====================
export const getBookings = (): Booking[] => getItem(STORAGE_KEYS.BOOKINGS, []);

export const saveBooking = (booking: Booking): void => {
  const bookings = getBookings();
  const existingIndex = bookings.findIndex(b => b.id === booking.id);
  if (existingIndex >= 0) {
    bookings[existingIndex] = booking;
  } else {
    bookings.push(booking);
  }
  setItem(STORAGE_KEYS.BOOKINGS, bookings);
};

export const getBookingsByClient = (clientId: string): Booking[] => {
  return getBookings().filter(b => b.clientId === clientId);
};

export const getBookingsByProvider = (providerId: string): Booking[] => {
  return getBookings().filter(b => b.providerId === providerId);
};

// ==================== REVIEWS ====================
export const getReviews = (): Review[] => getItem(STORAGE_KEYS.REVIEWS, []);

export const saveReview = (review: Review): void => {
  const reviews = getReviews();
  const existingIndex = reviews.findIndex(r => r.id === review.id);
  if (existingIndex >= 0) {
    reviews[existingIndex] = review;
  } else {
    reviews.push(review);
  }
  setItem(STORAGE_KEYS.REVIEWS, reviews);
};

export const getReviewsByProvider = (providerId: string): Review[] => {
  return getReviews().filter(r => r.providerId === providerId);
};

// ==================== FRAUD ALERTS ====================
export const getFraudAlerts = (): FraudAlert[] => getItem(STORAGE_KEYS.FRAUD_ALERTS, []);

export const saveFraudAlert = (alert: FraudAlert): void => {
  const alerts = getFraudAlerts();
  const existingIndex = alerts.findIndex(a => a.id === alert.id);
  if (existingIndex >= 0) {
    alerts[existingIndex] = alert;
  } else {
    alerts.push(alert);
  }
  setItem(STORAGE_KEYS.FRAUD_ALERTS, alerts);
};

export const getUnresolvedFraudAlerts = (): FraudAlert[] => {
  return getFraudAlerts().filter(a => !a.isResolved);
};

// ==================== TESTIMONIALS ====================
export const getTestimonials = (): Testimonial[] => getItem(STORAGE_KEYS.TESTIMONIALS, []);

export const saveTestimonial = (testimonial: Testimonial): void => {
  const testimonials = getTestimonials();
  testimonials.push(testimonial);
  setItem(STORAGE_KEYS.TESTIMONIALS, testimonials);
};

// ==================== SESSION ====================
export const getCurrentUser = (): User | null => {
  return getItem(STORAGE_KEYS.CURRENT_USER, null);
};

export const setCurrentUser = (user: User | null): void => {
  setItem(STORAGE_KEYS.CURRENT_USER, user);
};

export const getCurrentProvider = (): Provider | null => {
  return getItem(STORAGE_KEYS.CURRENT_PROVIDER, null);
};

export const setCurrentProvider = (provider: Provider | null): void => {
  setItem(STORAGE_KEYS.CURRENT_PROVIDER, provider);
};

export const getAdminSession = (): { isAuthenticated: boolean; loginTime?: string; adminCode?: string } | null => {
  return getItem(STORAGE_KEYS.ADMIN_SESSION, null);
};

export const setAdminSession = (session: { isAuthenticated: boolean; loginTime?: string; adminCode?: string } | null): void => {
  setItem(STORAGE_KEYS.ADMIN_SESSION, session);
};

// ==================== INITIALISATION ====================
export const initializeMockData = (): void => {
  // Vérifier si les données existent déjà
  if (getProviders().length > 0) return;

  // Créer des prestataires de démonstration
  const mockProviders: Provider[] = [
    {
      id: generateId(),
      email: 'kouassi.jean@email.ci',
      phone: '0750123456',
      password: 'password123',
      firstName: 'Jean',
      lastName: 'Kouassi',
      serviceCategory: 'plomberie',
      serviceName: 'Plomberie générale',
      city: 'Abidjan',
      district: 'Cocody',
      description: 'Plombier professionnel avec 10 ans d\'expérience. Dépannage rapide 7j/7.',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      isPaid: true,
      isValidated: true,
      isActive: true,
      isPremium: true,
      trustScore: 95,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      validatedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      reviews: [],
      bookings: []
    },
    {
      id: generateId(),
      email: 'amani.marie@email.ci',
      phone: '0745123456',
      password: 'password123',
      firstName: 'Marie',
      lastName: 'Amani',
      serviceCategory: 'beaute',
      serviceName: 'Coiffure à domicile',
      city: 'Abidjan',
      district: 'Marcory',
      description: 'Coiffeuse professionnelle spécialisée dans les tresses, perruques et soins capillaires.',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      isPaid: true,
      isValidated: true,
      isActive: true,
      isPremium: true,
      trustScore: 92,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      validatedAt: new Date(Date.now() - 43 * 24 * 60 * 60 * 1000).toISOString(),
      reviews: [],
      bookings: []
    },
    {
      id: generateId(),
      email: 'ouattara.kofi@email.ci',
      phone: '0760123456',
      password: 'password123',
      firstName: 'Kofi',
      lastName: 'Ouattara',
      serviceCategory: 'electricite',
      serviceName: 'Électricité générale',
      city: 'Bouaké',
      district: 'Centre-ville',
      description: 'Électricien qualifié pour tous vos travaux d\'installation et de réparation.',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      isPaid: true,
      isValidated: true,
      isActive: true,
      isPremium: false,
      trustScore: 88,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      validatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      reviews: [],
      bookings: []
    },
    {
      id: generateId(),
      email: 'yao.blessing@email.ci',
      phone: '0775123456',
      password: 'password123',
      firstName: 'Blessing',
      lastName: 'Yao',
      serviceCategory: 'livraison',
      serviceName: 'Livreur à moto',
      city: 'Abidjan',
      district: 'Yopougon',
      description: 'Livreur rapide et fiable. Livraison de colis, documents et courses.',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      isPaid: true,
      isValidated: true,
      isActive: true,
      isPremium: false,
      trustScore: 85,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      validatedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
      reviews: [],
      bookings: []
    },
    {
      id: generateId(),
      email: 'kone.fatou@email.ci',
      phone: '0780123456',
      password: 'password123',
      firstName: 'Fatou',
      lastName: 'Koné',
      serviceCategory: 'beaute',
      serviceName: 'Maquillage',
      city: 'Yamoussoukro',
      district: 'Centre',
      description: 'Maquilleuse professionnelle pour mariages, événements et shootings.',
      photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      isPaid: true,
      isValidated: true,
      isActive: true,
      isPremium: true,
      trustScore: 90,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      validatedAt: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000).toISOString(),
      reviews: [],
      bookings: []
    },
    {
      id: generateId(),
      email: 'bamba.ibrahim@email.ci',
      phone: '0790123456',
      password: 'password123',
      firstName: 'Ibrahim',
      lastName: 'Bamba',
      serviceCategory: 'reparation',
      serviceName: 'Réparation téléphone',
      city: 'San-Pédro',
      district: 'Centre',
      description: 'Réparation de smartphones, tablettes et ordinateurs. Pièces originales garanties.',
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      isPaid: true,
      isValidated: true,
      isActive: true,
      isPremium: false,
      trustScore: 87,
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      validatedAt: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
      reviews: [],
      bookings: []
    }
  ];

  // Sauvegarder les prestataires
  setItem(STORAGE_KEYS.PROVIDERS, mockProviders);

  // Créer des témoignages
  const mockTestimonials: Testimonial[] = [
    {
      id: generateId(),
      clientName: 'Aminata Diallo',
      rating: 5,
      comment: 'Jean est un excellent plombier ! Intervention rapide et professionnelle. Je recommande vivement.',
      serviceUsed: 'Plomberie',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: generateId(),
      clientName: 'Emmanuel Koffi',
      rating: 5,
      comment: 'Marie a fait un travail exceptionnel sur mes tresses. Très professionnelle et à l\'écoute.',
      serviceUsed: 'Coiffure',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: generateId(),
      clientName: 'Sandra Yapi',
      rating: 4,
      comment: 'Livraison rapide et soignée. Le livreur était très courtois.',
      serviceUsed: 'Livraison',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  setItem(STORAGE_KEYS.TESTIMONIALS, mockTestimonials);
};

// ==================== FRAUD DETECTION ====================
export const checkDuplicatePhone = (phone: string, excludeId?: string): boolean => {
  const users = getUsers();
  const providers = getProviders();
  
  const duplicateUser = users.find(u => u.phone === phone && u.id !== excludeId);
  const duplicateProvider = providers.find(p => p.phone === phone && p.id !== excludeId);
  
  return !!duplicateUser || !!duplicateProvider;
};

export const createFraudAlert = (type: FraudAlert['type'], description: string, data: {
  userId?: string;
  providerId?: string;
  phoneNumber?: string;
  ipAddress?: string;
}): void => {
  const alert: FraudAlert = {
    id: generateId(),
    type,
    description,
    ...data,
    createdAt: new Date().toISOString(),
    isResolved: false
  };
  saveFraudAlert(alert);
};

// ==================== CALCUL DU SCORE DE CONFIANCE ====================
export const calculateTrustScore = (provider: Provider): number => {
  let score = 50; // Score de base
  
  // +20 points si validé
  if (provider.isValidated) score += 20;
  
  // +15 points si premium
  if (provider.isPremium) score += 15;
  
  // +10 points si abonnement payé
  if (provider.isPaid) score += 10;
  
  // Jusqu'à +10 points basés sur les avis
  const reviews = getReviewsByProvider(provider.id);
  if (reviews.length > 0) {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    score += Math.min(10, avgRating * 2);
  }
  
  // -20 points si suspendu
  if (provider.isSuspended) score -= 20;
  
  return Math.min(100, Math.max(0, score));
};

// ==================== CONSTANTES ====================
export const ADMIN_CODE = 'Cy-73-03';
export const SUBSCRIPTION_AMOUNT_MIN = 5000;
export const SUBSCRIPTION_AMOUNT_MAX = 10000;
export const MAX_TRUST_SCORE = 100;
