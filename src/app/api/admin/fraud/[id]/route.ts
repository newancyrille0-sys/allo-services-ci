import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, resolution, banUser } = body;

    if (action === "resolve") {
      const alert = await db.fraudLog.update({
        where: { id },
        data: { isResolved: true },
      });

      // Log resolution
      console.log(`[ADMIN] Fraud alert ${id} resolved. Resolution: ${resolution || "N/A"}`);

      // Ban user if requested
      if (banUser && alert.userId) {
        await db.user.update({
          where: { id: alert.userId },
          data: { status: "BANNED" },
        });

        console.log(`[ADMIN] User ${alert.userId} banned due to fraud alert ${id}`);
      }

      return NextResponse.json({
        success: true,
        alert: {
          id: alert.id,
          isResolved: alert.isResolved,
        },
      });
    }

    if (action === "investigate") {
      // In a real app, you'd update a status field
      console.log(`[ADMIN] Fraud alert ${id} marked as investigating`);

      return NextResponse.json({
        success: true,
        message: "Alert marked as investigating",
      });
    }

    return NextResponse.json(
      { error: "Action non supportée" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error updating fraud alert:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'alerte" },
      { status: 500 }
    );
  }
}
