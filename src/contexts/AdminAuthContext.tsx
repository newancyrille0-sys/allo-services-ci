"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'SUPER_ADMIN' | 'ADMIN_SENIOR' | 'ADMIN_MODERATOR' | 'SUPPORT';
  status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  avatarUrl?: string;
  permissions?: string[];
  twoFactorEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshAdmin: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Permissions par rôle (côté client)
const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: [
    'users.read', 'users.write', 'users.suspend', 'users.delete',
    'providers.read', 'providers.write', 'providers.verify', 'providers.suspend',
    'kyc.read', 'kyc.approve', 'kyc.reject',
    'reservations.read', 'reservations.write', 'reservations.cancel',
    'payments.read', 'payments.refund', 'payments.export',
    'finance.read', 'finance.export',
    'content.read', 'content.moderate', 'content.delete',
    'support.read', 'support.respond',
    'admins.read', 'admins.create', 'admins.update', 'admins.delete',
    'system.settings', 'system.logs', 'system.analytics',
  ],
  ADMIN_SENIOR: [
    'users.read', 'users.write', 'users.suspend',
    'providers.read', 'providers.write', 'providers.verify', 'providers.suspend',
    'kyc.read', 'kyc.approve', 'kyc.reject',
    'reservations.read', 'reservations.write', 'reservations.cancel',
    'payments.read', 'payments.refund',
    'finance.read', 'finance.export',
    'content.read', 'content.moderate',
    'support.read', 'support.respond',
    'system.logs', 'system.analytics',
  ],
  ADMIN_MODERATOR: [
    'users.read',
    'providers.read',
    'content.read', 'content.moderate', 'content.delete',
    'support.read',
  ],
  SUPPORT: [
    'users.read',
    'providers.read',
    'reservations.read',
    'support.read', 'support.respond',
  ],
};

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchAdmin = async () => {
    try {
      const response = await fetch('/api/admin/me');
      if (response.ok) {
        const data = await response.json();
        setAdmin(data.admin);
      } else {
        setAdmin(null);
      }
    } catch {
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  const hasPermission = (permission: string): boolean => {
    if (!admin) return false;
    const rolePermissions = ROLE_PERMISSIONS[admin.role] || [];
    return rolePermissions.includes(permission) || admin.permissions?.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(hasPermission);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAdmin(data.admin);
        return { success: true };
      }

      return { success: false, error: data.error || 'Erreur de connexion' };
    } catch {
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // Ignore errors
    }
    setAdmin(null);
    router.push('/admin/login');
  };

  const refreshAdmin = async () => {
    await fetchAdmin();
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: !!admin,
        hasPermission,
        hasAnyPermission,
        login,
        logout,
        refreshAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
