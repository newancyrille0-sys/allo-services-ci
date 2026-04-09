import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Get session token from cookie
    const sessionToken = request.cookies.get("session_token")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { user: null, provider: null },
        { status: 200 }
      );
    }

    // Find session in database
    const session = await db.session.findUnique({
      where: { sessionToken },
      include: {
        user: {
          include: {
            provider: true,
          },
        },
      },
    });

    // Check if session exists and is not expired
    if (!session || session.expires < new Date()) {
      // Delete expired session
      if (session) {
        await db.session.delete({ where: { id: session.id } });
      }
      
      // Clear cookie
      const response = NextResponse.json(
        { user: null, provider: null },
        { status: 200 }
      );
      response.cookies.delete("session_token");
      return response;
    }

    // Check user status
    if (session.user.status === "BANNED" || session.user.status === "SUSPENDED") {
      // Delete session for banned/suspended users
      await db.session.delete({ where: { id: session.id } });
      
      const response = NextResponse.json(
        { user: null, provider: null },
        { status: 200 }
      );
      response.cookies.delete("session_token");
      return response;
    }

    const user = session.user;

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
          badgeVerified: user.provider.badgeVerified,
          averageRating: user.provider.averageRating,
          totalReviews: user.provider.totalReviews,
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
