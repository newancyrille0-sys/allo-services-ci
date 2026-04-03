import { NextRequest, NextResponse } from "next/server";
import { FEATURED_PROVIDERS, type MockProvider } from "@/lib/constants/mockData";

// Extended mock providers for the API
function getMockProviders(): MockProvider[] {
  const additionalProviders: MockProvider[] = [
    {
      id: "provider-7",
      businessName: "Électro Pro Services",
      description: "Électricien certifié pour tous vos travaux électriques.",
      averageRating: 4.8,
      totalReviews: 95,
      trustScore: 93,
      subscriptionStatus: "PREMIUM",
      city: "Abidjan",
      hourlyRate: 7500,
      badgeVerified: true,
      serviceCategory: "Bricolage & Réparations",
    },
    {
      id: "provider-8",
      businessName: "Cuisine Scolaire Plus",
      description: "Cours de cuisine et pâtisserie à domicile.",
      averageRating: 4.7,
      totalReviews: 42,
      trustScore: 87,
      subscriptionStatus: "MONTHLY",
      city: "Abidjan",
      hourlyRate: 4500,
      badgeVerified: true,
      serviceCategory: "Cours & Formations",
    },
    {
      id: "provider-9",
      businessName: "Déménagement Express",
      description: "Service de déménagement complet et soigné.",
      averageRating: 4.4,
      totalReviews: 178,
      trustScore: 79,
      subscriptionStatus: "FREE",
      city: "Bouaké",
      hourlyRate: 6000,
      badgeVerified: false,
      serviceCategory: "Transport & Livraison",
    },
    {
      id: "provider-10",
      businessName: "Spa Détente Mobile",
      description: "Massage et soins spa à domicile.",
      averageRating: 4.9,
      totalReviews: 56,
      trustScore: 94,
      subscriptionStatus: "PREMIUM",
      city: "Abidjan",
      hourlyRate: 8500,
      badgeVerified: true,
      serviceCategory: "Beauté & Bien-être",
    },
  ];

  return [...FEATURED_PROVIDERS, ...additionalProviders];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const city = searchParams.get("city") || "";
    const category = searchParams.get("category") || "";
    const minRating = Number(searchParams.get("minRating")) || 0;
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 100000;
    const tiers = searchParams.get("tiers")?.split(",").filter(Boolean) || [];
    const verifiedOnly = searchParams.get("verified") === "true";
    const sort = searchParams.get("sort") || "popular";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 12;

    let providers = getMockProviders();

    // Filter by search query
    if (q) {
      const query = q.toLowerCase();
      providers = providers.filter(
        (p) =>
          p.businessName.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.serviceCategory.toLowerCase().includes(query)
      );
    }

    // Filter by city
    if (city) {
      providers = providers.filter((p) => p.city === city);
    }

    // Filter by category
    if (category) {
      providers = providers.filter((p) =>
        p.serviceCategory.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Filter by minimum rating
    if (minRating > 0) {
      providers = providers.filter((p) => p.averageRating >= minRating);
    }

    // Filter by price range
    providers = providers.filter(
      (p) => p.hourlyRate >= minPrice && p.hourlyRate <= maxPrice
    );

    // Filter by subscription tier
    if (tiers.length > 0) {
      providers = providers.filter((p) => tiers.includes(p.subscriptionStatus));
    }

    // Filter by verified status
    if (verifiedOnly) {
      providers = providers.filter((p) => p.badgeVerified);
    }

    // Sort
    switch (sort) {
      case "rating":
        providers.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "price_asc":
        providers.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case "price_desc":
        providers.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case "trust":
        providers.sort((a, b) => b.trustScore - a.trustScore);
        break;
      case "popular":
      default:
        providers.sort((a, b) => b.totalReviews - a.totalReviews);
        break;
    }

    // Pagination
    const total = providers.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedProviders = providers.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      data: paginatedProviders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching providers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}
