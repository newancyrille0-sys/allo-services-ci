import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const historySchema = z.object({
  providerId: z.string().min(1, 'ID prestataire requis'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Validate input
    const validationResult = historySchema.safeParse({
      providerId: searchParams.get('providerId'),
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 10,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { providerId, page, limit } = validationResult.data;
    const skip = (page - 1) * limit;

    // Get provider
    const provider = await db.provider.findUnique({
      where: { id: providerId },
    });

    if (!provider) {
      return NextResponse.json(
        { error: 'Prestataire non trouvé' },
        { status: 404 }
      );
    }

    // Get subscription history
    const subscriptions = await db.subscription.findMany({
      where: { providerId },
      include: {
        provider: {
          select: {
            businessName: true,
            user: {
              select: { fullName: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // Get total count
    const total = await db.subscription.count({
      where: { providerId },
    });

    // Get related payments
    const subscriptionPayments = await db.payment.findMany({
      where: {
        userId: provider.userId,
        metadata: {
          contains: '"type":"subscription"',
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({
      subscriptions: subscriptions.map((sub) => ({
        id: sub.id,
        planName: sub.planName,
        amount: sub.amount,
        currency: sub.currency,
        startDate: sub.startDate.toISOString(),
        endDate: sub.endDate.toISOString(),
        status: sub.status,
        autoRenew: sub.autoRenew,
        createdAt: sub.createdAt.toISOString(),
      })),
      payments: subscriptionPayments.map((payment) => ({
        id: payment.id,
        transactionId: payment.transactionId,
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        status: payment.status,
        createdAt: payment.createdAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Subscription history error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'historique' },
      { status: 500 }
    );
  }
}
