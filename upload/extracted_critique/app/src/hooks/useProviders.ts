import { useState, useEffect, useCallback } from 'react';
import type { Provider, Review, FilterState } from '@/types';
import {
  getProviders,
  getActiveProviders,
  getPremiumProviders,
  getPendingProviders,
  getProviderById,
  saveProvider,
  getReviewsByProvider,
  saveReview,
  generateId,
  calculateTrustScore
} from '@/lib/storage';

export const useProviders = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    city: '',
    category: '',
    minTrustScore: 0,
    searchQuery: ''
  });

  useEffect(() => {
    const loadedProviders = getActiveProviders();
    setProviders(loadedProviders);
    setFilteredProviders(loadedProviders);
    setIsLoading(false);
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    let result = [...providers];

    if (filters.city) {
      result = result.filter(p => p.city.toLowerCase() === filters.city.toLowerCase());
    }

    if (filters.category) {
      result = result.filter(p => p.serviceCategory === filters.category);
    }

    if (filters.minTrustScore > 0) {
      result = result.filter(p => p.trustScore >= filters.minTrustScore);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(p => 
        p.firstName.toLowerCase().includes(query) ||
        p.lastName.toLowerCase().includes(query) ||
        p.serviceName.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query) ||
        p.district.toLowerCase().includes(query)
      );
    }

    setFilteredProviders(result);
  }, [providers, filters]);

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const getProvider = useCallback((id: string): Provider | undefined => {
    return getProviderById(id);
  }, []);

  const refreshProviders = useCallback(() => {
    setIsLoading(true);
    const loadedProviders = getActiveProviders();
    setProviders(loadedProviders);
    setIsLoading(false);
  }, []);

  return {
    providers,
    filteredProviders,
    isLoading,
    filters,
    updateFilters,
    getProvider,
    refreshProviders
  };
};

export const usePremiumProviders = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedProviders = getPremiumProviders();
    setProviders(loadedProviders);
    setIsLoading(false);
  }, []);

  return {
    providers,
    isLoading
  };
};

export const useProviderProfile = (providerId: string) => {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (providerId) {
      const loadedProvider = getProviderById(providerId);
      if (loadedProvider) {
        setProvider(loadedProvider);
        const loadedReviews = getReviewsByProvider(providerId);
        setReviews(loadedReviews);
      }
      setIsLoading(false);
    }
  }, [providerId]);

  const addReview = useCallback((reviewData: Omit<Review, 'id' | 'createdAt'>): { success: boolean; message: string } => {
    if (!provider) {
      return { success: false, message: 'Prestataire non trouvé.' };
    }

    const newReview: Review = {
      ...reviewData,
      id: generateId(),
      createdAt: new Date().toISOString()
    };

    saveReview(newReview);
    setReviews(prev => [...prev, newReview]);

    // Recalculer le score de confiance
    const updatedProvider = { ...provider };
    updatedProvider.trustScore = calculateTrustScore(updatedProvider);
    saveProvider(updatedProvider);
    setProvider(updatedProvider);

    return { success: true, message: 'Avis ajouté avec succès !' };
  }, [provider]);

  const getAverageRating = useCallback((): number => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  return {
    provider,
    reviews,
    isLoading,
    addReview,
    getAverageRating
  };
};

// Hook pour la gestion admin des prestataires
export const useAdminProviders = () => {
  const [allProviders, setAllProviders] = useState<Provider[]>([]);
  const [pendingProviders, setPendingProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setIsLoading(true);
    const loadedProviders = getProviders();
    setAllProviders(loadedProviders);
    setPendingProviders(getPendingProviders());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const validateProvider = useCallback((providerId: string): { success: boolean; message: string } => {
    const provider = getProviderById(providerId);
    if (!provider) {
      return { success: false, message: 'Prestataire non trouvé.' };
    }

    provider.isValidated = true;
    provider.isActive = provider.isPaid;
    provider.validatedAt = new Date().toISOString();
    provider.trustScore = calculateTrustScore(provider);

    saveProvider(provider);
    refresh();

    return { success: true, message: 'Prestataire validé avec succès !' };
  }, [refresh]);

  const suspendProvider = useCallback((providerId: string, reason: string): { success: boolean; message: string } => {
    const provider = getProviderById(providerId);
    if (!provider) {
      return { success: false, message: 'Prestataire non trouvé.' };
    }

    provider.isSuspended = true;
    provider.suspensionReason = reason;
    provider.isActive = false;
    provider.trustScore = calculateTrustScore(provider);

    saveProvider(provider);
    refresh();

    return { success: true, message: 'Prestataire suspendu.' };
  }, [refresh]);

  const activateProvider = useCallback((providerId: string): { success: boolean; message: string } => {
    const provider = getProviderById(providerId);
    if (!provider) {
      return { success: false, message: 'Prestataire non trouvé.' };
    }

    provider.isSuspended = false;
    provider.suspensionReason = undefined;
    provider.isActive = provider.isValidated && provider.isPaid;
    provider.trustScore = calculateTrustScore(provider);

    saveProvider(provider);
    refresh();

    return { success: true, message: 'Prestataire réactivé.' };
  }, [refresh]);

  const deleteProvider = useCallback((providerId: string): { success: boolean; message: string } => {
    const providers = getProviders();
    const filtered = providers.filter(p => p.id !== providerId);
    localStorage.setItem('alloservices_providers', JSON.stringify(filtered));
    refresh();

    return { success: true, message: 'Prestataire supprimé.' };
  }, [refresh]);

  const setPremium = useCallback((providerId: string, isPremium: boolean): { success: boolean; message: string } => {
    const provider = getProviderById(providerId);
    if (!provider) {
      return { success: false, message: 'Prestataire non trouvé.' };
    }

    provider.isPremium = isPremium;
    provider.trustScore = calculateTrustScore(provider);

    saveProvider(provider);
    refresh();

    return { success: true, message: isPremium ? 'Badge Premium activé !' : 'Badge Premium retiré.' };
  }, [refresh]);

  const confirmPayment = useCallback((providerId: string): { success: boolean; message: string } => {
    const provider = getProviderById(providerId);
    if (!provider) {
      return { success: false, message: 'Prestataire non trouvé.' };
    }

    provider.isPaid = true;
    provider.isActive = provider.isValidated;
    provider.trustScore = calculateTrustScore(provider);

    saveProvider(provider);
    refresh();

    return { success: true, message: 'Paiement confirmé. Le prestataire est maintenant actif.' };
  }, [refresh]);

  return {
    allProviders,
    pendingProviders,
    isLoading,
    refresh,
    validateProvider,
    suspendProvider,
    activateProvider,
    deleteProvider,
    setPremium,
    confirmPayment
  };
};
