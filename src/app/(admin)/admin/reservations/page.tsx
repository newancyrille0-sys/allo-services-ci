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
  Download,
  PlusCircle,
  RefreshCw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Zap,
  Droplet,
  Router,
  Video,
  MoreVertical,
  Headphones,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Mock reservations data
const mockReservations = [
  {
    id: "REQ-92841",
    clientName: "Jean-Marc Dupont",
    clientLocation: "Abidjan, Zone 4",
    clientInitials: "JD",
    providerName: "Électro Services Plus",
    service: "Electrical Repair",
    serviceIcon: "zap",
    date: "28 Oct 2023, 09:45",
    status: "ASSIGNED",
    price: 45000,
    disputed: false,
  },
  {
    id: "REQ-92840",
    clientName: "Awa Kouadio",
    clientLocation: "Cocody, Angré",
    clientInitials: "AK",
    providerName: "Plomberie Express",
    service: "Plumbing Emergency",
    serviceIcon: "droplet",
    date: "28 Oct 2023, 08:30",
    status: "PENDING",
    price: 25000,
    disputed: false,
  },
  {
    id: "REQ-92839",
    clientName: "Bakary N'Goran",
    clientLocation: "Plateau, Business District",
    clientInitials: "BN",
    providerName: "IT Services Pro",
    service: "IT Infrastructure",
    serviceIcon: "router",
    date: "27 Oct 2023, 16:12",
    status: "COMPLETED",
    price: 15000,
    disputed: false,
  },
  {
    id: "REQ-92838",
    clientName: "Laurent Toure",
    clientLocation: "Bingerville",
    clientInitials: "LT",
    providerName: "Security Pro",
    service: "Security CCTV",
    serviceIcon: "video",
    date: "27 Oct 2023, 14:05",
    status: "ASSIGNED",
    price: 85000,
    disputed: false,
  },
  {
    id: "REQ-92837",
    clientName: "Fatou Bamba",
    clientLocation: "Marcory, Zone 4",
    clientInitials: "FB",
    providerName: "Jardinage Vert",
    service: "Garden Maintenance",
    serviceIcon: "droplet",
    date: "26 Oct 2023, 10:00",
    status: "ESCALATED",
    price: 20000,
    disputed: true,
    disputeReason: "Travail non conforme aux attentes",
  },
];

const statusConfig = {
  PENDING: {
    label: "Pending",
    color: "text-amber-800",
    bg: "bg-amber-100",
  },
  ASSIGNED: {
    label: "Assigned",
    color: "text-[#54647a]",
    bg: "bg-[#d0e1fb]",
  },
  COMPLETED: {
    label: "Completed",
    color: "text-[#00b27b]",
    bg: "bg-transparent",
    showDot: true,
  },
  ESCALATED: {
    label: "Escalated",
    color: "text-red-800",
    bg: "bg-red-100",
  },
};

const serviceIcons: Record<string, React.ReactNode> = {
  zap: <Zap className="w-4 h-4 text-[#001e40]/40" />,
  droplet: <Droplet className="w-4 h-4 text-[#001e40]/40" />,
  router: <Router className="w-4 h-4 text-[#001e40]/40" />,
  video: <Video className="w-4 h-4 text-[#001e40]/40" />,
};

const avatarColors = [
  "bg-[#d5e3ff]",
  "bg-[#d3e4fe]",
  "bg-[#6ffbbe]",
  "bg-[#a7c8ff]",
];

