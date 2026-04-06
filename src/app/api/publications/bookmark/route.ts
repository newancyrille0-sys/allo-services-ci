import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Récupérer les publications enregistrées de l'utilisateur
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
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const bookmarks = await db.publicationBookmark.findMany({
      where: { userId: session.user.id },
      include: {
        publication: {
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
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    const formattedBookmarks = bookmarks.map((bookmark) => ({
      id: bookmark.publication.id,
      type: bookmark.publication.type,
      thumbnailUrl: bookmark.publication.thumbnailUrl || bookmark.publication.mediaUrl,
      caption: bookmark.publication.caption || "",
      likes: bookmark.publication.likeCount,
      views: bookmark.publication.viewCount,
      isBookmarked: true,
      createdAt: bookmark.publication.createdAt.toISOString(),
      provider: {
        id: bookmark.publication.provider.id,
        name: bookmark.publication.provider.user.fullName || "Prestataire",
        avatar: bookmark.publication.provider.user.avatarUrl,
        businessName: bookmark.publication.provider.businessName || "Prestataire",
        isVerified: bookmark.publication.provider.isVerified,
      },
    }));

    return NextResponse.json({
      success: true,
      data: formattedBookmarks,
    });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des enregistrements" },
      { status: 500 }
    );
  }
}

// POST - Enregistrer une publication
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
    const { publicationId } = body;

    if (!publicationId) {
      return NextResponse.json(
        { success: false, error: "ID de publication requis" },
        { status: 400 }
      );
    }

    // Check if already bookmarked
    const existingBookmark = await db.publicationBookmark.findUnique({
      where: {
        publicationId_userId: {
          publicationId,
          userId: session.user.id,
        },
      },
    });

    if (existingBookmark) {
      return NextResponse.json(
        { success: false, error: "Déjà enregistré" },
        { status: 400 }
      );
    }

    const bookmark = await db.publicationBookmark.create({
      data: {
        publicationId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: bookmark.id },
    });
  } catch (error) {
    console.error("Error bookmarking publication:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'enregistrement" },
      { status: 500 }
    );
  }
}

// DELETE - Retirer des enregistrements
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
    const publicationId = searchParams.get("publicationId");

    if (!publicationId) {
      return NextResponse.json(
        { success: false, error: "ID de publication requis" },
        { status: 400 }
      );
    }

    // Check if bookmarked
    const existingBookmark = await db.publicationBookmark.findUnique({
      where: {
        publicationId_userId: {
          publicationId,
          userId: session.user.id,
        },
      },
    });

    if (!existingBookmark) {
      return NextResponse.json(
        { success: false, error: "Non enregistré" },
        { status: 400 }
      );
    }

    await db.publicationBookmark.delete({
      where: { id: existingBookmark.id },
    });

    return NextResponse.json({
      success: true,
      message: "Retiré des enregistrements",
    });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors du retrait" },
      { status: 500 }
    );
  }
}
