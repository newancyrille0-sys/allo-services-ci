import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/stats - Get admin dashboard statistics
export async function GET(request: NextRequest) {
  try {
    // Get current date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Execute all queries in parallel
    const [
      totalUsers,
      activeUsers,
      totalProviders,
      activeProviders,
      totalReservations,
      completedReservations,
      pendingReservations,
      totalRevenue,
      monthlyRevenue,
      pendingKyc,
      pendingReviews,
      fraudAlerts,
      newUsersThisMonth,
      reservationsThisMonth,
      topServices,
      recentActivity,
    ] = await Promise.all([
      // Total users
      db.user.count({ where: { role: "CLIENT" } }),
      
      // Active users
      db.user.count({ 
        where: { 
          role: "CLIENT", 
          status: "ACTIVE" 
        } 
      }),
      
      // Total providers
      db.user.count({ where: { role: "PROVIDER" } }),
      
      // Active providers
      db.provider.count({ 
        where: { 
          isActive: true,
          isVerified: true 
        } 
      }),
      
      // Total reservations
      db.reservation.count(),
      
      // Completed reservations
      db.reservation.count({ 
        where: { status: "COMPLETED" } 
      }),
      
      // Pending reservations
      db.reservation.count({ 
        where: { status: "PENDING" } 
      }),
      
      // Total revenue
      db.payment.aggregate({
        where: { status: "success" },
        _sum: { amount: true },
      }),
      
      // Monthly revenue
      db.payment.aggregate({
        where: {
          status: "success",
          createdAt: { gte: thirtyDaysAgo },
        },
        _sum: { amount: true },
      }),
      
      // Pending KYC verifications
      db.provider.count({ 
        where: { kycStatus: "PENDING" } 
      }),
      
      // Pending reviews to moderate
      db.review.count({ 
        where: { isVisible: false } 
      }),
      
      // Fraud alerts
      db.fraudLog.count({ 
        where: { isResolved: false } 
      }),
      
      // New users this month
      db.user.count({
        where: {
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      
      // Reservations this month
      db.reservation.count({
        where: {
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      
      // Top services
      db.service.findMany({
        take: 5,
        orderBy: {
          reservations: { _count: "desc" },
        },
        include: {
          _count: { select: { reservations: true } },
        },
      }),
      
      // Recent activity (last 10 reservations)
      db.reservation.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          client: {
            select: { fullName: true, email: true },
          },
          provider: {
            include: {
              user: { select: { fullName: true } },
            },
          },
          service: { select: { name: true } },
        },
      }),
    ]);

    // Calculate growth percentages (mock for now, would need historical data)
    const userGrowth = 12; // %
    const reservationGrowth = 18; // %
    const revenueGrowth = 5; // %

    // Format response
    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        newThisMonth: newUsersThisMonth,
        growth: userGrowth,
      },
      providers: {
        total: totalProviders,
        active: activeProviders,
        pendingKyc: pendingKyc,
      },
      reservations: {
        total: totalReservations,
        completed: completedReservations,
        pending: pendingReservations,
        thisMonth: reservationsThisMonth,
        growth: reservationGrowth,
      },
      revenue: {
        total: totalRevenue._sum.amount || 0,
        monthly: monthlyRevenue._sum.amount || 0,
        growth: revenueGrowth,
      },
      moderation: {
        pendingKyc: pendingKyc,
        pendingReviews: pendingReviews,
        fraudAlerts: fraudAlerts,
      },
      topServices: topServices.map((service) => ({
        id: service.id,
        name: service.name,
        reservationCount: service._count.reservations,
      })),
      recentActivity: recentActivity.map((reservation) => ({
        id: reservation.id,
        status: reservation.status,
        client: reservation.client.fullName || reservation.client.email,
        provider: reservation.provider.user.fullName,
        service: reservation.service.name,
        createdAt: reservation.createdAt.toISOString(),
        price: reservation.priceTotal,
      })),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}
