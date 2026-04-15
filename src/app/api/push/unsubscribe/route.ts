import { NextRequest, NextResponse } from "next/server";
import { unsubscribeFromPush } from "@/lib/notifications/push";

// POST /api/push/unsubscribe - Unsubscribe from push notifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, endpoint } = body;

    if (!userId || !endpoint) {
      return NextResponse.json(
        { error: "userId et endpoint requis" },
        { status: 400 }
      );
    }

    await unsubscribeFromPush(userId, endpoint);

    return NextResponse.json({
      success: true,
      message: "Désabonnement des notifications push réussi",
    });
  } catch (error) {
    console.error("Push unsubscription error:", error);
    return NextResponse.json(
      { error: "Erreur lors du désabonnement des notifications" },
      { status: 500 }
    );
  }
}
