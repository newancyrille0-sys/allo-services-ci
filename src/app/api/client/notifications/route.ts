import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/client/notifications - List notifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const mockUserId = "client-1";

    const where: Record<string, unknown> = {
      userId: mockUserId,
    };

    if (type && type !== "all") {
      where.type = type;
    }

    const notifications = await db.notification.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await db.notification.count({ where });
    const unread = await db.notification.count({
      where: {
        ...where,
        isRead: false,
      },
    });

    return NextResponse.json({
      notifications,
      unreadCount: unread,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des notifications" },
      { status: 500 }
    );
  }
}

// PUT /api/client/notifications - Mark notifications as read
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, markAllAsRead } = body;
    const mockUserId = "client-1";

    if (markAllAsRead) {
      // Mark all notifications as read
      await db.notification.updateMany({
        where: {
          userId: mockUserId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Toutes les notifications ont été marquées comme lues",
      });
    }

    if (notificationId) {
      // Mark specific notification as read
      const notification = await db.notification.update({
        where: {
          id: notificationId,
          userId: mockUserId,
        },
        data: {
          isRead: true,
        },
      });

      return NextResponse.json(notification);
    }

    return NextResponse.json(
      { error: "Aucune action spécifiée" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la notification" },
      { status: 500 }
    );
  }
}
