import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// ==================== INSURANCE CONFIGURATION ====================

const INSURANCE_CONFIG = {
  // Montants maximum par type de réclamation
  maxClaimAmounts: {
    no_show: 50000,      // Prestataire ne vient pas
    damage: 100000,      // Dommages causés
    incomplete: 30000,   // Travail non terminé
    dispute: 50000,      // Litige divers
  },
  
  // Délai maximum pour réclamer (en jours)
  claimDeadlineDays: 7,
  
  // Franchise (part à la charge du client)
  franchisePercentage: 0.10, // 10%
  minFranchise: 1000, // Minimum 1000 FCFA
  
  // Messages
  messages: {
    no_show: 'Le prestataire ne s\'est pas présenté à la réservation.',
    damage: 'Des dommages ont été causés lors de la prestation.',
    incomplete: 'La prestation n\'a pas été correctement terminée.',
    dispute: 'Un litige est survenu avec le prestataire.',
  },
};

// ==================== SCHEMAS ====================

const createClaimSchema = z.object({
  reservationId: z.string(),
  clientId: z.string(),
  claimType: z.enum(['no_show', 'damage', 'incomplete', 'dispute']),
  description: z.string().min(20, 'Description minimum 20 caractères'),
  amount: z.number().positive(),
  evidence: z.array(z.string()).optional(), // URLs des preuves
});

const updateClaimSchema = z.object({
  claimId: z.string(),
  status: z.enum(['pending', 'under_review', 'approved', 'rejected', 'resolved']),
  resolutionType: z.enum(['refund', 'partial_refund', 'mediation', 'rejected']).optional(),
  resolutionAmount: z.number().optional(),
  resolutionNotes: z.string().optional(),
  reviewerId: z.string(),
});

