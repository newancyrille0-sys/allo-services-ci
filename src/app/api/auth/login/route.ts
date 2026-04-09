import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

// Generate a secure session token
function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailOrPhone, password } = body;

    if (!emailOrPhone || !password) {
      return NextResponse.json(
        { error: "Email/téléphone et mot de passe requis" },
        { status: 400 }
      );
    }

    // Find user by email or phone
    const isEmail = emailOrPhone.includes("@");
    const user = await db.user.findFirst({
      where: isEmail
        ? { email: emailOrPhone.toLowerCase() }
        : { phone: emailOrPhone.replace(/\s/g, "") },
      include: {
        provider: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    // Check if user has a password set
    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "Ce compte n'a pas de mot de passe. Veuillez vous connecter via Google ou réinitialiser votre mot de passe." },
        { status: 401 }
      );
    }

    // Verify password with bcrypt
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    // Check user status
    if (user.status === "BANNED") {
      return NextResponse.json(
        { error: "Ce compte a été banni" },
        { status: 403 }
      );
    }

    if (user.status === "SUSPENDED") {
      return NextResponse.json(
        { error: "Ce compte a été suspendu" },
        { status: 403 }
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

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { emailVerified: user.emailVerified || new Date() },
    });

    // Return user data (without password)
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
      user: userData,
      provider: providerData,
      message: "Connexion réussie",
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
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la connexion" },
      { status: 500 }
    );
  }
}
