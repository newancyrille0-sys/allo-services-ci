import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { randomBytes } from "crypto";
import { sendEmail } from "@/lib/notifications/email";

// Generate a secure reset token
function generateResetToken(): string {
  return randomBytes(32).toString('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone } = body;

    // Require either email or phone
    if (!email && !phone) {
      return NextResponse.json(
        { error: "Email ou téléphone requis" },
        { status: 400 }
      );
    }

    // Find user by email or phone
    const user = await db.user.findFirst({
      where: email
        ? { email: email.toLowerCase() }
        : { phone: phone?.replace(/\s/g, "") },
    });

    // Always return success to prevent user enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Si ce compte existe, vous recevrez un code de réinitialisation",
      });
    }

    // Invalidate any existing reset tokens for this user
    await db.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate new reset token
    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Send reset code via email or SMS
    if (email && user.email) {
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
      
      await sendEmail({
        to: user.email,
        subject: "Réinitialisation de votre mot de passe - Allo Services CI",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #fd7613;">Réinitialisation de mot de passe</h2>
            <p>Bonjour ${user.fullName || 'Utilisateur'},</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
            <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
            <a href="${resetUrl}" style="display: inline-block; background: #fd7613; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
              Réinitialiser mon mot de passe
            </a>
            <p style="color: #666; font-size: 14px;">Ce lien expire dans 1 heure.</p>
            <p style="color: #666; font-size: 14px;">Si vous n'avez pas fait cette demande, ignorez cet email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
            <p style="color: #999; font-size: 12px;">Allo Services CI - Votre plateforme de services en Côte d'Ivoire</p>
          </div>
        `,
      });
    }

    // For phone, we could send SMS with a short code
    // For now, we'll return the token in development
    const response: { success: boolean; message: string; devToken?: string } = {
      success: true,
      message: "Si ce compte existe, vous recevrez un code de réinitialisation",
    };

    // In development, return the token for testing
    if (process.env.NODE_ENV !== "production") {
      response.devToken = token;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la demande de réinitialisation" },
      { status: 500 }
    );
  }
}
