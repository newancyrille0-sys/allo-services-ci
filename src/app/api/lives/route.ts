import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

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

// POST - Créer un nouveau live
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Check if user is a provider
    const provider = await db.provider.findUnique({
      where: { userId: session.user.id },
    });

    if (!provider) {
      return NextResponse.json(
        { success: false, error: "Seuls les prestataires peuvent créer des lives" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, thumbnailUrl, scheduledAt } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Le titre est requis" },
        { status: 400 }
      );
    }

    const live = await db.providerLive.create({
      data: {
        providerId: provider.id,
        title,
        description,
        thumbnailUrl,
        status: scheduledAt ? "scheduled" : "live",
        startedAt: scheduledAt ? null : new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: live,
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
