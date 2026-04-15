import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Récupérer les partenaires actifs pour l'affichage public
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location"); // home, publicite, dashboard
    const includeNotification = searchParams.get("includeNotification") === "true";

    const now = new Date();
    
    let where: any = {
      isActive: true,
      OR: [
        { startDate: null },
        { startDate: { lte: now } }
      ],
    };

    // Filtrer par localisation
    if (location === "home") {
      where.showOnHome = true;
    } else if (location === "publicite") {
      where.showOnPublicite = true;
    } else if (location === "dashboard") {
      where.showOnDashboard = true;
    }

    // Pour les notifications, on vérifie la date de début
    if (includeNotification) {
      where.showInNotification = true;
      where.notificationStartAt = { lte: now };
    }

    // Vérifier la date de fin
    where.AND = [
      {
        OR: [
          { endDate: null },
          { endDate: { gte: now } }
        ]
      }
    ];

    const partners = await prisma.partner.findMany({
      where,
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "desc" }
      ],
      select: {
        id: true,
        name: true,
        logoUrl: true,
        websiteUrl: true,
        description: true,
        notificationMessage: includeNotification,
      }
    });

    return NextResponse.json({ success: true, data: partners });
  } catch (error) {
    console.error("Error fetching public partners:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des partenaires" },
      { status: 500 }
    );
  }
}