export default function AdminReservationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState("Oct 01 - Oct 28, 2023");
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

  // Stats
  const stats = [
    { label: "Total Active", value: "1,284", change: "+12.5% FROM LAST MONTH", icon: TrendingUp, trend: "up" },
    { label: "Pending Sync", value: "42", change: "REQUIRES ATTENTION", icon: Clock, trend: "warning" },
    { label: "Avg Response", value: "2.4h", change: "WITHIN SERVICE LIMITS", icon: CheckCircle, trend: "success" },
    { label: "Satisfaction", value: "98.2%", change: "ELITE RATING", icon: Star, trend: "blue" },
  ];

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

  // Disputed reservations
  const disputedReservations = mockReservations.filter((r) => r.disputed);

  return (
    <div className="p-8 pt-24 pb-12 min-h-screen bg-[#f7f9fb]">
      <div className="max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-extrabold font-['Manrope',sans-serif] text-[#001e40] tracking-tight mb-2">
              Service Requests
            </h2>
            <p className="text-slate-500 max-w-xl">
              Comprehensive ledger of all service interactions across the ALLO ecosystem. 
              Monitor status, allocation, and lifecycle of every request.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="bg-[#e6e8ea] text-[#191c1e] font-semibold rounded-md text-sm hover:bg-[#d8dadc] transition-colors flex items-center gap-2 border-0"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button
              className="bg-gradient-to-r from-[#001e40] to-[#003366] text-white font-semibold rounded-md text-sm shadow-lg shadow-[#001e40]/10 hover:opacity-95 transition-opacity flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Create Request
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Active</p>
            <p className="text-3xl font-black text-[#001e40] font-['Manrope',sans-serif]">1,284</p>
            <div className="mt-4 flex items-center text-[10px] font-bold text-[#00b27b] gap-1">
              <TrendingUp className="w-3 h-3" />
              +12.5% FROM LAST MONTH
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Sync</p>
            <p className="text-3xl font-black text-[#001e40] font-['Manrope',sans-serif]">42</p>
            <div className="mt-4 flex items-center text-[10px] font-bold text-amber-600 gap-1">
              <Clock className="w-3 h-3" />
              REQUIRES ATTENTION
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Response</p>
            <p className="text-3xl font-black text-[#001e40] font-['Manrope',sans-serif]">2.4h</p>
            <div className="mt-4 flex items-center text-[10px] font-bold text-[#00b27b] gap-1">
              <CheckCircle className="w-3 h-3" />
              WITHIN SERVICE LIMITS
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Satisfaction</p>
            <p className="text-3xl font-black text-[#001e40] font-['Manrope',sans-serif]">98.2%</p>
            <div className="mt-4 flex items-center text-[10px] font-bold text-blue-500 gap-1">
              <Star className="w-3 h-3" />
              ELITE RATING
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-[#f2f4f6] p-5 rounded-xl mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white border-0 rounded-lg text-xs font-semibold px-4 py-2 h-9 w-32">
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="ASSIGNED">Assigned</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="ESCALATED">Escalated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Date Range:</span>
            <div className="flex items-center bg-white rounded-lg px-3 py-1.5">
              <CalendarDays className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent border-0 p-0 text-xs font-semibold focus:ring-0 w-40 outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Service:</span>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="bg-white border-0 rounded-lg text-xs font-semibold px-4 py-2 h-9 w-32">
                <SelectValue placeholder="All Services" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="it">IT Support</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-[#001e40] transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-[#001e40] transition-colors">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-[0px_12px_32px_rgba(25,28,30,0.06)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f2f4f6]/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-[#001e40] uppercase tracking-[0.1em] border-b border-slate-100">ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#001e40] uppercase tracking-[0.1em] border-b border-slate-100">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#001e40] uppercase tracking-[0.1em] border-b border-slate-100">Service Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#001e40] uppercase tracking-[0.1em] border-b border-slate-100">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#001e40] uppercase tracking-[0.1em] border-b border-slate-100">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#001e40] uppercase tracking-[0.1em] border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredReservations.map((reservation, index) => {
                const status = statusConfig[reservation.status as keyof typeof statusConfig];
                return (
                  <tr
                    key={reservation.id}
                    className={cn(
                      "hover:bg-slate-50/50 transition-colors group",
                      index % 2 === 1 && "bg-[#f2f4f6]/20"
                    )}
                  >
                    <td className="px-6 py-5">
                      <span className="font-mono text-xs font-bold text-slate-400">#{reservation.id}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-[#001e40]",
                            avatarColors[index % avatarColors.length]
                          )}
                        >
                          {reservation.clientInitials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#191c1e]">{reservation.clientName}</p>
                          <p className="text-[10px] text-slate-400">{reservation.clientLocation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {serviceIcons[reservation.serviceIcon] || <Zap className="w-4 h-4 text-[#001e40]/40" />}
                        <span className="text-xs font-medium">{reservation.service}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {status.showDot ? (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#00b27b] shadow-[0_0_8px_rgba(0,178,123,0.5)]" />
                          <span className="text-[10px] font-bold text-[#00b27b] uppercase">{status.label}</span>
                        </div>
                      ) : (
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                            status.bg,
                            status.color
                          )}
                        >
                          {status.label}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-xs text-slate-500 font-medium">{reservation.date}</td>
                    <td className="px-6 py-5 text-right">
                      <button
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white rounded-lg shadow-sm"
                        onClick={() => {
                          setSelectedReservation(reservation);
                          if (reservation.disputed) {
                            setActionDialog("resolve");
                          }
                        }}
                      >
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination Footer */}
          <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Showing 1-10 of 2,482 entries
            </p>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded bg-[#f2f4f6] text-slate-400 hover:text-[#001e40] transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold bg-[#001e40] text-white">
                1
              </button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-100">
                2
              </button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-100">
                3
              </button>
              <span className="text-slate-400 px-1">...</span>
              <button className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-100">
                248
              </button>
              <button className="p-1.5 rounded bg-[#f2f4f6] text-slate-400 hover:text-[#001e40] transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAB Support Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-14 h-14 bg-[#00b27b] text-white rounded-full flex items-center justify-center shadow-xl shadow-[#00b27b]/30 hover:scale-105 active:scale-95 transition-all">
          <Headphones className="w-6 h-6" />
        </button>
      </div>

      {/* Resolve Dialog */}
      <Dialog open={actionDialog === "resolve"} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#001e40]">Résoudre le litige</DialogTitle>
            <DialogDescription className="text-slate-500">
              Réservation {selectedReservation?.id} - {selectedReservation?.service}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-slate-700 text-sm font-medium">Raison du litige</p>
              <p className="text-slate-500 text-sm mt-1">{selectedReservation?.disputeReason}</p>
            </div>
            <div>
              <label className="text-slate-700 text-sm font-medium">Résolution</label>
              <Textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Décrivez la résolution du litige..."
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setActionDialog(null)}
              className="text-slate-500"
            >
              Annuler
            </Button>
            <Button
              onClick={handleResolve}
              disabled={isProcessing || !resolution.trim()}
              className="bg-[#001e40] hover:bg-[#003366]"
            >
              {isProcessing ? "Traitement..." : "Marquer résolu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Missing icons
function TrendingUp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
      <polyline points="17,6 23,6 23,12" />
    </svg>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}
