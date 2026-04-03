import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPayment, processWebhook } from '@/lib/payments/cinetpay';

/**
 * CinetPay Webhook Handler
 * This endpoint receives payment notifications from CinetPay
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Process webhook data
    const webhookResult = await processWebhook(body);

    if (!webhookResult.success || !webhookResult.transactionId) {
      return NextResponse.json(
        { error: webhookResult.error || 'Invalid webhook data' },
        { status: 400 }
      );
    }

    const transactionId = webhookResult.transactionId;

    // Find payment by transaction ID
    const payment = await db.payment.findUnique({
      where: { transactionId },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Skip if already processed
    if (payment.status === 'success') {
      return NextResponse.json({ success: true, message: 'Already processed' });
    }

    // Verify payment with CinetPay
    const verification = await verifyPayment(transactionId);

    // Update payment status
    await db.payment.update({
      where: { transactionId },
      data: {
        status: verification.status,
        providerName: verification.paymentMethod,
      },
    });

    // If payment successful, process based on type
    if (verification.status === 'success') {
      const metadata = payment.metadata ? JSON.parse(payment.metadata) : {};

      // Handle subscription payment
      if (metadata.type === 'subscription') {
        await handleSubscriptionPayment(payment.userId, metadata.subscriptionPlan, payment.amount);
      }

      // Handle reservation payment
      if (metadata.type === 'reservation' && payment.reservationId) {
        await handleReservationPayment(payment.reservationId);
      }

      // Create notification for user
      await db.notification.create({
        data: {
          userId: payment.userId,
          type: 'payment',
          title: 'Paiement confirmé',
          message: `Votre paiement de ${payment.amount.toLocaleString()} FCFA a été confirmé avec succès.`,
          actionUrl: '/dashboard',
        },
      });
    } else if (verification.status === 'failed') {
      // Create notification for failed payment
      await db.notification.create({
        data: {
          userId: payment.userId,
          type: 'payment',
          title: 'Paiement échoué',
          message: `Votre paiement de ${payment.amount.toLocaleString()} FCFA a échoué. Veuillez réessayer.`,
          actionUrl: '/dashboard',
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful subscription payment
 */
async function handleSubscriptionPayment(
  userId: string,
  plan: string | undefined,
  amount: number
) {
  if (!plan || plan === 'FREE') return;

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { provider: true },
  });

  if (!user?.provider) return;

  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

  // Create subscription record
  await db.subscription.create({
    data: {
      providerId: user.provider.id,
      planName: plan as 'MONTHLY' | 'PREMIUM',
      amount,
      currency: 'XOF',
      startDate,
      endDate,
      status: 'active',
      autoRenew: false,
    },
  });

  // Update provider subscription status
  await db.provider.update({
    where: { id: user.provider.id },
    data: {
      subscriptionStatus: plan as 'MONTHLY' | 'PREMIUM',
      subscriptionExpiresAt: endDate,
      badgeVerified: true,
    },
  });
}

/**
 * Handle successful reservation payment
 */
async function handleReservationPayment(reservationId: string) {
  // Update reservation payment status
  await db.reservation.update({
    where: { id: reservationId },
    data: {
      paymentStatus: 'paid',
    },
  });

  // Get reservation details for notification
  const reservation = await db.reservation.findUnique({
    where: { id: reservationId },
    include: {
      client: true,
      provider: { include: { user: true } },
      service: true,
    },
  });

  if (reservation) {
    // Notify provider
    await db.notification.create({
      data: {
        userId: reservation.provider.user.id,
        type: 'reservation',
        title: 'Paiement reçu',
        message: `Le client a payé ${reservation.priceTotal.toLocaleString()} FCFA pour la réservation #${reservationId.slice(-6).toUpperCase()}.`,
        actionUrl: `/dashboard/reservations/${reservationId}`,
      },
    });
  }
}
