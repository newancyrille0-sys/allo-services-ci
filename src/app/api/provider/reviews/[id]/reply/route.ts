import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/provider/reviews/[id]/reply - Reply to a review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const providerId = "provider-1"; // Mock provider ID

    const body = await request.json();
    const { reply } = body;

    if (!reply || reply.trim().length < 10) {
      return NextResponse.json(
        { error: "Reply must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Check if review belongs to provider
    const existingReview = await db.review.findFirst({
      where: { id, providerId },
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    if (existingReview.providerResponse) {
      return NextResponse.json(
        { error: "Review already has a response" },
        { status: 400 }
      );
    }

    // Update review with provider response
    const updatedReview = await db.review.update({
      where: { id },
      data: {
        providerResponse: reply,
        providerResponseAt: new Date(),
      },
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    // Create notification for the client
    await db.notification.create({
      data: {
        userId: updatedReview.clientId,
        type: "REVIEW",
        title: "Réponse à votre avis",
        message: "Le prestataire a répondu à votre avis.",
        data: { reviewId: id },
      },
    });

    return NextResponse.json({ review: updatedReview });
  } catch (error) {
    console.error("Error replying to review:", error);
    return NextResponse.json(
      { error: "Failed to reply to review" },
      { status: 500 }
    );
  }
}
