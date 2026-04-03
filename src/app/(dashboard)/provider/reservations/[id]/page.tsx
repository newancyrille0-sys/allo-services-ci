"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  Phone,
  MapPin,
  Clock,
  Calendar,
  User,
  MessageSquare,
  Check,
  X,
  Play,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  FileText,
  ExternalLink,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
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
import { formatPrice, formatDate, formatTime, getRelativeTime } from "@/lib/utils/formatters";

// Types
type ReservationStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

interface Message {
  id: string;
  content: string;
  sender: "provider" | "client";
  createdAt: Date;
  isRead: boolean;
}

// Mock data
const MOCK_RESERVATION = {
  id: "res-1",
  status: "PENDING" as ReservationStatus,
  client: {
    id: "client-1",
    name: "Amadou Koné",
    phone: "+225 07 08 09 10 11",
    email: "amadou.kone@email.com",
    avatar: undefined,
    totalReservations: 12,
    memberSince: new Date("2023-06-15"),
  },
  service: {
    name: "Plomberie",
    category: "Bricolage & Réparations",
    description: "Intervention pour fuites, installations et dépannages sanitaires",
    duration: 60,
  },
  scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
  scheduledTime: "09:00",
  address: "Cocody, Rue des Jardins, Villa 45",
  city: "Abidjan",
  notes: "Fuite d'eau dans la cuisine, intervention urgente demandée. Le client a mentionné que l'eau coule depuis ce matin.",
  priceBase: 20000,
  priceFee: 5000,
  priceTotal: 25000,
  paymentStatus: "PENDING" as const,
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  updatedAt: new Date(Date.now() - 1000 * 60 * 60),
};

const MOCK_MESSAGES: Message[] = [
  {
    id: "msg-1",
    content: "Bonjour, j'ai une fuite d'eau urgente dans ma cuisine. Pouvez-vous intervenir demain matin ?",
    sender: "client",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    isRead: true,
  },
  {
    id: "msg-2",
    content: "Bonjour Monsieur Koné, oui je suis disponible demain à 9h. Je viendrai avec tout le matériel nécessaire pour réparer la fuite.",
    sender: "provider",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
    isRead: true,
  },
  {
    id: "msg-3",
    content: "Parfait, je vous attends donc demain à 9h. L'adresse est Cocody, Rue des Jardins, Villa 45.",
    sender: "client",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: true,
  },
];

const STATUS_CONFIG: Record<ReservationStatus, { label: string; color: string; bgColor: string; progress: number }> = {
  PENDING: { label: "En attente", color: "text-amber-600", bgColor: "bg-amber-100", progress: 20 },
  CONFIRMED: { label: "Confirmée", color: "text-primary", bgColor: "bg-primary/10", progress: 40 },
  IN_PROGRESS: { label: "En cours", color: "text-emerald-600", bgColor: "bg-emerald-100", progress: 60 },
  COMPLETED: { label: "Terminée", color: "text-gray-600", bgColor: "bg-gray-100", progress: 100 },
  CANCELLED: { label: "Annulée", color: "text-red-600", bgColor: "bg-red-100", progress: 0 },
};

const STATUS_TIMELINE = [
  { status: "PENDING", label: "Demande reçue", icon: FileText },
  { status: "CONFIRMED", label: "Confirmée", icon: Check },
  { status: "IN_PROGRESS", label: "En cours", icon: Play },
  { status: "COMPLETED", label: "Terminée", icon: CheckCircle },
];

