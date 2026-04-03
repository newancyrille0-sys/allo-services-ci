"use client";

import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AdminStatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  className?: string;
}

const variantStyles = {
  default: {
    bg: "bg-gray-800/50",
    iconBg: "bg-gray-700",
    iconColor: "text-gray-400",
    valueColor: "text-white",
    labelColor: "text-gray-400",
  },
  primary: {
    bg: "bg-primary/10",
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
    valueColor: "text-primary",
    labelColor: "text-primary/70",
  },
  success: {
    bg: "bg-emerald-500/10",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-500",
    valueColor: "text-emerald-500",
    labelColor: "text-emerald-500/70",
  },
  warning: {
    bg: "bg-amber-500/10",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-500",
    valueColor: "text-amber-500",
    labelColor: "text-amber-500/70",
  },
  danger: {
    bg: "bg-red-500/10",
    iconBg: "bg-red-500/20",
    iconColor: "text-red-500",
    valueColor: "text-red-500",
    labelColor: "text-red-500/70",
  },
};

export function AdminStatsCard({
  icon: Icon,
  label,
  value,
  change,
  variant = "default",
  className,
}: AdminStatsCardProps) {
  const styles = variantStyles[variant];

  return (
    <Card
      className={cn(
        "border-0 transition-all duration-200 hover:scale-[1.02]",
        styles.bg,
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className={cn("text-sm font-medium", styles.labelColor)}>
              {label}
            </p>
            <p className={cn("text-3xl font-bold mt-2", styles.valueColor)}>
              {typeof value === "number" ? value.toLocaleString("fr-FR") : value}
            </p>
            {change && (
              <div className="flex items-center gap-1 mt-2">
                <span
                  className={cn(
                    "text-xs font-medium",
                    change.isPositive ? "text-emerald-500" : "text-red-500"
                  )}
                >
                  {change.isPositive ? "+" : ""}
                  {change.value}%
                </span>
                <span className="text-xs text-gray-500">vs mois dernier</span>
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", styles.iconBg)}>
            <Icon className={cn("w-6 h-6", styles.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
