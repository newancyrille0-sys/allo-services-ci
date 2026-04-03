import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/provider/subscription - Get subscription status
export async function GET(request: NextRequest) {
  try {
    const providerId = "provider-1"; // Mock provider ID

    const provider = await db.provider.findUnique({
      where: { id: providerId },
      include: {
        subscription: {
          include: {
            payments: {
              orderBy: { createdAt: "desc" },
              take: 5,
            },
          },
        },
      },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    // If no subscription, return free plan
    if (!provider.subscription) {
      return NextResponse.json({
        subscription: {
          plan: "FREE",
          status: "ACTIVE",
          expiresAt: null,
          autoRenew: false,
          payments: [],
        },
        features: {
          maxServices: 5,
          hasAnalytics: false,
          hasPrioritySupport: false,
        },
      });
    }

    // Calculate features based on plan
    const features = getPlanFeatures(provider.subscription.plan);

    return NextResponse.json({
      subscription: {
        plan: provider.subscription.plan,
        status: provider.subscription.status,
        expiresAt: provider.subscription.expiresAt,
        autoRenew: provider.subscription.autoRenew,
        payments: provider.subscription.payments,
      },
      features,
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

function getPlanFeatures(plan: string) {
  switch (plan) {
    case "PREMIUM":
      return {
        maxServices: -1, // Unlimited
        hasAnalytics: true,
        hasPrioritySupport: true,
        hasHomepageFeatured: true,
        hasCustomProfile: true,
      };
    case "MONTHLY":
      return {
        maxServices: 15,
        hasAnalytics: true,
        hasPrioritySupport: false,
        hasHomepageFeatured: false,
        hasCustomProfile: false,
      };
    default:
      return {
        maxServices: 5,
        hasAnalytics: false,
        hasPrioritySupport: false,
        hasHomepageFeatured: false,
        hasCustomProfile: false,
      };
  }
}
