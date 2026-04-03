"use client";

import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: { value: number; isPositive: boolean };
  variant?: "default" | "primary" | "success" | "warning";
}

const variantStyles = {
  default: {
    bg: "bg-muted/50",
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
  },
  primary: {
    bg: "bg-primary/5",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  success: {
    bg: "bg-emerald-500/5",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  warning: {
    bg: "bg-amber-500/5",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
};

export function StatsCard({
  icon,
  label,
  value,
  trend,
  variant = "default",
}: StatsCardProps) {
  const styles = variantStyles[variant];

  return (
    <Card className={cn("border border-gray-200/50", styles.bg)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            {/* Label */}
            <span className="text-sm text-muted-foreground">{label}</span>

            {/* Value */}
            <span className="text-2xl font-bold">{value}</span>

            {/* Trend */}
            {trend && (
              <div
                className={cn(
                  "flex items-center gap-1 text-sm",
                  trend.isPositive ? "text-emerald-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{Math.abs(trend.value)}%</span>
                <span className="text-muted-foreground text-xs">vs mois dernier</span>
              </div>
            )}
          </div>

          {/* Icon */}
          <div className={cn("p-3 rounded-xl", styles.iconBg, styles.iconColor)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
