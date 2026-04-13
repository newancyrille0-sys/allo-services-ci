import { NextRequest, NextResponse } from "next/server";
import { sendYelikaSMS, sendTemplateSMS, smsTemplates } from "@/lib/services/yelika-sms";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/sms/send
 * Envoie un SMS via Yellika
 * 
 * Body:
 * - phone: string - Numéro de téléphone
 * - message?: string - Message personnalisé
 * - template?: string - Type de template (voir smsTemplates)
 * - templateArgs?: string[] - Arguments pour le template
 * - userId?: string - ID utilisateur (optionnel, pour logging)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, message, template, templateArgs, userId } = body;

    // Validation du numéro de téléphone
    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Numéro de téléphone requis" },
        { status: 400 }
      );
    }

    // Normaliser le numéro
    let normalizedPhone = phone.replace(/\s+/g, "").replace(/^00/, "+");
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = "+225" + normalizedPhone.substring(1);
    } else if (!normalizedPhone.startsWith("+")) {
      normalizedPhone = "+225" + normalizedPhone;
    }

    // Validation format ivoirien
    const phoneRegex = /^\+225[0-9]{8,10}$/;
    if (!phoneRegex.test(normalizedPhone)) {
      return NextResponse.json(
        { success: false, error: "Format de numéro invalide" },
        { status: 400 }
      );
    }

    let result;

    if (template) {
      // Vérifier que le template existe
      if (!(template in smsTemplates)) {
        return NextResponse.json(
          { success: false, error: `Template "${template}" non reconnu. Templates disponibles: ${Object.keys(smsTemplates).join(", ")}` },
          { status: 400 }
        );
      }

      // Envoyer avec template
      const args = templateArgs || [];
      result = await sendTemplateSMS(normalizedPhone, template as keyof typeof smsTemplates, ...args);
      
    } else if (message) {
      // Vérifier la longueur du message
      if (message.length > 500) {
        return NextResponse.json(
          { success: false, error: "Message trop long (max 500 caractères)" },
          { status: 400 }
        );
      }

      // Envoyer message personnalisé
      result = await sendYelikaSMS(normalizedPhone, message);
      
    } else {
      return NextResponse.json(
        { success: false, error: "Message ou template requis" },
        { status: 400 }
      );
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        phone: normalizedPhone,
        credits: result.credits,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Erreur envoi SMS:", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sms
 * Informations sur le service SMS
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "templates") {
    // Lister les templates disponibles
    const templatesList = Object.keys(smsTemplates).map(key => ({
      key,
      example: smsTemplates[key as keyof typeof smsTemplates]("XXX", "Jean", "15/04/2024", "Plomberie"),
    }));

    return NextResponse.json({
      success: true,
      templates: templatesList,
    });
  }

  if (action === "balance") {
    // Vérifier le solde (si endpoint disponible)
    return NextResponse.json({
      success: true,
      message: "Utilisez le panel Yellika pour vérifier le solde",
      panelUrl: "https://panel.yellikasms.com",
    });
  }

  // Informations générales
  return NextResponse.json({
    success: true,
    service: "Yellika SMS",
    provider: "Yellika (Côte d'Ivoire)",
    endpoints: {
      "POST /api/sms/send": "Envoyer un SMS",
      "GET /api/sms?action=templates": "Lister les templates",
      "POST /api/auth/otp/send": "Envoyer un code OTP",
      "PUT /api/auth/otp/verify": "Vérifier un code OTP",
    },
    templates: Object.keys(smsTemplates),
  });
}
