import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/users - Get all users with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const city = searchParams.get("city") || "";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { role: "CLIENT" };

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ];
    }

    if (status && status !== "all") {
      where.status = status;
    }

    if (city && city !== "all") {
      where.city = city;
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          city: true,
          avatarUrl: true,
          status: true,
          createdAt: true,
          _count: {
            select: {
              reservationsAsClient: true,
            },
          },
        },
      }),
      db.user.count({ where }),
    ]);

    // Get total spent for each user
    const usersWithSpending = await Promise.all(
      users.map(async (user) => {
        const payments = await db.payment.aggregate({
          where: {
            userId: user.id,
            status: "success",
          },
          _sum: { amount: true },
        });

        return {
          ...user,
          reservations: user._count.reservationsAsClient,
          totalSpent: payments._sum.amount || 0,
        };
      })
    );

    return NextResponse.json({
      users: usersWithSpending,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des utilisateurs" },
      { status: 500 }
    );
  }
}
