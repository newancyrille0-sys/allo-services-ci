import { NextRequest, NextResponse } from "next/server";
import { sendYelikaSMS, sendTemplateSMS, sendOTP, checkSMSCredits } from "@/lib/services/yelika-sms";

/**
 * POST /api/sms/send
 * Envoie un SMS via Yelika
 * 
 * Body:
 * - phone: string - Numéro de téléphone
 * - message: string - Message à envoyer (optionnel si template utilisé)
 * - template: string - Type de template (otp, welcome, etc.)
 * - templateArgs: string[] - Arguments pour le template
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, message, template, templateArgs } = body;

    // Validation du numéro de téléphone
    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Validation du format du numéro (Côte d'Ivoire)
    const phoneRegex = /^(\+225|0)?[0-9]{8,10}$/;
    const cleanPhone = phone.replace(/\s+/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    let result;

    if (template) {
      // Envoi avec template
      const args = templateArgs || [];
      result = await sendTemplateSMS(phone, template, ...args);
    } else if (message) {
      // Envoi avec message personnalisé
      result = await sendYelikaSMS(phone, message);
    } else {
      return NextResponse.json(
        { success: false, error: "Message or template is required" },
        { status: 400 }
      );
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        credits: result.credits,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("SMS API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sms/balance
 * Vérifie le solde de crédits SMS
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "balance") {
    const credits = await checkSMSCredits();
    return NextResponse.json({
      success: true,
      credits,
    });
  }

  return NextResponse.json({
    success: true,
    service: "Yelika SMS",
    endpoints: {
      "POST /api/sms/send": "Send SMS",
      "GET /api/sms/balance": "Check SMS credits",
    },
    templates: [
      "otp",
      "reservationConfirmed",
      "reservationReminder",
      "providerNewReservation",
      "paymentConfirmed",
      "welcome",
      "passwordReset",
      "kycApproved",
      "kycRejected",
      "referral",
    ],
  });
}
