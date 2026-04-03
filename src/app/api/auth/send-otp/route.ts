import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendOTP, generateOTPCode } from "@/lib/sms";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "Numéro de téléphone requis" },
        { status: 400 }
      );
    }

    // Normalize phone number
    const normalizedPhone = phone.replace(/\s/g, "");

    // Validate phone number format for Côte d'Ivoire
    const phoneRegex = /^(\+225|0)?[0-9]{8,10}$/;
    if (!phoneRegex.test(normalizedPhone)) {
      return NextResponse.json(
        { error: "Format de numéro inval. Utilisez le format +225 XX XX XX XX XX" },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = generateOTPCode();

    // Set expiration to 5 minutes from now
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Delete any existing unused OTP codes for this phone
    await db.oTPCode.deleteMany({
      where: {
        phone: normalizedPhone,
        used: false,
      },
    });

    // Store OTP in database
    await db.oTPCode.create({
      data: {
        phone: normalizedPhone,
        code: otp,
        expiresAt,
      },
    });

    // Send OTP via SMS
    const smsResult = await sendOTP(normalizedPhone, otp);

    if (!smsResult.success) {
      console.error("[SMS] Failed to send OTP:", smsResult.error);
      // Still return success in development for testing
      if (process.env.NODE_ENV !== "development") {
        return NextResponse.json(
          { error: "Erreur lors de l'envoi du SMS. Veuillez réessayer." },
          { status: 500 }
        );
      }
    }

    console.log(`[SMS] OTP ${otp} sent to ${normalizedPhone} (MessageId: ${smsResult.messageId})`);

    return NextResponse.json({
      success: true,
      message: "Code OTP envoyé",
      expiresIn: "5 minutes",
      // In development, return the OTP for testing
      ...(process.env.NODE_ENV === "development" && { devOTP: otp }),
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du code OTP" },
      { status: 500 }
    );
  }
}
