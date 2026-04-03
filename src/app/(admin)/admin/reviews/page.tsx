"use client";

import { useState } from "react";
import {
  Search,
  Star,
  MessageSquare,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Flag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { AdminStatsCard } from "@/components/admin";
import { cn } from "@/lib/utils";

// Mock reviews data
const mockReviews = [
  {
    id: "1",
    clientName: "Marie Kouassi",
    clientAvatar: null,
    providerName: "Électro Services Plus",
    rating: 5,
    comment: "Excellent travail, très professionnel et ponctuel. Je recommande vivement ! Le technicien a pris le temps de tout expliquer.",
    date: new Date("2024-05-08"),
    status: "visible",
    reported: false,
    service: "Installation électrique",
  },
  {
    id: "2",
    clientName: "Jean Yao",
    clientAvatar: null,
    providerName: "Plomberie Express",
    rating: 4,
    comment: "Bon travail, un peu de retard mais le résultat est satisfaisant.",
    date: new Date("2024-05-05"),
    status: "visible",
    reported: false,
    service: "Réparation fuite",
  },
  {
    id: "3",
    clientName: "Awa Diallo",
    clientAvatar: null,
    providerName: "Ménage Pro",
    rating: 1,
    comment: "Très déçue, le travail n'a pas été fait correctement. Je ne recommande pas du tout !!!",
    date: new Date("2024-05-03"),
    status: "visible",
    reported: true,
    reportReason: "Avis potentiellement faux",
    service: "Grand ménage",
  },
  {
    id: "4",
    clientName: "Ibrahim Koné",
    clientAvatar: null,
    providerName: "Climatisation Expert",
    rating: 2,
    comment: "Prix trop élevé pour le service rendu.",
    date: new Date("2024-05-01"),
    status: "hidden",
    reported: true,
    reportReason: "Spam",
    service: "Installation climatisation",
  },
  {
    id: "5",
    clientName: "Fatou Bamba",
    clientAvatar: null,
    providerName: "Jardinage Vert",
    rating: 5,
    comment: "Super travail ! Mon jardin n'a jamais été aussi beau. Merci !",
    date: new Date("2024-04-28"),
    status: "visible",
    reported: false,
    service: "Taille de haie",
  },
];

export default function AdminReviewsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [reportedFilter, setReportedFilter] = useState<string>("all");
  const [selectedReview, setSelectedReview] = useState<typeof mockReviews[0] | null>(null);
  const [actionDialog, setActionDialog] = useState<"hide" | "delete" | "respond" | null>(null);
  const [response, setResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter reviews
  const filteredReviews = mockReviews.filter((review) => {
    const matchesSearch =
      review.clientName.toLowerCase().includes(search.toLowerCase()) ||
      review.providerName.toLowerCase().includes(search.toLowerCase()) ||
      review.comment.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    const matchesReported = reportedFilter === "all" ||
      (reportedFilter === "reported" && review.reported) ||
      (reportedFilter === "not_reported" && !review.reported);
    return matchesSearch && matchesStatus && matchesReported;
  });

  // Stats
  const stats = {
    total: mockReviews.length,
    averageRating: (
      mockReviews.reduce((acc, r) => acc + r.rating, 0) / mockReviews.length
    ).toFixed(1),
    reported: mockReviews.filter((r) => r.reported).length,
    hidden: mockReviews.filter((r) => r.status === "hidden").length,
  };

  const handleAction = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsProcessing(false);
    setActionDialog(null);
    setSelectedReview(null);
    setResponse("");
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-4 h-4",
              star <= rating
                ? "text-amber-400 fill-amber-400"
                : "text-gray-600"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Modération des avis</h1>
          <p className="text-gray-400 mt-1">Gérez les avis clients</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdminStatsCard
          icon={MessageSquare}
          label="Total avis"
          value={stats.total}
          variant="default"
        />
        <AdminStatsCard
          icon={Star}
          label="Note moyenne"
          value={stats.averageRating}
          variant="warning"
        />
        <AdminStatsCard
          icon={Flag}
          label="Signalés"
          value={stats.reported}
          variant="danger"
        />
        <AdminStatsCard
          icon={EyeOff}
          label="Masqués"
          value={stats.hidden}
          variant="default"
        />
      </div>

      {/* Reported Reviews Alert */}
      {mockReviews.filter((r) => r.reported).length > 0 && (
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Flag className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-amber-400 font-semibold">Avis signalés</h3>
                <p className="text-gray-400 text-sm mt-1">
                  {mockReviews.filter((r) => r.reported).length} avis ont été signalés et nécessitent une modération.
                </p>
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
                placeholder="Rechercher par client, prestataire ou contenu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Visibilité" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="visible">Visible</SelectItem>
                <SelectItem value="hidden">Masqué</SelectItem>
              </SelectContent>
            </Select>
            <Select value={reportedFilter} onValueChange={setReportedFilter}>
              <SelectTrigger className="w-full md:w-40 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Signalement" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="reported">Signalés</SelectItem>
                <SelectItem value="not_reported">Non signalés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card
            key={review.id}
            className={cn(
              "bg-gray-800/50 border-gray-700",
              review.reported && "border-amber-500/30"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Client Avatar */}
                <Avatar className="w-12 h-12 border border-gray-700">
                  <AvatarImage src={review.clientAvatar || ""} />
                  <AvatarFallback className="bg-gray-700 text-gray-300">
                    {review.clientName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-medium">{review.clientName}</p>
                        <span className="text-gray-500">→</span>
                        <p className="text-gray-300">{review.providerName}</p>
                        {review.reported && (
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                            <Flag className="w-3 h-3 mr-1" />
                            Signalé
                          </Badge>
                        )}
                        {review.status === "hidden" && (
                          <Badge className="bg-gray-500/20 text-gray-400">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Masqué
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        {renderStars(review.rating)}
                        <span className="text-gray-400 text-sm">
                          {review.date.toLocaleDateString("fr-FR")}
                        </span>
                        <Badge variant="outline" className="border-gray-600 text-gray-400">
                          {review.service}
                        </Badge>
                      </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-400">
                          <Search className="w-4 h-4 rotate-90" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-gray-800 border-gray-700">
                        {review.status === "visible" ? (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedReview(review);
                              setActionDialog("hide");
                            }}
                            className="text-gray-300 focus:bg-gray-700"
                          >
                            <EyeOff className="w-4 h-4 mr-2" />
                            Masquer l&apos;avis
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-gray-300 focus:bg-gray-700"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Afficher l&apos;avis
                          </DropdownMenuItem>
                        )}
                        {review.reported && (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedReview(review);
                              setActionDialog("respond");
                            }}
                            className="text-gray-300 focus:bg-gray-700"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Répondre au signalement
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedReview(review);
                            setActionDialog("delete");
                          }}
                          className="text-red-400 focus:bg-gray-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-gray-300 mt-3">{review.comment}</p>

                  {review.reported && review.reportReason && (
                    <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                      <p className="text-amber-400 text-sm">
                        <strong>Raison du signalement:</strong> {review.reportReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredReviews.length === 0 && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="py-12 text-center text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucun avis trouvé</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Dialogs */}
      <Dialog open={!!actionDialog} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent className="max-w-md bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {actionDialog === "hide" && "Masquer l'avis"}
              {actionDialog === "delete" && "Supprimer l'avis"}
              {actionDialog === "respond" && "Répondre au signalement"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {actionDialog === "hide" &&
                "L'avis sera masqué et ne sera plus visible publiquement."}
              {actionDialog === "delete" &&
                "Cette action est irréversible. L'avis sera définitivement supprimé."}
              {actionDialog === "respond" &&
                "Votre réponse sera envoyée au prestataire concerné."}
            </DialogDescription>
          </DialogHeader>

          {actionDialog === "respond" && (
            <div className="py-4">
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Votre réponse..."
                className="bg-gray-800 border-gray-700 text-white"
                rows={4}
              />
            </div>
          )}

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
              disabled={isProcessing || (actionDialog === "respond" && !response.trim())}
              className={cn(
                actionDialog === "delete" && "bg-red-600 hover:bg-red-700",
                actionDialog === "hide" && "bg-amber-600 hover:bg-amber-700",
                actionDialog === "respond" && "bg-primary hover:bg-primary/90"
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
