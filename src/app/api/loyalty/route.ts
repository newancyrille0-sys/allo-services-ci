import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// ==================== LOYALTY POINTS CONFIGURATION ====================

const LOYALTY_CONFIG = {
  // Points par réservation
  pointsPerReservation: 10,
  
  // Multiplicateurs par niveau
  tierMultipliers: {
    bronze: 1,
    silver: 1.25,
    gold: 1.5,
    platinum: 2,
  },
  
  // Seuils de niveau (points totaux)
  tierThresholds: {
    bronze: 0,
    silver: 500,
    gold: 1500,
    platinum: 5000,
  },
  
  // Conversion points -> FCFA (100 points = 5000 FCFA)
  pointsToFcfa: 50, // 1 point = 50 FCFA
  
  // Réduction maximum par réservation
  maxDiscountPercentage: 0.5, // 50% max
};

// ==================== GET USER LOYALTY INFO ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'ID utilisateur requis' },
        { status: 400 }
      );
    }

    // Récupérer ou créer les points de fidélité
    let loyaltyPoints = await db.loyaltyPoints.findUnique({
      where: { userId },
      include: {
        transactions: {
          take: 20,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!loyaltyPoints) {
      loyaltyPoints = await db.loyaltyPoints.create({
        data: {
          userId,
          totalPoints: 0,
          availablePoints: 0,
          pendingPoints: 0,
          tier: 'bronze',
        },
        include: {
          transactions: true,
        },
      });
    }

    // Récupérer les cashbacks
    const cashbacks = await db.cashback.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Calculer le niveau actuel
    const currentTier = calculateTier(loyaltyPoints.totalPoints);
    
    // Mettre à jour le niveau si nécessaire
    if (currentTier !== loyaltyPoints.tier) {
      await db.loyaltyPoints.update({
        where: { userId },
        data: { tier: currentTier },
      });
    }

    // Calculer la valeur en FCFA
    const pointsValue = loyaltyPoints.availablePoints * LOYALTY_CONFIG.pointsToFcfa;

    return NextResponse.json({
      loyalty: {
        totalPoints: loyaltyPoints.totalPoints,
        availablePoints: loyaltyPoints.availablePoints,
        pendingPoints: loyaltyPoints.pendingPoints,
        tier: currentTier,
        pointsValue,
        pointsValueFormatted: `${pointsValue.toLocaleString('fr-FR')} FCFA`,
        nextTierThreshold: getNextTierThreshold(loyaltyPoints.totalPoints),
        pointsToNextTier: getPointsToNextTier(loyaltyPoints.totalPoints),
        multiplier: LOYALTY_CONFIG.tierMultipliers[currentTier as keyof typeof LOYALTY_CONFIG.tierMultipliers],
        recentTransactions: loyaltyPoints.transactions.map(t => ({
          id: t.id,
          type: t.type,
          points: t.points,
          reason: t.reason,
          description: t.description,
          createdAt: t.createdAt.toISOString(),
        })),
      },
      cashback: {
        pending: cashbacks
          .filter(c => c.status === 'pending')
          .reduce((sum, c) => sum + c.amount, 0),
        available: cashbacks
          .filter(c => c.status === 'available')
          .reduce((sum, c) => sum + c.amount, 0),
        totalEarned: cashbacks
          .reduce((sum, c) => sum + c.amount, 0),
        recentCashbacks: cashbacks.map(c => ({
          id: c.id,
          amount: c.amount,
          status: c.status,
          eligibleAt: c.eligibleAt.toISOString(),
          createdAt: c.createdAt.toISOString(),
        })),
      },
      config: {
        pointsPerReservation: LOYALTY_CONFIG.pointsPerReservation,
        pointsToFcfa: LOYALTY_CONFIG.pointsToFcfa,
        tierMultipliers: LOYALTY_CONFIG.tierMultipliers,
      },
    });
  } catch (error) {
    console.error('Loyalty fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des points' },
      { status: 500 }
    );
  }
}

// ==================== EARN POINTS ====================

const earnPointsSchema = z.object({
  userId: z.string(),
  reservationId: z.string(),
  amount: z.number().positive().optional(), // Montant de la réservation pour bonus
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action || 'earn';

    if (action === 'earn') {
      return await handleEarnPoints(body);
    } else if (action === 'redeem') {
      return await handleRedeemPoints(body);
    } else if (action === 'process_cashback') {
      return await handleProcessCashback(body);
    }

    return NextResponse.json(
      { error: 'Action non reconnue' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Loyalty action error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'opération' },
      { status: 500 }
    );
  }
}

// ==================== HELPER FUNCTIONS ====================

