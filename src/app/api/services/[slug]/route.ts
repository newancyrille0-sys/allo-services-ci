import { NextRequest, NextResponse } from "next/server";
import { SERVICE_CATEGORIES, getCategoryBySlug } from "@/lib/constants/services";
import { SERVICE_PROVIDER_COUNTS, FEATURED_PROVIDERS } from "@/lib/constants/mockData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const category = getCategoryBySlug(slug);

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    // Get providers for this service (mock data)
    const providers = FEATURED_PROVIDERS.slice(0, 6).map((p) => ({
      id: p.id,
      businessName: p.businessName,
      description: p.description,
      avatarUrl: p.avatarUrl,
      averageRating: p.averageRating,
      totalReviews: p.totalReviews,
      trustScore: p.trustScore,
      subscriptionStatus: p.subscriptionStatus,
      city: p.city,
      hourlyRate: p.hourlyRate,
      badgeVerified: p.badgeVerified,
    }));

    // Get related services
    const relatedServices = SERVICE_CATEGORIES.filter((s) => s.slug !== slug)
      .slice(0, 4)
      .map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        icon: s.icon,
        providerCount: SERVICE_PROVIDER_COUNTS[s.slug] || 0,
      }));

    return NextResponse.json({
      success: true,
      data: {
        ...category,
        providerCount: SERVICE_PROVIDER_COUNTS[slug] || 0,
        providers,
        relatedServices,
      },
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}
