import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Filter, 
  Grid, 
  List, 
  Star, 
  BadgeCheck, 
  Phone,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useProviders } from '@/hooks/useProviders';
import { SERVICE_CATEGORIES, CITIES_CI } from '@/types';

export function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { 
    filteredProviders, 
    isLoading, 
    filters, 
    updateFilters 
  } = useProviders();

  // Synchroniser les filtres avec l'URL
  useEffect(() => {
    const category = searchParams.get('category') || '';
    const city = searchParams.get('city') || '';
    const q = searchParams.get('q') || '';
    
    updateFilters({
      category,
      city,
      searchQuery: q
    });
  }, [searchParams]);

  const handleSearch = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('q', value);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const handleCityChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('city', value);
    } else {
      newParams.delete('city');
    }
    setSearchParams(newParams);
  };

  const handleCategoryChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('category', value);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const getCategoryColor = (categoryId: string) => {
    const category = SERVICE_CATEGORIES.find(c => c.id === categoryId);
    return category?.color || 'bg-gray-500';
  };

  const getCategoryName = (categoryId: string) => {
    const category = SERVICE_CATEGORIES.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  // Composant de filtres
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Ville */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ville
        </label>
        <select
          value={filters.city}
          onChange={(e) => handleCityChange(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Toutes les villes</option>
          {CITIES_CI.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Catégorie */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Catégorie
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Toutes les catégories</option>
          {SERVICE_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Score de confiance */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Score de confiance minimum: {filters.minTrustScore}%
        </label>
        <Slider
          value={[filters.minTrustScore]}
          onValueChange={(value) => updateFilters({ minTrustScore: value[0] })}
          max={100}
          step={10}
          className="w-full"
        />
      </div>

      {/* Réinitialiser */}
      <Button
        variant="outline"
        onClick={() => {
          setSearchParams(new URLSearchParams());
          updateFilters({ city: '', category: '', minTrustScore: 0, searchQuery: '' });
        }}
        className="w-full"
      >
        Réinitialiser les filtres
      </Button>
    </div>
  );

  return (
    <main className="min-h-screen pt-20 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher un service ou un prestataire..."
                  value={filters.searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-12 h-12 border-gray-200 rounded-xl"
                />
              </div>

              {/* City Select */}
              <div className="relative lg:w-64">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filters.city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 border border-gray-200 rounded-xl appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Toutes les villes</option>
                  {CITIES_CI.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Filter Button (Mobile) */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden h-12 px-4">
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Filtres
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Filtres</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* View Mode Toggle */}
              <div className="hidden lg:flex items-center gap-2 border border-gray-200 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {/* Sidebar Filters (Desktop) */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-40">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <h2 className="font-semibold text-gray-900">Filtres</h2>
                </div>
                <FilterContent />
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1">
              {/* Results Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">{filteredProviders.length}</span>{' '}
                  prestataire{filteredProviders.length !== 1 ? 's' : ''} trouvé
                  {filteredProviders.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Providers Grid/List */}
              {isLoading ? (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : filteredProviders.length > 0 ? (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredProviders.map((provider) => (
                    <div
                      key={provider.id}
                      onClick={() => navigate(`/prestataire/${provider.id}`)}
                      className={`group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${
                        viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
                      }`}
                    >
                      {/* Image/Avatar */}
                      <div className={`relative ${viewMode === 'list' ? 'sm:w-48 flex-shrink-0' : ''}`}>
                        <img
                          src={provider.photoUrl || `https://ui-avatars.com/api/?name=${provider.firstName}+${provider.lastName}&background=random&size=200`}
                          alt={`${provider.firstName} ${provider.lastName}`}
                          className={`w-full object-cover ${
                            viewMode === 'list' 
                              ? 'h-48 sm:h-full' 
                              : 'h-48'
                          }`}
                        />
                        {provider.isPremium && (
                          <div className="absolute top-4 left-4 px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                            <BadgeCheck className="w-3 h-3" />
                            Premium
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                              {provider.firstName} {provider.lastName}
                            </h3>
                            <p className="text-sm text-gray-500">{provider.serviceName}</p>
                          </div>
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium text-yellow-700">
                              {provider.trustScore >= 90 ? '4.9' : provider.trustScore >= 80 ? '4.7' : '4.5'}
                            </span>
                          </div>
                        </div>

                        {/* Category & Location */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(provider.serviceCategory)}`}>
                            {getCategoryName(provider.serviceCategory)}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            <MapPin className="w-3 h-3 mr-1" />
                            {provider.city}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                          {provider.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Confiance:</span>
                            <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  provider.trustScore >= 90 ? 'bg-green-500' : 
                                  provider.trustScore >= 70 ? 'bg-blue-500' : 'bg-yellow-500'
                                }`}
                                style={{ width: `${provider.trustScore}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-600">
                              {provider.trustScore}%
                            </span>
                          </div>

                          <a
                            href={`https://wa.me/225${provider.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucun prestataire trouvé
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Essayez de modifier vos critères de recherche
                  </p>
                  <Button
                    onClick={() => {
                      setSearchParams(new URLSearchParams());
                      updateFilters({ city: '', category: '', minTrustScore: 0, searchQuery: '' });
                    }}
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
