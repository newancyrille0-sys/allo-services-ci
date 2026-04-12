import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateCommission } from '@/lib/payments/cinetpay';
import { maskPhoneNumber, createPhoneMasking } from '@/lib/utils/phoneMasking';
import { z } from 'zod';

// Validation schema for creating reservation
const createReservationSchema = z.object({
  clientId: z.string().min(1, 'ID client requis'),
  providerId: z.string().min(1, 'ID prestataire requis'),
  serviceId: z.string().min(1, 'ID service requis'),
  scheduledDate: z.string().min(1, 'Date requise'),
  address: z.string().min(1, 'Adresse requise'),
  city: z.string().min(1, 'Ville requise'),
  phoneContact: z.string().optional(),
  notes: z.string().optional(),
  estimatedDuration: z.number().positive().default(1), // hours
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = createReservationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Verify client exists
    const client = await db.user.findUnique({
      where: { id: data.clientId },
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }

    // Verify provider exists and is active
    const provider = await db.provider.findUnique({
      where: { id: data.providerId },
      include: { user: true },
    });

    if (!provider) {
      return NextResponse.json(
        { error: 'Prestataire non trouvé' },
        { status: 404 }
      );
    }

    if (!provider.isActive) {
      return NextResponse.json(
        { error: 'Ce prestataire n\'est pas disponible' },
        { status: 400 }
      );
    }

    // Verify service exists
    const service = await db.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service non trouvé' },
        { status: 404 }
      );
    }

    // Calculate price
    const hourlyRate = provider.hourlyRate || 5000; // Default rate
    const priceTotal = hourlyRate * data.estimatedDuration;
    const { providerAmount, platformFee } = calculateCommission(priceTotal);

    // Create reservation
    const reservation = await db.reservation.create({
      data: {
        clientId: data.clientId,
        providerId: data.providerId,
        serviceId: data.serviceId,
        scheduledDate: new Date(data.scheduledDate),
        address: data.address,
        city: data.city,
        phoneContact: data.phoneContact || client.phone,
        notes: data.notes,
        priceTotal,
        paymentStatus: 'pending',
        status: 'PENDING',
      },
      include: {
        service: true,
        client: {
          select: { id: true, fullName: true, phone: true, avatarUrl: true },
        },
        provider: {
          include: { user: { select: { fullName: true, phone: true } } },
        },
      },
    });

    // ========== ANTI-LEAKAGE: Phone Masking ==========
    // Créer le masquage de téléphone pour cette réservation
    if (client.phone && provider.user.phone) {
      await createPhoneMasking(
        reservation.id,
        client.phone,
        provider.user.phone
      );
    }

    // ========== ANTI-LEAKAGE: Loyalty Points ==========
    // Créer ou mettre à jour les points de fidélité
    const existingLoyaltyPoints = await db.loyaltyPoints.findUnique({
      where: { userId: data.clientId },
    });

    if (!existingLoyaltyPoints) {
      // Créer le compte de fidélité
      await db.loyaltyPoints.create({
        data: {
          userId: data.clientId,
          totalPoints: 0,
          availablePoints: 0,
          pendingPoints: 0,
          tier: 'bronze',
        },
      });
    }

    // ========== ANTI-LEAKAGE: Cashback ==========
    // Créer le cashback différé (5% du montant)
    const cashbackAmount = priceTotal * 0.05;
    const eligibleAt = new Date();
    eligibleAt.setDate(eligibleAt.getDate() + 30); // Disponible après 30 jours

    await db.cashback.create({
      data: {
        userId: data.clientId,
        reservationId: reservation.id,
        amount: cashbackAmount,
        status: 'pending',
        eligibleAt,
      },
    });

    // Create notification for provider
    await db.notification.create({
      data: {
        userId: provider.userId,
        type: 'reservation',
        title: 'Nouvelle réservation',
        message: `Nouvelle demande de réservation pour ${service.name} le ${new Date(data.scheduledDate).toLocaleDateString('fr-FR')}.`,
        actionUrl: `/dashboard/reservations/${reservation.id}`,
      },
    });

    // ========== ANTI-LEAKAGE: Masquer les numéros dans la réponse ==========
    const maskedProviderPhone = maskPhoneNumber(provider.user.phone || '');
    const maskedClientPhone = maskPhoneNumber(client.phone || '');

    return NextResponse.json({
      success: true,
      reservation: {
        id: reservation.id,
        status: reservation.status,
        scheduledDate: reservation.scheduledDate.toISOString(),
        address: reservation.address,
        city: reservation.city,
        priceTotal: reservation.priceTotal,
        providerAmount,
        platformFee,
        service: {
          id: service.id,
          name: service.name,
        },
        provider: {
          id: provider.id,
          businessName: provider.businessName,
          user: {
            fullName: reservation.provider.user.fullName,
            // Numéro masqué avant confirmation
            phone: maskedProviderPhone,
            phoneIsMasked: true,
          },
        },
        client: {
          id: client.id,
          fullName: client.fullName,
          // Numéro masqué pour le prestataire
          phone: maskedClientPhone,
          phoneIsMasked: true,
        },
        createdAt: reservation.createdAt.toISOString(),
      },
      // Anti-leakage info
      antiLeakage: {
        phoneMaskingActive: true,
        cashbackEligible: true,
        cashbackAmount,
        cashbackAvailableAt: eligibleAt.toISOString(),
        message: 'Les numéros de téléphone seront révélés après confirmation de la réservation.',
      },
    });
  } catch (error) {
    console.error('Reservation creation error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la réservation' },
      { status: 500 }
    );
  }
}

