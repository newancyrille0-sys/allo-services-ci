import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// ==================== REFERRAL CONFIGURATION ====================

const REFERRAL_CONFIG = {
  // Récompenses
  referrerReward: 5000,  // FCFA pour le parrain
  referredReward: 5000,  // FCFA pour le filleul
  
  // Conditions de déblocage
  minReservationAmount: 5000, // Montant minimum de la première réservation
  
  // Limite de parrainages actifs
  maxActiveReferrals: 100, // Maximum de filleuls actifs par parrain
  
  // Durée de validité du code
  codeValidityDays: 365,
};

// ==================== HELPER FUNCTIONS ====================

function generateReferralCode(userId: string): string {
  // Générer un code unique basé sur l'ID utilisateur
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const prefix = userId.slice(-4).toUpperCase();
  let code = prefix;
  
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
}

// ==================== SCHEMAS ====================

const createReferralSchema = z.object({
  referrerId: z.string(),
  referralCode: z.string(),
});

const processRewardSchema = z.object({
  referralId: z.string(),
  reservationId: z.string(),
});

// ==================== GET REFERRAL INFO ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const referralCode = searchParams.get('code');

    // Vérifier un code de parrainage
    if (referralCode && !userId) {
      const referral = await db.referral.findUnique({
        where: { referralCode },
        include: {
          referrer: { select: { fullName: true } },
        },
      });

      if (!referral) {
        return NextResponse.json(
          { valid: false, message: 'Code de parrainage invalide' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        valid: true,
        referrerName: referral.referrer.fullName,
        reward: REFERRAL_CONFIG.referredReward,
        rewardFormatted: `${REFERRAL_CONFIG.referredReward.toLocaleString('fr-FR')} FCFA`,
      });
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'ID utilisateur requis' },
        { status: 400 }
      );
    }

    // Récupérer ou créer le code de parrainage
    let referral = await db.referral.findFirst({
      where: { referrerId: userId },
    });

    if (!referral) {
      // Générer un nouveau code
      const code = generateReferralCode(userId);
      referral = await db.referral.create({
        data: {
          referrerId: userId,
          referredId: userId, // Temporaire, sera mis à jour lors de l'utilisation
          referralCode: code,
          status: 'pending',
        },
      });
    }

    // Statistiques de parrainage
    const stats = await db.referral.aggregate({
      where: {
        referrerId: userId,
        status: 'completed',
      },
      _count: { id: true },
      _sum: { referrerReward: true },
    });

    // Liste des filleuls
    const referredUsers = await db.referral.findMany({
      where: { referrerId: userId },
      include: {
        referred: { select: { fullName: true, createdAt: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({
      referralCode: referral.referralCode,
      stats: {
        totalReferrals: stats._count.id || 0,
        totalRewards: stats._sum.referrerReward || 0,
        totalRewardsFormatted: `${(stats._sum.referrerReward || 0).toLocaleString('fr-FR')} FCFA`,
      },
      referredUsers: referredUsers.map(r => ({
        id: r.id,
        name: r.referred.fullName,
        status: r.status,
        reward: r.referrerReward,
        createdAt: r.createdAt.toISOString(),
      })),
      config: REFERRAL_CONFIG,
    });
  } catch (error) {
    console.error('Referral fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des informations' },
      { status: 500 }
    );
  }
}

// ==================== CREATE REFERRAL ====================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action || 'create';

    if (action === 'use_code') {
      return await handleUseReferralCode(body);
    } else if (action === 'process_reward') {
      return await handleProcessReward(body);
    }

    return NextResponse.json(
      { error: 'Action non reconnue' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Referral action error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'opération' },
      { status: 500 }
    );
  }
}

// ==================== HELPER FUNCTIONS ====================

