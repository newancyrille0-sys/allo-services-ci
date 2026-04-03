import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const messagesSchema = z.object({
  currentUserId: z.string().min(1, 'ID utilisateur actuel requis'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: otherUserId } = await params;
    const { searchParams } = new URL(request.url);

    // Validate input
    const validationResult = messagesSchema.safeParse({
      currentUserId: searchParams.get('currentUserId'),
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 50,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { currentUserId, page, limit } = validationResult.data;
    const skip = (page - 1) * limit;

    // Get other user info
    const otherUser = await db.user.findUnique({
      where: { id: otherUserId },
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

    if (!otherUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Get messages between users
    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId },
        ],
      },
      include: {
        reservation: {
          select: {
            id: true,
            service: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
      skip,
      take: limit,
    });

    // Mark unread messages as read
    await db.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: currentUserId,
        isRead: false,
      },
      data: { isRead: true },
    });

    // Get total count
    const total = await db.message.count({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId },
        ],
      },
    });

    return NextResponse.json({
      otherUser,
      messages: messages.map((m) => ({
        id: m.id,
        content: m.content,
        isRead: m.isRead,
        isSent: m.senderId === currentUserId,
        createdAt: m.createdAt.toISOString(),
        reservation: m.reservation,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Messages fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des messages' },
      { status: 500 }
    );
  }
}
