/**
 * Contact Detection Utilities for Allo Services CI
 * Anti-leakage Strategy - Pilier 1: Protection Technique
 * 
 * Détecte automatiquement les tentatives d'échange de coordonnées
 * dans les messages entre clients et prestataires.
 */

// ==================== TYPES ====================

export interface ContactDetectionResult {
  hasContact: boolean;
  detectedType: 'phone' | 'whatsapp' | 'email' | 'telegram' | 'other' | null;
  detectedPattern: string;
  matchedText: string;
  severity: 'low' | 'medium' | 'high';
  maskedContent: string;
  warningMessage: string;
}

export interface DetectionStats {
  totalDetections: number;
  phoneDetections: number;
  whatsappDetections: number;
  emailDetections: number;
  telegramDetections: number;
  otherDetections: number;
}

// ==================== PATTERNS DE DÉTECTION ====================

// Numéros de téléphone Côte d'Ivoire
// Formats: +225, 225, 01, 05, 07, 08, 09 suivis de 8 chiffres
const IVORY_COAST_PHONE_PATTERNS = [
  // Format international: +225 XX XX XX XX XX
  /\+?225\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}/gi,
  // Format local avec indicatifs: 01, 05, 07, 08, 09
  /\b(0[1-9]|[1-9])[0-9]{7,8}\b/g,
  // Format avec espaces: XX XX XX XX
  /\b[0-9]{2}\s[0-9]{2}\s[0-9]{2}\s[0-9]{2}\b/g,
  // Format avec tirets: XX-XX-XX-XX
  /\b[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}\b/g,
  // Format compact: 10 chiffres consécutifs
  /\b[0-9]{10}\b/g,
];

// Liens WhatsApp
const WHATSAPP_PATTERNS = [
  // Liens wa.me
  /wa\.me\/[0-9]+/gi,
  // Liens api.whatsapp.com
  /api\.whatsapp\.com\/send\?phone=[0-9]+/gi,
  // Liens chat.whatsapp.com
  /chat\.whatsapp\.com\/[A-Za-z0-9]+/gi,
  // Mentions "whatsapp" avec numéro
  /whatsapp\s*:?\s*[0-9+]+/gi,
  /wa\s*:?\s*[0-9+]+/gi,
  // Numéro avec mention whatsapp
  /sur\s*whatsapp/gi,
  /par\s*whatsapp/gi,
  /via\s*whatsapp/gi,
  /mon\s*whatsapp/gi,
];

// Adresses email
const EMAIL_PATTERNS = [
  // Email standard
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  // Email avec "at" ou "arobase"
  /[A-Za-z0-9._%+-]+\s*(?:at|@|arobase)\s*[A-Za-z0-9.-]+\s*(?:dot|point|\.)\s*[a-z]{2,}/gi,
];

// Usernames Telegram
const TELEGRAM_PATTERNS = [
  // @username
  /@[A-Za-z0-9_]{5,}/g,
  // t.me/username
  /t\.me\/[A-Za-z0-9_]+/gi,
  // telegram.me/username
  /telegram\.me\/[A-Za-z0-9_]+/gi,
  // Mentions "telegram"
  /sur\s*telegram/gi,
  /mon\s*telegram/gi,
  /via\s*telegram/gi,
];

// Autres patterns suspects
const OTHER_CONTACT_PATTERNS = [
  // Facebook
  /facebook\.com\/[A-Za-z0-9.]+/gi,
  /fb\.com\/[A-Za-z0-9.]+/gi,
  /mon\s*facebook/gi,
  // Instagram
  /instagram\.com\/[A-Za-z0-9_.]+/gi,
  /mon\s*instagram/gi,
  // Liens suspects
  /appelle[- ]?moi/gi,
  /mon\s*num/gi,
  /mon\s*téléphone/gi,
  /contacte[- ]?moi/gi,
  /appelez[- ]?moi/gi,
  /voici\s*mon\s*num/gi,
];

