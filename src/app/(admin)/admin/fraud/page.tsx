"use client";

import { useState } from "react";
import {
  Search,
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  Info,
  User,
  Ban,
  CheckCircle,
  Eye,
  Filter,
  RefreshCw,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FraudAlertCard, type FraudAlert } from "@/components/admin";
import { cn } from "@/lib/utils";

// Mock fraud alerts
const mockFraudAlerts: FraudAlert[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Moussa Diallo",
    eventType: "duplicate_phone",
    severity: "high",
    description: "Le numéro +225 07 11 22 33 44 est déjà utilisé par 3 autres comptes",
    ipAddress: "192.168.1.45",
    date: new Date("2024-05-10T10:30:00"),
    status: "new",
  },
  {
    id: "2",
    userId: "user2",
    userName: "Awa Sanogo",
    eventType: "multiple_accounts_ip",
    severity: "critical",
    description: "5 comptes créés depuis la même adresse IP en 24h",
    ipAddress: "41.202.45.123",
    date: new Date("2024-05-10T09:15:00"),
    status: "investigating",
  },
  {
    id: "3",
    eventType: "suspicious_payment",
    severity: "medium",
    description: "Tentative de paiement avec une carte signalée volée",
    ipAddress: "196.47.89.12",
    date: new Date("2024-05-10T08:45:00"),
    status: "new",
  },
  {
    id: "4",
    userId: "user4",
    userName: "Ibrahim Koné",
    eventType: "fake_review",
    severity: "medium",
    description: "Activité suspecte : 10 avis 5 étoiles en 1 heure pour le même prestataire",
    ipAddress: "154.72.33.88",
    date: new Date("2024-05-09T16:20:00"),
    status: "resolved",
  },
  {
    id: "5",
    userId: "user5",
    userName: "Fatou Bamba",
    eventType: "impersonation",
    severity: "critical",
    description: "Tentative d'usurpation d'identité détectée - Document KYC suspect",
    ipAddress: "41.202.45.123",
    date: new Date("2024-05-09T14:00:00"),
    status: "investigating",
  },
  {
    id: "6",
    eventType: "abnormal_activity",
    severity: "low",
    description: "Pic de réservations inhabituel détecté (500% au-dessus de la normale)",
    ipAddress: null,
    date: new Date("2024-05-08T22:30:00"),
    status: "resolved",
  },
];

const severityStats = {
  critical: mockFraudAlerts.filter((a) => a.severity === "critical").length,
  high: mockFraudAlerts.filter((a) => a.severity === "high").length,
  medium: mockFraudAlerts.filter((a) => a.severity === "medium").length,
  low: mockFraudAlerts.filter((a) => a.severity === "low").length,
};

const statusStats = {
  new: mockFraudAlerts.filter((a) => a.status === "new").length,
  investigating: mockFraudAlerts.filter((a) => a.status === "investigating").length,
  resolved: mockFraudAlerts.filter((a) => a.status === "resolved").length,
};

