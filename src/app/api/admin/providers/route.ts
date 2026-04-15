import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/providers - Get all providers with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const kycStatus = searchParams.get("kycStatus") || "";
    const tier = searchParams.get("tier") || "";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { businessName: { contains: search, mode: "insensitive" } },
        { user: { fullName: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { user: { phone: { contains: search } } },
      ];
    }

    if (status === "active") {
      where.isActive = true;
    } else if (status === "inactive") {
      where.isActive = false;
    }

    if (kycStatus && kycStatus !== "all") {
      where.kycStatus = kycStatus;
    }

    if (tier && tier !== "all") {
      where.providerTier = tier;
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
              createdAt: true,
            },
          },
          _count: {
            select: {
              reservations: true,
              reviews: true,
            },
          },
        },
      }),
      db.provider.count({ where }),
    ]);

    // Calculate revenue for each provider
    const providersWithRevenue = await Promise.all(
      providers.map(async (provider) => {
        const revenue = await db.payment.aggregate({
          where: {
            reservation: { providerId: provider.id },
            status: "success",
          },
          _sum: { amount: true },
        });

        return {
          id: provider.id,
          userId: provider.userId,
          businessName: provider.businessName,
          isVerified: provider.isVerified,
          kycStatus: provider.kycStatus,
          providerTier: provider.providerTier,
          tierExpiresAt: provider.tierExpiresAt,
          isActive: provider.isActive,
          averageRating: provider.averageRating,
          totalReviews: provider.totalReviews,
          totalReservations: provider.totalReservations,
          createdAt: provider.createdAt,
          user: provider.user,
          reservationCount: provider._count.reservations,
          reviewCount: provider._count.reviews,
          totalRevenue: revenue._sum.amount || 0,
        };
      })
    );

    return NextResponse.json({
      providers: providersWithRevenue,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
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
