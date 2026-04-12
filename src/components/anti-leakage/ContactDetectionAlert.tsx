'use client';

import React from 'react';
import { AlertCircle, Shield, Phone, MessageCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// ==================== TYPES ====================

export type DetectionType = 'phone' | 'whatsapp' | 'email' | 'telegram' | 'other';
export type Severity = 'low' | 'medium' | 'high';

export interface ContactDetectionAlertProps {
  detectedType: DetectionType;
  severity: Severity;
  warningMessage: string;
  onDismiss?: () => void;
  onProceed?: () => void;
  className?: string;
}

// ==================== MAIN COMPONENT ====================

export function ContactDetectionAlert({
  detectedType,
  severity,
  warningMessage,
  onDismiss,
  onProceed,
  className,
}: ContactDetectionAlertProps) {
  const getAlertStyles = () => {
    switch (severity) {
      case 'high':
        return 'border-amber-500 bg-amber-50 dark:bg-amber-950/20';
      case 'medium':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950/20';
      default:
        return 'border-gray-500 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  const getIcon = () => {
    switch (detectedType) {
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getBadgeVariant = () => {
    switch (severity) {
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getBadgeLabel = () => {
    switch (detectedType) {
      case 'phone':
        return 'Numéro détecté';
      case 'whatsapp':
        return 'WhatsApp détecté';
      case 'email':
        return 'Email détecté';
      case 'telegram':
        return 'Telegram détecté';
      default:
        return 'Contact détecté';
    }
  };

  return (
    <Alert className={cn(getAlertStyles(), className)}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <AlertTitle className="text-sm font-semibold">
              Sécurité Allo Services
            </AlertTitle>
            <Badge variant={getBadgeVariant()} className="text-xs">
              {getBadgeLabel()}
            </Badge>
          </div>
          <AlertDescription className="text-sm text-muted-foreground whitespace-pre-line">
            {warningMessage}
          </AlertDescription>
          {severity === 'high' && (
            <div className="flex items-center gap-2 mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={onDismiss}
              >
                Modifier mon message
              </Button>
              <Button
                size="sm"
                onClick={onProceed}
              >
                Envoyer quand même
              </Button>
            </div>
          )}
        </div>
      </div>
    </Alert>
  );
}

// ==================== COMPACT VERSION ====================

export function ContactDetectionBadge({
  detectedType,
  severity,
}: {
  detectedType: DetectionType;
  severity: Severity;
}) {
  const getStyles = () => {
    switch (severity) {
      case 'high':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', getStyles())}>
      <Shield className="h-3 w-3" />
      Contact détecté
    </span>
  );
}

// ==================== INFO TOOLTIP ====================

export function AntiLeakageInfoTooltip() {
  return (
    <div className="p-4 max-w-sm bg-white dark:bg-gray-900 rounded-lg shadow-lg border">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="h-5 w-5 text-primary" />
        <h4 className="font-semibold">Protection de vos données</h4>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Pour votre sécurité, nous détectons automatiquement les échanges de coordonnées.
      </p>
      <ul className="text-sm space-y-2">
        <li className="flex items-start gap-2">
          <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <span>Les numéros sont masqués jusqu'à confirmation</span>
        </li>
        <li className="flex items-start gap-2">
          <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <span>Les prestations hors plateforme ne sont pas assurées</span>
        </li>
        <li className="flex items-start gap-2">
          <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <span>Vous bénéficiez d'une garantie satisfait ou remboursé</span>
        </li>
      </ul>
    </div>
  );
}

// ==================== LOYALTY BADGE ====================

export function LoyaltyTierBadge({ tier }: { tier: string }) {
  const getTierStyles = () => {
    switch (tier) {
      case 'platinum':
        return 'bg-gradient-to-r from-slate-300 to-slate-500 text-slate-900';
      case 'gold':
        return 'bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900';
      case 'silver':
        return 'bg-gradient-to-r from-gray-200 to-gray-400 text-gray-900';
      default:
        return 'bg-gradient-to-r from-amber-600 to-amber-800 text-amber-50';
    }
  };

  const getTierLabel = () => {
    switch (tier) {
      case 'platinum':
        return '🪙 Platinum';
      case 'gold':
        return '🥇 Gold';
      case 'silver':
        return '🥈 Silver';
      default:
        return '🥉 Bronze';
    }
  };

  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold',
      getTierStyles()
    )}>
      {getTierLabel()}
    </span>
  );
}

// ==================== PHONE MASKING STATUS ====================

export function PhoneMaskingStatus({ 
  isMasked, 
  canReveal,
  onRevealRequest 
}: { 
  isMasked: boolean;
  canReveal: boolean;
  onRevealRequest?: () => void;
}) {
  if (!isMasked) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <Shield className="h-5 w-5 text-blue-500" />
      <div className="flex-1">
        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
          Numéro masqué
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400">
          Disponible après confirmation de la réservation
        </p>
      </div>
      {canReveal && onRevealRequest && (
        <Button size="sm" variant="outline" onClick={onRevealRequest}>
          Révéler
        </Button>
      )}
    </div>
  );
}

// ==================== CASHBACK INFO ====================

export function CashbackInfoCard({
  amount,
  status,
  eligibleAt,
}: {
  amount: number;
  status: string;
  eligibleAt?: string;
}) {
  const getStatusColor = () => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-50 dark:bg-green-950/20';
      case 'pending':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-950/20';
      case 'used':
        return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className={cn('p-3 rounded-lg', getStatusColor())}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Cashback</p>
          <p className="text-lg font-bold">{amount.toLocaleString('fr-FR')} FCFA</p>
        </div>
        <Badge variant={status === 'available' ? 'default' : 'secondary'}>
          {status === 'available' ? 'Disponible' : 
           status === 'pending' ? 'En attente' : 'Utilisé'}
        </Badge>
      </div>
      {status === 'pending' && eligibleAt && (
        <p className="text-xs mt-1 opacity-75">
          Disponible le {new Date(eligibleAt).toLocaleDateString('fr-FR')}
        </p>
      )}
    </div>
  );
}

// ==================== EXPORTS ====================

export default {
  ContactDetectionAlert,
  ContactDetectionBadge,
  AntiLeakageInfoTooltip,
  LoyaltyTierBadge,
  PhoneMaskingStatus,
  CashbackInfoCard,
};
