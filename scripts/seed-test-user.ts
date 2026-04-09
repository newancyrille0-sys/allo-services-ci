/**
 * Script pour créer des utilisateurs de test
 * 
 * Usage:
 * npx ts-node scripts/seed-test-user.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Création des utilisateurs de test...');

  const passwordHash = await bcrypt.hash('Test1234', 12);

  // Créer un client de test
  const existingClient = await prisma.user.findUnique({
    where: { email: 'client@test.com' },
  });

  if (!existingClient) {
    const client = await prisma.user.create({
      data: {
        email: 'client@test.com',
        phone: '+2250701010101',
        passwordHash,
        fullName: 'Jean Client',
        role: 'CLIENT',
        status: 'ACTIVE',
        otpVerified: true,
        city: 'Abidjan',
      },
    });
    console.log('✅ Client créé:', client.email);
  } else {
    // Update password for existing client
    await prisma.user.update({
      where: { id: existingClient.id },
      data: { passwordHash, status: 'ACTIVE', otpVerified: true },
    });
    console.log('✅ Client mis à jour:', existingClient.email);
  }

  // Créer un prestataire de test
  const existingProvider = await prisma.user.findUnique({
    where: { email: 'provider@test.com' },
  });

  if (!existingProvider) {
    const providerUser = await prisma.user.create({
      data: {
        email: 'provider@test.com',
        phone: '+2250702020202',
        passwordHash,
        fullName: 'Kouassi Prestataire',
        role: 'PROVIDER',
        status: 'ACTIVE',
        otpVerified: true,
        city: 'Abidjan',
      },
    });

    await prisma.provider.create({
      data: {
        userId: providerUser.id,
        businessName: 'Services Pro',
        description: 'Prestataire de services professionnels',
        categories: JSON.stringify(['electricite', 'plomberie']),
        hourlyRate: 5000,
        isVerified: true,
        kycStatus: 'VERIFIED',
        subscriptionStatus: 'PREMIUM',
        isActive: true,
      },
    });
    console.log('✅ Prestataire créé:', providerUser.email);
  } else {
    // Update password for existing provider
    await prisma.user.update({
      where: { id: existingProvider.id },
      data: { passwordHash, status: 'ACTIVE', otpVerified: true },
    });
    console.log('✅ Prestataire mis à jour:', existingProvider.email);
  }

  console.log('\n📋 Comptes de test disponibles:');
  console.log('   Client: client@test.com / Test1234');
  console.log('   Prestataire: provider@test.com / Test1234');
  console.log('   Admin: admin@alloservices.ci / Admin123!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
