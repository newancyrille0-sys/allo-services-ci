import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

// GET - Récupérer un partenaire par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;

    const partner = await prisma.partner.findUnique({
      where: { id },
    });

    if (!partner) {
      return NextResponse.json(
        { error: "Partenaire non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: partner });
  } catch (error) {
    console.error("Error fetching partner:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du partenaire" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un partenaire
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existingPartner = await prisma.partner.findUnique({
      where: { id },
    });

    if (!existingPartner) {
      return NextResponse.json(
        { error: "Partenaire non trouvé" },
        { status: 404 }
      );
    }

    const partner = await prisma.partner.update({
      where: { id },
      data: {
        name: body.name,
        logoUrl: body.logoUrl,
        websiteUrl: body.websiteUrl,
        description: body.description,
        displayOrder: body.displayOrder,
        isActive: body.isActive,
        showInNotification: body.showInNotification,
        notificationMessage: body.notificationMessage,
        notificationStartAt: body.notificationStartAt ? new Date(body.notificationStartAt) : null,
        showOnHome: body.showOnHome,
        showOnPublicite: body.showOnPublicite,
        showOnDashboard: body.showOnDashboard,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
      },
    });

    return NextResponse.json({ success: true, data: partner });
  } catch (error) {
    console.error("Error updating partner:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du partenaire" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un partenaire
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;

    const existingPartner = await prisma.partner.findUnique({
      where: { id },
    });

    if (!existingPartner) {
      return NextResponse.json(
        { error: "Partenaire non trouvé" },
        { status: 404 }
      );
    }

    await prisma.partner.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Partenaire supprimé" });
  } catch (error) {
    console.error("Error deleting partner:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du partenaire" },
      { status: 500 }
    );
  }
}
