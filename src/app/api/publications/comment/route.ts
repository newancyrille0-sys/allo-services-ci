import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Récupérer les commentaires d'une publication
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicationId = searchParams.get("publicationId");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!publicationId) {
      return NextResponse.json(
        { success: false, error: "ID de publication requis" },
        { status: 400 }
      );
    }

    const comments = await db.publicationComment.findMany({
      where: {
        publicationId,
        parentId: null, // Only top-level comments
      },
      include: {
        replies: {
          take: 3,
          orderBy: { createdAt: "asc" },
        },
      },
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

        const repliesWithUsers = await Promise.all(
          comment.replies.map(async (reply) => {
            const replyUser = await db.user.findUnique({
              where: { id: reply.userId },
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            });
            return {
              id: reply.id,
              content: reply.content,
              likeCount: reply.likeCount,
              createdAt: reply.createdAt.toISOString(),
              user: replyUser,
            };
          })
        );

        return {
          id: comment.id,
          content: comment.content,
          likeCount: comment.likeCount,
          createdAt: comment.createdAt.toISOString(),
          user,
          replies: repliesWithUsers,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: commentsWithUsers,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des commentaires" },
      { status: 500 }
    );
  }
}

// POST - Ajouter un commentaire
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
    const { publicationId, content, parentId } = body;

    if (!publicationId || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: "ID de publication et contenu requis" },
        { status: 400 }
      );
    }

    // Create comment and increment count
    const [comment] = await db.$transaction([
      db.publicationComment.create({
        data: {
          publicationId,
          userId: session.user.id,
          content: content.trim(),
          parentId: parentId || null,
        },
      }),
      db.providerPublication.update({
        where: { id: publicationId },
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
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création du commentaire" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un commentaire
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
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json(
        { success: false, error: "ID de commentaire requis" },
        { status: 400 }
      );
    }

    const comment = await db.publicationComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Commentaire non trouvé" },
        { status: 404 }
      );
    }

    if (comment.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 403 }
      );
    }

    // Delete comment and decrement count
    await db.$transaction([
      db.publicationComment.delete({
        where: { id: commentId },
      }),
      db.providerPublication.update({
        where: { id: comment.publicationId },
        data: { commentCount: { decrement: 1 } },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Commentaire supprimé",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la suppression du commentaire" },
      { status: 500 }
    );
  }
}