export default function ProviderReservationDetailPage() {
  const params = useParams();
  const reservationId = params.id as string;

  const [reservation, setReservation] = React.useState(MOCK_RESERVATION);
  const [messages, setMessages] = React.useState(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = React.useState("");

  const statusConfig = STATUS_CONFIG[reservation.status];

  const handleStatusChange = (newStatus: ReservationStatus) => {
    setReservation((prev) => ({ ...prev, status: newStatus }));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage.trim(),
      sender: "provider",
      createdAt: new Date(),
      isRead: false,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const getTimelineStatus = (status: string) => {
    const statusOrder = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED"];
    const currentIndex = statusOrder.indexOf(reservation.status);
    const statusIndex = statusOrder.indexOf(status);

    if (reservation.status === "CANCELLED") {
      return status === "PENDING" ? "completed" : "cancelled";
    }

    if (statusIndex < currentIndex) return "completed";
    if (statusIndex === currentIndex) return "current";
    return "pending";
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/provider/reservations" className="hover:text-primary">
          Réservations
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">
          Réservation #{reservationId}
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Réservation #{reservationId}</h1>
            <Badge className={`${statusConfig.bgColor} ${statusConfig.color}`}>
              {statusConfig.label}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Créée {getRelativeTime(reservation.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          {reservation.status === "PENDING" && (
            <>
              <Button onClick={() => handleStatusChange("CONFIRMED")}>
                <Check className="h-4 w-4 mr-2" />
                Accepter
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <X className="h-4 w-4 mr-2" />
                    Refuser
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Refuser la réservation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir refuser cette réservation ? Le client sera notifié.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleStatusChange("CANCELLED")}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Refuser
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          {reservation.status === "CONFIRMED" && (
            <Button onClick={() => handleStatusChange("IN_PROGRESS")}>
              <Play className="h-4 w-4 mr-2" />
              Démarrer le service
            </Button>
          )}
          {reservation.status === "IN_PROGRESS" && (
            <Button onClick={() => handleStatusChange("COMPLETED")}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Marquer comme terminée
            </Button>
          )}
        </div>
      </div>

      {/* Status Timeline */}
      <Card className="border-gray-200/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {STATUS_TIMELINE.map((item, index) => {
              const timelineStatus = getTimelineStatus(item.status);
              return (
                <React.Fragment key={item.status}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        timelineStatus === "completed"
                          ? "bg-primary text-primary-foreground"
                          : timelineStatus === "current"
                          ? "bg-primary/10 text-primary ring-2 ring-primary"
                          : timelineStatus === "cancelled"
                          ? "bg-red-100 text-red-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                    </div>
                    <p
                      className={`text-xs mt-2 ${
                        timelineStatus === "current"
                          ? "font-medium text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </p>
                  </div>
                  {index < STATUS_TIMELINE.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded ${
                        timelineStatus === "completed" ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information */}
          <Card className="border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-base">Informations client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={reservation.client.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {reservation.client.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{reservation.client.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <a
                      href={`tel:${reservation.client.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                    >
                      <Phone className="h-4 w-4" />
                      {reservation.client.phone}
                    </a>
                    <span className="text-sm text-muted-foreground">
                      {reservation.client.totalReservations} réservation(s)
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" asChild>
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
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card className="border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-base">Détails du service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{reservation.service.name}</p>
                  <p className="text-sm text-muted-foreground">{reservation.service.category}</p>
                </div>
                <Badge variant="outline">{reservation.service.duration} min</Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{formatDate(reservation.scheduledDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Heure</p>
                    <p className="font-medium">{reservation.scheduledTime}</p>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Adresse</p>
                  <p className="font-medium">{reservation.address}</p>
                  <p className="text-sm text-muted-foreground">{reservation.city}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${reservation.address}, ${reservation.city}, Côte d'Ivoire`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1"
                  >
                    Voir sur Google Maps
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {reservation.notes && (
            <Card className="border-gray-200/50">
              <CardHeader>
                <CardTitle className="text-base">Notes du client</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{reservation.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Message Thread */}
          <Card className="border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-base">Messages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "provider" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "provider"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "provider"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {getRelativeTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Écrivez votre message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Price Breakdown */}
          <Card className="border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-base">Détail du prix</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service de base</span>
                <span>{formatPrice(reservation.priceBase)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frais de service</span>
                <span>{formatPrice(reservation.priceFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span className="text-lg">{formatPrice(reservation.priceTotal)}</span>
              </div>
              <Badge
                variant={reservation.paymentStatus === "PAID" ? "default" : "secondary"}
                className="w-full justify-center"
              >
                {reservation.paymentStatus === "PAID" ? "Payé" : "En attente de paiement"}
              </Badge>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {reservation.status !== "CANCELLED" && reservation.status !== "COMPLETED" && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`tel:${reservation.client.phone.replace(/\s/g, "")}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler le client
                  </a>
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/provider/messages?client=${reservation.client.id}`}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Envoyer un message
                </Link>
              </Button>
              {reservation.status === "COMPLETED" && (
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Demander le paiement
                </Button>
              )}
              {reservation.status !== "CANCELLED" && reservation.status !== "COMPLETED" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-destructive">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Signaler un problème
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Signaler un problème</AlertDialogTitle>
                      <AlertDialogDescription>
                        Décrivez le problème rencontré avec cette réservation. Notre équipe vous contactera dans les plus brefs délais.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction>Signaler</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardContent>
          </Card>

          {/* History */}
          <Card className="border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-base">Historique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                  <div>
                    <p>Réservation créée</p>
                    <p className="text-muted-foreground">{getRelativeTime(reservation.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground mt-1.5" />
                  <div>
                    <p>Dernière mise à jour</p>
                    <p className="text-muted-foreground">{getRelativeTime(reservation.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
