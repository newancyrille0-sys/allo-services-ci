"use client";

import * as React from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export interface TrustScoreProps {
  score: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

function getTrustLabel(score: number): { label: string; color: string } {
  if (score >= 90) {
    return { label: "Excellent", color: "text-emerald-600" };
  }
  if (score >= 75) {
    return { label: "Très bon", color: "text-green-600" };
  }
  if (score >= 60) {
    return { label: "Bon", color: "text-blue-600" };
  }
  if (score >= 40) {
    return { label: "Moyen", color: "text-amber-600" };
  }
  return { label: "À améliorer", color: "text-red-600" };
}

function getProgressColor(score: number): string {
  if (score >= 90) return "bg-emerald-500";
  if (score >= 75) return "bg-green-500";
  if (score >= 60) return "bg-blue-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-red-500";
}

const sizeConfig = {
  sm: {
    icon: "h-3.5 w-3.5",
    text: "text-xs",
    progress: "h-1.5",
    gap: "gap-1",
  },
  md: {
    icon: "h-4 w-4",
    text: "text-sm",
    progress: "h-2",
    gap: "gap-1.5",
  },
  lg: {
    icon: "h-5 w-5",
    text: "text-base",
    progress: "h-2.5",
    gap: "gap-2",
  },
};

export function TrustScore({
  score,
  showLabel = true,
  size = "md",
}: TrustScoreProps) {
  const clampedScore = Math.min(100, Math.max(0, score));
  const { label, color } = getTrustLabel(clampedScore);
  const progressColor = getProgressColor(clampedScore);
  const config = sizeConfig[size];

  return (
    <div className={cn("flex flex-col", config.gap)}>
      <div className={cn("flex items-center", config.gap)}>
        <ShieldCheck
          className={cn(
            config.icon,
            clampedScore >= 75 ? "text-emerald-500" : "text-muted-foreground"
          )}
        />
        <span className={cn("font-medium", config.text)}>
          {clampedScore}%
        </span>
        {showLabel && (
          <span className={cn("font-medium", config.text, color)}>
            {label}
          </span>
        )}
      </div>
      <Progress
        value={clampedScore}
        className={cn("w-full", config.progress)}
      />
    </div>
  );
}
