import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const activeLives = await db.providerLive.findMany({
      where: {
        status: "live",
      },
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
      orderBy: {
        startedAt: "desc",
      },
    });

    // Transformer les données pour le frontend
    const formattedLives = activeLives.map((live) => ({
      id: live.id,
      title: live.title,
      description: live.description,
      thumbnailUrl: live.thumbnailUrl,
      viewerCount: live.viewerCount,
      startedAt: live.startedAt,
      provider: {
        id: live.provider.id,
        name: live.provider.businessName || live.provider.user.fullName || "Prestataire",
        avatar: live.provider.user.avatarUrl,
      },
    }));

    return NextResponse.json(formattedLives);
  } catch (error) {
    console.error("Error fetching active lives:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des lives actifs" },
      { status: 500 }
    );
  }
}
