/**
 * CinetPay API Integration for Allo Services CI
 * Supports Orange Money, MTN Money, Wave, Moov Money, and Card payments
 */

// Payment method configurations for Côte d'Ivoire
export const PAYMENT_METHODS = {
  ORANGE_MONEY: {
    name: 'Orange Money',
    code: 'OM',
    color: '#FF7900',
    ussd: '#144#',
    logo: '/images/payments/orange-money.png'
  },
  MTN_MONEY: {
    name: 'MTN Money',
    code: 'MM',
    color: '#FFCC00',
    ussd: '*133#',
    logo: '/images/payments/mtn-money.png'
  },
  WAVE: {
    name: 'Wave',
    code: 'WAVE',
    color: '#1DC0F5',
    ussd: 'App Wave',
    logo: '/images/payments/wave.png'
  },
  MOOV_MONEY: {
    name: 'Moov Money',
    code: 'MOOV',
    color: '#0066CC',
    ussd: '#155#',
    logo: '/images/payments/moov-money.png'
  },
  CARD: {
    name: 'Carte Bancaire',
    code: 'CARD',
    color: '#1A1A1A',
    ussd: null,
    logo: '/images/payments/card.png'
  }
} as const;

export type PaymentMethodKey = keyof typeof PAYMENT_METHODS;

// CinetPay API Configuration
interface CinetPayConfig {
  apiKey: string;
  siteId: string;
  baseUrl: string;
  notifyUrl: string;
  returnUrl: string;
}

// Get CinetPay configuration from environment
function getCinetPayConfig(): CinetPayConfig {
  return {
    apiKey: process.env.CINETPAY_API_KEY || 'demo_api_key',
    siteId: process.env.CINETPAY_SITE_ID || 'demo_site_id',
    baseUrl: process.env.CINETPAY_BASE_URL || 'https://api.cinetpay.com/v2',
    notifyUrl: process.env.CINETPAY_NOTIFY_URL || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/webhook`,
    returnUrl: process.env.CINETPAY_RETURN_URL || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/callback`,
  };
}

// Payment initialization parameters
export interface InitializePaymentParams {
  amount: number;
  currency: string;
  paymentMethod: string;
  phone?: string;
  userId: string;
  type: 'subscription' | 'reservation';
  metadata?: Record<string, unknown>;
  description?: string;
}

// Payment initialization result
export interface InitializePaymentResult {
  transactionId: string;
  paymentUrl?: string;
  qrCode?: string;
  ussdCode?: string;
}

// Payment verification result
export interface VerifyPaymentResult {
  status: 'success' | 'pending' | 'failed';
  amount: number;
  paidAt?: Date;
  paymentMethod?: string;
  transactionId?: string;
  errorCode?: string;
  errorMessage?: string;
}

// Generate a unique transaction ID
function generateTransactionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `ASP${timestamp}${random}`.toUpperCase();
}

// Validate Ivory Coast phone number
export function isValidCIPhone(phone: string): boolean {
  // Remove spaces and dashes
  const cleanPhone = phone.replace(/[\s-]/g, '');
  // Ivory Coast phone numbers: +225 followed by 10 digits (new format) or 8 digits (old format)
  const ciPhoneRegex = /^(\+225|225)?(0?[57])(\d{8}|\d{9})$/;
  return ciPhoneRegex.test(cleanPhone);
}

// Format phone number for CinetPay
export function formatPhoneForCinetPay(phone: string): string {
  // Remove all non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '');
  // Add country code if not present
  if (cleanPhone.startsWith('225')) {
    return cleanPhone;
  }
  return `225${cleanPhone}`;
}

// Get payment method code for CinetPay
function getCinetPayMethodCode(method: string): string {
  const methodMap: Record<string, string> = {
    'orange_money': 'OM',
    'mtn_money': 'MM',
    'wave': 'WAVE',
    'moov': 'MOOV',
    'card': 'CARD',
    'OM': 'OM',
    'MM': 'MM',
    'WAVE': 'WAVE',
    'MOOV': 'MOOV',
    'CARD': 'CARD',
  };
  return methodMap[method] || method;
}

/**
 * Initialize a payment transaction with CinetPay
 */
