import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const markAllReadSchema = z.object({
  userId: z.string().min(1, 'ID utilisateur requis'),
});

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = markAllReadSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { userId } = validationResult.data;

    // Update all unread notifications for user
    const result = await db.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `${result.count} notification(s) marquée(s) comme lue(s)`,
    });
  } catch (error) {
    console.error('Mark all read error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des notifications' },
      { status: 500 }
    );
  }
}
