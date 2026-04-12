import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ProviderTier } from "@prisma/client";
import { getAdminSession } from "@/lib/admin-auth";

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
        tierSetAt: true,
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

    // Get tier history
    const tierHistory = await db.providerTierHistory.findMany({
      where: { providerId },
      orderBy: { changedAt: "desc" },
      take: 10,
    });

    // Get tier configuration
    const tierConfig = await db.providerTierConfig.findUnique({
      where: { tier: provider.providerTier },
    });

    return NextResponse.json({
      provider: {
        ...provider,
        tierHistory,
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

    if (!tier || !Object.values(ProviderTier).includes(tier)) {
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

    // Update provider tier and create history entry
    const [updatedProvider] = await db.$transaction([
      // Update provider
      db.provider.update({
        where: { id: providerId },
        data: {
          providerTier: tier as ProviderTier,
          tierExpiresAt: expiresAt ? new Date(expiresAt) : null,
          tierSetById: admin.id,
          tierSetAt: new Date(),
        },
      }),
      // Create history entry
      db.providerTierHistory.create({
        data: {
          providerId,
          previousTier,
          newTier: tier as ProviderTier,
          reason: reason || "admin_change",
          changedById: admin.id,
        },
      }),
      // Log admin action
      db.adminLog.create({
        data: {
          adminId: admin.id,
          action: "PROVIDER_TIER_CHANGED",
          targetType: "PROVIDER",
          targetId: providerId,
          details: JSON.stringify({
            previousTier,
            newTier: tier,
            expiresAt,
            reason,
          }),
        },
      }),
    ]);

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
