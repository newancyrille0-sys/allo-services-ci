import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const conversationsSchema = z.object({
  userId: z.string().min(1, 'ID utilisateur requis'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Validate input
    const validationResult = conversationsSchema.safeParse({
      userId: searchParams.get('userId'),
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 20,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { userId, page, limit } = validationResult.data;
    const skip = (page - 1) * limit;

    // Get all conversations where user is sender or receiver
    // We need to find distinct conversation partners

    // Get messages where user is sender
    const sentMessages = await db.message.findMany({
      where: { senderId: userId },
      select: { receiverId: true },
      distinct: ['receiverId'],
    });

    // Get messages where user is receiver
    const receivedMessages = await db.message.findMany({
      where: { receiverId: userId },
      select: { senderId: true },
      distinct: ['senderId'],
    });

    // Combine unique conversation partners
    const partnerIds = new Set<string>();
    sentMessages.forEach((m) => partnerIds.add(m.receiverId));
    receivedMessages.forEach((m) => partnerIds.add(m.senderId));

    // Get last message for each conversation
    const conversations = [];

    for (const partnerId of Array.from(partnerIds)) {
      // Get the other user's info
      const partner = await db.user.findUnique({
        where: { id: partnerId },
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          role: true,
          provider: {
            select: {
              id: true,
              businessName: true,
              isVerified: true,
            },
          },
        },
      });

      if (!partner) continue;

      // Get last message in this conversation
      const lastMessage = await db.message.findFirst({
        where: {
          OR: [
            { senderId: userId, receiverId: partnerId },
            { senderId: partnerId, receiverId: userId },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });

      // Get unread count
      const unreadCount = await db.message.count({
        where: {
          senderId: partnerId,
          receiverId: userId,
          isRead: false,
        },
      });

      conversations.push({
        partner,
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              content: lastMessage.content,
              isRead: lastMessage.isRead,
              isSent: lastMessage.senderId === userId,
              createdAt: lastMessage.createdAt.toISOString(),
            }
          : null,
        unreadCount,
      });
    }

    // Sort by last message date
    conversations.sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
    });

    // Apply pagination
    const paginatedConversations = conversations.slice(skip, skip + limit);

    return NextResponse.json({
      conversations: paginatedConversations,
      pagination: {
        page,
        limit,
        total: conversations.length,
        totalPages: Math.ceil(conversations.length / limit),
      },
    });
  } catch (error) {
    console.error('Conversations fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des conversations' },
      { status: 500 }
    );
  }
}
