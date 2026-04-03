import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSubscriptionPrice, initializePayment, validatePaymentMethod } from '@/lib/payments/cinetpay';
import { SUBSCRIPTION_PLANS } from '@/lib/constants/subscription';
import { z } from 'zod';

const renewSubscriptionSchema = z.object({
  providerId: z.string().min(1, 'ID prestataire requis'),
  paymentMethod: z.string().min(1, 'Méthode de paiement requise'),
  phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = renewSubscriptionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Get provider with user
    const provider = await db.provider.findUnique({
      where: { id: data.providerId },
      include: { user: true },
    });

    if (!provider) {
      return NextResponse.json(
        { error: 'Prestataire non trouvé' },
        { status: 404 }
      );
    }

    // Check current subscription status
    if (provider.subscriptionStatus === 'FREE') {
      return NextResponse.json(
        { error: 'Aucun abonnement actif à renouveler. Veuillez créer un nouvel abonnement.' },
        { status: 400 }
      );
    }

    // Get current plan price
    const plan = provider.subscriptionStatus as 'MONTHLY' | 'PREMIUM';
    const amount = getSubscriptionPrice(plan);

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Plan invalide' },
        { status: 400 }
      );
    }

    // Validate payment method
    const methodValidation = validatePaymentMethod(data.paymentMethod, amount);
    if (!methodValidation.valid) {
      return NextResponse.json(
        { error: methodValidation.message },
        { status: 400 }
      );
    }

    // Initialize payment
    const paymentResult = await initializePayment({
      amount,
      currency: 'XOF',
      paymentMethod: data.paymentMethod,
      phone: data.phone,
      userId: provider.userId,
      type: 'subscription',
      description: `Renouvellement abonnement ${SUBSCRIPTION_PLANS[plan].name} - Allo Services CI`,
      metadata: {
        plan,
        isRenewal: true,
        providerId: data.providerId,
      },
    });

    // Create pending payment record
    const payment = await db.payment.create({
      data: {
        userId: provider.userId,
        amount,
        currency: 'XOF',
        paymentMethod: data.paymentMethod,
        transactionId: paymentResult.transactionId,
        status: 'pending',
        metadata: JSON.stringify({
          type: 'subscription',
          plan,
          isRenewal: true,
          providerId: data.providerId,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      subscription: {
        plan,
        amount,
        currency: 'XOF',
      },
      payment: {
        id: payment.id,
        transactionId: payment.transactionId,
        status: 'pending',
        paymentUrl: paymentResult.paymentUrl,
        ussdCode: paymentResult.ussdCode,
      },
    });
  } catch (error) {
    console.error('Subscription renewal error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors du renouvellement' },
      { status: 500 }
    );
  }
}
