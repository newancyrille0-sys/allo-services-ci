import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const notificationsSchema = z.object({
  userId: z.string().min(1, 'ID utilisateur requis'),
  type: z.string().optional(), // reservation, payment, system, promo
  unreadOnly: z.coerce.boolean().default(false),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Validate input
    const validationResult = notificationsSchema.safeParse({
      userId: searchParams.get('userId'),
      type: searchParams.get('type') || undefined,
      unreadOnly: searchParams.get('unreadOnly') || false,
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 20,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { userId, type, unreadOnly, page, limit } = validationResult.data;
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: Record<string, unknown> = { userId };
    if (type) whereClause.type = type;
    if (unreadOnly) whereClause.isRead = false;

    // Get notifications
    const notifications = await db.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // Get total count
    const total = await db.notification.count({ where: whereClause });

    // Get unread count
    const unreadCount = await db.notification.count({
      where: { userId, isRead: false },
    });

    return NextResponse.json({
      notifications: notifications.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        isRead: n.isRead,
        actionUrl: n.actionUrl,
        createdAt: n.createdAt.toISOString(),
      })),
      stats: {
        total,
        unreadCount,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Notifications fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des notifications' },
      { status: 500 }
    );
  }
}
