/**
 * Phone Masking Utilities for Allo Services CI
 * Anti-leakage Strategy - Pilier 1: Protection Technique
 * 
 * Gère le masquage et la révélation progressive des numéros de téléphone
 * pour protéger les contacts jusqu'à confirmation de réservation.
 */

import { db } from '@/lib/db';

// ==================== TYPES ====================

export interface MaskedPhoneResult {
  maskedPhone: string;
  isRevealed: boolean;
  revealAvailable: boolean;
  revealReason?: string;
}

export interface PhoneMaskingConfig {
  maskBeforeConfirmation: boolean;
  revealOnConfirmation: boolean;
  revealOnCompletion: boolean;
  relayNumberEnabled: boolean;
}

// ==================== CONFIGURATION ====================

const DEFAULT_CONFIG: PhoneMaskingConfig = {
  maskBeforeConfirmation: true,
  revealOnConfirmation: true,
  revealOnCompletion: true,
  relayNumberEnabled: false, // Nécessite un service VoIP
};

// ==================== FONCTIONS PRINCIPALES ====================

/**
 * Masque un numéro de téléphone ivoirien
 * Format: +225 ** ** ** XX (seuls les 2 derniers chiffres visibles)
 * @param phone - Numéro de téléphone complet
 * @returns Numéro masqué
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone) return '';
  
  // Nettoyer le numéro
  const cleaned = phone.replace(/[\s\-\.]/g, '');
  
  // Extraire les chiffres
  const digits = cleaned.replace(/\D/g, '');
  
  if (digits.length < 8) {
    // Numéro trop court, retourner tel quel
    return phone;
  }
  
  // Format ivoirien: 10 chiffres (225 + 8 chiffres) ou 8 chiffres
  if (digits.length === 10) {
    // Format: +225 XX XX XX XX XX → +225 ** ** ** XX XX
    const lastFour = digits.slice(-4);
    return `+225 ** ** ** ${lastFour.slice(0, 2)} ${lastFour.slice(2)}`;
  } else if (digits.length === 8) {
    // Format: XX XX XX XX → ** ** ** XX
    return `** ** ** ${digits.slice(-2)}`;
  } else if (digits.length > 10) {
    // Autre format: garder les 4 derniers
    const lastFour = digits.slice(-4);
    return `+XXX ** ** ** ${lastFour.slice(0, 2)} ${lastFour.slice(2)}`;
  }
  
  return phone;
}

/**
 * Révèle un numéro de téléphone masqué
 * @param reservationId - ID de la réservation
 * @param userId - ID de l'utilisateur demandant la révélation
 * @returns Numéro révélé ou null si non autorisé
 */
export async function revealPhoneForReservation(
  reservationId: string,
  userId: string
): Promise<MaskedPhoneResult> {
  try {
    // Récupérer la réservation
    const reservation = await db.reservation.findUnique({
      where: { id: reservationId },
      include: {
        client: true,
        provider: {
          include: { user: true },
        },
        phoneMasking: true,
      },
    });
    
    if (!reservation) {
      return {
        maskedPhone: '',
        isRevealed: false,
        revealAvailable: false,
        revealReason: 'Réservation non trouvée',
      };
    }
    
    // Vérifier que l'utilisateur est concerné par la réservation
    const isClient = reservation.clientId === userId;
    const isProvider = reservation.provider.userId === userId;
    
    if (!isClient && !isProvider) {
      return {
        maskedPhone: '',
        isRevealed: false,
        revealAvailable: false,
        revealReason: 'Non autorisé',
      };
    }
    
    // Vérifier le statut de la réservation
    const allowedStatuses = ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'];
    const canReveal = allowedStatuses.includes(reservation.status);
    
    if (!canReveal) {
      // Retourner le numéro masqué
      const maskedPhone = maskPhoneNumber(
        isClient ? reservation.provider.user.phone || '' : reservation.client.phone || ''
      );
      return {
        maskedPhone,
        isRevealed: false,
        revealAvailable: false,
        revealReason: 'Numéro disponible après confirmation',
      };
    }
    
    // Révéler le numéro
    const phoneToReveal = isClient 
      ? reservation.provider.user.phone 
      : reservation.client.phone;
    
    // Mettre à jour le log de masquage
    if (reservation.phoneMasking) {
      await db.phoneMasking.update({
        where: { reservationId },
        data: {
          isActive: false,
          revealedAt: new Date(),
          revealReason: 'confirmation',
        },
      });
    }
    
    return {
      maskedPhone: phoneToReveal || '',
      isRevealed: true,
      revealAvailable: true,
    };
  } catch (error) {
    console.error('Erreur lors de la révélation du numéro:', error);
    return {
      maskedPhone: '',
      isRevealed: false,
      revealAvailable: false,
      revealReason: 'Erreur technique',
    };
  }
}

