import { NextRequest, NextResponse } from "next/server";
import { subscribeToPush } from "@/lib/notifications/push";

// POST /api/push/subscribe - Subscribe to push notifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, subscription } = body;

    if (!userId || !subscription) {
      return NextResponse.json(
        { error: "userId et subscription requis" },
        { status: 400 }
      );
    }

    await subscribeToPush(userId, subscription);

    return NextResponse.json({
      success: true,
      message: "Abonnement aux notifications push réussi",
    });
  } catch (error) {
    console.error("Push subscription error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'abonnement aux notifications" },
      { status: 500 }
    );
  }
}
