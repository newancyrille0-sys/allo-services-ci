import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { UserRole, SubscriptionPlan } from "@prisma/client";

// Generate a simple OTP code
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Simple password hashing (in production, use bcrypt)
function hashPassword(password: string): string {
  // For demo purposes, we'll store the password as-is
  // In production, use bcrypt.hash
  return password;
}

export async function POST(request: NextRequest) {
  try {
    // Check if the request is multipart/form-data or JSON
    const contentType = request.headers.get("content-type") || "";
    let data: Record<string, unknown>;
    let files: { cniFile?: File; registreCommerceFile?: File; profilePhotoFile?: File } = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      data = {};
      
      // Extract text fields
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          files[key as keyof typeof files] = value;
        } else {
          data[key] = value;
        }
      }
    } else {
      data = await request.json();
    }

    const {
      fullName,
      phone,
      email,
      password,
      role = "CLIENT",
      // Provider fields
      businessName,
      description,
      categories,
      hourlyRate,
      city,
      address,
      subscriptionPlan,
    } = data;

    // Validate required fields
    if (!fullName || !phone || !password) {
      return NextResponse.json(
        { error: "Nom, téléphone et mot de passe requis" },
        { status: 400 }
      );
    }

    if (role === "PROVIDER") {
      if (!businessName || !description || !categories || !hourlyRate || !city || !address) {
        return NextResponse.json(
          { error: "Tous les champs professionnels sont requis" },
          { status: 400 }
        );
      }
    }

    // Normalize phone number
    const normalizedPhone = phone.replace(/\s/g, "");

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { phone: normalizedPhone },
          ...(email ? [{ email }] : []),
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec ce numéro ou email" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = hashPassword(password);

    // Generate OTP for verification
    const otp = generateOTP();
    console.log(`[DEV] OTP for ${normalizedPhone}: ${otp}`);

    // Create user
    const user = await db.user.create({
      data: {
        fullName,
        phone: normalizedPhone,
        email: email || null,
        passwordHash,
        role: role as UserRole,
        status: "PENDING_VERIFICATION",
        otpVerified: false,
        city: city || null,
      },
    });

    // If provider, create provider profile
    if (role === "PROVIDER") {
      // Handle file uploads (in production, upload to cloud storage)
      const kycDocuments: string[] = [];
      if (files.cniFile) {
        kycDocuments.push(`cni_${user.id}`);
      }
      if (files.registreCommerceFile) {
        kycDocuments.push(`registre_${user.id}`);
      }
      if (files.profilePhotoFile) {
        kycDocuments.push(`profile_${user.id}`);
      }

      await db.provider.create({
        data: {
          userId: user.id,
          businessName: businessName as string,
          description: description as string,
          categories: categories as string,
          hourlyRate: parseFloat(hourlyRate as string),
          subscriptionStatus: (subscriptionPlan || "FREE") as SubscriptionPlan,
          kycDocuments: JSON.stringify(kycDocuments),
          isActive: false,
        },
      });
    }

    // In production, send OTP via SMS
    // For now, we just log it
    console.log(`[SMS] Sending OTP ${otp} to ${normalizedPhone}`);

    return NextResponse.json({
      success: true,
      message: "Inscription réussie. Vérifiez votre téléphone pour le code OTP.",
      userId: user.id,
      // In development, return the OTP
      ...(process.env.NODE_ENV === "development" && { devOTP: otp }),
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}
