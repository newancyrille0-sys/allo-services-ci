import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { initializePayment, validatePaymentMethod, calculateCommission } from '@/lib/payments/cinetpay';
import { z } from 'zod';

const paymentSchema = z.object({
  userId: z.string().min(1, 'ID utilisateur requis'),
  paymentMethod: z.string().min(1, 'Méthode de paiement requise'),
  phone: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reservationId } = await params;
    const body = await request.json();

    // Validate input
    const validationResult = paymentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Get reservation
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

    // Verify user is the client
    if (reservation.clientId !== data.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Check if already paid
    if (reservation.paymentStatus === 'paid') {
      return NextResponse.json(
        { error: 'Cette réservation a déjà été payée' },
        { status: 400 }
      );
    }

    const amount = reservation.priceTotal;

    // Validate payment method
    const methodValidation = validatePaymentMethod(data.paymentMethod, amount);
    if (!methodValidation.valid) {
      return NextResponse.json(
        { error: methodValidation.message },
        { status: 400 }
      );
    }

    // Calculate commission breakdown
    const { providerAmount, platformFee } = calculateCommission(amount);

    // Initialize payment
    const paymentResult = await initializePayment({
      amount,
      currency: 'XOF',
      paymentMethod: data.paymentMethod,
      phone: data.phone,
      userId: data.userId,
      type: 'reservation',
      description: `Paiement réservation #${reservationId.slice(-6).toUpperCase()} - ${reservation.service.name}`,
      metadata: {
        reservationId,
        providerId: reservation.providerId,
        providerAmount,
        platformFee,
      },
    });

    // Create payment record
    const payment = await db.payment.create({
      data: {
        userId: data.userId,
        reservationId,
        amount,
        currency: 'XOF',
        paymentMethod: data.paymentMethod,
        transactionId: paymentResult.transactionId,
        status: 'pending',
        metadata: JSON.stringify({
          type: 'reservation',
          reservationId,
          providerId: reservation.providerId,
          providerAmount,
          platformFee,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        transactionId: payment.transactionId,
        amount,
        currency: 'XOF',
        status: 'pending',
        breakdown: {
          total: amount,
          providerAmount,
          platformFee,
          commissionRate: '15%',
        },
        paymentUrl: paymentResult.paymentUrl,
        ussdCode: paymentResult.ussdCode,
      },
    });
  } catch (error) {
    console.error('Reservation payment error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de l\'initialisation du paiement' },
      { status: 500 }
    );
  }
}
