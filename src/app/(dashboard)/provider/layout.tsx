"use client";

import * as React from "react";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";

// Mock data for development
const MOCK_USER = {
  id: "provider-1",
  name: "Plomberie Express",
  email: "contact@plomberie-express.ci",
  avatar: undefined,
  role: "PROVIDER" as const,
  subscription: {
    plan: "MONTHLY" as const,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10 days from now
  },
};

const MOCK_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "reservation" as const,
    title: "Nouvelle réservation",
    message: "Vous avez une nouvelle demande de réservation de la part de Amadou Koné.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "notif-2",
    type: "payment" as const,
    title: "Paiement reçu",
    message: "Vous avez reçu un paiement de 25 000 FCFA pour la réservation #RES-001.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: "notif-3",
    type: "system" as const,
    title: "Nouvel avis",
    message: "Fatou Diallo vous a laissé un avis 5 étoiles !",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: "notif-4",
    type: "promo" as const,
    title: "Abonnement expire bientôt",
    message: "Votre abonnement expire dans 10 jours. Renouvelez-le pour continuer à bénéficier des avantages.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

export default function ProviderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, isProvider } = useAuth();
  const [notifications, setNotifications] = React.useState(MOCK_NOTIFICATIONS);

  // For development, we'll bypass auth check
  const isDevelopment = true;

  // Redirect if not authenticated or not a provider
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && !isDevelopment) {
      redirect("/login");
    }
    if (!isLoading && isAuthenticated && !isProvider && !isDevelopment) {
      redirect("/client/dashboard");
    }
  }, [isLoading, isAuthenticated, isProvider]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <DashboardLayout
      user={MOCK_USER}
      notificationCount={unreadCount}
      unreadMessages={5}
    >
      {children}
    </DashboardLayout>
  );
}
