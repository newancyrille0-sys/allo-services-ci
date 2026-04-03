"use client";

import { useState } from "react";
import {
  Search,
  Download,
  Wallet,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { AdminStatsCard } from "@/components/admin";
import { cn } from "@/lib/utils";

// Mock payments data
const mockPayments = [
  {
    id: "TXN001",
    userName: "Kouadio Jean-Baptiste",
    userType: "client",
    amount: 45000,
    paymentMethod: "orange_money",
    type: "reservation",
    status: "completed",
    date: new Date("2024-05-10"),
  },
  {
    id: "TXN002",
    userName: "Électro Services Plus",
    userType: "provider",
    amount: 500000,
    paymentMethod: "card",
    type: "subscription",
    status: "completed",
    date: new Date("2024-05-08"),
  },
  {
    id: "TXN003",
    userName: "Aminata Diallo",
    userType: "client",
    amount: 25000,
    paymentMethod: "mtn_money",
    type: "reservation",
    status: "pending",
    date: new Date("2024-05-10"),
  },
  {
    id: "TXN004",
    userName: "Plomberie Express",
    userType: "provider",
    amount: 15000,
    paymentMethod: "wave",
    type: "subscription",
    status: "completed",
    date: new Date("2024-05-05"),
  },
  {
    id: "TXN005",
    userName: "Yao Serge",
    userType: "client",
    amount: 35000,
    paymentMethod: "moov",
    type: "reservation",
    status: "failed",
    date: new Date("2024-05-09"),
  },
  {
    id: "TXN006",
    userName: "Jardinage Vert",
    userType: "provider",
    amount: 500000,
    paymentMethod: "card",
    type: "subscription",
    status: "completed",
    date: new Date("2024-01-15"),
  },
];

const paymentMethodConfig: Record<string, { label: string; color: string }> = {
  orange_money: { label: "Orange Money", color: "text-orange-400 bg-orange-500/10 border-orange-500/30" },
  mtn_money: { label: "MTN Money", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
  wave: { label: "Wave", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  moov: { label: "Moov", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" },
  card: { label: "Carte", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
};

const statusConfig = {
  completed: {
    label: "Réussi",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    icon: CheckCircle,
  },
  pending: {
    label: "En attente",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    icon: Clock,
  },
  failed: {
    label: "Échoué",
    color: "text-red-400",
    bg: "bg-red-500/10",
    icon: XCircle,
  },
};

// Chart data
const revenueData = [
  { month: "Jan", revenue: 2500000 },
  { month: "Fév", revenue: 3200000 },
  { month: "Mar", revenue: 3800000 },
  { month: "Avr", revenue: 4200000 },
  { month: "Mai", revenue: 4500000 },
];

const chartConfig = {
  revenue: {
    label: "Revenus",
    color: "#0066FF",
  },
} satisfies ChartConfig;

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Filter payments
  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch = payment.userName.toLowerCase().includes(search.toLowerCase()) ||
      payment.id.toLowerCase().includes(search.toLowerCase());
    const matchesMethod = methodFilter === "all" || payment.paymentMethod === methodFilter;
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesType = typeFilter === "all" || payment.type === typeFilter;
    return matchesSearch && matchesMethod && matchesStatus && matchesType;
  });

  // Stats
  const stats = {
    total: mockPayments.filter((p) => p.status === "completed").reduce((acc, p) => acc + p.amount, 0),
    pending: mockPayments.filter((p) => p.status === "pending").length,
    failed: mockPayments.filter((p) => p.status === "failed").length,
    totalTransactions: mockPayments.length,
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const exportToCSV = () => {
    const headers = ["ID", "Utilisateur", "Type", "Montant", "Méthode", "Statut", "Date"];
    const rows = filteredPayments.map((p) => [
      p.id,
      p.userName,
      p.type === "subscription" ? "Abonnement" : "Réservation",
      formatPrice(p.amount),
      paymentMethodConfig[p.paymentMethod].label,
      statusConfig[p.status as keyof typeof statusConfig].label,
      p.date.toLocaleDateString("fr-FR"),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `paiements_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion des paiements</h1>
          <p className="text-gray-400 mt-1">Historique des transactions</p>
        </div>
        <Button
          variant="outline"
          onClick={exportToCSV}
          className="border-gray-700 text-gray-300 hover:bg-gray-800"
        >
          <Download className="w-4 h-4 mr-2" />
          Exporter CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdminStatsCard
          icon={Wallet}
          label="Total traité"
          value={formatPrice(stats.total)}
          variant="success"
        />
        <AdminStatsCard
          icon={Clock}
          label="En attente"
          value={stats.pending}
          variant="warning"
        />
        <AdminStatsCard
          icon={XCircle}
          label="Échoués"
          value={stats.failed}
          variant="danger"
        />
        <AdminStatsCard
          icon={TrendingUp}
          label="Transactions"
          value={stats.totalTransactions}
          variant="primary"
        />
      </div>

      {/* Revenue Chart */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <h3 className="text-white font-semibold mb-4">Revenus mensuels</h3>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `${value / 1000000}M`} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => formatPrice(value)}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0066FF"
                fill="url(#revenueGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher par ID ou nom..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white"
              />
            </div>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full lg:w-40 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Méthode" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="orange_money">Orange Money</SelectItem>
                <SelectItem value="mtn_money">MTN Money</SelectItem>
                <SelectItem value="wave">Wave</SelectItem>
                <SelectItem value="moov">Moov</SelectItem>
                <SelectItem value="card">Carte</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-40 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="completed">Réussi</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="failed">Échoué</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-40 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="subscription">Abonnement</SelectItem>
                <SelectItem value="reservation">Réservation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-transparent">
                <TableHead className="text-gray-400 font-medium">ID Transaction</TableHead>
                <TableHead className="text-gray-400 font-medium">Utilisateur</TableHead>
                <TableHead className="text-gray-400 font-medium text-right">Montant</TableHead>
                <TableHead className="text-gray-400 font-medium">Méthode</TableHead>
                <TableHead className="text-gray-400 font-medium">Type</TableHead>
                <TableHead className="text-gray-400 font-medium">Statut</TableHead>
                <TableHead className="text-gray-400 font-medium">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => {
                const status = statusConfig[payment.status as keyof typeof statusConfig];
                const method = paymentMethodConfig[payment.paymentMethod];
                const StatusIcon = status.icon;
                return (
                  <TableRow
                    key={payment.id}
                    className="border-gray-700 hover:bg-gray-700/30"
                  >
                    <TableCell className="text-gray-300 font-mono">{payment.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                          {payment.userType === "provider" ? (
                            <CreditCard className="w-4 h-4 text-primary" />
                          ) : (
                            <Smartphone className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-white">{payment.userName}</p>
                          <p className="text-gray-500 text-xs capitalize">
                            {payment.userType === "provider" ? "Prestataire" : "Client"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-white font-semibold">
                      {formatPrice(payment.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={method.color}>
                        {method.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          payment.type === "subscription"
                            ? "bg-primary/20 text-primary"
                            : "bg-gray-500/20 text-gray-300"
                        )}
                      >
                        {payment.type === "subscription" ? "Abonnement" : "Réservation"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn("font-medium", status.color, status.bg)}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {payment.date.toLocaleDateString("fr-FR")}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Wallet className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucun paiement trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
