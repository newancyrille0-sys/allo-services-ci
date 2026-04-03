import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Briefcase, TrendingUp, Shield, Sparkles, Wallet, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  const navigate = useNavigate();

  const benefits = [
    'Trouvez des clients facilement',
    'Gérez vos réservations en ligne',
    'Recevez des paiements sécurisés',
    'Construisez votre réputation',
    'Badge Premium pour plus de visibilité',
  ];

  const features = [
    {
      icon: Briefcase,
      title: 'Plus de clients',
      description: 'Accédez à des milliers de clients potentiels dans votre ville'
    },
    {
      icon: TrendingUp,
      title: 'Développez votre activité',
      description: 'Augmentez votre chiffre d\'affaires avec des réservations régulières'
    },
    {
      icon: Shield,
      title: 'Sécurité garantie',
      description: 'Vérification d\'identité et système d\'avis pour la confiance'
    },
  ];

  return (
    <section className="section-padding bg-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Devenez prestataire
            </span>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Rejoignez notre réseau de{' '}
              <span className="text-blue-400">prestataires qualifiés</span>
            </h2>

            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Vous êtes plombier, électricien, coiffeur, livreur ou autre professionnel ? 
              Inscrivez-vous gratuitement et commencez à recevoir des demandes de clients 
              près de chez vous.
            </p>

            {/* Benefits List */}
            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate('/devenir-prestataire')}
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-base font-semibold rounded-full transition-all hover:scale-105 hover:shadow-xl"
              >
                Devenir prestataire
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/services')}
                className="border-gray-600 text-white hover:bg-gray-800 px-8 py-6 text-base font-semibold rounded-full"
              >
                Voir les services
              </Button>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-4 mt-10 pt-8 border-t border-gray-700">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="font-semibold text-white">500+ prestataires</p>
                <p className="text-sm text-gray-400">nous font déjà confiance</p>
              </div>
            </div>
          </div>

          {/* Right Content - Features & Pricing */}
          <div className="space-y-6">
            {/* Features */}
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:bg-gray-800"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Pricing Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 relative overflow-hidden">
              {/* Decorative */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full blur-xl" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Abonnement mensuel
                  </h3>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium text-white">
                    Recommandé
                  </span>
                </div>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold text-white">5 000 - 10 000</span>
                  <span className="text-blue-200">FCFA/mois</span>
                </div>
                
                <ul className="space-y-3 text-sm text-blue-100 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Profil visible sur la plateforme
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Badge Premium inclus
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Support prioritaire 24/7
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Validation sous 24-48h
                  </li>
                </ul>
                
                <Button
                  onClick={() => navigate('/devenir-prestataire')}
                  className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-xl py-6"
                >
                  Commencer maintenant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
