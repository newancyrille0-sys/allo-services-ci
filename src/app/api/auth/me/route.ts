import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // In a real app with sessions/JWT, you would verify the session here
    // For demo purposes, we'll check for a user ID header or return unauthorized
    
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { user: null, provider: null },
        { status: 200 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        provider: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { user: null, provider: null },
        { status: 200 }
      );
    }

    const userData = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      city: user.city,
      country: user.country,
      otpVerified: user.otpVerified,
      trustScore: user.trustScore,
      createdAt: user.createdAt.toISOString(),
    };

    const providerData = user.provider
      ? {
          id: user.provider.id,
          businessName: user.provider.businessName,
          isVerified: user.provider.isVerified,
          kycStatus: user.provider.kycStatus,
          subscriptionStatus: user.provider.subscriptionStatus,
        }
      : null;

    return NextResponse.json({
      user: userData,
      provider: providerData,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { user: null, provider: null },
      { status: 200 }
    );
  }
}
