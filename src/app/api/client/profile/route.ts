import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/client/profile - Get current client profile
export async function GET() {
  try {
    // In a real app, get user ID from session/token
    // For now, we'll use a mock user ID
    const userId = "demo-client-user";

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        city: true,
        country: true,
        otpVerified: true,
        status: true,
        trustScore: true,
        createdAt: true,
      },
    });

    if (!user) {
      // Create a demo user if not exists
      const newUser = await db.user.create({
        data: {
          id: userId,
          fullName: "Client Demo",
          phone: "+2250700000000",
          email: "client@demo.com",
          passwordHash: "demo",
          role: "CLIENT",
          status: "ACTIVE",
          otpVerified: true,
          city: "Abidjan",
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          avatarUrl: true,
          city: true,
          country: true,
          otpVerified: true,
          status: true,
          trustScore: true,
          createdAt: true,
        },
      });
      
      return NextResponse.json(newUser);
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching client profile:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du profil" },
      { status: 500 }
    );
  }
}

// PUT /api/client/profile - Update client profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, city, address, bio, avatarUrl } = body;

    // In a real app, get user ID from session/token
    const userId = "demo-client-user";

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        fullName,
        email,
        phone,
        city,
        avatarUrl,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        city: true,
        country: true,
        otpVerified: true,
        status: true,
        trustScore: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating client profile:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du profil" },
      { status: 500 }
    );
  }
}