// ==================== GET CLAIMS ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const claimId = searchParams.get('claimId');
    const status = searchParams.get('status');

    // Récupérer une réclamation spécifique
    if (claimId) {
      const claim = await db.insuranceClaim.findUnique({
        where: { id: claimId },
        include: {
          reservation: {
            include: {
              service: true,
              provider: {
                include: { user: { select: { fullName: true, phone: true } } },
              },
            },
          },
        },
      });

      if (!claim) {
        return NextResponse.json(
          { error: 'Réclamation non trouvée' },
          { status: 404 }
        );
      }

      return NextResponse.json({ claim });
    }

    // Lister les réclamations
    if (!userId) {
      return NextResponse.json(
        { error: 'ID utilisateur requis' },
        { status: 400 }
      );
    }

    const whereClause: Record<string, unknown> = { clientId: userId };
    if (status) {
      whereClause.status = status;
    }

    const claims = await db.insuranceClaim.findMany({
      where: whereClause,
      include: {
        reservation: {
          include: {
            service: true,
            provider: {
              include: { user: { select: { fullName: true } } },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({
      claims: claims.map(c => ({
        id: c.id,
        claimType: c.claimType,
        description: c.description,
        amount: c.amount,
        status: c.status,
        resolutionType: c.resolutionType,
        resolutionAmount: c.resolutionAmount,
        reservation: {
          id: c.reservation.id,
          service: c.reservation.service.name,
          provider: c.reservation.provider.user.fullName,
          scheduledDate: c.reservation.scheduledDate.toISOString(),
        },
        createdAt: c.createdAt.toISOString(),
        resolvedAt: c.resolvedAt?.toISOString(),
      })),
      config: INSURANCE_CONFIG,
    });
  } catch (error) {
    console.error('Insurance claims fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des réclamations' },
      { status: 500 }
    );
  }
}

// ==================== CREATE CLAIM ====================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = createClaimSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Vérifier la réservation
    const reservation = await db.reservation.findUnique({
      where: { id: data.reservationId },
      include: {
        client: true,
        provider: true,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    if (reservation.clientId !== data.clientId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Vérifier le délai de réclamation
    const deadline = new Date(reservation.scheduledDate);
    deadline.setDate(deadline.getDate() + INSURANCE_CONFIG.claimDeadlineDays);

    if (new Date() > deadline) {
      return NextResponse.json(
        { error: `Le délai de réclamation (${INSURANCE_CONFIG.claimDeadlineDays} jours) est dépassé` },
        { status: 400 }
      );
    }

    // Vérifier qu'il n'y a pas déjà une réclamation
    const existingClaim = await db.insuranceClaim.findUnique({
      where: { reservationId: data.reservationId },
    });

    if (existingClaim) {
      return NextResponse.json(
        { error: 'Une réclamation existe déjà pour cette réservation' },
        { status: 400 }
      );
    }

    // Valider le montant
    const maxAmount = INSURANCE_CONFIG.maxClaimAmounts[data.claimType as keyof typeof INSURANCE_CONFIG.maxClaimAmounts];
    if (data.amount > maxAmount) {
      return NextResponse.json(
        { error: `Montant maximum pour ce type: ${maxAmount.toLocaleString('fr-FR')} FCFA` },
        { status: 400 }
      );
    }

    // Créer la réclamation
    const claim = await db.insuranceClaim.create({
      data: {
        reservationId: data.reservationId,
        clientId: data.clientId,
        providerId: reservation.providerId,
        claimType: data.claimType,
        description: data.description,
        amount: data.amount,
        evidence: data.evidence ? JSON.stringify(data.evidence) : null,
        status: 'pending',
      },
    });

    // Notifier l'admin
    await db.notification.create({
      data: {
        userId: 'admin', // À adapter selon votre système
        type: 'system',
        title: 'Nouvelle réclamation assurance',
        message: `Réclamation #${claim.id.slice(-8)}: ${INSURANCE_CONFIG.messages[data.claimType as keyof typeof INSURANCE_CONFIG.messages]}`,
        actionUrl: `/admin/insurance/${claim.id}`,
      },
    });

    // Mettre à jour le cashback si existant
    await db.cashback.updateMany({
      where: { reservationId: data.reservationId },
      data: { hasDispute: true },
    });

    return NextResponse.json({
      success: true,
      claim: {
        id: claim.id,
        claimType: claim.claimType,
        amount: claim.amount,
        status: claim.status,
        createdAt: claim.createdAt.toISOString(),
      },
      message: 'Votre réclamation a été enregistrée. Notre équipe l\'examinera dans les 48h.',
    });
  } catch (error) {
    console.error('Insurance claim creation error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la réclamation' },
      { status: 500 }
    );
  }
}

// ==================== UPDATE CLAIM (Admin) ====================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = updateClaimSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    const claim = await db.insuranceClaim.findUnique({
      where: { id: data.claimId },
      include: {
        reservation: true,
        client: true,
      },
    });

    if (!claim) {
      return NextResponse.json(
        { error: 'Réclamation non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour la réclamation
    const updateData: Record<string, unknown> = {
      status: data.status,
      reviewedById: data.reviewerId,
      reviewedAt: new Date(),
    };

    if (data.resolutionType) {
      updateData.resolutionType = data.resolutionType;
    }
    if (data.resolutionAmount) {
      updateData.resolutionAmount = data.resolutionAmount;
    }
    if (data.resolutionNotes) {
      updateData.resolutionNotes = data.resolutionNotes;
    }
    if (data.status === 'resolved' || data.status === 'rejected') {
      updateData.resolvedAt = new Date();
    }

    const updatedClaim = await db.insuranceClaim.update({
      where: { id: data.claimId },
      data: updateData,
    });

    // Si approuvé, effectuer le remboursement
    if (data.status === 'approved' && data.resolutionAmount) {
      // Créer une notification pour le client
      await db.notification.create({
        data: {
          userId: claim.clientId,
          type: 'system',
          title: 'Réclamation approuvée',
          message: `Votre réclamation a été approuvée. Remboursement de ${data.resolutionAmount.toLocaleString('fr-FR')} FCFA en cours.`,
          actionUrl: `/dashboard/reservations/${claim.reservationId}`,
        },
      });

      // TODO: Intégrer avec le système de paiement pour le remboursement
    }

    return NextResponse.json({
      success: true,
      claim: {
        id: updatedClaim.id,
        status: updatedClaim.status,
        resolutionType: updatedClaim.resolutionType,
        resolutionAmount: updatedClaim.resolutionAmount,
        resolvedAt: updatedClaim.resolvedAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error('Insurance claim update error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}
