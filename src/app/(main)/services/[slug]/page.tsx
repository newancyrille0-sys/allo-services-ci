"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Search,
  MapPin,
  Star,
  ChevronRight,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { SubscriptionBadge } from "@/components/providers/SubscriptionBadge";
import { TrustScore } from "@/components/providers/TrustScore";
import {
  SERVICE_CATEGORIES,
  getCategoryBySlug,
  type ServiceCategory,
} from "@/lib/constants/services";
import { CITIES_CI, POPULAR_CITIES } from "@/lib/constants/cities";
import { FEATURED_PROVIDERS, SERVICE_PROVIDER_COUNTS } from "@/lib/constants/mockData";

// Mock providers for this service
function getProvidersForService(serviceSlug: string) {
  // In real app, this would be an API call
  const shuffled = [...FEATURED_PROVIDERS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 6).map((p) => ({
    ...p,
    serviceCategory: serviceSlug,
  }));
}

// Icon component
function ServiceIcon({ icon, className }: { icon: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    Wrench: "🔧",
    Sparkles: "✨",
    Scissors: "✂️",
    GraduationCap: "🎓",
    Truck: "🚚",
    PartyPopper: "🎉",
    Heart: "❤️",
    Laptop: "💻",
    Trees: "🌳",
    Building: "🏢",
  };
  return <span className={cn("text-2xl", className)}>{icons[icon] || "📋"}</span>;
}

interface FilterContentProps {
  selectedCity: string;
  onSetCity: (city: string) => void;
  minRating: number;
  onSetMinRating: (rating: number) => void;
  selectedTier: string;
  onSetTier: (tier: string) => void;
}

function FilterContent({
  selectedCity,
  onSetCity,
  minRating,
  onSetMinRating,
  selectedTier,
  onSetTier,
}: FilterContentProps) {
  return (
    <div className="space-y-6">
      {/* City Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Ville</h4>
        <Select value={selectedCity || "all"} onValueChange={(v) => onSetCity(v === "all" ? "" : v)}>
          <SelectTrigger>
            <SelectValue placeholder="Toutes les villes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les villes</SelectItem>
            {CITIES_CI.slice(0, 20).map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Note minimum</h4>
        <Select
          value={minRating.toString()}
          onValueChange={(v) => onSetMinRating(Number(v))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les notes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Toutes les notes</SelectItem>
            <SelectItem value="4">4 étoiles et plus</SelectItem>
            <SelectItem value="3">3 étoiles et plus</SelectItem>
            <SelectItem value="2">2 étoiles et plus</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Subscription Tier */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Type d&apos;abonnement</h4>
        <Select value={selectedTier || "all"} onValueChange={(v) => onSetTier(v === "all" ? "" : v)}>
          <SelectTrigger>
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="PREMIUM">Premium</SelectItem>
            <SelectItem value="MONTHLY">Standard</SelectItem>
            <SelectItem value="FREE">Gratuit</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState("");
  const [minRating, setMinRating] = React.useState(0);
  const [selectedTier, setSelectedTier] = React.useState("");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const category = getCategoryBySlug(slug);

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Service non trouvé</h1>
        <p className="text-muted-foreground mb-6">
          Le service que vous recherchez n&apos;existe pas.
        </p>
        <Button asChild>
          <Link href="/services">Voir tous les services</Link>
        </Button>
      </div>
    );
  }

  const providers = getProvidersForService(slug);

  // Filter providers
  const filteredProviders = providers.filter((provider) => {
    if (selectedCity && provider.city !== selectedCity) return false;
    if (minRating > 0 && provider.averageRating < minRating) return false;
    if (selectedTier && provider.subscriptionStatus !== selectedTier) return false;
    if (
      searchQuery &&
      !provider.businessName.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  // Get related services (excluding current)
  const relatedServices = SERVICE_CATEGORIES.filter(
    (s) => s.slug !== slug
  )
    .slice(0, 4)
    .map((s) => ({
      ...s,
      providerCount: SERVICE_PROVIDER_COUNTS[s.slug] || 0,
    }));

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/services">Services</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{category.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Service Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <ServiceIcon icon={category.icon} className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-2">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-muted-foreground mb-4">{category.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <Badge variant="secondary">
                  {SERVICE_PROVIDER_COUNTS[slug] || 0} prestataires
                </Badge>
                <Badge variant="outline">{category.subServices.length} sous-services</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-services */}
      <div className="container mx-auto px-4 pb-8">
        <h2 className="text-xl font-semibold mb-4">Sous-services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {category.subServices.map((subService, index) => (
            <Card
              key={index}
              className="hover:border-primary/20 transition-colors cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <ChevronRight className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{subService.name}</p>
                    {subService.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {subService.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Providers Section */}
      <div className="container mx-auto px-4 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold">
            Prestataires pour {category.name}
          </h2>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-[200px]"
              />
            </div>

            {/* Mobile Filter */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Search className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>Filtres</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent
                    selectedCity={selectedCity}
                    onSetCity={setSelectedCity}
                    minRating={minRating}
                    onSetMinRating={setMinRating}
                    selectedTier={selectedTier}
                    onSetTier={setSelectedTier}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24 bg-white rounded-xl border p-4">
              <h3 className="font-semibold mb-4">Filtres</h3>
              <FilterContent
                selectedCity={selectedCity}
                onSetCity={setSelectedCity}
                minRating={minRating}
                onSetMinRating={setMinRating}
                selectedTier={selectedTier}
                onSetTier={setSelectedTier}
              />
            </div>
          </aside>

          {/* Providers Grid */}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-4">
              {filteredProviders.length} prestataire{filteredProviders.length !== 1 ? "s" : ""} trouvé{filteredProviders.length !== 1 ? "s" : ""}
            </p>

            {filteredProviders.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredProviders.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={{
                      id: provider.id,
                      businessName: provider.businessName,
                      description: provider.description,
                      avatarUrl: provider.avatarUrl,
                      averageRating: provider.averageRating,
                      totalReviews: provider.totalReviews,
                      trustScore: provider.trustScore,
                      subscriptionStatus: provider.subscriptionStatus,
                      city: provider.city,
                      hourlyRate: provider.hourlyRate,
                      badgeVerified: provider.badgeVerified,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Aucun prestataire trouvé
                </h3>
                <p className="text-muted-foreground mb-4">
                  Essayez de modifier vos critères de recherche
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCity("");
                    setMinRating(0);
                    setSelectedTier("");
                  }}
                >
                  Effacer les filtres
                </Button>
              </div>
            )}

            {/* CTA */}
            {filteredProviders.length > 0 && (
              <div className="mt-8 text-center">
                <Button size="lg" asChild>
                  <Link href="/providers">
                    Voir tous les prestataires
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <div className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-semibold mb-6">Services similaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
