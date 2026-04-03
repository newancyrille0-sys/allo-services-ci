import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/provider/subscription/upgrade - Upgrade subscription
export async function POST(request: NextRequest) {
  try {
    const providerId = "provider-1"; // Mock provider ID

    const body = await request.json();
    const { plan, paymentMethod, transactionId } = body;

    // Validate plan
    const validPlans = ["MONTHLY", "PREMIUM"];
    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    // Get current subscription
    const provider = await db.provider.findUnique({
      where: { id: providerId },
      include: { subscription: true },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    // Calculate price based on plan
    const prices: Record<string, number> = {
      MONTHLY: 15000,
      PREMIUM: 50000,
    };

    const amount = prices[plan];
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    // Create or update subscription
    let subscription;
    if (provider.subscription) {
      subscription = await db.subscription.update({
        where: { id: provider.subscription.id },
        data: {
          plan,
          status: "ACTIVE",
          expiresAt,
          autoRenew: true,
        },
      });
    } else {
      subscription = await db.subscription.create({
        data: {
          providerId,
          plan,
          status: "ACTIVE",
          expiresAt,
          autoRenew: true,
        },
      });
    }

    // Create payment record
    await db.payment.create({
      data: {
        subscriptionId: subscription.id,
        amount,
        method: paymentMethod,
        status: "SUCCESS",
        transactionId,
      },
    });

    // Update provider's verification status if upgrading to verified plan
    if (plan !== "FREE") {
      await db.provider.update({
        where: { id: providerId },
        data: { badgeVerified: true },
      });
    }

    return NextResponse.json({
      success: true,
      subscription: {
        plan: subscription.plan,
        status: subscription.status,
        expiresAt: subscription.expiresAt,
      },
    });
  } catch (error) {
    console.error("Error upgrading subscription:", error);
    return NextResponse.json(
      { error: "Failed to upgrade subscription" },
      { status: 500 }
    );
  }
}
