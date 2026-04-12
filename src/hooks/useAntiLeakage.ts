'use client';

import { useState, useCallback, useEffect } from 'react';

// ==================== TYPES ====================

export interface LoyaltyInfo {
  totalPoints: number;
  availablePoints: number;
  tier: string;
  pointsValue: number;
  multiplier: number;
}

export interface CashbackInfo {
  pending: number;
  available: number;
  totalEarned: number;
}

export interface ContactDetectionResult {
  hasContact: boolean;
  detectedType: string | null;
  severity: 'low' | 'medium' | 'high';
  warningMessage: string;
}

// ==================== USE LOYALTY HOOK ====================

export function useLoyalty(userId: string | null) {
  const [loyalty, setLoyalty] = useState<LoyaltyInfo | null>(null);
  const [cashback, setCashback] = useState<CashbackInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLoyalty = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/loyalty?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch loyalty info');

      const data = await response.json();
      setLoyalty(data.loyalty);
      setCashback(data.cashback);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const earnPoints = useCallback(async (reservationId: string) => {
    if (!userId) return { success: false };

    try {
      const response = await fetch('/api/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'earn',
          userId,
          reservationId,
        }),
      });

      if (!response.ok) throw new Error('Failed to earn points');

      const data = await response.json();
      await fetchLoyalty(); // Refresh data
      return data;
    } catch (err) {
      console.error('Error earning points:', err);
      return { success: false };
    }
  }, [userId, fetchLoyalty]);

  const redeemPoints = useCallback(async (points: number, reservationId?: string) => {
    if (!userId) return { success: false };

    try {
      const response = await fetch('/api/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'redeem',
          userId,
          points,
          reservationId,
        }),
      });

      if (!response.ok) throw new Error('Failed to redeem points');

      const data = await response.json();
      await fetchLoyalty(); // Refresh data
      return data;
    } catch (err) {
      console.error('Error redeeming points:', err);
      return { success: false };
    }
  }, [userId, fetchLoyalty]);

  useEffect(() => {
    fetchLoyalty();
  }, [fetchLoyalty]);

  return {
    loyalty,
    cashback,
    loading,
    error,
    refetch: fetchLoyalty,
    earnPoints,
    redeemPoints,
  };
}

// ==================== USE CONTACT DETECTION HOOK ====================

export function useContactDetection() {
  const [lastDetection, setLastDetection] = useState<ContactDetectionResult | null>(null);

  const detectContacts = useCallback(async (content: string): Promise<ContactDetectionResult> => {
    try {
      const response = await fetch('/api/messages/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        // Fallback to client-side detection
        return detectContactsClientSide(content);
      }

      const data = await response.json();
      setLastDetection(data);
      return data;
    } catch (err) {
      console.error('Error detecting contacts:', err);
      return detectContactsClientSide(content);
    }
  }, []);

  return {
    detectContacts,
    lastDetection,
  };
}

// Client-side fallback detection
function detectContactsClientSide(content: string): ContactDetectionResult {
  // Phone patterns for Côte d'Ivoire
  const phonePatterns = [
    /\+?225\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}/gi,
    /\b(0[1-9]|[1-9])[0-9]{7,8}\b/g,
  ];

  // WhatsApp patterns
  const whatsappPatterns = [
    /wa\.me\/[0-9]+/gi,
    /whatsapp/gi,
  ];

  // Email patterns
  const emailPatterns = [
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  ];

  // Check for WhatsApp
  for (const pattern of whatsappPatterns) {
    if (pattern.test(content)) {
      return {
        hasContact: true,
        detectedType: 'whatsapp',
        severity: 'high',
        warningMessage: '⚠️ Nous avons détecté une mention WhatsApp. Pour votre sécurité, gardez la conversation sur Allo Services.',
      };
    }
  }

  // Check for phone numbers
  for (const pattern of phonePatterns) {
    if (pattern.test(content)) {
      return {
        hasContact: true,
        detectedType: 'phone',
        severity: 'high',
        warningMessage: '⚠️ Un numéro de téléphone a été détecté. Les numéros seront partagés automatiquement après confirmation de la réservation.',
      };
    }
  }

  // Check for emails
  for (const pattern of emailPatterns) {
    if (pattern.test(content)) {
      return {
        hasContact: true,
        detectedType: 'email',
        severity: 'medium',
        warningMessage: '💡 Conseil: Gardez vos échanges sur Allo Services pour bénéficier de notre protection.',
      };
    }
  }

  return {
    hasContact: false,
    detectedType: null,
    severity: 'low',
    warningMessage: '',
  };
}

// ==================== USE PHONE MASKING HOOK ====================

export function usePhoneMasking(reservationId: string | null) {
  const [isMasked, setIsMasked] = useState(true);
  const [canReveal, setCanReveal] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkMaskingStatus = useCallback(async () => {
    if (!reservationId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/reservations/${reservationId}/phone-status`);
      if (response.ok) {
        const data = await response.json();
        setIsMasked(data.isMasked);
        setCanReveal(data.canReveal);
      }
    } catch (err) {
      console.error('Error checking phone masking:', err);
    } finally {
      setLoading(false);
    }
  }, [reservationId]);

  const revealPhone = useCallback(async (userId: string) => {
    if (!reservationId) return { success: false };

    setLoading(true);
    try {
      const response = await fetch(`/api/reservations/${reservationId}/reveal-phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsMasked(!data.isRevealed);
        return data;
      }
      return { success: false };
    } catch (err) {
      console.error('Error revealing phone:', err);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [reservationId]);

  useEffect(() => {
    checkMaskingStatus();
  }, [checkMaskingStatus]);

  return {
    isMasked,
    canReveal,
    loading,
    revealPhone,
    checkMaskingStatus,
  };
}

// ==================== USE REFERRAL HOOK ====================

export function useReferral(userId: string | null) {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalReferrals: 0, totalRewards: 0 });
  const [loading, setLoading] = useState(false);

  const fetchReferralInfo = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/referral?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setReferralCode(data.referralCode);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching referral info:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const useReferralCode = useCallback(async (code: string) => {
    if (!userId) return { success: false };

    try {
      const response = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'use_code',
          referrerId: userId,
          referralCode: code,
        }),
      });

      return response.json();
    } catch (err) {
      console.error('Error using referral code:', err);
      return { success: false };
    }
  }, [userId]);

  useEffect(() => {
    fetchReferralInfo();
  }, [fetchReferralInfo]);

  return {
    referralCode,
    stats,
    loading,
    useReferralCode,
    refetch: fetchReferralInfo,
  };
}

// ==================== EXPORTS ====================

export default {
  useLoyalty,
  useContactDetection,
  usePhoneMasking,
  useReferral,
};
