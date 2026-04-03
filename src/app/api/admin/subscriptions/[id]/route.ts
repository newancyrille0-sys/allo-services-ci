import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SubscriptionPlan } from "@prisma/client";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, newPlan, newEndDate, reason } = body;

    if (action === "cancel") {
      const subscription = await db.subscription.update({
        where: { id },
        data: { status: "cancelled" },
      });

      // Also update provider's subscription status
      await db.provider.update({
        where: { id: subscription.providerId },
        data: { subscriptionStatus: SubscriptionPlan.FREE },
      });

      return NextResponse.json({ success: true, subscription });
    }

    if (action === "extend" && newEndDate) {
      const subscription = await db.subscription.update({
        where: { id },
        data: { endDate: new Date(newEndDate) },
      });

      return NextResponse.json({ success: true, subscription });
    }

    if (action === "update_plan" && newPlan) {
      const subscription = await db.subscription.update({
        where: { id },
        data: { planName: newPlan as SubscriptionPlan },
      });

      await db.provider.update({
        where: { id: subscription.providerId },
        data: { subscriptionStatus: newPlan as SubscriptionPlan },
      });

      return NextResponse.json({ success: true, subscription });
    }

    return NextResponse.json(
      { error: "Action non supportée" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'abonnement" },
      { status: 500 }
    );
  }
}
