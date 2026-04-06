import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// POST - Liker un live
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
    const { liveId } = body;

    if (!liveId) {
      return NextResponse.json(
        { success: false, error: "ID du live requis" },
        { status: 400 }
      );
    }

    // Check if already liked
    const existingLike = await db.liveLike.findUnique({
      where: {
        liveId_userId: {
          liveId,
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
    const [like] = await db.$transaction([
      db.liveLike.create({
        data: {
          liveId,
          userId: session.user.id,
        },
      }),
      db.providerLive.update({
        where: { id: liveId },
        data: { likeCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: { id: like.id },
    });
  } catch (error) {
    console.error("Error liking live:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors du like" },
      { status: 500 }
    );
  }
}

// DELETE - Unliker un live
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
    const liveId = searchParams.get("liveId");

    if (!liveId) {
      return NextResponse.json(
        { success: false, error: "ID du live requis" },
        { status: 400 }
      );
    }

    // Check if liked
    const existingLike = await db.liveLike.findUnique({
      where: {
        liveId_userId: {
          liveId,
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
      db.liveLike.delete({
        where: { id: existingLike.id },
      }),
      db.providerLive.update({
        where: { id: liveId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Like retiré",
    });
  } catch (error) {
    console.error("Error unliking live:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors du retrait du like" },
      { status: 500 }
    );
  }
}
