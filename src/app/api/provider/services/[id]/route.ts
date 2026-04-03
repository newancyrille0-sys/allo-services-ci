import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/provider/services/[id] - Get service details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const providerId = "provider-1"; // Mock provider ID

    const service = await db.service.findFirst({
      where: { id, providerId },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

// PUT /api/provider/services/[id] - Update service
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const providerId = "provider-1"; // Mock provider ID

    const body = await request.json();
    const { categoryName, name, description, price, duration, isActive } = body;

    // Check if service belongs to provider
    const existingService = await db.service.findFirst({
      where: { id, providerId },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // Update service
    const updatedService = await db.service.update({
      where: { id },
      data: {
        category: categoryName,
        name,
        description,
        price,
        duration,
        isActive,
      },
    });

    return NextResponse.json({ service: updatedService });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

// DELETE /api/provider/services/[id] - Delete service
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const providerId = "provider-1"; // Mock provider ID

    // Check if service belongs to provider
    const existingService = await db.service.findFirst({
      where: { id, providerId },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // Delete service
    await db.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
