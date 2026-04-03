import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/client/reservations/[id] - Get reservation detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mockUserId = "client-1";

    const reservation = await db.reservation.findFirst({
      where: {
        id,
        clientId: mockUserId,
      },
      include: {
        service: true,
        provider: {
          include: {
            user: {
              select: {
                fullName: true,
                phone: true,
                avatarUrl: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          take: 50,
        },
        payments: true,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Réservation non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la réservation" },
      { status: 500 }
    );
  }
}

// PUT /api/client/reservations/[id] - Update reservation
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const mockUserId = "client-1";

    // Check if reservation exists and belongs to the client
    const existingReservation = await db.reservation.findFirst({
      where: {
        id,
        clientId: mockUserId,
      },
    });

    if (!existingReservation) {
      return NextResponse.json(
        { error: "Réservation non trouvée" },
        { status: 404 }
      );
    }

    // Only allow updates if status is PENDING or CONFIRMED
    if (!["PENDING", "CONFIRMED"].includes(existingReservation.status)) {
      return NextResponse.json(
        { error: "Cette réservation ne peut plus être modifiée" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.scheduledDate) {
      updateData.scheduledDate = new Date(body.scheduledDate);
    }
    if (body.address) {
      updateData.address = body.address;
    }
    if (body.city) {
      updateData.city = body.city;
    }
    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }

    const reservation = await db.reservation.update({
      where: { id },
      data: updateData,
      include: {
        service: true,
        provider: {
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("Error updating reservation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la réservation" },
      { status: 500 }
    );
  }
}

// DELETE /api/client/reservations/[id] - Cancel reservation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mockUserId = "client-1";

    // Check if reservation exists and belongs to the client
    const existingReservation = await db.reservation.findFirst({
      where: {
        id,
        clientId: mockUserId,
      },
    });

    if (!existingReservation) {
      return NextResponse.json(
        { error: "Réservation non trouvée" },
        { status: 404 }
      );
    }

    // Only allow cancellation if status is PENDING or CONFIRMED
    if (!["PENDING", "CONFIRMED"].includes(existingReservation.status)) {
      return NextResponse.json(
        { error: "Cette réservation ne peut plus être annulée" },
        { status: 400 }
      );
    }

    // Update status to CANCELLED
    const reservation = await db.reservation.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Réservation annulée avec succès",
      reservation,
    });
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'annulation de la réservation" },
      { status: 500 }
    );
  }
}
