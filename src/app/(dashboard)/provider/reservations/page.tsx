"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CalendarDays,
  Search,
  Filter,
  Download,
  Phone,
  MapPin,
  Clock,
  ChevronRight,
  Calendar,
  List,
  Check,
  X,
  Play,
  CheckCircle,
  MessageSquare,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate, formatTime } from "@/lib/utils/formatters";
import { SERVICE_CATEGORIES } from "@/lib/constants/services";

// Types
type ReservationStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

interface Reservation {
  id: string;
  status: ReservationStatus;
  client: {
    id: string;
    name: string;
    phone: string;
    avatar?: string;
  };
  service: {
    name: string;
    category: string;
  };
  scheduledDate: Date;
  scheduledTime: string;
  address: string;
  city: string;
  notes?: string;
  priceTotal: number;
  createdAt: Date;
}

// Mock data
const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: "res-1",
    status: "PENDING",
    client: {
      id: "client-1",
      name: "Amadou Koné",
      phone: "+225 07 08 09 10 11",
    },
    service: {
      name: "Plomberie",
      category: "Bricolage & Réparations",
    },
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    scheduledTime: "09:00",
    address: "Cocody, Rue des Jardins, Villa 45",
    city: "Abidjan",
    notes: "Fuite d'eau dans la cuisine, intervention urgente demandée",
    priceTotal: 25000,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "res-2",
    status: "PENDING",
    client: {
      id: "client-2",
      name: "Fatou Diallo",
      phone: "+225 05 06 07 08 09",
    },
    service: {
      name: "Électricité",
      category: "Bricolage & Réparations",
    },
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 48),
    scheduledTime: "14:00",
    address: "Marcory, Boulevard de la République",
    city: "Abidjan",
    notes: "Installation d'un nouveau tableau électrique",
    priceTotal: 75000,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: "res-3",
    status: "CONFIRMED",
    client: {
      id: "client-3",
      name: "Jean Kouassi",
      phone: "+225 01 02 03 04 05",
    },
    service: {
      name: "Climatisation",
      category: "Bricolage & Réparations",
    },
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 72),
    scheduledTime: "10:00",
    address: "Plateau, Avenue Chardy, Immeuble Les Palmiers",
    city: "Abidjan",
    notes: "Installation de 2 climatiseurs split",
    priceTotal: 150000,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "res-4",
    status: "IN_PROGRESS",
    client: {
      id: "client-4",
      name: "Awa Sanogo",
      phone: "+225 03 04 05 06 07",
    },
    service: {
      name: "Plomberie",
      category: "Bricolage & Réparations",
    },
    scheduledDate: new Date(Date.now() - 1000 * 60 * 60),
    scheduledTime: "08:00",
    address: "Yopougon, Quartier résidentiel",
    city: "Abidjan",
    notes: "Réparation canalisation bouchée",
    priceTotal: 45000,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
  {
    id: "res-5",
    status: "COMPLETED",
    client: {
      id: "client-5",
      name: "Moussa Traoré",
      phone: "+225 09 10 11 12 13",
    },
    service: {
      name: "Installation sanitaire",
      category: "Bricolage & Réparations",
    },
    scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    scheduledTime: "11:00",
    address: "Treichville, Rue du Commerce",
    city: "Abidjan",
    priceTotal: 120000,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
  {
    id: "res-6",
    status: "CANCELLED",
    client: {
      id: "client-6",
      name: "Koffi Yao",
      phone: "+225 02 03 04 05 06",
    },
    service: {
      name: "Serrurerie",
      category: "Bricolage & Réparations",
    },
    scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    scheduledTime: "16:00",
    address: "Abobo, Quartier Alliance",
    city: "Abidjan",
    notes: "Annulé par le client",
    priceTotal: 35000,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
  },
  {
    id: "res-7",
    status: "PENDING",
    client: {
      id: "client-7",
      name: "Marie Brou",
      phone: "+225 04 05 06 07 08",
    },
    service: {
      name: "Peinture",
      category: "Bricolage & Réparations",
    },
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    scheduledTime: "09:00",
    address: "Bingerville, Quartier résidentiel",
    city: "Abidjan",
    notes: "Peinture intérieure appartement 3 pièces",
    priceTotal: 250000,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
  },
];

const STATUS_CONFIG: Record<ReservationStatus, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: "En attente", color: "text-amber-600", bgColor: "bg-amber-100" },
  CONFIRMED: { label: "Confirmée", color: "text-primary", bgColor: "bg-primary/10" },
  IN_PROGRESS: { label: "En cours", color: "text-emerald-600", bgColor: "bg-emerald-100" },
  COMPLETED: { label: "Terminée", color: "text-gray-600", bgColor: "bg-gray-100" },
  CANCELLED: { label: "Annulée", color: "text-red-600", bgColor: "bg-red-100" },
};

const TAB_ITEMS = [
  { value: "all", label: "Toutes", count: MOCK_RESERVATIONS.length },
  { value: "PENDING", label: "En attente", count: MOCK_RESERVATIONS.filter((r) => r.status === "PENDING").length },
  { value: "CONFIRMED", label: "Confirmées", count: MOCK_RESERVATIONS.filter((r) => r.status === "CONFIRMED").length },
  { value: "IN_PROGRESS", label: "En cours", count: MOCK_RESERVATIONS.filter((r) => r.status === "IN_PROGRESS").length },
  { value: "COMPLETED", label: "Terminées", count: MOCK_RESERVATIONS.filter((r) => r.status === "COMPLETED").length },
  { value: "CANCELLED", label: "Annulées", count: MOCK_RESERVATIONS.filter((r) => r.status === "CANCELLED").length },
];

