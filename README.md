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
- 🛡️ Assurance intégrée sur les prestations

### Pour les Prestataires
- 👤 Profil professionnel personnalisable
- 📊 Tableau de bord avec statistiques
- 📅 Gestion des disponibilités et planning
- 📸 Publications photos/vidéos
- 🎥 Lives en direct
- 💰 Facturation automatique
- 🏆 Système de tiers (Gratuit, Basic, Premium, Elite)
- 💳 Gestion des moyens de paiement

### Pour les Administrateurs
- 👥 Gestion des utilisateurs et prestataires
- ✅ Vérification KYC
- 💳 Suivi des paiements
- 🛡️ Détection de fraude et anti-leakage
- 📊 Analytics et rapports
- 🎯 Modération de contenu
- 🏷️ Attribution des tiers prestataires
- 🔒 Activation/désactivation des moyens de paiement

### 🛡️ Stratégie Anti-Leakage

Système complet pour éviter les transactions hors plateforme :

| Fonctionnalité | Description |
|----------------|-------------|
| 🔢 Masquage téléphonique | Numéros masqués via VoIP |
| 🔍 Détection de contacts | Analyse des messages (WhatsApp, email, téléphone) |
| 🎁 Fidélité & Cashback | Récompenses pour les clients fidèles |
| 🏥 Assurance | Protection sur les prestations |
| 🤝 Programme de parrainage | Bonus pour chaque nouvelle inscription |

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
│   │   ├── api/               # Routes API
│   │   ├── admin/             # Panel administrateur
│   │   └── services/          # Pages services
│   ├── components/            # Composants React
│   │   ├── home/              # Composants page d'accueil
│   │   ├── layout/            # Header, Footer
│   │   ├── ui/                # Composants UI (shadcn)
│   │   └── anti-leakage/      # Composants anti-leakage
│   ├── lib/                   # Utilitaires et configuration
│   │   ├── constants/         # Services, villes, constantes
│   │   └── utils/             # Utilitaires (détection, masquage)
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
- **Mot de passe**: `AlloServices2026!`

⚠️ Changez ce mot de passe après la première connexion !

## 🔧 Variables d'Environnement

| Variable | Description | Requis |
|----------|-------------|--------|
| `DATABASE_URL` | URL de connexion à la base de données | ✅ |
| `NEXTAUTH_SECRET` | Clé secrète pour NextAuth | ✅ |
| `NEXTAUTH_URL` | URL de l'application | ✅ |
| `GOOGLE_CLIENT_ID` | ID client Google OAuth | Optionnel |
| `GOOGLE_CLIENT_SECRET` | Secret client Google OAuth | Optionnel |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | Prod |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé de service Supabase | Prod |
| `ORANGE_MONEY_API_KEY` | Clé API Orange Money | Prod |
| `WAVE_API_KEY` | Clé API Wave | Prod |
| `MTN_MONEY_API_KEY` | Clé API MTN | Prod |

## 🗄️ Déploiement sur Supabase

1. Créez un projet sur [Supabase](https://supabase.com)
2. Exécutez le script SQL dans SQL Editor:
   - Ouvrez `prisma/supabase-migration.sql`
   - Copiez et exécutez dans Supabase SQL Editor
3. Configurez les variables d'environnement en production

## 📊 Services Disponibles

10 catégories avec 67+ services:

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

## 🏷️ Tiers Prestataires

| Tiers | Visibilité | Commission | Fonctionnalités |
|-------|------------|------------|-----------------|
| **Gratuit** | Basique | 15% | Profil simple, 5 services |
| **Basic** | Standard | 12% | Profil complet, 10 services, stats |
| **Premium** | Prioritaire | 8% | Tout + badge, promotion, support prioritaire |
| **Elite** | Maximum | 5% | Tout + mise en avant, accès VIP, manager dédié |

## 🔐 Sécurité

- Authentification avec NextAuth.js
- Hachage des mots de passe avec bcrypt
- Protection CSRF
- Validation des données côté serveur
- Détection de fraude et anti-leakage
- Masquage des numéros de téléphone

## 📱 Mobile Money

Paiements via:
- 🟠 Orange Money
- 🟡 MTN Mobile Money
- 🔵 Wave
- 🟣 Moov Money

## 🎯 KPIs Objectifs

| Indicateur | Objectif |
|------------|----------|
| Taux de complétion sur plateforme | > 90% |
| Détection de tentatives de court-circuit | > 95% |
| Taux de rétention clients | > 70% |
| Satisfaction client | > 4.5/5 |

## 📄 Licence

MIT License - voir [LICENSE](LICENSE)

---

Développé avec ❤️ pour la Côte d'Ivoire 🇨🇮
