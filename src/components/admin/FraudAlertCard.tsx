"use client";

import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  User, 
  Clock,
  Globe,
  MoreVertical,
  Eye,
  CheckCircle,
  Ban
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface FraudAlert {
  id: string;
  userId?: string;
  userName?: string;
  eventType: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  ipAddress?: string;
  date: Date | string;
  status: "new" | "investigating" | "resolved";
}

interface FraudAlertCardProps {
  alert: FraudAlert;
  onViewDetails?: (alertId: string) => void;
  onMarkInvestigating?: (alertId: string) => void;
  onResolve?: (alertId: string) => void;
  onBanUser?: (alertId: string) => void;
}

const severityConfig = {
  low: {
    icon: Info,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    label: "Faible",
  },
  medium: {
    icon: AlertCircle,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    label: "Moyenne",
  },
  high: {
    icon: AlertTriangle,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    badge: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    label: "Élevée",
  },
  critical: {
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    badge: "bg-red-500/20 text-red-400 border-red-500/30",
    label: "Critique",
  },
};

const statusConfig = {
  new: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    label: "Nouveau",
  },
  investigating: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    label: "En cours",
  },
  resolved: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    label: "Résolu",
  },
};

const eventTypeLabels: Record<string, string> = {
  duplicate_phone: "Téléphone dupliqué",
  multiple_accounts_ip: "Comptes multiples (même IP)",
  suspicious_payment: "Paiement suspect",
  fake_review: "Faux avis",
  impersonation: "Usurpation d'identité",
  abnormal_activity: "Activité anormale",
  rapid_reservations: "Réservations rapides",
  unusual_location: "Localisation inhabituelle",
};

export function FraudAlertCard({
  alert,
  onViewDetails,
  onMarkInvestigating,
  onResolve,
  onBanUser,
}: FraudAlertCardProps) {
  const severity = severityConfig[alert.severity];
  const status = statusConfig[alert.status];
  const SeverityIcon = severity.icon;

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card
      className={cn(
        "border transition-all duration-200 hover:shadow-lg",
        severity.bg,
        severity.border
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Severity Icon */}
          <div
            className={cn(
              "p-2 rounded-lg shrink-0",
              severity.bg,
              "border",
              severity.border
            )}
          >
            <SeverityIcon className={cn("w-5 h-5", severity.color)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-white font-medium">
                  {eventTypeLabels[alert.eventType] || alert.eventType}
                </h4>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                  {alert.description}
                </p>
              </div>

              {/* Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-400">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-gray-800 border-gray-700">
                  <DropdownMenuItem
                    onClick={() => onViewDetails?.(alert.id)}
                    className="text-gray-300 focus:bg-gray-700"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Voir détails
                  </DropdownMenuItem>
                  {alert.status === "new" && (
                    <DropdownMenuItem
                      onClick={() => onMarkInvestigating?.(alert.id)}
                      className="text-gray-300 focus:bg-gray-700"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Marquer en cours
                    </DropdownMenuItem>
                  )}
                  {alert.status !== "resolved" && (
                    <DropdownMenuItem
                      onClick={() => onResolve?.(alert.id)}
                      className="text-emerald-400 focus:bg-gray-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marquer résolu
                    </DropdownMenuItem>
                  )}
                  {alert.userId && (
                    <>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem
                        onClick={() => onBanUser?.(alert.id)}
                        className="text-red-400 focus:bg-gray-700"
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        Bannir l'utilisateur
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-400">
              {alert.userName && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{alert.userName}</span>
                </div>
              )}
              {alert.ipAddress && (
                <div className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  <span className="font-mono">{alert.ipAddress}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatDate(alert.date)}</span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="outline" className={cn("text-xs", severity.badge)}>
                {severity.label}
              </Badge>
              <Badge variant="outline" className={cn("text-xs", status.bg, status.color)}>
                {status.label}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