export default function ProviderReservationsPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("status") || "all";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS);

  // Filter reservations
  const filteredReservations = reservations.filter((reservation) => {
    // Status filter
    if (activeTab !== "all" && reservation.status !== activeTab) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        reservation.client.name.toLowerCase().includes(query) ||
        reservation.service.name.toLowerCase().includes(query) ||
        reservation.address.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (selectedCategory !== "all" && reservation.service.category !== selectedCategory) return false;

    // Date range filter
    if (dateRange.from && reservation.scheduledDate < dateRange.from) return false;
    if (dateRange.to && reservation.scheduledDate > dateRange.to) return false;

    return true;
  });

  const handleStatusChange = (reservationId: string, newStatus: ReservationStatus) => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId ? { ...r, status: newStatus } : r
      )
    );
  };

  const handleExportCSV = () => {
    // TODO: Implement CSV export
    console.log("Exporting reservations to CSV...");
  };

  // Group reservations by date for calendar view
  const reservationsByDate = filteredReservations.reduce((acc, reservation) => {
    const dateKey = formatDate(reservation.scheduledDate);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(reservation);
    return acc;
  }, {} as Record<string, Reservation[]>);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Réservations</h1>
          <p className="text-muted-foreground">
            Gérez les réservations de vos clients
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList className="h-auto flex-wrap">
            {TAB_ITEMS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-1">
                {tab.label}
                {tab.count > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                    {tab.count}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("calendar")}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par client, service ou adresse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Toutes catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              {SERVICE_CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <CalendarDays className="h-4 w-4 mr-2" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                    </>
                  ) : (
                    formatDate(dateRange.from)
                  )
                ) : (
                  "Dates"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="range"
                selected={{
                  from: dateRange.from,
                  to: dateRange.to,
                }}
                onSelect={(range) =>
                  setDateRange({
                    from: range?.from,
                    to: range?.to,
                  })
                }
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Content */}
        <TabsContent value={activeTab} className="mt-4">
          {filteredReservations.length === 0 ? (
            <Card className="border-gray-200/50">
              <CardContent className="p-8 text-center">
                <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Aucune réservation trouvée</h3>
                <p className="text-sm text-muted-foreground">
                  Essayez de modifier vos filtres ou attendez de nouvelles demandes
                </p>
              </CardContent>
            </Card>
          ) : viewMode === "list" ? (
            <div className="space-y-3">
              {filteredReservations.map((reservation) => (
                <Card key={reservation.id} className="border-gray-200/50 hover:border-gray-200 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={reservation.client.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {reservation.client.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              href={`/provider/reservations/${reservation.id}`}
                              className="font-medium hover:text-primary transition-colors"
                            >
                              {reservation.client.name}
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {reservation.service.name}
                              </Badge>
                              <Badge
                                className={`text-xs ${STATUS_CONFIG[reservation.status].bgColor} ${STATUS_CONFIG[reservation.status].color}`}
                              >
                                {STATUS_CONFIG[reservation.status].label}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-semibold">{formatPrice(reservation.priceTotal)}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(reservation.scheduledDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{reservation.scheduledTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{reservation.address}</span>
                          </div>
                          <a
                            href={`tel:${reservation.client.phone.replace(/\s/g, "")}`}
                            className="flex items-center gap-1 hover:text-primary"
                          >
                            <Phone className="h-4 w-4" />
                            <span>{reservation.client.phone}</span>
                          </a>
                        </div>
                        {reservation.notes && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                            Note: {reservation.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                      {reservation.status === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(reservation.id, "CONFIRMED")}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accepter
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusChange(reservation.id, "CANCELLED")}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Refuser
                          </Button>
                        </>
                      )}
                      {reservation.status === "CONFIRMED" && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(reservation.id, "IN_PROGRESS")}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Démarrer
                        </Button>
                      )}
                      {reservation.status === "IN_PROGRESS" && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(reservation.id, "COMPLETED")}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Terminer
                        </Button>
                      )}
                      <Button size="sm" variant="outline" asChild>
                        <a href={`tel:${reservation.client.phone.replace(/\s/g, "")}`}>
                          <Phone className="h-4 w-4 mr-1" />
                          Appeler
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/provider/messages?client=${reservation.client.id}`}>
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Link>
                      </Button>
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/provider/reservations/${reservation.id}`}>
                          Détails
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Calendar View
            <div className="space-y-4">
              {Object.entries(reservationsByDate)
                .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                .map(([date, dayReservations]) => (
                  <Card key={date} className="border-gray-200/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{date}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {dayReservations.map((reservation) => (
                        <Link
                          key={reservation.id}
                          href={`/provider/reservations/${reservation.id}`}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="text-center min-w-[50px]">
                            <p className="text-lg font-semibold">{reservation.scheduledTime}</p>
                          </div>
                          <Separator orientation="vertical" className="h-10" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{reservation.client.name}</p>
                              <Badge
                                className={`text-xs ${STATUS_CONFIG[reservation.status].bgColor} ${STATUS_CONFIG[reservation.status].color}`}
                              >
                                {STATUS_CONFIG[reservation.status].label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {reservation.service.name} • {formatPrice(reservation.priceTotal)}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Import useState
import { useState } from "react";
