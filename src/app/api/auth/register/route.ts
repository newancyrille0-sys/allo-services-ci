import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { UserRole, SubscriptionPlan } from "@prisma/client";
import bcrypt from "bcryptjs";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { sendSMS } from "@/lib/sms";

// Generate a secure OTP code
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Upload file to disk
async function uploadFile(file: File, type: "images" | "documents"): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public", "uploads", type);
  
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split(".").pop() || "jpg";
  const fileName = `${timestamp}-${randomString}.${extension}`;
  const filePath = path.join(uploadDir, fileName);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filePath, buffer);

  return `/uploads/${type}/${fileName}`;
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let data: Record<string, string>;
    let files: { cniFile?: File; registreCommerceFile?: File; profilePhotoFile?: File } = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      data = {};
      
      for (const [key, value] of formData.entries()) {
        if (value instanceof File && value.size > 0) {
          files[key as keyof typeof files] = value;
        } else if (typeof value === "string") {
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

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
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
    
    // Validate phone format
    if (!/^(\+225|0)?[0-9]{8,10}$/.test(normalizedPhone)) {
      return NextResponse.json(
        { error: "Format de numéro de téléphone inval" },
        { status: 400 }
      );
    }

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

    // Hash password with bcrypt
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Upload files if present
    const uploadedUrls: { cni?: string; registreCommerce?: string; profilePhoto?: string } = {};
    
    if (files.profilePhotoFile) {
      uploadedUrls.profilePhoto = await uploadFile(files.profilePhotoFile, "images");
    }
    if (files.cniFile) {
      uploadedUrls.cni = await uploadFile(files.cniFile, "documents");
    }
    if (files.registreCommerceFile) {
      uploadedUrls.registreCommerce = await uploadFile(files.registreCommerceFile, "documents");
    }

    // Create user with OTP
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
        avatarUrl: uploadedUrls.profilePhoto || null,
      },
    });

    // Store OTP in database
    await db.oTPCode.create({
      data: {
        phone: normalizedPhone,
        code: otp,
        expiresAt: otpExpiresAt,
        userId: user.id,
      },
    });

    // If provider, create provider profile
    if (role === "PROVIDER") {
      const kycDocuments: string[] = [];
      if (uploadedUrls.cni) kycDocuments.push(uploadedUrls.cni);
      if (uploadedUrls.registreCommerce) kycDocuments.push(uploadedUrls.registreCommerce);

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

    // Send OTP via SMS
    const smsResult = await sendSMS(
      normalizedPhone,
      `Allo Services CI - Votre code de vérification est: ${otp}. Valable 5 minutes.`
    );

    console.log(`[SMS] OTP sent to ${normalizedPhone}:`, smsResult);

    return NextResponse.json({
      success: true,
      message: "Inscription réussie. Vérifiez votre téléphone pour le code OTP.",
      userId: user.id,
      phone: normalizedPhone,
      // In development, return the OTP for testing
      ...(process.env.NODE_ENV === "development" && { devOTP: otp }),
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'inscription. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
