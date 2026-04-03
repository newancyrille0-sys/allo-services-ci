import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/client/messages - List conversations
export async function GET(request: NextRequest) {
  try {
    const mockUserId = "client-1";

    // Get all unique conversations (providers the client has messaged)
    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: mockUserId },
          { receiverId: mockUserId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        receiver: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Group by conversation partner
    const conversationsMap = new Map<string, {
      providerId: string;
      providerName: string;
      providerAvatar: string | null;
      lastMessage: string;
      lastMessageTime: Date;
      unreadCount: number;
    }>();

    messages.forEach((msg) => {
      const partnerId = msg.senderId === mockUserId ? msg.receiverId : msg.senderId;
      const partner = msg.senderId === mockUserId ? msg.receiver : msg.sender;
      const isUnread = msg.receiverId === mockUserId && !msg.isRead;

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          providerId: partnerId,
          providerName: partner.fullName,
          providerAvatar: partner.avatarUrl,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unreadCount: isUnread ? 1 : 0,
        });
      } else {
        const conv = conversationsMap.get(partnerId)!;
        if (isUnread) {
          conv.unreadCount += 1;
        }
      }
    });

    const conversations = Array.from(conversationsMap.values());

    return NextResponse.json({
      conversations,
      totalUnread: conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des conversations" },
      { status: 500 }
    );
  }
}

// POST /api/client/messages - Send a message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { receiverId, content, reservationId } = body;
    const mockUserId = "client-1";

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: "Destinataire et contenu requis" },
        { status: 400 }
      );
    }

    const message = await db.message.create({
      data: {
        senderId: mockUserId,
        receiverId,
        content,
        reservationId,
        isRead: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}
