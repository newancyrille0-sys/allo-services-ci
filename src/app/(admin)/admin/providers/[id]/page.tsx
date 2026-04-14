"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Ban,
  Lock,
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  FileText,
  MessageSquare,
  ShieldAlert,
  ExternalLink,
  Crown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { KYCDocumentViewer, type KYCDocument, ProviderTierManager, PaymentControlManager } from "@/components/admin";
import { SubscriptionBadge } from "@/components/providers/SubscriptionBadge";
import { TrustScore } from "@/components/providers/TrustScore";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { cn } from "@/lib/utils";

// Mock provider data
const mockProvider = {
  id: "1",
  businessName: "Électro Services Plus",
  ownerName: "Kouadio Emmanuel",
  email: "electro.services@gmail.com",
  phone: "+225 07 58 92 34 12",
  city: "Abidjan",
  address: "Cocody, Rue des Jardins",
  description: "Service professionnel d'installation et réparation électrique. Plus de 10 ans d'expérience.",
  avatarUrl: "https://i.pravatar.cc/150?img=11",
  subscriptionPlan: "PREMIUM" as const,
  kycStatus: "PENDING" as const,
  status: "ACTIVE" as const,
  rating: 4.8,
  totalReservations: 156,
  totalReviews: 89,
  trustScore: 92,
  hourlyRate: 15000,
  categories: ["Électricité", "Installation électrique", "Dépannage"],
  createdAt: new Date("2023-08-15"),
  lastActive: new Date("2024-05-10"),
};

// Mock KYC documents
const mockKYCDocuments: KYCDocument[] = [
  {
    id: "1",
    type: "cni",
    label: "Carte Nationale d'Identité",
    url: "https://placehold.co/600x400/1a1a1a/ffffff?text=CNI+Recto",
    status: "pending",
  },
  {
    id: "2",
    type: "cni",
    label: "CNI - Verso",
    url: "https://placehold.co/600x400/1a1a1a/ffffff?text=CNI+Verso",
    status: "pending",
  },
  {
    id: "3",
    type: "registre",
    label: "Registre de Commerce",
    url: "https://placehold.co/600x400/1a1a1a/ffffff?text=Registre+Commerce",
    status: "pending",
  },
  {
    id: "4",
    type: "photo",
    label: "Photo de profil",
    url: "https://placehold.co/400x400/1a1a1a/ffffff?text=Photo",
    status: "pending",
  },
];

// Mock reservations
const mockReservations = [
  {
    id: "R001",
    clientName: "Marie Kouassi",
    service: "Installation électrique",
    date: new Date("2024-05-08"),
    status: "COMPLETED",
    price: 45000,
  },
  {
    id: "R002",
    clientName: "Jean Yao",
    service: "Dépannage",
    date: new Date("2024-05-05"),
    status: "COMPLETED",
    price: 25000,
  },
  {
    id: "R003",
    clientName: "Awa Diallo",
    service: "Installation prise",
    date: new Date("2024-05-12"),
    status: "CONFIRMED",
    price: 15000,
  },
];

// Mock reviews
const mockReviews = [
  {
    id: "1",
    clientName: "Marie Kouassi",
    rating: 5,
    comment: "Excellent travail, très professionnel et ponctuel. Je recommande vivement !",
    date: new Date("2024-05-08"),
    service: "Installation électrique",
  },
  {
    id: "2",
    clientName: "Jean Yao",
    rating: 4,
    comment: "Bon travail, un peu de retard mais le résultat est satisfaisant.",
    date: new Date("2024-05-05"),
    service: "Dépannage",
  },
];

// Mock fraud alerts
const mockFraudAlerts = [
  {
    id: "1",
    type: "suspicious_payment",
    description: "Tentative de paiement avec carte volée détectée",
    date: new Date("2024-04-20"),
    status: "resolved",
  },
];

// Mock subscription history
const subscriptionHistory = [
  {
    id: "1",
    plan: "PREMIUM",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    amount: 500000,
    status: "active",
  },
  {
    id: "2",
    plan: "MONTHLY",
    startDate: new Date("2023-08-15"),
    endDate: new Date("2023-12-31"),
    amount: 180000,
    status: "expired",
  },
];

