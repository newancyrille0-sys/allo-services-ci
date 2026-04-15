import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

// GET - Récupérer tous les partenaires
export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") === "true";
    const location = searchParams.get("location"); // home, publicite, dashboard

    let where: any = {};

    if (activeOnly) {
      where.isActive = true;
      const now = new Date();
      where.OR = [
        { startDate: null },
        { startDate: { lte: now } }
      ];
      where.OR = [
        { endDate: null },
        { endDate: { gte: now } }
      ];
    }

    if (location) {
      if (location === "home") where.showOnHome = true;
      if (location === "publicite") where.showOnPublicite = true;
      if (location === "dashboard") where.showOnDashboard = true;
    }

    const partners = await prisma.partner.findMany({
      where,
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "desc" }
      ]
    });

    return NextResponse.json({ success: true, data: partners });
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des partenaires" },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau partenaire
export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      logoUrl,
      websiteUrl,
      description,
      displayOrder,
      showInNotification,
      notificationMessage,
      notificationStartAt,
      showOnHome,
      showOnPublicite,
      showOnDashboard,
      startDate,
      endDate,
    } = body;

    if (!name || !logoUrl) {
      return NextResponse.json(
        { error: "Le nom et le logo sont requis" },
        { status: 400 }
      );
    }

    const partner = await prisma.partner.create({
      data: {
        name,
        logoUrl,
        websiteUrl,
        description,
        displayOrder: displayOrder || 0,
        showInNotification: showInNotification || false,
        notificationMessage,
        notificationStartAt: notificationStartAt ? new Date(notificationStartAt) : null,
        showOnHome: showOnHome ?? true,
        showOnPublicite: showOnPublicite ?? true,
        showOnDashboard: showOnDashboard ?? true,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        createdById: admin.id,
      },
    });

    return NextResponse.json({ success: true, data: partner });
  } catch (error) {
    console.error("Error creating partner:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du partenaire" },
      { status: 500 }
    );
  }
}
