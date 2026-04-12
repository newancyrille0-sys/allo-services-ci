/**
 * Invoice Generation Utilities for Allo Services CI
 * Génération automatique de factures professionnelles pour prestataires
 */

import { db } from '@/lib/db';

// ==================== TYPES ====================

export interface InvoiceData {
  invoiceNumber: string;
  providerId: string;
  providerName: string;
  providerPhone: string;
  providerAddress?: string;
  clientName: string;
  clientPhone?: string;
  reservationId: string;
  serviceName: string;
  serviceDate: Date;
  address: string;
  city: string;
  amount: number;
  commission: number;
  netAmount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  createdAt: Date;
  dueDate: Date;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface MonthlyInvoiceSummary {
  month: string;
  year: number;
  totalRevenue: number;
  totalCommission: number;
  netRevenue: number;
  reservationCount: number;
  invoiceCount: number;
}

// ==================== INVOICE NUMBER GENERATION ====================

/**
 * Génère un numéro de facture unique
 * Format: ALLO-YYYYMM-XXXXX
 */
export function generateInvoiceNumber(providerId: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 90000) + 10000;
  
  return `ALLO-${year}${month}-${random}`;
}

// ==================== INVOICE CREATION ====================

/**
 * Crée une facture pour une réservation complétée
 */
export async function createInvoiceForReservation(reservationId: string): Promise<InvoiceData | null> {
  try {
    // Récupérer la réservation
    const reservation = await db.reservation.findUnique({
      where: { id: reservationId },
      include: {
        service: true,
        client: true,
        provider: {
          include: { user: true },
        },
        payments: true,
      },
    });

    if (!reservation || reservation.status !== 'COMPLETED') {
      return null;
    }

    // Vérifier si une facture existe déjà
    const existingInvoice = await db.providerInvoice.findFirst({
      where: { reservationId },
    });

    if (existingInvoice) {
      return null;
    }

    // Calculer les montants
    const amount = reservation.priceTotal;
    const commissionRate = await getCommissionRate(reservation.providerId);
    const commission = amount * commissionRate;
    const netAmount = amount - commission;

    // Générer le numéro de facture
    const invoiceNumber = generateInvoiceNumber(reservation.providerId);

    // Date d'échéance (30 jours)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    // Créer la facture
    const invoice = await db.providerInvoice.create({
      data: {
        invoiceNumber,
        providerId: reservation.providerId,
        reservationId: reservation.id,
        clientId: reservation.clientId,
        serviceName: reservation.service.name,
        serviceDate: reservation.scheduledDate,
        serviceAddress: reservation.address,
        serviceCity: reservation.city,
        amount,
        commission,
        netAmount,
        commissionRate,
        currency: 'XOF',
        status: 'draft',
        dueDate,
      },
    });

    return {
      invoiceNumber: invoice.invoiceNumber,
      providerId: invoice.providerId,
      providerName: reservation.provider.businessName || reservation.provider.user.fullName || '',
      providerPhone: reservation.provider.user.phone || '',
      clientName: reservation.client.fullName || '',
      clientPhone: reservation.client.phone,
      reservationId: reservation.id,
      serviceName: reservation.service.name,
      serviceDate: reservation.scheduledDate,
      address: reservation.address,
      city: reservation.city,
      amount,
      commission,
      netAmount,
      currency: 'XOF',
      status: 'draft',
      createdAt: invoice.createdAt,
      dueDate: invoice.dueDate,
    };
  } catch (error) {
    console.error('Error creating invoice:', error);
    return null;
  }
}

/**
 * Récupère le taux de commission applicable
 */
