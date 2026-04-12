/**
 * Script pour créer les services/catégories
 * 
 * Usage:
 * npx tsx scripts/seed-services.ts
 */

import { PrismaClient } from '@prisma/client';

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
    { name: 'Garde d\'enfants', slug: 'garde-enfants', description: 'Baby-sitting et garde d\'enfants' },
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
  { name: 'Réparations', slug: 'reparations', description: 'Réparation d\'équipements', iconUrl: '/icons/repair.svg', children: [
    { name: 'Réparation électroménager', slug: 'reparation-electromenager', description: 'Réparation de réfrigérateurs, machines à laver, etc.' },
    { name: 'Réparation téléphone', slug: 'reparation-telephone', description: 'Réparation de smartphones et tablettes' },
    { name: 'Réparation ordinateur', slug: 'reparation-ordinateur', description: 'Dépannage informatique' },
    { name: 'Réparation véhicule', slug: 'reparation-vehicule', description: 'Mécanique auto et moto' },
    { name: 'Serrurerie', slug: 'serrurerie', description: 'Ouverture et changement de serrures' },
    { name: 'Vitrerie', slug: 'vitrerie', description: 'Pose et réparation de vitres' },
  ]},
  
  // Événements
  { name: 'Événements', slug: 'evenements', description: 'Organisation d\'événements', iconUrl: '/icons/event.svg', children: [
    { name: 'Photographe', slug: 'photographe', description: 'Photographie d\'événements' },
    { name: 'Vidéaste', slug: 'videaste', description: 'Tournage et montage vidéo' },
    { name: 'DJ & Animation', slug: 'dj-animation', description: 'Animation de soirées et événements' },
    { name: 'Traiteur', slug: 'traiteur', description: 'Service de restauration pour événements' },
    { name: 'Décorateur', slug: 'decorateur', description: 'Décoration d\'événements' },
    { name: 'Organisation mariage', slug: 'organisation-mariage', description: 'Wedding planner' },
  ]},
  
  // Cours & Formation
  { name: 'Cours & Formation', slug: 'cours-formation', description: 'Cours particuliers et formation', iconUrl: '/icons/education.svg', children: [
    { name: 'Cours particuliers', slug: 'cours-particuliers', description: 'Soutien scolaire à domicile' },
    { name: 'Cours de langue', slug: 'cours-langue', description: 'Apprentissage des langues' },
    { name: 'Cours de musique', slug: 'cours-musique', description: 'Apprentissage d\'instruments' },
    { name: 'Cours de sport', slug: 'cours-sport', description: 'Coaching sportif personnel' },
    { name: 'Formation professionnelle', slug: 'formation-professionnelle', description: 'Formations professionnelles' },
    { name: 'Permis conduire', slug: 'permis-conduire', description: 'Auto-école et préparation permis' },
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
    { name: 'Toiletteur', slug: 'toiletteur', description: 'Toilettage d\'animaux' },
    { name: 'Garde d\'animaux', slug: 'garde-animaux', description: 'Petsitting' },
    { name: 'Éducation canine', slug: 'education-canine', description: 'Dressage de chiens' },
  ]},
];

async function main() {
  console.log('🌱 Début du seed services...');

  for (let i = 0; i < services.length; i++) {
    const service = services[i];
    
    // Créer le service parent
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

    console.log(`✅ Service créé: ${service.name}`);

    // Créer les sous-services
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
        console.log(`   └── ${child.name}`);
      }
    }
  }

  const totalServices = await prisma.service.count();
  console.log(`\n🎉 Seed terminé! ${totalServices} services créés.`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
