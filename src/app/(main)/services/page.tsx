"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Grid3X3,
  List,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
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
import { ServiceCard } from "@/components/services/ServiceCard";
import { SERVICE_CATEGORIES, getCategoryBySlug } from "@/lib/constants/services";
import { CITIES_CI } from "@/lib/constants/cities";
import { SERVICE_PROVIDER_COUNTS } from "@/lib/constants/mockData";

const sortOptions = [
  { value: "popular", label: "Popularité" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "rating", label: "Note" },
];

const subscriptionTiers = [
  { value: "PREMIUM", label: "Premium", color: "bg-gradient-to-r from-amber-500 to-yellow-400" },
  { value: "MONTHLY", label: "Standard", color: "bg-emerald-500" },
  { value: "FREE", label: "Gratuit", color: "bg-gray-400" },
];

interface FilterContentProps {
  selectedCategories: string[];
  onToggleCategory: (slug: string) => void;
  selectedCities: string[];
  onSetCities: (cities: string[]) => void;
  priceRange: [number, number];
  onSetPriceRange: (range: [number, number]) => void;
  minRating: number;
  onSetMinRating: (rating: number) => void;
  selectedTiers: string[];
  onToggleTier: (tier: string) => void;
  activeFiltersCount: number;
  onClearFilters: () => void;
}

function FilterContent({
  selectedCategories,
  onToggleCategory,
  selectedCities,
  onSetCities,
  priceRange,
  onSetPriceRange,
  minRating,
  onSetMinRating,
  selectedTiers,
  onToggleTier,
  activeFiltersCount,
  onClearFilters,
}: FilterContentProps) {
  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Catégories</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {SERVICE_CATEGORIES.map((category) => (
            <div key={category.slug} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${category.slug}`}
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={() => onToggleCategory(category.slug)}
              />
              <Label
                htmlFor={`cat-${category.slug}`}
                className="text-sm font-normal cursor-pointer flex-1"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* City Filter */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Ville</h4>
        <Select value={selectedCities[0] || "all"} onValueChange={(v) => onSetCities(v === "all" ? [] : [v])}>
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

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Prix horaire</h4>
        <Slider
          value={priceRange}
          onValueChange={(v) => onSetPriceRange(v as [number, number])}
          max={50000}
          step={1000}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{priceRange[0].toLocaleString('fr-FR')} FCFA</span>
          <span>{priceRange[1].toLocaleString('fr-FR')} FCFA</span>
        </div>
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
                className="text-sm font-normal cursor-pointer flex items-center gap-2"
              >
                <span className={cn("w-2 h-2 rounded-full", tier.color)} />
                {tier.label}
              </Label>
            </div>
          ))}
        </div>
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

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = React.useState(searchParams.get("q") || "");
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    searchParams.get("categories")?.split(",").filter(Boolean) || []
  );
  const [selectedCities, setSelectedCities] = React.useState<string[]>(
    searchParams.get("cities")?.split(",").filter(Boolean) || []
  );
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 50000]);
  const [minRating, setMinRating] = React.useState<number>(
    Number(searchParams.get("rating")) || 0
  );
  const [selectedTiers, setSelectedTiers] = React.useState<string[]>(
    searchParams.get("tiers")?.split(",").filter(Boolean) || []
  );
  const [sortBy, setSortBy] = React.useState(searchParams.get("sort") || "popular");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  // Filter services based on search and filters
  const filteredServices = React.useMemo(() => {
    let services = SERVICE_CATEGORIES.map((cat) => ({
      ...cat,
      providerCount: SERVICE_PROVIDER_COUNTS[cat.slug] || 0,
    }));

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      services = services.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.subServices.some((sub) => sub.name.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      services = services.filter((s) => selectedCategories.includes(s.slug));
    }

    return services;
  }, [searchQuery, selectedCategories]);

  // Sort services
  const sortedServices = React.useMemo(() => {
    const sorted = [...filteredServices];
    switch (sortBy) {
      case "popular":
        return sorted.sort((a, b) => b.providerCount - a.providerCount);
      case "price_asc":
        return sorted.sort((a, b) => a.providerCount - b.providerCount);
      case "price_desc":
        return sorted.sort((a, b) => b.providerCount - a.providerCount);
      case "rating":
        return sorted.sort((a, b) => b.providerCount - a.providerCount);
      default:
        return sorted;
    }
  }, [filteredServices, sortBy]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
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
    setSelectedCities([]);
    setPriceRange([0, 50000]);
    setMinRating(0);
    setSelectedTiers([]);
  };

  const activeFiltersCount =
    selectedCategories.length +
    selectedCities.length +
    selectedTiers.length +
    (minRating > 0 ? 1 : 0);

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
              <BreadcrumbPage>Services</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-secondary mb-2">
          Tous les services
        </h1>
        <p className="text-muted-foreground">
          Découvrez tous nos services et trouvez le prestataire idéal pour vos besoins.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="container mx-auto px-4 pb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Desktop Filters Button */}
          <div className="hidden lg:flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
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

            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtres
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2" variant="secondary">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filtres</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent
                  selectedCategories={selectedCategories}
                  onToggleCategory={toggleCategory}
                  selectedCities={selectedCities}
                  onSetCities={setSelectedCities}
                  priceRange={priceRange}
                  onSetPriceRange={setPriceRange}
                  minRating={minRating}
                  onSetMinRating={setMinRating}
                  selectedTiers={selectedTiers}
                  onToggleTier={toggleTier}
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
            <span className="text-sm text-muted-foreground">Filtres actifs:</span>
            {selectedCategories.map((slug) => {
              const cat = getCategoryBySlug(slug);
              return cat ? (
                <Badge key={slug} variant="secondary" className="gap-1">
                  {cat.name}
                  <button onClick={() => toggleCategory(slug)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ) : null;
            })}
            {selectedCities.map((city) => (
              <Badge key={city} variant="secondary" className="gap-1">
                {city}
                <button onClick={() => toggleCity(city)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {minRating > 0 && (
              <Badge variant="secondary" className="gap-1">
                {minRating}+ étoiles
                <button onClick={() => setMinRating(0)}>
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
            <div className="sticky top-24 bg-white rounded-xl border p-4">
              <h3 className="font-semibold mb-4">Filtres</h3>
              <FilterContent
                selectedCategories={selectedCategories}
                onToggleCategory={toggleCategory}
                selectedCities={selectedCities}
                onSetCities={setSelectedCities}
                priceRange={priceRange}
                onSetPriceRange={setPriceRange}
                minRating={minRating}
                onSetMinRating={setMinRating}
                selectedTiers={selectedTiers}
                onToggleTier={toggleTier}
                activeFiltersCount={activeFiltersCount}
                onClearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* Services Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-4">
              {sortedServices.length} service{sortedServices.length !== 1 ? "s" : ""} trouvé{sortedServices.length !== 1 ? "s" : ""}
            </p>

            {sortedServices.length > 0 ? (
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                    : "flex flex-col gap-4"
                )}
              >
                {sortedServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={{
                      id: service.id,
                      name: service.name,
                      slug: service.slug,
                      icon: service.icon,
                      providerCount: service.providerCount,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Aucun service trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  Essayez de modifier vos critères de recherche
                </p>
                <Button onClick={clearFilters}>Effacer les filtres</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
