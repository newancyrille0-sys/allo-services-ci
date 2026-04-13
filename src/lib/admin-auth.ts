import { db as prisma } from '@/lib/db';
import { AdminRole, AdminStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

// Types pour les permissions
export type Permission =
  // Users
  | 'users.read'
  | 'users.write'
  | 'users.suspend'
  | 'users.delete'
  // Providers
  | 'providers.read'
  | 'providers.write'
  | 'providers.verify'
  | 'providers.suspend'
  // KYC
  | 'kyc.read'
  | 'kyc.approve'
  | 'kyc.reject'
  // Reservations
  | 'reservations.read'
  | 'reservations.write'
  | 'reservations.cancel'
  // Payments
  | 'payments.read'
  | 'payments.refund'
  | 'payments.export'
  // Finance
  | 'finance.read'
  | 'finance.export'
  // Content
  | 'content.read'
  | 'content.moderate'
  | 'content.delete'
  // Support
  | 'support.read'
  | 'support.respond'
  // Admins
  | 'admins.read'
  | 'admins.create'
  | 'admins.update'
  | 'admins.delete'
  // System
  | 'system.settings'
  | 'system.logs'
  | 'system.analytics';

// Permissions par défaut pour chaque rôle
export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  SUPER_ADMIN: [
    // Accès total
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
    // Gestion complète utilisateurs & prestataires
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
    // Modération contenus seulement
    'users.read',
    'providers.read',
    'content.read', 'content.moderate', 'content.delete',
    'support.read',
  ],
  SUPPORT: [
    // Support client uniquement
    'users.read',
    'providers.read',
    'reservations.read',
    'support.read', 'support.respond',
  ],
};

// Noms d'affichage des rôles
export const ROLE_LABELS: Record<AdminRole, { label: string; description: string; color: string }> = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    description: 'Accès total à toutes les fonctionnalités',
    color: 'bg-red-500',
  },
  ADMIN_SENIOR: {
    label: 'Admin Senior',
    description: 'Gestion complète utilisateurs & prestataires',
    color: 'bg-orange-500',
  },
  ADMIN_MODERATOR: {
    label: 'Modérateur',
    description: 'Modération contenus (posts, avis, messages)',
    color: 'bg-yellow-500',
  },
  SUPPORT: {
    label: 'Support Client',
    description: 'Réponse aux tickets support',
    color: 'bg-blue-500',
  },
};

// Vérifier si un admin a une permission
export function hasPermission(role: AdminRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

// Vérifier si un admin a plusieurs permissions
export function hasPermissions(role: AdminRole, permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(role, p));
}

// Vérifier si un admin a au moins une des permissions
export function hasAnyPermission(role: AdminRole, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(role, p));
}

// Générer un token de session
export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

// Créer une session admin
export async function createAdminSession(adminId: string, ipAddress?: string, userAgent?: string) {
  const sessionToken = generateSessionToken();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

  const session = await prisma.adminSession.create({
    data: {
      sessionToken,
      adminId,
      expires,
      ipAddress,
      userAgent,
    },
  });

  return session;
}

// Récupérer l'admin connecté
export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('admin_session')?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await prisma.adminSession.findUnique({
    where: { sessionToken },
    include: { admin: true },
  });

  if (!session || session.expires < new Date()) {
    // Session expirée, la supprimer
    if (session) {
      await prisma.adminSession.delete({ where: { id: session.id } });
    }
    return null;
  }

  // Vérifier que l'admin est actif
  if (session.admin.status !== AdminStatus.ACTIVE) {
    return null;
  }

  return session.admin;
}

// Get admin session from request (for API routes)
export async function getAdminSession(_request?: Request) {
  return getCurrentAdmin();
}

// Authentifier un admin
export async function authenticateAdmin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    return { success: false, error: 'Email ou mot de passe incorrect' };
  }

  if (admin.status !== AdminStatus.ACTIVE) {
    return { success: false, error: 'Ce compte est désactivé' };
  }

  const isValid = await bcrypt.compare(password, admin.passwordHash);

  if (!isValid) {
    return { success: false, error: 'Email ou mot de passe incorrect' };
  }

  // Mettre à jour la date de dernière connexion
  await prisma.admin.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });

  return { success: true, admin };
}

// Créer un nouvel admin
export async function createAdmin(data: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: AdminRole;
  createdById?: string;
}) {
  // Vérifier si l'email existe déjà
  const existing = await prisma.admin.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    return { success: false, error: 'Un admin avec cet email existe déjà' };
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const admin = await prisma.admin.create({
    data: {
      email: data.email,
      passwordHash,
      fullName: data.fullName,
      phone: data.phone,
      role: data.role,
      createdById: data.createdById,
    },
  });

  return { success: true, admin };
}

// Logger une action admin
export async function logAdminAction(data: {
  adminId: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  await prisma.adminLog.create({
    data: {
      adminId: data.adminId,
      action: data.action,
      targetType: data.targetType,
      targetId: data.targetId,
      details: data.details ? JSON.stringify(data.details) : null,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    },
  });
}

// Déconnexion admin
export async function logoutAdmin() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('admin_session')?.value;

  if (sessionToken) {
    await prisma.adminSession.deleteMany({
      where: { sessionToken },
    });
  }

  // Supprimer le cookie
  cookieStore.delete('admin_session');
}
