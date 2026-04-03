import { useState, useEffect, useCallback } from 'react';
import type { FraudAlert, User, Provider } from '@/types';
import {
  getFraudAlerts,
  getUnresolvedFraudAlerts,
  saveFraudAlert,
  getUsers,
  getProviders,
  getBookings,
  getTestimonials,
  generateId
} from '@/lib/storage';

export const useAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    activeProviders: 0,
    pendingProviders: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    fraudAlerts: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshStats = useCallback(() => {
    setIsLoading(true);
    
    const users = getUsers();
    const providers = getProviders();
    const bookings = getBookings();
    const fraudAlerts = getUnresolvedFraudAlerts();

    setStats({
      totalUsers: users.length,
      totalProviders: providers.length,
      activeProviders: providers.filter(p => p.isActive && !p.isSuspended).length,
      pendingProviders: providers.filter(p => !p.isValidated || !p.isPaid).length,
      totalBookings: bookings.length,
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
      completedBookings: bookings.filter(b => b.status === 'completed').length,
      fraudAlerts: fraudAlerts.length
    });

    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return {
    stats,
    isLoading,
    refreshStats
  };
};

export const useFraudAlerts = () => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [unresolvedAlerts, setUnresolvedAlerts] = useState<FraudAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setIsLoading(true);
    const allAlerts = getFraudAlerts();
    setAlerts(allAlerts);
    setUnresolvedAlerts(allAlerts.filter(a => !a.isResolved));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const resolveAlert = useCallback((alertId: string): { success: boolean; message: string } => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) {
      return { success: false, message: 'Alerte non trouvée.' };
    }

    alert.isResolved = true;
    alert.resolvedAt = new Date().toISOString();
    saveFraudAlert(alert);
    refresh();

    return { success: true, message: 'Alerte marquée comme résolue.' };
  }, [alerts, refresh]);

  const createAlert = useCallback((type: FraudAlert['type'], description: string, data: {
    userId?: string;
    providerId?: string;
    phoneNumber?: string;
    ipAddress?: string;
  }): { success: boolean; message: string } => {
    const alert: FraudAlert = {
      id: generateId(),
      type,
      description,
      ...data,
      createdAt: new Date().toISOString(),
      isResolved: false
    };

    saveFraudAlert(alert);
    refresh();

    return { success: true, message: 'Alerte créée.' };
  }, [refresh]);

  // Détection automatique des fraudes
  const detectFraud = useCallback((): { alerts: FraudAlert[]; message: string } => {
    const newAlerts: FraudAlert[] = [];
    const users = getUsers();
    const providers = getProviders();

    // Détecter les numéros dupliqués
    const phoneMap = new Map<string, (User | Provider)[]>();
    
    [...users, ...providers].forEach(person => {
      const existing = phoneMap.get(person.phone) || [];
      existing.push(person);
      phoneMap.set(person.phone, existing);
    });

    phoneMap.forEach((people, phone) => {
      if (people.length > 1) {
        const alert: FraudAlert = {
          id: generateId(),
          type: 'duplicate_phone',
          description: `Numéro de téléphone dupliqué détecté: ${phone} (${people.length} comptes)`,
          phoneNumber: phone,
          createdAt: new Date().toISOString(),
          isResolved: false
        };
        saveFraudAlert(alert);
        newAlerts.push(alert);
      }
    });

    // Détecter les comptes suspects (créés rapidement)
    const recentUsers = users.filter(u => {
      const created = new Date(u.createdAt);
      const hoursSinceCreation = (Date.now() - created.getTime()) / (1000 * 60 * 60);
      return hoursSinceCreation < 1;
    });

    if (recentUsers.length > 5) {
      const alert: FraudAlert = {
        id: generateId(),
        type: 'suspicious_account',
        description: `Création de comptes suspecte: ${recentUsers.length} comptes créés en moins d'une heure`,
        createdAt: new Date().toISOString(),
        isResolved: false
      };
      saveFraudAlert(alert);
      newAlerts.push(alert);
    }

    refresh();

    return {
      alerts: newAlerts,
      message: newAlerts.length > 0 
        ? `${newAlerts.length} alerte(s) de fraude détectée(s)` 
        : 'Aucune fraude détectée'
    };
  }, [refresh]);

  return {
    alerts,
    unresolvedAlerts,
    isLoading,
    refresh,
    resolveAlert,
    createAlert,
    detectFraud
  };
};

// Hook pour la gestion des témoignages
export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loaded = getTestimonials();
    setTestimonials(loaded);
    setIsLoading(false);
  }, []);

  const refresh = useCallback(() => {
    const loaded = getTestimonials();
    setTestimonials(loaded);
  }, []);

  return {
    testimonials,
    isLoading,
    refresh
  };
};

// Hook pour les activités récentes
export const useRecentActivity = () => {
  const [activities, setActivities] = useState<any[]>([]);

  const refresh = useCallback(() => {
    const providers = getProviders();
    const bookings = getBookings();

    const recentProviders = providers
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(p => ({
        type: 'provider_registration',
        title: 'Nouveau prestataire',
        description: `${p.firstName} ${p.lastName} - ${p.serviceName}`,
        date: p.createdAt,
        status: p.isValidated ? 'validated' : 'pending'
      }));

    const recentBookings = bookings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(b => ({
        type: 'booking',
        title: 'Nouvelle réservation',
        description: `${b.clientName} → ${b.providerName}`,
        date: b.createdAt,
        status: b.status
      }));

    const combined = [...recentProviders, ...recentBookings]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    setActivities(combined);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    activities,
    refresh
  };
};
