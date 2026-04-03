import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/provider/services - List provider services
export async function GET(request: NextRequest) {
  try {
    const providerId = "provider-1"; // Mock provider ID

    const services = await db.service.findMany({
      where: { providerId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST /api/provider/services - Add new service
export async function POST(request: NextRequest) {
  try {
    const providerId = "provider-1"; // Mock provider ID

    const body = await request.json();
    const { categoryId, categoryName, name, description, price, duration } = body;

    // Check subscription limits
    const provider = await db.provider.findUnique({
      where: { id: providerId },
      include: {
        subscription: true,
        services: true,
      },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    // Check service limit based on subscription
    const maxServices = provider.subscription?.plan === "PREMIUM"
      ? -1 // Unlimited
      : provider.subscription?.plan === "MONTHLY"
      ? 15
      : 5;

    if (maxServices !== -1 && provider.services.length >= maxServices) {
      return NextResponse.json(
        { error: "Service limit reached. Please upgrade your subscription." },
        { status: 400 }
      );
    }

    // Create new service
    const newService = await db.service.create({
      data: {
        providerId,
        category: categoryName,
        name,
        description,
        price,
        duration,
        isActive: true,
      },
    });

    return NextResponse.json({ service: newService }, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}