async function getCommissionRate(providerId: string): Promise<number> {
  // Vérifier le tier de commission
  const currentMonth = new Date();
  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

  const commissionTier = await db.commissionTier.findUnique({
    where: {
      providerId_periodStart: {
        providerId,
        periodStart: monthStart,
      },
    },
  });

  if (commissionTier) {
    return commissionTier.appliedRate;
  }

  // Compter les réservations du mois
  const reservationCount = await db.reservation.count({
    where: {
      providerId,
      status: 'COMPLETED',
      createdAt: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
  });

  // Déterminer le taux
  if (reservationCount >= 31) return 0.10;
  if (reservationCount >= 11) return 0.12;
  return 0.15;
}

// ==================== INVOICE RETRIEVAL ====================

/**
 * Récupère les factures d'un prestataire
 */
export async function getProviderInvoices(
  providerId: string,
  options?: {
    status?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }
): Promise<{ invoices: InvoiceData[]; total: number }> {
  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const skip = (page - 1) * limit;

  const whereClause: Record<string, unknown> = { providerId };

  if (options?.status) {
    whereClause.status = options.status;
  }

  if (options?.startDate || options?.endDate) {
    whereClause.createdAt = {};
    if (options?.startDate) {
      (whereClause.createdAt as Record<string, Date>).gte = options.startDate;
    }
    if (options?.endDate) {
      (whereClause.createdAt as Record<string, Date>).lte = options.endDate;
    }
  }

  const invoices = await db.providerInvoice.findMany({
    where: whereClause,
    include: {
      reservation: {
        include: {
          service: true,
          client: { select: { fullName: true, phone: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
  });

  const total = await db.providerInvoice.count({ where: whereClause });

  return {
    invoices: invoices.map(inv => ({
      invoiceNumber: inv.invoiceNumber,
      providerId: inv.providerId,
      providerName: '',
      providerPhone: '',
      clientName: inv.reservation.client.fullName || '',
      clientPhone: inv.reservation.client.phone,
      reservationId: inv.reservationId,
      serviceName: inv.serviceName,
      serviceDate: inv.serviceDate,
      address: inv.serviceAddress,
      city: inv.serviceCity,
      amount: inv.amount,
      commission: inv.commission,
      netAmount: inv.netAmount,
      currency: inv.currency,
      status: inv.status as 'draft' | 'sent' | 'paid' | 'cancelled',
      createdAt: inv.createdAt,
      dueDate: inv.dueDate,
    })),
    total,
  };
}

/**
 * Génère un résumé mensuel des factures
 */
export async function getMonthlyInvoiceSummary(
  providerId: string,
  year: number,
  month: number
): Promise<MonthlyInvoiceSummary> {
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0);

  const invoices = await db.providerInvoice.findMany({
    where: {
      providerId,
      createdAt: {
        gte: monthStart,
        lte: monthEnd,
      },
      status: { not: 'cancelled' },
    },
  });

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCommission = invoices.reduce((sum, inv) => sum + inv.commission, 0);
  const netRevenue = invoices.reduce((sum, inv) => sum + inv.netAmount, 0);

  return {
    month: monthStart.toLocaleString('fr-FR', { month: 'long' }),
    year,
    totalRevenue,
    totalCommission,
    netRevenue,
    reservationCount: invoices.length,
    invoiceCount: invoices.length,
  };
}

// ==================== INVOICE EXPORT ====================

/**
 * Génère le contenu HTML d'une facture pour impression/PDF
 */
export function generateInvoiceHTML(invoice: InvoiceData): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Facture ${invoice.invoiceNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .logo { font-size: 24px; font-weight: bold; color: #0066CC; }
    .invoice-info { text-align: right; }
    .invoice-number { font-size: 18px; font-weight: bold; }
    .parties { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .party { width: 45%; }
    .party h3 { margin-bottom: 10px; color: #333; }
    .details { margin-bottom: 40px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f5f5f5; }
    .total-row { font-weight: bold; background-color: #f9f9f9; }
    .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
    .status-paid { color: #28a745; }
    .status-pending { color: #ffc107; }
    .amount { text-align: right; }
    .net-amount { font-size: 18px; color: #0066CC; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">🛠️ Allo Services CI</div>
    <div class="invoice-info">
      <div class="invoice-number">Facture ${invoice.invoiceNumber}</div>
      <div>Date: ${invoice.createdAt.toLocaleDateString('fr-FR')}</div>
      <div>Échéance: ${invoice.dueDate.toLocaleDateString('fr-FR')}</div>
      <div class="${invoice.status === 'paid' ? 'status-paid' : 'status-pending'}">
        ${invoice.status === 'paid' ? '✓ PAYÉE' : '⏳ EN ATTENTE'}
      </div>
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <h3>Prestataire</h3>
      <p><strong>${invoice.providerName}</strong></p>
      <p>${invoice.providerPhone}</p>
      <p>${invoice.providerAddress || ''}</p>
    </div>
    <div class="party">
      <h3>Client</h3>
      <p><strong>${invoice.clientName}</strong></p>
      <p>${invoice.clientPhone || ''}</p>
    </div>
  </div>

  <div class="details">
    <h3>Détails de la prestation</h3>
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Date</th>
          <th>Lieu</th>
          <th class="amount">Montant</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${invoice.serviceName}</td>
          <td>${invoice.serviceDate.toLocaleDateString('fr-FR')}</td>
          <td>${invoice.city}</td>
          <td class="amount">${invoice.amount.toLocaleString('fr-FR')} ${invoice.currency}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="details">
    <table>
      <tbody>
        <tr>
          <td><strong>Montant total</strong></td>
          <td class="amount">${invoice.amount.toLocaleString('fr-FR')} ${invoice.currency}</td>
        </tr>
        <tr>
          <td>Commission plateforme (15%)</td>
          <td class="amount">-${invoice.commission.toLocaleString('fr-FR')} ${invoice.currency}</td>
        </tr>
        <tr class="total-row">
          <td><strong>Montant net à percevoir</strong></td>
          <td class="amount net-amount"><strong>${invoice.netAmount.toLocaleString('fr-FR')} ${invoice.currency}</strong></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p>Allo Services CI - Le bon prestataire, au bon moment, près de chez vous</p>
    <p>Côte d'Ivoire | www.alloservices.ci | contact@alloservices.ci</p>
    <p>Cette facture a été générée automatiquement par la plateforme Allo Services CI.</p>
  </div>
</body>
</html>
  `;
}

// ==================== BATCH INVOICE GENERATION ====================

/**
 * Génère les factures pour toutes les réservations complétées sans facture
 */
export async function generateMissingInvoices(providerId?: string): Promise<number> {
  const whereClause: Record<string, unknown> = {
    status: 'COMPLETED',
  };

  if (providerId) {
    whereClause.providerId = providerId;
  }

  // Trouver les réservations complétées sans facture
  const completedReservations = await db.reservation.findMany({
    where: whereClause,
    include: {
      providerInvoice: true,
    },
  });

  const reservationsWithoutInvoice = completedReservations.filter(r => !r.providerInvoice);

  let count = 0;
  for (const reservation of reservationsWithoutInvoice) {
    const result = await createInvoiceForReservation(reservation.id);
    if (result) count++;
  }

  return count;
}
