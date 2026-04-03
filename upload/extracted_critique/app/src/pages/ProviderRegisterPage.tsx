import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Video, 
  CheckCircle,
  Upload,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useProviderAuth } from '@/hooks/useAuth';
import { SERVICE_CATEGORIES, CITIES_CI, SERVICES_BY_CATEGORY } from '@/types';

export function ProviderRegisterPage() {
  const navigate = useNavigate();
  const { register } = useProviderAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    serviceCategory: '',
    serviceName: '',
    city: '',
    district: '',
    description: '',
    photoUrl: '',
    identityDocUrl: '',
    selfieVideoUrl: '',
    isPaid: false,
    paymentMethod: '',
    paymentProofUrl: ''
  });

  const totalSteps = 4;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
          setError('Veuillez remplir tous les champs obligatoires');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères');
          return false;
        }
        return true;
      case 2:
        if (!formData.serviceCategory || !formData.serviceName || !formData.city || !formData.district || !formData.description) {
          setError('Veuillez remplir tous les champs obligatoires');
          return false;
        }
        return true;
      case 3:
        if (!formData.photoUrl || !formData.identityDocUrl) {
          setError('Veuillez télécharger votre photo et votre pièce d\'identité');
          return false;
        }
        return true;
      case 4:
        if (formData.isPaid && !formData.paymentProofUrl) {
          setError('Veuillez télécharger la preuve de paiement');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true);
    setError(null);

    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      serviceCategory: formData.serviceCategory,
      serviceName: formData.serviceName,
      city: formData.city,
      district: formData.district,
      description: formData.description,
      photoUrl: formData.photoUrl,
      identityDocUrl: formData.identityDocUrl,
      selfieVideoUrl: formData.selfieVideoUrl,
      isPaid: formData.isPaid
    });

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.message);
    }

    setIsSubmitting(false);
  };

  // Simulation d'upload de fichier
  const handleFileUpload = (field: string) => {
    // Dans une vraie application, cela serait un vrai upload
    // Pour la démo, on utilise une URL d'image aléatoire
    const randomId = Math.random().toString(36).substring(7);
    setFormData(prev => ({ 
      ...prev, 
      [field]: `https://picsum.photos/400/400?random=${randomId}` 
    }));
  };

  if (success) {
    return (
      <main className="min-h-screen pt-24 bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Inscription réussie !
              </h1>
              <p className="text-gray-600 mb-6">
                Votre inscription a été enregistrée avec succès. Notre équipe va vérifier 
                vos informations sous 24-48h. Vous recevrez un email de confirmation 
                une fois votre compte validé.
              </p>
              <div className="bg-blue-50 p-4 rounded-xl mb-6">
                <p className="text-sm text-blue-800">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  N'oubliez pas de finaliser votre abonnement pour activer votre profil.
                </p>
              </div>
              <Button onClick={() => navigate('/')} className="w-full">
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Devenir prestataire
            </h1>
            <p className="text-gray-600">
              Rejoignez notre réseau de professionnels et trouvez de nouveaux clients
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    s <= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s < step ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
              ))}
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              Étape {step} sur {totalSteps}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Informations personnelles
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="pl-10"
                        placeholder="Votre prénom"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="pl-10"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-10"
                      placeholder="07 XX XX XX XX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Service Info */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Informations sur votre service
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie de service *
                  </label>
                  <select
                    value={formData.serviceCategory}
                    onChange={(e) => {
                      handleInputChange('serviceCategory', e.target.value);
                      handleInputChange('serviceName', '');
                    }}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {SERVICE_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {formData.serviceCategory && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de service *
                    </label>
                    <select
                      value={formData.serviceName}
                      onChange={(e) => handleInputChange('serviceName', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionnez un service</option>
                      {SERVICES_BY_CATEGORY[formData.serviceCategory]?.map((service) => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ville *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      >
                        <option value="">Sélectionnez</option>
                        {CITIES_CI.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quartier *
                    </label>
                    <Input
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      placeholder="Votre quartier"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description de vos services *
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Décrivez votre expérience, vos compétences, vos tarifs..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Documents */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Vérification d'identité
                </h2>
                <p className="text-gray-600 mb-6">
                  Pour garantir la sécurité de nos utilisateurs, nous vérifions l'identité de tous nos prestataires.
                </p>

                {/* Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo de profil *
                  </label>
                  <div 
                    onClick={() => handleFileUpload('photoUrl')}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    {formData.photoUrl ? (
                      <div className="relative inline-block">
                        <img src={formData.photoUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover mx-auto" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">Cliquez pour télécharger votre photo</p>
                        <p className="text-sm text-gray-400 mt-1">Format: JPG, PNG (max 5MB)</p>
                      </>
                    )}
                  </div>
                </div>

                {/* ID Document */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pièce d'identité (CNI, Passeport, Permis) *
                  </label>
                  <div 
                    onClick={() => handleFileUpload('identityDocUrl')}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    {formData.identityDocUrl ? (
                      <div className="relative inline-block">
                        <img src={formData.identityDocUrl} alt="ID" className="w-48 h-32 object-cover rounded-lg mx-auto" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">Cliquez pour télécharger votre pièce d'identité</p>
                        <p className="text-sm text-gray-400 mt-1">Recto uniquement, vos données sont sécurisées</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Selfie Video */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selfie vidéo (optionnel mais recommandé)
                  </label>
                  <div 
                    onClick={() => handleFileUpload('selfieVideoUrl')}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    {formData.selfieVideoUrl ? (
                      <div className="relative inline-block">
                        <div className="w-48 h-32 bg-gray-800 rounded-lg flex items-center justify-center mx-auto">
                          <Video className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">Enregistrez une courte vidéo en disant votre nom et votre service</p>
                        <p className="text-sm text-gray-400 mt-1">Cela augmente votre score de confiance</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Abonnement
                </h2>

                <div className="bg-blue-50 p-4 rounded-xl mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2">Forfait Prestataire</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-blue-900">5 000 - 10 000 FCFA</span>
                    <span className="text-blue-700">/mois</span>
                  </div>
                  <ul className="space-y-1 text-sm text-blue-800">
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
                      Support prioritaire
                    </li>
                  </ul>
                </div>

                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl">
                  <Checkbox
                    id="isPaid"
                    checked={formData.isPaid}
                    onCheckedChange={(checked) => handleInputChange('isPaid', checked as boolean)}
                  />
                  <div>
                    <label htmlFor="isPaid" className="font-medium text-gray-900 cursor-pointer">
                      J'ai déjà effectué le paiement
                    </label>
                    <p className="text-sm text-gray-500">
                      Paiement via Wave ou Orange Money au numéro: 07 XX XX XX XX
                    </p>
                  </div>
                </div>

                {formData.isPaid && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preuve de paiement (capture d'écran)
                    </label>
                    <div 
                      onClick={() => handleFileUpload('paymentProofUrl')}
                      className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      {formData.paymentProofUrl ? (
                        <div className="relative inline-block">
                          <img src={formData.paymentProofUrl} alt="Payment" className="w-48 h-32 object-cover rounded-lg mx-auto" />
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">Téléchargez votre capture d'écran de paiement</p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-yellow-50 p-4 rounded-xl">
                  <p className="text-sm text-yellow-800">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    Votre profil ne sera actif qu'après validation de votre paiement par notre équipe.
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 text-red-800 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Précédent
                </Button>
              )}
              
              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Suivant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? 'Inscription en cours...' : 'Finaliser l\'inscription'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
