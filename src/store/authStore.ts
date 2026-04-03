"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// User types based on Prisma schema
export type UserRole = "CLIENT" | "PROVIDER" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED" | "BANNED" | "PENDING_VERIFICATION";
export type KycStatus = "PENDING" | "VERIFIED" | "REJECTED";
export type SubscriptionPlan = "FREE" | "MONTHLY" | "PREMIUM";

export interface User {
  id: string;
  email: string | null;
  phone: string;
  role: UserRole;
  status: UserStatus;
  fullName: string;
  avatarUrl: string | null;
  city: string | null;
  country: string;
  otpVerified: boolean;
  trustScore: number;
  createdAt: string;
}

export interface Provider {
  id: string;
  userId: string;
  businessName: string | null;
  description: string | null;
  categories: string[];
  hourlyRate: number | null;
  isVerified: boolean;
  kycStatus: KycStatus;
  badgeVerified: boolean;
  totalReservations: number;
  totalReviews: number;
  averageRating: number;
  subscriptionStatus: SubscriptionPlan;
  subscriptionExpiresAt: string | null;
  isActive: boolean;
}

export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
}

export interface ClientRegisterData {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
}

export interface ProviderRegisterData {
  // Step 1: Personal info
  fullName: string;
  phone: string;
  email: string;
  password: string;
  // Step 2: Professional info
  businessName: string;
  description: string;
  categories: string[];
  hourlyRate: number;
  city: string;
  address: string;
  // Step 3: KYC documents
  cniFile?: File | null;
  registreCommerceFile?: File | null;
  profilePhotoFile?: File | null;
  // Step 4: Subscription
  subscriptionPlan: SubscriptionPlan;
}

interface AuthState {
  user: User | null;
  provider: Provider | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  pendingPhone: string | null;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; role?: UserRole }>;
  register: (data: ClientRegisterData) => Promise<{ success: boolean }>;
  registerProvider: (data: ProviderRegisterData) => Promise<{ success: boolean }>;
  logout: () => Promise<void>;
  verifyOTP: (otp: string) => Promise<{ success: boolean; role?: UserRole }>;
  sendOTP: (phone: string) => Promise<{ success: boolean }>;
  setUser: (user: User | null) => void;
  setProvider: (provider: Provider | null) => void;
  setPendingPhone: (phone: string | null) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      provider: null,
      isLoading: false,
      isAuthenticated: false,
      pendingPhone: null,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          const data = await response.json();

          if (!response.ok) {
            set({ error: data.error || "Erreur de connexion", isLoading: false });
            return { success: false };
          }

          set({
            user: data.user,
            provider: data.provider || null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, role: data.user.role };
        } catch {
          set({ error: "Erreur de connexion au serveur", isLoading: false });
          return { success: false };
        }
      },

      register: async (data: ClientRegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, role: "CLIENT" }),
          });

          const result = await response.json();

          if (!response.ok) {
            set({ error: result.error || "Erreur lors de l'inscription", isLoading: false });
            return { success: false };
          }

          set({
            pendingPhone: data.phone,
            isLoading: false,
            error: null,
          });

          return { success: true };
        } catch {
          set({ error: "Erreur de connexion au serveur", isLoading: false });
          return { success: false };
        }
      },

      registerProvider: async (data: ProviderRegisterData) => {
        set({ isLoading: true, error: null });
        try {
          // Use FormData for file uploads
          const formData = new FormData();
          formData.append("fullName", data.fullName);
          formData.append("phone", data.phone);
          formData.append("email", data.email);
          formData.append("password", data.password);
          formData.append("businessName", data.businessName);
          formData.append("description", data.description);
          formData.append("categories", JSON.stringify(data.categories));
          formData.append("hourlyRate", data.hourlyRate.toString());
          formData.append("city", data.city);
          formData.append("address", data.address);
          formData.append("subscriptionPlan", data.subscriptionPlan);
          formData.append("role", "PROVIDER");

          if (data.cniFile) {
            formData.append("cniFile", data.cniFile);
          }
          if (data.registreCommerceFile) {
            formData.append("registreCommerceFile", data.registreCommerceFile);
          }
          if (data.profilePhotoFile) {
            formData.append("profilePhotoFile", data.profilePhotoFile);
          }

          const response = await fetch("/api/auth/register", {
            method: "POST",
            body: formData,
          });

          const result = await response.json();

          if (!response.ok) {
            set({ error: result.error || "Erreur lors de l'inscription", isLoading: false });
            return { success: false };
          }

          set({
            pendingPhone: data.phone,
            isLoading: false,
            error: null,
          });

          return { success: true };
        } catch {
          set({ error: "Erreur de connexion au serveur", isLoading: false });
          return { success: false };
        }
      },

      logout: async () => {
        try {
          await fetch("/api/auth/logout", { method: "POST" });
        } catch {
          // Ignore logout API errors
        }
        set({
          user: null,
          provider: null,
          isAuthenticated: false,
          pendingPhone: null,
          error: null,
        });
      },

      verifyOTP: async (otp: string) => {
        set({ isLoading: true, error: null });
        try {
          const { pendingPhone } = get();
          const response = await fetch("/api/auth/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: pendingPhone, otp }),
          });

          const data = await response.json();

          if (!response.ok) {
            set({ error: data.error || "Code OTP invalide", isLoading: false });
            return { success: false };
          }

          set({
            user: data.user,
            provider: data.provider || null,
            isAuthenticated: true,
            pendingPhone: null,
            isLoading: false,
            error: null,
          });

          return { success: true, role: data.user?.role };
        } catch {
          set({ error: "Erreur de connexion au serveur", isLoading: false });
          return { success: false };
        }
      },

      sendOTP: async (phone: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/auth/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone }),
          });

          const data = await response.json();

          if (!response.ok) {
            set({ error: data.error || "Erreur lors de l'envoi du code", isLoading: false });
            return { success: false };
          }

          set({ pendingPhone: phone, isLoading: false });
          return { success: true };
        } catch {
          set({ error: "Erreur de connexion au serveur", isLoading: false });
          return { success: false };
        }
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setProvider: (provider) => set({ provider }),
      setPendingPhone: (phone) => set({ pendingPhone: phone }),
      clearError: () => set({ error: null }),

      checkAuth: async () => {
        try {
          const response = await fetch("/api/auth/me");
          if (response.ok) {
            const data = await response.json();
            set({
              user: data.user,
              provider: data.provider || null,
              isAuthenticated: !!data.user,
            });
          } else {
            set({ user: null, provider: null, isAuthenticated: false });
          }
        } catch {
          set({ user: null, provider: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        provider: state.provider,
        isAuthenticated: state.isAuthenticated,
        pendingPhone: state.pendingPhone,
      }),
    }
  )
);

export default useAuthStore;