/**
 * Crée un enregistrement de masquage pour une nouvelle réservation
 */
export async function createPhoneMasking(
  reservationId: string,
  clientPhone: string,
  providerPhone: string
): Promise<void> {
  try {
    // Calculer la date d'expiration (24h après la date prévue)
    const reservation = await db.reservation.findUnique({
      where: { id: reservationId },
    });
    
    if (!reservation) return;
    
    const expiresAt = new Date(reservation.scheduledDate);
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    await db.phoneMasking.create({
      data: {
        reservationId,
        clientPhone,
        providerPhone,
        isActive: true,
        expiresAt,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la création du masquage:', error);
  }
}

/**
 * Vérifie si le masquage est encore actif pour une réservation
 */
export async function isPhoneMaskingActive(reservationId: string): Promise<boolean> {
  try {
    const masking = await db.phoneMasking.findUnique({
      where: { reservationId },
    });
    
    if (!masking) return false;
    
    // Vérifier si le masquage est encore actif et non expiré
    return masking.isActive && new Date() < masking.expiresAt;
  } catch {
    return false;
  }
}

/**
 * Génère un numéro relais temporaire (placeholder pour intégration VoIP)
 */
export function generateRelayNumber(): string {
  // Format: +225 800 XXX XXX (plage dédiée aux numéros relais)
  const random = Math.floor(Math.random() * 900000) + 100000;
  return `+225 800 ${String(random).slice(0, 3)} ${String(random).slice(3)}`;
}

/**
 * Nettoie les masquages expirés (à exécuter via cron)
 */
export async function cleanupExpiredMaskings(): Promise<number> {
  try {
    const result = await db.phoneMasking.updateMany({
      where: {
        isActive: true,
        expiresAt: { lt: new Date() },
      },
      data: {
        isActive: false,
      },
    });
    
    return result.count;
  } catch (error) {
    console.error('Erreur lors du nettoyage des masquages:', error);
    return 0;
  }
}

/**
 * Obtient les informations de contact formatées pour affichage
 */
export async function getContactInfoForDisplay(
  reservationId: string,
  viewerId: string
): Promise<{
  providerPhone: string;
  clientPhone: string;
  providerPhoneMasked: string;
  clientPhoneMasked: string;
  canRevealProvider: boolean;
  canRevealClient: boolean;
}> {
  try {
    const reservation = await db.reservation.findUnique({
      where: { id: reservationId },
      include: {
        client: true,
        provider: {
          include: { user: true },
        },
        phoneMasking: true,
      },
    });
    
    if (!reservation) {
      return {
        providerPhone: '',
        clientPhone: '',
        providerPhoneMasked: '',
        clientPhoneMasked: '',
        canRevealProvider: false,
        canRevealClient: false,
      };
    }
    
    const providerPhone = reservation.provider.user.phone || '';
    const clientPhone = reservation.client.phone || '';
    
    const isClient = reservation.clientId === viewerId;
    const isProvider = reservation.provider.userId === viewerId;
    
    const allowedStatuses = ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'];
    const canReveal = allowedStatuses.includes(reservation.status);
    
    return {
      providerPhone: (isClient && canReveal) ? providerPhone : '',
      clientPhone: (isProvider && canReveal) ? clientPhone : '',
      providerPhoneMasked: maskPhoneNumber(providerPhone),
      clientPhoneMasked: maskPhoneNumber(clientPhone),
      canRevealProvider: isClient && canReveal,
      canRevealClient: isProvider && canReveal,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des contacts:', error);
    return {
      providerPhone: '',
      clientPhone: '',
      providerPhoneMasked: '',
      clientPhoneMasked: '',
      canRevealProvider: false,
      canRevealClient: false,
    };
  }
}

// ==================== EXPORTS ====================

export default {
  maskPhoneNumber,
  revealPhoneForReservation,
  createPhoneMasking,
  isPhoneMaskingActive,
  generateRelayNumber,
  cleanupExpiredMaskings,
  getContactInfoForDisplay,
};
