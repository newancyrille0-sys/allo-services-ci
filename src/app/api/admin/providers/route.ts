import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { KycStatus, SubscriptionPlan } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const subscription = searchParams.get("subscription");
    const kycStatus = searchParams.get("kycStatus");
    const city = searchParams.get("city");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { businessName: { contains: search, mode: "insensitive" } },
        { user: { fullName: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { user: { phone: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (status && status !== "all") {
      if (status === "ACTIVE") {
        where.isActive = true;
        where.user = { ...where.user, status: "ACTIVE" };
      } else if (status === "PENDING") {
        where.kycStatus = KycStatus.PENDING;
      } else if (status === "SUSPENDED") {
        where.user = { ...where.user, status: "SUSPENDED" };
      } else if (status === "BANNED") {
        where.user = { ...where.user, status: "BANNED" };
      }
    }

    if (subscription && subscription !== "all") {
      where.subscriptionStatus = subscription as SubscriptionPlan;
    }

    if (kycStatus && kycStatus !== "all") {
      where.kycStatus = kycStatus as KycStatus;
    }

    if (city && city !== "all") {
      where.user = { ...where.user, city };
    }

    // Get providers with pagination
    const [providers, total] = await Promise.all([
      db.provider.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              city: true,
              avatarUrl: true,
              status: true,
            },
          },
        },
      }),
      db.provider.count({ where }),
    ]);

    return NextResponse.json({
      providers: providers.map((provider) => ({
        id: provider.id,
        userId: provider.user.id,
        businessName: provider.businessName,
        ownerName: provider.user.fullName,
        email: provider.user.email,
        phone: provider.user.phone,
        city: provider.user.city,
        avatarUrl: provider.user.avatarUrl,
        subscriptionPlan: provider.subscriptionStatus,
        kycStatus: provider.kycStatus,
        status: provider.user.status,
        rating: provider.averageRating,
        totalReservations: provider.totalReservations,
        createdAt: provider.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching providers:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des prestataires" },
      { status: 500 }
    );
  }
}
