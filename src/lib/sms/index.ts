/**
 * SMS Service for Allo Services CI
 * Supports multiple providers: Twilio, Orange SMS API, MTN SMS API
 */

interface SMSConfig {
  provider: "twilio" | "orange" | "mtn" | "mock";
  twilio?: {
    accountSid: string;
    authToken: string;
    fromNumber: string;
  };
  orange?: {
    clientId: string;
    clientSecret: string;
    sender: string;
  };
  mtn?: {
    apiKey: string;
    sender: string;
  };
}

interface SendSMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Default configuration from environment
const smsConfig: SMSConfig = {
  provider: (process.env.SMS_PROVIDER as SMSConfig["provider"]) || "mock",
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || "",
    authToken: process.env.TWILIO_AUTH_TOKEN || "",
    fromNumber: process.env.TWILIO_FROM_NUMBER || "",
  },
  orange: {
    clientId: process.env.ORANGE_SMS_CLIENT_ID || "",
    clientSecret: process.env.ORANGE_SMS_CLIENT_SECRET || "",
    sender: process.env.ORANGE_SMS_SENDER || "AlloServices",
  },
  mtn: {
    apiKey: process.env.MTN_SMS_API_KEY || "",
    sender: process.env.MTN_SMS_SENDER || "AlloServices",
  },
};

/**
 * Send SMS via Twilio
 */
async function sendTwilioSMS(
  to: string,
  message: string
): Promise<SendSMSResult> {
  const { accountSid, authToken, fromNumber } = smsConfig.twilio!;

  if (!accountSid || !authToken || !fromNumber) {
    return { success: false, error: "Twilio credentials not configured" };
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: fromNumber,
        To: to,
        Body: message,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, messageId: data.sid };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send SMS via Orange SMS API (Côte d'Ivoire)
 */
async function sendOrangeSMS(
  to: string,
  message: string
): Promise<SendSMSResult> {
  const { clientId, clientSecret, sender } = smsConfig.orange!;

  if (!clientId || !clientSecret) {
    return { success: false, error: "Orange SMS credentials not configured" };
  }

  try {
    // First, get access token
    const tokenUrl = "https://api.orange.com/oauth/v3/token";
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return { success: false, error: "Failed to get Orange access token" };
    }

    // Send SMS
    const smsUrl = "https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B225/requests";
    const normalizedPhone = to.startsWith("+") ? to : `+225${to.replace(/\s/g, "")}`;

    const smsResponse = await fetch(smsUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        outboundSMSMessageRequest: {
          address: `tel:${normalizedPhone}`,
          senderAddress: `tel:${sender}`,
          outboundSMSTextMessage: {
            message,
          },
        },
      }),
    });

    const smsData = await smsResponse.json();

    if (smsResponse.ok) {
      return {
        success: true,
        messageId: smsData.outboundSMSMessageRequest?.resourceURL,
      };
    } else {
      return { success: false, error: smsData.message || "SMS sending failed" };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send SMS via MTN SMS API (Côte d'Ivoire)
 */
async function sendMTNSMS(
  to: string,
  message: string
): Promise<SendSMSResult> {
  const { apiKey, sender } = smsConfig.mtn!;

  if (!apiKey) {
    return { success: false, error: "MTN SMS credentials not configured" };
  }

  try {
    const url = "https://api.mtn.com/sms/v1/messages";
    const normalizedPhone = to.startsWith("+") ? to : `+225${to.replace(/\s/g, "")}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: normalizedPhone,
        message,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, messageId: data.messageId };
    } else {
      return { success: false, error: data.message || "SMS sending failed" };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Mock SMS for development - logs to console
 */
async function sendMockSMS(to: string, message: string): Promise<SendSMSResult> {
  console.log("\n" + "=".repeat(50));
  console.log("📱 MOCK SMS");
  console.log("=".repeat(50));
  console.log(`To: ${to}`);
  console.log(`Message: ${message}`);
  console.log("=".repeat(50) + "\n");

  return {
    success: true,
    messageId: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
}

/**
 * Main SMS sending function
 */
export async function sendSMS(
  to: string,
  message: string
): Promise<SendSMSResult> {
  // Normalize phone number for Côte d'Ivoire
  let normalizedPhone = to.replace(/\s/g, "");
  if (!normalizedPhone.startsWith("+")) {
    if (normalizedPhone.startsWith("00")) {
      normalizedPhone = "+" + normalizedPhone.slice(2);
    } else if (normalizedPhone.startsWith("225")) {
      normalizedPhone = "+" + normalizedPhone;
    } else {
      normalizedPhone = "+225" + normalizedPhone;
    }
  }

  switch (smsConfig.provider) {
    case "twilio":
      return sendTwilioSMS(normalizedPhone, message);
    case "orange":
      return sendOrangeSMS(normalizedPhone, message);
    case "mtn":
      return sendMTNSMS(normalizedPhone, message);
    case "mock":
    default:
      return sendMockSMS(normalizedPhone, message);
  }
}

/**
 * Send OTP code via SMS
 */
export async function sendOTP(phone: string, code: string): Promise<SendSMSResult> {
  const message = `Allo Services CI - Votre code de vérification est: ${code}. Ce code expire dans 5 minutes. Ne le partagez pas.`;
  return sendSMS(phone, message);
}

/**
 * Generate a random 6-digit OTP code
 */
export function generateOTPCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default {
  sendSMS,
  sendOTP,
  generateOTPCode,
};
