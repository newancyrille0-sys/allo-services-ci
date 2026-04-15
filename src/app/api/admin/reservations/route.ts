import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/reservations - Get all reservations with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (dateFrom || dateTo) {
      where.scheduledDate = {};
      if (dateFrom) {
        where.scheduledDate.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.scheduledDate.lte = new Date(dateTo);
      }
    }

    if (search) {
      where.OR = [
        { client: { fullName: { contains: search, mode: "insensitive" } } },
        { client: { email: { contains: search, mode: "insensitive" } } },
        { provider: { user: { fullName: { contains: search, mode: "insensitive" } } } },
        { service: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Get reservations with pagination
    const [reservations, total] = await Promise.all([
      db.reservation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          client: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              avatarUrl: true,
            },
          },
          provider: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  phone: true,
                  avatarUrl: true,
                },
              },
            },
          },
          service: {
            select: { id: true, name: true },
          },
          review: {
            select: { id: true, rating: true },
          },
          payments: {
            where: { status: "success" },
            select: { id: true, amount: true, paymentMethod: true },
          },
        },
      }),
      db.reservation.count({ where }),
    ]);

    const formattedReservations = reservations.map((reservation) => ({
      id: reservation.id,
      status: reservation.status,
      scheduledDate: reservation.scheduledDate.toISOString(),
      address: reservation.address,
      city: reservation.city,
      notes: reservation.notes,
      priceTotal: reservation.priceTotal,
      paymentStatus: reservation.paymentStatus,
      createdAt: reservation.createdAt.toISOString(),
      client: reservation.client,
      provider: {
        id: reservation.provider.id,
        ...reservation.provider.user,
      },
      service: reservation.service,
      review: reservation.review,
      payment: reservation.payments[0] || null,
    }));

    return NextResponse.json({
      items: formattedReservations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
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
