import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ReservationStatus } from '@prisma/client';
import { z } from 'zod';

// Valid state transitions
const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [], // No transitions from completed
  CANCELLED: [], // No transitions from cancelled
  DISPUTED: ['COMPLETED', 'CANCELLED'],
};

const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED']),
  userId: z.string().min(1, 'ID utilisateur requis'),
  reason: z.string().optional(), // For cancellation
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reservationId } = await params;
    const body = await request.json();

    // Validate input
    const validationResult = updateStatusSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Get reservation with relations
    const reservation = await db.reservation.findUnique({
      where: { id: reservationId },
      include: {
        client: true,
        provider: { include: { user: true } },
        service: true,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    // Check authorization
    const isClient = reservation.clientId === data.userId;
    const isProvider = reservation.provider.userId === data.userId;

    if (!isClient && !isProvider) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Validate state transition
    const currentStatus = reservation.status as string;
    const newStatus = data.status;

    if (!VALID_TRANSITIONS[currentStatus]?.includes(newStatus)) {
      return NextResponse.json(
        { error: `Transition de ${currentStatus} vers ${newStatus} non autorisée` },
        { status: 400 }
      );
    }

    // Role-based restrictions
    if (newStatus === 'CONFIRMED' && !isProvider) {
      return NextResponse.json(
        { error: 'Seul le prestataire peut confirmer une réservation' },
        { status: 403 }
      );
    }

    if (newStatus === 'IN_PROGRESS' && !isProvider) {
      return NextResponse.json(
        { error: 'Seul le prestataire peut démarrer une prestation' },
        { status: 403 }
      );
    }

    if (newStatus === 'COMPLETED' && !isProvider) {
      return NextResponse.json(
        { error: 'Seul le prestataire peut marquer une prestation comme terminée' },
        { status: 403 }
      );
    }

    // Update reservation status
    const updatedReservation = await db.reservation.update({
      where: { id: reservationId },
      data: {
        status: newStatus as ReservationStatus,
      },
    });

    // Create notifications based on status change
    if (newStatus === 'CONFIRMED') {
      // Notify client
      await db.notification.create({
        data: {
          userId: reservation.clientId,
          type: 'reservation',
          title: 'Réservation confirmée',
          message: `Votre réservation pour ${reservation.service.name} a été confirmée par ${reservation.provider.businessName || 'le prestataire'}.`,
          actionUrl: `/dashboard/reservations/${reservationId}`,
        },
      });

      // Update provider stats
      await db.provider.update({
        where: { id: reservation.providerId },
        data: {
          totalReservations: { increment: 1 },
        },
      });
    }

    if (newStatus === 'IN_PROGRESS') {
      // Notify client
      await db.notification.create({
        data: {
          userId: reservation.clientId,
          type: 'reservation',
          title: 'Prestation en cours',
          message: `${reservation.provider.businessName || 'Le prestataire'} a commencé la prestation.`,
          actionUrl: `/dashboard/reservations/${reservationId}`,
        },
      });
    }

    if (newStatus === 'COMPLETED') {
      // Notify client to leave a review
      await db.notification.create({
        data: {
          userId: reservation.clientId,
          type: 'reservation',
          title: 'Prestation terminée',
          message: `Votre prestation est terminée. N'oubliez pas de laisser un avis !`,
          actionUrl: `/dashboard/reservations/${reservationId}`,
        },
      });

      // Update provider stats
      await db.provider.update({
        where: { id: reservation.providerId },
        data: {
          totalReservations: { increment: 1 },
        },
      });
    }

    if (newStatus === 'CANCELLED') {
      // Notify the other party
      const notifyUserId = isClient ? reservation.provider.userId : reservation.clientId;
      await db.notification.create({
        data: {
          userId: notifyUserId,
          type: 'reservation',
          title: 'Réservation annulée',
          message: `La réservation pour ${reservation.service.name} a été annulée. ${data.reason ? `Raison: ${data.reason}` : ''}`,
          actionUrl: `/dashboard/reservations/${reservationId}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      reservation: {
        id: updatedReservation.id,
        status: updatedReservation.status,
        updatedAt: updatedReservation.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Reservation status update error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du statut' },
      { status: 500 }
    );
  }
}
