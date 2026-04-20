"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ShieldAlert,
  Eye,
  CheckCircle,
  Ban,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  Filter,
  Search,
  TrendingUp,
  Users,
  FileWarning,
  RefreshCw,
  MoreVertical,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Mock data for moderation
const mockContactDetections = [
  {
    id: "1",
    senderName: "Kouadio Emmanuel",
    senderId: "user-1",
    receiverName: "Marie Kouassi",
    receiverId: "user-2",
    detectedType: "phone",
    detectedPattern: "+225 07 58 92 34 12",
    rawContent: "Appelez-moi au +225 07 58 92 34 12 pour discuter",
    severity: "high",
    action: "alert",
    isResolved: false,
    createdAt: new Date("2024-05-10T10:30:00"),
    occurrenceCount: 3,
  },
  {
    id: "2",
    senderName: "Yao Serge",
    senderId: "user-3",
    receiverName: "Jean Dupont",
    receiverId: "user-4",
    detectedType: "whatsapp",
    detectedPattern: "wa.me/22507000000",
    rawContent: "Mon WhatsApp: wa.me/22507000000",
    severity: "medium",
    action: "warn",
    isResolved: false,
    createdAt: new Date("2024-05-10T09:15:00"),
    occurrenceCount: 1,
  },
  {
    id: "3",
    senderName: "Aminata Touré",
    senderId: "user-5",
    receiverName: "Ibrahim Koné",
    receiverId: "user-6",
    detectedType: "email",
    detectedPattern: "contact@email.com",
    rawContent: "Écrivez-moi à contact@email.com",
    severity: "low",
    action: "alert",
    isResolved: true,
    resolvedAt: new Date("2024-05-09T14:00:00"),
    createdAt: new Date("2024-05-09T12:00:00"),
    occurrenceCount: 1,
  },
];

const mockWarnings = [
  {
    id: "1",
    userName: "Moussa Diallo",
    userId: "user-7",
    warningType: "contact_share",
    severity: "formal",
    title: "Partage de contact détecté",
    message: "Vous avez tenté de partager un numéro de téléphone dans la messagerie. Cette pratique est interdite.",
    acknowledged: false,
    pointsDeducted: 50,
    cashbackForfeited: 2500,
    createdAt: new Date("2024-05-08T16:00:00"),
  },
  {
    id: "2",
    userName: "Fatou Bamba",
    userId: "user-8",
    warningType: "platform_leak",
    severity: "suspension",
    title: "Tentative de contournement de plateforme",
    message: "Tentative répétée de contournement de la plateforme. Votre compte a été suspendu temporairement.",
    acknowledged: true,
    acknowledgedAt: new Date("2024-05-07T10:00:00"),
    pointsDeducted: 100,
    cashbackForfeited: 10000,
    createdAt: new Date("2024-05-06T09:00:00"),
  },
];

const mockUserReports = [
  {
    id: "1",
    reporterName: "Marie Kouassi",
    reporterId: "user-2",
    reportedName: "Prestataire X",
    reportedId: "provider-1",
    reason: "fake_profile",
    description: "Ce prestataire utilise de fausses photos",
    status: "pending",
    createdAt: new Date("2024-05-10T08:00:00"),
  },
  {
    id: "2",
    reporterName: "Jean Yao",
    reporterId: "user-9",
    reportedName: "Prestataire Y",
    reportedId: "provider-2",
    reason: "harassment",
    description: "Comportement inapproprié",
    status: "reviewed",
    createdAt: new Date("2024-05-09T15:00:00"),
  },
];