export default function AdminFraudPage() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);
  const [actionDialog, setActionDialog] = useState<"details" | "resolve" | null>(null);
  const [resolution, setResolution] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter alerts
  const filteredAlerts = mockFraudAlerts.filter((alert) => {
    const matchesSearch =
      alert.userName?.toLowerCase().includes(search.toLowerCase()) ||
      alert.description.toLowerCase().includes(search.toLowerCase()) ||
      alert.ipAddress?.includes(search);
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleResolve = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsProcessing(false);
    setActionDialog(null);
    setSelectedAlert(null);
    setResolution("");
  };

  const handleBanUser = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsProcessing(false);
    setActionDialog(null);
    setSelectedAlert(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Détection de fraude</h1>
          <p className="text-gray-400 mt-1">Centre de sécurité et surveillance</p>
        </div>
        <Button
          variant="outline"
          className="border-gray-700 text-gray-300 hover:bg-gray-800"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Severity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-red-400 text-sm">Critique</p>
                <p className="text-2xl font-bold text-white">{severityStats.critical}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/10 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <AlertCircle className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-orange-400 text-sm">Élevée</p>
                <p className="text-2xl font-bold text-white">{severityStats.high}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Info className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-amber-400 text-sm">Moyenne</p>
                <p className="text-2xl font-bold text-white">{severityStats.medium}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Info className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-blue-400 text-sm">Faible</p>
                <p className="text-2xl font-bold text-white">{severityStats.low}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher par utilisateur, IP ou description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full md:w-40 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Sévérité" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
                <SelectItem value="high">Élevée</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="low">Faible</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="new">Nouveau</SelectItem>
                <SelectItem value="investigating">En cours</SelectItem>
                <SelectItem value="resolved">Résolu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary">
            Toutes ({mockFraudAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="new" className="data-[state=active]:bg-primary">
            Nouveaux ({statusStats.new})
          </TabsTrigger>
          <TabsTrigger value="investigating" className="data-[state=active]:bg-primary">
            En cours ({statusStats.investigating})
          </TabsTrigger>
          <TabsTrigger value="resolved" className="data-[state=active]:bg-primary">
            Résolus ({statusStats.resolved})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredAlerts.map((alert) => (
            <FraudAlertCard
              key={alert.id}
              alert={alert}
              onViewDetails={() => {
                setSelectedAlert(alert);
                setActionDialog("details");
              }}
              onMarkInvestigating={() => {}}
              onResolve={() => {
                setSelectedAlert(alert);
                setActionDialog("resolve");
              }}
              onBanUser={() => {
                setSelectedAlert(alert);
                handleBanUser();
              }}
            />
          ))}
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          {filteredAlerts
            .filter((a) => a.status === "new")
            .map((alert) => (
              <FraudAlertCard
                key={alert.id}
                alert={alert}
                onViewDetails={() => {
                  setSelectedAlert(alert);
                  setActionDialog("details");
                }}
                onMarkInvestigating={() => {}}
                onResolve={() => {
                  setSelectedAlert(alert);
                  setActionDialog("resolve");
                }}
                onBanUser={() => {
                  setSelectedAlert(alert);
                  handleBanUser();
                }}
              />
            ))}
        </TabsContent>

        <TabsContent value="investigating" className="space-y-4">
          {filteredAlerts
            .filter((a) => a.status === "investigating")
            .map((alert) => (
              <FraudAlertCard
                key={alert.id}
                alert={alert}
                onViewDetails={() => {
                  setSelectedAlert(alert);
                  setActionDialog("details");
                }}
                onResolve={() => {
                  setSelectedAlert(alert);
                  setActionDialog("resolve");
                }}
              />
            ))}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {filteredAlerts
            .filter((a) => a.status === "resolved")
            .map((alert) => (
              <FraudAlertCard key={alert.id} alert={alert} />
            ))}
        </TabsContent>
      </Tabs>

      {filteredAlerts.length === 0 && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="py-12 text-center text-gray-400">
            <ShieldAlert className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucune alerte trouvée</p>
          </CardContent>
        </Card>
      )}

      {/* Details/Resolve Dialog */}
      <Dialog open={!!actionDialog} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent className="max-w-lg bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              {actionDialog === "details" && (
                <>
                  <Eye className="w-5 h-5" />
                  Détails de l&apos;alerte
                </>
              )}
              {actionDialog === "resolve" && (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Résoudre l&apos;alerte
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedAlert && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Type d&apos;événement</p>
                  <p className="text-white">{selectedAlert.eventType}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Sévérité</p>
                  <Badge
                    className={cn(
                      selectedAlert.severity === "critical" && "bg-red-500/20 text-red-400",
                      selectedAlert.severity === "high" && "bg-orange-500/20 text-orange-400",
                      selectedAlert.severity === "medium" && "bg-amber-500/20 text-amber-400",
                      selectedAlert.severity === "low" && "bg-blue-500/20 text-blue-400"
                    )}
                  >
                    {selectedAlert.severity}
                  </Badge>
                </div>
                {selectedAlert.userName && (
                  <div>
                    <p className="text-gray-400 text-sm">Utilisateur</p>
                    <p className="text-white">{selectedAlert.userName}</p>
                  </div>
                )}
                {selectedAlert.ipAddress && (
                  <div>
                    <p className="text-gray-400 text-sm">Adresse IP</p>
                    <p className="text-white font-mono">{selectedAlert.ipAddress}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-gray-400 text-sm">Description</p>
                <p className="text-white">{selectedAlert.description}</p>
              </div>

              {actionDialog === "resolve" && (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Notes de résolution</p>
                  <Textarea
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Décrivez les actions prises..."
                    className="bg-gray-800 border-gray-700 text-white"
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setActionDialog(null)}
              className="text-gray-400"
            >
              Fermer
            </Button>
            {actionDialog === "resolve" && (
              <Button
                onClick={handleResolve}
                disabled={isProcessing}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isProcessing ? "Traitement..." : "Marquer résolu"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
