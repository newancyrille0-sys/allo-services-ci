import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/provider/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const providerId = "provider-1"; // Mock provider ID
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "30d";

    // Get provider's subscription to determine access level
    const provider = await db.provider.findUnique({
      where: { id: providerId },
      include: {
        subscription: true,
      },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    const plan = provider.subscription?.plan || "FREE";

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      case "6m":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Get basic stats
    const reservations = await db.reservation.findMany({
      where: {
        providerId,
        createdAt: { gte: startDate },
      },
      include: {
        service: true,
      },
    });

    const totalReservations = reservations.length;
    const completedReservations = reservations.filter(
      (r) => r.status === "COMPLETED"
    ).length;
    const totalRevenue = reservations
      .filter((r) => r.status === "COMPLETED")
      .reduce((sum, r) => sum + r.priceTotal, 0);

    // Get profile views (mock for now)
    const profileViews = 312;

    // Get reviews
    const reviews = await db.review.findMany({
      where: { providerId },
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    // For FREE plan, return basic stats only
    if (plan === "FREE") {
      return NextResponse.json({
        accessLevel: "BASIC",
        stats: {
          totalReservations,
          completedReservations,
          totalRevenue,
          averageRating,
          totalReviews: reviews.length,
        },
      });
    }

    // For MONTHLY and PREMIUM, return detailed analytics
    // Get views by date (mock data for now)
    const viewsByDate = generateMockViewsData(period);

    // Get revenue by date
    const revenueByDate = generateMockRevenueData(period);

    // Get reservations by date
    const reservationsByDate = generateMockReservationsData(period);

    // Get service distribution
    const serviceDistribution = await db.reservation.groupBy({
      by: ["serviceId"],
      where: {
        providerId,
        status: "COMPLETED",
      },
      _count: true,
    });

    // Get top cities
    const topCities = await db.reservation.groupBy({
      by: ["city"],
      where: { providerId },
      _count: true,
      orderBy: { _count: { city: "desc" } },
      take: 5,
    });

    // For PREMIUM, include advanced metrics
    if (plan === "PREMIUM") {
      return NextResponse.json({
        accessLevel: "FULL",
        stats: {
          totalReservations,
          completedReservations,
          totalRevenue,
          averageRating,
          totalReviews: reviews.length,
          profileViews,
          conversionRate: totalReservations > 0 ? (completedReservations / totalReservations) * 100 : 0,
        },
        viewsByDate,
        revenueByDate,
        reservationsByDate,
        serviceDistribution,
        topCities,
        clientDemographics: generateMockClientDemographics(),
      });
    }

    // For MONTHLY
    return NextResponse.json({
      accessLevel: "STANDARD",
      stats: {
        totalReservations,
        completedReservations,
        totalRevenue,
        averageRating,
        totalReviews: reviews.length,
        profileViews,
      },
      viewsByDate,
      revenueByDate,
      reservationsByDate,
      serviceDistribution,
      topCities,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

// Helper functions for mock data
function generateMockViewsData(period: string): Array<{ date: string; views: number }> {
  const data = [];
  const days = period === "7d" ? 7 : period === "90d" ? 90 : 14;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
      views: Math.floor(Math.random() * 50) + 20,
    });
  }
  return data;
}

function generateMockRevenueData(period: string): Array<{ date: string; revenue: number }> {
  const data = [];
  const months = period === "1y" ? 12 : 6;
  for (let i = months; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    data.push({
      date: date.toLocaleDateString("fr-FR", { month: "short" }),
      revenue: Math.floor(Math.random() * 200000) + 150000,
    });
  }
  return data;
}

function generateMockReservationsData(period: string): Array<{ date: string; reservations: number; completed: number }> {
  const data = [];
  const days = period === "7d" ? 7 : period === "90d" ? 90 : 14;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const reservations = Math.floor(Math.random() * 5) + 2;
    data.push({
      date: date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
      reservations,
      completed: Math.floor(reservations * 0.8),
    });
  }
  return data;
}

function generateMockClientDemographics(): Array<{ segment: string; count: number; percentage: number }> {
  return [
    { segment: "Nouveaux clients", count: 45, percentage: 35 },
    { segment: "Clients réguliers", count: 68, percentage: 52 },
    { segment: "Clients VIP", count: 17, percentage: 13 },
  ];
}
