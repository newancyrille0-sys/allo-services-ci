import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

// Admin secret codes (in production, this would be in the database)
const ADMIN_SECRET_CODES = [
  "Cy-73-admi-03",
  "Ad-92-super-01",
  "Ma-45-admin-99",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, secretCode } = body;

    if (!email || !password || !secretCode) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Verify secret code
    if (!ADMIN_SECRET_CODES.includes(secretCode)) {
      // Log failed attempt
      console.log(`[SECURITY] Invalid admin secret code attempt: ${email} - ${secretCode}`);
      
      return NextResponse.json(
        { error: "Code secret invalide" },
        { status: 401 }
      );
    }

    // Find admin user
    const user = await db.user.findFirst({
      where: {
        email,
        role: UserRole.ADMIN,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 401 }
      );
    }

    // Verify password (in production, use bcrypt)
    if (user.passwordHash !== password && password.length < 6) {
      return NextResponse.json(
        { error: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    // Return user data
    const userData = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
    };

    return NextResponse.json({
      success: true,
      user: userData,
      message: "Connexion admin réussie",
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la connexion" },
      { status: 500 }
    );
  }
}
