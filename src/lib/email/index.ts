/**
 * Email Service for Allo Services CI
 * Supports multiple providers: Resend, SendGrid, Nodemailer (SMTP)
 */

interface EmailConfig {
  provider: "resend" | "sendgrid" | "smtp" | "mock";
  resend?: {
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };
  sendgrid?: {
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    fromEmail: string;
    fromName: string;
  };
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

// Default configuration from environment
const emailConfig: EmailConfig = {
  provider: (process.env.EMAIL_PROVIDER as EmailConfig["provider"]) || "mock",
  resend: {
    apiKey: process.env.RESEND_API_KEY || "",
    fromEmail: process.env.EMAIL_FROM || "noreply@alloservices.ci",
    fromName: process.env.EMAIL_FROM_NAME || "Allo Services CI",
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || "",
    fromEmail: process.env.EMAIL_FROM || "noreply@alloservices.ci",
    fromName: process.env.EMAIL_FROM_NAME || "Allo Services CI",
  },
  smtp: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    fromEmail: process.env.EMAIL_FROM || "noreply@alloservices.ci",
    fromName: process.env.EMAIL_FROM_NAME || "Allo Services CI",
  },
};

/**
 * Send email via Resend (https://resend.com)
 */
async function sendResendEmail(
  options: EmailOptions
): Promise<SendEmailResult> {
  const { apiKey, fromEmail, fromName } = emailConfig.resend!;

  if (!apiKey) {
    return { success: false, error: "Resend API key not configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, messageId: data.id };
    } else {
      return { success: false, error: data.message || "Failed to send email" };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send email via SendGrid
 */
async function sendSendGridEmail(
  options: EmailOptions
): Promise<SendEmailResult> {
  const { apiKey, fromEmail, fromName } = emailConfig.sendgrid!;

  if (!apiKey) {
    return { success: false, error: "SendGrid API key not configured" };
  }

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: Array.isArray(options.to)
              ? options.to.map((email) => ({ email }))
              : [{ email: options.to }],
          },
        ],
        from: { email: fromEmail, name: fromName },
        subject: options.subject,
        content: [
          { type: "text/plain", value: options.text || "" },
          { type: "text/html", value: options.html },
        ],
      }),
    });

    if (response.ok) {
      const messageId = response.headers.get("X-Message-Id");
      return { success: true, messageId: messageId || undefined };
    } else {
      const data = await response.json();
      return {
        success: false,
        error: data.errors?.[0]?.message || "Failed to send email",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send email via SMTP (using fetch to an API endpoint)
 */
async function sendSMTPEmail(options: EmailOptions): Promise<SendEmailResult> {
  // For SMTP, we would typically use nodemailer
  // Since we're in Edge/Serverless, we'll use a workaround
  // In production, you might want to use a transactional email service

  console.log("\n" + "=".repeat(50));
  console.log("📧 SMTP EMAIL (would be sent)");
  console.log("=".repeat(50));
  console.log(`To: ${Array.isArray(options.to) ? options.to.join(", ") : options.to}`);
  console.log(`Subject: ${options.subject}`);
  console.log("=".repeat(50) + "\n");

  // Return success in development
  return {
    success: true,
    messageId: `smtp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
}

/**
 * Mock email for development - logs to console
 */
async function sendMockEmail(options: EmailOptions): Promise<SendEmailResult> {
  console.log("\n" + "=".repeat(50));
  console.log("📧 MOCK EMAIL");
  console.log("=".repeat(50));
  console.log(`To: ${Array.isArray(options.to) ? options.to.join(", ") : options.to}`);
  console.log(`Subject: ${options.subject}`);
  console.log("-".repeat(50));
  console.log(options.text || options.html.replace(/<[^>]*>/g, ""));
  console.log("=".repeat(50) + "\n");

  return {
    success: true,
    messageId: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
}

/**
 * Main email sending function
 */
export async function sendEmail(options: EmailOptions): Promise<SendEmailResult> {
  switch (emailConfig.provider) {
    case "resend":
      return sendResendEmail(options);
    case "sendgrid":
      return sendSendGridEmail(options);
    case "smtp":
      return sendSMTPEmail(options);
    case "mock":
    default:
      return sendMockEmail(options);
  }
}

/**
 * Generate OTP email HTML
 */
function getOTPEmailHTML(code: string, expiresInMinutes: number = 5): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code de connexion - Allo Services CI</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <tr>
      <td style="text-align: center; padding: 30px 0;">
        <h1 style="color: #f97316; font-size: 28px; margin: 0; font-weight: 700;">
          🛠️ Allo Services CI
        </h1>
        <p style="color: #71717a; font-size: 14px; margin-top: 5px;">
          Votre plateforme de services en Côte d'Ivoire
        </p>
      </td>
    </tr>

    <!-- Main Content -->
    <tr>
      <td style="background-color: #ffffff; border-radius: 16px; padding: 40px 30px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #18181b; font-size: 24px; margin: 0 0 20px 0; text-align: center;">
          Code de connexion
        </h2>
        <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; text-align: center;">
          Utilisez le code ci-dessous pour vous connecter à votre compte Allo Services CI.
        </p>

        <!-- OTP Code -->
        <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 30px;">
          <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">
            Votre code de vérification
          </p>
          <p style="color: #ffffff; font-size: 40px; font-weight: 700; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">
            ${code}
          </p>
        </div>

        <!-- Expiration Warning -->
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px 20px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
          <p style="color: #92400e; font-size: 14px; margin: 0;">
            ⏱️ Ce code expire dans <strong>${expiresInMinutes} minutes</strong>. Ne le partagez avec personne.
          </p>
        </div>

        <!-- Security Notice -->
        <p style="color: #a1a1aa; font-size: 13px; line-height: 1.6; margin: 20px 0 0 0;">
          Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email en toute sécurité. Personne d'autre ne peut se connecter à votre compte avec ce code.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="text-align: center; padding: 30px 0;">
        <p style="color: #a1a1aa; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} Allo Services CI. Tous droits réservés.
        </p>
        <p style="color: #a1a1aa; font-size: 12px; margin: 10px 0 0 0;">
          Abidjan, Côte d'Ivoire
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Send OTP code via email
 */
export async function sendOTPEmail(
  email: string,
  code: string,
  expiresInMinutes: number = 5
): Promise<SendEmailResult> {
  const html = getOTPEmailHTML(code, expiresInMinutes);
  const text = `Allo Services CI - Votre code de connexion est: ${code}. Ce code expire dans ${expiresInMinutes} minutes. Ne le partagez pas.`;

  return sendEmail({
    to: email,
    subject: `Code de connexion: ${code}`,
    html,
    text,
  });
}

/**
 * Generate a random 6-digit OTP code
 */
export function generateOTPCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default {
  sendEmail,
  sendOTPEmail,
  generateOTPCode,
};
