import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Récupérer les prestataires suivis ou les followers
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "following"; // following or followers
    const providerId = searchParams.get("providerId");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (type === "following") {
      // Get providers that the user follows
      const follows = await db.userFollow.findMany({
        where: { followerId: session.user.id },
        include: {
          following: {
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
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      });

      const formattedFollows = follows.map((follow) => ({
        id: follow.following.id,
        businessName: follow.following.businessName || follow.following.user.fullName || "Prestataire",
        avatar: follow.following.user.avatarUrl,
        category: follow.following.categories ? JSON.parse(follow.following.categories)[0] : "Services",
        isVerified: follow.following.isVerified,
        followedAt: follow.createdAt.toISOString(),
      }));

      return NextResponse.json({
        success: true,
        data: formattedFollows,
      });
    } else {
      // Get followers of a provider
      if (!providerId) {
        return NextResponse.json(
          { success: false, error: "ID de prestataire requis" },
          { status: 400 }
        );
      }

      const followers = await db.userFollow.findMany({
        where: { followingId: providerId },
        include: {
          follower: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      });

      const formattedFollowers = followers.map((follow) => ({
        id: follow.follower.id,
        name: follow.follower.fullName || "Utilisateur",
        avatar: follow.follower.avatarUrl,
        followedAt: follow.createdAt.toISOString(),
      }));

      return NextResponse.json({
        success: true,
        data: formattedFollowers,
      });
    }
  } catch (error) {
    console.error("Error fetching follows:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

// POST - Suivre un prestataire
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { providerId } = body;

    if (!providerId) {
      return NextResponse.json(
        { success: false, error: "ID de prestataire requis" },
        { status: 400 }
      );
    }

    // Check if provider exists
    const provider = await db.provider.findUnique({
      where: { id: providerId },
    });

    if (!provider) {
      return NextResponse.json(
        { success: false, error: "Prestataire non trouvé" },
        { status: 404 }
      );
    }

    // Check if already following
    const existingFollow = await db.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: providerId,
        },
      },
    });

    if (existingFollow) {
      return NextResponse.json(
        { success: false, error: "Déjà suivi" },
        { status: 400 }
      );
    }

    const follow = await db.userFollow.create({
      data: {
        followerId: session.user.id,
        followingId: providerId,
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: follow.id },
      message: "Maintenant suivi",
    });
  } catch (error) {
    console.error("Error following provider:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'abonnement" },
      { status: 500 }
    );
  }
}

// DELETE - Ne plus suivre un prestataire
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
    const providerId = searchParams.get("providerId");

    if (!providerId) {
      return NextResponse.json(
        { success: false, error: "ID de prestataire requis" },
        { status: 400 }
      );
    }

    // Check if following
    const existingFollow = await db.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: providerId,
        },
      },
    });

    if (!existingFollow) {
      return NextResponse.json(
        { success: false, error: "Non suivi" },
        { status: 400 }
      );
    }

    await db.userFollow.delete({
      where: { id: existingFollow.id },
    });

    return NextResponse.json({
      success: true,
      message: "Ne plus suivre",
    });
  } catch (error) {
    console.error("Error unfollowing provider:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors du désabonnement" },
      { status: 500 }
    );
  }
}
