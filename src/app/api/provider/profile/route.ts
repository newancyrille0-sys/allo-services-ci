import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SubscriptionPlan } from "@prisma/client";

// GET /api/provider/profile - Get current provider profile
export async function GET() {
  try {
    // In a real app, get user ID from session/token
    const userId = "demo-provider-user";

    let user = await db.user.findUnique({
      where: { id: userId },
      include: {
        provider: true,
      },
    });

    if (!user || !user.provider) {
      // Create a demo provider if not exists
      user = await db.user.create({
        data: {
          id: userId,
          fullName: "Prestataire Demo",
          phone: "+2250700000001",
          email: "provider@demo.com",
          passwordHash: "demo",
          role: "PROVIDER",
          status: "ACTIVE",
          otpVerified: true,
          city: "Abidjan",
          provider: {
            create: {
              businessName: "Services Pro Demo",
              description: "Prestataire de services professionnel en Côte d'Ivoire",
              categories: JSON.stringify(["plomberie", "electricite"]),
              hourlyRate: 5000,
              subscriptionStatus: "MONTHLY" as SubscriptionPlan,
              isActive: true,
            },
          },
        },
        include: {
          provider: true,
        },
      });
    }

    // Parse categories from JSON string
    const providerData = {
      ...user.provider,
      categories: JSON.parse(user.provider?.categories || "[]"),
    };

    return NextResponse.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        city: user.city,
        otpVerified: user.otpVerified,
        status: user.status,
      },
      provider: providerData,
    });
  } catch (error) {
    console.error("Error fetching provider profile:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du profil" },
      { status: 500 }
    );
  }
}

// PUT /api/provider/profile - Update provider profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      city,
      businessName,
      description,
      categories,
      hourlyRate,
      address,
      avatarUrl,
      isActive,
    } = body;

    // In a real app, get user ID from session/token
    const userId = "demo-provider-user";

    // Update user
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        fullName,
        email,
        phone,
        city,
        avatarUrl,
      },
    });

    // Update provider
    const updatedProvider = await db.provider.update({
      where: { userId },
      data: {
        businessName,
        description,
        categories: JSON.stringify(categories),
        hourlyRate,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatarUrl: updatedUser.avatarUrl,
        city: updatedUser.city,
      },
      provider: {
        ...updatedProvider,
        categories: JSON.parse(updatedProvider.categories),
      },
    });
  } catch (error) {
    console.error("Error updating provider profile:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du profil" },
      { status: 500 }
    );
  }
}
