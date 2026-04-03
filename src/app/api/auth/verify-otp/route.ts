import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, otp } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Numéro de téléphone et code OTP requis" },
        { status: 400 }
      );
    }

    // Normalize phone number
    const normalizedPhone = phone.replace(/\s/g, "");

    // Find valid OTP code
    const otpRecord = await db.oTPCode.findFirst({
      where: {
        phone: normalizedPhone,
        code: otp,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Code OTP invalide ou expiré" },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await db.oTPCode.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    // Find user by phone
    const user = await db.user.findFirst({
      where: { phone: normalizedPhone },
      include: {
        provider: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé. Veuillez vous inscrire d'abord." },
        { status: 404 }
      );
    }

    // Update user verification status
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        otpVerified: true,
        status: "ACTIVE",
      },
    });

    // If provider, activate their profile
    if (user.provider) {
      await db.provider.update({
        where: { id: user.provider.id },
        data: {
          isActive: true,
        },
      });
    }

    // Return user data
    const userData = {
      id: updatedUser.id,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      status: updatedUser.status,
      fullName: updatedUser.fullName,
      avatarUrl: updatedUser.avatarUrl,
      city: updatedUser.city,
      country: updatedUser.country,
      otpVerified: updatedUser.otpVerified,
      trustScore: updatedUser.trustScore,
      createdAt: updatedUser.createdAt.toISOString(),
    };

    const providerData = user.provider
      ? {
          id: user.provider.id,
          businessName: user.provider.businessName,
          isVerified: user.provider.isVerified,
          kycStatus: user.provider.kycStatus,
          subscriptionStatus: user.provider.subscriptionStatus,
        }
      : null;

    return NextResponse.json({
      success: true,
      message: "Vérification réussie",
      user: userData,
      provider: providerData,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification" },
      { status: 500 }
    );
  }
}