export default function AdminProviderDetailPage() {
  const params = useParams();
  const providerId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [actionDialog, setActionDialog] = useState<"suspend" | "ban" | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<string>("PREMIUM");

  const handleKYCApprove = async (documentId: string) => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Approved document ${documentId}`);
    setIsProcessing(false);
  };

  const handleKYCReject = async (documentId: string, reason: string) => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Rejected document ${documentId}: ${reason}`);
    setIsProcessing(false);
  };

  const handleAction = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setActionDialog(null);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild className="text-gray-400 hover:text-white">
          <Link href="/admin/providers">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux prestataires
          </Link>
        </Button>
      </div>

      {/* Provider Header */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Avatar and Info */}
            <div className="flex items-start gap-4 flex-1">
              <Avatar className="w-20 h-20 border-2 border-primary/30">
                <AvatarImage src={mockProvider.avatarUrl || ""} />
                <AvatarFallback className="bg-gray-700 text-white text-xl">
                  {mockProvider.businessName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-white">{mockProvider.businessName}</h1>
                  <SubscriptionBadge status={mockProvider.subscriptionPlan} />
                  <Badge
                    className={cn(
                      mockProvider.status === "ACTIVE"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    )}
                  >
                    {mockProvider.status === "ACTIVE" ? "Actif" : "En attente"}
                  </Badge>
                </div>
                <p className="text-gray-400 mt-1">{mockProvider.ownerName}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {mockProvider.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {mockProvider.phone}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {mockProvider.city}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-amber-400">
                  <Star className="w-5 h-5 fill-amber-400" />
                  <span className="text-2xl font-bold text-white">{mockProvider.rating}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Note moyenne</p>
              </div>
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <p className="text-2xl font-bold text-white">{mockProvider.totalReservations}</p>
                <p className="text-xs text-gray-400 mt-1">Réservations</p>
              </div>
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <p className="text-2xl font-bold text-white">{mockProvider.totalReviews}</p>
                <p className="text-xs text-gray-400 mt-1">Avis</p>
              </div>
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <TrustScore score={mockProvider.trustScore} size="sm" showLabel />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-700"
                onClick={() => setActionDialog("suspend")}
              >
                <Ban className="w-4 h-4 mr-2" />
                Suspendre
              </Button>
              <Button
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                onClick={() => setActionDialog("ban")}
              >
                <Ban className="w-4 h-4 mr-2" />
                Bannir
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-700"
              >
                <Lock className="w-4 h-4 mr-2" />
                Reset mot de passe
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700 flex-wrap">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary">
            Vue d&apos;ensemble
          </TabsTrigger>
          <TabsTrigger value="tier" className="data-[state=active]:bg-primary">
            <Crown className="w-4 h-4 mr-1" />
            Niveau
          </TabsTrigger>
          <TabsTrigger value="payment" className="data-[state=active]:bg-primary">
            <CreditCard className="w-4 h-4 mr-1" />
            Paiements
          </TabsTrigger>
          <TabsTrigger value="kyc" className="data-[state=active]:bg-primary">
            Documents KYC
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="data-[state=active]:bg-primary">
            Abonnements
          </TabsTrigger>
          <TabsTrigger value="reservations" className="data-[state=active]:bg-primary">
            Réservations
          </TabsTrigger>
          <TabsTrigger value="reviews" className="data-[state=active]:bg-primary">
            Avis
          </TabsTrigger>
          {mockFraudAlerts.length > 0 && (
            <TabsTrigger value="fraud" className="data-[state=active]:bg-primary text-red-400">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Alertes
            </TabsTrigger>
          )}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* About */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">À propos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">{mockProvider.description}</p>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Services proposés</p>
                  <div className="flex flex-wrap gap-2">
                    {mockProvider.categories.map((cat) => (
                      <Badge key={cat} variant="outline" className="border-gray-600 text-gray-300">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                  <div>
                    <p className="text-gray-400 text-sm">Tarif horaire</p>
                    <p className="text-white font-semibold">{formatPrice(mockProvider.hourlyRate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Membre depuis</p>
                    <p className="text-white font-semibold">
                      {mockProvider.createdAt.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Dernière activité</p>
                    <p className="text-white font-semibold">
                      {mockProvider.lastActive.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Adresse</p>
                    <p className="text-white font-semibold">{mockProvider.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-emerald-400 mb-2" />
                    <p className="text-2xl font-bold text-white">92%</p>
                    <p className="text-xs text-gray-400">Taux de complétion</p>
                  </div>
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <Clock className="w-5 h-5 text-primary mb-2" />
                    <p className="text-2xl font-bold text-white">&lt; 2h</p>
                    <p className="text-xs text-gray-400">Temps de réponse</p>
                  </div>
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mb-2" />
                    <p className="text-2xl font-bold text-white">98%</p>
                    <p className="text-xs text-gray-400">Clients satisfaits</p>
                  </div>
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-amber-400 mb-2" />
                    <p className="text-2xl font-bold text-white">12</p>
                    <p className="text-xs text-gray-400">Réservations ce mois</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reservations */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white text-lg">Réservations récentes</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary"
                onClick={() => setActiveTab("reservations")}
              >
                Voir tout
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-transparent">
                    <TableHead className="text-gray-400">Client</TableHead>
                    <TableHead className="text-gray-400">Service</TableHead>
                    <TableHead className="text-gray-400">Date</TableHead>
                    <TableHead className="text-gray-400">Statut</TableHead>
                    <TableHead className="text-gray-400 text-right">Montant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReservations.slice(0, 5).map((reservation) => (
                    <TableRow key={reservation.id} className="border-gray-700">
                      <TableCell className="text-white">{reservation.clientName}</TableCell>
                      <TableCell className="text-gray-300">{reservation.service}</TableCell>
                      <TableCell className="text-gray-300">
                        {reservation.date.toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            reservation.status === "COMPLETED"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-primary/20 text-primary"
                          )}
                        >
                          {reservation.status === "COMPLETED" ? "Terminé" : "Confirmé"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-white">
                        {formatPrice(reservation.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tier Management Tab */}
        <TabsContent value="tier">
          <ProviderTierManager
            provider={{
              id: mockProvider.id,
              businessName: mockProvider.businessName,
              providerTier: "PREMIUM",
              tierExpiresAt: null,
              user: {
                id: "user-1",
                fullName: mockProvider.ownerName,
                email: mockProvider.email,
              },
            }}
            currentTierConfig={{
              tier: "PREMIUM",
              monthlyPrice: 25000,
              yearlyPrice: 250000,
              commissionRate: 0.12,
              maxPublications: 25,
              maxLives: 10,
              maxServices: 10,
              canViewPhone: true,
              canPriority: true,
              canAnalytics: true,
              canPromo: true,
              canInvoice: true,
              canInsurance: true,
              visibilityBoost: 2.0,
              badgeColor: "#F59E0B",
              badgeIcon: "premium",
            }}
            onTierChange={async (tier, expiresAt, reason) => {
              console.log("Tier change:", { tier, expiresAt, reason });
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }}
          />
        </TabsContent>

        {/* Payment Control Tab */}
        <TabsContent value="payment">
          <PaymentControlManager
            provider={{
              id: mockProvider.id,
              businessName: mockProvider.businessName,
              user: {
                id: "user-1",
                fullName: mockProvider.ownerName,
              },
            }}
            paymentMethods={[
              { id: "orange_money", label: "Orange Money", isEnabled: true, controlId: null, disabledAt: null, disabledReason: null, disabledById: null },
              { id: "mtn_money", label: "MTN Money", isEnabled: true, controlId: null, disabledAt: null, disabledReason: null, disabledById: null },
              { id: "wave", label: "Wave", isEnabled: true, controlId: null, disabledAt: null, disabledReason: null, disabledById: null },
              { id: "moov", label: "Moov Money", isEnabled: false, controlId: "ctrl-1", disabledAt: new Date("2024-03-01"), disabledReason: "Problème technique", disabledById: "admin-1" },
              { id: "card", label: "Carte bancaire", isEnabled: true, controlId: null, disabledAt: null, disabledReason: null, disabledById: null },
              { id: "cash", label: "Espèces", isEnabled: true, controlId: null, disabledAt: null, disabledReason: null, disabledById: null },
            ]}
            stats={{ total: 6, enabled: 5, disabled: 1 }}
            onToggleMethod={async (method, enabled, reason) => {
              console.log("Toggle method:", { method, enabled, reason });
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }}
            onBulkUpdate={async (methods, reason) => {
              console.log("Bulk update:", { methods, reason });
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }}
          />
        </TabsContent>

        {/* KYC Documents Tab */}
        <TabsContent value="kyc">
          <KYCDocumentViewer
            documents={mockKYCDocuments}
            onApprove={handleKYCApprove}
            onReject={handleKYCReject}
            isProcessing={isProcessing}
          />
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white text-lg">Modifier l&apos;abonnement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Label className="text-gray-300">Plan d&apos;abonnement</Label>
                  <Select value={selectedSubscription} onValueChange={setSelectedSubscription}>
                    <SelectTrigger className="mt-2 bg-gray-900 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="FREE">Gratuit</SelectItem>
                      <SelectItem value="MONTHLY">Standard - 15 000 XOF/mois</SelectItem>
                      <SelectItem value="PREMIUM">Premium - 50 000 XOF/an</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="bg-primary hover:bg-primary/90">Enregistrer</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Historique des abonnements</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-transparent">
                    <TableHead className="text-gray-400">Plan</TableHead>
                    <TableHead className="text-gray-400">Début</TableHead>
                    <TableHead className="text-gray-400">Fin</TableHead>
                    <TableHead className="text-gray-400">Montant</TableHead>
                    <TableHead className="text-gray-400">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptionHistory.map((sub) => (
                    <TableRow key={sub.id} className="border-gray-700">
                      <TableCell>
                        <SubscriptionBadge status={sub.plan as "FREE" | "MONTHLY" | "PREMIUM"} size="sm" />
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {sub.startDate.toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {sub.endDate.toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell className="text-white">{formatPrice(sub.amount)}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            sub.status === "active"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-gray-500/20 text-gray-400"
                          )}
                        >
                          {sub.status === "active" ? "Actif" : "Expiré"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reservations Tab */}
        <TabsContent value="reservations">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Toutes les réservations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-transparent">
                    <TableHead className="text-gray-400">ID</TableHead>
                    <TableHead className="text-gray-400">Client</TableHead>
                    <TableHead className="text-gray-400">Service</TableHead>
                    <TableHead className="text-gray-400">Date</TableHead>
                    <TableHead className="text-gray-400">Statut</TableHead>
                    <TableHead className="text-gray-400 text-right">Montant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReservations.map((reservation) => (
                    <TableRow key={reservation.id} className="border-gray-700 hover:bg-gray-700/30">
                      <TableCell className="text-gray-300 font-mono">{reservation.id}</TableCell>
                      <TableCell className="text-white">{reservation.clientName}</TableCell>
                      <TableCell className="text-gray-300">{reservation.service}</TableCell>
                      <TableCell className="text-gray-300">
                        {reservation.date.toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            reservation.status === "COMPLETED"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-primary/20 text-primary"
                          )}
                        >
                          {reservation.status === "COMPLETED" ? "Terminé" : "Confirmé"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-white">
                        {formatPrice(reservation.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-4">
          {mockReviews.map((review) => (
            <ReviewCard
              key={review.id}
              clientName={review.clientName}
              rating={review.rating}
              comment={review.comment}
              date={review.date}
              serviceName={review.service}
            />
          ))}
        </TabsContent>

        {/* Fraud Alerts Tab */}
        <TabsContent value="fraud">
          <Card className="bg-gray-800/50 border-gray-700 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                Alertes de fraude
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockFraudAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                >
                  <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-white font-medium">{alert.type}</p>
                    <p className="text-gray-400 text-sm mt-1">{alert.description}</p>
                    <p className="text-gray-500 text-xs mt-2">
                      {alert.date.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400">Résolu</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Dialogs */}
      <Dialog open={!!actionDialog} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent className="max-w-md bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {actionDialog === "suspend" && "Suspendre le prestataire"}
              {actionDialog === "ban" && "Bannir le prestataire"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {actionDialog === "suspend" &&
                `Êtes-vous sûr de vouloir suspendre ${mockProvider.businessName} ? Le prestataire ne pourra plus recevoir de réservations.`}
              {actionDialog === "ban" &&
                `Êtes-vous sûr de vouloir bannir définitivement ${mockProvider.businessName} ? Cette action est irréversible.`}
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
                actionDialog === "suspend" && "bg-amber-600 hover:bg-amber-700"
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
