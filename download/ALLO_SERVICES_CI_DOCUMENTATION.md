# Allo Services CI — Documentation Complète

## 🎯 Vision du Projet

**"Le bon prestataire, au bon moment, près de chez vous"**

Allo Services CI est une marketplace de mise en relation clients/prestataires de services en Côte d'Ivoire, couvrant 65 villes et 10 catégories de services.

---

## 📁 Structure du Projet

```
allo-services-ci/
├── src/
│   ├── app/
│   │   ├── (auth)/           # Pages d'authentification
│   │   ├── (dashboard)/      # Dashboards client & prestataire
│   │   ├── (admin)/          # Panel d'administration
│   │   ├── (main)/           # Pages publiques
│   │   └── api/
│   │       ├── messages/     # API messagerie avec détection anti-fuite
│   │       ├── reservations/ # API réservations avec masquage
│   │       ├── loyalty/      # Programme de fidélité
│   │       ├── insurance/    # Assurance prestation
│   │       ├── referral/     # Programme de parrainage
│   │       ├── provider/
│   │       │   ├── invoices/ # Factures automatiques
│   │       │   ├── planning/ # Gestion disponibilités
│   │       │   └── stats/    # Statistiques avancées
│   │       └── admin/
│   │           └── anti-leakage/ # Modération anti-fuite
│   ├── components/
│   │   ├── anti-leakage/     # Composants UI anti-fuite
│   │   ├── provider/         # Composants dashboard prestataire
│   │   └── ui/               # shadcn/ui
│   ├── hooks/
│   │   └── useAntiLeakage.ts # Hooks personnalisés
│   └── lib/
│       └── utils/
│           ├── contactDetection.ts  # Détection de contacts
│           ├── phoneMasking.ts      # Masquage téléphonique
│           └── invoice/
│               └── generator.ts     # Génération factures
├── prisma/
│   └── schema.prisma        # 30+ modèles
└── download/
    └── ANTI_LEAKAGE_IMPLEMENTATION.md
```

---

## 🗄️ Modèles de Base de Données

### Modèles Principaux
- **User** — Utilisateurs (clients, prestataires, admins)
- **Provider** — Profils prestataires
- **Reservation** — Réservations de services
- **Service** — Catalogue de services
- **Review** — Avis clients

### Modèles Anti-Fuite (Phase 1)
- **LoyaltyPoints** — Points de fidélité
- **LoyaltyTransaction** — Transactions de points
- **Cashback** — Cashback différé (5%)
- **InsuranceClaim** — Réclamations assurance
- **ContactDetectionLog** — Logs de détection
- **PhoneMasking** — Masquage téléphonique
- **ProviderAddressBook** — Carnet d'adresses sécurisé
- **Referral** — Programme de parrainage
- **CommissionTier** — Commission dégressive
- **UserWarning** — Avertissements utilisateurs
- **ProviderGroup** — Tontine digitale

### Modèles Outils Prestataire (Phase 2)
- **ProviderInvoice** — Factures automatiques
- **ProviderAvailability** — Disponibilités hebdomadaires
- **ProviderAvailabilityException** — Exceptions (vacances, absences)
- **ProviderStats** — Statistiques cache

---

## 🛡️ Stratégie Anti-Fuite

### Pilier 1 : Protection Technique

#### Masquage de Téléphone
```typescript
import { maskPhoneNumber } from '@/lib/utils/phoneMasking';

// Avant confirmation: +225 ** ** ** 45
const masked = maskPhoneNumber('+225 07 08 09 10 45');
```

#### Détection de Contacts
```typescript
import { detectContacts } from '@/lib/utils/contactDetection';

const result = detectContacts(messageContent);
if (result.hasContact) {
  console.log(result.detectedType); // 'phone', 'whatsapp', 'email'...
  console.log(result.severity);     // 'low', 'medium', 'high'
  console.log(result.warningMessage);
}
```

### Pilier 2 : Valeur Ajoutée

#### Assurance Prestation
- **no_show** : Jusqu'à 50 000 FCFA
- **damage** : Jusqu'à 100 000 FCFA
- **incomplete** : Jusqu'à 30 000 FCFA
- **dispute** : Jusqu'à 50 000 FCFA

```typescript
// POST /api/insurance
{
  reservationId: "xxx",
  claimType: "no_show",
  description: "Le prestataire ne s'est pas présenté...",
  amount: 25000
}
```

### Pilier 3 : Incitations Financières

#### Programme de Fidélité
| Niveau | Seuil | Multiplicateur |
|--------|-------|----------------|
| Bronze | 0 | 1x |
| Silver | 500 | 1.25x |
| Gold | 1 500 | 1.5x |
| Platinum | 5 000 | 2x |

#### Commission Dégressive
| Réservations/mois | Taux |
|-------------------|------|
| 0-10 | 15% |
| 11-30 | 12% |
| 31+ | 10% |

#### Cashback Différé
- 5% de cashback sur chaque réservation
- Disponible après 30 jours
- Forfeiture si fuite détectée

### Pilier 4 : Adaptation Culturelle

#### Parrainage
- **Parrain** : 5 000 FCFA
- **Filleul** : 5 000 FCFA
- Déblocage après première réservation ≥ 5 000 FCFA

---

## 📊 Outils Prestataire

### Factures Automatiques

```typescript
// POST /api/provider/invoices
// Génère une facture pour une réservation complétée

// GET /api/provider/invoices?providerId=xxx&summary=true
// Résumé mensuel des revenus
```

