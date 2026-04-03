import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const severity = searchParams.get("severity");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (severity && severity !== "all") {
      where.severity = severity;
    }

    if (status && status !== "all") {
      if (status === "new") {
        where.isResolved = false;
      } else if (status === "investigating") {
        // Would need a status field in the model
        where.isResolved = false;
      } else if (status === "resolved") {
        where.isResolved = true;
      }
    }

    // Get fraud alerts with pagination
    const [alerts, total] = await Promise.all([
      db.fraudLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      }),
      db.fraudLog.count({ where }),
    ]);

    return NextResponse.json({
      alerts: alerts.map((alert) => ({
        id: alert.id,
        userId: alert.userId,
        userName: alert.user?.fullName,
        eventType: alert.eventType,
        severity: alert.severity,
        description: alert.description,
        ipAddress: alert.ipAddress,
        date: alert.createdAt,
        status: alert.isResolved ? "resolved" : "new",
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching fraud alerts:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des alertes" },
      { status: 500 }
    );
  }
}
