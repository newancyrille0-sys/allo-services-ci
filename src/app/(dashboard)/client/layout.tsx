"use client";

import * as React from "react";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";

// Mock data for development
const MOCK_USER = {
  id: "client-1",
  name: "Amadou Koné",
  email: "amadou.kone@email.com",
  avatar: undefined,
  role: "CLIENT" as const,
};

const MOCK_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "reservation" as const,
    title: "Réservation confirmée",
    message: "Votre réservation avec Plomberie Express a été confirmée.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "notif-2",
    type: "payment" as const,
    title: "Paiement réussi",
    message: "Votre paiement de 15 000 FCFA a été effectué avec succès.",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "notif-3",
    type: "promo" as const,
    title: "Offre spéciale",
    message: "Profitez de 20% de réduction sur votre prochaine réservation !",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, isClient } = useAuth();
  const [notifications, setNotifications] = React.useState(MOCK_NOTIFICATIONS);

  // For development, we'll bypass auth check
  const isDevelopment = true;

  // Redirect if not authenticated or not a client
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && !isDevelopment) {
      redirect("/login");
    }
    if (!isLoading && isAuthenticated && !isClient && !isDevelopment) {
      redirect("/provider");
    }
  }, [isLoading, isAuthenticated, isClient]);

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
      unreadMessages={3}
    >
      {children}
    </DashboardLayout>
  );
}
