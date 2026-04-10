import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { randomBytes } from "crypto";

// Generate a secure session token
function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp, fullName, role } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Adresse email et code requis" },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find valid OTP code
    const otpRecord = await db.emailOTP.findFirst({
      where: {
        email: normalizedEmail,
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
        { error: "Code invalide ou expiré" },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await db.emailOTP.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    // Find or create user
    let user = await db.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        provider: true,
      },
    });

    // If user doesn't exist, create a new one
    if (!user) {
      // Create new user
      const newUser = await db.user.create({
        data: {
          email: normalizedEmail,
          fullName: fullName || null,
          role: role === "PROVIDER" ? "PROVIDER" : "CLIENT",
          status: "ACTIVE",
          otpVerified: true,
          emailVerified: new Date(),
        },
        include: {
          provider: true,
        },
      });

      // If registering as provider, create provider profile
      if (role === "PROVIDER") {
        await db.provider.create({
          data: {
            userId: newUser.id,
            categories: "[]",
            isActive: false,
          },
        });
      }

      user = await db.user.findUnique({
        where: { id: newUser.id },
        include: {
          provider: true,
        },
      });
    } else {
      // Update user verification status
      await db.user.update({
        where: { id: user.id },
        data: {
          otpVerified: true,
          emailVerified: user.emailVerified || new Date(),
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
    }

    if (!user) {
      return NextResponse.json(
        { error: "Erreur lors de la création du compte" },
        { status: 500 }
      );
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
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      city: user.city,
      country: user.country,
      otpVerified: user.otpVerified,
      trustScore: user.trustScore,
      createdAt: user.createdAt.toISOString(),
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
      message: "Connexion réussie",
      user: userData,
      provider: providerData,
      isNewUser: !otpRecord.userId,
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
    console.error("Email OTP verification error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification" },
      { status: 500 }
    );
  }
}
