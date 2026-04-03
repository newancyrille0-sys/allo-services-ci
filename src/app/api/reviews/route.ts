import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// Validation schema for creating review
const createReviewSchema = z.object({
  reservationId: z.string().min(1, 'ID réservation requis'),
  clientId: z.string().min(1, 'ID client requis'),
  rating: z.number().int().min(1).max(5, 'La note doit être entre 1 et 5'),
  comment: z.string().max(500, 'Commentaire trop long (max 500 caractères)').optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = createReviewSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Get reservation
    const reservation = await db.reservation.findUnique({
      where: { id: data.reservationId },
      include: {
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

    // Verify client ownership
    if (reservation.clientId !== data.clientId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Verify reservation is completed
    if (reservation.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Vous ne pouvez laisser un avis que sur une prestation terminée' },
        { status: 400 }
      );
    }

    // Check if review already exists
    const existingReview = await db.review.findUnique({
      where: { reservationId: data.reservationId },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'Un avis a déjà été laissé pour cette réservation' },
        { status: 400 }
      );
    }

    // Create review
    const review = await db.review.create({
      data: {
        reservationId: data.reservationId,
        clientId: data.clientId,
        providerId: reservation.providerId,
        rating: data.rating,
        comment: data.comment,
        isVisible: true,
      },
      include: {
        client: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
      },
    });

    // Update provider rating
    await updateProviderRating(reservation.providerId);

    // Create notification for provider
    await db.notification.create({
      data: {
        userId: reservation.provider.userId,
        type: 'system',
        title: 'Nouvel avis reçu',
        message: `Vous avez reçu un avis ${data.rating}/5 pour ${reservation.service.name}.`,
        actionUrl: `/dashboard/reviews`,
      },
    });

    return NextResponse.json({
      success: true,
      review: {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        isVisible: review.isVisible,
        createdAt: review.createdAt.toISOString(),
        client: review.client,
      },
    });
  } catch (error) {
    console.error('Review creation error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'avis' },
      { status: 500 }
    );
  }
}

// GET endpoint to list reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');
    const clientId = searchParams.get('clientId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: Record<string, unknown> = { isVisible: true };
    if (providerId) whereClause.providerId = providerId;
    if (clientId) whereClause.clientId = clientId;

    // Get reviews
    const reviews = await db.review.findMany({
      where: whereClause,
      include: {
        client: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        reservation: {
          include: {
            service: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // Get total count
    const total = await db.review.count({ where: whereClause });

    // Get rating distribution
    const ratingDistribution = await db.review.groupBy({
      by: ['rating'],
      where: whereClause,
      _count: true,
    });

    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };
    ratingDistribution.forEach((r) => {
      distribution[r.rating as keyof typeof distribution] = r._count;
    });

    // Calculate average rating
    const avgRating = await db.review.aggregate({
      where: whereClause,
      _avg: { rating: true },
    });

    return NextResponse.json({
      reviews: reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        isVisible: r.isVisible,
        createdAt: r.createdAt.toISOString(),
        client: r.client,
        service: r.reservation.service,
      })),
      stats: {
        total,
        averageRating: avgRating._avg.rating || 0,
        distribution,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Reviews fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des avis' },
      { status: 500 }
    );
  }
}

// Helper function to update provider rating
async function updateProviderRating(providerId: string) {
  const stats = await db.review.aggregate({
    where: { providerId, isVisible: true },
    _avg: { rating: true },
    _count: true,
  });

  await db.provider.update({
    where: { id: providerId },
    data: {
      averageRating: stats._avg.rating || 0,
      totalReviews: stats._count,
    },
  });
}
