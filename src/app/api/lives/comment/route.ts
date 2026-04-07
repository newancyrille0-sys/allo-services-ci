import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Récupérer les commentaires d'un live
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const liveId = searchParams.get("liveId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!liveId) {
      return NextResponse.json(
        { success: false, error: "ID du live requis" },
        { status: 400 }
      );
    }

    const comments = await db.liveComment.findMany({
      where: { liveId },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    // Get user info for each comment
    const commentsWithUsers = await Promise.all(
      comments.map(async (comment) => {
        const user = await db.user.findUnique({
          where: { id: comment.userId },
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        });
        return {
          id: comment.id,
          content: comment.content,
          likeCount: comment.likeCount,
          createdAt: comment.createdAt.toISOString(),
          user,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: commentsWithUsers,
    });
  } catch (error) {
    console.error("Error fetching live comments:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des commentaires" },
      { status: 500 }
    );
  }
}

// POST - Ajouter un commentaire à un live
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
    const { liveId, content } = body;

    if (!liveId || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: "ID du live et contenu requis" },
        { status: 400 }
      );
    }

    // Create comment and increment count
    const [comment] = await db.$transaction([
      db.liveComment.create({
        data: {
          liveId,
          userId: session.user.id,
          content: content.trim(),
        },
      }),
      db.providerLive.update({
        where: { id: liveId },
        data: { commentCount: { increment: 1 } },
      }),
    ]);

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: comment.id,
        content: comment.content,
        likeCount: comment.likeCount,
        createdAt: comment.createdAt.toISOString(),
        user,
      },
    });
  } catch (error) {
    console.error("Error creating live comment:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création du commentaire" },
      { status: 500 }
    );
  }
}
