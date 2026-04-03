"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Star,
  Check,
  X,
  Edit,
  Trash2,
  User,
  Wallet,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PaymentModal } from "@/components/payment/PaymentModal";

// Mock reservation data
const MOCK_RESERVATION = {
  id: "res-1",
  status: "CONFIRMED",
  scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
  address: "Cocody, Rue des Jardins, Maison 45",
  city: "Abidjan",
  phoneContact: "+225 07 00 00 00 00",
  notes: "Intervention pour une fuite d'eau dans la salle de bain. Le robinet principal est également à vérifier.",
  priceTotal: 25000,
  paymentStatus: "pending",
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  service: { id: "s1", name: "Plomberie", description: "Réparation et installation sanitaire" },
  provider: {
    id: "provider-1",
    businessName: "Plomberie Express Abidjan",
    description: "Expert en plomberie et sanitaires. Intervention rapide 7j/7 sur Abidjan et environs.",
    user: { fullName: "Koffi Yao", phone: "+225 07 12 34 56 78", avatarUrl: undefined },
    averageRating: 4.9,
    totalReviews: 127,
    trustScore: 95,
    subscriptionStatus: "PREMIUM",
    badgeVerified: true,
  },
  client: {
    id: "client-1",
    fullName: "Amadou Koné",
    phone: "+225 07 00 00 00 00",
  },
};

const STATUS_TIMELINE = [
  { status: "PENDING", label: "En attente", icon: Clock },
  { status: "CONFIRMED", label: "Confirmée", icon: Check },
  { status: "IN_PROGRESS", label: "En cours", icon: Loader2 },
  { status: "COMPLETED", label: "Terminée", icon: CheckCircle },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: "En attente", color: "text-amber-700", bgColor: "bg-amber-100 border-amber-200" },
  CONFIRMED: { label: "Confirmée", color: "text-blue-700", bgColor: "bg-blue-100 border-blue-200" },
  IN_PROGRESS: { label: "En cours", color: "text-purple-700", bgColor: "bg-purple-100 border-purple-200" },
  COMPLETED: { label: "Terminée", color: "text-emerald-700", bgColor: "bg-emerald-100 border-emerald-200" },
  CANCELLED: { label: "Annulée", color: "text-red-700", bgColor: "bg-red-100 border-red-200" },
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-CI", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ReservationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reservationId = params.id as string;

  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [isCancelling, setIsCancelling] = React.useState(false);

  const reservation = MOCK_RESERVATION;
  const status = statusConfig[reservation.status] || statusConfig.PENDING;

  const canModify = ["PENDING", "CONFIRMED"].includes(reservation.status);
  const canCancel = ["PENDING", "CONFIRMED"].includes(reservation.status);
  const canReview = reservation.status === "COMPLETED";
  const needsPayment = reservation.paymentStatus === "pending";

  const handleCancel = async () => {
    setIsCancelling(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsCancelling(false);
    router.push("/client/reservations");
  };

  const handlePaymentSuccess = (transactionId: string) => {
    console.log("Payment successful:", transactionId);
    setShowPaymentModal(false);
    // Refresh reservation data
  };

  const getTimelineStatus = (stepStatus: string) => {
    const statusOrder = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED"];
    const currentIndex = statusOrder.indexOf(reservation.status);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (reservation.status === "CANCELLED") {
      return stepStatus === "PENDING" ? "completed" : "cancelled";
    }

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{reservation.service.name}</h1>
            <Badge className={status.color + " " + status.bgColor}>
              {status.label}
            </Badge>
          </div>
          <p className="text-muted-foreground">Réservation #{reservationId}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Timeline */}
          <Card className="border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-base">Statut de la réservation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {STATUS_TIMELINE.map((step, index) => {
                  const timelineStatus = getTimelineStatus(step.status);
                  const Icon = step.icon;

                  return (
                    <React.Fragment key={step.status}>
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            timelineStatus === "completed"
                              ? "bg-primary text-primary-foreground"
                              : timelineStatus === "current"
                              ? "bg-primary text-primary-foreground animate-pulse"
                              : timelineStatus === "cancelled"
                              ? "bg-red-200 text-red-600"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${timelineStatus === "current" ? "animate-spin" : ""}`} />
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            timelineStatus === "current"
                              ? "text-primary"
                              : timelineStatus === "cancelled"
                              ? "text-red-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {index < STATUS_TIMELINE.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-2 ${
                            timelineStatus === "completed"
                              ? "bg-primary"
                              : "bg-muted"
                          }`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card className="border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-base">Détails du service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {formatDate(reservation.scheduledDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Heure</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(reservation.scheduledDate)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Adresse</p>
                  <p className="text-sm text-muted-foreground">
                    {reservation.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {reservation.city}
                  </p>
                </div>
              </div>

              {reservation.notes && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Notes</p>
                      <p className="text-sm text-muted-foreground">
                        {reservation.notes}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Price Breakdown */}
          <Card className="border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-base">Détails du paiement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service {reservation.service.name}</span>
                <span>{formatPrice(reservation.priceTotal - 2000)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frais de service</span>
                <span>{formatPrice(2000)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-primary text-lg">
                  {formatPrice(reservation.priceTotal)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={reservation.paymentStatus === "paid" ? "default" : "secondary"}
                  className={reservation.paymentStatus === "paid" ? "bg-emerald-500" : ""}
                >
                  {reservation.paymentStatus === "paid" ? "Payé" : "En attente de paiement"}
                </Badge>
                {needsPayment && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Payer maintenant
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="border-gray-200/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Messages</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/client/messages?provider=${reservation.provider.id}`}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ouvrir la conversation
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun message pour le moment
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Provider Card */}
          <Card className="border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-base">Prestataire</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={reservation.provider.user.avatarUrl} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {reservation.provider.businessName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">
                    {reservation.provider.businessName}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {reservation.provider.user.fullName}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">
                      {reservation.provider.averageRating}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({reservation.provider.totalReviews} avis)
                    </span>
                  </div>
                </div>
              </div>

              {reservation.provider.badgeVerified && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Vérifié
                </Badge>
              )}

              <Separator />

              <div className="space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/providers/${reservation.provider.id}`}>
                    Voir le profil
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href={`tel:${reservation.provider.user.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/client/messages?provider=${reservation.provider.id}`}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Envoyer un message
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card className="border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {canModify && (
                <Button variant="outline" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              )}
              {canReview && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/client/reservations/${reservation.id}/review`}>
                    <Star className="h-4 w-4 mr-2" />
                    Laisser un avis
                  </Link>
                </Button>
              )}
              {canCancel && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full text-destructive hover:text-destructive"
                      disabled={isCancelling}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Annuler la réservation
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Annuler la réservation ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Non, garder</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleCancel}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Oui, annuler
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={reservation.priceTotal}
        paymentType="reservation"
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
