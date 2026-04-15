import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Validation schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token requis"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string().min(6, "Confirmation requise"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = resetPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const { token, password } = validationResult.data;

    // Find valid reset token
    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Token invalide ou expiré" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (resetToken.expiresAt < new Date()) {
      await db.passwordResetToken.delete({ where: { id: resetToken.id } });
      return NextResponse.json(
        { error: "Token expiré. Veuillez faire une nouvelle demande." },
        { status: 400 }
      );
    }

    // Check if token was already used
    if (resetToken.used) {
      return NextResponse.json(
        { error: "Ce token a déjà été utilisé" },
        { status: 400 }
      );
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 12);

    // Update user password and mark token as used
    await db.$transaction([
      db.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      db.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true, usedAt: new Date() },
      }),
    ]);

    // Delete all other sessions for this user (security)
    await db.session.deleteMany({
      where: { userId: resetToken.userId },
    });

    return NextResponse.json({
      success: true,
      message: "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la réinitialisation du mot de passe" },
      { status: 500 }
    );
  }
}

// Verify token endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "Token requis" },
        { status: 400 }
      );
    }

    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json({ valid: false, error: "Token invalide" });
    }

    if (resetToken.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, error: "Token expiré" });
    }

    if (resetToken.used) {
      return NextResponse.json({ valid: false, error: "Token déjà utilisé" });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("Verify token error:", error);
    return NextResponse.json(
      { valid: false, error: "Erreur de vérification" },
      { status: 500 }
    );
  }
}
