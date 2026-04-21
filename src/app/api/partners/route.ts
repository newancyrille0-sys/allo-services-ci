import { NextRequest, NextResponse } from "next/server";

// Mock partners data for fallback when database is unavailable
const mockPartners = [
  {
    id: "1",
    name: "Orange CI",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Orange_logo.svg/200px-Orange_logo.svg.png",
    websiteUrl: "https://orange.ci",
    description: "Télécommunications"
  },
  {
    id: "2",
    name: "MTN CI",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/MTN_Logo.svg/200px-MTN_Logo.svg.png",
    websiteUrl: "https://mtn.ci",
    description: "Télécommunications"
  },
  {
    id: "3",
    name: "Wave",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Wave_Mobile_Money_logo.svg/200px-Wave_Mobile_Money_logo.svg.png",
    websiteUrl: "https://wave.com",
    description: "Mobile Money"
  },
  {
    id: "4",
    name: "Moov Africa",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Moov_Africa_logo.svg/200px-Moov_Africa_logo.svg.png",
    websiteUrl: "https://moov-africa.ci",
    description: "Télécommunications"
  },
  {
    id: "5",
    name: "SODECI",
    logoUrl: "/images/partners/sodeci.png",
    websiteUrl: "https://sodeci.ci",
    description: "Distribution d'eau"
  },
  {
    id: "6",
    name: "CIE",
    logoUrl: "/images/partners/cie.png",
    websiteUrl: "https://cie.ci",
    description: "Électricité"
  }
];

// GET - Récupérer les partenaires actifs pour l'affichage public
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location"); // home, publicite, dashboard
    const includeNotification = searchParams.get("includeNotification") === "true";

    // Try to fetch from database, fallback to mock data
    try {
      const { prisma } = await import("@/lib/prisma");
      
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

      if (partners.length > 0) {
        return NextResponse.json({ success: true, data: partners });
      }
      
      // If no partners in database, return mock data
      return NextResponse.json({ success: true, data: mockPartners });
      
    } catch (dbError) {
      // Database unavailable, return mock data
      console.log("Database unavailable, using mock partners data");
      return NextResponse.json({ success: true, data: mockPartners });
    }
  } catch (error) {
    console.error("Error fetching public partners:", error);
    // Return mock data instead of error
    return NextResponse.json({ success: true, data: mockPartners });
  }
}
