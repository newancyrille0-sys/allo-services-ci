import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/client/reservations - List client reservations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const serviceId = searchParams.get("serviceId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // For development, return mock data
    // In production, you would get the userId from the session/auth
    const mockUserId = "client-1";

    const where: Record<string, unknown> = {
      clientId: mockUserId,
    };

    if (status && status !== "all") {
      where.status = status;
    }

    if (serviceId) {
      where.serviceId = serviceId;
    }

    const reservations = await db.reservation.findMany({
      where,
      include: {
        service: {
          select: {
            id: true,
            name: true,
          },
        },
        provider: {
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
      orderBy: {
        scheduledDate: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await db.reservation.count({ where });

    return NextResponse.json({
      reservations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des réservations" },
      { status: 500 }
    );
  }
}

// POST /api/client/reservations - Create a new reservation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      providerId,
      serviceId,
      scheduledDate,
      address,
      city,
      phoneContact,
      notes,
      priceTotal,
    } = body;

    // For development, use mock user ID
    const mockUserId = "client-1";

    // Validate required fields
    if (!providerId || !serviceId || !scheduledDate || !address || !city || !priceTotal) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      );
    }

    const reservation = await db.reservation.create({
      data: {
        clientId: mockUserId,
        providerId,
        serviceId,
        scheduledDate: new Date(scheduledDate),
        address,
        city,
        phoneContact,
        notes,
        priceTotal: parseFloat(priceTotal),
        status: "PENDING",
        paymentStatus: "pending",
      },
      include: {
        service: true,
        provider: {
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la réservation" },
      { status: 500 }
    );
  }
}
