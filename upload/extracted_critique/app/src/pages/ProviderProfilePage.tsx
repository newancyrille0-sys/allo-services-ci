import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  BadgeCheck, 
  Shield, 
  Calendar,
  Clock,
  MessageCircle,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useProviderProfile } from '@/hooks/useProviders';
import { useBookings } from '@/hooks/useBookings';
import { SERVICE_CATEGORIES } from '@/types';
import { getCurrentUser } from '@/lib/storage';

export function ProviderProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { provider, reviews, isLoading, getAverageRating } = useProviderProfile(id || '');
  const { createBooking } = useBookings();
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    address: '',
    notes: ''
  });
  const [bookingStatus, setBookingStatus] = useState<{ success: boolean; message: string } | null>(null);

  if (isLoading) {
    return (
      <main className="min-h-screen pt-24 bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse bg-white rounded-2xl h-96" />
          </div>
        </div>
      </main>
    );
  }

  if (!provider) {
    return (
      <main className="min-h-screen pt-24 bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center py-16">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Prestataire non trouvé
            </h1>
            <p className="text-gray-600 mb-6">
              Le prestataire que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Button onClick={() => navigate('/services')}>
              Retour aux services
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const getCategoryColor = (categoryId: string) => {
    const category = SERVICE_CATEGORIES.find(c => c.id === categoryId);
    return category?.color || 'bg-gray-500';
  };

  const getCategoryName = (categoryId: string) => {
    const category = SERVICE_CATEGORIES.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = getCurrentUser();
    if (!user) {
      setBookingStatus({ 
        success: false, 
        message: 'Vous devez être connecté pour faire une réservation.' 
      });
      return;
    }

    const result = createBooking({
      clientId: user.id,
      clientName: `${user.firstName} ${user.lastName}`,
      clientPhone: user.phone,
      providerId: provider.id,
      providerName: `${provider.firstName} ${provider.lastName}`,
      serviceName: provider.serviceName,
      date: bookingData.date,
      time: bookingData.time,
      address: bookingData.address,
      notes: bookingData.notes
    });

    setBookingStatus(result);
    
    if (result.success) {
      setTimeout(() => {
        setIsBookingDialogOpen(false);
        setBookingStatus(null);
      }, 2000);
    }
  };

  const averageRating = getAverageRating();

  return (
    <main className="min-h-screen pt-20 bg-gray-50">
      {/* Back Button */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 mb-6">
            {/* Cover Image */}
            <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-700" />
            
            {/* Profile Info */}
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-12 mb-4 gap-4">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={provider.photoUrl || `https://ui-avatars.com/api/?name=${provider.firstName}+${provider.lastName}&background=random&size=200`}
                    alt={`${provider.firstName} ${provider.lastName}`}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  {provider.isPremium && (
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white">
                      <BadgeCheck className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Name & Badges */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {provider.firstName} {provider.lastName}
                    </h1>
                    {provider.isValidated && (
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Vérifié
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">{provider.serviceName}</p>
                </div>

                {/* Trust Score */}
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{provider.trustScore}%</p>
                    <p className="text-xs text-gray-500">Score de confiance</p>
                  </div>
                  <div className="w-px h-10 bg-gray-200" />
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-xl font-bold text-gray-900">
                        {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{reviews.length} avis</p>
                  </div>
                </div>
              </div>

              {/* Category & Location */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-white ${getCategoryColor(provider.serviceCategory)}`}>
                  {getCategoryName(provider.serviceCategory)}
                </span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                  <MapPin className="w-4 h-4 mr-1" />
                  {provider.city}, {provider.district}
                </span>
                {provider.isPremium && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    <BadgeCheck className="w-4 h-4 mr-1" />
                    Premium
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6">
                {provider.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/225${provider.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contacter sur WhatsApp
                </a>
                <Button
                  onClick={() => {
                    if (!getCurrentUser()) {
                      navigate('/connexion', { state: { redirectTo: `/prestataire/${provider.id}` } });
                      return;
                    }
                    setIsBookingDialogOpen(true);
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Réserver
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="about" className="bg-white rounded-2xl shadow-sm border border-gray-200">
            <TabsList className="w-full justify-start border-b border-gray-200 rounded-none p-0 h-auto">
              <TabsTrigger 
                value="about" 
                className="px-6 py-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
              >
                À propos
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="px-6 py-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
              >
                Avis ({reviews.length})
              </TabsTrigger>
              <TabsTrigger 
                value="contact"
                className="px-6 py-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
              >
                Contact
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Description du service
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {provider.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Informations
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Zone d'intervention</p>
                        <p className="font-medium text-gray-900">{provider.city}, {provider.district}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Vérification</p>
                        <p className="font-medium text-gray-900">
                          {provider.isValidated ? 'Identité vérifiée' : 'En attente de validation'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="p-6">
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{review.clientName}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucun avis pour le moment</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="contact" className="p-6">
              <div className="space-y-4">
                <a
                  href={`tel:${provider.phone}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-medium text-gray-900">{provider.phone}</p>
                  </div>
                </a>

                <a
                  href={`mailto:${provider.email}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{provider.email}</p>
                  </div>
                </a>

                <a
                  href={`https://wa.me/225${provider.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">WhatsApp</p>
                    <p className="font-medium text-gray-900">{provider.phone}</p>
                  </div>
                </a>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Réserver avec {provider.firstName} {provider.lastName}</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour votre réservation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBooking} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="date"
                    required
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    className="pl-10"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="time"
                    required
                    value={bookingData.time}
                    onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <Textarea
                required
                placeholder="Votre adresse complète..."
                value={bookingData.address}
                onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optionnel)
              </label>
              <Textarea
                placeholder="Détails supplémentaires..."
                value={bookingData.notes}
                onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                rows={2}
              />
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Le paiement se fera directement avec le prestataire après le service.
              </p>
            </div>

            {bookingStatus && (
              <div className={`p-3 rounded-lg ${
                bookingStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {bookingStatus.message}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsBookingDialogOpen(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Confirmer la réservation
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
