import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { UserStatus } from "@prisma/client";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, reason } = body;

    if (!status || !Object.values(UserStatus).includes(status)) {
      return NextResponse.json(
        { error: "Statut invalide" },
        { status: 400 }
      );
    }

    // Update user status
    const user = await db.user.update({
      where: { id },
      data: { status: status as UserStatus },
    });

    // Log the action (in a real app, you'd have an audit log)
    console.log(`[ADMIN] User ${id} status changed to ${status}. Reason: ${reason || "N/A"}`);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du statut" },
      { status: 500 }
    );
  }
}
