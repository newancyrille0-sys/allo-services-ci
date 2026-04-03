import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSubscriptionPrice, initializePayment, validatePaymentMethod } from '@/lib/payments/cinetpay';
import { SUBSCRIPTION_PLANS } from '@/lib/constants/subscription';
import { z } from 'zod';

const createSubscriptionSchema = z.object({
  providerId: z.string().min(1, 'ID prestataire requis'),
  plan: z.enum(['MONTHLY', 'PREMIUM']),
  paymentMethod: z.string().min(1, 'Méthode de paiement requise'),
  phone: z.string().optional(),
  autoRenew: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = createSubscriptionSchema.safeParse(body);
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

    // Check if provider already has an active subscription
    if (provider.subscriptionStatus !== 'FREE' && provider.subscriptionExpiresAt) {
      const now = new Date();
      if (new Date(provider.subscriptionExpiresAt) > now) {
        return NextResponse.json(
          { error: 'Vous avez déjà un abonnement actif' },
          { status: 400 }
        );
      }
    }

    // Get plan price
    const amount = getSubscriptionPrice(data.plan);
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
      description: `Abonnement ${SUBSCRIPTION_PLANS[data.plan].name} - Allo Services CI`,
      metadata: {
        plan: data.plan,
        autoRenew: data.autoRenew,
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
          plan: data.plan,
          autoRenew: data.autoRenew,
          providerId: data.providerId,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      subscription: {
        plan: data.plan,
        amount,
        currency: 'XOF',
        autoRenew: data.autoRenew,
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
    console.error('Subscription creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de la création de l\'abonnement' },
      { status: 500 }
    );
  }
}
