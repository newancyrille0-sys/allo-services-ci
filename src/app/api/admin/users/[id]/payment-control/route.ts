import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-auth";

// Payment methods available in Côte d'Ivoire
const PAYMENT_METHODS = [
  { id: "orange_money", label: "Orange Money", icon: "🟠" },
  { id: "mtn_money", label: "MTN Money", icon: "🟡" },
  { id: "wave", label: "Wave", icon: "🔵" },
  { id: "moov_money", label: "Moov Money", icon: "🟣" },
  { id: "card", label: "Carte bancaire", icon: "💳" },
  { id: "cash", label: "Espèces", icon: "💵" },
];

// GET /api/admin/users/[id]/payment-control - Get user payment controls
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    // Verify admin session
    const admin = await getAdminSession(request);
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Get user
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        status: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Get existing payment controls
    const existingControls = await db.userPaymentControl.findMany({
      where: { userId },
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

    // Get total payments made by user
    const paymentsAggregation = await db.payment.aggregate({
      where: { userId },
      _sum: { amount: true },
      _max: { createdAt: true },
    });

    return NextResponse.json({
      user,
      paymentMethods,
      stats: {
        total: PAYMENT_METHODS.length,
        enabled: PAYMENT_METHODS.length - disabledCount,
        disabled: disabledCount,
        totalPayments: paymentsAggregation._sum.amount || 0,
        lastPayment: paymentsAggregation._max.createdAt || null,
      },
    });
  } catch (error) {
    console.error("Error fetching user payment controls:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des contrôles de paiement" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/[id]/payment-control - Toggle payment method
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

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

    // Verify user exists
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { fullName: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Upsert payment control
    const paymentControl = await db.userPaymentControl.upsert({
      where: {
        userId_paymentMethod: {
          userId,
          paymentMethod,
        },
      },
      create: {
        userId,
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
        action: isEnabled ? "USER_PAYMENT_METHOD_ENABLED" : "USER_PAYMENT_METHOD_DISABLED",
        targetType: "USER",
        targetId: userId,
        details: JSON.stringify({
          paymentMethod,
          reason,
          userName: user.fullName,
          userEmail: user.email,
        }),
      },
    });

    const methodInfo = PAYMENT_METHODS.find((m) => m.id === paymentMethod);

    return NextResponse.json({
      success: true,
      paymentControl,
      message: `${methodInfo?.label} ${isEnabled ? "activé" : "désactivé"} pour ${user.fullName || user.email}`,
    });
  } catch (error) {
    console.error("Error updating user payment control:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du contrôle de paiement" },
      { status: 500 }
    );
  }
}

// POST /api/admin/users/[id]/payment-control - Bulk update payment methods
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

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

    // Verify user exists
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { fullName: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Update all payment methods
    const updates = methods.map((m) =>
      db.userPaymentControl.upsert({
        where: {
          userId_paymentMethod: {
            userId,
            paymentMethod: m.paymentMethod,
          },
        },
        create: {
          userId,
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
        action: "USER_PAYMENT_METHODS_BULK_UPDATE",
        targetType: "USER",
        targetId: userId,
        details: JSON.stringify({
          methods,
          reason,
          userName: user.fullName,
          userEmail: user.email,
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
    console.error("Error bulk updating user payment controls:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour en masse" },
      { status: 500 }
    );
  }
}