// GET endpoint to list reservations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role'); // 'client' or 'provider'
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    if (!userId) {
      return NextResponse.json(
        { error: 'ID utilisateur requis' },
        { status: 400 }
      );
    }

    // Build where clause based on role
    let whereClause: Record<string, unknown> = {};

    if (role === 'provider') {
      const provider = await db.provider.findFirst({
        where: { userId },
      });
      if (!provider) {
        return NextResponse.json(
          { error: 'Prestataire non trouvé' },
          { status: 404 }
        );
      }
      whereClause = { providerId: provider.id };
    } else {
      whereClause = { clientId: userId };
    }

    if (status) {
      whereClause.status = status.toUpperCase();
    }

    // Get reservations
    const reservations = await db.reservation.findMany({
      where: whereClause,
      include: {
        service: true,
        client: {
          select: { id: true, fullName: true, phone: true, avatarUrl: true },
        },
        provider: {
          include: {
            user: { select: { id: true, fullName: true, phone: true, avatarUrl: true } },
          },
        },
        phoneMasking: true,
        cashback: true,
      },
      orderBy: { scheduledDate: 'desc' },
      skip,
      take: limit,
    });

    // Get total count
    const total = await db.reservation.count({ where: whereClause });

    // ========== ANTI-LEAKAGE: Mask phones based on status ==========
    const processedReservations = reservations.map((r) => {
      const canRevealPhone = ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].includes(r.status);
      const isClient = role !== 'provider';
      
      return {
        id: r.id,
        status: r.status,
        scheduledDate: r.scheduledDate.toISOString(),
        address: r.address,
        city: r.city,
        phoneContact: r.phoneContact,
        notes: r.notes,
        priceTotal: r.priceTotal,
        paymentStatus: r.paymentStatus,
        service: r.service,
        client: {
          ...r.client,
          phone: canRevealPhone || !isClient 
            ? r.client.phone 
            : maskPhoneNumber(r.client.phone || ''),
          phoneIsMasked: !canRevealPhone && isClient,
        },
        provider: {
          id: r.provider.id,
          businessName: r.provider.businessName,
          user: {
            ...r.provider.user,
            phone: canRevealPhone || isClient
              ? r.provider.user.phone
              : maskPhoneNumber(r.provider.user.phone || ''),
            phoneIsMasked: !canRevealPhone && !isClient,
          },
        },
        // Anti-leakage info
        cashback: r.cashback ? {
          amount: r.cashback.amount,
          status: r.cashback.status,
          eligibleAt: r.cashback.eligibleAt.toISOString(),
        } : null,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({
      reservations: processedReservations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Reservations fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des réservations' },
      { status: 500 }
    );
  }
}
