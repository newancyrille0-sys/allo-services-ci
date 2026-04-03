"use client";

import { useState } from "react";
import {
  Search,
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Ban,
  Users,
  Wallet,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AdminStatsCard } from "@/components/admin";
import { cn } from "@/lib/utils";

// Mock reservations data
const mockReservations = [
  {
    id: "RES001",
    clientName: "Kouadio Jean-Baptiste",
    providerName: "Électro Services Plus",
    service: "Installation électrique",
    date: new Date("2024-05-12"),
    status: "CONFIRMED",
    price: 45000,
    paymentStatus: "paid",
    disputed: false,
  },
  {
    id: "RES002",
    clientName: "Aminata Diallo",
    providerName: "Plomberie Express",
    service: "Réparation fuite",
    date: new Date("2024-05-11"),
    status: "IN_PROGRESS",
    price: 25000,
    paymentStatus: "paid",
    disputed: false,
  },
  {
    id: "RES003",
    clientName: "Yao Serge",
    providerName: "Ménage Pro",
    service: "Grand ménage",
    date: new Date("2024-05-13"),
    status: "PENDING",
    price: 15000,
    paymentStatus: "pending",
    disputed: false,
  },
  {
    id: "RES004",
    clientName: "Fatou Bamba",
    providerName: "Jardinage Vert",
    service: "Taille de haie",
    date: new Date("2024-05-08"),
    status: "COMPLETED",
    price: 20000,
    paymentStatus: "paid",
    disputed: false,
  },
  {
    id: "RES005",
    clientName: "Ibrahim Koné",
    providerName: "Climatisation Expert",
    service: "Installation climatisation",
    date: new Date("2024-05-05"),
    status: "DISPUTED",
    price: 85000,
    paymentStatus: "paid",
    disputed: true,
    disputeReason: "Travail non conforme aux attentes",
  },
  {
    id: "RES006",
    clientName: "Marie Kouassi",
    providerName: "Électro Services Plus",
    service: "Dépannage urgent",
    date: new Date("2024-05-10"),
    status: "CANCELLED",
    price: 0,
    paymentStatus: "refunded",
    disputed: false,
  },
];

const statusConfig = {
  PENDING: {
    label: "En attente",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Confirmée",
    color: "text-primary",
    bg: "bg-primary/10",
    icon: CheckCircle,
  },
  IN_PROGRESS: {
    label: "En cours",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    icon: AlertCircle,
  },
  COMPLETED: {
    label: "Terminée",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "Annulée",
    color: "text-gray-400",
    bg: "bg-gray-500/10",
    icon: XCircle,
  },
  DISPUTED: {
    label: "Litige",
    color: "text-red-400",
    bg: "bg-red-500/10",
    icon: AlertTriangle,
  },
};

const paymentStatusConfig = {
  paid: { label: "Payé", color: "text-emerald-400 bg-emerald-500/10" },
  pending: { label: "En attente", color: "text-amber-400 bg-amber-500/10" },
  refunded: { label: "Remboursé", color: "text-gray-400 bg-gray-500/10" },
};

