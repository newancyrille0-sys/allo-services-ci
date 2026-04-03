"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle,
  Star,
  MapPin,
  Calendar,
  UserCheck,
  AlertCircle,
  XCircle,
  Clock,
  FileCheck,
  CreditCard,
  TrendingUp,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminStatsCard } from "@/components/admin";
import { SubscriptionBadge } from "@/components/providers/SubscriptionBadge";
import { cities } from "@/lib/constants/cities";
import { cn } from "@/lib/utils";

// Mock providers data
const mockProviders = [
  {
    id: "1",
    businessName: "Électro Services Plus",
    ownerName: "Kouadio Emmanuel",
    email: "electro.services@gmail.com",
    phone: "+225 07 58 92 34 12",
    city: "Abidjan",
    avatarUrl: null,
    subscriptionPlan: "PREMIUM" as const,
    kycStatus: "VERIFIED" as const,
    status: "ACTIVE" as const,
    rating: 4.8,
    totalReservations: 156,
    createdAt: new Date("2023-08-15"),
  },
  {
    id: "2",
    businessName: "Plomberie Express",
    ownerName: "Yao Serge",
    email: "plomberie.express@yahoo.fr",
    phone: "+225 05 12 87 65 43",
    city: "Abidjan",
    avatarUrl: null,
    subscriptionPlan: "MONTHLY" as const,
    kycStatus: "VERIFIED" as const,
    status: "ACTIVE" as const,
    rating: 4.5,
    totalReservations: 89,
    createdAt: new Date("2023-11-20"),
  },
  {
    id: "3",
    businessName: "Ménage Pro",
    ownerName: "Aminata Touré",
    email: "menage.pro@gmail.com",
    phone: "+225 01 23 45 67 89",
    city: "Bouaké",
    avatarUrl: null,
    subscriptionPlan: "FREE" as const,
    kycStatus: "PENDING" as const,
    status: "PENDING" as const,
    rating: 0,
    totalReservations: 0,
    createdAt: new Date("2024-04-10"),
  },
  {
    id: "4",
    businessName: "Climatisation Expert",
    ownerName: "Ibrahim Koné",
    email: "clim.expert@outlook.com",
    phone: "+225 07 98 76 54 32",
    city: "Abidjan",
    avatarUrl: null,
    subscriptionPlan: "MONTHLY" as const,
    kycStatus: "VERIFIED" as const,
    status: "SUSPENDED" as const,
    rating: 3.2,
    totalReservations: 45,
    createdAt: new Date("2024-01-05"),
  },
  {
    id: "5",
    businessName: "Jardinage Vert",
    ownerName: "Fatou Bamba",
    email: "jardinage.vert@gmail.com",
    phone: "+225 05 67 89 01 23",
    city: "Yamoussoukro",
    avatarUrl: null,
    subscriptionPlan: "PREMIUM" as const,
    kycStatus: "VERIFIED" as const,
    status: "ACTIVE" as const,
    rating: 4.9,
    totalReservations: 203,
    createdAt: new Date("2023-06-20"),
  },
  {
    id: "6",
    businessName: "Déménagement Rapide",
    ownerName: "Moussa Diallo",
    email: "demenagement.rapide@gmail.com",
    phone: "+225 07 11 22 33 44",
    city: "San-Pédro",
    avatarUrl: null,
    subscriptionPlan: "FREE" as const,
    kycStatus: "REJECTED" as const,
    status: "BANNED" as const,
    rating: 2.1,
    totalReservations: 12,
    createdAt: new Date("2024-02-28"),
  },
];

const statusConfig = {
  ACTIVE: {
    label: "Actif",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: CheckCircle,
  },
  PENDING: {
    label: "En attente",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: Clock,
  },
  SUSPENDED: {
    label: "Suspendu",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    icon: AlertCircle,
  },
  BANNED: {
    label: "Banni",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: XCircle,
  },
};

