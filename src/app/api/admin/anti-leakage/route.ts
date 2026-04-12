import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ==================== GET ANTI-LEAKAGE DASHBOARD ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d'; // 24h, 7d, 30d
    const detectionId = searchParams.get('detectionId');

    // Calculer la date de début
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default: // 7d
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Récupérer une détection spécifique
    if (detectionId) {
      const detection = await db.contactDetectionLog.findUnique({
        where: { id: detectionId },
        include: {
          sender: { select: { id: true, fullName: true, phone: true, email: true } },
          receiver: { select: { id: true, fullName: true, phone: true, email: true } },
        },
      });

      if (!detection) {
        return NextResponse.json(
          { error: 'Détection non trouvée' },
          { status: 404 }
        );
      }

      return NextResponse.json({ detection });
    }

    // ===== STATISTIQUES GLOBALES =====
    
    // Détections de la période
    const detections = await db.contactDetectionLog.findMany({
      where: { createdAt: { gte: startDate } },
    });

    const totalDetections = detections.length;
    const resolvedDetections = detections.filter(d => d.isResolved).length;
    const highSeverityDetections = detections.filter(d => d.severity === 'high').length;

    // Par type
    const byType: Record<string, number> = {};
    detections.forEach(d => {
      byType[d.detectedType] = (byType[d.detectedType] || 0) + 1;
    });

    // Par sévérité
    const bySeverity: Record<string, number> = {};
    detections.forEach(d => {
      bySeverity[d.severity] = (bySeverity[d.severity] || 0) + 1;
    });

    // ===== AVERTISSEMENTS =====
    
    const warnings = await db.userWarning.findMany({
      where: { createdAt: { gte: startDate } },
    });

    const totalWarnings = warnings.length;
    const acknowledgedWarnings = warnings.filter(w => w.acknowledged).length;

    // ===== CASHBACKS FORFAITS =====
    
    const forfeitedCashbacks = await db.cashback.findMany({
      where: {
        status: 'forfeited',
        forfeitedAt: { gte: startDate },
      },
    });

    const totalForfeited = forfeitedCashbacks.reduce((sum, c) => sum + c.amount, 0);

    // ===== TOP UTILISATEURS SUSPECTS =====
    
    const userDetectionCounts: Record<string, { count: number; severity: string }> = {};
    detections.forEach(d => {
      if (!userDetectionCounts[d.senderId]) {
        userDetectionCounts[d.senderId] = { count: 0, severity: 'low' };
      }
      userDetectionCounts[d.senderId].count++;
      if (d.severity === 'high') {
        userDetectionCounts[d.senderId].severity = 'high';
      }
    });

    const topSuspects = await Promise.all(
      Object.entries(userDetectionCounts)
        .filter(([, data]) => data.count >= 2)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 10)
        .map(async ([userId, data]) => {
          const user = await db.user.findUnique({
            where: { id: userId },
            select: { id: true, fullName: true, phone: true, email: true, status: true },
          });
          return { ...user, detectionCount: data.count, severity: data.severity };
        })
    );

    // ===== DÉTECTIONS RÉCENTES =====
    
    const recentDetections = await db.contactDetectionLog.findMany({
      where: { createdAt: { gte: startDate } },
      include: {
        sender: { select: { fullName: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // ===== KPI ANTI-FUITE =====
    
    // Calculer le taux de rétention (clients avec réservations répétées)
    const clientsWithRepeatReservations = await db.reservation.groupBy({
      by: ['clientId'],
      where: {
        status: 'COMPLETED',
        createdAt: { gte: startDate },
      },
      _count: { id: true },
      having: {
        id: { _count: { gte: 2 } },
      },
    });

    const totalUniqueClients = await db.reservation.groupBy({
      by: ['clientId'],
      where: {
        status: 'COMPLETED',
        createdAt: { gte: startDate },
      },
    });

    const retentionRate = totalUniqueClients.length > 0
      ? (clientsWithRepeatReservations.length / totalUniqueClients.length) * 100
      : 0;

    return NextResponse.json({
      period,
      stats: {
        totalDetections,
        resolvedDetections,
        pendingDetections: totalDetections - resolvedDetections,
        highSeverityDetections,
        resolutionRate: totalDetections > 0 
          ? Math.round((resolvedDetections / totalDetections) * 100) 
          : 0,
      },
      byType: {
        phone: byType.phone || 0,
        whatsapp: byType.whatsapp || 0,
        email: byType.email || 0,
        telegram: byType.telegram || 0,
        other: byType.other || 0,
      },
      bySeverity: {
        low: bySeverity.low || 0,
        medium: bySeverity.medium || 0,
        high: bySeverity.high || 0,
      },
      warnings: {
        total: totalWarnings,
        acknowledged: acknowledgedWarnings,
        pending: totalWarnings - acknowledgedWarnings,
      },
      cashback: {
        forfeitedCount: forfeitedCashbacks.length,
        forfeitedAmount: totalForfeited,
        forfeitedAmountFormatted: `${totalForfeited.toLocaleString('fr-FR')} FCFA`,
      },
      kpi: {
        retentionRate: Math.round(retentionRate * 10) / 10,
        detectionRate: 0, // TODO: Calculate based on total messages
      },
      topSuspects: topSuspects.filter(Boolean),
      recentDetections: recentDetections.map(d => ({
        id: d.id,
        type: d.detectedType,
        severity: d.severity,
        sender: d.sender.fullName,
        senderPhone: d.sender.phone,
        createdAt: d.createdAt.toISOString(),
        isResolved: d.isResolved,
        occurrenceCount: d.occurrenceCount,
      })),
    });
  } catch (error) {
    console.error('Anti-leakage dashboard error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}

// ==================== RESOLVE DETECTION ====================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { detectionId, action, adminId, notes } = body;

    if (!detectionId || !action || !adminId) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    const detection = await db.contactDetectionLog.findUnique({
      where: { id: detectionId },
    });

    if (!detection) {
      return NextResponse.json(
        { error: 'Détection non trouvée' },
        { status: 404 }
      );
    }

    let warningCreated = false;
    let cashbackForfeited = false;

    // Actions possibles
    switch (action) {
      case 'dismiss':
        // Ignorer (faux positif)
        await db.contactDetectionLog.update({
          where: { id: detectionId },
          data: {
            isResolved: true,
            resolvedAt: new Date(),
            resolvedBy: adminId,
            actionTaken: 'dismissed',
          },
        });
        break;

      case 'warn':
        // Créer un avertissement
        await db.contactDetectionLog.update({
          where: { id: detectionId },
          data: {
            isResolved: true,
            resolvedAt: new Date(),
            resolvedBy: adminId,
            actionTaken: 'warned',
          },
        });

        await db.userWarning.create({
          data: {
            userId: detection.senderId,
            warningType: 'contact_share',
            severity: detection.occurrenceCount >= 3 ? 'suspension' : 'formal',
            title: 'Partage de coordonnées détecté',
            message: notes || 'Vous avez partagé des coordonnées personnelles. Pour votre sécurité, restez sur la plateforme.',
            relatedDetectionId: detectionId,
          },
        });
        warningCreated = true;
        break;

      case 'suspend':
        // Suspendre l'utilisateur et créer un avertissement
        await db.user.update({
          where: { id: detection.senderId },
          data: { status: 'SUSPENDED' },
        });

        await db.contactDetectionLog.update({
          where: { id: detectionId },
          data: {
            isResolved: true,
            resolvedAt: new Date(),
            resolvedBy: adminId,
            actionTaken: 'suspended',
          },
        });

        await db.userWarning.create({
          data: {
            userId: detection.senderId,
            warningType: 'contact_share',
            severity: 'suspension',
            title: 'Compte suspendu',
            message: 'Votre compte a été suspendu pour partage répété de coordonnées.',
            relatedDetectionId: detectionId,
          },
        });
        warningCreated = true;
        break;

      case 'forfeit_cashback':
        // Forfaire le cashback
        await db.contactDetectionLog.update({
          where: { id: detectionId },
          data: {
            isResolved: true,
            resolvedAt: new Date(),
            resolvedBy: adminId,
            actionTaken: 'cashback_forfeited',
          },
        });

        if (detection.reservationId) {
          await db.cashback.updateMany({
            where: { reservationId: detection.reservationId },
            data: {
              status: 'forfeited',
              forfeitedAt: new Date(),
              forfeitReason: 'Contact sharing detected',
            },
          });
          cashbackForfeited = true;
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Action non reconnue' },
          { status: 400 }
        );
    }

    // Logger l'action admin
    await db.adminLog.create({
      data: {
        adminId,
        action: `ANTI_LEAKAGE_${action.toUpperCase()}`,
        targetType: 'CONTACT_DETECTION',
        targetId: detectionId,
        details: JSON.stringify({ notes, action }),
      },
    });

    return NextResponse.json({
      success: true,
      action,
      warningCreated,
      cashbackForfeited,
    });
  } catch (error) {
    console.error('Detection resolve error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement' },
      { status: 500 }
    );
  }
}
