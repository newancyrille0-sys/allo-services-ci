"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ProviderCard } from "@/components/providers/ProviderCard";
import {
  ProviderProfile,
  ProviderProfileSkeleton,
  type ProviderProfileData,
} from "@/components/providers/ProviderProfile";
import { FEATURED_PROVIDERS } from "@/lib/constants/mockData";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

// Mock provider profile data
function getProviderProfile(id: string): ProviderProfileData | null {
  const mockProvider = FEATURED_PROVIDERS.find((p) => p.id === id);

  if (!mockProvider) {
    // Generate a default provider for demo
    return {
      id: id,
      businessName: "Prestataire Demo",
      description:
        "Professionnel expérimenté offrant des services de qualité en Côte d'Ivoire. Nous nous engageons à fournir un excellent service client et des résultats satisfaisants.",
      averageRating: 4.5,
      totalReviews: 25,
      trustScore: 85,
      subscriptionStatus: "MONTHLY",
      city: "Abidjan",
      address: "Cocody, Rue des Jardins",
      phone: "+225 07 00 00 00 00",
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
      memberSince: new Date("2023-01-15"),
      reviews: [
        {
          id: "1",
          rating: 5,
          comment: "Excellent travail, très professionnel et ponctuel.",
          createdAt: new Date("2024-01-15"),
          client: { fullName: "Aminata K." },
        },
        {
          id: "2",
          rating: 4,
          comment: "Bon service, je recommande.",
          createdAt: new Date("2024-01-10"),
          client: { fullName: "Jean-Baptiste Y." },
        },
      ],
      ratingBreakdown: { 5: 15, 4: 6, 3: 3, 2: 1, 1: 0 },
    };
  }

  return {
    id: mockProvider.id,
    businessName: mockProvider.businessName,
    description: mockProvider.description,
    averageRating: mockProvider.averageRating,
    totalReviews: mockProvider.totalReviews,
    trustScore: mockProvider.trustScore,
    subscriptionStatus: mockProvider.subscriptionStatus,
    city: mockProvider.city,
    address: "Quartier commercial",
    phone: "+225 07 00 00 00 00",
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
    memberSince: new Date("2023-06-01"),
    reviews: [
      {
        id: "1",
        rating: Math.min(5, Math.round(mockProvider.averageRating)),
        comment: "Service professionnel et de qualité.",
        createdAt: new Date("2024-01-15"),
        client: { fullName: "Client S." },
      },
    ],
    ratingBreakdown: {
      5: Math.round(mockProvider.totalReviews * 0.6),
      4: Math.round(mockProvider.totalReviews * 0.25),
      3: Math.round(mockProvider.totalReviews * 0.1),
      2: Math.round(mockProvider.totalReviews * 0.03),
      1: Math.round(mockProvider.totalReviews * 0.02),
    },
  };
}

// Get similar providers
function getSimilarProviders(currentId: string, category: string) {
  return FEATURED_PROVIDERS.filter(
    (p) => p.id !== currentId
  ).slice(0, 4);
}

export default function ProviderProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const [provider, setProvider] = React.useState<ProviderProfileData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [similarProviders, setSimilarProviders] = React.useState<typeof FEATURED_PROVIDERS>([]);

  React.useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const data = getProviderProfile(id);
      setProvider(data);
      if (data) {
        setSimilarProviders(getSimilarProviders(id, data.services[0]?.category || ""));
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/providers">Prestataires</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Chargement...</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mt-6">
          <ProviderProfileSkeleton />
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Prestataire non trouvé</h1>
        <p className="text-muted-foreground mb-6">
          Le prestataire que vous recherchez n&apos;existe pas.
        </p>
        <Button asChild>
          <Link href="/providers">Voir tous les prestataires</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/providers">Prestataires</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{provider.businessName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Provider Profile */}
      <div className="container mx-auto px-4 mt-6">
        <ProviderProfile provider={provider} />
      </div>

      {/* Similar Providers */}
      {similarProviders.length > 0 && (
        <div className="container mx-auto px-4 mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Prestataires similaires</h2>
            <Button variant="outline" asChild>
              <Link href="/providers">
                Voir tous
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {similarProviders.map((p) => (
                <CarouselItem
                  key={p.id}
                  className="pl-4 basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <ProviderCard
                    provider={{
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
                    }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4" />
            <CarouselNext className="hidden md:flex -right-4" />
          </Carousel>
        </div>
      )}
    </div>
  );
}
