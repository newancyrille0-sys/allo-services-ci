import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/provider/reviews - List provider reviews
export async function GET(request: NextRequest) {
  try {
    const providerId = "provider-1"; // Mock provider ID
    const searchParams = request.nextUrl.searchParams;

    const rating = searchParams.get("rating");
    const responded = searchParams.get("responded");

    const whereClause: Record<string, unknown> = { providerId };

    if (rating) {
      whereClause.rating = parseInt(rating);
    }

    if (responded === "true") {
      whereClause.providerResponse = { not: null };
    } else if (responded === "false") {
      whereClause.providerResponse = null;
    }

    const reviews = await db.review.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
          },
        },
        reservation: {
          include: {
            service: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate stats
    const stats = await db.review.aggregate({
      where: { providerId },
      _avg: { rating: true },
      _count: true,
    });

    const ratingDistribution = await db.review.groupBy({
      by: ["rating"],
      where: { providerId },
      _count: true,
    });

    const distribution: Record<number, number> = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };
    ratingDistribution.forEach((item) => {
      distribution[item.rating] = item._count;
    });

    return NextResponse.json({
      reviews,
      stats: {
        averageRating: stats._avg.rating || 0,
        totalReviews: stats._count,
        ratingDistribution: distribution,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
