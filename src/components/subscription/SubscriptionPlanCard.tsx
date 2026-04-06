"use client";

import * as React from "react";
import { Check, Crown, Zap, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  SUBSCRIPTION_PLANS,
  type SubscriptionPlanKey,
  type SubscriptionPlan,
  formatXOF,
} from "@/lib/constants/subscription";

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan?: boolean;
  onSelect?: () => void;
  isLoading?: boolean;
}

const planIcons: Record<SubscriptionPlanKey, React.ElementType> = {
  STARTER: Zap,
  STANDARD: Star,
  PREMIUM: Crown,
};

// Couleurs par plan
const planColors: Record<SubscriptionPlanKey, {
  bg: string;
  text: string;
  border: string;
  check: string;
  button: string;
  gradient?: string;
}> = {
  STARTER: {
    bg: "bg-blue-500/10",
    text: "text-blue-600",
    border: "border-blue-400/50",
    check: "text-blue-500",
    button: "bg-blue-500 hover:bg-blue-600",
  },
  STANDARD: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
    border: "border-emerald-400/50",
    check: "text-emerald-500",
    button: "bg-emerald-500 hover:bg-emerald-600",
  },
  PREMIUM: {
    bg: "bg-gradient-to-br from-amber-500 to-yellow-400",
    text: "text-amber-600",
    border: "border-amber-400/50",
    check: "text-amber-500",
    button: "bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-white",
    gradient: "from-amber-500 via-yellow-400 to-amber-600",
  },
};

export function SubscriptionPlanCard({
  plan,
  isCurrentPlan = false,
  onSelect,
  isLoading = false,
}: SubscriptionPlanCardProps) {
  const Icon = planIcons[plan.key];
  const colors = planColors[plan.key];

  return (
    <div
      className={cn(
        "relative rounded-2xl border p-6 transition-all",
        plan.key === "PREMIUM" && "border-amber-400/50 bg-gradient-to-b from-amber-50/50 to-white",
        plan.key === "STANDARD" && "border-emerald-400/50",
        plan.key === "STARTER" && "border-blue-400/50",
        isCurrentPlan && "ring-2 ring-primary",
        !isCurrentPlan && "hover:border-primary/50 hover:shadow-lg"
      )}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-emerald-500 hover:bg-emerald-600">
            Le plus populaire
          </Badge>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <Badge variant="default" className="bg-primary">
            Plan actuel
          </Badge>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            "p-3 rounded-xl text-white",
            plan.key === "PREMIUM" && "bg-gradient-to-br from-amber-500 to-yellow-400",
            plan.key === "STANDARD" && "bg-emerald-500",
            plan.key === "STARTER" && "bg-blue-500"
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg">{plan.name}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">{formatXOF(plan.price)}</span>
            <span className="text-sm text-muted-foreground">/mois</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check
              className={cn(
                "h-5 w-5 shrink-0 mt-0.5",
                colors.check
              )}
            />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      {!isCurrentPlan && (
        <Button
          className={cn(
            "w-full text-white",
            colors.button
          )}
          onClick={onSelect}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Chargement...
            </div>
          ) : (
            <>
              {plan.key === "PREMIUM" && <Crown className="h-4 w-4 mr-2" />}
              Choisir {plan.name}
            </>
          )}
        </Button>
      )}

      {isCurrentPlan && (
        <Button className="w-full" variant="outline" disabled>
          Plan actuel
        </Button>
      )}

      {/* Premium Glow Effect */}
      {plan.key === "PREMIUM" && !isCurrentPlan && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-400/10 to-amber-500/10 blur-xl -z-10" />
      )}
    </div>
  );
}

// Plan comparison component
interface PlanComparisonProps {
  currentPlan: SubscriptionPlanKey;
}

export function SubscriptionPlanComparison({ currentPlan }: PlanComparisonProps) {
  const plans = Object.values(SUBSCRIPTION_PLANS);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <SubscriptionPlanCard
          key={plan.key}
          plan={plan}
          isCurrentPlan={currentPlan === plan.key}
        />
      ))}
    </div>
  );
}

// Fonction utilitaire pour obtenir la couleur du badge selon le plan
export function getPlanBadgeColor(planKey: SubscriptionPlanKey): string {
  switch (planKey) {
    case "STARTER":
      return "bg-blue-500 text-white";
    case "STANDARD":
      return "bg-emerald-500 text-white";
    case "PREMIUM":
      return "bg-gradient-to-r from-amber-500 to-yellow-400 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}

// Fonction utilitaire pour obtenir la couleur de thème selon le plan
export function getPlanThemeColor(planKey: SubscriptionPlanKey): string {
  switch (planKey) {
    case "STARTER":
      return "#3B82F6"; // Bleu
    case "STANDARD":
      return "#10B981"; // Vert
    case "PREMIUM":
      return "#F59E0B"; // Or
    default:
      return "#6B7280"; // Gris
  }
}

export default SubscriptionPlanCard;
