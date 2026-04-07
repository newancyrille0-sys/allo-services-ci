import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { SUBSCRIPTION_PLANS } from "@/lib/constants/subscription";

// GET - Récupérer les lives actifs
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "live"; // live, scheduled, ended, all
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    let whereClause: any = {};

    if (status !== "all") {
      whereClause.status = status;
    }

    const lives = await db.providerLive.findMany({
      where: whereClause,
      include: {
        provider: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
        likes: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : false,
      },
      orderBy: [
        { status: "asc" }, // live first
        { createdAt: "desc" },
      ],
      take: limit,
      skip: offset,
    });

    // Check if user follows each provider
    let followingIds: string[] = [];
    if (userId) {
      const follows = await db.userFollow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });
      followingIds = follows.map((f) => f.followingId);
    }

    const formattedLives = lives.map((live) => ({
      id: live.id,
      title: live.title,
      description: live.description,
      thumbnailUrl: live.thumbnailUrl,
      streamUrl: live.streamUrl,
      status: live.status,
      viewerCount: live.viewerCount,
      likeCount: live.likeCount,
      commentCount: live.commentCount,
      isLiked: userId ? (live.likes as any[])?.length > 0 : false,
      startedAt: live.startedAt?.toISOString(),
      endedAt: live.endedAt?.toISOString(),
      createdAt: live.createdAt.toISOString(),
      provider: {
        id: live.provider.id,
        name: live.provider.user.fullName || "Prestataire",
        avatar: live.provider.user.avatarUrl,
        businessName: live.provider.businessName || live.provider.user.fullName || "Prestataire",
        category: live.provider.categories ? JSON.parse(live.provider.categories)[0] : "Services",
        isVerified: live.provider.isVerified,
        subscriptionPlan: live.provider.subscriptionStatus,
        isFollowing: followingIds.includes(live.provider.id),
      },
    }));

    return NextResponse.json({
      success: true,
      data: formattedLives,
    });
  } catch (error) {
    console.error("Error fetching lives:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des lives" },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau live (prestataires uniquement)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Non autorisé. Veuillez vous connecter." },
        { status: 401 }
      );
    }

    // Vérifier si l'utilisateur est un prestataire
    const provider = await db.provider.findUnique({
      where: { userId: session.user.id },
    });

    if (!provider) {
      return NextResponse.json(
        { success: false, error: "Seuls les prestataires peuvent créer des lives. Inscrivez-vous comme prestataire pour continuer." },
        { status: 403 }
      );
    }

    // Vérifier les limites du plan d'abonnement
    const planLimits = SUBSCRIPTION_PLANS[provider.subscriptionStatus as keyof typeof SUBSCRIPTION_PLANS];
    
    if (planLimits && planLimits.limits.maxLivesPerMonth !== -1) {
      if (provider.livesStreamedThisMonth >= planLimits.limits.maxLivesPerMonth) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Vous avez atteint la limite de ${planLimits.limits.maxLivesPerMonth} lives ce mois-ci. Passez à un plan supérieur pour plus de lives.` 
          },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { title, description, thumbnailUrl, scheduledAt } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Le titre est requis" },
        { status: 400 }
      );
    }

    // Vérifier qu'il n'y a pas déjà un live en cours pour ce prestataire
    const existingLive = await db.providerLive.findFirst({
      where: {
        providerId: provider.id,
        status: "live",
      },
    });

    if (existingLive) {
      return NextResponse.json(
        { success: false, error: "Vous avez déjà un live en cours. Terminez-le d'abord." },
        { status: 400 }
      );
    }

    // Générer l'URL du stream (dans un vrai système, on utiliserait un service comme Mux, YouTube Live, etc.)
    const streamUrl = `rtmp://live.alloservices.ci/${provider.id}/${Date.now()}`;

    const live = await db.providerLive.create({
      data: {
        providerId: provider.id,
        title,
        description,
        thumbnailUrl,
        streamUrl,
        status: scheduledAt ? "scheduled" : "live",
        startedAt: scheduledAt ? null : new Date(),
      },
    });

    // Incrémenter le compteur de lives ce mois
    if (!scheduledAt) {
      await db.provider.update({
        where: { id: provider.id },
        data: {
          livesStreamedThisMonth: { increment: 1 },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...live,
        streamUrl: live.streamUrl,
        hlsUrl: `https://live.alloservices.ci/hls/${live.id}.m3u8`, // URL de lecture HLS
      },
      message: scheduledAt ? "Live programmé avec succès" : "Live démarré avec succès",
    });
  } catch (error) {
    console.error("Error creating live:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création du live" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour le statut d'un live
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { liveId, status, viewerCount } = body;

    if (!liveId) {
      return NextResponse.json(
        { success: false, error: "ID du live requis" },
        { status: 400 }
      );
    }

    // Check if user owns this live
    const provider = await db.provider.findUnique({
      where: { userId: session.user.id },
    });

    if (!provider) {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 403 }
      );
    }

    const live = await db.providerLive.findUnique({
      where: { id: liveId },
    });

    if (!live || live.providerId !== provider.id) {
      return NextResponse.json(
        { success: false, error: "Live non trouvé" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (status) {
      updateData.status = status;
      if (status === "ended") {
        updateData.endedAt = new Date();
      }
      if (status === "live" && !live.startedAt) {
        updateData.startedAt = new Date();
        // Incrémenter le compteur si c'est le démarrage du live
        await db.provider.update({
          where: { id: provider.id },
          data: {
            livesStreamedThisMonth: { increment: 1 },
          },
        });
      }
    }
    if (typeof viewerCount === "number") {
      updateData.viewerCount = viewerCount;
    }

    const updatedLive = await db.providerLive.update({
      where: { id: liveId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedLive,
    });
  } catch (error) {
    console.error("Error updating live:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la mise à jour du live" },
      { status: 500 }
    );
  }
}
