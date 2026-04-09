import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { randomBytes } from "crypto";

// Generate a secure session token
function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

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

    // Create session
    const sessionToken = generateSessionToken();
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires,
      },
    });

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
          badgeVerified: user.provider.badgeVerified,
          averageRating: user.provider.averageRating,
          totalReviews: user.provider.totalReviews,
        }
      : null;

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      message: "Vérification réussie",
      user: userData,
      provider: providerData,
    });

    // Set session cookie
    response.cookies.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification" },
      { status: 500 }
    );
  }
}
