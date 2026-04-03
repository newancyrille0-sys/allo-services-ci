"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  X,
  Grid3X3,
  List,
  Map,
  SlidersHorizontal,
  Star,
  BadgeCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { SERVICE_CATEGORIES } from "@/lib/constants/services";
import { CITIES_CI } from "@/lib/constants/cities";
import { FEATURED_PROVIDERS, type MockProvider } from "@/lib/constants/mockData";

const sortOptions = [
  { value: "popular", label: "Popularité" },
  { value: "rating", label: "Meilleures notes" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "trust", label: "Score de confiance" },
];

const subscriptionTiers = [
  { value: "PREMIUM", label: "Premium", color: "bg-gradient-to-r from-amber-500 to-yellow-400" },
  { value: "MONTHLY", label: "Standard", color: "bg-emerald-500" },
  { value: "FREE", label: "Gratuit", color: "bg-gray-400" },
];

// Generate more mock providers
function generateMockProviders(): MockProvider[] {
  const additionalProviders: MockProvider[] = [
    {
      id: "provider-7",
      businessName: "Électro Pro Services",
      description: "Électricien certifié pour tous vos travaux électriques. Installation, dépannage et mise aux normes.",
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
      description: "Cours de cuisine et pâtisserie à domicile. Apprenez les recettes ivoiriennes et internationales.",
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
      description: "Service de déménagement complet. Emballage, transport et déballage soigné.",
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
      description: "Massage et soins spa à domicile. Détendez-vous sans bouger de chez vous.",
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

interface FilterContentProps {
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  selectedCity: string;
  onSetCity: (city: string) => void;
  minRating: number;
  onSetMinRating: (rating: number) => void;
  priceRange: [number, number];
  onSetPriceRange: (range: [number, number]) => void;
  selectedTiers: string[];
  onToggleTier: (tier: string) => void;
  verifiedOnly: boolean;
  onSetVerifiedOnly: (verified: boolean) => void;
  activeFiltersCount: number;
  onClearFilters: () => void;
}

function FilterContent({
  selectedCategories,
  onToggleCategory,
  selectedCity,
  onSetCity,
  minRating,
  onSetMinRating,
  priceRange,
  onSetPriceRange,
  selectedTiers,
  onToggleTier,
  verifiedOnly,
  onSetVerifiedOnly,
  activeFiltersCount,
  onClearFilters,
}: FilterContentProps) {
  return (
    <div className="space-y-6">
      {/* Service Category Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-gray-900">Catégorie de service</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {SERVICE_CATEGORIES.map((category) => (
            <div key={category.slug} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${category.slug}`}
                checked={selectedCategories.includes(category.name)}
                onCheckedChange={() => onToggleCategory(category.name)}
              />
              <Label
                htmlFor={`cat-${category.slug}`}
                className="text-sm font-normal cursor-pointer flex-1 text-gray-700"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* City Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-gray-900">Ville</h4>
        <Select value={selectedCity || "all"} onValueChange={(v) => onSetCity(v === "all" ? "" : v)}>
          <SelectTrigger>
            <SelectValue placeholder="Toutes les villes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les villes</SelectItem>
            {CITIES_CI.slice(0, 30).map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-gray-900">Note minimum</h4>
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

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-gray-900">Prix horaire (FCFA)</h4>
        <Slider
          value={priceRange}
          onValueChange={(v) => onSetPriceRange(v as [number, number])}
          max={20000}
          step={500}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>{priceRange[0].toLocaleString()} FCFA</span>
          <span>{priceRange[1].toLocaleString()} FCFA</span>
        </div>
      </div>

      {/* Subscription Tier */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-gray-900">Type d&apos;abonnement</h4>
        <div className="space-y-2">
          {subscriptionTiers.map((tier) => (
            <div key={tier.value} className="flex items-center space-x-2">
              <Checkbox
                id={`tier-${tier.value}`}
                checked={selectedTiers.includes(tier.value)}
                onCheckedChange={() => onToggleTier(tier.value)}
              />
              <Label
                htmlFor={`tier-${tier.value}`}
                className="text-sm font-normal cursor-pointer flex items-center gap-2 text-gray-700"
              >
                <span className={cn("w-2 h-2 rounded-full", tier.color)} />
                {tier.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Only */}
      <div className="flex items-center justify-between">
        <Label htmlFor="verified" className="text-sm font-medium cursor-pointer text-gray-900">
          Prestataires vérifiés uniquement
        </Label>
        <Switch
          id="verified"
          checked={verifiedOnly}
          onCheckedChange={onSetVerifiedOnly}
        />
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={onClearFilters}>
          <X className="h-4 w-4 mr-2" />
          Effacer les filtres ({activeFiltersCount})
        </Button>
      )}
    </div>
  );
}

export default function ProvidersPage() {
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = React.useState(searchParams.get("q") || "");
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    searchParams.get("categories")?.split(",").filter(Boolean) || []
  );
  const [selectedCity, setSelectedCity] = React.useState(searchParams.get("city") || "");
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 20000]);
  const [minRating, setMinRating] = React.useState<number>(
    Number(searchParams.get("rating")) || 0
  );
  const [selectedTiers, setSelectedTiers] = React.useState<string[]>(
    searchParams.get("tiers")?.split(",").filter(Boolean) || []
  );
  const [verifiedOnly, setVerifiedOnly] = React.useState(false);
  const [sortBy, setSortBy] = React.useState(searchParams.get("sort") || "popular");
  const [viewMode, setViewMode] = React.useState<"grid" | "list" | "map">("grid");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const allProviders = React.useMemo(() => generateMockProviders(), []);

  // Filter and sort providers
  const filteredProviders = React.useMemo(() => {
    let providers = [...allProviders];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      providers = providers.filter(
        (p) =>
          p.businessName.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.serviceCategory.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      providers = providers.filter((p) =>
        selectedCategories.some((cat) =>
          p.serviceCategory.toLowerCase().includes(cat.toLowerCase())
        )
      );
    }

    // City filter
    if (selectedCity) {
      providers = providers.filter((p) => p.city === selectedCity);
    }

    // Price filter
    providers = providers.filter(
      (p) => p.hourlyRate >= priceRange[0] && p.hourlyRate <= priceRange[1]
    );

    // Rating filter
    if (minRating > 0) {
      providers = providers.filter((p) => p.averageRating >= minRating);
    }

    // Tier filter
    if (selectedTiers.length > 0) {
      providers = providers.filter((p) => selectedTiers.includes(p.subscriptionStatus));
    }

    // Verified only
    if (verifiedOnly) {
      providers = providers.filter((p) => p.badgeVerified);
    }

    // Sort
    switch (sortBy) {
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

    return providers;
  }, [
    allProviders,
    searchQuery,
    selectedCategories,
    selectedCity,
    priceRange,
    minRating,
    selectedTiers,
    verifiedOnly,
    sortBy,
  ]);

  // Premium providers first
  const premiumProviders = filteredProviders.filter(
    (p) => p.subscriptionStatus === "PREMIUM"
  );
  const otherProviders = filteredProviders.filter(
    (p) => p.subscriptionStatus !== "PREMIUM"
  );

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleTier = (tier: string) => {
    setSelectedTiers((prev) =>
      prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedCity("");
    setPriceRange([0, 20000]);
    setMinRating(0);
    setSelectedTiers([]);
    setVerifiedOnly(false);
  };

  const activeFiltersCount =
    selectedCategories.length +
    (selectedCity ? 1 : 0) +
    selectedTiers.length +
    (minRating > 0 ? 1 : 0) +
    (verifiedOnly ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-blue-600 hover:text-blue-700">Accueil</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900">Prestataires</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tous les prestataires
        </h1>
        <p className="text-gray-600">
          Découvrez les meilleurs prestataires de services en Côte d&apos;Ivoire.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="container mx-auto px-4 pb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher un prestataire..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
          </div>

          {/* Desktop Controls */}
          <div className="hidden lg:flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-white border-gray-200">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-white">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("map")}
                className={viewMode === "map" ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                <Map className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden border-gray-200 bg-white">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtres
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-blue-600 text-white">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-gray-900">Filtres</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent
                  selectedCategories={selectedCategories}
                  onToggleCategory={toggleCategory}
                  selectedCity={selectedCity}
                  onSetCity={setSelectedCity}
                  minRating={minRating}
                  onSetMinRating={setMinRating}
                  priceRange={priceRange}
                  onSetPriceRange={setPriceRange}
                  selectedTiers={selectedTiers}
                  onToggleTier={toggleTier}
                  verifiedOnly={verifiedOnly}
                  onSetVerifiedOnly={setVerifiedOnly}
                  activeFiltersCount={activeFiltersCount}
                  onClearFilters={clearFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-sm text-gray-600">Filtres actifs:</span>
            {selectedCategories.map((cat) => (
              <Badge key={cat} variant="secondary" className="gap-1 bg-gray-200 text-gray-700">
                {cat}
                <button onClick={() => toggleCategory(cat)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {selectedCity && (
              <Badge variant="secondary" className="gap-1 bg-gray-200 text-gray-700">
                {selectedCity}
                <button onClick={() => setSelectedCity("")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {minRating > 0 && (
              <Badge variant="secondary" className="gap-1 bg-gray-200 text-gray-700">
                {minRating}+ étoiles
                <button onClick={() => setMinRating(0)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {verifiedOnly && (
              <Badge variant="secondary" className="gap-1 bg-gray-200 text-gray-700">
                Vérifiés
                <button onClick={() => setVerifiedOnly(false)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <h3 className="font-semibold mb-4 text-gray-900">Filtres</h3>
              <FilterContent
                selectedCategories={selectedCategories}
                onToggleCategory={toggleCategory}
                selectedCity={selectedCity}
                onSetCity={setSelectedCity}
                minRating={minRating}
                onSetMinRating={setMinRating}
                priceRange={priceRange}
                onSetPriceRange={setPriceRange}
                selectedTiers={selectedTiers}
                onToggleTier={toggleTier}
                verifiedOnly={verifiedOnly}
                onSetVerifiedOnly={setVerifiedOnly}
                activeFiltersCount={activeFiltersCount}
                onClearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1">
            {/* Results Count */}
            <p className="text-sm text-gray-600 mb-4">
              {filteredProviders.length} prestataire{filteredProviders.length !== 1 ? "s" : ""} trouvé{filteredProviders.length !== 1 ? "s" : ""}
            </p>

            {viewMode === "map" ? (
              /* Map View Placeholder */
              <div className="bg-white border border-gray-200 rounded-xl h-[600px] flex items-center justify-center shadow-sm">
                <div className="text-center">
                  <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-gray-900">Carte interactive</h3>
                  <p className="text-gray-600">
                    Intégration OpenStreetMap à venir
                  </p>
                </div>
              </div>
            ) : filteredProviders.length > 0 ? (
              <div className="space-y-8">
                {/* Premium Providers Section */}
                {premiumProviders.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                      <h3 className="font-semibold text-lg text-gray-900">Prestataires Premium</h3>
                    </div>
                    <div
                      className={cn(
                        viewMode === "grid"
                          ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                          : "flex flex-col gap-4"
                      )}
                    >
                      {premiumProviders.map((provider) => (
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
                  </div>
                )}

                {/* Other Providers */}
                {otherProviders.length > 0 && (
                  <div>
                    {premiumProviders.length > 0 && (
                      <h3 className="font-semibold text-lg mb-4 text-gray-900">
                        Autres prestataires
                      </h3>
                    )}
                    <div
                      className={cn(
                        viewMode === "grid"
                          ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                          : "flex flex-col gap-4"
                      )}
                    >
                      {otherProviders.map((provider) => (
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
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-gray-900">
                  Aucun prestataire trouvé
                </h3>
                <p className="text-gray-600 mb-4">
                  Essayez de modifier vos critères de recherche
                </p>
                <Button onClick={clearFilters} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Effacer les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
