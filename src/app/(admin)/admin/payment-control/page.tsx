"use client";

import { useState } from "react";
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

// Mock users data
const mockClients = [
  {
    id: "client-1",
    name: "Amadou Koné",
    email: "amadou.kone@email.com",
    phone: "+225 07 00 00 01",
    avatar: "https://i.pravatar.cc/100?img=1",
    status: "active",
    totalPayments: 125000,
    blockedMethods: ["wave"],
    lastPayment: new Date("2024-05-10"),
  },
  {
    id: "client-2",
    name: "Aya Diallo",
    email: "aya.diallo@email.com",
    phone: "+225 07 00 00 02",
    avatar: "https://i.pravatar.cc/100?img=2",
    status: "active",
    totalPayments: 85000,
    blockedMethods: [],
    lastPayment: new Date("2024-05-08"),
  },
  {
    id: "client-3",
    name: "Kouadio Jean-Baptiste",
    email: "kouadio.jb@email.com",
    phone: "+225 07 00 00 03",
    avatar: "https://i.pravatar.cc/100?img=3",
    status: "suspended",
    totalPayments: 250000,
    blockedMethods: ["orange_money", "mtn_money", "wave", "moov_money", "card"],
    lastPayment: new Date("2024-04-15"),
  },
  {
    id: "client-4",
    name: "Fatou Sanogo",
    email: "fatou.sanogo@email.com",
    phone: "+225 07 00 00 04",
    avatar: "https://i.pravatar.cc/100?img=4",
    status: "active",
    totalPayments: 45000,
    blockedMethods: ["card"],
    lastPayment: new Date("2024-05-12"),
  },
];

const mockProviders = [
  {
    id: "provider-1",
    name: "Plomberie Express",
    businessName: "Plomberie Express Abidjan",
    email: "contact@plomberieexpress.ci",
    phone: "+225 07 10 00 01",
    avatar: "https://i.pravatar.cc/100?img=11",
    status: "active",
    tier: "premium",
    totalPayouts: 1500000,
    blockedMethods: [],
    lastPayout: new Date("2024-05-10"),
  },
  {
    id: "provider-2",
    name: "Beauty Home Services",
    businessName: "Beauty Home Services",
    email: "contact@beautyhome.ci",
    phone: "+225 07 10 00 02",
    avatar: "https://i.pravatar.cc/100?img=12",
    status: "active",
    tier: "basic",
    totalPayouts: 450000,
    blockedMethods: ["moov_money"],
    lastPayout: new Date("2024-05-09"),
  },
  {
    id: "provider-3",
    name: "Élec Pro CI",
    businessName: "Électricité Professionnelle",
    email: "contact@elecpro.ci",
    phone: "+225 07 10 00 03",
    avatar: "https://i.pravatar.cc/100?img=13",
    status: "suspended",
    tier: "gratuit",
    totalPayouts: 125000,
    blockedMethods: ["orange_money", "mtn_money", "wave", "moov_money", "card", "cash"],
    lastPayout: new Date("2024-03-20"),
  },
  {
    id: "provider-4",
    name: "Ménage Premium",
    businessName: "Services de Ménage Premium",
    email: "contact@menagepremium.ci",
    phone: "+225 07 10 00 04",
    avatar: "https://i.pravatar.cc/100?img=14",
    status: "active",
    tier: "elite",
    totalPayouts: 2800000,
    blockedMethods: [],
    lastPayout: new Date("2024-05-11"),
  },
];

export default function PaymentControlPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<typeof mockClients[0] | typeof mockProviders[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userType, setUserType] = useState<"client" | "provider">("client");
  const [loading, setLoading] = useState(false);

  // Filter users based on search and status
  const filteredClients = mockClients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase()) ||
      client.phone.includes(search);
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredProviders = mockProviders.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(search.toLowerCase()) ||
      provider.businessName.toLowerCase().includes(search.toLowerCase()) ||
      provider.email.toLowerCase().includes(search.toLowerCase()) ||
      provider.phone.includes(search);
    const matchesStatus = statusFilter === "all" || provider.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Toggle payment method
  const togglePaymentMethod = async (methodId: string, isBlocked: boolean) => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state
      if (isBlocked) {
        // Unblock
        selectedUser.blockedMethods = selectedUser.blockedMethods.filter((m) => m !== methodId);
        toast.success(`${PAYMENT_METHODS.find((m) => m.id === methodId)?.name} débloqué pour ${selectedUser.name}`);
      } else {
        // Block
        selectedUser.blockedMethods = [...selectedUser.blockedMethods, methodId];
        toast.error(`${PAYMENT_METHODS.find((m) => m.id === methodId)?.name} bloqué pour ${selectedUser.name}`);
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  // Block all payment methods
  const blockAllMethods = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      selectedUser.blockedMethods = PAYMENT_METHODS.map((m) => m.id);
      toast.error(`Tous les moyens de paiement bloqués pour ${selectedUser.name}`);
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  // Unblock all payment methods
  const unblockAllMethods = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      selectedUser.blockedMethods = [];
      toast.success(`Tous les moyens de paiement débloqués pour ${selectedUser.name}`);
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

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contrôle des Moyens de Paiement</h1>
          <p className="text-slate-500 mt-1">Bloquez ou débloquez les moyens de paiement des utilisateurs</p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
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
                <p className="text-2xl font-bold text-slate-900">{mockClients.length}</p>
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
                <p className="text-2xl font-bold text-slate-900">{mockProviders.length}</p>
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
                  {mockClients.filter((c) => c.blockedMethods.length > 0).length +
                    mockProviders.filter((p) => p.blockedMethods.length > 0).length}
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
                  {mockClients.filter((c) => c.status === "suspended").length +
                    mockProviders.filter((p) => p.status === "suspended").length}
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
            Clients ({filteredClients.length})
          </TabsTrigger>
          <TabsTrigger value="providers" className="gap-2">
            <Building2 className="w-4 h-4" />
            Prestataires ({filteredProviders.length})
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
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={client.avatar} />
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {client.name.charAt(0)}
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
                          {client.lastPayment.toLocaleDateString("fr-FR")}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(client);
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

              {filteredClients.length === 0 && (
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
                    {filteredProviders.map((provider) => (
                      <tr key={provider.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={provider.avatar} />
                              <AvatarFallback className="bg-purple-100 text-purple-600">
                                {provider.name.charAt(0)}
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
                          {provider.lastPayout.toLocaleDateString("fr-FR")}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(provider);
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

              {filteredProviders.length === 0 && (
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
              {selectedUser && (
                <div className="flex items-center gap-2 mt-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedUser.avatar} />
                    <AvatarFallback>
                      {selectedUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-slate-900">{selectedUser.name}</p>
                    <p className="text-xs text-slate-500">{selectedUser.email}</p>
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
                const isBlocked = selectedUser?.blockedMethods.includes(method.id);
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
