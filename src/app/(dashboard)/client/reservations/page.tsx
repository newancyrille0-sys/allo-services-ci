"use client";

import * as React from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  CalendarDays,
  X,
} from "lucide-react";
import { ReservationCard } from "@/components/reservations/ReservationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import { SERVICE_CATEGORIES } from "@/lib/constants/services";

// Mock reservations data
const MOCK_RESERVATIONS = [
  {
    id: "res-1",
    status: "PENDING",
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 48),
    address: "Cocody, Rue des Jardins",
    city: "Abidjan",
    priceTotal: 25000,
    service: { name: "Plomberie" },
    provider: {
      businessName: "Plomberie Express",
      user: { fullName: "Koffi Yao" },
    },
  },
  {
    id: "res-2",
    status: "CONFIRMED",
    scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    address: "Marcory, Boulevard de la République",
    city: "Abidjan",
    priceTotal: 15000,
    service: { name: "Ménage régulier" },
    provider: {
      businessName: "Ménage Pro CI",
      user: { fullName: "Aminata Diallo" },
    },
  },
  {
    id: "res-3",
    status: "IN_PROGRESS",
    scheduledDate: new Date(Date.now() - 1000 * 60 * 60),
    address: "Plateau, Avenue Chardy",
    city: "Abidjan",
    priceTotal: 45000,
    service: { name: "Cours de maths" },
    provider: {
      businessName: "Prof Maths Academy",
      user: { fullName: "Jean Kouassi" },
    },
  },
  {
    id: "res-4",
    status: "COMPLETED",
    scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    address: "Yopougon, Quartier Million",
    city: "Abidjan",
    priceTotal: 35000,
    service: { name: "Coiffure à domicile" },
    provider: {
      businessName: "Beauty Home Services",
      user: { fullName: "Marie Toure" },
    },
  },
  {
    id: "res-5",
    status: "COMPLETED",
    scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    address: "Treichville, Rue 12",
    city: "Abidjan",
    priceTotal: 18000,
    service: { name: "Réparation électrique" },
    provider: {
      businessName: "Électro Services",
      user: { fullName: "Ibrahim Sylla" },
    },
  },
  {
    id: "res-6",
    status: "CANCELLED",
    scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    address: "Abobo, Quartier ANADER",
    city: "Abidjan",
    priceTotal: 20000,
    service: { name: "Jardinage" },
    provider: {
      businessName: "Jardins Verts CI",
      user: { fullName: "Paul Koné" },
    },
  },
];

const TABS = [
  { value: "all", label: "Toutes", count: MOCK_RESERVATIONS.length },
  { value: "PENDING", label: "En attente", count: MOCK_RESERVATIONS.filter(r => r.status === "PENDING").length },
  { value: "CONFIRMED", label: "Confirmées", count: MOCK_RESERVATIONS.filter(r => r.status === "CONFIRMED").length },
  { value: "IN_PROGRESS", label: "En cours", count: MOCK_RESERVATIONS.filter(r => r.status === "IN_PROGRESS").length },
  { value: "COMPLETED", label: "Terminées", count: MOCK_RESERVATIONS.filter(r => r.status === "COMPLETED").length },
  { value: "CANCELLED", label: "Annulées", count: MOCK_RESERVATIONS.filter(r => r.status === "CANCELLED").length },
];

function EmptyState({ status }: { status: string }) {
  const getMessage = () => {
    switch (status) {
      case "PENDING":
        return "Aucune réservation en attente";
      case "CONFIRMED":
        return "Aucune réservation confirmée";
      case "IN_PROGRESS":
        return "Aucune réservation en cours";
      case "COMPLETED":
        return "Aucune réservation terminée";
      case "CANCELLED":
        return "Aucune réservation annulée";
      default:
        return "Aucune réservation trouvée";
    }
  };

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <CalendarDays className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground text-center">{getMessage()}</p>
        <Button asChild className="mt-4">
          <Link href="/client/reservations/new">
            <Plus className="h-4 w-4 mr-2" />
            Créer une réservation
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ReservationsPage() {
  const [activeTab, setActiveTab] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedService, setSelectedService] = React.useState<string>("");
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [showFilters, setShowFilters] = React.useState(false);

  // Filter reservations based on tab, search, and filters
  const filteredReservations = React.useMemo(() => {
    let result = [...MOCK_RESERVATIONS];

    // Filter by tab/status
    if (activeTab !== "all") {
      result = result.filter((r) => r.status === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.service.name.toLowerCase().includes(query) ||
          r.provider?.businessName?.toLowerCase().includes(query) ||
          r.provider?.user?.fullName?.toLowerCase().includes(query)
      );
    }

    // Filter by service
    if (selectedService && selectedService !== "all") {
      result = result.filter((r) => r.service.name === selectedService);
    }

    // Filter by date range
    if (dateRange.from) {
      result = result.filter((r) => new Date(r.scheduledDate) >= dateRange.from!);
    }
    if (dateRange.to) {
      result = result.filter((r) => new Date(r.scheduledDate) <= dateRange.to!);
    }

    return result;
  }, [activeTab, searchQuery, selectedService, dateRange]);

  const hasActiveFilters = selectedService || dateRange.from || dateRange.to;

  const clearFilters = () => {
    setSelectedService("");
    setDateRange({ from: undefined, to: undefined });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mes réservations</h1>
          <p className="text-muted-foreground">
            Gérez vos réservations de services
          </p>
        </div>
        <Button asChild>
          <Link href="/client/reservations/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle réservation
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par service ou prestataire..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="shrink-0">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  Actifs
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type de service</label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les services</SelectItem>
                    {SERVICE_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Période</label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex-1 justify-start text-left">
                        <Calendar className="h-4 w-4 mr-2" />
                        {dateRange.from ? (
                          dateRange.from.toLocaleDateString("fr-FR")
                        ) : (
                          "Du"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) =>
                          setDateRange((prev) => ({ ...prev, from: date }))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex-1 justify-start text-left">
                        <Calendar className="h-4 w-4 mr-2" />
                        {dateRange.to ? (
                          dateRange.to.toLocaleDateString("fr-FR")
                        ) : (
                          "Au"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) =>
                          setDateRange((prev) => ({ ...prev, to: date }))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Effacer les filtres
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto h-auto p-1">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              {tab.label}
              {tab.count > 0 && (
                <Badge
                  variant={activeTab === tab.value ? "default" : "secondary"}
                  className="h-5 px-1.5 text-xs"
                >
                  {tab.count}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            {filteredReservations.length === 0 ? (
              <EmptyState status={tab.value} />
            ) : (
              <div className="space-y-4">
                {filteredReservations.map((reservation) => (
                  <Link
                    key={reservation.id}
                    href={`/client/reservations/${reservation.id}`}
                  >
                    <ReservationCard
                      reservation={reservation}
                      userRole="client"
                    />
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
