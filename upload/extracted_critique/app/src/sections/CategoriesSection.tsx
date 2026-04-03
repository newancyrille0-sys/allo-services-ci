import { useNavigate } from 'react-router-dom';
import { 
  Droplets, 
  Zap, 
  Sparkles, 
  Truck, 
  Wrench, 
  Home, 
  Monitor, 
  Utensils, 
  PartyPopper, 
  Users,
  ArrowUpRight
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  Droplets,
  Zap,
  Sparkles,
  Truck,
  Wrench,
  Home,
  Monitor,
  Utensils,
  PartyPopper,
  Users,
};

export function CategoriesSection() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/services?category=${categoryId}`);
  };

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-30" />
      
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            Nos catégories
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Trouvez le service{' '}
            <span className="gradient-text">qu'il vous faut</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Des milliers de professionnels qualifiés dans tous les domaines 
            pour répondre à vos besoins au quotidien.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {SERVICE_CATEGORIES.map((category, index) => {
            const Icon = iconMap[category.icon];
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-500 text-left card-lift"
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {/* Icon */}
                <div className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {category.description}
                </p>

                {/* Arrow */}
                <div className="flex items-center text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Explorer
                  <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </button>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/services')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all hover:scale-105 hover:shadow-xl"
          >
            Voir tous les services
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
