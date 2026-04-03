import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/provider/profile - Get provider profile
export async function GET(request: NextRequest) {
  try {
    // In a real app, get the provider ID from the session
    const providerId = "provider-1"; // Mock provider ID

    const provider = await db.provider.findUnique({
      where: { id: providerId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
        services: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            category: true,
            price: true,
            duration: true,
          },
        },
        subscription: {
          select: {
            plan: true,
            status: true,
            expiresAt: true,
          },
        },
      },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ provider });
  } catch (error) {
    console.error("Error fetching provider profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch provider profile" },
      { status: 500 }
    );
  }
}

// PUT /api/provider/profile - Update provider profile
export async function PUT(request: NextRequest) {
  try {
    const providerId = "provider-1"; // Mock provider ID

    const body = await request.json();
    const {
      businessName,
      description,
      serviceCategories,
      hourlyRate,
      city,
      address,
      phone,
      workingHours,
    } = body;

    // Update provider profile
    const updatedProvider = await db.provider.update({
      where: { id: providerId },
      data: {
        businessName,
        description,
        serviceCategories: serviceCategories || [],
        hourlyRate,
        city,
        address,
        workingHours: workingHours ? JSON.stringify(workingHours) : undefined,
        user: {
          update: {
            phone,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({ provider: updatedProvider });
  } catch (error) {
    console.error("Error updating provider profile:", error);
    return NextResponse.json(
      { error: "Failed to update provider profile" },
      { status: 500 }
    );
  }
}
