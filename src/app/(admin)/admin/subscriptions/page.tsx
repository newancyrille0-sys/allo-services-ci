"use client";

import { useState } from "react";
import {
  Search,
  Download,
  MoreVertical,
  CreditCard,
  Calendar,
  RefreshCw,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminStatsCard } from "@/components/admin";
import { SubscriptionBadge } from "@/components/providers/SubscriptionBadge";
import { cn } from "@/lib/utils";

// Mock subscriptions data
const mockSubscriptions = [
  {
    id: "1",
    providerName: "Électro Services Plus",
    plan: "PREMIUM" as const,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    autoRenew: true,
    status: "active",
    amount: 500000,
  },
  {
    id: "2",
    providerName: "Plomberie Express",
    plan: "MONTHLY" as const,
    startDate: new Date("2024-04-01"),
    endDate: new Date("2024-05-01"),
    autoRenew: true,
    status: "active",
    amount: 15000,
  },
  {
    id: "3",
    providerName: "Ménage Pro",
    plan: "FREE" as const,
    startDate: new Date("2024-04-10"),
    endDate: null,
    autoRenew: false,
    status: "active",
    amount: 0,
  },
  {
    id: "4",
    providerName: "Climatisation Expert",
    plan: "MONTHLY" as const,
    startDate: new Date("2024-03-15"),
    endDate: new Date("2024-04-15"),
    autoRenew: false,
    status: "expired",
    amount: 15000,
  },
  {
    id: "5",
    providerName: "Jardinage Vert",
    plan: "PREMIUM" as const,
    startDate: new Date("2023-06-20"),
    endDate: new Date("2024-06-20"),
    autoRenew: true,
    status: "expiring",
    amount: 500000,
  },
  {
    id: "6",
    providerName: "Déménagement Rapide",
    plan: "FREE" as const,
    startDate: new Date("2024-02-28"),
    endDate: null,
    autoRenew: false,
    status: "cancelled",
    amount: 0,
  },
];

const statusConfig = {
  active: {
    label: "Actif",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: CheckCircle,
  },
  expired: {
    label: "Expiré",
    color: "text-gray-400",
    bg: "bg-gray-500/10",
    border: "border-gray-500/30",
    icon: XCircle,
  },
  expiring: {
    label: "Expire bientôt",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: AlertCircle,
  },
  cancelled: {
    label: "Annulé",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: XCircle,
  },
};

export default function AdminSubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSubscription, setSelectedSubscription] = useState<typeof mockSubscriptions[0] | null>(null);
  const [actionDialog, setActionDialog] = useState<"extend" | "cancel" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter subscriptions
  const filteredSubscriptions = mockSubscriptions.filter((sub) => {
    const matchesSearch = sub.providerName.toLowerCase().includes(search.toLowerCase());
    const matchesPlan = planFilter === "all" || sub.plan === planFilter;
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  // Stats
  const stats = {
    free: mockSubscriptions.filter((s) => s.plan === "FREE").length,
    monthly: mockSubscriptions.filter((s) => s.plan === "MONTHLY").length,
    premium: mockSubscriptions.filter((s) => s.plan === "PREMIUM").length,
    revenue: mockSubscriptions.reduce((acc, s) => acc + s.amount, 0),
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleAction = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setActionDialog(null);
    setSelectedSubscription(null);
  };

  const exportToCSV = () => {
    const headers = ["Prestataire", "Plan", "Début", "Fin", "Auto-renouvellement", "Statut", "Montant"];
    const rows = filteredSubscriptions.map((s) => [
      s.providerName,
      s.plan,
      s.startDate.toLocaleDateString("fr-FR"),
      s.endDate?.toLocaleDateString("fr-FR") || "-",
      s.autoRenew ? "Oui" : "Non",
      statusConfig[s.status as keyof typeof statusConfig].label,
      formatPrice(s.amount),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `abonnements_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion des abonnements</h1>
          <p className="text-gray-400 mt-1">Gérez les abonnements des prestataires</p>
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
          icon={CreditCard}
          label="Gratuits"
          value={stats.free}
          variant="default"
        />
        <AdminStatsCard
          icon={CreditCard}
          label="Standards"
          value={stats.monthly}
          variant="primary"
        />
        <AdminStatsCard
          icon={CreditCard}
          label="Premium"
          value={stats.premium}
          variant="warning"
        />
        <AdminStatsCard
          icon={TrendingUp}
          label="Revenus totaux"
          value={formatPrice(stats.revenue)}
          variant="success"
        />
      </div>

      {/* Filters */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white"
              />
            </div>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full md:w-40 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Tous les plans</SelectItem>
                <SelectItem value="FREE">Gratuit</SelectItem>
                <SelectItem value="MONTHLY">Standard</SelectItem>
                <SelectItem value="PREMIUM">Premium</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="expiring">Expire bientôt</SelectItem>
                <SelectItem value="expired">Expiré</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-transparent">
                <TableHead className="text-gray-400 font-medium">Prestataire</TableHead>
                <TableHead className="text-gray-400 font-medium">Plan</TableHead>
                <TableHead className="text-gray-400 font-medium">Début</TableHead>
                <TableHead className="text-gray-400 font-medium">Fin</TableHead>
                <TableHead className="text-gray-400 font-medium">Auto-renouvellement</TableHead>
                <TableHead className="text-gray-400 font-medium">Statut</TableHead>
                <TableHead className="text-gray-400 font-medium text-right">Montant</TableHead>
                <TableHead className="text-gray-400 font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.map((subscription) => {
                const status = statusConfig[subscription.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;
                return (
                  <TableRow
                    key={subscription.id}
                    className="border-gray-700 hover:bg-gray-700/30"
                  >
                    <TableCell className="text-white font-medium">
                      {subscription.providerName}
                    </TableCell>
                    <TableCell>
                      <SubscriptionBadge status={subscription.plan} size="sm" />
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {subscription.startDate.toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {subscription.endDate?.toLocaleDateString("fr-FR") || "-"}
                    </TableCell>
                    <TableCell>
                      {subscription.autoRenew ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400">Activé</Badge>
                      ) : (
                        <Badge className="bg-gray-500/20 text-gray-400">Désactivé</Badge>
                      )}
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
                    <TableCell className="text-right text-white">
                      {subscription.amount > 0 ? formatPrice(subscription.amount) : "Gratuit"}
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
                            onClick={() => {
                              setSelectedSubscription(subscription);
                              setActionDialog("extend");
                            }}
                            className="text-gray-300 focus:bg-gray-700"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Prolonger
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-gray-300 focus:bg-gray-700">
                            <Bell className="w-4 h-4 mr-2" />
                            Envoyer rappel
                          </DropdownMenuItem>
                          {subscription.status === "active" && (
                            <>
                              <DropdownMenuSeparator className="bg-gray-700" />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedSubscription(subscription);
                                  setActionDialog("cancel");
                                }}
                                className="text-red-400 focus:bg-gray-700"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Annuler
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredSubscriptions.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucun abonnement trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={!!actionDialog} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent className="max-w-md bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {actionDialog === "extend" && "Prolonger l'abonnement"}
              {actionDialog === "cancel" && "Annuler l'abonnement"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {actionDialog === "extend" &&
                `Prolonger l'abonnement de ${selectedSubscription?.providerName}.`}
              {actionDialog === "cancel" &&
                `Êtes-vous sûr de vouloir annuler l'abonnement de ${selectedSubscription?.providerName} ?`}
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
                actionDialog === "cancel" && "bg-red-600 hover:bg-red-700",
                actionDialog === "extend" && "bg-primary hover:bg-primary/90"
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
