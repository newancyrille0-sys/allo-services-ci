// Push Notifications Module
// Supports Web Push API for browser notifications

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: Record<string, any>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
}

// VAPID keys for push notifications (generate with web-push)
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:contact@allo-services-ci.com";

// Check if push notifications are configured
export function isPushConfigured(): boolean {
  return !!(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY);
}

// Get VAPID public key for client-side subscription
export function getVapidPublicKey(): string {
  return VAPID_PUBLIC_KEY;
}

// Subscribe a user to push notifications
export async function subscribeToPush(
  userId: string,
  subscription: PushSubscription
): Promise<void> {
  // In a real implementation, store this in database
  console.log(`User ${userId} subscribed to push notifications`);
  console.log("Subscription:", JSON.stringify(subscription, null, 2));
  
  // TODO: Store in database with Prisma
  // await db.pushSubscription.create({
  //   data: {
  //     userId,
  //     endpoint: subscription.endpoint,
  //     p256dh: subscription.keys.p256dh,
  //     auth: subscription.keys.auth,
  //   }
  // });
}

// Unsubscribe a user from push notifications
export async function unsubscribeFromPush(
  userId: string,
  endpoint: string
): Promise<void> {
  console.log(`User ${userId} unsubscribed from push notifications`);
  
  // TODO: Remove from database
  // await db.pushSubscription.deleteMany({
  //   where: { userId, endpoint }
  // });
}

// Send push notification to a specific user
export async function sendPushNotification(
  userId: string,
  payload: NotificationPayload
): Promise<boolean> {
  if (!isPushConfigured()) {
    console.log("Push notifications not configured, skipping");
    return false;
  }

  try {
    // Get user's subscriptions from database
    // const subscriptions = await db.pushSubscription.findMany({
    //   where: { userId }
    // });

    // For now, log the notification
    console.log(`Sending push notification to user ${userId}:`, payload.title);
    
    // TODO: Use web-push library to send notifications
    // const webpush = require('web-push');
    // webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
    // 
    // for (const sub of subscriptions) {
    //   await webpush.sendNotification({
    //     endpoint: sub.endpoint,
    //     keys: { p256dh: sub.p256dh, auth: sub.auth }
    //   }, JSON.stringify(payload));
    // }

    return true;
  } catch (error) {
    console.error("Push notification error:", error);
    return false;
  }
}

// Send push notification to multiple users
export async function sendBulkPushNotification(
  userIds: string[],
  payload: NotificationPayload
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const userId of userIds) {
    const success = await sendPushNotification(userId, payload);
    if (success) {
      sent++;
    } else {
      failed++;
    }
  }

  return { sent, failed };
}

// Predefined notification templates
export const NotificationTemplates = {
  reservationConfirmed: (clientName: string, serviceName: string): NotificationPayload => ({
    title: "Réservation confirmée",
    body: `Bonjour ${clientName}, votre réservation pour ${serviceName} a été confirmée.`,
    icon: "/icon.png",
    tag: "reservation",
    data: { type: "reservation" },
  }),

  reservationReminder: (serviceName: string, date: string): NotificationPayload => ({
    title: "Rappel de réservation",
    body: `N'oubliez pas: ${serviceName} prévu pour ${date}`,
    icon: "/icon.png",
    tag: "reminder",
    requireInteraction: true,
  }),

  newMessage: (senderName: string): NotificationPayload => ({
    title: "Nouveau message",
    body: `${senderName} vous a envoyé un message`,
    icon: "/icon.png",
    tag: "message",
    data: { type: "message" },
  }),

  paymentReceived: (amount: number): NotificationPayload => ({
    title: "Paiement reçu",
    body: `Vous avez reçu un paiement de ${amount.toLocaleString()} FCFA`,
    icon: "/icon.png",
    tag: "payment",
    data: { type: "payment" },
  }),

  reviewReceived: (rating: number): NotificationPayload => ({
    title: "Nouvel avis",
    body: `Vous avez reçu une note de ${rating}/5 étoiles`,
    icon: "/icon.png",
    tag: "review",
    data: { type: "review" },
  }),

  subscriptionExpiring: (daysLeft: number): NotificationPayload => ({
    title: "Abonnement expire bientôt",
    body: `Votre abonnement expire dans ${daysLeft} jours. Renouvelez-le pour continuer à profiter de tous les avantages.`,
    icon: "/icon.png",
    tag: "subscription",
    requireInteraction: true,
    actions: [
      { action: "renew", title: "Renouveler" },
      { action: "dismiss", title: "Plus tard" },
    ],
  }),
};

// Client-side helper for push notifications
export const PushClient = {
  // Check if notifications are supported
  isSupported: (): boolean => {
    return typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator;
  },

  // Request notification permission
  requestPermission: async (): Promise<NotificationPermission> => {
    if (!PushClient.isSupported()) {
      return "denied";
    }
    return Notification.requestPermission();
  },

  // Subscribe to push notifications
  subscribe: async (userId: string): Promise<PushSubscription | null> => {
    if (!PushClient.isSupported()) {
      return null;
    }

    const permission = await PushClient.requestPermission();
    if (permission !== "granted") {
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: VAPID_PUBLIC_KEY,
    });

    const pushSubscription: PushSubscription = subscription.toJSON() as PushSubscription;

    // Send subscription to server
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, subscription: pushSubscription }),
    });

    return pushSubscription;
  },

  // Unsubscribe from push notifications
  unsubscribe: async (userId: string): Promise<boolean> => {
    if (!PushClient.isSupported()) {
      return false;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, endpoint: subscription.endpoint }),
      });
    }

    return true;
  },

  // Show local notification (for when push isn't available)
  showLocalNotification: async (payload: NotificationPayload): Promise<void> => {
    if (!PushClient.isSupported()) {
      return;
    }

    const permission = await PushClient.requestPermission();
    if (permission !== "granted") {
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon,
      badge: payload.badge,
      image: payload.image,
      tag: payload.tag,
      data: payload.data,
      actions: payload.actions,
      requireInteraction: payload.requireInteraction,
      silent: payload.silent,
    });
  },
};
