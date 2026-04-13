/**
 * Yelika SMS Service for Allo Services CI
 * Service d'envoi de SMS via Yelika (Côte d'Ivoire)
 */

interface YelikaSMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  credits?: number;
}

interface SMSTemplate {
  otp: (code: string) => string;
  reservationConfirmed: (providerName: string, date: string, service: string) => string;
  reservationReminder: (providerName: string, date: string, service: string) => string;
  providerNewReservation: (clientName: string, date: string, service: string) => string;
  paymentConfirmed: (amount: string, service: string) => string;
  welcome: (name: string) => string;
  passwordReset: (code: string) => string;
  kycApproved: () => string;
  kycRejected: (reason: string) => string;
  referral: (bonusAmount: string) => string;
}

export const smsTemplates: SMSTemplate = {
  otp: (code: string) => 
    `Allo Services CI - Votre code de verification est: ${code}. Valide 5 minutes.`,
  
  reservationConfirmed: (providerName: string, date: string, service: string) =>
    `Allo Services CI - Reservation confirmee avec ${providerName} pour ${service} le ${date}. Details dans l'app.`,
  
  reservationReminder: (providerName: string, date: string, service: string) =>
    `Allo Services CI - Rappel: RDV avec ${providerName} pour ${service} le ${date}.`,
  
  providerNewReservation: (clientName: string, date: string, service: string) =>
    `Allo Services CI - Nouvelle reservation de ${clientName} pour ${service} le ${date}. Repondez rapidement.`,
  
  paymentConfirmed: (amount: string, service: string) =>
    `Allo Services CI - Paiement de ${amount} FCFA confirme pour ${service}. Merci!`,
  
  welcome: (name: string) =>
    `Bienvenue sur Allo Services CI, ${name}! Trouvez les meilleurs prestataires pres de chez vous.`,
  
  passwordReset: (code: string) =>
    `Allo Services CI - Code de reinitialisation: ${code}. Valide 10 minutes.`,
  
  kycApproved: () =>
    `Allo Services CI - Felicitations! Votre compte prestataire est verifie. Vous pouvez desormais recevoir des reservations.`,
  
  kycRejected: (reason: string) =>
    `Allo Services CI - Verification KYC refusee. Raison: ${reason}. Corrigez dans votre compte.`,
  
  referral: (bonusAmount: string) =>
    `Allo Services CI - Bonus de parrainage: ${bonusAmount} FCFA credite sur votre compte!`,
};

/**
 * Envoie un SMS via l'API Yelika
 */
export async function sendYelikaSMS(
  phoneNumber: string,
  message: string
): Promise<YelikaSMSResponse> {
  const apiKey = process.env.YELIKA_API_KEY;
  const senderId = process.env.YELIKA_SENDER_ID || "ALLOSERVICES";
  const apiUrl = process.env.YELIKA_API_URL || "https://api.yelika.net/v1/sms/send";

  if (!apiKey) {
    console.error("YELIKA_API_KEY non configurée");
    return { success: false, error: "SMS service not configured" };
  }

  // Normaliser le numéro de téléphone (format ivoirien)
  let normalizedPhone = phoneNumber.replace(/\s+/g, "").replace(/^00/, "+");
  
  // Si le numéro commence par 0, le convertir au format international
  if (normalizedPhone.startsWith("0")) {
    normalizedPhone = "+225" + normalizedPhone.substring(1);
  }
  
  // Si pas de préfixe, ajouter +225 (Côte d'Ivoire)
  if (!normalizedPhone.startsWith("+")) {
    normalizedPhone = "+225" + normalizedPhone;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: senderId,
        to: normalizedPhone,
        message: message,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        success: true,
        messageId: data.messageId || data.id,
        credits: data.credits,
      };
    } else {
      console.error("Yelika SMS error:", data);
      return {
        success: false,
        error: data.error || data.message || "Failed to send SMS",
      };
    }
  } catch (error) {
    console.error("Yelika SMS exception:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Envoie un SMS avec template
 */
export async function sendTemplateSMS(
  phoneNumber: string,
  templateType: keyof SMSTemplate,
  ...args: string[]
): Promise<YelikaSMSResponse> {
  const template = smsTemplates[templateType];
  if (!template) {
    return { success: false, error: "Invalid template type" };
  }

  const message = template(...args);
  return sendYelikaSMS(phoneNumber, message);
}

/**
 * Envoie un OTP par SMS
 */
export async function sendOTP(phoneNumber: string, code: string): Promise<boolean> {
  const result = await sendTemplateSMS(phoneNumber, "otp", code);
  return result.success;
}

/**
 * Vérifie le solde de crédits SMS
 */
export async function checkSMSCredits(): Promise<number | null> {
  const apiKey = process.env.YELIKA_API_KEY;
  const apiUrl = process.env.YELIKA_API_URL?.replace("/send", "/balance");

  if (!apiKey || !apiUrl) {
    return null;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
    });

    const data = await response.json();
    return data.credits || data.balance || null;
  } catch (error) {
    console.error("Error checking SMS credits:", error);
    return null;
  }
}

export default {
  send: sendYelikaSMS,
  sendTemplate: sendTemplateSMS,
  sendOTP,
  checkCredits: checkSMSCredits,
  templates: smsTemplates,
};
