import { NextResponse } from "next/server";
import { checkSMSCredits } from "@/lib/services/yelika-sms";

/**
 * GET /api/sms/balance
 * Vérifie le solde de crédits SMS Yellika
 */
export async function GET() {
  try {
    const credits = await checkSMSCredits();

    if (credits === null) {
      return NextResponse.json({
        success: false,
        error: "Impossible de récupérer le solde",
        message: "Vérifiez votre clé API Yellika ou consultez https://panel.yellikasms.com",
      });
    }

    return NextResponse.json({
      success: true,
      credits,
      provider: "Yellika SMS",
      panelUrl: "https://panel.yellikasms.com",
    });

  } catch (error) {
    console.error("Erreur vérification solde:", error);
    return NextResponse.json({
      success: false,
      error: "Erreur lors de la vérification du solde",
    });
  }
}
