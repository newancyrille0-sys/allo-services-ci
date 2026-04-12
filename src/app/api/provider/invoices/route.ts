import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { 
  generateInvoiceNumber, 
  generateInvoiceHTML,
  getMonthlyInvoiceSummary 
} from '@/lib/utils/invoice/generator';

// ==================== SCHEMAS ====================

const createInvoiceSchema = z.object({
  reservationId: z.string(),
});

const updateInvoiceSchema = z.object({
  invoiceId: z.string(),
  status: z.enum(['draft', 'sent', 'paid', 'cancelled']),
});

// ==================== GET INVOICES ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');
    const invoiceId = searchParams.get('invoiceId');
    const status = searchParams.get('status');
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Récupérer une facture spécifique
    if (invoiceId) {
      const invoice = await db.providerInvoice.findUnique({
        where: { id: invoiceId },
        include: {
          reservation: {
            include: {
              service: true,
              client: { select: { fullName: true, phone: true, email: true } },
            },
          },
          provider: {
            include: { user: { select: { fullName: true, phone: true } } },
          },
        },
      });

      if (!invoice) {
        return NextResponse.json(
          { error: 'Facture non trouvée' },
          { status: 404 }
        );
      }

      return NextResponse.json({ invoice });
    }

    // Résumé mensuel
    if (searchParams.get('summary') === 'true' && providerId) {
      const summary = await getMonthlyInvoiceSummary(providerId, year, month);
      return NextResponse.json({ summary });
    }

    if (!providerId) {
      return NextResponse.json(
        { error: 'ID prestataire requis' },
        { status: 400 }
      );
    }

    // Construire la requête
    const whereClause: Record<string, unknown> = { providerId };
    if (status) {
      whereClause.status = status;
    }

    const invoices = await db.providerInvoice.findMany({
      where: whereClause,
      include: {
        reservation: {
          include: {
            service: { select: { name: true } },
            client: { select: { fullName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await db.providerInvoice.count({ where: whereClause });

    // Calculer les totaux
    const totals = await db.providerInvoice.aggregate({
      where: { providerId, status: { not: 'cancelled' } },
      _sum: {
        amount: true,
        commission: true,
        netAmount: true,
      },
    });

    return NextResponse.json({
      invoices: invoices.map(inv => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        serviceName: inv.serviceName,
        serviceDate: inv.serviceDate.toISOString(),
        clientName: inv.reservation.client.fullName,
        amount: inv.amount,
        commission: inv.commission,
        netAmount: inv.netAmount,
        currency: inv.currency,
        status: inv.status,
        dueDate: inv.dueDate.toISOString(),
        createdAt: inv.createdAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      totals: {
        totalAmount: totals._sum.amount || 0,
        totalCommission: totals._sum.commission || 0,
        totalNet: totals._sum.netAmount || 0,
      },
    });
  } catch (error) {
    console.error('Invoice fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des factures' },
      { status: 500 }
    );
  }
}

// ==================== CREATE INVOICE ====================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Générer les factures manquantes
    if (body.action === 'generate_all') {
      const { providerId } = body;
      
      // Trouver les réservations complétées sans facture
      const completedReservations = await db.reservation.findMany({
        where: {
          providerId,
          status: 'COMPLETED',
          providerInvoice: null,
        },
        include: {
          service: true,
          client: true,
          provider: { include: { user: true } },
        },
      });

      let created = 0;
      for (const reservation of completedReservations) {
        try {
          const invoiceNumber = generateInvoiceNumber(providerId);
          const commissionRate = 0.15; // TODO: Use getCommissionRate
          const commission = reservation.priceTotal * commissionRate;
          const netAmount = reservation.priceTotal - commission;
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 30);

          await db.providerInvoice.create({
            data: {
              invoiceNumber,
              providerId,
              reservationId: reservation.id,
              clientId: reservation.clientId,
              serviceName: reservation.service.name,
              serviceDate: reservation.scheduledDate,
              serviceAddress: reservation.address,
              serviceCity: reservation.city,
              amount: reservation.priceTotal,
              commission,
              commissionRate,
              netAmount,
              dueDate,
            },
          });
          created++;
        } catch (e) {
          console.error('Error creating invoice for reservation:', reservation.id, e);
        }
      }

      return NextResponse.json({
        success: true,
        message: `${created} facture(s) créée(s)`,
        created,
      });
    }

    // Créer une facture pour une réservation spécifique
    const validationResult = createInvoiceSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { reservationId } = validationResult.data;

    // Vérifier la réservation
    const reservation = await db.reservation.findUnique({
      where: { id: reservationId },
      include: {
        service: true,
        client: true,
        provider: { include: { user: true } },
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    if (reservation.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'La réservation doit être complétée pour générer une facture' },
        { status: 400 }
      );
    }

    // Vérifier si une facture existe déjà
    const existingInvoice = await db.providerInvoice.findUnique({
      where: { reservationId },
    });

    if (existingInvoice) {
      return NextResponse.json(
        { error: 'Une facture existe déjà pour cette réservation' },
        { status: 400 }
      );
    }

    // Créer la facture
    const invoiceNumber = generateInvoiceNumber(reservation.providerId);
    const commissionRate = 0.15;
    const commission = reservation.priceTotal * commissionRate;
    const netAmount = reservation.priceTotal - commission;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

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
        amount: reservation.priceTotal,
        commission,
        commissionRate,
        netAmount,
        dueDate,
      },
    });

    return NextResponse.json({
      success: true,
      invoice: {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.amount,
        netAmount: invoice.netAmount,
        status: invoice.status,
      },
    });
  } catch (error) {
    console.error('Invoice creation error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la facture' },
      { status: 500 }
    );
  }
}

// ==================== UPDATE INVOICE ====================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = updateInvoiceSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { invoiceId, status } = validationResult.data;

    const updateData: Record<string, unknown> = { status };
    if (status === 'paid') {
      updateData.paidAt = new Date();
    }

    const invoice = await db.providerInvoice.update({
      where: { id: invoiceId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      invoice: {
        id: invoice.id,
        status: invoice.status,
        paidAt: invoice.paidAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error('Invoice update error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

// ==================== EXPORT INVOICE HTML ====================

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('invoiceId');

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'ID facture requis' },
        { status: 400 }
      );
    }

    const invoice = await db.providerInvoice.findUnique({
      where: { id: invoiceId },
      include: {
        reservation: {
          include: {
            service: true,
            client: { select: { fullName: true, phone: true } },
          },
        },
        provider: {
          include: { user: { select: { fullName: true, phone: true } } },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Facture non trouvée' },
        { status: 404 }
      );
    }

    const invoiceData = {
      invoiceNumber: invoice.invoiceNumber,
      providerId: invoice.providerId,
      providerName: invoice.provider.user.fullName || '',
      providerPhone: invoice.provider.user.phone || '',
      clientName: invoice.reservation.client.fullName || '',
      clientPhone: invoice.reservation.client.phone,
      reservationId: invoice.reservationId,
      serviceName: invoice.serviceName,
      serviceDate: invoice.serviceDate,
      address: invoice.serviceAddress,
      city: invoice.serviceCity,
      amount: invoice.amount,
      commission: invoice.commission,
      netAmount: invoice.netAmount,
      currency: invoice.currency,
      status: invoice.status as 'draft' | 'sent' | 'paid' | 'cancelled',
      createdAt: invoice.createdAt,
      dueDate: invoice.dueDate,
    };

    const html = generateInvoiceHTML(invoiceData);

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Invoice export error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'export' },
      { status: 500 }
    );
  }
}
