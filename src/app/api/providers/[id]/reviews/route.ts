import { NextRequest, NextResponse } from "next/server";
import { FEATURED_PROVIDERS } from "@/lib/constants/mockData";

// Mock reviews data
function getMockReviews(providerId: string) {
  const mockReviews = [
    {
      id: "review-1",
      rating: 5,
      comment: "Excellent travail, très professionnel et ponctuel. Je recommande vivement !",
      createdAt: "2024-01-15T10:30:00.000Z",
      client: {
        fullName: "Aminata Koné",
        avatarUrl: "https://i.pravatar.cc/150?img=23",
      },
    },
    {
      id: "review-2",
      rating: 4,
      comment: "Bon service dans l'ensemble. Quelques ajustements mineurs mais satisfaction globale.",
      createdAt: "2024-01-10T14:15:00.000Z",
      client: {
        fullName: "Jean-Baptiste Yao",
        avatarUrl: "https://i.pravatar.cc/150?img=51",
      },
    },
    {
      id: "review-3",
      rating: 5,
      comment: "Travail impeccable ! Le prestataire a pris le temps de bien comprendre mes besoins.",
      createdAt: "2024-01-05T09:00:00.000Z",
      client: {
        fullName: "Fatou Diallo",
        avatarUrl: "https://i.pravatar.cc/150?img=25",
      },
    },
    {
      id: "review-4",
      rating: 4,
      comment: "Service de qualité, prix raisonnable. Je ferai appel à nouveau.",
      createdAt: "2024-01-01T16:45:00.000Z",
      client: {
        fullName: "Kouamé Laurent",
        avatarUrl: "https://i.pravatar.cc/150?img=57",
      },
    },
    {
      id: "review-5",
      rating: 5,
      comment: "Parfait ! Très réactif et professionnel. Merci pour le travail accompli.",
      createdAt: "2023-12-20T11:30:00.000Z",
      client: {
        fullName: "Marie Adjoua",
        avatarUrl: "https://i.pravatar.cc/150?img=26",
      },
    },
  ];

  // Check if provider exists
  const provider = FEATURED_PROVIDERS.find((p) => p.id === providerId);
  if (!provider && !providerId.startsWith("provider-")) {
    return null;
  }

  // Return different number of reviews based on provider
  const reviewCount = provider?.totalReviews || 5;
  return mockReviews.slice(0, Math.min(reviewCount, 5));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const rating = searchParams.get("rating");

    const reviews = getMockReviews(id);

    if (reviews === null) {
      return NextResponse.json(
        { success: false, error: "Provider not found" },
        { status: 404 }
      );
    }

    // Filter by rating if specified
    let filteredReviews = reviews;
    if (rating) {
      const ratingNum = Number(rating);
      filteredReviews = reviews.filter((r) => r.rating === ratingNum);
    }

    // Pagination
    const total = filteredReviews.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedReviews = filteredReviews.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      data: paginatedReviews,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