const kycStatusConfig = {
  VERIFIED: {
    label: "Vérifié",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
  PENDING: {
    label: "En attente",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
  REJECTED: {
    label: "Rejeté",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
};

// Pending KYC queue
const pendingKYC = mockProviders.filter((p) => p.kycStatus === "PENDING");

export default function AdminProvidersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>("all");
  const [kycFilter, setKycFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");

  // Filter providers
  const filteredProviders = mockProviders.filter((provider) => {
    const matchesSearch =
      provider.businessName.toLowerCase().includes(search.toLowerCase()) ||
      provider.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      provider.email.toLowerCase().includes(search.toLowerCase()) ||
      provider.phone.includes(search);
    const matchesStatus = statusFilter === "all" || provider.status === statusFilter;
    const matchesSubscription = subscriptionFilter === "all" || provider.subscriptionPlan === subscriptionFilter;
    const matchesKYC = kycFilter === "all" || provider.kycStatus === kycFilter;
    const matchesCity = cityFilter === "all" || provider.city === cityFilter;
    return matchesSearch && matchesStatus && matchesSubscription && matchesKYC && matchesCity;
  });

  // Stats
  const stats = {
    total: mockProviders.length,
    active: mockProviders.filter((p) => p.status === "ACTIVE").length,
    pending: mockProviders.filter((p) => p.kycStatus === "PENDING").length,
    verified: mockProviders.filter((p) => p.kycStatus === "VERIFIED").length,
  };

  const exportToCSV = () => {
    const headers = ["Entreprise", "Propriétaire", "Email", "Téléphone", "Ville", "Abonnement", "KYC", "Statut", "Note", "Réservations"];
    const rows = filteredProviders.map((p) => [
      p.businessName,
      p.ownerName,
      p.email,
      p.phone,
      p.city,
      p.subscriptionPlan,
      kycStatusConfig[p.kycStatus].label,
      statusConfig[p.status].label,
      p.rating,
      p.totalReservations,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `prestataires_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion des prestataires</h1>
          <p className="text-gray-400 mt-1">Gérez les comptes prestataires et les validations KYC</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={exportToCSV}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdminStatsCard
          icon={UserCheck}
          label="Total prestataires"
          value={stats.total}
          variant="default"
        />
        <AdminStatsCard
          icon={CheckCircle}
          label="Actifs"
          value={stats.active}
          variant="success"
        />
        <AdminStatsCard
          icon={FileCheck}
          label="KYC en attente"
          value={stats.pending}
          variant="warning"
        />
        <AdminStatsCard
          icon={TrendingUp}
          label="Vérifiés"
          value={stats.verified}
          variant="primary"
        />
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary">
            Tous ({mockProviders.length})
          </TabsTrigger>
          <TabsTrigger value="kyc" className="data-[state=active]:bg-primary">
            KYC en attente ({pendingKYC.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Filters */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par nom, email ou téléphone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                  />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-40 bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="ACTIVE">Actif</SelectItem>
                    <SelectItem value="PENDING">En attente</SelectItem>
                    <SelectItem value="SUSPENDED">Suspendu</SelectItem>
                    <SelectItem value="BANNED">Banni</SelectItem>
                  </SelectContent>
                </Select>

                {/* Subscription Filter */}
                <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
                  <SelectTrigger className="w-full lg:w-40 bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Abonnement" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="FREE">Gratuit</SelectItem>
                    <SelectItem value="MONTHLY">Standard</SelectItem>
                    <SelectItem value="PREMIUM">Premium</SelectItem>
                  </SelectContent>
                </Select>

                {/* KYC Filter */}
                <Select value={kycFilter} onValueChange={setKycFilter}>
                  <SelectTrigger className="w-full lg:w-40 bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="KYC" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="VERIFIED">Vérifié</SelectItem>
                    <SelectItem value="PENDING">En attente</SelectItem>
                    <SelectItem value="REJECTED">Rejeté</SelectItem>
                  </SelectContent>
                </Select>

                {/* City Filter */}
                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger className="w-full lg:w-40 bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Ville" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">Toutes</SelectItem>
                    {cities.slice(0, 15).map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Providers Table */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-transparent">
                      <TableHead className="text-gray-400 font-medium">Prestataire</TableHead>
                      <TableHead className="text-gray-400 font-medium">Contact</TableHead>
                      <TableHead className="text-gray-400 font-medium">Ville</TableHead>
                      <TableHead className="text-gray-400 font-medium">Abonnement</TableHead>
                      <TableHead className="text-gray-400 font-medium">KYC</TableHead>
                      <TableHead className="text-gray-400 font-medium">Statut</TableHead>
                      <TableHead className="text-gray-400 font-medium text-center">Note</TableHead>
                      <TableHead className="text-gray-400 font-medium text-right">Réserv.</TableHead>
                      <TableHead className="text-gray-400 font-medium text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProviders.map((provider) => {
                      const status = statusConfig[provider.status];
                      const kyc = kycStatusConfig[provider.kycStatus];
                      const StatusIcon = status.icon;
                      return (
                        <TableRow
                          key={provider.id}
                          className="border-gray-700 hover:bg-gray-700/30"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10 border border-gray-700">
                                <AvatarImage src={provider.avatarUrl || ""} />
                                <AvatarFallback className="bg-gray-700 text-gray-300">
                                  {provider.businessName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-white font-medium">{provider.businessName}</p>
                                <p className="text-gray-400 text-xs">{provider.ownerName}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-gray-300 text-sm">{provider.email}</p>
                              <p className="text-gray-500 text-xs">{provider.phone}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-gray-300 text-sm">
                              <MapPin className="w-3 h-3 text-gray-500" />
                              {provider.city}
                            </div>
                          </TableCell>
                          <TableCell>
                            <SubscriptionBadge status={provider.subscriptionPlan} size="sm" />
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn("font-medium", kyc.color, kyc.bg, kyc.border)}
                            >
                              {kyc.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn("font-medium", status.color, status.bg, status.border)}
                            >
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {provider.rating > 0 ? (
                              <div className="flex items-center justify-center gap-1">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span className="text-white font-medium">{provider.rating}</span>
                              </div>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right text-white">
                            {provider.totalReservations}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-gray-400">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 bg-gray-800 border-gray-700">
                                <DropdownMenuItem asChild className="text-gray-300 focus:bg-gray-700">
                                  <Link href={`/admin/providers/${provider.id}`}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Voir le profil
                                  </Link>
                                </DropdownMenuItem>
                                {provider.kycStatus === "PENDING" && (
                                  <DropdownMenuItem className="text-emerald-400 focus:bg-gray-700">
                                    <FileCheck className="w-4 h-4 mr-2" />
                                    Valider KYC
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="text-gray-300 focus:bg-gray-700">
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  Modifier abonnement
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-gray-700" />
                                {provider.status === "ACTIVE" && (
                                  <DropdownMenuItem className="text-amber-400 focus:bg-gray-700">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    Suspendre
                                  </DropdownMenuItem>
                                )}
                                {provider.status !== "BANNED" && (
                                  <DropdownMenuItem className="text-red-400 focus:bg-gray-700">
                                    <Ban className="w-4 h-4 mr-2" />
                                    Bannir
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {filteredProviders.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Aucun prestataire trouvé</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc" className="space-y-4">
          {pendingKYC.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingKYC.map((provider) => (
                <Card key={provider.id} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 border border-gray-700">
                          <AvatarFallback className="bg-gray-700 text-gray-300">
                            {provider.businessName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">{provider.businessName}</p>
                          <p className="text-gray-400 text-sm">{provider.ownerName}</p>
                          <p className="text-gray-500 text-xs mt-1">{provider.email}</p>
                        </div>
                      </div>
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                        <Clock className="w-3 h-3 mr-1" />
                        En attente
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-700">
                      <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
                        <Link href={`/admin/providers/${provider.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          Vérifier les documents
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="py-12 text-center text-gray-400">
                <FileCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aucun KYC en attente de validation</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
