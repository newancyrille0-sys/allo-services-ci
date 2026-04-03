"use client";

import * as React from "react";
import { Calendar, MapPin, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface ReservationCardProps {
  reservation: {
    id: string;
    status: string;
    scheduledDate: Date;
    address: string;
    city: string;
    priceTotal: number;
    service: { name: string };
    provider?: { businessName: string; user: { fullName: string } };
    client?: { fullName: string };
  };
  userRole: "client" | "provider";
  onStatusChange?: (status: string) => void;
}

const statusConfig: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  PENDING: {
    label: "En attente",
    color: "text-amber-700",
    bgColor: "bg-amber-100 border-amber-200",
  },
  CONFIRMED: {
    label: "Confirmée",
    color: "text-blue-700",
    bgColor: "bg-blue-100 border-blue-200",
  },
  IN_PROGRESS: {
    label: "En cours",
    color: "text-purple-700",
    bgColor: "bg-purple-100 border-purple-200",
  },
  COMPLETED: {
    label: "Terminée",
    color: "text-emerald-700",
    bgColor: "bg-emerald-100 border-emerald-200",
  },
  CANCELLED: {
    label: "Annulée",
    color: "text-red-700",
    bgColor: "bg-red-100 border-red-200",
  },
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-CI", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ReservationCard({
  reservation,
  userRole,
  onStatusChange,
}: ReservationCardProps) {
  const status = statusConfig[reservation.status] || statusConfig.PENDING;

  const handleStatusUpdate = (newStatus: string) => {
    onStatusChange?.(newStatus);
  };

  const getAvailableActions = () => {
    const actions: { label: string; status: string; variant: "default" | "outline" | "destructive" }[] = [];

    if (userRole === "provider") {
      if (reservation.status === "PENDING") {
        actions.push({ label: "Confirmer", status: "CONFIRMED", variant: "default" });
        actions.push({ label: "Refuser", status: "CANCELLED", variant: "destructive" });
      }
      if (reservation.status === "CONFIRMED") {
        actions.push({ label: "Démarrer", status: "IN_PROGRESS", variant: "default" });
      }
      if (reservation.status === "IN_PROGRESS") {
        actions.push({ label: "Terminer", status: "COMPLETED", variant: "default" });
      }
    } else {
      if (reservation.status === "PENDING" || reservation.status === "CONFIRMED") {
        actions.push({ label: "Annuler", status: "CANCELLED", variant: "destructive" });
      }
    }

    return actions;
  };

  const actions = getAvailableActions();
  const otherPartyName = userRole === "client"
    ? reservation.provider?.businessName || reservation.provider?.user.fullName
    : reservation.client?.fullName;

  return (
    <Card className="border border-gray-200/50 hover:border-primary/20 transition-all">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Header with Service Name and Status */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-base">{reservation.service.name}</h3>
              <Badge
                variant="outline"
                className={cn("w-fit", status.color, status.bgColor)}
              >
                {status.label}
              </Badge>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-primary">
                {formatPrice(reservation.priceTotal)}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            {/* Date and Time */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(reservation.scheduledDate)}</span>
              <Clock className="h-4 w-4 ml-2" />
              <span>{formatTime(reservation.scheduledDate)}</span>
            </div>

            {/* Address */}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>
                {reservation.address}, {reservation.city}
              </span>
            </div>

            {/* Other Party */}
            {otherPartyName && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>
                  {userRole === "client" ? "Prestataire" : "Client"} : {otherPartyName}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {actions.length > 0 && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-200/50">
              {actions.map((action) => (
                <Button
                  key={action.status}
                  variant={action.variant}
                  size="sm"
                  onClick={() => handleStatusUpdate(action.status)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
