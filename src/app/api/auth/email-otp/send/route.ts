import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendOTPEmail, generateOTPCode } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Adresse email requise" },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Generate 6-digit OTP
    const otp = generateOTPCode();

    // Set expiration to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Delete any existing unused OTP codes for this email
    await db.emailOTP.deleteMany({
      where: {
        email: normalizedEmail,
        used: false,
      },
    });

    // Store OTP in database
    await db.emailOTP.create({
      data: {
        email: normalizedEmail,
        code: otp,
        expiresAt,
        userId: existingUser?.id,
      },
    });

    // Send OTP via email
    const emailResult = await sendOTPEmail(normalizedEmail, otp, 10);

    if (!emailResult.success) {
      console.error("[Email] Failed to send OTP:", emailResult.error);
      // Still return success in development for testing
      if (process.env.NODE_ENV !== "development") {
        return NextResponse.json(
          { error: "Erreur lors de l'envoi de l'email. Veuillez réessayer." },
          { status: 500 }
        );
      }
    }

    console.log(`[Email] OTP ${otp} sent to ${normalizedEmail} (MessageId: ${emailResult.messageId})`);

    return NextResponse.json({
      success: true,
      message: "Code envoyé à votre adresse email",
      expiresIn: "10 minutes",
      isNewUser: !existingUser,
      // In development, return the OTP for testing
      ...(process.env.NODE_ENV === "development" && { devOTP: otp }),
    });
  } catch (error) {
    console.error("Send email OTP error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du code" },
      { status: 500 }
    );
  }
}
