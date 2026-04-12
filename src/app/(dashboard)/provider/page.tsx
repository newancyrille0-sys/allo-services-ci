"use client";

import * as React from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

// Subscription tier type
type SubscriptionTier = "STARTER" | "BASIC" | "STANDARD" | "PREMIUM" | "ELITE";

// Mapping subscription tiers to dashboard routes
const TIER_ROUTES: Record<SubscriptionTier, string> = {
  STARTER: "/provider/free",
  BASIC: "/provider/basic",
  STANDARD: "/provider/premium",
  PREMIUM: "/provider/elite",
  ELITE: "/provider/elite",
};

// Mock function to get user's subscription tier
// In production, this would fetch from the database via API
function getUserSubscriptionTier(): SubscriptionTier {
  // For demo purposes, return STARTER (free) by default
  // This can be changed to test different dashboards
  return "STARTER";
}

export default function ProviderDashboardRouter() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isRedirecting, setIsRedirecting] = React.useState(true);

  React.useEffect(() => {
    // For development/demo, bypass auth check
    const isDevelopment = true;

    if (!isLoading) {
      if (!isAuthenticated && !isDevelopment) {
        redirect("/login");
      } else {
        // Get the user's subscription tier and redirect to the appropriate dashboard
        const tier = getUserSubscriptionTier();
        const targetRoute = TIER_ROUTES[tier];

        // Small delay to ensure page is ready
        const timer = setTimeout(() => {
          redirect(targetRoute);
        }, 100);

        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, isAuthenticated, user]);

  // Loading state while redirecting
  return (
    <div className="flex h-screen items-center justify-center bg-[#f4faff]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#001e40] border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement de votre tableau de bord...</p>
      </div>
    </div>
  );
}
