import { NextRequest, NextResponse } from "next/server";
import { sendOTP } from "@/lib/services/yelika-sms";
import { prisma } from "@/lib/prisma";
import { randomInt } from "crypto";

/**
 * POST /api/auth/otp/send
 * Envoie un code OTP par SMS via Yellika
 * 
 * Body:
 * - phone: string - Numéro de téléphone (format ivoirien)
 * - type?: "register" | "login" | "reset" - Type d'OTP
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, type = "register" } = body;

    // Validation du numéro de téléphone
    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Numéro de téléphone requis" },
        { status: 400 }
      );
    }

    // Nettoyer et valider le format
    let cleanPhone = phone.replace(/\s+/g, "").replace(/^00/, "+");
    
    // Convertir au format international si nécessaire
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "+225" + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith("+")) {
      cleanPhone = "+225" + cleanPhone;
    }

    // Vérifier le format (8-10 chiffres après +225)
    const phoneRegex = /^\+225[0-9]{8,10}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: "Format de numéro invalide. Utilisez un numéro ivoirien (ex: 07000000)" },
        { status: 400 }
      );
    }

    // Générer un code OTP à 6 chiffres
    const otpCode = randomInt(100000, 999999).toString();
    
    // Date d'expiration (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Vérifier s'il existe un utilisateur avec ce téléphone
    const existingUser = await prisma.user.findUnique({
      where: { phone: cleanPhone },
    });

    // Pour l'inscription, vérifier que le téléphone n'est pas déjà utilisé
    if (type === "register" && existingUser) {
      return NextResponse.json(
        { success: false, error: "Ce numéro est déjà associé à un compte" },
        { status: 400 }
      );
    }

    // Pour le login/reset, vérifier que le compte existe
    if ((type === "login" || type === "reset") && !existingUser) {
      return NextResponse.json(
        { success: false, error: "Aucun compte associé à ce numéro" },
        { status: 400 }
      );
    }

    // Invalider les anciens codes OTP pour ce téléphone
    await prisma.oTPCode.updateMany({
      where: {
        phone: cleanPhone,
        used: false,
        expiresAt: { gt: new Date() },
      },
      data: { used: true },
    });

    // Créer le nouveau code OTP
    await prisma.oTPCode.create({
      data: {
        phone: cleanPhone,
        code: otpCode,
        expiresAt,
        userId: existingUser?.id,
      },
    });

    // Envoyer le SMS via Yellika
    const smsResult = await sendOTP(cleanPhone, otpCode);

    if (!smsResult.success) {
      console.error("Erreur envoi SMS:", smsResult.error);
      return NextResponse.json(
        { success: false, error: "Erreur lors de l'envoi du SMS. Veuillez réessayer." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Code OTP envoyé avec succès",
      expiresIn: 300, // 5 minutes en secondes
      phone: cleanPhone,
    });

  } catch (error) {
    console.error("Erreur API OTP:", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/auth/otp/verify
 * Vérifie un code OTP
 * 
 * Body:
 * - phone: string - Numéro de téléphone
 * - code: string - Code OTP à 6 chiffres
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, code } = body;

    if (!phone || !code) {
      return NextResponse.json(
        { success: false, error: "Numéro et code requis" },
        { status: 400 }
      );
    }

    // Normaliser le téléphone
    let cleanPhone = phone.replace(/\s+/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "+225" + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith("+")) {
      cleanPhone = "+225" + cleanPhone;
    }

    // Chercher le code OTP valide
    const otpRecord = await prisma.oTPCode.findFirst({
      where: {
        phone: cleanPhone,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: "Code invalide ou expiré" },
        { status: 400 }
      );
    }

    // Marquer le code comme utilisé
    await prisma.oTPCode.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    return NextResponse.json({
      success: true,
      message: "Code vérifié avec succès",
      user: otpRecord.user ? {
        id: otpRecord.user.id,
        phone: otpRecord.user.phone,
        email: otpRecord.user.email,
        fullName: otpRecord.user.fullName,
        role: otpRecord.user.role,
      } : null,
    });

  } catch (error) {
    console.error("Erreur vérification OTP:", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
