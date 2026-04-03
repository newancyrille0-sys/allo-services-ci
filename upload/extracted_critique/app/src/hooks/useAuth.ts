import { useState, useEffect, useCallback } from 'react';
import type { User, Provider } from '@/types';
import {
  getCurrentUser,
  setCurrentUser,
  getCurrentProvider,
  setCurrentProvider,
  getUserByPhone,
  getUserByEmail,
  getProviderByPhone,
  saveUser,
  saveProvider,
  generateId,
  generateOTP,
  checkDuplicatePhone,
  createFraudAlert,
  getAdminSession,
  setAdminSession,
  ADMIN_CODE
} from '@/lib/storage';

// ==================== AUTH CLIENT ====================
export const useClientAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [pendingPhone, setPendingPhone] = useState<string>('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const register = useCallback(async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<{ success: boolean; message: string }> => {
    // Vérifier si le téléphone existe déjà
    if (checkDuplicatePhone(data.phone)) {
      // Créer une alerte de fraude
      createFraudAlert('duplicate_phone', `Tentative d'inscription avec un numéro déjà utilisé: ${data.phone}`, {
        phoneNumber: data.phone
      });
      return { success: false, message: 'Ce numéro de téléphone est déjà utilisé.' };
    }

    // Vérifier si l'email existe déjà
    const existingEmail = getUserByEmail(data.email);
    if (existingEmail) {
      return { success: false, message: 'Cette adresse email est déjà utilisée.' };
    }

    // Générer et envoyer OTP (simulation)
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    const newUser: User = {
      id: generateId(),
      email: data.email,
      phone: data.phone,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      createdAt: new Date().toISOString(),
      isVerified: false,
      otpCode: otp,
      otpExpiry
    };

    saveUser(newUser);
    setPendingPhone(data.phone);
    setOtpSent(true);

    // Simuler l'envoi de l'OTP
    console.log(`OTP envoyé au ${data.phone}: ${otp}`);

    return { success: true, message: `Un code de vérification a été envoyé au ${data.phone}` };
  }, []);

  const verifyOTP = useCallback(async (otp: string): Promise<{ success: boolean; message: string }> => {
    const user = getUserByPhone(pendingPhone);
    if (!user) {
      return { success: false, message: 'Utilisateur non trouvé.' };
    }

    if (user.otpCode !== otp) {
      return { success: false, message: 'Code de vérification incorrect.' };
    }

    if (user.otpExpiry && new Date(user.otpExpiry) < new Date()) {
      return { success: false, message: 'Le code de vérification a expiré.' };
    }

    // Marquer l'utilisateur comme vérifié
    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpiry = undefined;
    saveUser(user);

    // Connecter l'utilisateur
    setCurrentUser(user);
    setUser(user);
    setOtpSent(false);

    return { success: true, message: 'Votre compte a été vérifié avec succès !' };
  }, [pendingPhone]);

  const login = useCallback(async (phone: string, password: string): Promise<{ success: boolean; message: string }> => {
    const user = getUserByPhone(phone);
    if (!user) {
      return { success: false, message: 'Numéro de téléphone ou mot de passe incorrect.' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Numéro de téléphone ou mot de passe incorrect.' };
    }

    if (!user.isVerified) {
      // Renvoyer un OTP
      const otp = generateOTP();
      user.otpCode = otp;
      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      saveUser(user);
      setPendingPhone(phone);
      setOtpSent(true);
      return { success: false, message: 'Veuillez vérifier votre compte. Un nouveau code a été envoyé.' };
    }

    setCurrentUser(user);
    setUser(user);
    return { success: true, message: 'Connexion réussie !' };
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setUser(null);
  }, []);

  const resendOTP = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    const user = getUserByPhone(pendingPhone);
    if (!user) {
      return { success: false, message: 'Utilisateur non trouvé.' };
    }

    const otp = generateOTP();
    user.otpCode = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    saveUser(user);

    console.log(`Nouvel OTP envoyé au ${pendingPhone}: ${otp}`);

    return { success: true, message: 'Un nouveau code de vérification a été envoyé.' };
  }, [pendingPhone]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    otpSent,
    pendingPhone,
    register,
    verifyOTP,
    login,
    logout,
    resendOTP
  };
};

