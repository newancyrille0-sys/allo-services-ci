import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create services
  const services = await Promise.all([
    prisma.service.upsert({
      where: { slug: 'plomberie' },
      create: { name: 'Plomberie', slug: 'plomberie', description: 'Services de plomberie' },
      update: {},
    }),
    prisma.service.upsert({
      where: { slug: 'electricite' },
      create: { name: 'Électricité', slug: 'electricite', description: 'Services électriques' },
      update: {},
    }),
    prisma.service.upsert({
      where: { slug: 'coiffure' },
      create: { name: 'Coiffure', slug: 'coiffure', description: 'Services de coiffure' },
      update: {},
    }),
    prisma.service.upsert({
      where: { slug: 'menage' },
      create: { name: 'Ménage', slug: 'menage', description: 'Services de ménage' },
      update: {},
    }),
    prisma.service.upsert({
      where: { slug: 'livraison' },
      create: { name: 'Livraison', slug: 'livraison', description: 'Services de livraison' },
      update: {},
    }),
  ]);

  console.log(`Created ${services.length} services`);

  // Create admin user
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@alloservices.ci' },
    create: {
      email: 'admin@alloservices.ci',
      passwordHash: '$2a$10$rQZ9wK5Y7XJ3nGvL2mH8iOePqRsT4uVwXyZaBcD1fGhIjKlMnOpQr', // admin123
      fullName: 'Admin Principal',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
    update: {},
  });

  console.log(`Created admin: ${admin.email}`);

  // Create test client
  const client = await prisma.user.upsert({
    where: { email: 'client@test.ci' },
    create: {
      email: 'client@test.ci',
      phone: '+2250700000001',
      passwordHash: '$2a$10$rQZ9wK5Y7XJ3nGvL2mH8iOePqRsT4uVwXyZaBcD1fGhIjKlMnOpQr',
      fullName: 'Amadou Koné',
      role: 'CLIENT',
      status: 'ACTIVE',
      city: 'Abidjan',
    },
    update: {},
  });

  console.log(`Created client: ${client.email}`);

  // Create test provider
  const providerUser = await prisma.user.upsert({
    where: { email: 'provider@test.ci' },
    create: {
      email: 'provider@test.ci',
      phone: '+2250700000002',
      passwordHash: '$2a$10$rQZ9wK5Y7XJ3nGvL2mH8iOePqRsT4uVwXyZaBcD1fGhIjKlMnOpQr',
      fullName: 'Plomberie Express',
      role: 'PROVIDER',
      status: 'ACTIVE',
      city: 'Abidjan',
    },
    update: {},
  });

  const provider = await prisma.provider.upsert({
    where: { userId: providerUser.id },
    create: {
      userId: providerUser.id,
      businessName: 'Plomberie Express',
      description: 'Expert en plomberie depuis 10 ans',
      categories: JSON.stringify(['plomberie']),
      isVerified: true,
      badgeVerified: true,
      isActive: true,
      averageRating: 4.9,
      totalReviews: 156,
      providerTier: 'PREMIUM',
    },
    update: {},
  });

  console.log(`Created provider: ${provider.businessName}`);

  // Create partners
  const partners = await Promise.all([
    prisma.partner.upsert({
      where: { id: 'partner1' },
      create: {
        id: 'partner1',
        name: 'Orange CI',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Orange_logo.svg/200px-Orange_logo.svg.png',
        websiteUrl: 'https://orange.ci',
        description: 'Opérateur téléphonique',
        showOnHome: true,
        showOnPublicite: true,
        showOnDashboard: true,
      },
      update: {},
    }),
    prisma.partner.upsert({
      where: { id: 'partner2' },
      create: {
        id: 'partner2',
        name: 'MTN CI',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/MTN_logo.svg/200px-MTN_logo.svg.png',
        websiteUrl: 'https://mtn.ci',
        description: 'Opérateur téléphonique',
        showOnHome: true,
        showOnPublicite: true,
        showOnDashboard: true,
      },
      update: {},
    }),
  ]);

  console.log(`Created ${partners.length} partners`);

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
