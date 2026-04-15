// Notifications module index
export * from "./push";

// Email notification function
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<boolean> {
  const { to, subject, html, text } = params;

  // Check email provider
  const provider = process.env.EMAIL_PROVIDER || "mock";

  if (provider === "mock" || process.env.NODE_ENV !== "production") {
    console.log(`[MOCK EMAIL] To: ${to}`);
    console.log(`[MOCK EMAIL] Subject: ${subject}`);
    console.log(`[MOCK EMAIL] Body length: ${html.length} characters`);
    return true;
  }

  // Resend provider
  if (provider === "resend" && process.env.RESEND_API_KEY) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Allo Services CI <noreply@allo-services-ci.com>",
        to,
        subject,
        html,
        text,
      }),
    });

    return response.ok;
  }

  // SendGrid provider
  if (provider === "sendgrid" && process.env.SENDGRID_API_KEY) {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: "noreply@allo-services-ci.com", name: "Allo Services CI" },
        subject,
        content: [
          { type: "text/plain", value: text || "" },
          { type: "text/html", value: html },
        ],
      }),
    });

    return response.ok;
  }

  // SMTP provider (would need nodemailer or similar)
  if (provider === "smtp") {
    console.log("SMTP provider configured but implementation requires nodemailer");
    // For now, use mock
    return true;
  }

  console.log(`Email provider '${provider}' not configured`);
  return false;
}

// SMS notification function
export async function sendSMS(params: {
  to: string;
  message: string;
}): Promise<boolean> {
  const { to, message } = params;

  // Clean phone number
  const cleanPhone = to.replace(/\D/g, "");
  const formattedPhone = cleanPhone.startsWith("225")
    ? cleanPhone
    : `225${cleanPhone}`;

  // Check SMS provider
  const provider = process.env.SMS_PROVIDER || "mock";

  if (provider === "mock" || process.env.NODE_ENV !== "production") {
    console.log(`[MOCK SMS] To: +${formattedPhone}`);
    console.log(`[MOCK SMS] Message: ${message}`);
    return true;
  }

  // Twilio provider
  if (provider === "twilio" && process.env.TWILIO_ACCOUNT_SID) {
    const auth = Buffer.from(
      `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
    ).toString("base64");

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: `+${formattedPhone}`,
          From: process.env.TWILIO_FROM_NUMBER || "",
          Body: message,
        }).toString(),
      }
    );

    return response.ok;
  }

  // Orange SMS API
  if (provider === "orange" && process.env.ORANGE_SMS_CLIENT_ID) {
    // Orange SMS API implementation would go here
    console.log("Orange SMS API configured but implementation pending");
    return true;
  }

  // MTN SMS API
  if (provider === "mtn" && process.env.MTN_SMS_API_KEY) {
    // MTN SMS API implementation would go here
    console.log("MTN SMS API configured but implementation pending");
    return true;
  }

  console.log(`SMS provider '${provider}' not configured`);
  return false;
}

// In-app notification helper
export async function createInAppNotification(params: {
  userId: string;
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
}): Promise<void> {
  const { userId, type, title, message, actionUrl } = params;

  // This would use Prisma to create a notification
  // For now, just log it
  console.log(`[IN-APP NOTIFICATION] User: ${userId}`);
  console.log(`[IN-APP NOTIFICATION] Type: ${type}`);
  console.log(`[IN-APP NOTIFICATION] Title: ${title}`);
  console.log(`[IN-APP NOTIFICATION] Message: ${message}`);

  // TODO: Implement with Prisma
  // await db.notification.create({
  //   data: {
  //     userId,
  //     type,
  //     title,
  //     message,
  //     actionUrl,
  //   }
  // });
}

// Send notification through all available channels
export async function sendNotification(params: {
  userId: string;
  email?: string;
  phone?: string;
  title: string;
  message: string;
  type: string;
  actionUrl?: string;
  channels?: ("email" | "sms" | "push" | "in_app")[];
}): Promise<{ email?: boolean; sms?: boolean; push?: boolean; inApp: boolean }> {
  const {
    userId,
    email,
    phone,
    title,
    message,
    type,
    actionUrl,
    channels = ["in_app"],
  } = params;

  const results: { email?: boolean; sms?: boolean; push?: boolean; inApp: boolean } = {
    inApp: false,
  };

  // In-app notification (always sent)
  await createInAppNotification({ userId, type, title, message, actionUrl });
  results.inApp = true;

  // Email notification
  if (channels.includes("email") && email) {
    results.email = await sendEmail({
      to: email,
      subject: title,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #fd7613;">${title}</h2>
          <p>${message}</p>
          ${actionUrl ? `<a href="${actionUrl}" style="display: inline-block; background: #fd7613; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">Voir les détails</a>` : ""}
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
          <p style="color: #999; font-size: 12px;">Allo Services CI - Votre plateforme de services en Côte d'Ivoire</p>
        </div>
      `,
    });
  }

  // SMS notification
  if (channels.includes("sms") && phone) {
    results.sms = await sendSMS({
      to: phone,
      message: `${title}\n\n${message}`,
    });
  }

  // Push notification
  if (channels.includes("push")) {
    const { sendPushNotification } = await import("./push");
    results.push = await sendPushNotification(userId, {
      title,
      body: message,
      data: { type, actionUrl },
    });
  }

  return results;
}
