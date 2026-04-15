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
    commissionRate: 0.20,
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
    badgeColor: "#6B7280",
    badgeIcon: "free",
  },
  BASIC: {
    tier: "BASIC",
    monthlyPrice: 10000,
    yearlyPrice: 100000,
    commissionRate: 0.15,
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
    badgeColor: "#3B82F6",
    badgeIcon: "basic",
  },
  PREMIUM: {
    tier: "PREMIUM",
    monthlyPrice: 25000,
    yearlyPrice: 250000,
    commissionRate: 0.12,
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
    badgeColor: "#F59E0B",
    badgeIcon: "premium",
  },
  ELITE: {
    tier: "ELITE",
    monthlyPrice: 50000,
    yearlyPrice: 500000,
    commissionRate: 0.10,
    maxPublications: -1,
    maxLives: -1,
    maxServices: -1,
    canViewPhone: true,
    canPriority: true,
    canAnalytics: true,
    canPromo: true,
    canInvoice: true,
    canInsurance: true,
    visibilityBoost: 3.0,
    badgeColor: "#8B5CF6",
    badgeIcon: "elite",
  },
};

// GET /api/admin/providers/[id]/tier - Get provider tier info
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: providerId } = await params;
    
    // Verify admin session
    const admin = await getAdminSession(request);
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const provider = await db.provider.findUnique({
      where: { id: providerId },
      select: {
        id: true,
        businessName: true,
        providerTier: true,
        tierExpiresAt: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!provider) {
      return NextResponse.json({ error: "Prestataire non trouvé" }, { status: 404 });
    }

    // Get tier configuration from defaults
    const tierConfig = DEFAULT_TIER_CONFIGS[provider.providerTier as ProviderTierType] || DEFAULT_TIER_CONFIGS.GRATUIT;

    return NextResponse.json({
      provider: {
        ...provider,
        tierHistory: [], // No history table for now
        tierConfig,
      },
    });
  } catch (error) {
    console.error("Error fetching provider tier:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du tier" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/providers/[id]/tier - Update provider tier
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: providerId } = await params;
    
    // Verify admin session
    const admin = await getAdminSession(request);
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { tier, expiresAt, reason } = body;

    if (!tier || !PROVIDER_TIERS.includes(tier)) {
      return NextResponse.json(
        { error: "Tier invalide. Valeurs acceptées: GRATUIT, BASIC, PREMIUM, ELITE" },
        { status: 400 }
      );
    }

    // Get current provider
    const currentProvider = await db.provider.findUnique({
      where: { id: providerId },
      select: { providerTier: true },
    });

    if (!currentProvider) {
      return NextResponse.json({ error: "Prestataire non trouvé" }, { status: 404 });
    }

    const previousTier = currentProvider.providerTier;

    // Update provider tier
    const updatedProvider = await db.provider.update({
      where: { id: providerId },
      data: {
        providerTier: tier,
        tierExpiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({
      success: true,
      provider: {
        id: updatedProvider.id,
        providerTier: updatedProvider.providerTier,
        tierExpiresAt: updatedProvider.tierExpiresAt,
      },
      message: `Tier mis à jour: ${previousTier} → ${tier}`,
    });
  } catch (error) {
    console.error("Error updating provider tier:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du tier" },
      { status: 500 }
    );
  }
}
