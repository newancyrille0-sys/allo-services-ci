import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/client/profile - Get client profile
export async function GET() {
  try {
    const mockUserId = "client-1";

    const user = await db.user.findUnique({
      where: { id: mockUserId },
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        avatarUrl: true,
        city: true,
        country: true,
        role: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            reservationsAsClient: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du profil" },
      { status: 500 }
    );
  }
}

// PUT /api/client/profile - Update client profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, city, avatarUrl } = body;
    const mockUserId = "client-1";

    const updateData: Record<string, unknown> = {};

    if (fullName) updateData.fullName = fullName;
    if (email !== undefined) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (city) updateData.city = city;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

    const user = await db.user.update({
      where: { id: mockUserId },
      data: updateData,
      select: {
        id: true,
        email: true,
        phone: true,
        fullName: true,
        avatarUrl: true,
        city: true,
        country: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du profil" },
      { status: 500 }
    );
  }
}

// DELETE /api/client/profile - Delete client account
export async function DELETE() {
  try {
    const mockUserId = "client-1";

    // Delete user and all related data (cascading deletes in schema)
    await db.user.delete({
      where: { id: mockUserId },
    });

    return NextResponse.json({
      success: true,
      message: "Compte supprimé avec succès",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du compte" },
      { status: 500 }
    );
  }
}
