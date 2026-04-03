"use client";

import * as React from "react";
import { Check, Crown, Zap, CreditCard } from "lucide-react";
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
  FREE: Zap,
  MONTHLY: CreditCard,
  PREMIUM: Crown,
};

export function SubscriptionPlanCard({
  plan,
  isCurrentPlan = false,
  onSelect,
  isLoading = false,
}: SubscriptionPlanCardProps) {
  const Icon = planIcons[plan.key];

  return (
    <div
      className={cn(
        "relative rounded-2xl border p-6 transition-all",
        plan.key === "PREMIUM" && "border-amber-400/50 bg-gradient-to-b from-amber-50/50 to-white",
        plan.key === "MONTHLY" && "border-emerald-400/50",
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
            "p-3 rounded-xl",
            plan.key === "PREMIUM" && "bg-gradient-to-br from-amber-500 to-yellow-400 text-white",
            plan.key === "MONTHLY" && "bg-emerald-500/10 text-emerald-600",
            plan.key === "FREE" && "bg-gray-500/10 text-gray-600"
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg">{plan.name}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">{formatXOF(plan.price)}</span>
            {plan.price > 0 && (
              <span className="text-sm text-muted-foreground">/mois</span>
            )}
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
                plan.key === "PREMIUM" && "text-amber-500",
                plan.key === "MONTHLY" && "text-emerald-500",
                plan.key === "FREE" && "text-gray-500"
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
            "w-full",
            plan.key === "PREMIUM" && "bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-white",
            plan.key === "MONTHLY" && "bg-emerald-500 hover:bg-emerald-600"
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

export default SubscriptionPlanCard;
