/**
 * Script pour créer le premier Super Admin
 * Usage: node scripts/seed.mjs
 */

import { config } from 'dotenv';
config();

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed admin...');

  // Vérifier si un super admin existe déjà
  const existingSuperAdmin = await prisma.admin.findFirst({
    where: { role: 'SUPER_ADMIN' },
  });

  if (existingSuperAdmin) {
    console.log('❌ Un super admin existe déjà:', existingSuperAdmin.email);
    return;
  }

  // Créer le super admin par défaut
  const email = process.env.SUPER_ADMIN_EMAIL || 'admin@alloservices.ci';
  const password = process.env.SUPER_ADMIN_PASSWORD || 'AlloServices2026!';
  const fullName = process.env.SUPER_ADMIN_NAME || 'Administrateur Principal';

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.create({
    data: {
      email,
      passwordHash,
      fullName,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Super Admin créé avec succès!');
  console.log('   Email:', email);
  console.log('   Mot de passe:', password);
  console.log('   ⚠️  Changez le mot de passe après la première connexion!');

  // Créer les permissions par défaut
  const permissions = [
    // Users
    { name: 'users.read', description: 'Voir les utilisateurs', category: 'USERS' },
    { name: 'users.write', description: 'Modifier les utilisateurs', category: 'USERS' },
    { name: 'users.suspend', description: 'Suspendre les utilisateurs', category: 'USERS' },
    { name: 'users.delete', description: 'Supprimer les utilisateurs', category: 'USERS' },
    // Providers
    { name: 'providers.read', description: 'Voir les prestataires', category: 'PROVIDERS' },
    { name: 'providers.write', description: 'Modifier les prestataires', category: 'PROVIDERS' },
    { name: 'providers.verify', description: 'Vérifier les prestataires', category: 'PROVIDERS' },
    { name: 'providers.suspend', description: 'Suspendre les prestataires', category: 'PROVIDERS' },
    // KYC
    { name: 'kyc.read', description: 'Voir les documents KYC', category: 'KYC' },
    { name: 'kyc.approve', description: 'Approuver les KYC', category: 'KYC' },
    { name: 'kyc.reject', description: 'Rejeter les KYC', category: 'KYC' },
    // Reservations
    { name: 'reservations.read', description: 'Voir les réservations', category: 'RESERVATIONS' },
    { name: 'reservations.write', description: 'Modifier les réservations', category: 'RESERVATIONS' },
    { name: 'reservations.cancel', description: 'Annuler les réservations', category: 'RESERVATIONS' },
    // Payments
    { name: 'payments.read', description: 'Voir les paiements', category: 'PAYMENTS' },
    { name: 'payments.refund', description: 'Effectuer des remboursements', category: 'PAYMENTS' },
    { name: 'payments.export', description: 'Exporter les données de paiement', category: 'PAYMENTS' },
    // Finance
    { name: 'finance.read', description: 'Voir les finances', category: 'FINANCE' },
    { name: 'finance.export', description: 'Exporter les données financières', category: 'FINANCE' },
    // Content
    { name: 'content.read', description: 'Voir les contenus', category: 'CONTENT' },
    { name: 'content.moderate', description: 'Modérer les contenus', category: 'CONTENT' },
    { name: 'content.delete', description: 'Supprimer les contenus', category: 'CONTENT' },
    // Support
    { name: 'support.read', description: 'Voir les tickets support', category: 'SUPPORT' },
    { name: 'support.respond', description: 'Répondre aux tickets', category: 'SUPPORT' },
    // Admins
    { name: 'admins.read', description: 'Voir les admins', category: 'ADMINS' },
    { name: 'admins.create', description: 'Créer des admins', category: 'ADMINS' },
    { name: 'admins.update', description: 'Modifier les admins', category: 'ADMINS' },
    { name: 'admins.delete', description: 'Supprimer les admins', category: 'ADMINS' },
    // System
    { name: 'system.settings', description: 'Modifier les paramètres système', category: 'SYSTEM' },
    { name: 'system.logs', description: 'Voir les logs système', category: 'SYSTEM' },
    { name: 'system.analytics', description: 'Voir les analytics', category: 'SYSTEM' },
  ];

  for (const perm of permissions) {
    await prisma.adminPermission.create({
      data: perm,
    });
  }

  console.log('✅ Permissions créées:', permissions.length);

  // Assigner toutes les permissions au Super Admin
  const allPermissions = await prisma.adminPermission.findMany();
  for (const perm of allPermissions) {
    await prisma.adminRolePermission.create({
      data: {
        role: 'SUPER_ADMIN',
        permissionId: perm.id,
      },
    });
  }

  // Assigner les permissions pour Admin Senior
  const seniorPermissions = allPermissions.filter(p =>
    !p.name.startsWith('admins.') && !p.name.startsWith('system.settings')
  );
  for (const perm of seniorPermissions) {
    await prisma.adminRolePermission.create({
      data: {
        role: 'ADMIN_SENIOR',
        permissionId: perm.id,
      },
    });
  }

  // Assigner les permissions pour Modérateur
  const moderatorPermissions = allPermissions.filter(p =>
    ['users.read', 'providers.read', 'content.read', 'content.moderate', 'content.delete', 'support.read'].includes(p.name)
  );
  for (const perm of moderatorPermissions) {
    await prisma.adminRolePermission.create({
      data: {
        role: 'ADMIN_MODERATOR',
        permissionId: perm.id,
      },
    });
  }

  // Assigner les permissions pour Support
  const supportPermissions = allPermissions.filter(p =>
    ['users.read', 'providers.read', 'reservations.read', 'support.read', 'support.respond'].includes(p.name)
  );
  for (const perm of supportPermissions) {
    await prisma.adminRolePermission.create({
      data: {
        role: 'SUPPORT',
        permissionId: perm.id,
      },
    });
  }

  console.log('✅ Permissions assignées aux rôles');
  console.log('🎉 Seed terminé avec succès!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
