import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SubscriptionPlan } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const plan = searchParams.get("plan");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (plan && plan !== "all") {
      where.planName = plan as SubscriptionPlan;
    }

    if (status && status !== "all") {
      where.status = status;
    }

    // Get subscriptions with pagination
    const [subscriptions, total] = await Promise.all([
      db.subscription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          provider: {
            select: {
              id: true,
              businessName: true,
              user: {
                select: { fullName: true },
              },
            },
          },
        },
      }),
      db.subscription.count({ where }),
    ]);

    // Calculate stats
    const stats = await Promise.all([
      db.subscription.count({ where: { planName: SubscriptionPlan.FREE } }),
      db.subscription.count({ where: { planName: SubscriptionPlan.MONTHLY } }),
      db.subscription.count({ where: { planName: SubscriptionPlan.PREMIUM } }),
      db.subscription.aggregate({
        where: { status: "active" },
        _sum: { amount: true },
      }),
    ]);

    return NextResponse.json({
      subscriptions: subscriptions.map((sub) => ({
        id: sub.id,
        providerId: sub.providerId,
        providerName: sub.provider.businessName || sub.provider.user.fullName,
        plan: sub.planName,
        startDate: sub.startDate,
        endDate: sub.endDate,
        autoRenew: sub.autoRenew,
        status: sub.status,
        amount: sub.amount,
      })),
      stats: {
        free: stats[0],
        monthly: stats[1],
        premium: stats[2],
        revenue: stats[3]._sum.amount || 0,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des abonnements" },
      { status: 500 }
    );
  }
}
