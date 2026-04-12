import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { detectContacts, logContactDetection } from '@/lib/utils/contactDetection';

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

    // ========== ANTI-LEAKAGE: Détection de contacts ==========
    const contactDetection = detectContacts(data.content);
    let finalContent = data.content;
    let warningMessage = '';
    let contactDetected = false;
    let detectionId = null;

    if (contactDetection.hasContact) {
      contactDetected = true;
      
      // Log la détection
      const detectionLog = await db.contactDetectionLog.create({
        data: {
          senderId: data.senderId,
          receiverId: data.receiverId,
          reservationId: data.reservationId || null,
          detectedType: contactDetection.detectedType || 'other',
          detectedPattern: contactDetection.detectedPattern,
          rawContent: data.content,
          maskedContent: contactDetection.maskedContent,
          severity: contactDetection.severity,
          action: contactDetection.severity === 'high' ? 'warn' : 'alert',
        },
      });
      detectionId = detectionLog.id;

      // Déterminer l'action à prendre
      const action = logContactDetection(
        contactDetection,
        data.senderId,
        data.receiverId,
        data.reservationId
      );

      if (action.shouldWarn) {
        warningMessage = contactDetection.warningMessage;
        // Optionnel: masquer le contenu si sévérité haute
        if (contactDetection.severity === 'high') {
          finalContent = contactDetection.maskedContent;
        }
      }

      // Vérifier les récidives
      const previousDetections = await db.contactDetectionLog.count({
        where: {
          senderId: data.senderId,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 derniers jours
          },
        },
      });

      // Mettre à jour le compteur d'occurrences
      await db.contactDetectionLog.update({
        where: { id: detectionLog.id },
        data: { occurrenceCount: previousDetections + 1 },
      });

      // Si récidive multiple, créer un avertissement
      if (previousDetections >= 2 && contactDetection.severity === 'high') {
        await db.userWarning.create({
          data: {
            userId: data.senderId,
            warningType: 'contact_share',
            severity: previousDetections >= 4 ? 'suspension' : 'formal',
            title: 'Rappel des conditions d\'utilisation',
            message: `Vous avez partagé des coordonnées ${previousDetections + 1} fois. Les prestations hors plateforme ne sont pas couvertes par nos garanties.`,
            relatedDetectionId: detectionLog.id,
          },
        });
      }
    }

    // Create message
    const message = await db.message.create({
      data: {
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: finalContent,
        reservationId: data.reservationId,
        isRead: false,
      },
    });

    // Create notification for receiver
    await db.notification.create({
      data: {
        userId: data.receiverId,
        type: contactDetected ? 'system' : 'message',
        title: contactDetected ? 'Message avec avertissement' : 'Nouveau message',
        message: contactDetected 
          ? `${sender.fullName}: ${warningMessage.substring(0, 100)}...`
          : `${sender.fullName}: ${data.content.substring(0, 50)}${data.content.length > 50 ? '...' : ''}`,
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
      // Anti-leakage response
      contactDetected,
      warningMessage: contactDetected ? warningMessage : undefined,
      detectionType: contactDetected ? contactDetection.detectedType : undefined,
      originalContent: contactDetected && contactDetection.severity === 'high' 
        ? data.content 
        : undefined,
    });
  } catch (error) {
    console.error('Message send error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message' },
      { status: 500 }
    );
  }
}
