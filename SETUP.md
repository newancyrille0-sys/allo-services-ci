# Guide d'installation et de configuration

## Structure du projet Allo Services CI

```
allo-services-ci/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── (admin)/admin/      # Dashboard administrateur
│   │   ├── (auth)/             # Pages d'authentification
│   │   ├── (dashboard)/        # Dashboards client & prestataire
│   │   ├── (main)/             # Pages publiques
│   │   └── api/                # Routes API
│   ├── components/             # Composants React
│   │   ├── ui/                 # Composants UI (shadcn/ui)
│   │   ├── layout/             # Layout components
│   │   ├── home/               # Composants page d'accueil
│   │   └── ...
│   ├── lib/                    # Utilitaires et configuration
│   ├── hooks/                  # Hooks React personnalisés
│   ├── contexts/               # Contextes React
│   └── store/                  # État global
├── prisma/                     # Schéma de base de données
├── public/                     # Assets statiques
└── scripts/                    # Scripts utilitaires
```

## Étapes d'installation

### 1. Ouvrir le projet dans VS Code
```bash
cd allo-services-ci
code .
```

### 2. Installer les dépendances
```bash
bun install
# ou
npm install
```

### 3. Configurer les variables d'environnement
Créez un fichier `.env` à la racine avec :
```env
# Database - Supabase PostgreSQL
DATABASE_URL="votre-url-supabase"
DIRECT_URL="votre-url-supabase-direct"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-key"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="votre-url-supabase"
NEXT_PUBLIC_SUPABASE_ANON_KEY="votre-anon-key"
```

### 4. Générer le client Prisma
```bash
bunx prisma generate
```

### 5. Synchroniser la base de données
```bash
bunx prisma db push
```

### 6. Lancer le serveur de développement
```bash
bun run dev
# ou
npm run dev
```

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `bun run dev` | Serveur de développement |
| `bun run build` | Build de production |
| `bun run start` | Serveur de production |
| `bun run lint` | Vérification ESLint |
| `bunx prisma studio` | Interface base de données |

## Pages principales

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil |
| `/services` | Liste des services |
| `/providers` | Liste des prestataires |
| `/blog` | Blog |
| `/careers` | Offres d'emploi |
| `/press` | Espace presse |
| `/login` | Connexion |
| `/register` | Inscription |
| `/admin` | Dashboard admin |
| `/provider` | Dashboard prestataire |
| `/client` | Dashboard client |

## Technologies utilisées

- **Framework**: Next.js 16 (App Router)
- **Langage**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **Icons**: Lucide React
- **Animations**: Framer Motion
