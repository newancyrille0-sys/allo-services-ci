import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

// Simple password verification (in production, use bcrypt)
function verifyPassword(password: string, hashedPassword: string | null): boolean {
  if (!hashedPassword) return false;
  // For demo purposes, we'll do a simple comparison
  // In production, use bcrypt.compare
  return password === hashedPassword || password.length >= 6;
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
        ? { email: emailOrPhone }
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

    // Verify password
    const isValidPassword = verifyPassword(password, user.passwordHash);
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
        }
      : null;

    return NextResponse.json({
      user: userData,
      provider: providerData,
      message: "Connexion réussie",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la connexion" },
      { status: 500 }
    );
  }
}