const severityConfig = {
  low: {
    label: "Faible",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
  },
  medium: {
    label: "Moyenne",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
  high: {
    label: "Élevée",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
  },
};

const warningSeverityConfig = {
  soft: {
    label: "Avertissement",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
  },
  formal: {
    label: "Avertissement formel",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
  suspension: {
    label: "Suspension",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
};

const detectionTypeConfig = {
  phone: { label: "Téléphone", icon: Phone, color: "text-green-400" },
  whatsapp: { label: "WhatsApp", icon: MessageSquare, color: "text-green-500" },
  email: { label: "Email", icon: Mail, color: "text-blue-400" },
};

export default function ModerationDashboardPage() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDetection, setSelectedDetection] = useState<typeof mockContactDetections[0] | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter detections
  const filteredDetections = mockContactDetections.filter((detection) => {
    const matchesSearch =
      detection.senderName.toLowerCase().includes(search.toLowerCase()) ||
      detection.receiverName.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = severityFilter === "all" || detection.severity === severityFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && !detection.isResolved) ||
      (statusFilter === "resolved" && detection.isResolved);
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // Stats
  const stats = {
    pendingDetections: mockContactDetections.filter((d) => !d.isResolved).length,
    pendingWarnings: mockWarnings.filter((w) => !w.acknowledged).length,
    pendingReports: mockUserReports.filter((r) => r.status === "pending").length,
    resolvedToday: mockContactDetections.filter(
      (d) => d.isResolved && d.resolvedAt && new Date(d.resolvedAt).toDateString() === new Date().toDateString()
    ).length,
  };

  const handleResolve = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Resolved:", selectedDetection?.id, resolutionNote);
    setIsProcessing(false);
    setSelectedDetection(null);
    setResolutionNote("");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tableau de bord Modération</h1>
          <p className="text-gray-400 mt-1">Surveillance anti-fuite et modération des contenus</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.pendingDetections}</p>
                <p className="text-gray-400 text-sm">Détections en attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.pendingWarnings}</p>
                <p className="text-gray-400 text-sm">Avertissements non lus</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <FileWarning className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.pendingReports}</p>
                <p className="text-gray-400 text-sm">Signalements</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.resolvedToday}</p>
                <p className="text-gray-400 text-sm">Résolus aujourd&apos;hui</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="detections" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="detections" className="data-[state=active]:bg-primary">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Détections de contact
          </TabsTrigger>
          <TabsTrigger value="warnings" className="data-[state=active]:bg-primary">
            <ShieldAlert className="w-4 h-4 mr-2" />
            Avertissements
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-primary">
            <FileWarning className="w-4 h-4 mr-2" />
            Signalements
          </TabsTrigger>
        </TabsList>

        {/* Contact Detections Tab */}
        <TabsContent value="detections" className="space-y-6">
          {/* Filters */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par nom d'utilisateur..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-full lg:w-40 bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Gravité" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-40 bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="resolved">Résolus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Detections List */}
          <div className="space-y-4">
            {filteredDetections.map((detection) => {
              const severity = severityConfig[detection.severity as keyof typeof severityConfig];
              const typeConfig = detectionTypeConfig[detection.detectedType as keyof typeof detectionTypeConfig];
              const TypeIcon = typeConfig?.icon || Phone;

              return (
                <Card
                  key={detection.id}
                  className={cn(
                    "bg-gray-800/50 border-gray-700 transition-all hover:border-gray-600",
                    detection.isResolved && "opacity-60"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Type Icon */}
                      <div className={cn("p-3 rounded-lg", typeConfig?.color, "bg-gray-700/50")}>
                        <TypeIcon className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <Badge variant="outline" className={cn(severity.color, severity.bg, severity.border)}>
                            {severity.label}
                          </Badge>
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
                            {typeConfig?.label || detection.detectedType}
                          </Badge>
                          {detection.isResolved ? (
                            <Badge className="bg-emerald-500/20 text-emerald-400">Résolu</Badge>
                          ) : (
                            <Badge className="bg-amber-500/20 text-amber-400">En attente</Badge>
                          )}
                          {detection.occurrenceCount > 1 && (
                            <Badge className="bg-red-500/20 text-red-400">
                              Récidive ({detection.occurrenceCount}x)
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">De: </span>
                            <span className="text-white font-medium">{detection.senderName}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                          <div>
                            <span className="text-gray-400">À: </span>
                            <span className="text-white font-medium">{detection.receiverName}</span>
                          </div>
                        </div>

                        <div className="mt-2 p-2 bg-gray-900/50 rounded border border-gray-700 text-sm">
                          <p className="text-gray-300 font-mono break-all">"{detection.rawContent}"</p>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {detection.createdAt.toLocaleString("fr-FR")}
                          </div>
                          <div>
                            Pattern détecté: <code className="text-gray-400">{detection.detectedPattern}</code>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        {!detection.isResolved && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => setSelectedDetection(detection)}
                              className="bg-primary hover:bg-primary/90"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Examiner
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-700 text-gray-300 hover:bg-gray-700"
                            >
                              <Ban className="w-4 h-4 mr-1" />
                              Avertir
                            </Button>
                          </>
                        )}
                        {detection.isResolved && (
                          <span className="text-xs text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Résolu
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredDetections.length === 0 && (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="py-12 text-center text-gray-400">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Aucune détection à afficher</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Warnings Tab */}
        <TabsContent value="warnings" className="space-y-4">
          {mockWarnings.map((warning) => {
            const severity = warningSeverityConfig[warning.severity as keyof typeof warningSeverityConfig];

            return (
              <Card key={warning.id} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-lg", severity.bg)}>
                      <ShieldAlert className={cn("w-5 h-5", severity.color)} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <Badge variant="outline" className={cn(severity.color, severity.bg, severity.border)}>
                          {severity.label}
                        </Badge>
                        {warning.acknowledged ? (
                          <Badge className="bg-emerald-500/20 text-emerald-400">Acquitté</Badge>
                        ) : (
                          <Badge className="bg-amber-500/20 text-amber-400">Non acquitté</Badge>
                        )}
                      </div>

                      <p className="text-white font-medium">{warning.title}</p>
                      <p className="text-gray-400 text-sm mt-1">{warning.userName}</p>
                      <p className="text-gray-300 text-sm mt-2">{warning.message}</p>

                      <div className="flex items-center gap-4 mt-3 text-xs">
                        {warning.pointsDeducted > 0 && (
                          <span className="text-red-400">
                            -{warning.pointsDeducted} points
                          </span>
                        )}
                        {warning.cashbackForfeited > 0 && (
                          <span className="text-red-400">
                            -{warning.cashbackForfeited.toLocaleString('fr-FR')} FCFA cashback
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      {warning.createdAt.toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-transparent">
                    <TableHead className="text-gray-400">Signalé par</TableHead>
                    <TableHead className="text-gray-400">Contre</TableHead>
                    <TableHead className="text-gray-400">Raison</TableHead>
                    <TableHead className="text-gray-400">Statut</TableHead>
                    <TableHead className="text-gray-400">Date</TableHead>
                    <TableHead className="text-gray-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUserReports.map((report) => (
                    <TableRow key={report.id} className="border-gray-700">
                      <TableCell className="text-white">{report.reporterName}</TableCell>
                      <TableCell className="text-white">{report.reportedName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-gray-600 text-gray-300">
                          {report.reason}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            report.status === "pending"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-emerald-500/20 text-emerald-400"
                          )}
                        >
                          {report.status === "pending" ? "En attente" : "Examiné"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300 text-sm">
                        {report.createdAt.toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" className="text-primary">
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resolution Dialog */}
      <Dialog open={!!selectedDetection} onOpenChange={(open) => !open && setSelectedDetection(null)}>
        <DialogContent className="max-w-lg bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Résoudre la détection</DialogTitle>
            <DialogDescription className="text-gray-400">
              Examinez et résolvez cette alerte de détection de contact.
            </DialogDescription>
          </DialogHeader>

          {selectedDetection && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400 mb-1">Message détecté:</p>
                <p className="text-white font-mono text-sm">"{selectedDetection.rawContent}"</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Expéditeur</p>
                  <p className="text-white font-medium">{selectedDetection.senderName}</p>
                </div>
                <div>
                  <p className="text-gray-400">Destinataire</p>
                  <p className="text-white font-medium">{selectedDetection.receiverName}</p>
                </div>
                <div>
                  <p className="text-gray-400">Occurrences</p>
                  <p className="text-white font-medium">{selectedDetection.occurrenceCount}</p>
                </div>
                <div>
                  <p className="text-gray-400">Gravité</p>
                  <p className="text-white font-medium capitalize">{selectedDetection.severity}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Note de résolution</Label>
                <Textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Décrivez l'action prise ou la raison de la résolution..."
                  className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setSelectedDetection(null)}
              className="text-gray-400"
            >
              Annuler
            </Button>
            <Button
              onClick={handleResolve}
              disabled={isProcessing}
              className="bg-primary hover:bg-primary/90"
            >
              {isProcessing ? "Résolution..." : "Marquer comme résolu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