export async function initializePayment(params: InitializePaymentParams): Promise<InitializePaymentResult> {
  const config = getCinetPayConfig();
  const transactionId = generateTransactionId();

  // For mobile money payments, validate phone number
  if (params.paymentMethod !== 'card' && params.paymentMethod !== 'CARD') {
    if (!params.phone) {
      throw new Error('Numéro de téléphone requis pour le paiement mobile');
    }
    if (!isValidCIPhone(params.phone)) {
      throw new Error('Numéro de téléphone invalide');
    }
  }

  try {
    // Prepare CinetPay request
    const cinetPayData = {
      apikey: config.apiKey,
      site_id: config.siteId,
      transaction_id: transactionId,
      amount: params.amount,
      currency: params.currency || 'XOF',
      description: params.description || `Paiement Allo Services CI - ${params.type}`,
      customer_id: params.userId,
      customer_name: 'Client', // Should be fetched from user data
      customer_surname: 'AlloServices',
      customer_email: '', // Should be fetched from user data
      customer_phone_number: params.phone ? formatPhoneForCinetPay(params.phone) : '',
      customer_address: 'Abidjan',
      customer_city: 'Abidjan',
      customer_country: 'CI',
      customer_state: 'CI',
      customer_zip_code: '00225',
      notify_url: config.notifyUrl,
      return_url: config.returnUrl,
      channels: getCinetPayMethodCode(params.paymentMethod),
      metadata: JSON.stringify(params.metadata || {}),
    };

    // In production, make actual API call to CinetPay
    // For development/demo, we simulate the response
    if (process.env.NODE_ENV === 'development' && !process.env.CINETPAY_API_KEY) {
      // Simulated response for development
      const paymentMethod = PAYMENT_METHODS[params.paymentMethod.toUpperCase() as PaymentMethodKey] || PAYMENT_METHODS.CARD;

      return {
        transactionId,
        paymentUrl: `${config.returnUrl}?transaction_id=${transactionId}`,
        ussdCode: paymentMethod.ussd || undefined,
      };
    }

    // Production API call
    const response = await fetch(`${config.baseUrl}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cinetPayData),
    });

    const data = await response.json();

    if (data.code !== '201' && data.code !== '200') {
      throw new Error(data.message || 'Erreur lors de l\'initialisation du paiement');
    }

    return {
      transactionId,
      paymentUrl: data.data?.payment_url,
      qrCode: data.data?.qr_code,
      ussdCode: params.paymentMethod !== 'card' ? PAYMENT_METHODS[params.paymentMethod.toUpperCase() as PaymentMethodKey]?.ussd : undefined,
    };
  } catch (error) {
    console.error('Payment initialization error:', error);
    throw error;
  }
}

/**
 * Verify payment status with CinetPay
 */
export async function verifyPayment(transactionId: string): Promise<VerifyPaymentResult> {
  const config = getCinetPayConfig();

  try {
    // In development mode, simulate verification
    if (process.env.NODE_ENV === 'development' && !process.env.CINETPAY_API_KEY) {
      // Simulate different statuses for testing
      const statuses: Array<'success' | 'pending' | 'failed'> = ['success', 'pending', 'failed'];
      const randomStatus = statuses[Math.floor(Math.random() * 3)];

      return {
        status: randomStatus,
        amount: 0, // Would be fetched from our database
        paidAt: randomStatus === 'success' ? new Date() : undefined,
        transactionId,
      };
    }

    // Production API call
    const response = await fetch(`${config.baseUrl}/payment/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apikey: config.apiKey,
        site_id: config.siteId,
        transaction_id: transactionId,
      }),
    });

    const data = await response.json();

    if (data.code !== '200' && data.code !== '201') {
      return {
        status: 'failed',
        amount: 0,
        transactionId,
        errorCode: data.code?.toString(),
        errorMessage: data.message,
      };
    }

    const paymentData = data.data;
    let status: 'success' | 'pending' | 'failed' = 'pending';

    // Map CinetPay status to our status
    if (paymentData?.status === 'ACCEPTED' || paymentData?.status === 'SUCCESS') {
      status = 'success';
    } else if (paymentData?.status === 'PENDING' || paymentData?.status === 'WAITING') {
      status = 'pending';
    } else {
      status = 'failed';
    }

    return {
      status,
      amount: parseFloat(paymentData?.amount || '0'),
      paidAt: status === 'success' ? new Date(paymentData?.payment_date) : undefined,
      paymentMethod: paymentData?.payment_method,
      transactionId,
    };
  } catch (error) {
    console.error('Payment verification error:', error);
    return {
      status: 'failed',
      amount: 0,
      transactionId,
      errorMessage: error instanceof Error ? error.message : 'Erreur de vérification',
    };
  }
}

/**
 * Calculate platform commission (15%)
 */
export function calculateCommission(amount: number): { providerAmount: number; platformFee: number; totalAmount: number } {
  const COMMISSION_RATE = 0.15; // 15%
  const platformFee = Math.round(amount * COMMISSION_RATE);
  const providerAmount = amount - platformFee;

  return {
    providerAmount,
    platformFee,
    totalAmount: amount,
  };
}

/**
 * Get subscription price
 */
export function getSubscriptionPrice(plan: 'FREE' | 'MONTHLY' | 'PREMIUM'): number {
  const prices: Record<string, number> = {
    FREE: 0,
    MONTHLY: 15000,
    PREMIUM: 50000,
  };
  return prices[plan] || 0;
}

/**
 * Validate payment method for amount
 */
export function validatePaymentMethod(method: string, amount: number): { valid: boolean; message?: string } {
  // Mobile money limits in CFA
  const limits: Record<string, { min: number; max: number }> = {
    OM: { min: 100, max: 1000000 },
    MM: { min: 100, max: 1000000 },
    WAVE: { min: 100, max: 2000000 },
    MOOV: { min: 100, max: 500000 },
    CARD: { min: 100, max: 10000000 },
  };

  const methodCode = getCinetPayMethodCode(method);
  const limit = limits[methodCode];

  if (!limit) {
    return { valid: false, message: 'Méthode de paiement non supportée' };
  }

  if (amount < limit.min) {
    return { valid: false, message: `Montant minimum: ${limit.min.toLocaleString()} FCFA` };
  }

  if (amount > limit.max) {
    return { valid: false, message: `Montant maximum: ${limit.max.toLocaleString()} FCFA pour ${PAYMENT_METHODS[methodCode as PaymentMethodKey]?.name || method}` };
  }

  return { valid: true };
}

/**
 * Process webhook notification from CinetPay
 */
export async function processWebhook(data: Record<string, unknown>): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  try {
    const transactionId = data.transaction_id as string;
    const status = data.status as string;
    const amount = parseFloat(data.amount as string || '0');
    const paymentMethod = data.payment_method as string;
    const metadata = data.metadata ? JSON.parse(data.metadata as string) : {};

    if (!transactionId) {
      return { success: false, error: 'Transaction ID missing' };
    }

    return {
      success: true,
      transactionId,
    };
  } catch (error) {
    console.error('Webhook processing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
