"use client";

import * as React from "react";
import {
  Bell,
  Calendar,
  CreditCard,
  Tag,
  AlertCircle,
  Check,
  CheckCheck,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Mock notifications data
const MOCK_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "reservation",
    title: "Réservation confirmée",
    message: "Votre réservation avec Plomberie Express a été confirmée pour le 15 janvier à 10h.",
    isRead: false,
    actionUrl: "/client/reservations/res-1",
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "notif-2",
    type: "payment",
    title: "Paiement réussi",
    message: "Votre paiement de 15 000 FCFA pour la réservation #res-2 a été effectué avec succès.",
    isRead: false,
    actionUrl: "/client/reservations/res-2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "notif-3",
    type: "reservation",
    title: "Réservation en cours",
    message: "Votre réservation avec Ménage Pro CI est maintenant en cours. Le prestataire est arrivé.",
    isRead: false,
    actionUrl: "/client/reservations/res-3",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
  {
    id: "notif-4",
    type: "promo",
    title: "Offre spéciale",
    message: "Profitez de 20% de réduction sur votre prochaine réservation avec le code PROMO20 !",
    isRead: true,
    actionUrl: undefined,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "notif-5",
    type: "system",
    title: "Bienvenue sur Allo Services CI",
    message: "Merci de rejoindre notre plateforme ! Découvrez nos services et trouvez les meilleurs prestataires.",
    isRead: true,
    actionUrl: undefined,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    id: "notif-6",
    type: "reservation",
    title: "Réservation terminée",
    message: "Votre réservation avec Prof Maths Academy est terminée. N'hésitez pas à laisser un avis !",
    isRead: true,
    actionUrl: "/client/reservations/res-4/review",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
  },
  {
    id: "notif-7",
    type: "payment",
    title: "Rappel de paiement",
    message: "Vous avez une réservation en attente de paiement. Effectuez le paiement pour confirmer.",
    isRead: true,
    actionUrl: "/client/reservations/res-5",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
  },
];

const TYPE_FILTERS = [
  { value: "all", label: "Toutes", icon: Bell },
  { value: "reservation", label: "Réservations", icon: Calendar },
  { value: "payment", label: "Paiements", icon: CreditCard },
  { value: "system", label: "Système", icon: AlertCircle },
  { value: "promo", label: "Promos", icon: Tag },
];

const notificationStyles: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  reservation: { icon: Calendar, color: "text-primary", bgColor: "bg-primary/10" },
  payment: { icon: CreditCard, color: "text-green-600", bgColor: "bg-green-100" },
  promo: { icon: Tag, color: "text-amber-600", bgColor: "bg-amber-100" },
  system: { icon: AlertCircle, color: "text-gray-600", bgColor: "bg-gray-100" },
};

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState(MOCK_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = React.useState("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = React.useMemo(() => {
    if (activeFilter === "all") return notifications;
    return notifications.filter((n) => n.type === activeFilter);
  }, [notifications, activeFilter]);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}`
              : "Toutes les notifications sont lues"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {/* Filters */}
      <Tabs value={activeFilter} onValueChange={setActiveFilter}>
        <TabsList className="w-full justify-start overflow-x-auto h-auto p-1">
          {TYPE_FILTERS.map((filter) => {
            const count = notifications.filter((n) => n.type === filter.value).length;
            const unread = notifications.filter(
              (n) => n.type === filter.value && !n.isRead
            ).length;

            return (
              <TabsTrigger
                key={filter.value}
                value={filter.value}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <filter.icon className="h-4 w-4" />
                {filter.label}
                {filter.value === "all" ? (
                  unreadCount > 0 && (
                    <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                      {unreadCount}
                    </Badge>
                  )
                ) : (
                  count > 0 && (
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                      {count}
                    </Badge>
                  )
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {TYPE_FILTERS.map((filter) => (
          <TabsContent key={filter.value} value={filter.value} className="mt-4">
            {filteredNotifications.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground text-center">
                    Aucune notification
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {filteredNotifications.map((notification) => {
                  const styles = notificationStyles[notification.type] || notificationStyles.system;
                  const Icon = styles.icon;

                  return (
                    <Card
                      key={notification.id}
                      className={cn(
                        "border-gray-200/50 transition-all cursor-pointer hover:border-primary/20",
                        !notification.isRead && "bg-primary/5 border-l-4 border-l-primary"
                      )}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={cn(
                              "shrink-0 p-2 rounded-full",
                              styles.bgColor
                            )}
                          >
                            <Icon className={cn("h-5 w-5", styles.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{notification.title}</p>
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-2 shrink-0">
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {formatTime(notification.createdAt)}
                                </span>
                                {notification.actionUrl && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto py-1 px-2 text-xs text-primary"
                                    asChild
                                  >
                                    <a href={notification.actionUrl}>
                                      Voir
                                      <ExternalLink className="h-3 w-3 ml-1" />
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
