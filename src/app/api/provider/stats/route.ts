import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ==================== GET PROVIDER STATS ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');
    const period = searchParams.get('period') || 'month'; // week, month, year, all

    if (!providerId) {
      return NextResponse.json(
        { error: 'ID prestataire requis' },
        { status: 400 }
      );
    }

    // Récupérer ou créer les statistiques
    let stats = await db.providerStats.findUnique({
      where: { providerId },
    });

    // Définir les dates selon la période
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(0); // All time
    }

    // Calculer les statistiques en temps réel si pas de cache
    const reservations = await db.reservation.findMany({
      where: {
        providerId,
        createdAt: { gte: startDate },
      },
      include: {
        service: true,
        review: true,
      },
    });

    const completedReservations = reservations.filter(r => r.status === 'COMPLETED');
    const cancelledReservations = reservations.filter(r => r.status === 'CANCELLED');

    // Calculs
    const totalRevenue = completedReservations.reduce((sum, r) => sum + r.priceTotal, 0);
    const totalReservations = reservations.length;
    const completedCount = completedReservations.length;
    const cancelledCount = cancelledReservations.length;

    // Notes
    const reviews = completedReservations.filter(r => r.review).map(r => r.review!);
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    // Comparaison avec la période précédente
    const previousStartDate = new Date(startDate);
    previousStartDate.setTime(previousStartDate.getTime() - (now.getTime() - startDate.getTime()));

    const previousReservations = await db.reservation.findMany({
      where: {
        providerId,
        createdAt: {
          gte: previousStartDate,
          lt: startDate,
        },
        status: 'COMPLETED',
      },
    });

    const previousRevenue = previousReservations.reduce((sum, r) => sum + r.priceTotal, 0);
    const revenueGrowth = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;
    const reservationGrowth = previousReservations.length > 0
      ? ((completedCount - previousReservations.length) / previousReservations.length) * 100
      : 0;

    // Heures de pointe
    const hourCounts: Record<number, number> = {};
    completedReservations.forEach(r => {
      const hour = new Date(r.scheduledDate).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const peakHours = Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Jours de pointe
    const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const dayCounts: Record<number, number> = {};
    completedReservations.forEach(r => {
      const day = new Date(r.scheduledDate).getDay();
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
    
    const peakDays = Object.entries(dayCounts)
      .map(([day, count]) => ({ day: dayNames[parseInt(day)], count }))
      .sort((a, b) => b.count - a.count);

    // Clients réguliers
    const clientCounts: Record<string, { count: number; spent: number }> = {};
    completedReservations.forEach(r => {
      if (!clientCounts[r.clientId]) {
        clientCounts[r.clientId] = { count: 0, spent: 0 };
      }
      clientCounts[r.clientId].count++;
      clientCounts[r.clientId].spent += r.priceTotal;
    });

    const topClients = Object.entries(clientCounts)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const repeatClients = Object.values(clientCounts).filter(c => c.count > 1).length;
    const repeatClientRate = completedCount > 0 
      ? (repeatClients / Object.keys(clientCounts).length) * 100 
      : 0;

    // Mettre à jour le cache
    if (!stats) {
      stats = await db.providerStats.create({
        data: {
          providerId,
          currentMonthRevenue: totalRevenue,
          currentMonthReservations: completedCount,
          currentMonthReviews: reviews.length,
          lastMonthRevenue: previousRevenue,
          lastMonthReservations: previousReservations.length,
          totalRevenue,
          totalCompletedReservations: completedCount,
          totalCancelledReservations: cancelledCount,
          averageRating,
          revenueGrowth,
          reservationGrowth,
          peakHours: JSON.stringify(peakHours),
          peakDays: JSON.stringify(peakDays),
          repeatClientRate,
          topClients: JSON.stringify(topClients),
        },
      });
    } else {
      stats = await db.providerStats.update({
        where: { providerId },
        data: {
          currentMonthRevenue: totalRevenue,
          currentMonthReservations: completedCount,
          currentMonthReviews: reviews.length,
          averageRating,
          revenueGrowth,
          reservationGrowth,
          peakHours: JSON.stringify(peakHours),
          peakDays: JSON.stringify(peakDays),
          repeatClientRate,
          topClients: JSON.stringify(topClients),
          lastCalculated: new Date(),
        },
      });
    }

    // Services les plus demandés
    const serviceCounts: Record<string, { name: string; count: number; revenue: number }> = {};
    completedReservations.forEach(r => {
      if (!serviceCounts[r.serviceId]) {
        serviceCounts[r.serviceId] = { name: r.service.name, count: 0, revenue: 0 };
      }
      serviceCounts[r.serviceId].count++;
      serviceCounts[r.serviceId].revenue += r.priceTotal;
    });

    const topServices = Object.entries(serviceCounts)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return NextResponse.json({
      period,
      overview: {
        totalRevenue,
        totalRevenueFormatted: `${totalRevenue.toLocaleString('fr-FR')} FCFA`,
        totalReservations,
        completedCount,
        cancelledCount,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewsCount: reviews.length,
      },
      growth: {
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        reservationGrowth: Math.round(reservationGrowth * 10) / 10,
      },
      insights: {
        peakHours,
        peakDays,
        topServices,
        repeatClientRate: Math.round(repeatClientRate * 10) / 10,
        topClients,
      },
      lastUpdated: stats.lastCalculated.toISOString(),
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
