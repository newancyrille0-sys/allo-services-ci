import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, BadgeCheck, ArrowRight, Phone, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPremiumProviders } from '@/lib/storage';
import type { Provider } from '@/types';
import { SERVICE_CATEGORIES } from '@/types';

export function PopularProvidersSection() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProviders = () => {
      const premiumProviders = getPremiumProviders().slice(0, 6);
      setProviders(premiumProviders);
      setIsLoading(false);
    };

    loadProviders();
  }, []);

  const getCategoryColor = (categoryId: string) => {
    const category = SERVICE_CATEGORIES.find(c => c.id === categoryId);
    return category?.color || 'bg-gray-500';
  };

  const getCategoryName = (categoryId: string) => {
    const category = SERVICE_CATEGORIES.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  if (isLoading) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gray-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-100/30 rounded-full blur-3xl" />
      
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full text-sm font-semibold mb-4">
              <TrendingUp className="w-4 h-4" />
              Prestataires populaires
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Les meilleurs{' '}
              <span className="gradient-text">prestataires</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-xl">
              Découvrez nos prestataires Premium les mieux notés et vérifiés
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/services')}
            className="self-start lg:self-auto rounded-full px-6 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
          >
            Voir tout
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider, index) => (
            <div
              key={provider.id}
              onClick={() => navigate(`/prestataire/${provider.id}`)}
              className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-500 cursor-pointer card-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={provider.photoUrl || `https://ui-avatars.com/api/?name=${provider.firstName}+${provider.lastName}&background=random`}
                    alt={`${provider.firstName} ${provider.lastName}`}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                  {provider.isPremium && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      <BadgeCheck className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {provider.firstName} {provider.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {provider.serviceName}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex items-center gap-0.5">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold text-gray-900">
                        {provider.trustScore >= 90 ? '4.9' : provider.trustScore >= 80 ? '4.7' : '4.5'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      ({Math.floor(Math.random() * 50) + 10} avis)
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Badge */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white ${getCategoryColor(provider.serviceCategory)}`}>
                  {getCategoryName(provider.serviceCategory)}
                </span>
                {provider.isPremium && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-amber-500 text-white">
                    <BadgeCheck className="w-3 h-3 mr-1" />
                    Premium
                  </span>
                )}
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{provider.city}, {provider.district}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {provider.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                {/* Trust Score */}
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="#e2e8f0"
                        strokeWidth="4"
                        fill="none"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke={provider.trustScore >= 80 ? '#22c55e' : provider.trustScore >= 60 ? '#3b82f6' : '#eab308'}
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${provider.trustScore * 1.26} 126`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
                      {provider.trustScore}%
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">Confiance</span>
                </div>

                {/* Contact Button */}
                <a
                  href={`https://wa.me/225${provider.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-all hover:scale-105"
                >
                  <Phone className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {providers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun prestataire premium pour le moment
            </h3>
            <p className="text-gray-600 mb-4">
              Devenez le premier prestataire premium de la plateforme !
            </p>
            <Button onClick={() => navigate('/devenir-prestataire')} className="rounded-full">
              Devenir prestataire
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
