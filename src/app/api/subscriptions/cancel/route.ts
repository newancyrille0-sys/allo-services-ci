import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const cancelSubscriptionSchema = z.object({
  providerId: z.string().min(1, 'ID prestataire requis'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = cancelSubscriptionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Get provider
    const provider = await db.provider.findUnique({
      where: { id: data.providerId },
    });

    if (!provider) {
      return NextResponse.json(
        { error: 'Prestataire non trouvé' },
        { status: 404 }
      );
    }

    // Check if provider has an active subscription
    if (provider.subscriptionStatus === 'FREE') {
      return NextResponse.json(
        { error: 'Aucun abonnement à annuler' },
        { status: 400 }
      );
    }

    // Update subscription to not auto-renew
    // The subscription will remain active until expiration date
    await db.provider.update({
      where: { id: data.providerId },
      data: {
        // Note: We don't change subscriptionStatus here - that happens on expiration
        // We would need an autoRenew field on Provider model for this
      },
    });

    // Update any active subscription records
    await db.subscription.updateMany({
      where: {
        providerId: data.providerId,
        status: 'active',
      },
      data: {
        autoRenew: false,
      },
    });

    // Create notification
    await db.notification.create({
      data: {
        userId: provider.userId,
        type: 'system',
        title: 'Abonnement annulé',
        message: 'Votre abonnement ne sera pas renouvelé automatiquement. Vous pourrez continuer à utiliser les fonctionnalités jusqu\'à la date d\'expiration.',
        actionUrl: '/dashboard/subscription',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Auto-renouvellement désactivé. Votre abonnement restera actif jusqu\'à la date d\'expiration.',
      subscription: {
        status: provider.subscriptionStatus,
        expiresAt: provider.subscriptionExpiresAt?.toISOString(),
        autoRenew: false,
      },
    });
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'annulation de l\'abonnement' },
      { status: 500 }
    );
  }
}
