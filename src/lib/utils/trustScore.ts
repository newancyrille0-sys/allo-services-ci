/**
 * Trust Score Calculation for Providers
 * Calculates a trustworthiness score from 0-100
 */

export interface TrustScoreInput {
  badgeVerified: boolean;
  kycStatus: "PENDING" | "VERIFIED" | "REJECTED";
  averageRating: number;
  totalReviews: number;
  totalReservations: number;
  complaints?: number;
  subscriptionPlan?: "FREE" | "MONTHLY" | "PREMIUM";
  responseTime?: number; // in hours
  completedOnTime?: number; // percentage
}

export interface TrustScoreResult {
  score: number;
  label: string;
  color: string;
  breakdown: {
    verification: number;
    reputation: number;
    activity: number;
    reliability: number;
  };
}

/**
 * Calculate the trust score for a provider
 */
export function calculateTrustScore(provider: TrustScoreInput): TrustScoreResult {
  let score = 0;
  const breakdown = {
    verification: 0,
    reputation: 0,
    activity: 0,
    reliability: 0,
  };

  // === Verification Points (max 30) ===
  if (provider.badgeVerified) {
    breakdown.verification += 10;
    score += 10;
  }

  if (provider.kycStatus === "VERIFIED") {
    breakdown.verification += 20;
    score += 20;
  } else if (provider.kycStatus === "PENDING") {
    breakdown.verification += 5;
    score += 5;
  }

  // === Reputation Points (max 40) ===
  // Rating-based points
  if (provider.averageRating >= 4.5) {
    breakdown.reputation += 15;
    score += 15;
  } else if (provider.averageRating >= 4.0) {
    breakdown.reputation += 10;
    score += 10;
  } else if (provider.averageRating >= 3.5) {
    breakdown.reputation += 5;
    score += 5;
  }

  // Review count bonus
  const reviewBonus = Math.min(provider.totalReviews * 2, 15);
  breakdown.reputation += reviewBonus;
  score += reviewBonus;

  // Subscription bonus
  if (provider.subscriptionPlan === "PREMIUM") {
    breakdown.reputation += 10;
    score += 10;
  } else if (provider.subscriptionPlan === "MONTHLY") {
    breakdown.reputation += 5;
    score += 5;
  }

  // === Activity Points (max 15) ===
  if (provider.totalReservations >= 100) {
    breakdown.activity += 15;
    score += 15;
  } else if (provider.totalReservations >= 50) {
    breakdown.activity += 10;
    score += 10;
  } else if (provider.totalReservations >= 20) {
    breakdown.activity += 5;
    score += 5;
  } else if (provider.totalReservations >= 5) {
    breakdown.activity += 2;
    score += 2;
  }

  // === Reliability Points (max 15) ===
  if (provider.responseTime !== undefined) {
    if (provider.responseTime <= 1) {
      breakdown.reliability += 5;
      score += 5;
    } else if (provider.responseTime <= 4) {
      breakdown.reliability += 3;
      score += 3;
    } else if (provider.responseTime <= 24) {
      breakdown.reliability += 1;
      score += 1;
    }
  }

  if (provider.completedOnTime !== undefined) {
    if (provider.completedOnTime >= 95) {
      breakdown.reliability += 10;
      score += 10;
    } else if (provider.completedOnTime >= 85) {
      breakdown.reliability += 5;
      score += 5;
    } else if (provider.completedOnTime >= 70) {
      breakdown.reliability += 2;
      score += 2;
    }
  }

  // === Penalties ===
  if (provider.complaints && provider.complaints > 0) {
    const penalty = Math.min(provider.complaints * 10, 50);
    score -= penalty;
  }

  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  return {
    score,
    label: getTrustScoreLabel(score),
    color: getTrustScoreColor(score),
    breakdown,
  };
}

/**
 * Get the label for a trust score
 */
export function getTrustScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Très bon";
  if (score >= 40) return "Bon";
  if (score >= 20) return "Moyen";
  return "À améliorer";
}

/**
 * Get the color for a trust score
 */
export function getTrustScoreColor(score: number): string {
  if (score >= 80) return "#10B981"; // success green
  if (score >= 60) return "#34D399"; // light green
  if (score >= 40) return "#F59E0B"; // warning amber
  if (score >= 20) return "#FB923C"; // orange
  return "#EF4444"; // error red
}

/**
 * Get CSS class for trust score badge
 */
export function getTrustScoreClass(score: number): string {
  if (score >= 80) return "bg-green-500 text-white";
  if (score >= 60) return "bg-green-400 text-white";
  if (score >= 40) return "bg-amber-500 text-white";
  if (score >= 20) return "bg-orange-400 text-white";
  return "bg-red-500 text-white";
}

/**
 * Calculate trust score tier
 */
export function getTrustScoreTier(score: number): "excellent" | "very-good" | "good" | "average" | "poor" {
  if (score >= 80) return "excellent";
  if (score >= 60) return "very-good";
  if (score >= 40) return "good";
  if (score >= 20) return "average";
  return "poor";
}

/**
 * Format trust score for display
 */
export function formatTrustScore(score: number): string {
  return `${Math.round(score)}%`;
}

/**
 * Compare two trust scores
 */
export function compareTrustScores(scoreA: number, scoreB: number): number {
  return scoreB - scoreA; // Higher score first
}

/**
 * Get trust score emoji
 */
export function getTrustScoreEmoji(score: number): string {
  if (score >= 80) return "⭐";
  if (score >= 60) return "✓";
  if (score >= 40) return "○";
  if (score >= 20) return "△";
  return "!";
}

/**
 * Minimum trust score requirements
 */
export const TRUST_SCORE_THRESHOLDS = {
  MINIMUM_FOR_BADGE: 60,
  MINIMUM_FOR_PREMIUM_FEATURES: 70,
  WARNING_THRESHOLD: 30,
  SUSPENSION_THRESHOLD: 20,
} as const;
