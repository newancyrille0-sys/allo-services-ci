import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { initializePayment, validatePaymentMethod, isValidCIPhone } from '@/lib/payments/cinetpay';
import { z } from 'zod';

// Validation schema
const initiatePaymentSchema = z.object({
  amount: z.number().positive('Le montant doit être positif'),
  currency: z.string().default('XOF'),
  paymentMethod: z.string().min(1, 'Méthode de paiement requise'),
  phone: z.string().optional(),
  userId: z.string().min(1, 'ID utilisateur requis'),
  type: z.enum(['subscription', 'reservation']),
  reservationId: z.string().optional(),
  subscriptionPlan: z.enum(['FREE', 'MONTHLY', 'PREMIUM']).optional(),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = initiatePaymentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Validate payment method and amount
    const methodValidation = validatePaymentMethod(data.paymentMethod, data.amount);
    if (!methodValidation.valid) {
      return NextResponse.json(
        { error: methodValidation.message },
        { status: 400 }
      );
    }

    // Validate phone for mobile money payments
    if (data.paymentMethod !== 'card' && data.paymentMethod !== 'CARD') {
      if (!data.phone) {
        return NextResponse.json(
          { error: 'Numéro de téléphone requis pour le paiement mobile' },
          { status: 400 }
        );
      }
      if (!isValidCIPhone(data.phone)) {
        return NextResponse.json(
          { error: 'Numéro de téléphone invalide' },
          { status: 400 }
        );
      }
    }

    // Verify user exists
    const user = await db.user.findUnique({
      where: { id: data.userId },
      include: { provider: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // For subscription payments, verify provider
    if (data.type === 'subscription') {
      if (!user.provider) {
        return NextResponse.json(
          { error: 'Seuls les prestataires peuvent souscrire' },
          { status: 403 }
        );
      }
    }

    // For reservation payments, verify reservation exists
    if (data.type === 'reservation' && data.reservationId) {
      const reservation = await db.reservation.findUnique({
        where: { id: data.reservationId },
      });

      if (!reservation) {
        return NextResponse.json(
          { error: 'Réservation non trouvée' },
          { status: 404 }
        );
      }

      if (reservation.clientId !== data.userId) {
        return NextResponse.json(
          { error: 'Non autorisé' },
          { status: 403 }
        );
      }
    }

    // Initialize payment with CinetPay
    const paymentResult = await initializePayment({
      amount: data.amount,
      currency: data.currency,
      paymentMethod: data.paymentMethod,
      phone: data.phone,
      userId: data.userId,
      type: data.type,
      description: data.description,
      metadata: {
        reservationId: data.reservationId,
        subscriptionPlan: data.subscriptionPlan,
      },
    });

    // Create payment record in database
    const payment = await db.payment.create({
      data: {
        userId: data.userId,
        reservationId: data.reservationId,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.paymentMethod,
        transactionId: paymentResult.transactionId,
        status: 'pending',
        metadata: JSON.stringify({
          type: data.type,
          subscriptionPlan: data.subscriptionPlan,
          phone: data.phone,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        transactionId: payment.transactionId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentUrl: paymentResult.paymentUrl,
        qrCode: paymentResult.qrCode,
        ussdCode: paymentResult.ussdCode,
      },
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de l\'initialisation du paiement' },
      { status: 500 }
    );
  }
}
