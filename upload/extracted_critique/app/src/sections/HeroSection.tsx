import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Star, Users, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CITIES_CI } from '@/types';

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCity) params.set('city', selectedCity);
    navigate(`/services?${params.toString()}`);
  };

  const stats = [
    { value: '500+', label: 'Prestataires', icon: Users },
    { value: '4.9', label: 'Note moyenne', icon: Star },
    { value: '10K+', label: 'Clients satisfaits', icon: CheckCircle },
  ];

  const popularSearches = ['Plombier', 'Électricien', 'Coiffeur', 'Livreur', 'Réparation'];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/20 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid opacity-50" />
        
        {/* Floating Elements */}
        <div className="absolute top-32 right-20 w-20 h-20 bg-yellow-400/20 rounded-2xl rotate-12 animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-40 right-40 w-16 h-16 bg-blue-500/10 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 left-20 w-12 h-12 bg-green-400/20 rounded-lg -rotate-12 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container-custom relative z-10 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-6 animate-fade-in-up">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-blue-700">
                #1 des services à domicile en Côte d'Ivoire
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Trouvez le meilleur{' '}
              <span className="gradient-text">prestataire</span>{' '}
              <span className="relative">
                près de chez vous
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10C50 4 100 4 150 6C200 8 250 4 298 2" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Plombiers, électriciens, coiffeurs, livreurs... Des milliers de professionnels 
              vérifiés et notés à votre service dans toute la Côte d'Ivoire.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Quel service cherchez-vous ?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 border-0 bg-transparent text-base focus-visible:ring-0"
                  />
                </div>
                <div className="sm:w-52 relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-gray-50 rounded-xl border-0 text-base focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="">Toutes les villes</option>
                    {CITIES_CI.slice(0, 20).map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <Button 
                  type="submit"
                  className="h-14 px-8 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all hover:scale-105"
                >
                  <span className="hidden sm:inline">Rechercher</span>
                  <ArrowRight className="w-5 h-5 sm:hidden" />
                </Button>
              </div>
            </form>

            {/* Popular Searches */}
            <div className="flex flex-wrap items-center gap-2 mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <span className="text-sm text-gray-500">Populaire:</span>
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    navigate(`/services?q=${term}`);
                  }}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="hidden lg:block relative">
            <div className="relative">
              {/* Main Image Card */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <img
                  src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=700&fit=crop"
                  alt="Prestataire de services"
                  className="w-full h-[500px] object-cover"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <img
                          key={i}
                          src={`https://i.pravatar.cc/100?img=${i + 10}`}
                          alt=""
                          className="w-10 h-10 rounded-full border-2 border-white"
                        />
                      ))}
                    </div>
                    <div className="text-white">
                      <p className="font-semibold">+500 prestataires</p>
                      <p className="text-sm text-white/70">déjà inscrits</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 z-20 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Vérifiés</p>
                    <p className="text-sm text-gray-500">Identité confirmée</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 z-20 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">4.9/5</p>
                    <p className="text-sm text-gray-500">Note moyenne</p>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-1/2 -right-8 grid grid-cols-3 gap-2">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-blue-300 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
