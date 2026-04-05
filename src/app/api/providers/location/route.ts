import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// Coordonnées limites de la Côte d'Ivoire
const IVORY_COAST_BOUNDS = {
  minLat: 4.0,
  maxLat: 10.5,
  minLng: -8.5,
  maxLng: -2.0,
};

// Vérifie si les coordonnées sont en Côte d'Ivoire
function isInIvoryCoast(lat: number, lng: number): boolean {
  return (
    lat >= IVORY_COAST_BOUNDS.minLat &&
    lat <= IVORY_COAST_BOUNDS.maxLat &&
    lng >= IVORY_COAST_BOUNDS.minLng &&
    lng <= IVORY_COAST_BOUNDS.maxLng
  );
}

// GET - Récupérer la localisation d'un prestataire
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const provider = await db.provider.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        latitude: true,
        longitude: true,
        user: {
          select: {
            city: true,
          },
        },
        businessName: true,
      },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Prestataire non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      location: {
        latitude: provider.latitude,
        longitude: provider.longitude,
        city: provider.user?.city,
        businessName: provider.businessName,
        isInIvoryCoast: provider.latitude && provider.longitude
          ? isInIvoryCoast(provider.latitude, provider.longitude)
          : null,
      },
    });
  } catch (error) {
    console.error("Error fetching provider location:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la localisation" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour la localisation GPS du prestataire
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { latitude, longitude, city } = body;

    // Validation des coordonnées
    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: "Les coordonnées latitude et longitude sont requises" },
        { status: 400 }
      );
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: "Coordonnées invalides" },
        { status: 400 }
      );
    }

    // Vérifier que les coordonnées sont en Côte d'Ivoire
    if (!isInIvoryCoast(lat, lng)) {
      return NextResponse.json(
        { 
          error: "Les coordonnées doivent être situées en Côte d'Ivoire",
          bounds: IVORY_COAST_BOUNDS,
        },
        { status: 400 }
      );
    }

    // Trouver le prestataire
    const provider = await db.provider.findUnique({
      where: { userId: session.user.id },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Prestataire non trouvé" },
        { status: 404 }
      );
    }

    // Mettre à jour la localisation
    const updatedProvider = await db.provider.update({
      where: { id: provider.id },
      data: {
        latitude: lat,
        longitude: lng,
      },
    });

    // Mettre à jour la ville si fournie
    if (city) {
      await db.user.update({
        where: { id: session.user.id },
        data: { city },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Localisation mise à jour avec succès",
      location: {
        latitude: updatedProvider.latitude,
        longitude: updatedProvider.longitude,
        city: city || null,
      },
    });
  } catch (error) {
    console.error("Error updating provider location:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la localisation" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer la localisation GPS
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const provider = await db.provider.findUnique({
      where: { userId: session.user.id },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Prestataire non trouvé" },
        { status: 404 }
      );
    }

    await db.provider.update({
      where: { id: provider.id },
      data: {
        latitude: null,
        longitude: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Localisation supprimée",
    });
  } catch (error) {
    console.error("Error deleting provider location:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la localisation" },
      { status: 500 }
    );
  }
}
