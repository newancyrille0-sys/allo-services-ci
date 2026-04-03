import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPayment } from '@/lib/payments/cinetpay';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paymentId } = await params;

    // Find payment in database
    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        reservation: {
          include: {
            service: { select: { name: true } },
            provider: {
              include: { user: { select: { fullName: true } } },
            },
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Paiement non trouvé' },
        { status: 404 }
      );
    }

    // If payment is still pending, verify with CinetPay
    let verification = null;
    if (payment.status === 'pending') {
      verification = await verifyPayment(payment.transactionId);

      // Update status if changed
      if (verification.status !== payment.status) {
        await db.payment.update({
          where: { id: paymentId },
          data: {
            status: verification.status,
            providerName: verification.paymentMethod,
          },
        });
      }
    }

    return NextResponse.json({
      payment: {
        id: payment.id,
        transactionId: payment.transactionId,
        amount: payment.amount,
        currency: payment.currency,
        status: verification?.status || payment.status,
        paymentMethod: payment.paymentMethod,
        createdAt: payment.createdAt.toISOString(),
        user: payment.user,
        reservation: payment.reservation ? {
          id: payment.reservation.id,
          serviceName: payment.reservation.service?.name,
          providerName: payment.reservation.provider?.user?.fullName,
          date: payment.reservation.scheduledDate.toISOString(),
        } : null,
      },
    });
  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du statut' },
      { status: 500 }
    );
  }
}
