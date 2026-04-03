import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { UserRole, UserStatus, KycStatus, SubscriptionPlan, ReservationStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    // Get current date info
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Total clients
    const totalClients = await db.user.count({
      where: { role: UserRole.CLIENT },
    });

    // Total providers
    const totalProviders = await db.provider.count();

    // Active providers
    const activeProviders = await db.provider.count({
      where: { isActive: true },
    });

    // Reservations this month
    const reservationsThisMonth = await db.reservation.count({
      where: {
        createdAt: { gte: startOfMonth },
      },
    });

    // Total revenue from completed reservations
    const totalRevenue = await db.payment.aggregate({
      where: { status: "completed" },
      _sum: { amount: true },
    });

    // Active subscriptions
    const activeSubscriptions = await db.subscription.count({
      where: { status: "active" },
    });

    // Monthly stats for charts
    const monthlyStats = await getMonthlyStats();

    // Recent activity
    const recentActivity = await getRecentActivity();

    // Fraud alerts count
    const fraudAlerts = await db.fraudLog.count({
      where: { isResolved: false },
    });

    return NextResponse.json({
      stats: {
        totalClients,
        totalProviders,
        activeProviders,
        reservationsThisMonth,
        totalRevenue: totalRevenue._sum.amount || 0,
        activeSubscriptions,
        fraudAlerts,
      },
      monthlyStats,
      recentActivity,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}

async function getMonthlyStats() {
  const months = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

    const [revenue, clients, providers] = await Promise.all([
      db.payment.aggregate({
        where: {
          status: "completed",
          createdAt: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      }),
      db.user.count({
        where: {
          role: UserRole.CLIENT,
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
      db.provider.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
    ]);

    months.push({
      month: startDate.toLocaleDateString("fr-FR", { month: "short" }),
      revenue: revenue._sum.amount || 0,
      clients,
      providers,
    });
  }

  return months;
}

async function getRecentActivity() {
  const activities: Array<{
    type: string;
    title: string;
    description: string;
    time: Date;
  }> = [];

  // Recent registrations
  const recentUsers = await db.user.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    select: { fullName: true, role: true, createdAt: true },
  });

  recentUsers.forEach((user) => {
    activities.push({
      type: user.role === UserRole.PROVIDER ? "registration_provider" : "registration_client",
      title: user.role === UserRole.PROVIDER ? "Nouveau prestataire inscrit" : "Nouveau client inscrit",
      description: user.fullName,
      time: user.createdAt,
    });
  });

  // Recent reservations
  const recentReservations = await db.reservation.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { fullName: true } },
      service: { select: { name: true } },
    },
  });

  recentReservations.forEach((res) => {
    activities.push({
      type: "reservation",
      title: "Nouvelle réservation",
      description: `${res.service.name} - ${res.client.fullName}`,
      time: res.createdAt,
    });
  });

  // Recent reviews
  const recentReviews = await db.review.findMany({
    take: 2,
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { fullName: true } },
      provider: { select: { businessName: true } },
    },
  });

  recentReviews.forEach((review) => {
    activities.push({
      type: "review",
      title: "Nouvel avis publié",
      description: `${review.rating} étoiles pour ${review.provider.businessName || "un prestataire"}`,
      time: review.createdAt,
    });
  });

  // Fraud alerts
  const fraudAlerts = await db.fraudLog.findMany({
    take: 2,
    orderBy: { createdAt: "desc" },
    where: { isResolved: false },
  });

  fraudAlerts.forEach((alert) => {
    activities.push({
      type: "fraud",
      title: "Alerte fraude détectée",
      description: alert.description || alert.eventType,
      time: alert.createdAt,
    });
  });

  // Sort by time
  activities.sort((a, b) => b.time.getTime() - a.time.getTime());

  return activities.slice(0, 10);
}
