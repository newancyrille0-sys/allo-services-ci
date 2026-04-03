import { NextRequest, NextResponse } from "next/server";
import { FEATURED_PROVIDERS } from "@/lib/constants/mockData";

interface ProviderProfile {
  id: string;
  businessName: string;
  description: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  averageRating: number;
  totalReviews: number;
  trustScore: number;
  subscriptionStatus: "FREE" | "MONTHLY" | "PREMIUM";
  city: string;
  address?: string;
  phone?: string;
  email?: string;
  badgeVerified: boolean;
  hourlyRate: number;
  services: {
    id: string;
    name: string;
    category: string;
    price?: number;
  }[];
  stats: {
    totalReservations: number;
    totalReviews: number;
    averageRating: number;
    responseTime: string;
  };
  memberSince: string;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

function getProviderProfile(id: string): ProviderProfile | null {
  const mockProvider = FEATURED_PROVIDERS.find((p) => p.id === id);

  if (!mockProvider) {
    // Return a default provider for demo purposes
    if (id.startsWith("provider-")) {
      return {
        id: id,
        businessName: "Prestataire Demo",
        description:
          "Professionnel expérimenté offrant des services de qualité en Côte d'Ivoire.",
        averageRating: 4.5,
        totalReviews: 25,
        trustScore: 85,
        subscriptionStatus: "MONTHLY",
        city: "Abidjan",
        address: "Cocody, Rue des Jardins",
        phone: "+225 07 00 00 00 00",
        email: "demo@prestataire.ci",
        badgeVerified: true,
        hourlyRate: 5000,
        services: [
          { id: "1", name: "Service principal", category: "Bricolage", price: 5000 },
          { id: "2", name: "Service secondaire", category: "Réparation", price: 3500 },
        ],
        stats: {
          totalReservations: 125,
          totalReviews: 25,
          averageRating: 4.5,
          responseTime: "< 1h",
        },
        memberSince: "2023-01-15T00:00:00.000Z",
        ratingBreakdown: { 5: 15, 4: 6, 3: 3, 2: 1, 1: 0 },
      };
    }
    return null;
  }

  return {
    id: mockProvider.id,
    businessName: mockProvider.businessName,
    description: mockProvider.description,
    avatarUrl: mockProvider.avatarUrl,
    averageRating: mockProvider.averageRating,
    totalReviews: mockProvider.totalReviews,
    trustScore: mockProvider.trustScore,
    subscriptionStatus: mockProvider.subscriptionStatus,
    city: mockProvider.city,
    address: "Quartier commercial",
    phone: "+225 07 00 00 00 00",
    email: `contact@${mockProvider.businessName.toLowerCase().replace(/\s+/g, "")}.ci`,
    badgeVerified: mockProvider.badgeVerified,
    hourlyRate: mockProvider.hourlyRate,
    services: [
      {
        id: "1",
        name: mockProvider.serviceCategory,
        category: mockProvider.serviceCategory,
        price: mockProvider.hourlyRate,
      },
    ],
    stats: {
      totalReservations: mockProvider.totalReviews * 2,
      totalReviews: mockProvider.totalReviews,
      averageRating: mockProvider.averageRating,
      responseTime: "< 2h",
    },
    memberSince: "2023-06-01T00:00:00.000Z",
    ratingBreakdown: {
      5: Math.round(mockProvider.totalReviews * 0.6),
      4: Math.round(mockProvider.totalReviews * 0.25),
      3: Math.round(mockProvider.totalReviews * 0.1),
      2: Math.round(mockProvider.totalReviews * 0.03),
      1: Math.round(mockProvider.totalReviews * 0.02),
    },
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const provider = getProviderProfile(id);

    if (!provider) {
      return NextResponse.json(
        { success: false, error: "Provider not found" },
        { status: 404 }
      );
    }

    // Get similar providers
    const similarProviders = FEATURED_PROVIDERS.filter((p) => p.id !== id)
      .slice(0, 4)
      .map((p) => ({
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

    return NextResponse.json({
      success: true,
      data: {
        ...provider,
        similarProviders,
      },
    });
  } catch (error) {
    console.error("Error fetching provider:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch provider" },
      { status: 500 }
    );
  }
}
