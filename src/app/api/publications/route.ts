import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { SUBSCRIPTION_PLANS } from "@/lib/constants/subscription";

// GET - Récupérer toutes les publications actives
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // video, photo, all
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const whereClause: any = { isActive: true };
    if (type && type !== "all") {
      whereClause.type = type;
    }

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
      },
      orderBy: {
        createdAt: "desc",
      },
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

    // Transformer les données pour le frontend
    const formattedPublications = publications.map((pub) => ({
      id: pub.id,
      type: pub.type,
      mediaUrl: pub.mediaUrl,
      thumbnailUrl: pub.thumbnailUrl,
      caption: pub.caption,
      servicePrice: pub.servicePrice,
      serviceDescription: pub.serviceDescription,
      viewCount: pub.viewCount,
      likeCount: pub.likeCount,
      commentCount: pub.commentCount,
      shareCount: pub.shareCount,
      isLiked: userId ? (pub.likes as any[])?.length > 0 : false,
      isBookmarked: userId ? (pub.bookmarks as any[])?.length > 0 : false,
      expiresAt: pub.expiresAt,
      createdAt: pub.createdAt.toISOString(),
      provider: {
        id: pub.provider.id,
        name: pub.provider.user.fullName || "Prestataire",
        avatar: pub.provider.user.avatarUrl,
        businessName: pub.provider.businessName || pub.provider.user.fullName || "Prestataire",
        category: pub.provider.categories ? JSON.parse(pub.provider.categories)[0] : "Services",
        isVerified: pub.provider.isVerified,
        subscriptionPlan: pub.provider.subscriptionStatus,
        isFollowing: followingIds.includes(pub.provider.id),
      },
    }));

    return NextResponse.json({
      success: true,
      data: formattedPublications,
    });
  } catch (error) {
    console.error("Error fetching publications:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des publications" },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle publication (prestataires uniquement)
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
        { success: false, error: "Seuls les prestataires peuvent publier des vidéos et photos. Inscrivez-vous comme prestataire pour continuer." },
        { status: 403 }
      );
    }

    // Vérifier les limites du plan d'abonnement
    const planLimits = SUBSCRIPTION_PLANS[provider.subscriptionStatus as keyof typeof SUBSCRIPTION_PLANS];
    
    if (planLimits && planLimits.limits.maxVideosPerMonth !== -1) {
      if (provider.videosPublishedThisMonth >= planLimits.limits.maxVideosPerMonth) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Vous avez atteint la limite de ${planLimits.limits.maxVideosPerMonth} publications ce mois-ci. Passez à un plan supérieur pour publier plus.` 
          },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { 
      type, 
      mediaUrl, 
      thumbnailUrl, 
      caption, 
      servicePrice,
      serviceDescription 
    } = body;

    if (!type || !mediaUrl) {
      return NextResponse.json(
        { success: false, error: "Le type et le fichier média sont requis" },
        { status: 400 }
      );
    }

    if (!["photo", "video"].includes(type)) {
      return NextResponse.json(
        { success: false, error: "Type invalide. Utilisez 'photo' ou 'video'" },
        { status: 400 }
      );
    }

    // Créer la publication
    const publication = await db.providerPublication.create({
      data: {
        providerId: provider.id,
        type,
        mediaUrl,
        thumbnailUrl,
        caption,
        servicePrice: servicePrice ? parseFloat(servicePrice) : null,
        serviceDescription,
      },
    });

    // Incrémenter le compteur de vidéos publiées ce mois
    await db.provider.update({
      where: { id: provider.id },
      data: {
        videosPublishedThisMonth: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      data: publication,
      message: "Publication créée avec succès",
    });
  } catch (error) {
    console.error("Error creating publication:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création de la publication" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une publication
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const publicationId = searchParams.get("id");

    if (!publicationId) {
      return NextResponse.json(
        { success: false, error: "ID de publication requis" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur est le propriétaire
    const provider = await db.provider.findUnique({
      where: { userId: session.user.id },
    });

    if (!provider) {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 403 }
      );
    }

    const publication = await db.providerPublication.findUnique({
      where: { id: publicationId },
    });

    if (!publication || publication.providerId !== provider.id) {
      return NextResponse.json(
        { success: false, error: "Publication non trouvée" },
        { status: 404 }
      );
    }

    // Supprimer la publication
    await db.providerPublication.delete({
      where: { id: publicationId },
    });

    return NextResponse.json({
      success: true,
      message: "Publication supprimée",
    });
  } catch (error) {
    console.error("Error deleting publication:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
