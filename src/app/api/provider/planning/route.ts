import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// ==================== SCHEMAS ====================

const setAvailabilitySchema = z.object({
  providerId: z.string(),
  availabilities: z.array(z.object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    breakStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().nullable(),
    breakEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().nullable(),
    isActive: z.boolean().default(true),
  })),
});

const addExceptionSchema = z.object({
  providerId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  type: z.enum(['vacation', 'sick_leave', 'personal', 'other']),
  reason: z.string().optional(),
});

// ==================== GET AVAILABILITY ====================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');
    const includeExceptions = searchParams.get('exceptions') === 'true';

    if (!providerId) {
      return NextResponse.json(
        { error: 'ID prestataire requis' },
        { status: 400 }
      );
    }

    // Récupérer les disponibilités
    const availabilities = await db.providerAvailability.findMany({
      where: { providerId },
      orderBy: { dayOfWeek: 'asc' },
    });

    const response: Record<string, unknown> = {
      availabilities: availabilities.map(a => ({
        id: a.id,
        dayOfWeek: a.dayOfWeek,
        dayName: getDayName(a.dayOfWeek),
        startTime: a.startTime,
        endTime: a.endTime,
        breakStart: a.breakStart,
        breakEnd: a.breakEnd,
        isActive: a.isActive,
      })),
    };

    // Récupérer les exceptions
    if (includeExceptions) {
      const exceptions = await db.providerAvailabilityException.findMany({
        where: {
          providerId,
          endDate: { gte: new Date() }, // Seulement les futures
        },
        orderBy: { startDate: 'asc' },
      });

      response.exceptions = exceptions.map(e => ({
        id: e.id,
        startDate: e.startDate.toISOString(),
        endDate: e.endDate.toISOString(),
        type: e.type,
        reason: e.reason,
        isApproved: e.isApproved,
      }));
    }

    // Calculer les créneaux disponibles pour les 7 prochains jours
    const availableSlots = await calculateAvailableSlots(providerId, availabilities);
    response.availableSlots = availableSlots;

    return NextResponse.json(response);
  } catch (error) {
    console.error('Availability fetch error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des disponibilités' },
      { status: 500 }
    );
  }
}

// ==================== SET AVAILABILITY ====================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = setAvailabilitySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { providerId, availabilities } = validationResult.data;

    // Supprimer les anciennes disponibilités
    await db.providerAvailability.deleteMany({
      where: { providerId },
    });

    // Créer les nouvelles
    const created = await db.providerAvailability.createMany({
      data: availabilities.map(a => ({
        providerId,
        dayOfWeek: a.dayOfWeek,
        startTime: a.startTime,
        endTime: a.endTime,
        breakStart: a.breakStart || null,
        breakEnd: a.breakEnd || null,
        isActive: a.isActive,
      })),
    });

    return NextResponse.json({
      success: true,
      message: `${created.count} créneau(x) configuré(s)`,
    });
  } catch (error) {
    console.error('Availability set error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la configuration' },
      { status: 500 }
    );
  }
}

// ==================== ADD EXCEPTION ====================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = addExceptionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { providerId, startDate, endDate, type, reason } = validationResult.data;

    const exception = await db.providerAvailabilityException.create({
      data: {
        providerId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        type,
        reason,
      },
    });

    return NextResponse.json({
      success: true,
      exception: {
        id: exception.id,
        startDate: exception.startDate.toISOString(),
        endDate: exception.endDate.toISOString(),
        type: exception.type,
      },
    });
  } catch (error) {
    console.error('Exception add error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout de l\'exception' },
      { status: 500 }
    );
  }
}

// ==================== DELETE EXCEPTION ====================

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exceptionId = searchParams.get('exceptionId');

    if (!exceptionId) {
      return NextResponse.json(
        { error: 'ID exception requis' },
        { status: 400 }
      );
    }

    await db.providerAvailabilityException.delete({
      where: { id: exceptionId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Exception delete error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}

// ==================== HELPER FUNCTIONS ====================

function getDayName(dayOfWeek: number): string {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return days[dayOfWeek] || '';
}

async function calculateAvailableSlots(
  providerId: string,
  availabilities: { dayOfWeek: number; startTime: string; endTime: string; breakStart: string | null; breakEnd: string | null; isActive: boolean }[]
): Promise<{ date: string; slots: string[] }[]> {
  const result: { date: string; slots: string[] }[] = [];
  const now = new Date();

  // Récupérer les réservations existantes
  const reservations = await db.reservation.findMany({
    where: {
      providerId,
      scheduledDate: {
        gte: now,
        lt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
      status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
    },
    select: { scheduledDate: true },
  });

  const reservedDates = new Set(
    reservations.map(r => r.scheduledDate.toISOString().slice(0, 16))
  );

  // Récupérer les exceptions
  const exceptions = await db.providerAvailabilityException.findMany({
    where: {
      providerId,
      endDate: { gte: now },
    },
  });

  // Générer les créneaux pour les 7 prochains jours
  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    const dayOfWeek = date.getDay();

    // Vérifier s'il y a une exception
    const hasException = exceptions.some(e => 
      date >= e.startDate && date <= e.endDate
    );

    if (hasException) {
      result.push({
        date: date.toISOString().split('T')[0],
        slots: [],
      });
      continue;
    }

    // Trouver la disponibilité pour ce jour
    const availability = availabilities.find(a => a.dayOfWeek === dayOfWeek && a.isActive);
    
    if (!availability) {
      result.push({
        date: date.toISOString().split('T')[0],
        slots: [],
      });
      continue;
    }

    // Générer les créneaux (toutes les 2 heures)
    const slots: string[] = [];
    const [startHour] = availability.startTime.split(':').map(Number);
    const [endHour] = availability.endTime.split(':').map(Number);
    const [breakStartHour] = availability.breakStart?.split(':').map(Number) || [-1];
    const [breakEndHour] = availability.breakEnd?.split(':').map(Number) || [-1];

    for (let hour = startHour; hour < endHour; hour += 2) {
      // Vérifier si c'est pendant la pause
      if (hour >= breakStartHour && hour < breakEndHour) continue;

      const slotTime = `${String(hour).padStart(2, '0')}:00`;
      const slotDateTime = `${date.toISOString().split('T')[0]}T${slotTime}`;

      // Vérifier si le créneau est déjà réservé
      if (!reservedDates.has(slotDateTime)) {
        slots.push(slotTime);
      }
    }

    result.push({
      date: date.toISOString().split('T')[0],
      slots,
    });
  }

  return result;
}
