import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  Briefcase, 
  Calendar, 
  AlertTriangle, 
  TrendingUp,
  CheckCircle,
  Star,
  Phone,
  MapPin,
  Search,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  BadgeCheck,
  Ban,
  Trash2,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminAuth } from '@/hooks/useAuth';
import { useAdminDashboard, useFraudAlerts, useRecentActivity } from '@/hooks/useAdmin';
import { useAdminProviders } from '@/hooks/useProviders';
import { SERVICE_CATEGORIES } from '@/types';

export function AdminPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, login, logout } = useAdminAuth();
  const [adminCode, setAdminCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Rediriger si déjà authentifié
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      // Already authenticated
    }
  }, [isAuthenticated, authLoading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const result = await login(adminCode);
    if (!result.success) {
      setLoginError(result.message);
    }
  };

  // Afficher le formulaire de connexion admin si non authentifié
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen pt-24 bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Espace Administrateur
                </h1>
                <p className="text-gray-600">
                  Cet espace est réservé aux administrateurs
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code administrateur
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type={showCode ? 'text' : 'password'}
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      placeholder="Entrez le code admin"
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCode(!showCode)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="p-4 bg-red-50 text-red-800 rounded-xl flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    {loginError}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Accéder au dashboard
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Retour à l'accueil
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return <AdminDashboard onLogout={logout} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { stats, refreshStats } = useAdminDashboard();
  const { unresolvedAlerts, resolveAlert, detectFraud } = useFraudAlerts();
  const { activities } = useRecentActivity();
  const { 
    allProviders, 
    pendingProviders, 
    validateProvider, 
    suspendProvider, 
    activateProvider, 
    deleteProvider, 
    setPremium,
    confirmPayment 
  } = useAdminProviders();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredProviders = allProviders.filter(p => 
    p.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleValidate = async (providerId: string) => {
    const result = await validateProvider(providerId);
    if (result.success) {
      refreshStats();
    }
  };

  const handleSuspend = async (providerId: string) => {
    const reason = prompt('Motif de la suspension:');
    if (reason) {
      const result = await suspendProvider(providerId, reason);
      if (result.success) {
        refreshStats();
      }
    }
  };

  const handleActivate = async (providerId: string) => {
    const result = await activateProvider(providerId);
    if (result.success) {
      refreshStats();
    }
  };

  const handleDelete = async (providerId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce prestataire ? Cette action est irréversible.')) {
      const result = await deleteProvider(providerId);
      if (result.success) {
        refreshStats();
      }
    }
  };

  const handleSetPremium = async (providerId: string, isPremium: boolean) => {
    const result = await setPremium(providerId, isPremium);
    if (result.success) {
      refreshStats();
    }
  };

  const handleConfirmPayment = async (providerId: string) => {
    const result = await confirmPayment(providerId);
    if (result.success) {
      refreshStats();
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = SERVICE_CATEGORIES.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  return (
    <main className="min-h-screen pt-20 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-sm text-gray-500">Gérez les prestataires et surveillez la plateforme</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Connecté</span>
              </div>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Users}
              label="Utilisateurs"
              value={stats.totalUsers}
              color="blue"
            />
            <StatCard
              icon={Briefcase}
              label="Prestataires"
              value={stats.totalProviders}
              subvalue={`${stats.activeProviders} actifs`}
              color="green"
            />
            <StatCard
              icon={Calendar}
              label="Réservations"
              value={stats.totalBookings}
              subvalue={`${stats.pendingBookings} en attente`}
              color="purple"
            />
            <StatCard
              icon={AlertTriangle}
              label="Alertes"
              value={stats.fraudAlerts}
              color={stats.fraudAlerts > 0 ? 'red' : 'gray'}
            />
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="providers" className="bg-white rounded-2xl shadow-sm border border-gray-200">
            <TabsList className="w-full justify-start border-b border-gray-200 rounded-none p-0 h-auto flex-wrap">
              <TabsTrigger 
                value="providers" 
                className="px-6 py-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Prestataires
              </TabsTrigger>
              <TabsTrigger 
                value="pending"
                className="px-6 py-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                En attente
                {pendingProviders.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {pendingProviders.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="fraud"
                className="px-6 py-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Anti-fraude
                {unresolvedAlerts.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {unresolvedAlerts.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="activity"
                className="px-6 py-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Activité
              </TabsTrigger>
            </TabsList>

            {/* Providers Tab */}
            <TabsContent value="providers" className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Rechercher un prestataire..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Prestataire</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Service</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProviders.map((provider) => (
                      <tr key={provider.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={provider.photoUrl || `https://ui-avatars.com/api/?name=${provider.firstName}+${provider.lastName}`}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{provider.firstName} {provider.lastName}</p>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <MapPin className="w-3 h-3" />
                                {provider.city}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-gray-900">{getCategoryName(provider.serviceCategory)}</p>
                          <p className="text-xs text-gray-500">{provider.serviceName}</p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {provider.phone}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {provider.isValidated ? (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                Validé
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                En attente
                              </span>
                            )}
                            {provider.isActive && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                Actif
                              </span>
                            )}
                            {provider.isPremium && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1">
                                <BadgeCheck className="w-3 h-3" />
                                Premium
                              </span>
                            )}
                            {provider.isSuspended && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                Suspendu
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {!provider.isValidated && (
                              <button
                                onClick={() => handleValidate(provider.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                title="Valider"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {!provider.isPaid && (
                              <button
                                onClick={() => handleConfirmPayment(provider.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Confirmer paiement"
                              >
                                <DollarSign className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleSetPremium(provider.id, !provider.isPremium)}
                              className={`p-2 rounded-lg ${provider.isPremium ? 'text-yellow-600 hover:bg-yellow-50' : 'text-gray-400 hover:bg-gray-100'}`}
                              title={provider.isPremium ? 'Retirer Premium' : 'Premium'}
                            >
                              <Star className="w-4 h-4" />
                            </button>
                            {provider.isSuspended ? (
                              <button
                                onClick={() => handleActivate(provider.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                title="Réactiver"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSuspend(provider.id)}
                                className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                                title="Suspendre"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(provider.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Pending Tab */}
            <TabsContent value="pending" className="p-6">
              {pendingProviders.length > 0 ? (
                <div className="space-y-4">
                  {pendingProviders.map((provider) => (
                    <div key={provider.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={provider.photoUrl || `https://ui-avatars.com/api/?name=${provider.firstName}+${provider.lastName}`}
                            alt=""
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{provider.firstName} {provider.lastName}</h3>
                            <p className="text-sm text-gray-600">{provider.serviceName}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <Phone className="w-4 h-4" />
                              {provider.phone}
                              <span className="text-gray-300">|</span>
                              <MapPin className="w-4 h-4" />
                              {provider.city}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!provider.isValidated && (
                            <Button
                              onClick={() => handleValidate(provider.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Valider
                            </Button>
                          )}
                          {!provider.isPaid && (
                            <Button
                              onClick={() => handleConfirmPayment(provider.id)}
                              variant="outline"
                            >
                              <DollarSign className="w-4 h-4 mr-2" />
                              Confirmer paiement
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Documents */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">Documents:</p>
                        <div className="flex gap-4">
                          {provider.identityDocUrl && (
                            <a
                              href={provider.identityDocUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Voir la pièce d'identité
                            </a>
                          )}
                          {provider.paymentProofUrl && (
                            <a
                              href={provider.paymentProofUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Voir la preuve de paiement
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Tous les prestataires sont à jour
                  </h3>
                  <p className="text-gray-600">
                    Aucun prestataire en attente de validation
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Fraud Tab */}
            <TabsContent value="fraud" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Alertes de sécurité</h3>
                <Button onClick={detectFraud} variant="outline">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Détecter les fraudes
                </Button>
              </div>

              {unresolvedAlerts.length > 0 ? (
                <div className="space-y-4">
                  {unresolvedAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 bg-red-50 rounded-xl border border-red-200">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-900">
                              {alert.type === 'duplicate_phone' && 'Numéro dupliqué'}
                              {alert.type === 'duplicate_ip' && 'IP dupliquée'}
                              {alert.type === 'suspicious_account' && 'Compte suspect'}
                              {alert.type === 'fake_review' && 'Avis suspect'}
                            </p>
                            <p className="text-sm text-red-700 mt-1">{alert.description}</p>
                            <p className="text-xs text-red-500 mt-2">
                              {new Date(alert.createdAt).toLocaleString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => resolveAlert(alert.id)}
                          variant="outline"
                          size="sm"
                          className="flex-shrink-0"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Résoudre
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucune alerte de fraude
                  </h3>
                  <p className="text-gray-600">
                    La plateforme est sécurisée
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'provider_registration' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {activity.type === 'provider_registration' ? <Briefcase className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'validated' || activity.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : activity.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {activity.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  subvalue, 
  color 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: number; 
  subvalue?: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    gray: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
          {subvalue && <p className="text-xs text-gray-400">{subvalue}</p>}
        </div>
      </div>
    </div>
  );
}
