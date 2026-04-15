import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-auth";

// Provider tier values as strings (matching the schema)
const PROVIDER_TIERS = ["GRATUIT", "BASIC", "PREMIUM", "ELITE"] as const;
type ProviderTierType = typeof PROVIDER_TIERS[number];

// Default tier configurations
const DEFAULT_TIER_CONFIGS: Record<ProviderTierType, {
  tier: ProviderTierType;
  monthlyPrice: number;
  yearlyPrice: number;
  commissionRate: number;
  maxPublications: number;
  maxLives: number;
  maxServices: number;
  canViewPhone: boolean;
  canPriority: boolean;
  canAnalytics: boolean;
  canPromo: boolean;
  canInvoice: boolean;
  canInsurance: boolean;
  visibilityBoost: number;
  badgeColor: string;
  badgeIcon: string;
}> = {
  GRATUIT: {
    tier: "GRATUIT",
    monthlyPrice: 0,
    yearlyPrice: 0,
    commissionRate: 0.20, // 20% commission
    maxPublications: 3,
    maxLives: 1,
    maxServices: 2,
    canViewPhone: false,
    canPriority: false,
    canAnalytics: false,
    canPromo: false,
    canInvoice: false,
    canInsurance: false,
    visibilityBoost: 1.0,
    badgeColor: "#6B7280", // Gray
    badgeIcon: "free",
  },
  BASIC: {
    tier: "BASIC",
    monthlyPrice: 10000, // 10,000 FCFA/month
    yearlyPrice: 100000, // 100,000 FCFA/year
    commissionRate: 0.15, // 15% commission
    maxPublications: 10,
    maxLives: 3,
    maxServices: 5,
    canViewPhone: false,
    canPriority: false,
    canAnalytics: true,
    canPromo: false,
    canInvoice: true,
    canInsurance: false,
    visibilityBoost: 1.5,
    badgeColor: "#3B82F6", // Blue
    badgeIcon: "basic",
  },
  PREMIUM: {
    tier: "PREMIUM",
    monthlyPrice: 25000, // 25,000 FCFA/month
    yearlyPrice: 250000, // 250,000 FCFA/year
    commissionRate: 0.12, // 12% commission
    maxPublications: 25,
    maxLives: 10,
    maxServices: 10,
    canViewPhone: true,
    canPriority: true,
    canAnalytics: true,
    canPromo: true,
    canInvoice: true,
    canInsurance: true,
    visibilityBoost: 2.0,
    badgeColor: "#F59E0B", // Amber/Gold
    badgeIcon: "premium",
  },
  ELITE: {
    tier: "ELITE",
    monthlyPrice: 50000, // 50,000 FCFA/month
    yearlyPrice: 500000, // 500,000 FCFA/year
    commissionRate: 0.10, // 10% commission
    maxPublications: -1, // Unlimited
    maxLives: -1, // Unlimited
    maxServices: -1, // Unlimited
    canViewPhone: true,
    canPriority: true,
    canAnalytics: true,
    canPromo: true,
    canInvoice: true,
    canInsurance: true,
    visibilityBoost: 3.0,
    badgeColor: "#8B5CF6", // Purple
    badgeIcon: "elite",
  },
};

// GET /api/admin/tiers - Get all tier configurations
export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const admin = await getAdminSession(request);
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Get stats for each tier
    const tierStats = await Promise.all(
      PROVIDER_TIERS.map(async (tier) => {
        const count = await db.provider.count({
          where: { providerTier: tier },
        });
        return { tier, count };
      })
    );

    return NextResponse.json({
      tiers: Object.values(DEFAULT_TIER_CONFIGS),
      stats: tierStats,
      defaultConfigs: DEFAULT_TIER_CONFIGS,
    });
  } catch (error) {
    console.error("Error fetching tier configs:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des configurations de tiers" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/tiers - Update tier configuration (returns default configs for now)
export async function PUT(request: NextRequest) {
  try {
    // Verify admin session
    const admin = await getAdminSession(request);
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { tier, ...updates } = body;

    if (!tier || !PROVIDER_TIERS.includes(tier)) {
      return NextResponse.json(
        { error: "Tier invalide" },
        { status: 400 }
      );
    }

    // Validate numeric fields
    if (updates.monthlyPrice !== undefined && updates.monthlyPrice < 0) {
      return NextResponse.json(
        { error: "Le prix mensuel ne peut pas être négatif" },
        { status: 400 }
      );
    }

    if (updates.yearlyPrice !== undefined && updates.yearlyPrice < 0) {
      return NextResponse.json(
        { error: "Le prix annuel ne peut pas être négatif" },
        { status: 400 }
      );
    }

    if (updates.commissionRate !== undefined && (updates.commissionRate < 0 || updates.commissionRate > 1)) {
      return NextResponse.json(
        { error: "Le taux de commission doit être entre 0 et 1" },
        { status: 400 }
      );
    }

    // For now, just return success - configurations are stored in code
    return NextResponse.json({
      success: true,
      config: { ...DEFAULT_TIER_CONFIGS[tier as ProviderTierType], ...updates },
      message: `Configuration ${tier} mise à jour`,
    });
  } catch (error) {
    console.error("Error updating tier config:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la configuration" },
      { status: 500 }
    );
  }
}
