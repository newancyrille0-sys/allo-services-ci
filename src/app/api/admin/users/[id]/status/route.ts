import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendNotification } from "@/lib/notifications";

// PATCH /api/admin/users/[id]/status - Update user status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const body = await request.json();
    const { status, reason } = body;

    if (!status || !["ACTIVE", "SUSPENDED", "BANNED"].includes(status)) {
      return NextResponse.json(
        { error: "Statut invalide" },
        { status: 400 }
      );
    }

    // Get current user
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Update user status
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { status },
    });

    // Log the action (could create an admin log entry)
    console.log(`Admin action: User ${userId} status changed to ${status}. Reason: ${reason || "No reason provided"}`);

    // Notify the user
    const statusMessages = {
      ACTIVE: "Votre compte a été réactivé. Vous pouvez maintenant vous connecter.",
      SUSPENDED: `Votre compte a été suspendu. ${reason || "Veuillez contacter le support pour plus d'informations."}`,
      BANNED: `Votre compte a été banni. ${reason || "Cette décision est définitive."}`,
    };

    if (user.email) {
      await sendNotification({
        userId,
        email: user.email || undefined,
        phone: user.phone || undefined,
        title: "Statut de votre compte",
        message: statusMessages[status as keyof typeof statusMessages],
        type: "account_status",
        channels: ["email", "in_app"],
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        status: updatedUser.status,
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