async function handleUseReferralCode(data: { referrerId: string; referralCode: string; referredId?: string }) {
  const { referrerId, referralCode } = data;

  // Vérifier le code
  const existingReferral = await db.referral.findUnique({
    where: { referralCode },
  });

  if (!existingReferral) {
    return NextResponse.json(
      { error: 'Code de parrainage invalide' },
      { status: 404 }
    );
  }

  // Vérifier que ce n'est pas son propre code
  if (existingReferral.referrerId === referrerId) {
    return NextResponse.json(
      { error: 'Vous ne pouvez pas utiliser votre propre code de parrainage' },
      { status: 400 }
    );
  }

  // Vérifier si l'utilisateur a déjà été parrainé
  const alreadyReferred = await db.referral.findFirst({
    where: { referredId: referrerId },
  });

  if (alreadyReferred) {
    return NextResponse.json(
      { error: 'Vous avez déjà utilisé un code de parrainage' },
      { status: 400 }
    );
  }

  // Créer le parrainage
  const referral = await db.referral.create({
    data: {
      referrerId: existingReferral.referrerId,
      referredId: referrerId,
      referralCode,
      status: 'pending',
      referrerReward: REFERRAL_CONFIG.referrerReward,
      referredReward: REFERRAL_CONFIG.referredReward,
    },
  });

  // Notifier le parrain
  await db.notification.create({
    data: {
      userId: existingReferral.referrerId,
      type: 'system',
      title: 'Nouveau filleul !',
      message: `Quelqu'un a utilisé votre code de parrainage. Gagnez ${REFERRAL_CONFIG.referrerReward.toLocaleString('fr-FR')} FCFA après sa première réservation.`,
      actionUrl: '/dashboard/referral',
    },
  });

  return NextResponse.json({
    success: true,
    referral: {
      id: referral.id,
      status: referral.status,
      referredReward: referral.referredReward,
      referredRewardFormatted: `${referral.referredReward.toLocaleString('fr-FR')} FCFA`,
    },
    message: `Félicitations ! Vous recevrez ${REFERRAL_CONFIG.referredReward.toLocaleString('fr-FR')} FCFA après votre première réservation.`,
  });
}

async function handleProcessReward(data: { referralId: string; reservationId: string }) {
  const { referralId, reservationId } = data;

  // Vérifier le parrainage
  const referral = await db.referral.findUnique({
    where: { id: referralId },
    include: {
      referrer: true,
      referred: true,
    },
  });

  if (!referral) {
    return NextResponse.json(
      { error: 'Parrainage non trouvé' },
      { status: 404 }
    );
  }

  // Vérifier la réservation
  const reservation = await db.reservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation) {
    return NextResponse.json(
      { error: 'Réservation non trouvée' },
      { status: 404 }
    );
  }

  // Vérifier le montant minimum
  if (reservation.priceTotal < REFERRAL_CONFIG.minReservationAmount) {
    return NextResponse.json({
      success: false,
      message: 'Montant de réservation insuffisant pour débloquer la récompense',
    });
  }

  // Marquer la première réservation comme complétée
  await db.referral.update({
    where: { id: referralId },
    data: {
      firstReservationCompleted: true,
      status: 'completed',
      completedAt: new Date(),
    },
  });

  // Créditer le filleul (loyalty points)
  const referredLoyalty = await db.loyaltyPoints.findUnique({
    where: { userId: referral.referredId },
  });

  if (referredLoyalty) {
    const points = Math.floor(referral.referredReward / 50); // 50 FCFA = 1 point
    await db.loyaltyTransaction.create({
      data: {
        loyaltyPointsId: referredLoyalty.id,
        type: 'bonus',
        points,
        reason: 'referral',
        referralId: referral.id,
        description: `Bonus parrainage: ${referral.referredReward.toLocaleString('fr-FR')} FCFA`,
      },
    });

    await db.loyaltyPoints.update({
      where: { id: referredLoyalty.id },
      data: {
        availablePoints: { increment: points },
        totalEarned: { increment: points },
      },
    });
  }

  // Créditer le parrain
  const referrerLoyalty = await db.loyaltyPoints.findUnique({
    where: { userId: referral.referrerId },
  });

  if (referrerLoyalty) {
    const points = Math.floor(referral.referrerReward / 50);
    await db.loyaltyTransaction.create({
      data: {
        loyaltyPointsId: referrerLoyalty.id,
        type: 'bonus',
        points,
        reason: 'referral',
        referralId: referral.id,
        description: `Bonus parrainage: ${referral.referrerReward.toLocaleString('fr-FR')} FCFA`,
      },
    });

    await db.loyaltyPoints.update({
      where: { id: referrerLoyalty.id },
      data: {
        availablePoints: { increment: points },
        totalEarned: { increment: points },
      },
    });
  }

  // Notifier les deux parties
  await db.notification.create({
    data: {
      userId: referral.referrerId,
      type: 'system',
      title: 'Récompense de parrainage !',
      message: `Vous avez gagné ${referral.referrerReward.toLocaleString('fr-FR')} FCFA grâce à votre filleul !`,
      actionUrl: '/dashboard/referral',
    },
  });

  await db.notification.create({
    data: {
      userId: referral.referredId,
      type: 'system',
      title: 'Récompense de bienvenue !',
      message: `Vous avez gagné ${referral.referredReward.toLocaleString('fr-FR')} FCFA grâce au parrainage !`,
      actionUrl: '/dashboard/referral',
    },
  });

  // Mettre à jour le statut
  await db.referral.update({
    where: { id: referralId },
    data: { rewardedAt: new Date() },
  });

  return NextResponse.json({
    success: true,
    rewards: {
      referrer: referral.referrerReward,
      referred: referral.referredReward,
    },
    message: 'Récompenses de parrainage distribuées avec succès',
  });
}