// ==================== FONCTIONS PRINCIPALES ====================

/**
 * Détecte les contacts dans un message
 * @param content - Contenu du message à analyser
 * @returns Résultat de la détection
 */
export function detectContacts(content: string): ContactDetectionResult {
  // Vérifier d'abord les patterns WhatsApp (priorité haute)
  for (const pattern of WHATSAPP_PATTERNS) {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      return {
        hasContact: true,
        detectedType: 'whatsapp',
        detectedPattern: pattern.source,
        matchedText: matches[0],
        severity: 'high',
        maskedContent: maskContact(content, matches[0], 'whatsapp'),
        warningMessage: getWarningMessage('whatsapp'),
      };
    }
  }

  // Vérifier les numéros de téléphone (priorité haute)
  for (const pattern of IVORY_COAST_PHONE_PATTERNS) {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      // Filtrer les faux positifs (codes courts, etc.)
      const validPhone = matches.find(m => isValidPhoneNumber(m));
      if (validPhone) {
        return {
          hasContact: true,
          detectedType: 'phone',
          detectedPattern: pattern.source,
          matchedText: validPhone,
          severity: 'high',
          maskedContent: maskContact(content, validPhone, 'phone'),
          warningMessage: getWarningMessage('phone'),
        };
      }
    }
  }

  // Vérifier les emails (priorité moyenne)
  for (const pattern of EMAIL_PATTERNS) {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      return {
        hasContact: true,
        detectedType: 'email',
        detectedPattern: pattern.source,
        matchedText: matches[0],
        severity: 'medium',
        maskedContent: maskContact(content, matches[0], 'email'),
        warningMessage: getWarningMessage('email'),
      };
    }
  }

  // Vérifier Telegram (priorité moyenne)
  for (const pattern of TELEGRAM_PATTERNS) {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      return {
        hasContact: true,
        detectedType: 'telegram',
        detectedPattern: pattern.source,
        matchedText: matches[0],
        severity: 'medium',
        maskedContent: maskContact(content, matches[0], 'telegram'),
        warningMessage: getWarningMessage('telegram'),
      };
    }
  }

  // Vérifier autres patterns (priorité basse)
  for (const pattern of OTHER_CONTACT_PATTERNS) {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      return {
        hasContact: true,
        detectedType: 'other',
        detectedPattern: pattern.source,
        matchedText: matches[0],
        severity: 'low',
        maskedContent: content,
        warningMessage: getWarningMessage('other'),
      };
    }
  }

  // Aucun contact détecté
  return {
    hasContact: false,
    detectedType: null,
    detectedPattern: '',
    matchedText: '',
    severity: 'low',
    maskedContent: content,
    warningMessage: '',
  };
}

/**
 * Vérifie si une chaîne est un numéro de téléphone valide
 */
function isValidPhoneNumber(text: string): boolean {
  // Supprimer les espaces et tirets
  const cleaned = text.replace(/[\s\-\.]/g, '');
  
  // Vérifier la longueur (8 à 12 chiffres pour CI)
  const digitsOnly = cleaned.replace(/\D/g, '');
  if (digitsOnly.length < 8 || digitsOnly.length > 12) {
    return false;
  }
  
  // Vérifier que c'est bien un numéro (pas juste des chiffres aléatoires)
  const phoneRegex = /^(\+?225)?(0[1-9]|[1-9])[0-9]{7,8}$/;
  return phoneRegex.test(digitsOnly);
}

/**
 * Masque un contact dans le contenu
 */