// ==================== AUTH PRESTATAIRE ====================
export const useProviderAuth = () => {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentProvider = getCurrentProvider();
    setProvider(currentProvider);
    setIsLoading(false);
  }, []);

  const register = useCallback(async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    serviceCategory: string;
    serviceName: string;
    city: string;
    district: string;
    description: string;
    photoUrl?: string;
    identityDocUrl?: string;
    selfieVideoUrl?: string;
    isPaid: boolean;
  }): Promise<{ success: boolean; message: string }> => {
    // Vérifier si le téléphone existe déjà
    if (checkDuplicatePhone(data.phone)) {
      createFraudAlert('duplicate_phone', `Tentative d'inscription prestataire avec un numéro déjà utilisé: ${data.phone}`, {
        phoneNumber: data.phone
      });
      return { success: false, message: 'Ce numéro de téléphone est déjà utilisé.' };
    }

    const newProvider: Provider = {
      id: generateId(),
      email: data.email,
      phone: data.phone,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      serviceCategory: data.serviceCategory,
      serviceName: data.serviceName,
      city: data.city,
      district: data.district,
      description: data.description,
      photoUrl: data.photoUrl,
      identityDocUrl: data.identityDocUrl,
      selfieVideoUrl: data.selfieVideoUrl,
      paymentProofUrl: undefined,
      isPaid: data.isPaid,
      isValidated: false,
      isActive: false,
      isPremium: false,
      trustScore: 50,
      createdAt: new Date().toISOString(),
      reviews: [],
      bookings: []
    };

    saveProvider(newProvider);

    return { 
      success: true, 
      message: 'Votre inscription a été enregistrée. Elle sera validée par notre équipe sous 24-48h.' 
    };
  }, []);

  const login = useCallback(async (phone: string, password: string): Promise<{ success: boolean; message: string }> => {
    const provider = getProviderByPhone(phone);
    if (!provider) {
      return { success: false, message: 'Numéro de téléphone ou mot de passe incorrect.' };
    }

    if (provider.password !== password) {
      return { success: false, message: 'Numéro de téléphone ou mot de passe incorrect.' };
    }

    if (!provider.isValidated) {
      return { success: false, message: 'Votre compte est en attente de validation par notre équipe.' };
    }

    if (!provider.isActive) {
      return { success: false, message: 'Votre compte n\'est pas encore actif. Veuillez finaliser votre abonnement.' };
    }

    if (provider.isSuspended) {
      return { success: false, message: 'Votre compte a été suspendu. Contactez le support.' };
    }

    setCurrentProvider(provider);
    setProvider(provider);
    return { success: true, message: 'Connexion réussie !' };
  }, []);

  const logout = useCallback(() => {
    setCurrentProvider(null);
    setProvider(null);
  }, []);

  const updateProvider = useCallback((updatedProvider: Provider) => {
    saveProvider(updatedProvider);
    setProvider(updatedProvider);
  }, []);

  return {
    provider,
    isLoading,
    isAuthenticated: !!provider,
    register,
    login,
    logout,
    updateProvider
  };
};

// ==================== AUTH ADMIN ====================
export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getAdminSession();
    if (session?.isAuthenticated && session?.adminCode === ADMIN_CODE) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (code: string): Promise<{ success: boolean; message: string }> => {
    if (code !== ADMIN_CODE) {
      return { success: false, message: 'Code administrateur incorrect.' };
    }

    const session = {
      isAuthenticated: true,
      loginTime: new Date().toISOString(),
      adminCode: code
    };

    setAdminSession(session);
    setIsAuthenticated(true);
    return { success: true, message: 'Connexion administrateur réussie !' };
  }, []);

  const logout = useCallback(() => {
    setAdminSession(null);
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
};
