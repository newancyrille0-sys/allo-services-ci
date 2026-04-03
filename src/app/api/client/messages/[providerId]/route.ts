import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/client/messages/[providerId] - Get messages with a provider
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ providerId: string }> }
) {
  try {
    const { providerId } = await params;
    const mockUserId = "client-1";
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Get messages between client and provider
    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: mockUserId, receiverId: providerId },
          { senderId: providerId, receiverId: mockUserId },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Mark messages from provider as read
    await db.message.updateMany({
      where: {
        senderId: providerId,
        receiverId: mockUserId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    // Get provider info
    const provider = await db.user.findUnique({
      where: { id: providerId },
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        provider: {
          select: {
            businessName: true,
          },
        },
      },
    });

    return NextResponse.json({
      messages,
      provider: provider ? {
        id: provider.id,
        name: provider.fullName,
        businessName: provider.provider?.businessName,
        avatar: provider.avatarUrl,
      } : null,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des messages" },
      { status: 500 }
    );
  }
}
