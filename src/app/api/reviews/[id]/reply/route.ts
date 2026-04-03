import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// We need to add reply fields to the Review model
// For now, we'll handle this in metadata or a separate table

const replySchema = z.object({
  providerId: z.string().min(1, 'ID prestataire requis'),
  reply: z.string().min(1, 'Réponse requise').max(300, 'Réponse trop longue (max 300 caractères)'),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reviewId } = await params;
    const body = await request.json();

    // Validate input
    const validationResult = replySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Get review
    const review = await db.review.findUnique({
      where: { id: reviewId },
      include: {
        reservation: { include: { service: true } },
        client: { select: { id: true, fullName: true } },
      },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Avis non trouvé' },
        { status: 404 }
      );
    }

    // Verify provider ownership
    if (review.providerId !== data.providerId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Update review with reply
    // Since we don't have a dedicated reply field, we store it in a metadata-like format
    // In a real implementation, you'd add a 'providerReply' and 'providerReplyAt' field to Review model

    // For now, we'll create a notification for the client
    await db.notification.create({
      data: {
        userId: review.clientId,
        type: 'system',
        title: 'Réponse à votre avis',
        message: `${review.reservation.service.name}: ${data.reply}`,
        actionUrl: `/dashboard/reservations/${review.reservationId}`,
      },
    });

    // In production, you would update the review:
    // await db.review.update({
    //   where: { id: reviewId },
    //   data: {
    //     providerReply: data.reply,
    //     providerReplyAt: new Date(),
    //   },
    // });

    return NextResponse.json({
      success: true,
      message: 'Réponse envoyée avec succès',
      reply: {
        reviewId,
        reply: data.reply,
        repliedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Review reply error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de la réponse' },
      { status: 500 }
    );
  }
}
