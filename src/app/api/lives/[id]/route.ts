import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const live = await db.providerLive.findUnique({
      where: { id },
      include: {
        provider: {
          include: {
            user: {
              select: {
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!live) {
      return NextResponse.json(
        { error: "Live non trouvé" },
        { status: 404 }
      );
    }

    // Transformer les données pour le frontend
    const formattedLive = {
      id: live.id,
      title: live.title,
      description: live.description,
      thumbnailUrl: live.thumbnailUrl,
      streamUrl: live.streamUrl,
      viewerCount: live.viewerCount,
      startedAt: live.startedAt,
      status: live.status,
      provider: {
        id: live.provider.id,
        name: live.provider.businessName || live.provider.user.fullName || "Prestataire",
        avatar: live.provider.user.avatarUrl,
        isVerified: live.provider.isVerified,
        subscribers: live.provider.totalReservations,
      },
    };

    return NextResponse.json(formattedLive);
  } catch (error) {
    console.error("Error fetching live:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du live" },
      { status: 500 }
    );
  }
}
