"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  CreditCard,
  User,
  Building2,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Payment methods configuration
const PAYMENT_METHODS = [
  {
    id: "orange_money",
    name: "Orange Money",
    icon: "🟠",
    color: "bg-orange-500",
    textColor: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
  },
  {
    id: "mtn_money",
    name: "MTN Money",
    icon: "🟡",
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
  },
  {
    id: "wave",
    name: "Wave",
    icon: "🔵",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  {
    id: "moov_money",
    name: "Moov Money",
    icon: "🟣",
    color: "bg-purple-500",
    textColor: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
  {
    id: "card",
    name: "Carte Bancaire",
    icon: "💳",
    color: "bg-slate-500",
    textColor: "text-slate-500",
    bgColor: "bg-slate-500/10",
    borderColor: "border-slate-500/30",
  },
  {
    id: "cash",
    name: "Espèces",
    icon: "💵",
    color: "bg-green-500",
    textColor: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
  },
];

interface ClientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  status: string;
  totalPayments: number;
  blockedMethods: string[];
  lastPayment: string | null;
  paymentCount: number;
}

interface ProviderData {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  avatar: string | null;
  status: string;
  tier: string;
  totalPayouts: number;
  blockedMethods: string[];
  lastPayout: string | null;
  reservationCount: number;
}

interface Stats {
  totalClients: number;
  totalProviders: number;
  clientsWithRestrictions: number;
  providersWithRestrictions: number;
  suspendedClients: number;
  suspendedProviders: number;
}

export default function PaymentControlPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ProviderData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userType, setUserType] = useState<"client" | "provider">("client");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [clients, setClients] = useState<ClientData[]>([]);
  const [providers, setProviders] = useState<ProviderData[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    totalProviders: 0,
    clientsWithRestrictions: 0,
    providersWithRestrictions: 0,
    suspendedClients: 0,
    suspendedProviders: 0,
  });

  // Fetch data
  const fetchData = useCallback(async (showRefreshLoader = false) => {
    if (showRefreshLoader) {
      setRefreshing(true);
    } else {
      setInitialLoading(true);
    }

    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(`/api/admin/payment-control?${params.toString()}`);
      if (!response.ok) throw new Error("Erreur lors du chargement");

      const data = await response.json();
      setClients(data.clients || []);
      setProviders(data.providers || []);
      setStats(data.stats || {});
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setInitialLoading(false);
      setRefreshing(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Toggle payment method for client
  const toggleClientPaymentMethod = async (methodId: string, isBlocked: boolean) => {
    if (!selectedClient) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${selectedClient.id}/payment-control`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: methodId,
          isEnabled: isBlocked, // If blocked, we want to enable it
        }),
      });

      if (!response.ok) throw new Error("Erreur");

      const data = await response.json();
      toast.success(data.message);

      // Update local state
      setSelectedClient((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          blockedMethods: isBlocked
            ? prev.blockedMethods.filter((m) => m !== methodId)
            : [...prev.blockedMethods, methodId],
        };
      });

      // Refresh data
      fetchData(true);
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  // Toggle payment method for provider
  const toggleProviderPaymentMethod = async (methodId: string, isBlocked: boolean) => {
    if (!selectedProvider) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/providers/${selectedProvider.id}/payment-control`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: methodId,
          isEnabled: isBlocked, // If blocked, we want to enable it
        }),
      });

      if (!response.ok) throw new Error("Erreur");

      const data = await response.json();
      toast.success(data.message);

      // Update local state
      setSelectedProvider((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          blockedMethods: isBlocked
            ? prev.blockedMethods.filter((m) => m !== methodId)
            : [...prev.blockedMethods, methodId],
        };
      });

      // Refresh data
      fetchData(true);
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  // Block all payment methods for client
  const blockAllClientMethods = async () => {
    if (!selectedClient) return;

    setLoading(true);
    try {
      const methods = PAYMENT_METHODS.map((m) => ({
        paymentMethod: m.id,
        isEnabled: false,
      }));

      const response = await fetch(`/api/admin/users/${selectedClient.id}/payment-control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ methods, reason: "Blocage total par admin" }),
      });

      if (!response.ok) throw new Error("Erreur");

      toast.error(`Tous les moyens de paiement bloqués pour ${selectedClient.name}`);
      setSelectedClient((prev) => {
        if (!prev) return prev;
        return { ...prev, blockedMethods: PAYMENT_METHODS.map((m) => m.id) };
      });
      fetchData(true);
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  // Unblock all payment methods for client
  const unblockAllClientMethods = async () => {
    if (!selectedClient) return;

    setLoading(true);
    try {
      const methods = PAYMENT_METHODS.map((m) => ({
        paymentMethod: m.id,
        isEnabled: true,
      }));

      const response = await fetch(`/api/admin/users/${selectedClient.id}/payment-control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ methods }),
      });

      if (!response.ok) throw new Error("Erreur");

      toast.success(`Tous les moyens de paiement débloqués pour ${selectedClient.name}`);
      setSelectedClient((prev) => {
        if (!prev) return prev;
        return { ...prev, blockedMethods: [] };
      });
      fetchData(true);
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  // Block all payment methods for provider
  const blockAllProviderMethods = async () => {
    if (!selectedProvider) return;

    setLoading(true);
    try {
      const methods = PAYMENT_METHODS.map((m) => ({
        paymentMethod: m.id,
        isEnabled: false,
      }));

      const response = await fetch(`/api/admin/providers/${selectedProvider.id}/payment-control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ methods, reason: "Blocage total par admin" }),
      });

      if (!response.ok) throw new Error("Erreur");

      toast.error(`Tous les moyens de paiement bloqués pour ${selectedProvider.businessName}`);
      setSelectedProvider((prev) => {
        if (!prev) return prev;
        return { ...prev, blockedMethods: PAYMENT_METHODS.map((m) => m.id) };
      });
      fetchData(true);
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  // Unblock all payment methods for provider
  const unblockAllProviderMethods = async () => {
    if (!selectedProvider) return;

    setLoading(true);
    try {
      const methods = PAYMENT_METHODS.map((m) => ({
        paymentMethod: m.id,
        isEnabled: true,
      }));

      const response = await fetch(`/api/admin/providers/${selectedProvider.id}/payment-control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ methods }),
      });

      if (!response.ok) throw new Error("Erreur");

      toast.success(`Tous les moyens de paiement débloqués pour ${selectedProvider.businessName}`);
      setSelectedProvider((prev) => {
        if (!prev) return prev;
        return { ...prev, blockedMethods: [] };
      });
      fetchData(true);
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  // Get blocked methods for selected user
  const getBlockedMethods = () => {
    if (userType === "client") {
      return selectedClient?.blockedMethods || [];
    }
    return selectedProvider?.blockedMethods || [];
  };

  // Toggle payment method (generic)
  const togglePaymentMethod = (methodId: string, isBlocked: boolean) => {
    if (userType === "client") {
      toggleClientPaymentMethod(methodId, isBlocked);
    } else {
      toggleProviderPaymentMethod(methodId, isBlocked);
    }
  };

  // Block all methods (generic)
  const blockAllMethods = () => {
    if (userType === "client") {
      blockAllClientMethods();
    } else {
      blockAllProviderMethods();
    }
  };

  // Unblock all methods (generic)
  const unblockAllMethods = () => {
    if (userType === "client") {
      unblockAllClientMethods();
    } else {
      unblockAllProviderMethods();
    }
  };

  // Get selected user info
  const getSelectedUser = () => {
    if (userType === "client") {
      return selectedClient
        ? { name: selectedClient.name, email: selectedClient.email, avatar: selectedClient.avatar }
        : null;
    }
    return selectedProvider
      ? { name: selectedProvider.businessName, email: selectedProvider.email, avatar: selectedProvider.avatar }
      : null;
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#001e40]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contrôle des Moyens de Paiement</h1>
          <p className="text-slate-500 mt-1">Bloquez ou débloquez les moyens de paiement des utilisateurs</p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => fetchData(true)}
          disabled={refreshing}
        >
          <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
          Actualiser
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.totalClients}</p>
                <p className="text-sm text-slate-500">Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.totalProviders}</p>
                <p className="text-sm text-slate-500">Prestataires</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Lock className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.clientsWithRestrictions + stats.providersWithRestrictions}
                </p>
                <p className="text-sm text-slate-500">Avec restrictions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.suspendedClients + stats.suspendedProviders}
                </p>
                <p className="text-sm text-slate-500">Comptes suspendus</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher par nom, email ou téléphone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-slate-50 border-slate-200"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-slate-50 border-slate-200">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Tabs */}
      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="clients" className="gap-2">
            <User className="w-4 h-4" />
            Clients ({clients.length})
          </TabsTrigger>
          <TabsTrigger value="providers" className="gap-2">
            <Building2 className="w-4 h-4" />
            Prestataires ({providers.length})
          </TabsTrigger>
        </TabsList>

        {/* Clients Tab */}
        <TabsContent value="clients" className="mt-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Utilisateur
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Total Paiements
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Moyens Bloqués
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Dernier Paiement
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {clients.map((client) => (
                      <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={client.avatar || undefined} />
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {client.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-900">{client.name}</p>
                              <p className="text-sm text-slate-500">{client.email}</p>
                              <p className="text-xs text-slate-400">{client.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge
                            className={cn(
                              client.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            )}
                          >
                            {client.status === "active" ? "Actif" : "Suspendu"}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 font-semibold text-slate-900">
                          {formatPrice(client.totalPayments)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            {client.blockedMethods.length === 0 ? (
                              <span className="text-sm text-green-600 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                Aucun
                              </span>
                            ) : (
                              <span className="text-sm text-red-600 flex items-center gap-1">
                                <XCircle className="w-4 h-4" />
                                {client.blockedMethods.length} bloqué(s)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-500">
                          {formatDate(client.lastPayment)}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedClient(client);
                              setUserType("client");
                              setIsDialogOpen(true);
                            }}
                            className="gap-2"
                          >
                            <CreditCard className="w-4 h-4" />
                            Gérer
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {clients.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Aucun client trouvé</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Providers Tab */}
        <TabsContent value="providers" className="mt-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Prestataire
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Statut / Tier
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Total Versements
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Moyens Bloqués
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Dernier Versement
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {providers.map((provider) => (
                      <tr key={provider.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={provider.avatar || undefined} />
                              <AvatarFallback className="bg-purple-100 text-purple-600">
                                {provider.businessName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-900">{provider.businessName}</p>
                              <p className="text-sm text-slate-500">{provider.email}</p>
                              <p className="text-xs text-slate-400">{provider.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <Badge
                              className={cn(
                                provider.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              )}
                            >
                              {provider.status === "active" ? "Actif" : "Suspendu"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {provider.tier.toUpperCase()}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-semibold text-slate-900">
                          {formatPrice(provider.totalPayouts)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            {provider.blockedMethods.length === 0 ? (
                              <span className="text-sm text-green-600 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                Aucun
                              </span>
                            ) : (
                              <span className="text-sm text-red-600 flex items-center gap-1">
                                <XCircle className="w-4 h-4" />
                                {provider.blockedMethods.length} bloqué(s)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-500">
                          {formatDate(provider.lastPayout)}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProvider(provider);
                              setUserType("provider");
                              setIsDialogOpen(true);
                            }}
                            className="gap-2"
                          >
                            <CreditCard className="w-4 h-4" />
                            Gérer
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {providers.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Aucun prestataire trouvé</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Methods Management Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Gestion des Moyens de Paiement
            </DialogTitle>
            <DialogDescription>
              {getSelectedUser() && (
                <div className="flex items-center gap-2 mt-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getSelectedUser()?.avatar || undefined} />
                    <AvatarFallback>
                      {getSelectedUser()?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-slate-900">{getSelectedUser()?.name}</p>
                    <p className="text-xs text-slate-500">{getSelectedUser()?.email}</p>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={unblockAllMethods}
                disabled={loading}
                className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Unlock className="w-4 h-4" />
                Tout débloquer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={blockAllMethods}
                disabled={loading}
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Lock className="w-4 h-4" />
                Tout bloquer
              </Button>
            </div>

            {/* Payment Methods List */}
            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => {
                const blockedMethods = getBlockedMethods();
                const isBlocked = blockedMethods.includes(method.id);
                return (
                  <div
                    key={method.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border transition-all",
                      isBlocked
                        ? "bg-red-50 border-red-200"
                        : "bg-slate-50 border-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className={cn(
                          "font-medium",
                          isBlocked ? "text-red-700" : "text-slate-900"
                        )}>
                          {method.name}
                        </p>
                        <p className={cn(
                          "text-sm",
                          isBlocked ? "text-red-500" : "text-slate-500"
                        )}>
                          {isBlocked ? "Bloqué - L'utilisateur ne peut pas utiliser ce moyen" : "Actif - Disponible pour les paiements"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={cn(
                          isBlocked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        )}
                      >
                        {isBlocked ? (
                          <>
                            <Lock className="w-3 h-3 mr-1" />
                            Bloqué
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3 mr-1" />
                            Actif
                          </>
                        )}
                      </Badge>
                      <Switch
                        checked={!isBlocked}
                        onCheckedChange={() => togglePaymentMethod(method.id, isBlocked)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Attention</p>
                  <p className="text-sm text-amber-700">
                    Le blocage des moyens de paiement peut empêcher l'utilisateur d'effectuer des transactions.
                    Cette action peut avoir un impact sur son activité. Assurez-vous de communiquer avec l'utilisateur
                    avant de prendre cette mesure.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
