import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Récupérer le feed de publications/vidéos
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";
    const type = searchParams.get("type") || "video"; // video, photo, all
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    let whereClause: any = {
      isActive: true,
    };

    // Filter by type
    if (type !== "all") {
      whereClause.type = type;
    }

    // Get publications with interactions
    const publications = await db.providerPublication.findMany({
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
        bookmarks: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : false,
        comments: {
          take: 3,
          orderBy: { createdAt: "desc" },
          include: {
            // We'll need user info for comments
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: [
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

    // Format response
    const formattedPublications = publications.map((pub) => ({
      id: pub.id,
      type: pub.type,
      videoUrl: pub.mediaUrl,
      thumbnailUrl: pub.thumbnailUrl || pub.mediaUrl,
      caption: pub.caption || "",
      likes: pub.likeCount,
      comments: pub.commentCount,
      shares: pub.shareCount,
      views: pub.viewCount,
      isLiked: userId ? (pub.likes as any[])?.length > 0 : false,
      isBookmarked: userId ? (pub.bookmarks as any[])?.length > 0 : false,
      createdAt: pub.createdAt.toISOString(),
      provider: {
        id: pub.provider.id,
        name: pub.provider.user.fullName || "Prestataire",
        avatar: pub.provider.user.avatarUrl,
        businessName: pub.provider.businessName || pub.provider.user.fullName || "Prestataire",
        category: pub.provider.categories ? JSON.parse(pub.provider.categories)[0] : "Services",
        isVerified: pub.provider.isVerified,
        isFollowing: followingIds.includes(pub.provider.id),
      },
    }));

    // Sort by category
    let result = formattedPublications;
    if (category === "trending") {
      result = formattedPublications.sort((a, b) => b.views - a.views);
    } else if (category === "following" && userId) {
      result = formattedPublications.filter((p) => p.provider.isFollowing);
    }

    return NextResponse.json({
      success: true,
      data: result,
      pagination: {
        limit,
        offset,
        hasMore: publications.length === limit,
      },
    });
  } catch (error) {
    console.error("Error fetching publications:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des publications" },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle publication
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
        { success: false, error: "Seuls les prestataires peuvent publier" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { type, mediaUrl, thumbnailUrl, caption } = body;

    if (!mediaUrl) {
      return NextResponse.json(
        { success: false, error: "L'URL du média est requise" },
        { status: 400 }
      );
    }

    const publication = await db.providerPublication.create({
      data: {
        providerId: provider.id,
        type: type || "video",
        mediaUrl,
        thumbnailUrl,
        caption,
      },
    });

    return NextResponse.json({
      success: true,
      data: publication,
    });
  } catch (error) {
    console.error("Error creating publication:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création de la publication" },
      { status: 500 }
    );
  }
}
