import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { target, targetUserId, type, title, message, actionUrl } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: "Le titre et le message sont requis" },
        { status: 400 }
      );
    }

    // Determine target users
    let userIds: string[] = [];

    if (target === "specific" && targetUserId) {
      // Single user
      userIds = [targetUserId];
    } else if (target === "all") {
      // All users
      const users = await db.user.findMany({
        where: { status: "ACTIVE" },
        select: { id: true },
      });
      userIds = users.map((u) => u.id);
    } else if (target === "clients") {
      // All clients
      const users = await db.user.findMany({
        where: { role: "CLIENT", status: "ACTIVE" },
        select: { id: true },
      });
      userIds = users.map((u) => u.id);
    } else if (target === "providers") {
      // All providers
      const providers = await db.provider.findMany({
        where: { isActive: true },
        select: { userId: true },
      });
      userIds = providers.map((p) => p.userId);
    }

    // Create notifications for all target users
    const notifications = await db.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        type: type || "system",
        title,
        message,
        actionUrl,
      })),
    });

    return NextResponse.json({
      success: true,
      recipientCount: notifications.count,
      message: `Notification envoyée à ${notifications.count} utilisateur(s)`,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de la notification" },
      { status: 500 }
    );
  }
}
