"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, type User, type LoginCredentials, type ClientRegisterData, type ProviderRegisterData, type UserRole } from "@/store/authStore";

interface UseAuthReturn {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  pendingPhone: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; role?: UserRole }>;
  register: (data: ClientRegisterData) => Promise<{ success: boolean }>;
  registerProvider: (data: ProviderRegisterData) => Promise<{ success: boolean }>;
  logout: () => Promise<void>;
  verifyOTP: (otp: string) => Promise<{ success: boolean; role?: UserRole }>;
  sendOTP: (phone: string) => Promise<{ success: boolean }>;
  clearError: () => void;
  checkAuth: () => Promise<void>;

  // Computed
  isClient: boolean;
  isProvider: boolean;
  isAdmin: boolean;
  isActive: boolean;
  isVerified: boolean;

  // Navigation helpers
  redirectToDashboard: () => void;
  getDashboardPath: () => string;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const {
    user,
    isLoading,
    isAuthenticated,
    error,
    pendingPhone,
    login: storeLogin,
    register: storeRegister,
    registerProvider: storeRegisterProvider,
    logout: storeLogout,
    verifyOTP: storeVerifyOTP,
    sendOTP: storeSendOTP,
    clearError,
    checkAuth,
  } = useAuthStore();

  // Computed values
  const isClient = user?.role === "CLIENT";
  const isProvider = user?.role === "PROVIDER";
  const isAdmin = user?.role === "ADMIN";
  const isActive = user?.status === "ACTIVE";
  const isVerified = user?.otpVerified === true;

  // Get dashboard path based on role
  const getDashboardPath = useCallback((): string => {
    if (!user) return "/login";

    switch (user.role) {
      case "CLIENT":
        return "/client/profile";
      case "PROVIDER":
        return "/provider/profile";
      case "ADMIN":
        return "/admin/dashboard";
      default:
        return "/";
    }
  }, [user]);

  // Redirect to appropriate dashboard
  const redirectToDashboard = useCallback(() => {
    const path = getDashboardPath();
    router.push(path);
  }, [router, getDashboardPath]);

  // Check auth on mount
  useEffect(() => {
    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, checkAuth]);

  return {
    // State
    user,
    isLoading,
    isAuthenticated,
    error,
    pendingPhone,

    // Actions
    login: storeLogin,
    register: storeRegister,
    registerProvider: storeRegisterProvider,
    logout: async () => {
      await storeLogout();
      router.push("/login");
    },
    verifyOTP: storeVerifyOTP,
    sendOTP: storeSendOTP,
    clearError,
    checkAuth,

    // Computed
    isClient,
    isProvider,
    isAdmin,
    isActive,
    isVerified,

    // Navigation helpers
    redirectToDashboard,
    getDashboardPath,
  };
}

export default useAuth;
