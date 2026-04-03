import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const sendMessageSchema = z.object({
  senderId: z.string().min(1, 'ID expéditeur requis'),
  receiverId: z.string().min(1, 'ID destinataire requis'),
  content: z.string().min(1, 'Message requis').max(2000, 'Message trop long'),
  reservationId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = sendMessageSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Verify sender exists
    const sender = await db.user.findUnique({
      where: { id: data.senderId },
    });

    if (!sender) {
      return NextResponse.json(
        { error: 'Expéditeur non trouvé' },
        { status: 404 }
      );
    }

    // Verify receiver exists
    const receiver = await db.user.findUnique({
      where: { id: data.receiverId },
    });

    if (!receiver) {
      return NextResponse.json(
        { error: 'Destinataire non trouvé' },
        { status: 404 }
      );
    }

    // Verify reservation if provided
    if (data.reservationId) {
      const reservation = await db.reservation.findUnique({
        where: { id: data.reservationId },
      });

      if (!reservation) {
        return NextResponse.json(
          { error: 'Réservation non trouvée' },
          { status: 404 }
        );
      }
    }

    // Create message
    const message = await db.message.create({
      data: {
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content,
        reservationId: data.reservationId,
        isRead: false,
      },
    });

    // Create notification for receiver
    await db.notification.create({
      data: {
        userId: data.receiverId,
        type: 'system',
        title: 'Nouveau message',
        message: `${sender.fullName}: ${data.content.substring(0, 50)}${data.content.length > 50 ? '...' : ''}`,
        actionUrl: `/dashboard/messages/${data.senderId}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: {
        id: message.id,
        content: message.content,
        isRead: message.isRead,
        isSent: true,
        createdAt: message.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Message send error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message' },
      { status: 500 }
    );
  }
}
