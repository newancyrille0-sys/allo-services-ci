"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Ban,
  Lock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Users as UsersIcon,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Bell,
  ShieldAlert,
  Clock,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminStatsCard } from "@/components/admin";
import { cities } from "@/lib/constants/cities";
import { cn } from "@/lib/utils";

// Mock users data
const mockUsers = [
  {
    id: "1",
    fullName: "Kouadio Jean-Baptiste",
    email: "kouadio.jb@gmail.com",
    phone: "+225 07 58 92 34 12",
    city: "Abidjan",
    avatarUrl: null,
    status: "ACTIVE" as const,
    reservations: 12,
    totalSpent: 285000,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    fullName: "Aminata Diallo",
    email: "aminata.d@yahoo.fr",
    phone: "+225 05 12 87 65 43",
    city: "Bouaké",
    avatarUrl: null,
    status: "ACTIVE" as const,
    reservations: 8,
    totalSpent: 156000,
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "3",
    fullName: "Yao Serge",
    email: "yao.serge@outlook.com",
    phone: "+225 01 23 45 67 89",
    city: "Abidjan",
    avatarUrl: null,
    status: "SUSPENDED" as const,
    reservations: 5,
    totalSpent: 89000,
    createdAt: new Date("2024-03-10"),
  },
  {
    id: "4",
    fullName: "Fatou Bamba",
    email: "fatou.bamba@gmail.com",
    phone: "+225 07 98 76 54 32",
    city: "Yamoussoukro",
    avatarUrl: null,
    status: "ACTIVE" as const,
    reservations: 23,
    totalSpent: 520000,
    createdAt: new Date("2024-01-05"),
  },
  {
    id: "5",
    fullName: "Ibrahim Koné",
    email: "ibrahim.kone@gmail.com",
    phone: "+225 05 67 89 01 23",
    city: "San-Pédro",
    avatarUrl: null,
    status: "BANNED" as const,
    reservations: 2,
    totalSpent: 45000,
    createdAt: new Date("2024-04-01"),
  },
  {
    id: "6",
    fullName: "Marie Kouassi",
    email: "marie.kouassi@yahoo.fr",
    phone: "+225 07 11 22 33 44",
    city: "Abidjan",
    avatarUrl: null,
    status: "ACTIVE" as const,
    reservations: 15,
    totalSpent: 340000,
    createdAt: new Date("2024-02-28"),
  },
  {
    id: "7",
    fullName: "Moussa Touré",
    email: "moussa.toure@outlook.com",
    phone: "+225 01 55 66 77 88",
    city: "Daloa",
    avatarUrl: null,
    status: "ACTIVE" as const,
    reservations: 7,
    totalSpent: 175000,
    createdAt: new Date("2024-03-22"),
  },
  {
    id: "8",
    fullName: "Awa Sanogo",
    email: "awa.sanogo@gmail.com",
    phone: "+225 05 99 88 77 66",
    city: "Korhogo",
    avatarUrl: null,
    status: "PENDING_VERIFICATION" as const,
    reservations: 0,
    totalSpent: 0,
    createdAt: new Date("2024-05-01"),
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
  SUSPENDED: {
    label: "Suspendu",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: AlertCircle,
  },
  BANNED: {
    label: "Banni",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: XCircle,
  },
  PENDING_VERIFICATION: {
    label: "En attente",
    color: "text-gray-400",
    bg: "bg-gray-500/10",
    border: "border-gray-500/30",
    icon: Clock,
  },
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [actionDialog, setActionDialog] = useState<"suspend" | "ban" | "reset" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter users
  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.includes(search);
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesCity = cityFilter === "all" || user.city === cityFilter;
    return matchesSearch && matchesStatus && matchesCity;
  });

  // Stats
  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter((u) => u.status === "ACTIVE").length,
    suspended: mockUsers.filter((u) => u.status === "SUSPENDED").length,
    banned: mockUsers.filter((u) => u.status === "BANNED").length,
  };

  const handleAction = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setActionDialog(null);
    setSelectedUser(null);
  };

  const exportToCSV = () => {
    const headers = ["Nom", "Email", "Téléphone", "Ville", "Statut", "Réservations", "Dépenses", "Date inscription"];
    const rows = filteredUsers.map((u) => [
      u.fullName,
      u.email,
      u.phone,
      u.city,
      statusConfig[u.status].label,
      u.reservations,
      u.totalSpent,
      u.createdAt.toLocaleDateString("fr-FR"),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `utilisateurs_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion des utilisateurs</h1>
          <p className="text-gray-400 mt-1">Gérez les comptes clients de la plateforme</p>
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
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <Bell className="w-4 h-4 mr-2" />
            Envoyer une notification
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdminStatsCard
          icon={UsersIcon}
          label="Total utilisateurs"
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
          icon={AlertCircle}
          label="Suspendus"
          value={stats.suspended}
          variant="warning"
        />
        <AdminStatsCard
          icon={XCircle}
          label="Bannis"
          value={stats.banned}
          variant="danger"
        />
      </div>

      {/* Filters */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
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
              <SelectTrigger className="w-full md:w-48 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="ACTIVE">Actif</SelectItem>
                <SelectItem value="SUSPENDED">Suspendu</SelectItem>
                <SelectItem value="BANNED">Banni</SelectItem>
                <SelectItem value="PENDING_VERIFICATION">En attente</SelectItem>
              </SelectContent>
            </Select>

            {/* City Filter */}
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Ville" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Toutes les villes</SelectItem>
                {cities.slice(0, 20).map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-transparent">
                <TableHead className="text-gray-400 font-medium">Utilisateur</TableHead>
                <TableHead className="text-gray-400 font-medium">Contact</TableHead>
                <TableHead className="text-gray-400 font-medium">Ville</TableHead>
                <TableHead className="text-gray-400 font-medium">Statut</TableHead>
                <TableHead className="text-gray-400 font-medium text-right">Réservations</TableHead>
                <TableHead className="text-gray-400 font-medium">Date inscription</TableHead>
                <TableHead className="text-gray-400 font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const status = statusConfig[user.status];
                const StatusIcon = status.icon;
                return (
                  <TableRow
                    key={user.id}
                    className="border-gray-700 hover:bg-gray-700/30"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border border-gray-700">
                          <AvatarImage src={user.avatarUrl || ""} />
                          <AvatarFallback className="bg-gray-700 text-gray-300">
                            {user.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">{user.fullName}</p>
                          <p className="text-gray-400 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-300 text-sm">
                        <Phone className="w-3 h-3 text-gray-500" />
                        {user.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-300 text-sm">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        {user.city}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-medium",
                          status.color,
                          status.bg,
                          status.border
                        )}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-white">
                      {user.reservations}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-300 text-sm">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        {user.createdAt.toLocaleDateString("fr-FR")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-400">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-gray-800 border-gray-700">
                          <DropdownMenuItem
                            onClick={() => setSelectedUser(user)}
                            className="text-gray-300 focus:bg-gray-700"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Voir le profil
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-700" />
                          {user.status === "ACTIVE" && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setActionDialog("suspend");
                              }}
                              className="text-amber-400 focus:bg-gray-700"
                            >
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Suspendre le compte
                            </DropdownMenuItem>
                          )}
                          {user.status !== "BANNED" && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setActionDialog("ban");
                              }}
                              className="text-red-400 focus:bg-gray-700"
                            >
                              <Ban className="w-4 h-4 mr-2" />
                              Bannir le compte
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setActionDialog("reset");
                            }}
                            className="text-gray-300 focus:bg-gray-700"
                          >
                            <Lock className="w-4 h-4 mr-2" />
                            Réinitialiser le mot de passe
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <UsersIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucun utilisateur trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          Affichage de {filteredUsers.length} sur {mockUsers.length} utilisateurs
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="border-gray-700 text-gray-400"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-700 bg-primary text-white"
          >
            1
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-gray-700 text-gray-400"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Action Dialogs */}
      <Dialog open={!!actionDialog} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent className="max-w-md bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {actionDialog === "suspend" && "Suspendre le compte"}
              {actionDialog === "ban" && "Bannir le compte"}
              {actionDialog === "reset" && "Réinitialiser le mot de passe"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {actionDialog === "suspend" &&
                `Êtes-vous sûr de vouloir suspendre le compte de ${selectedUser?.fullName} ? L'utilisateur ne pourra plus se connecter.`}
              {actionDialog === "ban" &&
                `Êtes-vous sûr de vouloir bannir définitivement le compte de ${selectedUser?.fullName} ? Cette action est irréversible.`}
              {actionDialog === "reset" &&
                `Un email de réinitialisation sera envoyé à ${selectedUser?.email}.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setActionDialog(null)}
              className="text-gray-400"
            >
              Annuler
            </Button>
            <Button
              onClick={handleAction}
              disabled={isProcessing}
              className={cn(
                actionDialog === "ban" && "bg-red-600 hover:bg-red-700",
                actionDialog === "suspend" && "bg-amber-600 hover:bg-amber-700",
                actionDialog === "reset" && "bg-primary hover:bg-primary/90"
              )}
            >
              {isProcessing ? "Traitement..." : "Confirmer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
