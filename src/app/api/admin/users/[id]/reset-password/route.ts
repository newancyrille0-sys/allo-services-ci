import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { randomBytes } from "crypto";

// POST /api/admin/users/[id]/reset-password - Reset user password
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    // Get user
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    if (!user.email) {
      return NextResponse.json(
        { error: "Cet utilisateur n'a pas d'adresse email" },
        { status: 400 }
      );
    }

    // Invalidate any existing reset tokens
    await db.passwordResetToken.deleteMany({
      where: { userId },
    });

    // Generate new reset token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.passwordResetToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });

    // In production, send email with reset link
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;

    console.log(`Password reset for user ${userId}: ${resetUrl}`);

    return NextResponse.json({
      success: true,
      message: "Email de réinitialisation envoyé",
      // In development, return the reset URL
      ...(process.env.NODE_ENV !== "production" && { resetUrl }),
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Erreur lors de la réinitialisation du mot de passe" },
      { status: 500 }
    );
  }
}
