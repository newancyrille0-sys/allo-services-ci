# Allo Services CI

> **Le bon prestataire, au bon moment, près de chez vous**

Marketplace de mise en relation clients/prestataires de services en Côte d'Ivoire.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)

## 🚀 Fonctionnalités

### Pour les Clients
- 🔍 Recherche de prestataires par service, localisation, note
- 📅 Réservation et gestion des rendez-vous
- 💬 Messagerie intégrée
- ⭐ Système d'avis et notations
- ❤️ Favoris et carnet d'adresses
- 🎁 Programme de fidélité et cashback

### Pour les Prestataires
- 👤 Profil professionnel personnalisable
- 📊 Tableau de bord avec statistiques
- 📅 Gestion des disponibilités et planning
- 📸 Publications photos/vidéos
- 🎥 Lives en direct
- 💰 Facturation automatique
- 🏆 Abonnements (Starter, Standard, Premium)

### Pour les Administrateurs
- 👥 Gestion des utilisateurs et prestataires
- ✅ Vérification KYC
- 💳 Suivi des paiements
- 🛡️ Détection de fraude
- 📊 Analytics et rapports
- 🎯 Modération de contenu

## 🛠️ Stack Technique

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de données**: SQLite (dev) / Supabase PostgreSQL (prod)
- **Authentification**: NextAuth.js avec Google OAuth
- **Paiements**: Mobile Money (Orange, MTN, Wave, Moov)

## 📁 Structure du Projet

```
├── prisma/
│   ├── schema.prisma          # Schéma de la base de données
│   └── supabase-migration.sql # Migration SQL pour Supabase
├── scripts/
│   ├── seed-admin.ts          # Création admin initial
│   └── seed-services.ts       # Création des services
├── src/
│   ├── app/                   # Pages Next.js App Router
│   ├── components/            # Composants React
│   ├── lib/                   # Utilitaires et configuration
│   └── hooks/                 # Hooks React personnalisés
└── public/                    # Fichiers statiques
```

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- npm, yarn ou bun

### Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/allo-services-ci.git
cd allo-services-ci

# Installer les dépendances
bun install

# Copier les variables d'environnement
cp .env.example .env

# Générer le client Prisma
npx prisma generate

# Créer la base de données locale
npx prisma db push

# Créer l'admin initial
npx tsx scripts/seed-admin.ts

# Créer les services
npx tsx scripts/seed-services.ts

# Démarrer le serveur de développement
bun run dev
```

### Accès

- **Application**: http://localhost:3000
- **Admin**: http://localhost:3000/admin

### Identifiants Admin par défaut

- **Email**: `admin@alloservices.ci`
- **Mot de passe**: `Admin123!`

⚠️ Changez ce mot de passe après la première connexion !

## 🔧 Variables d'Environnement

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL de connexion à la base de données |
| `NEXTAUTH_SECRET` | Clé secrète pour NextAuth |
| `NEXTAUTH_URL` | URL de l'application |
| `GOOGLE_CLIENT_ID` | ID client Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Secret client Google OAuth |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé de service Supabase |

## 🗄️ Déploiement sur Supabase

1. Créez un projet sur [Supabase](https://supabase.com)
2. Exécutez le script SQL dans SQL Editor:
   - Ouvrez `prisma/supabase-migration.sql`
   - Copiez et exécutez dans Supabase SQL Editor
3. Configurez les variables d'environnement en production

## 📊 Services Disponibles

10 catégories avec 67 services:

- 🏗️ Bâtiment & Travaux (maçonnerie, plomberie, électricité...)
- 🏠 Services à domicile (ménage, jardinage, garde d'enfants...)
- 💄 Beauté & Bien-être (coiffure, esthétique, massage...)
- 🔧 Réparations (électroménager, téléphone, véhicule...)
- 🎉 Événements (photographe, traiteur, DJ...)
- 📚 Cours & Formation (soutien scolaire, musique, sport...)
- 🏥 Santé (infirmier, kiné, consultation...)
- 🚚 Transport & Logistique (déménagement, livraison...)
- 💼 Business & Services Pro (comptabilité, juridique...)
- 🐾 Animaux (vétérinaire, toilettage, garde...)

## 🔐 Sécurité

- Authentification avec NextAuth.js
- Hachage des mots de passe avec bcrypt
- Protection CSRF
- Validation des données côté serveur
- Détection de fraude et anti-leakage

## 📱 Mobile Money

Paiements via:
- 🟠 Orange Money
- 🟡 MTN Mobile Money
- 🔵 Wave
- 🟣 Moov Money

## 📄 Licence

MIT License - voir [LICENSE](LICENSE)

---

Développé avec ❤️ pour la Côte d'Ivoire 🇨🇮
