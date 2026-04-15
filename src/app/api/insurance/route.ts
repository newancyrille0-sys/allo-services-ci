import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// ==================== INSURANCE CONFIGURATION ====================
// Allo Services Assurance: Si le prestataire fait un mauvais travail, 
// nous envoyons 2 agents qualifiés pour refaire le travail gratuitement

const INSURANCE_CONFIG = {
  // Types de réclamations couvertes
  claimTypes: {
    no_show: {
      label: 'Absence du prestataire',
      description: 'Le prestataire ne s\'est pas présenté à la réservation.',
      agentsSent: 2,
    },
    incomplete: {
      label: 'Travail inachevé',
      description: 'La prestation n\'a pas été correctement terminée.',
      agentsSent: 2,
    },
    bad_quality: {
      label: 'Mauvaise qualité',
      description: 'Le travail effectué ne correspond pas aux standards.',
      agentsSent: 2,
    },
    damage: {
      label: 'Dommages causés',
      description: 'Des dommages ont été causés lors de la prestation.',
      agentsSent: 2,
    },
  },
  
  // Délai maximum pour réclamer (en heures)
  claimDeadlineHours: 48,
  
  // Délai d'intervention des agents (en heures)
  agentsInterventionDelay: 24,
  
  // Messages
  messages: {
    no_show: 'Le prestataire ne s\'est pas présenté. Nous enverrons 2 agents qualifiés gratuitement.',
    incomplete: 'Le travail est inachevé. Nous enverrons 2 agents pour terminer gratuitement.',
    bad_quality: 'La qualité est insuffisante. Nos 2 agents referont le travail gratuitement.',
    damage: 'Des dommages ont été causés. Nos agents répareront gratuitement.',
  },
};

// ==================== SCHEMAS ====================

const createClaimSchema = z.object({
  reservationId: z.string(),
  clientId: z.string(),
  claimType: z.enum(['no_show', 'incomplete', 'bad_quality', 'damage']),
  description: z.string().min(20, 'Description minimum 20 caractères'),
  evidence: z.array(z.string()).optional(), // URLs des preuves (photos, vidéos)
});

const updateClaimSchema = z.object({
  claimId: z.string(),
  status: z.enum(['pending', 'under_review', 'agents_dispatched', 'resolved', 'rejected']),
  resolutionNotes: z.string().optional(),
  agentsAssigned: z.array(z.string()).optional(), // IDs des agents assignés
  scheduledIntervention: z.string().optional(), // Date d'intervention prévue
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
        status: c.status,
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

    // Vérifier le délai de réclamation (48 heures)
    const deadline = new Date(reservation.scheduledDate);
    deadline.setHours(deadline.getHours() + INSURANCE_CONFIG.claimDeadlineHours);

    if (new Date() > deadline) {
      return NextResponse.json(
        { error: `Le délai de réclamation (${INSURANCE_CONFIG.claimDeadlineHours}h) est dépassé` },
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

    // Créer la réclamation
    const claim = await db.insuranceClaim.create({
      data: {
        reservationId: data.reservationId,
        clientId: data.clientId,
        providerId: reservation.providerId,
        claimType: data.claimType,
        description: data.description,
        evidence: data.evidence ? JSON.stringify(data.evidence) : null,
        status: 'pending',
        amount: 0, // Plus de montant - on envoie des agents à la place
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
        status: claim.status,
        createdAt: claim.createdAt.toISOString(),
      },
      message: 'Votre réclamation a été enregistrée. Si elle est validée, nous enverrons 2 agents qualifiés gratuitement pour refaire le travail.',
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

    if (data.resolutionNotes) {
      updateData.resolutionNotes = data.resolutionNotes;
    }
    if (data.agentsAssigned) {
      updateData.resolutionNotes = `Agents assignés: ${data.agentsAssigned.join(', ')}`;
    }
    if (data.scheduledIntervention) {
      updateData.resolutionNotes = (updateData.resolutionNotes || '') + ` | Intervention prévue: ${data.scheduledIntervention}`;
    }
    if (data.status === 'resolved' || data.status === 'rejected') {
      updateData.resolvedAt = new Date();
    }

    const updatedClaim = await db.insuranceClaim.update({
      where: { id: data.claimId },
      data: updateData,
    });

    // Si agents envoyés, notifier le client
    if (data.status === 'agents_dispatched') {
      const claimTypeConfig = INSURANCE_CONFIG.claimTypes[claim.claimType as keyof typeof INSURANCE_CONFIG.claimTypes];
      const agentsCount = claimTypeConfig?.agentsSent || 2;
      
      await db.notification.create({
        data: {
          userId: claim.clientId,
          type: 'system',
          title: 'Agents en route !',
          message: `${agentsCount} agents qualifiés ont été dépêchés pour refaire le travail gratuitement. Intervention prévue sous ${INSURANCE_CONFIG.agentsInterventionDelay}h.`,
          actionUrl: `/client/reservations/${claim.reservationId}`,
        },
      });
    }

    // Si résolu, notifier le client
    if (data.status === 'resolved') {
      await db.notification.create({
        data: {
          userId: claim.clientId,
          type: 'system',
          title: 'Réclamation résolue',
          message: 'Votre réclamation a été résolue. Les agents ont terminé le travail.',
          actionUrl: `/client/reservations/${claim.reservationId}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      claim: {
        id: updatedClaim.id,
        status: updatedClaim.status,
        resolutionNotes: updatedClaim.resolutionNotes,
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
