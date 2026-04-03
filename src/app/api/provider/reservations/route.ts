import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/provider/reservations - List provider reservations
export async function GET(request: NextRequest) {
  try {
    const providerId = "provider-1"; // Mock provider ID
    const searchParams = request.nextUrl.searchParams;

    const status = searchParams.get("status");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const serviceId = searchParams.get("serviceId");

    const whereClause: Record<string, unknown> = { providerId };

    if (status && status !== "all") {
      whereClause.status = status;
    }

    if (from || to) {
      whereClause.scheduledDate = {};
      if (from) {
        (whereClause.scheduledDate as Record<string, unknown>).gte = new Date(from);
      }
      if (to) {
        (whereClause.scheduledDate as Record<string, unknown>).lte = new Date(to);
      }
    }

    if (serviceId) {
      whereClause.serviceId = serviceId;
    }

    const reservations = await db.reservation.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            avatar: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
      orderBy: { scheduledDate: "desc" },
    });

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}