export default function AdminReservationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReservation, setSelectedReservation] = useState<typeof mockReservations[0] | null>(null);
  const [actionDialog, setActionDialog] = useState<"resolve" | null>(null);
  const [resolution, setResolution] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter reservations
  const filteredReservations = mockReservations.filter((reservation) => {
    const matchesSearch =
      reservation.clientName.toLowerCase().includes(search.toLowerCase()) ||
      reservation.providerName.toLowerCase().includes(search.toLowerCase()) ||
      reservation.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Disputed reservations
  const disputedReservations = mockReservations.filter((r) => r.disputed);

  // Stats
  const stats = {
    total: mockReservations.length,
    pending: mockReservations.filter((r) => r.status === "PENDING").length,
    completed: mockReservations.filter((r) => r.status === "COMPLETED").length,
    disputed: disputedReservations.length,
    revenue: mockReservations
      .filter((r) => r.paymentStatus === "paid")
      .reduce((acc, r) => acc + r.price, 0),
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleResolve = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setActionDialog(null);
    setSelectedReservation(null);
    setResolution("");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion des réservations</h1>
          <p className="text-gray-400 mt-1">Toutes les réservations de la plateforme</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <AdminStatsCard
          icon={CalendarDays}
          label="Total"
          value={stats.total}
          variant="default"
        />
        <AdminStatsCard
          icon={Clock}
          label="En attente"
          value={stats.pending}
          variant="warning"
        />
        <AdminStatsCard
          icon={CheckCircle}
          label="Terminées"
          value={stats.completed}
          variant="success"
        />
        <AdminStatsCard
          icon={AlertTriangle}
          label="Litiges"
          value={stats.disputed}
          variant="danger"
        />
        <AdminStatsCard
          icon={Wallet}
          label="Revenus"
          value={formatPrice(stats.revenue)}
          variant="primary"
        />
      </div>

      {/* Disputed Reservations Alert */}
      {disputedReservations.length > 0 && (
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-400 font-semibold">Réservations en litige</h3>
                <p className="text-gray-400 text-sm mt-1">
                  {disputedReservations.length} réservation(s) nécessitent votre attention.
                </p>
                <div className="mt-3 space-y-2">
                  {disputedReservations.map((res) => (
                    <div
                      key={res.id}
                      className="flex items-center justify-between p-2 bg-gray-900/50 rounded"
                    >
                      <div>
                        <p className="text-white text-sm">{res.id} - {res.service}</p>
                        <p className="text-gray-500 text-xs">{res.disputeReason}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => {
                          setSelectedReservation(res);
                          setActionDialog("resolve");
                        }}
                      >
                        Résoudre
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher par ID, client ou prestataire..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="PENDING">En attente</SelectItem>
                <SelectItem value="CONFIRMED">Confirmée</SelectItem>
                <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                <SelectItem value="COMPLETED">Terminée</SelectItem>
                <SelectItem value="CANCELLED">Annulée</SelectItem>
                <SelectItem value="DISPUTED">Litige</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reservations Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-transparent">
                <TableHead className="text-gray-400 font-medium">ID</TableHead>
                <TableHead className="text-gray-400 font-medium">Client</TableHead>
                <TableHead className="text-gray-400 font-medium">Prestataire</TableHead>
                <TableHead className="text-gray-400 font-medium">Service</TableHead>
                <TableHead className="text-gray-400 font-medium">Date</TableHead>
                <TableHead className="text-gray-400 font-medium">Statut</TableHead>
                <TableHead className="text-gray-400 font-medium">Paiement</TableHead>
                <TableHead className="text-gray-400 font-medium text-right">Prix</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.map((reservation) => {
                const status = statusConfig[reservation.status as keyof typeof statusConfig];
                const payment = paymentStatusConfig[reservation.paymentStatus as keyof typeof paymentStatusConfig];
                const StatusIcon = status.icon;
                return (
                  <TableRow
                    key={reservation.id}
                    className={cn(
                      "border-gray-700 hover:bg-gray-700/30",
                      reservation.disputed && "bg-red-500/5"
                    )}
                  >
                    <TableCell className="text-gray-300 font-mono">{reservation.id}</TableCell>
                    <TableCell className="text-white">{reservation.clientName}</TableCell>
                    <TableCell className="text-gray-300">{reservation.providerName}</TableCell>
                    <TableCell className="text-gray-300">{reservation.service}</TableCell>
                    <TableCell className="text-gray-300">
                      {reservation.date.toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn("font-medium", status.color, status.bg)}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={payment.color}>{payment.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-white font-semibold">
                      {reservation.price > 0 ? formatPrice(reservation.price) : "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredReservations.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucune réservation trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resolve Dialog */}
      <Dialog open={actionDialog === "resolve"} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent className="max-w-md bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Résoudre le litige</DialogTitle>
            <DialogDescription className="text-gray-400">
              Réservation {selectedReservation?.id} - {selectedReservation?.service}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-gray-300 text-sm font-medium">Raison du litige</p>
              <p className="text-gray-400 text-sm mt-1">{selectedReservation?.disputeReason}</p>
            </div>
            <div>
              <label className="text-gray-300 text-sm font-medium">Résolution</label>
              <Textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Décrivez la résolution du litige..."
                className="mt-2 bg-gray-800 border-gray-700 text-white"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setActionDialog(null)}
              className="text-gray-400"
            >
              Annuler
            </Button>
            <Button
              onClick={handleResolve}
              disabled={isProcessing || !resolution.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {isProcessing ? "Traitement..." : "Marquer résolu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
