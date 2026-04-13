import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-auth";

// Payment methods available in Côte d'Ivoire
const PAYMENT_METHODS = [
  { id: "orange_money", label: "Orange Money", icon: "🟠" },
  { id: "mtn_money", label: "MTN Money", icon: "🟡" },
  { id: "wave", label: "Wave", icon: "🔵" },
  { id: "moov", label: "Moov Money", icon: "🔴" },
  { id: "card", label: "Carte bancaire", icon: "💳" },
  { id: "cash", label: "Espèces", icon: "💵" },
];

// GET /api/admin/providers/[id]/payment-control - Get provider payment controls
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

    // Get provider
    const provider = await db.provider.findUnique({
      where: { id: providerId },
      select: {
        id: true,
        businessName: true,
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    if (!provider) {
      return NextResponse.json({ error: "Prestataire non trouvé" }, { status: 404 });
    }

    // Get existing payment controls
    const existingControls = await db.providerPaymentControl.findMany({
      where: { providerId },
    });

    // Build complete payment methods list with status
    const paymentMethods = PAYMENT_METHODS.map((method) => {
      const control = existingControls.find((c) => c.paymentMethod === method.id);
      return {
        ...method,
        isEnabled: control ? control.isEnabled : true, // Default to enabled
        controlId: control?.id || null,
        disabledAt: control?.disabledAt || null,
        disabledReason: control?.disabledReason || null,
        disabledById: control?.disabledById || null,
      };
    });

    // Get disabled count
    const disabledCount = paymentMethods.filter((m) => !m.isEnabled).length;

    return NextResponse.json({
      provider,
      paymentMethods,
      stats: {
        total: PAYMENT_METHODS.length,
        enabled: PAYMENT_METHODS.length - disabledCount,
        disabled: disabledCount,
      },
    });
  } catch (error) {
    console.error("Error fetching payment controls:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des contrôles de paiement" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/providers/[id]/payment-control - Toggle payment method
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
    const { paymentMethod, isEnabled, reason } = body;

    if (!paymentMethod || !PAYMENT_METHODS.find((m) => m.id === paymentMethod)) {
      return NextResponse.json(
        { error: "Méthode de paiement invalide" },
        { status: 400 }
      );
    }

    if (typeof isEnabled !== "boolean") {
      return NextResponse.json(
        { error: "Le statut isEnabled doit être un booléen" },
        { status: 400 }
      );
    }

    // Verify provider exists
    const provider = await db.provider.findUnique({
      where: { id: providerId },
      select: { businessName: true },
    });

    if (!provider) {
      return NextResponse.json({ error: "Prestataire non trouvé" }, { status: 404 });
    }

    // Upsert payment control
    const paymentControl = await db.providerPaymentControl.upsert({
      where: {
        providerId_paymentMethod: {
          providerId,
          paymentMethod,
        },
      },
      create: {
        providerId,
        paymentMethod,
        isEnabled,
        disabledAt: !isEnabled ? new Date() : null,
        disabledById: !isEnabled ? admin.id : null,
        disabledReason: !isEnabled ? reason : null,
        reactivatedAt: isEnabled ? new Date() : null,
        reactivatedById: isEnabled ? admin.id : null,
      },
      update: {
        isEnabled,
        disabledAt: !isEnabled ? new Date() : null,
        disabledById: !isEnabled ? admin.id : null,
        disabledReason: !isEnabled ? reason : null,
        reactivatedAt: isEnabled ? new Date() : null,
        reactivatedById: isEnabled ? admin.id : null,
      },
    });

    // Log admin action
    await db.adminLog.create({
      data: {
        adminId: admin.id,
        action: isEnabled ? "PAYMENT_METHOD_ENABLED" : "PAYMENT_METHOD_DISABLED",
        targetType: "PROVIDER",
        targetId: providerId,
        details: JSON.stringify({
          paymentMethod,
          reason,
          providerName: provider.businessName,
        }),
      },
    });

    const methodInfo = PAYMENT_METHODS.find((m) => m.id === paymentMethod);

    return NextResponse.json({
      success: true,
      paymentControl,
      message: `${methodInfo?.label} ${isEnabled ? "activé" : "désactivé"} pour ${provider.businessName}`,
    });
  } catch (error) {
    console.error("Error updating payment control:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du contrôle de paiement" },
      { status: 500 }
    );
  }
}

// POST /api/admin/providers/[id]/payment-control - Bulk update payment methods
export async function POST(
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
    const { methods, reason } = body; // methods: { paymentMethod: string, isEnabled: boolean }[]

    if (!Array.isArray(methods) || methods.length === 0) {
      return NextResponse.json(
        { error: "Liste de méthodes invalide" },
        { status: 400 }
      );
    }

    // Verify provider exists
    const provider = await db.provider.findUnique({
      where: { id: providerId },
      select: { businessName: true },
    });

    if (!provider) {
      return NextResponse.json({ error: "Prestataire non trouvé" }, { status: 404 });
    }

    // Update all payment methods
    const updates = methods.map((m) =>
      db.providerPaymentControl.upsert({
        where: {
          providerId_paymentMethod: {
            providerId,
            paymentMethod: m.paymentMethod,
          },
        },
        create: {
          providerId,
          paymentMethod: m.paymentMethod,
          isEnabled: m.isEnabled,
          disabledAt: !m.isEnabled ? new Date() : null,
          disabledById: !m.isEnabled ? admin.id : null,
          disabledReason: !m.isEnabled ? reason : null,
        },
        update: {
          isEnabled: m.isEnabled,
          disabledAt: !m.isEnabled ? new Date() : null,
          disabledById: !m.isEnabled ? admin.id : null,
          disabledReason: !m.isEnabled ? reason : null,
          reactivatedAt: m.isEnabled ? new Date() : null,
          reactivatedById: m.isEnabled ? admin.id : null,
        },
      })
    );

    await Promise.all(updates);

    // Log admin action
    await db.adminLog.create({
      data: {
        adminId: admin.id,
        action: "PAYMENT_METHODS_BULK_UPDATE",
        targetType: "PROVIDER",
        targetId: providerId,
        details: JSON.stringify({
          methods,
          reason,
          providerName: provider.businessName,
        }),
      },
    });

    const enabledCount = methods.filter((m) => m.isEnabled).length;
    const disabledCount = methods.filter((m) => !m.isEnabled).length;

    return NextResponse.json({
      success: true,
      message: `${enabledCount} méthode(s) activée(s), ${disabledCount} méthode(s) désactivée(s)`,
    });
  } catch (error) {
    console.error("Error bulk updating payment controls:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour en masse" },
      { status: 500 }
    );
  }
}