function maskContact(content: string, contact: string, type: string): string {
  switch (type) {
    case 'phone':
      // Masquer partiellement: +225 ** ** ** 45
      const digits = contact.replace(/\D/g, '');
      if (digits.length >= 8) {
        const lastDigits = digits.slice(-2);
        const masked = `${digits.slice(0, -4)} ** ** ${lastDigits}`;
        return content.replace(contact, masked);
      }
      return content.replace(contact, '[numéro masqué]');
    
    case 'whatsapp':
      return content.replace(contact, '[lien WhatsApp masqué]');
    
    case 'email':
      // Masquer partiellement: j***@example.com
      const [localPart, domain] = contact.split('@');
      if (localPart && domain) {
        const maskedLocal = localPart[0] + '***';
        const masked = `${maskedLocal}@${domain}`;
        return content.replace(contact, masked);
      }
      return content.replace(contact, '[email masqué]');
    
    case 'telegram':
      return content.replace(contact, '@[username masqué]');
    
    default:
      return content;
  }
}

/**
 * Retourne le message d'avertissement approprié
 */
function getWarningMessage(type: string): string {
  const messages: Record<string, string> = {
    phone: `⚠️ Pour votre sécurité, nous vous recommandons d'éviter de partager votre numéro de téléphone avant la confirmation de la réservation. 

Les prestations effectuées hors plateforme ne bénéficient pas de :
• Notre assurance Allo Services (2 agents gratuits si mauvais travail)
• La médiation gratuite en cas de litige
• Le programme de fidélité et réductions
• Le cashback 5% sur chaque service

Vos coordonnées seront automatiquement partagées après confirmation.`,
    
    whatsapp: `⚠️ Nous avons détecté un lien WhatsApp dans votre message.

Pour votre sécurité, gardez la conversation sur Allo Services jusqu'à la confirmation de la réservation. Vous bénéficierez ainsi de :
• Protection de vos données personnelles
• Historique de conversation sécurisé
• Assurance Allo Services (2 agents gratuits si problème)
• Support client disponible 24/7`,
    
    email: `💡 Conseil : Gardez vos échanges sur la plateforme Allo Services pour bénéficier de notre protection et assurance exclusive.`,
    
    telegram: `💡 Conseil : Pour une meilleure protection, utilisez la messagerie intégrée d'Allo Services jusqu'à la confirmation de votre réservation.`,
    
    other: `💡 Les coordonnées seront automatiquement partagées après confirmation de la réservation pour garantir votre sécurité.`,
  };
  
  return messages[type] || messages.other;
}

/**
 * Détecte et log les contacts pour analyse
 */
export function logContactDetection(
  detection: ContactDetectionResult,
  senderId: string,
  receiverId: string,
  reservationId?: string
): {
  shouldBlock: boolean;
  shouldWarn: boolean;
  action: 'allow' | 'warn' | 'block';
} {
  // Déterminer l'action basée sur la sévérité
  if (detection.severity === 'high') {
    return {
      shouldBlock: false, // On ne bloque pas, on avertit
      shouldWarn: true,
      action: 'warn',
    };
  }
  
  if (detection.severity === 'medium') {
    return {
      shouldBlock: false,
      shouldWarn: true,
      action: 'warn',
    };
  }
  
  // Sévérité basse: on laisse passer avec un message discret
  return {
    shouldBlock: false,
    shouldWarn: false,
    action: 'allow',
  };
}

/**
 * Analyse un lot de messages pour statistiques
 */
export function analyzeMessages(messages: string[]): DetectionStats {
  const stats: DetectionStats = {
    totalDetections: 0,
    phoneDetections: 0,
    whatsappDetections: 0,
    emailDetections: 0,
    telegramDetections: 0,
    otherDetections: 0,
  };
  
  for (const message of messages) {
    const detection = detectContacts(message);
    if (detection.hasContact) {
      stats.totalDetections++;
      switch (detection.detectedType) {
        case 'phone':
          stats.phoneDetections++;
          break;
        case 'whatsapp':
          stats.whatsappDetections++;
          break;
        case 'email':
          stats.emailDetections++;
          break;
        case 'telegram':
          stats.telegramDetections++;
          break;
        default:
          stats.otherDetections++;
      }
    }
  }
  
  return stats;
}

// ==================== EXPORTS ====================

export default {
  detectContacts,
  logContactDetection,
  analyzeMessages,
};
