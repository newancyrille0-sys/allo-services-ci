import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const publications = await db.providerPublication.findMany({
      where: {
        isActive: true,
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
        createdAt: "desc",
      },
      take: 50,
    });

    // Transformer les données pour le frontend
    const formattedPublications = publications.map((pub) => ({
      id: pub.id,
      type: pub.type,
      mediaUrl: pub.mediaUrl,
      caption: pub.caption,
      expiresAt: pub.expiresAt,
      viewCount: pub.viewCount,
      createdAt: pub.createdAt,
      provider: {
        id: pub.provider.id,
        name: pub.provider.businessName || pub.provider.user.fullName || "Prestataire",
        avatar: pub.provider.user.avatarUrl,
      },
    }));

    return NextResponse.json(formattedPublications);
  } catch (error) {
    console.error("Error fetching publications:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des publications" },
      { status: 500 }
    );
  }
}
