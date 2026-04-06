import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// POST - Liker une publication
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

    // Check if already liked
    const existingLike = await db.publicationLike.findUnique({
      where: {
        publicationId_userId: {
          publicationId,
          userId: session.user.id,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { success: false, error: "Déjà liké" },
        { status: 400 }
      );
    }

    // Create like and increment count
    const like = await db.$transaction([
      db.publicationLike.create({
        data: {
          publicationId,
          userId: session.user.id,
        },
      }),
      db.providerPublication.update({
        where: { id: publicationId },
        data: { likeCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: { id: like[0].id },
    });
  } catch (error) {
    console.error("Error liking publication:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors du like" },
      { status: 500 }
    );
  }
}

// DELETE - Unliker une publication
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

    // Check if liked
    const existingLike = await db.publicationLike.findUnique({
      where: {
        publicationId_userId: {
          publicationId,
          userId: session.user.id,
        },
      },
    });

    if (!existingLike) {
      return NextResponse.json(
        { success: false, error: "Non liké" },
        { status: 400 }
      );
    }

    // Delete like and decrement count
    await db.$transaction([
      db.publicationLike.delete({
        where: { id: existingLike.id },
      }),
      db.providerPublication.update({
        where: { id: publicationId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Like retiré",
    });
  } catch (error) {
    console.error("Error unliking publication:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors du retrait du like" },
      { status: 500 }
    );
  }
}
