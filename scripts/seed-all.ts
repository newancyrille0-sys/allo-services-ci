/**
 * Script de seed complet pour Allo Services CI
 * Initialise tous les données de base pour la marketplace
 * 
 * Usage:
 * npx tsx scripts/seed-all.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Services populaires en Côte d'Ivoire
const services = [
  // Bâtiment & Travaux
  { name: 'Bâtiment & Travaux', slug: 'batiment-travaux', description: 'Construction, rénovation, maçonnerie', iconUrl: '/icons/building.svg', children: [
    { name: 'Maçonnerie', slug: 'maconnerie', description: 'Construction de murs, fondations, dalles' },
    { name: 'Plomberie', slug: 'plomberie', description: 'Installation et réparation de plomberie' },
    { name: 'Électricité', slug: 'electricite', description: 'Installation et dépannage électrique' },
    { name: 'Peinture', slug: 'peinture', description: 'Peinture intérieure et extérieure' },
    { name: 'Menuiserie', slug: 'menuiserie', description: 'Travaux de menuiserie bois et aluminium' },
    { name: 'Carrelage', slug: 'carrelage', description: 'Pose de carreaux et faïence' },
    { name: 'Climatisation', slug: 'climatisation', description: 'Installation et maintenance de climatisation' },
  ]},
  
  // Services à domicile
  { name: 'Services à domicile', slug: 'services-domicile', description: 'Entretien, ménage, jardinage', iconUrl: '/icons/home.svg', children: [
    { name: 'Ménage', slug: 'menage', description: 'Nettoyage de maison et bureaux' },
    { name: 'Jardinage', slug: 'jardinage', description: 'Entretien de jardins et espaces verts' },
    { name: 'Lavage auto', slug: 'lavage-auto', description: 'Lavage de véhicules à domicile' },
    { name: 'Repassage', slug: 'repassage', description: 'Service de repassage' },
    { name: "Garde d'enfants", slug: 'garde-enfants', description: 'Baby-sitting et garde d\'enfants' },
    { name: 'Aide aux personnes âgées', slug: 'aide-personnes-agees', description: 'Assistance aux personnes âgées' },
  ]},
  
  // Beauté & Bien-être
  { name: 'Beauté & Bien-être', slug: 'beaute-bien-etre', description: 'Coiffure, esthétique, massage', iconUrl: '/icons/beauty.svg', children: [
    { name: 'Coiffure', slug: 'coiffure', description: 'Coiffure homme et femme à domicile' },
    { name: 'Esthétique', slug: 'esthetique', description: 'Soins esthétiques et beauté' },
    { name: 'Manucure & Pédicure', slug: 'manucure-pedicure', description: 'Soins des ongles' },
    { name: 'Massage', slug: 'massage', description: 'Massage bien-être et thérapeutique' },
    { name: 'Maquillage', slug: 'maquillage', description: 'Maquillage professionnel pour événements' },
    { name: 'Barbier', slug: 'barbier', description: 'Coiffure et rasage homme' },
  ]},
  
  // Réparations
  { name: 'Réparations', slug: 'reparations', description: "Réparation d'équipements", iconUrl: '/icons/repair.svg', children: [
    { name: 'Réparation électroménager', slug: 'reparation-electromenager', description: 'Réparation de réfrigérateurs, machines à laver, etc.' },
    { name: 'Réparation téléphone', slug: 'reparation-telephone', description: 'Réparation de smartphones et tablettes' },
    { name: 'Réparation ordinateur', slug: 'reparation-ordinateur', description: 'Dépannage informatique' },
    { name: 'Réparation véhicule', slug: 'reparation-vehicule', description: 'Mécanique auto et moto' },
    { name: 'Serrurerie', slug: 'serrurerie', description: 'Ouverture et changement de serrures' },
    { name: 'Vitrerie', slug: 'vitrerie', description: 'Pose et réparation de vitres' },
  ]},
  
  // Événements
  { name: 'Événements', slug: 'evenements', description: "Organisation d'événements", iconUrl: '/icons/event.svg', children: [
    { name: 'Photographe', slug: 'photographe', description: "Photographie d'événements" },
    { name: 'Vidéaste', slug: 'videaste', description: 'Tournage et montage vidéo' },
    { name: 'DJ & Animation', slug: 'dj-animation', description: "Animation de soirées et événements" },
    { name: 'Traiteur', slug: 'traiteur', description: 'Service de restauration pour événements' },
    { name: 'Décorateur', slug: 'decorateur', description: "Décoration d'événements" },
    { name: 'Organisation mariage', slug: 'organisation-mariage', description: 'Wedding planner' },
  ]},
  
  // Cours & Formation
  { name: 'Cours & Formation', slug: 'cours-formation', description: 'Cours particuliers et formation', iconUrl: '/icons/education.svg', children: [
    { name: 'Cours particuliers', slug: 'cours-particuliers', description: 'Soutien scolaire à domicile' },
    { name: 'Cours de langue', slug: 'cours-langue', description: 'Apprentissage des langues' },
    { name: 'Cours de musique', slug: 'cours-musique', description: "Apprentissage d'instruments" },
    { name: 'Cours de sport', slug: 'cours-sport', description: 'Coaching sportif personnel' },
    { name: 'Formation professionnelle', slug: 'formation-professionnelle', description: 'Formations professionnelles' },
    { name: 'Permis conduire', slug: 'permis-conduire', description: "Auto-école et préparation permis" },
  ]},
  
  // Santé
  { name: 'Santé', slug: 'sante', description: 'Services de santé à domicile', iconUrl: '/icons/health.svg', children: [
    { name: 'Infirmier à domicile', slug: 'infirmier-domicile', description: 'Soins infirmiers à domicile' },
    { name: 'Kinésithérapeute', slug: 'kinesitherapeute', description: 'Rééducation et massage thérapeutique' },
    { name: 'Consultation médecin', slug: 'consultation-medecin', description: 'Consultation médicale à domicile' },
    { name: 'Laboratoire', slug: 'laboratoire', description: 'Prise de sang et analyses' },
    { name: 'Ambulance', slug: 'ambulance', description: 'Transport sanitaire' },
  ]},
  
  // Transport & Logistique
  { name: 'Transport & Logistique', slug: 'transport-logistique', description: 'Déménagement, livraison', iconUrl: '/icons/transport.svg', children: [
    { name: 'Déménagement', slug: 'demenagement', description: 'Service de déménagement' },
    { name: 'Livraison', slug: 'livraison', description: 'Livraison de colis et courses' },
    { name: 'Transport de personnes', slug: 'transport-personnes', description: 'VTC et taxi' },
    { name: 'Location véhicule', slug: 'location-vehicule', description: 'Location de voitures et motos' },
    { name: 'Courrier express', slug: 'courrier-express', description: 'Livraison de documents' },
  ]},
  
  // Business & Services Pro
  { name: 'Business & Services Pro', slug: 'business-services-pro', description: 'Services pour entreprises', iconUrl: '/icons/business.svg', children: [
    { name: 'Comptabilité', slug: 'comptabilite', description: 'Expertise comptable' },
    { name: 'Juridique', slug: 'juridique', description: 'Conseil juridique' },
    { name: 'Traduction', slug: 'traduction', description: 'Traduction et interprétariat' },
    { name: 'Rédaction', slug: 'redaction', description: 'Rédaction de contenus' },
    { name: 'Design graphique', slug: 'design-graphique', description: 'Création graphique' },
    { name: 'Développement web', slug: 'developpement-web', description: 'Création de sites web' },
  ]},
  
  // Animaux
  { name: 'Animaux', slug: 'animaux', description: 'Services pour animaux', iconUrl: '/icons/pets.svg', children: [
    { name: 'Vétérinaire à domicile', slug: 'veterinaire-domicile', description: 'Soins vétérinaires à domicile' },
    { name: 'Toiletteur', slug: 'toiletteur', description: "Toilettage d'animaux" },
    { name: "Garde d'animaux", slug: 'garde-animaux', description: 'Petsitting' },
    { name: 'Éducation canine', slug: 'education-canine', description: 'Dressage de chiens' },
  ]},
];

async function main() {
  console.log('🌱 Début du seed complet...\n');

  // ============================================
  // 1. SERVICES ET CATÉGORIES
  // ============================================
  console.log('📦 Création des services...');
  
  for (let i = 0; i < services.length; i++) {
    const service = services[i];
    
    const parent = await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        name: service.name,
        description: service.description,
        iconUrl: service.iconUrl,
        displayOrder: i,
        isActive: true,
      },
      create: {
        name: service.name,
        slug: service.slug,
        description: service.description,
        iconUrl: service.iconUrl,
        displayOrder: i,
        isActive: true,
      },
    });

    console.log(`✅ ${service.name}`);

    if (service.children) {
      for (let j = 0; j < service.children.length; j++) {
        const child = service.children[j];
        await prisma.service.upsert({
          where: { slug: child.slug },
          update: {
            name: child.name,
            description: child.description,
            parentId: parent.id,
            displayOrder: j,
            isActive: true,
          },
          create: {
            name: child.name,
            slug: child.slug,
            description: child.description,
            parentId: parent.id,
            displayOrder: j,
            isActive: true,
          },
        });
      }
    }
  }

  // ============================================
  // 2. SUPER ADMIN
  // ============================================
  console.log('\n👤 Création du super admin...');
  
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@alloservices.ci';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
  const adminName = process.env.ADMIN_NAME || 'Super Admin';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.admin.findFirst({
    where: { role: 'SUPER_ADMIN' },
  });

  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        email: adminEmail,
        passwordHash,
        fullName: adminName,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
      },
    });
    console.log(`✅ Super Admin créé: ${adminEmail}`);
  } else {
    console.log(`ℹ️  Super Admin existe déjà: ${existingAdmin.email}`);
  }

  // ============================================
  // 3. PERMISSIONS ADMIN
  // ============================================
  console.log('\n🔐 Création des permissions...');
  
  const permissions = [
    { name: 'users.read', description: 'Voir les utilisateurs', category: 'USERS' },
    { name: 'users.write', description: 'Modifier les utilisateurs', category: 'USERS' },
    { name: 'users.suspend', description: 'Suspendre les utilisateurs', category: 'USERS' },
    { name: 'users.delete', description: 'Supprimer les utilisateurs', category: 'USERS' },
    { name: 'providers.read', description: 'Voir les prestataires', category: 'PROVIDERS' },
    { name: 'providers.write', description: 'Modifier les prestataires', category: 'PROVIDERS' },
    { name: 'providers.verify', description: 'Vérifier les prestataires', category: 'PROVIDERS' },
    { name: 'providers.suspend', description: 'Suspendre les prestataires', category: 'PROVIDERS' },
    { name: 'kyc.read', description: 'Voir les documents KYC', category: 'KYC' },
    { name: 'kyc.approve', description: 'Approuver les KYC', category: 'KYC' },
    { name: 'kyc.reject', description: 'Rejeter les KYC', category: 'KYC' },
    { name: 'reservations.read', description: 'Voir les réservations', category: 'RESERVATIONS' },
    { name: 'reservations.write', description: 'Modifier les réservations', category: 'RESERVATIONS' },
    { name: 'reservations.cancel', description: 'Annuler les réservations', category: 'RESERVATIONS' },
    { name: 'payments.read', description: 'Voir les paiements', category: 'PAYMENTS' },
    { name: 'payments.refund', description: 'Effectuer des remboursements', category: 'PAYMENTS' },
    { name: 'payments.export', description: 'Exporter les données de paiement', category: 'PAYMENTS' },
    { name: 'finance.read', description: 'Voir les finances', category: 'FINANCE' },
    { name: 'finance.export', description: 'Exporter les données financières', category: 'FINANCE' },
    { name: 'content.read', description: 'Voir les contenus', category: 'CONTENT' },
    { name: 'content.moderate', description: 'Modérer les contenus', category: 'CONTENT' },
    { name: 'content.delete', description: 'Supprimer les contenus', category: 'CONTENT' },
    { name: 'support.read', description: 'Voir les tickets support', category: 'SUPPORT' },
    { name: 'support.respond', description: 'Répondre aux tickets', category: 'SUPPORT' },
    { name: 'admins.read', description: 'Voir les admins', category: 'ADMINS' },
    { name: 'admins.create', description: 'Créer des admins', category: 'ADMINS' },
    { name: 'admins.update', description: 'Modifier les admins', category: 'ADMINS' },
    { name: 'admins.delete', description: 'Supprimer les admins', category: 'ADMINS' },
    { name: 'system.settings', description: 'Modifier les paramètres système', category: 'SYSTEM' },
    { name: 'system.logs', description: 'Voir les logs système', category: 'SYSTEM' },
    { name: 'system.analytics', description: 'Voir les analytics', category: 'SYSTEM' },
  ];

  for (const perm of permissions) {
    await prisma.adminPermission.upsert({
      where: { name: perm.name },
      update: perm,
      create: perm,
    });
  }
  console.log(`✅ ${permissions.length} permissions créées`);

  // Assigner les permissions aux rôles
  const allPermissions = await prisma.adminPermission.findMany();
  
  // SUPER_ADMIN - toutes les permissions
  for (const perm of allPermissions) {
    await prisma.adminRolePermission.upsert({
      where: { role_permissionId: { role: 'SUPER_ADMIN', permissionId: perm.id } },
      update: {},
      create: { role: 'SUPER_ADMIN', permissionId: perm.id },
    });
  }

  // ADMIN_SENIOR - tout sauf admins.* et system.settings
  const seniorPerms = allPermissions.filter(p => !p.name.startsWith('admins.') && p.name !== 'system.settings');
  for (const perm of seniorPerms) {
    await prisma.adminRolePermission.upsert({
      where: { role_permissionId: { role: 'ADMIN_SENIOR', permissionId: perm.id } },
      update: {},
      create: { role: 'ADMIN_SENIOR', permissionId: perm.id },
    });
  }

  // ADMIN_MODERATOR - modération seulement
  const modPerms = allPermissions.filter(p => 
    ['users.read', 'providers.read', 'content.read', 'content.moderate', 'content.delete', 'support.read'].includes(p.name)
  );
  for (const perm of modPerms) {
    await prisma.adminRolePermission.upsert({
      where: { role_permissionId: { role: 'ADMIN_MODERATOR', permissionId: perm.id } },
      update: {},
      create: { role: 'ADMIN_MODERATOR', permissionId: perm.id },
    });
  }

  // SUPPORT - support seulement
  const supportPerms = allPermissions.filter(p => 
    ['users.read', 'providers.read', 'reservations.read', 'support.read', 'support.respond'].includes(p.name)
  );
  for (const perm of supportPerms) {
    await prisma.adminRolePermission.upsert({
      where: { role_permissionId: { role: 'SUPPORT', permissionId: perm.id } },
      update: {},
      create: { role: 'SUPPORT', permissionId: perm.id },
    });
  }

  console.log('✅ Permissions assignées aux rôles');

  // ============================================
  // 4. UTILISATEURS DE TEST
  // ============================================
  console.log('\n👥 Création des utilisateurs de test...');
  
  const testPasswordHash = await bcrypt.hash('Test1234', 12);

  // Client de test
  const existingClient = await prisma.user.findUnique({
    where: { email: 'client@test.com' },
  });

  if (!existingClient) {
    await prisma.user.create({
      data: {
        email: 'client@test.com',
        phone: '+2250701010101',
        passwordHash: testPasswordHash,
        fullName: 'Jean Client',
        role: 'CLIENT',
        status: 'ACTIVE',
        otpVerified: true,
        city: 'Abidjan',
      },
    });
    console.log('✅ Client test créé: client@test.com');
  } else {
    console.log('ℹ️  Client test existe déjà');
  }

  // Prestataire de test
  const existingProvider = await prisma.user.findUnique({
    where: { email: 'provider@test.com' },
  });

  if (!existingProvider) {
    const providerUser = await prisma.user.create({
      data: {
        email: 'provider@test.com',
        phone: '+2250702020202',
        passwordHash: testPasswordHash,
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
        providerTier: 'PREMIUM',
        isActive: true,
      },
    });
    console.log('✅ Prestataire test créé: provider@test.com');
  } else {
    console.log('ℹ️  Prestataire test existe déjà');
  }

  // ============================================
  // RÉSUMÉ
  // ============================================
  console.log('\n' + '='.repeat(50));
  console.log('🎉 SEED TERMINÉ AVEC SUCCÈS!');
  console.log('='.repeat(50));
  
  const totalServices = await prisma.service.count();
  const totalUsers = await prisma.user.count();
  const totalAdmins = await prisma.admin.count();
  const totalProviders = await prisma.provider.count();

  console.log(`\n📊 Statistiques:`);
  console.log(`   - Services: ${totalServices}`);
  console.log(`   - Utilisateurs: ${totalUsers}`);
  console.log(`   - Prestataires: ${totalProviders}`);
  console.log(`   - Admins: ${totalAdmins}`);

  console.log(`\n📋 Comptes de test:`);
  console.log(`   Client: client@test.com / Test1234`);
  console.log(`   Prestataire: provider@test.com / Test1234`);
  console.log(`   Admin: ${adminEmail} / ${adminPassword}`);
  console.log('\n⚠️  Changez les mots de passe après la première connexion!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
