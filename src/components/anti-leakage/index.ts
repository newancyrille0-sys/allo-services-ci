// Anti-leakage Strategy Components and Hooks
// Allo Services CI - Plateforme de mise en relation clients/prestataires

// Components
export {
  ContactDetectionAlert,
  ContactDetectionBadge,
  AntiLeakageInfoTooltip,
  LoyaltyTierBadge,
  PhoneMaskingStatus,
  CashbackInfoCard,
} from './ContactDetectionAlert';

export type {
  DetectionType,
  Severity,
  ContactDetectionAlertProps,
} from './ContactDetectionAlert';

// Hooks
export {
  useLoyalty,
  useContactDetection,
  usePhoneMasking,
  useReferral,
} from '@/hooks/useAntiLeakage';

export type {
  LoyaltyInfo,
  CashbackInfo,
  ContactDetectionResult,
} from '@/hooks/useAntiLeakage';
