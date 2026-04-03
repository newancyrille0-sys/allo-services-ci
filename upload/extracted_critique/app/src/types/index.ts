// Types pour Allo Services CI

export interface User {
  id: string;
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  isVerified: boolean;
  otpCode?: string;
  otpExpiry?: string;
}

export interface Provider {
  id: string;
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  serviceCategory: string;
  serviceName: string;
  city: string;
  district: string;
  description: string;
  photoUrl?: string;
  identityDocUrl?: string;
  selfieVideoUrl?: string;
  paymentProofUrl?: string;
  isPaid: boolean;
  isValidated: boolean;
  isActive: boolean;
  isPremium: boolean;
  trustScore: number;
  createdAt: string;
  validatedAt?: string;
  reviews: Review[];
  bookings: Booking[];
  isSuspended?: boolean;
  suspensionReason?: string;
}

export interface Review {
  id: string;
  clientId: string;
  clientName: string;
  providerId: string;
  rating: number;
  comment: string;
  createdAt: string;
  bookingId: string;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  providerId: string;
  providerName: string;
  serviceName: string;
  date: string;
  time: string;
  address: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientPhoto?: string;
  rating: number;
  comment: string;
  serviceUsed: string;
  createdAt: string;
}

export interface FraudAlert {
  id: string;
  type: 'duplicate_phone' | 'duplicate_ip' | 'suspicious_account' | 'fake_review';
  description: string;
  userId?: string;
  providerId?: string;
  phoneNumber?: string;
  ipAddress?: string;
  createdAt: string;
  isResolved: boolean;
  resolvedAt?: string;
}

export interface AdminSession {
  isAuthenticated: boolean;
  loginTime?: string;
  adminCode: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'email' | 'sms' | 'whatsapp';
  title: string;
  message: string;
  sentAt: string;
  isRead: boolean;
}

export type ViewMode = 'grid' | 'list';

export interface FilterState {
  city: string;
  category: string;
  minTrustScore: number;
  searchQuery: string;
}

// Villes de Côte d'Ivoire
export const CITIES_CI = [
  'Abengourou', 'Abidjan', 'Abobo', 'Aboisso', 'Adiaké', 'Adjamé', 'Adzopé', 
  'Afféry', 'Agboville', 'Agnibilékrou', 'Akoupé', 'Anyama', 'Arrah', 'Azaguié', 
  'Bako', 'Bangolo', 'Béoumi', 'Bettié', 'Biankouma', 'Bingerville', 'Bloléquin', 
  'Bocanda', 'Bondoukou', 'Bongouanou', 'Bonoua', 'Bouaflé', 'Bouaké', 'Bouna', 
  'Boundiali', 'Dabakala', 'Dabou', 'Daloa', 'Danané', 'Daoukro', 'Didiévi', 
  'Dimbokro', 'Divo', 'Duékoué', 'Ferkessédougou', 'Fresco', 'Gagnoa', 
  'Grand-Bassam', 'Guiglo', 'Homme', 'Issia', 'Katiola', 'Korhogo', 'Lakota', 
  'Mankono', 'Odienné', 'Oumé', 'Sakassou', 'San-Pédro', 'Sassandra', 'Séguéla', 
  'Sinfra', 'Soubré', 'Tabou', 'Tanda', 'Tengrela', 'Tiassalé', 'Touba', 
  'Toumodi', 'Vavoua', 'Yamoussoukro', 'Zuénoula'
] as const;

// Catégories de services
export const SERVICE_CATEGORIES = [
  { id: 'plomberie', name: 'Plomberie', icon: 'Droplets', color: 'bg-blue-500', description: 'Plombiers, débouchage, réparation canalisation' },
  { id: 'electricite', name: 'Électricité', icon: 'Zap', color: 'bg-yellow-500', description: 'Électriciens, installation, réparation appareils' },
  { id: 'beaute', name: 'Beauté & Bien-être', icon: 'Sparkles', color: 'bg-pink-500', description: 'Coiffeurs, maquilleurs, soins esthétiques' },
  { id: 'livraison', name: 'Livraison & Transport', icon: 'Truck', color: 'bg-green-500', description: 'Livreurs, déménagement, courses' },
  { id: 'reparation', name: 'Réparations', icon: 'Wrench', color: 'bg-orange-500', description: 'Réparation téléphone, électroménager, voiture' },
  { id: 'nettoyage', name: 'Nettoyage & Jardinage', icon: 'Home', color: 'bg-teal-500', description: 'Ménage, jardinage, entretien espace vert' },
  { id: 'informatique', name: 'Informatique', icon: 'Monitor', color: 'bg-purple-500', description: 'Développement web, réparation ordinateur' },
  { id: 'restauration', name: 'Restauration', icon: 'Utensils', color: 'bg-red-500', description: 'Traiteur, chef à domicile, livraison repas' },
  { id: 'evenementiel', name: 'Événementiel', icon: 'PartyPopper', color: 'bg-indigo-500', description: 'Photographe, DJ, organisation événements' },
  { id: 'services-perso', name: 'Services Personnels', icon: 'Users', color: 'bg-cyan-500', description: 'Baby-sitting, cours particuliers, coaching' },
] as const;

// Services détaillés par catégorie
export const SERVICES_BY_CATEGORY: Record<string, string[]> = {
  'plomberie': [
    'Plomberie générale',
    'Débouchage canalisation',
    'Réparation fuite d\'eau',
    'Installation sanitaire',
    'Réparation chauffe-eau'
  ],
  'electricite': [
    'Électricité générale',
    'Installation électrique',
    'Réparation appareils',
    'Installation climatisation',
    'Réparation climatisation'
  ],
  'beaute': [
    'Coiffure à domicile',
    'Maquillage',
    'Manucure/Pédicure',
    'Massage à domicile',
    'Barbier',
    'Soins esthétiques'
  ],
  'livraison': [
    'Livreur à moto',
    'Livreur en voiture',
    'Transport de marchandises',
    'Courses et commissions',
    'Déménagement'
  ],
  'reparation': [
    'Réparation téléphone',
    'Réparation ordinateur',
    'Réparation électroménager',
    'Réparation voiture',
    'Réparation moto',
    'Serrurerie'
  ],
  'nettoyage': [
    'Nettoyage maison',
    'Nettoyage bureau',
    'Entretien jardin',
    'Nettoyage fin de bail'
  ],
  'informatique': [
    'Développement web',
    'Réparation ordinateur',
    'Installation logiciel',
    'Récupération données',
    'Maintenance réseau'
  ],
  'restauration': [
    'Traiteur',
    'Chef à domicile',
    'Livraison repas',
    'Boulangerie à domicile'
  ],
  'evenementiel': [
    'Photographe',
    'Vidéaste',
    'DJ',
    'Animateur',
    'Décoration événement'
  ],
  'services-perso': [
    'Baby-sitting',
    'Cours particuliers',
    'Coaching sportif',
    'Assistante administrative',
    'Garde malade'
  ]
};

// Constantes
export const ADMIN_CODE = 'Cy-73-03';
export const SUBSCRIPTION_AMOUNT_MIN = 5000;
export const SUBSCRIPTION_AMOUNT_MAX = 10000;
export const MAX_TRUST_SCORE = 100;
