"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface SubscriptionBadgeProps {
  status: "FREE" | "MONTHLY" | "PREMIUM";
  size?: "sm" | "md" | "lg";
  showGlow?: boolean;
}

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1.5",
};

const subscriptionStyles = {
  FREE: {
    base: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    content: "Gratuit",
  },
  MONTHLY: {
    base: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    content: "✓ Standard",
  },
  PREMIUM: {
    base: "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-amber-900 border-amber-400/50",
    content: "⭐ Premium",
  },
};

export function SubscriptionBadge({
  status,
  size = "md",
  showGlow = false,
}: SubscriptionBadgeProps) {
  const style = subscriptionStyles[status];
  const isPremium = status === "PREMIUM";

  return (
    <span className="relative inline-flex">
      {isPremium && showGlow && (
        <span
          className="absolute inset-0 animate-pulse-slow rounded-md bg-amber-400/30 blur-md"
          aria-hidden="true"
        />
      )}
      <Badge
        variant="outline"
        className={cn(
          sizeClasses[size],
          style.base,
          isPremium && "font-semibold",
          "relative transition-all duration-200"
        )}
      >
        {isPremium && (
          <span
            className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"
            aria-hidden="true"
          />
        )}
        <span className="relative">{style.content}</span>
      </Badge>
    </span>
  );
}