async function handleEarnPoints(data: { userId: string; reservationId: string; amount?: number }) {
  const { userId, reservationId, amount } = data;

  // Vérifier que la réservation existe et est complétée
  const reservation = await db.reservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation) {
    return NextResponse.json(
      { error: 'Réservation non trouvée' },
      { status: 404 }
    );
  }

  // Vérifier qu'on n'a pas déjà donné des points pour cette réservation
  const existingTransaction = await db.loyaltyTransaction.findFirst({
    where: { reservationId, type: 'earn' },
  });

  if (existingTransaction) {
    return NextResponse.json(
      { error: 'Points déjà attribués pour cette réservation' },
      { status: 400 }
    );
  }

  // Récupérer le niveau actuel
  let loyaltyPoints = await db.loyaltyPoints.findUnique({
    where: { userId },
  });

  if (!loyaltyPoints) {
    loyaltyPoints = await db.loyaltyPoints.create({
      data: { userId },
    });
  }

  // Calculer les points avec multiplicateur
  const tier = loyaltyPoints.tier as keyof typeof LOYALTY_CONFIG.tierMultipliers;
  const multiplier = LOYALTY_CONFIG.tierMultipliers[tier] || 1;
  const basePoints = LOYALTY_CONFIG.pointsPerReservation;
  const finalPoints = Math.floor(basePoints * multiplier);

  // Créer la transaction
  await db.loyaltyTransaction.create({
    data: {
      loyaltyPointsId: loyaltyPoints.id,
      type: 'earn',
      points: finalPoints,
      reason: 'reservation',
      reservationId,
      description: `Points gagnés pour réservation #${reservationId.slice(-8)}`,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Expire dans 1 an
    },
  });

  // Mettre à jour le total
  const updatedLoyaltyPoints = await db.loyaltyPoints.update({
    where: { userId },
    data: {
      totalPoints: { increment: finalPoints },
      availablePoints: { increment: finalPoints },
      totalEarned: { increment: finalPoints },
    },
  });

  // Vérifier si le niveau a changé
  const newTier = calculateTier(updatedLoyaltyPoints.totalPoints);
  if (newTier !== updatedLoyaltyPoints.tier) {
    await db.loyaltyPoints.update({
      where: { userId },
      data: { tier: newTier },
    });
  }

  return NextResponse.json({
    success: true,
    pointsEarned: finalPoints,
    multiplier,
    newTotal: updatedLoyaltyPoints.totalPoints,
    tier: newTier,
    tierUpgraded: newTier !== loyaltyPoints.tier,
  });
}

async function handleRedeemPoints(data: { userId: string; points: number; reservationId?: string }) {
  const { userId, points, reservationId } = data;

  const loyaltyPoints = await db.loyaltyPoints.findUnique({
    where: { userId },
  });

  if (!loyaltyPoints || loyaltyPoints.availablePoints < points) {
    return NextResponse.json(
      { error: 'Points insuffisants' },
      { status: 400 }
    );
  }

  // Calculer la valeur en FCFA
  const value = points * LOYALTY_CONFIG.pointsToFcfa;

  // Créer la transaction
  await db.loyaltyTransaction.create({
    data: {
      loyaltyPointsId: loyaltyPoints.id,
      type: 'spend',
      points: -points,
      reason: 'redemption',
      reservationId,
      description: `Utilisation de ${points} points (${value.toLocaleString('fr-FR')} FCFA)`,
    },
  });

  // Mettre à jour le total
  await db.loyaltyPoints.update({
    where: { userId },
    data: {
      availablePoints: { decrement: points },
      totalSpent: { increment: points },
    },
  });

  return NextResponse.json({
    success: true,
    pointsUsed: points,
    value,
    valueFormatted: `${value.toLocaleString('fr-FR')} FCFA`,
  });
}

async function handleProcessCashback(data: { userId: string }) {
  const { userId } = data;

  // Trouver les cashbacks disponibles
  const availableCashbacks = await db.cashback.findMany({
    where: {
      userId,
      status: 'available',
      eligibleAt: { lte: new Date() },
    },
  });

  if (availableCashbacks.length === 0) {
    return NextResponse.json({
      success: true,
      message: 'Aucun cashback disponible',
      totalCredited: 0,
    });
  }

  // Calculer le total
  const totalAmount = availableCashbacks.reduce((sum, c) => sum + c.amount, 0);

  // Marquer les cashbacks comme utilisés
  await db.cashback.updateMany({
    where: {
      id: { in: availableCashbacks.map(c => c.id) },
    },
    data: {
      status: 'used',
      usedAt: new Date(),
    },
  });

  // Créer une transaction de bonus
  const loyaltyPoints = await db.loyaltyPoints.findUnique({
    where: { userId },
  });

  if (loyaltyPoints) {
    const bonusPoints = Math.floor(totalAmount / LOYALTY_CONFIG.pointsToFcfa);
    
    await db.loyaltyTransaction.create({
      data: {
        loyaltyPointsId: loyaltyPoints.id,
        type: 'bonus',
        points: bonusPoints,
        reason: 'cashback',
        description: `Bonus cashback: ${totalAmount.toLocaleString('fr-FR')} FCFA`,
      },
    });

    await db.loyaltyPoints.update({
      where: { userId },
      data: {
        availablePoints: { increment: bonusPoints },
        totalEarned: { increment: bonusPoints },
      },
    });
  }

  return NextResponse.json({
    success: true,
    cashbacksProcessed: availableCashbacks.length,
    totalCredited: totalAmount,
    totalCreditedFormatted: `${totalAmount.toLocaleString('fr-FR')} FCFA`,
  });
}

function calculateTier(totalPoints: number): string {
  if (totalPoints >= LOYALTY_CONFIG.tierThresholds.platinum) return 'platinum';
  if (totalPoints >= LOYALTY_CONFIG.tierThresholds.gold) return 'gold';
  if (totalPoints >= LOYALTY_CONFIG.tierThresholds.silver) return 'silver';
  return 'bronze';
}

function getNextTierThreshold(currentPoints: number): number {
  if (currentPoints < LOYALTY_CONFIG.tierThresholds.silver) {
    return LOYALTY_CONFIG.tierThresholds.silver;
  }
  if (currentPoints < LOYALTY_CONFIG.tierThresholds.gold) {
    return LOYALTY_CONFIG.tierThresholds.gold;
  }
  if (currentPoints < LOYALTY_CONFIG.tierThresholds.platinum) {
    return LOYALTY_CONFIG.tierThresholds.platinum;
  }
  return -1; // Déjà au niveau maximum
}

function getPointsToNextTier(currentPoints: number): number {
  const nextThreshold = getNextTierThreshold(currentPoints);
  if (nextThreshold === -1) return 0;
  return nextThreshold - currentPoints;
}
