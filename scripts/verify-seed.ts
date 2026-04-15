import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Vérification des données ===\n');
  
  const services = await prisma.service.count();
  const parentServices = await prisma.service.count({ where: { parentId: null } });
  const subServices = await prisma.service.count({ where: { parentId: { not: null } } });
  const users = await prisma.user.count();
  const admins = await prisma.admin.count();
  const providers = await prisma.provider.count();
  
  console.log('📊 Statistiques:');
  console.log(`   - Services: ${services}`);
  console.log(`   - Catégories: ${parentServices}`);
  console.log(`   - Sous-services: ${subServices}`);
  console.log(`   - Utilisateurs: ${users}`);
  console.log(`   - Admins: ${admins}`);
  console.log(`   - Prestataires: ${providers}`);
  
  console.log('\n📋 Catégories principales:');
  const categories = await prisma.service.findMany({
    where: { parentId: null },
    orderBy: { displayOrder: 'asc' },
    select: { name: true }
  });
  categories.forEach(c => console.log(`   - ${c.name}`));
  
  console.log('\n👤 Comptes utilisateurs:');
  const userList = await prisma.user.findMany({ select: { email: true, role: true } });
  userList.forEach(u => console.log(`   - ${u.email} (${u.role})`));
  
  console.log('\n🔐 Comptes admin:');
  const adminList = await prisma.admin.findMany({ select: { email: true, role: true } });
  adminList.forEach(a => console.log(`   - ${a.email} (${a.role})`));
  
  console.log('\n✅ Base de données initialisée avec succès!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