Format de facture:
- Numéro unique: `ALLO-202604-XXXXX`
- Montant total
- Commission prélevée
- Montant net à percevoir
- Export HTML pour impression

### Gestion des Disponibilités

```typescript
// POST /api/provider/planning
{
  providerId: "xxx",
  availabilities: [
    { dayOfWeek: 1, startTime: "08:00", endTime: "18:00" },
    { dayOfWeek: 2, startTime: "08:00", endTime: "18:00" },
    // ...
  ]
}
```

### Statistiques Avancées

```typescript
// GET /api/provider/stats?providerId=xxx&period=month
{
  overview: {
    totalRevenue: 450000,
    completedCount: 12,
    averageRating: 4.8
  },
  growth: {
    revenueGrowth: 15.5,
    reservationGrowth: 8.3
  },
  insights: {
    peakHours: [{ hour: 9, count: 8 }, ...],
    topServices: [...],
    repeatClientRate: 35
  }
}
```

---

## 🔧 Administration

### Dashboard Anti-Fuite

```typescript
// GET /api/admin/anti-leakage?period=7d
{
  stats: {
    totalDetections: 45,
    resolvedDetections: 38,
    highSeverityDetections: 12
  },
  byType: { phone: 25, whatsapp: 15, email: 5 },
  topSuspects: [...],
  kpi: { retentionRate: 85.2 }
}
```

### Actions de Modération

```typescript
// POST /api/admin/anti-leakage
{
  detectionId: "xxx",
  action: "warn", // dismiss, warn, suspend, forfeit_cashback
  adminId: "admin_xxx",
  notes: "Avertissement pour partage de contacts"
}
```

---

## 🎨 Composants UI

### Alertes de Détection
```tsx
import { ContactDetectionAlert } from '@/components/anti-leakage';

<ContactDetectionAlert
  detectedType="whatsapp"
  severity="high"
  warningMessage="..."
  onDismiss={() => {}}
  onProceed={() => {}}
/>
```

### Statistiques Prestataire
```tsx
import { ProviderStatsOverview } from '@/components/provider/ProviderStats';

<ProviderStatsOverview
  totalRevenue={450000}
  totalReservations={15}
  completedCount={12}
  averageRating={4.8}
  revenueGrowth={15.5}
  reservationGrowth={8.3}
/>
```

### Badge de Niveau Fidélité
```tsx
import { LoyaltyTierBadge } from '@/components/anti-leakage';

<LoyaltyTierBadge tier="gold" /> // 🥇 Gold
```

---

## 📱 Endpoints API

### Authentification
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/verify-otp`

### Réservations
- `GET /api/reservations`
- `POST /api/reservations`
- `PUT /api/reservations/:id/status`

### Messagerie
- `GET /api/messages/conversations`
- `POST /api/messages` (avec détection anti-fuite)

### Fidélité
- `GET /api/loyalty`
- `POST /api/loyalty` (earn, redeem, process_cashback)

### Assurance
- `GET /api/insurance`
- `POST /api/insurance`
- `PUT /api/insurance` (admin)

### Parrainage
- `GET /api/referral`
- `POST /api/referral` (use_code, process_reward)

### Prestataire
- `GET /api/provider/invoices`
- `POST /api/provider/invoices`
- `GET /api/provider/planning`
- `POST /api/provider/planning`
- `GET /api/provider/stats`

### Admin
- `GET /api/admin/anti-leakage`
- `POST /api/admin/anti-leakage`

---

## ⚙️ Configuration

### Variables d'Environnement

```env
# Base de données
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://alloservices.ci"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="..."

# Paiements
CINETPAY_API_KEY="..."
CINETPAY_SITE_ID="..."

# Communications
TWILIO_ACCOUNT_SID="..."
TWILIO_AUTH_TOKEN="..."
```

### Commandes

```bash
# Développement
bun run dev

# Lint
bun run lint

# Base de données
npx prisma db push
npx prisma generate

# Seed admin
node prisma/seed.js
```

---

## 📈 KPIs Suivis

| KPI | Cible | Méthode |
|-----|-------|---------|
| Taux de rétention post-prestation | >85% | Réservations répétées |
| Taux de fuite détectée | <10% | Messages suspects |
| NPS | >50 | Sondages |
| LTV | Croissance | Revenu/utilisateur/12 mois |
| Conversion Free → Payant | >15% | Prestataires abonnés |

---

## 🚀 Roadmap

### ✅ Phase 1 — Fondations (Complété)
- [x] Masquage des numéros
- [x] Détection de contacts
- [x] Programme de fidélité
- [x] Cashback différé
- [x] Assurance prestation
- [x] Parrainage

### ✅ Phase 2 — Rétention Active (Complété)
- [x] Factures automatiques
- [x] Planning et disponibilités
- [x] Statistiques avancées
- [x] Dashboard admin anti-fuite

### 🔜 Phase 3 — Écosystème Verrouillé
- [ ] Tontine digitale complète
- [ ] Intégration Mobile Money native
- [ ] Notifications push/SMS automatiques
- [ ] Live Streaming exclusif Premium

### 🔜 Phase 4 — Culture de Plateforme
- [ ] Événements communautaires
- [ ] Certification officielle
- [ ] Partenariats B2B exclusifs
- [ ] Programme Ambassadeur

---

## 📞 Contact

**Allo Services CI**
- Site: www.alloservices.ci
- Email: contact@alloservices.ci
- Côte d'Ivoire

---

*Documentation mise à jour: Avril 2026*
*Version: 2.0.0*
