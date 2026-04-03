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

    if (!status || !["active", "suspended", "banned"].includes(status)) {
      return NextResponse.json(
        { error: "Statut invalide" },
        { status: 400 }
      );
    }

    const userStatusMap: Record<string, UserStatus> = {
      active: UserStatus.ACTIVE,
      suspended: UserStatus.SUSPENDED,
      banned: UserStatus.BANNED,
    };

    // Update provider's user status
    const provider = await db.provider.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Prestataire non trouvé" },
        { status: 404 }
      );
    }

    const user = await db.user.update({
      where: { id: provider.userId },
      data: { status: userStatusMap[status] },
    });

    // Also update provider isActive flag
    await db.provider.update({
      where: { id },
      data: { isActive: status === "active" },
    });

    // Log the action
    console.log(`[ADMIN] Provider ${id} status changed to ${status}. Reason: ${reason || "N/A"}`);

    return NextResponse.json({
      success: true,
      provider: {
        id,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Error updating provider status:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du statut" },
      { status: 500 }
    );
  }
}
