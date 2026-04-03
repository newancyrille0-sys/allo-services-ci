import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PUT /api/provider/reservations/[id]/status - Update reservation status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const providerId = "provider-1"; // Mock provider ID

    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Check if reservation belongs to provider
    const existingReservation = await db.reservation.findFirst({
      where: { id, providerId },
    });

    if (!existingReservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    // Update reservation status
    const updatedReservation = await db.reservation.update({
      where: { id },
      data: { status },
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Create notification for the client
    await db.notification.create({
      data: {
        userId: updatedReservation.clientId,
        type: "RESERVATION",
        title: "Statut de réservation mis à jour",
        message: `Votre réservation a été ${status === "CONFIRMED" ? "confirmée" : status === "IN_PROGRESS" ? "démarrée" : status === "COMPLETED" ? "terminée" : status === "CANCELLED" ? "annulée" : "mise à jour"}`,
        data: { reservationId: id },
      },
    });

    return NextResponse.json({ reservation: updatedReservation });
  } catch (error) {
    console.error("Error updating reservation status:", error);
    return NextResponse.json(
      { error: "Failed to update reservation status" },
      { status: 500 }
    );
  }
}
