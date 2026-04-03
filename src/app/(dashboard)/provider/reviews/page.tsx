"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Star,
  Search,
  Filter,
  MessageSquare,
  Send,
  Check,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getRelativeTime } from "@/lib/utils/formatters";
import { SERVICE_CATEGORIES } from "@/lib/constants/services";

// Form schema
const replyFormSchema = z.object({
  reply: z.string().min(10, "La réponse doit contenir au moins 10 caractères").max(500, "La réponse ne peut pas dépasser 500 caractères"),
});

type ReplyFormValues = z.infer<typeof replyFormSchema>;

interface Review {
  id: string;
  client: {
    id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  serviceName: string;
  createdAt: Date;
  response?: {
    content: string;
    createdAt: Date;
  };
}

// Mock data
const MOCK_STATS = {
  averageRating: 4.8,
  totalReviews: 127,
  ratingDistribution: {
    5: 89,
    4: 28,
    3: 7,
    2: 2,
    1: 1,
  },
  responseRate: 95,
};

const MOCK_REVIEWS: Review[] = [
  {
    id: "review-1",
    client: {
      id: "client-1",
      name: "Awa Sanogo",
    },
    rating: 5,
    comment: "Excellent travail ! Très professionnel et ponctuel. Le plombier a réparé ma fuite en un temps record. Je recommande vivement ses services.",
    serviceName: "Plomberie",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "review-2",
    client: {
      id: "client-2",
      name: "Moussa Traoré",
    },
    rating: 5,
    comment: "Travail impeccable, prix honnête. Le plombier a pris le temps d'expliquer ce qu'il faisait. Très satisfait de la prestation.",
    serviceName: "Installation sanitaire",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    response: {
      content: "Merci beaucoup Monsieur Traoré pour votre avis ! C'est un plaisir de vous avoir satisfait. N'hésitez pas à me recontacter pour vos futurs besoins.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 47),
    },
  },
  {
    id: "review-3",
    client: {
      id: "client-3",
      name: "Koffi Yao",
    },
    rating: 4,
    comment: "Bon service dans l'ensemble. Un peu de retard à l'arrivée mais travail soigné une fois sur place. Je recommande.",
    serviceName: "Électricité",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    response: {
      content: "Merci pour votre compréhension concernant le retard. Je prends note de vos remarques pour améliorer ma ponctualité. Au plaisir de vous servir à nouveau !",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 71),
    },
  },
  {
    id: "review-4",
    client: {
      id: "client-4",
      name: "Fatou Diallo",
    },
    rating: 5,
    comment: "Intervention rapide et efficace. Le technicien est très compétent et agréable. Le problème a été résolu en moins d'une heure.",
    serviceName: "Plomberie",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
  },
  {
    id: "review-5",
    client: {
      id: "client-5",
      name: "Jean-Baptiste Kouassi",
    },
    rating: 5,
    comment: "Installation parfaite de mes climatiseurs. Travail propre et soigné. Je suis très satisfait du résultat.",
    serviceName: "Climatisation",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120),
    response: {
      content: "Merci beaucoup pour votre confiance ! Profitez bien de la fraîcheur. Je reste disponible pour tout entretien futur.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 119),
    },
  },
  {
    id: "review-6",
    client: {
      id: "client-6",
      name: "Marie Brou",
    },
    rating: 3,
    comment: "Service correct mais j'aurais aimé plus de communication sur les étapes du travail. Le résultat final est satisfaisant.",
    serviceName: "Peinture",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 144),
  },
];

export default function ProviderReviewsPage() {
  const [reviews, setReviews] = React.useState(MOCK_REVIEWS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRating, setSelectedRating] = React.useState<string>("all");
  const [selectedResponseStatus, setSelectedResponseStatus] = React.useState<string>("all");
  const [isReplyDialogOpen, setIsReplyDialogOpen] = React.useState(false);
  const [selectedReview, setSelectedReview] = React.useState<Review | null>(null);

  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(replyFormSchema),
    defaultValues: {
      reply: "",
    },
  });

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        review.client.name.toLowerCase().includes(query) ||
        review.comment.toLowerCase().includes(query) ||
        review.serviceName.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Rating filter
    if (selectedRating !== "all" && review.rating !== parseInt(selectedRating)) return false;

    // Response status filter
    if (selectedResponseStatus === "responded" && !review.response) return false;
    if (selectedResponseStatus === "pending" && review.response) return false;

    return true;
  });

  // Calculate stats
  const respondedCount = reviews.filter((r) => r.response).length;
  const pendingResponseCount = reviews.filter((r) => !r.response).length;

  const handleOpenReplyDialog = (review: Review) => {
    setSelectedReview(review);
    form.reset({ reply: "" });
    setIsReplyDialogOpen(true);
  };

  const handleSubmitReply = (data: ReplyFormValues) => {
    if (!selectedReview) return;

    // Update review with response
    setReviews((prev) =>
      prev.map((r) =>
        r.id === selectedReview.id
          ? {
              ...r,
              response: {
                content: data.reply,
                createdAt: new Date(),
              },
            }
          : r
      )
    );

    setIsReplyDialogOpen(false);
    setSelectedReview(null);
    form.reset();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Avis clients</h1>
          <p className="text-muted-foreground">
            Gérez et répondez aux avis de vos clients
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-gray-200/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Star className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{MOCK_STATS.averageRating}</p>
                <p className="text-xs text-muted-foreground">Note moyenne</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{MOCK_STATS.totalReviews}</p>
                <p className="text-xs text-muted-foreground">Total avis</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Check className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{MOCK_STATS.responseRate}%</p>
                <p className="text-xs text-muted-foreground">Taux de réponse</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingResponseCount}</p>
                <p className="text-xs text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Rating Breakdown */}
        <Card className="border-gray-200/50 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Répartition des notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = MOCK_STATS.ratingDistribution[rating as keyof typeof MOCK_STATS.ratingDistribution];
              const percentage = (count / MOCK_STATS.totalReviews) * 100;

              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-3">{rating}</span>
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Progress value={percentage} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground w-8">{count}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un avis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRating} onValueChange={setSelectedRating}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Note" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes notes</SelectItem>
                <SelectItem value="5">5 étoiles</SelectItem>
                <SelectItem value="4">4 étoiles</SelectItem>
                <SelectItem value="3">3 étoiles</SelectItem>
                <SelectItem value="2">2 étoiles</SelectItem>
                <SelectItem value="1">1 étoile</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedResponseStatus} onValueChange={setSelectedResponseStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Réponse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="pending">Sans réponse</SelectItem>
                <SelectItem value="responded">Avec réponse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reviews */}
          {filteredReviews.length === 0 ? (
            <Card className="border-gray-200/50">
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Aucun avis trouvé</h3>
                <p className="text-sm text-muted-foreground">
                  Essayez de modifier vos filtres
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <Card key={review.id} className="border-gray-200/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {review.client.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium">{review.client.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-0.5">
                                {renderStars(review.rating)}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {review.serviceName}
                              </Badge>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {getRelativeTime(review.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {review.comment}
                        </p>

                        {/* Response */}
                        {review.response ? (
                          <div className="mt-4 pl-4 border-l-2 border-primary/20">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium">Votre réponse</p>
                              <span className="text-xs text-muted-foreground">
                                {getRelativeTime(review.response.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {review.response.content}
                            </p>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            onClick={() => handleOpenReplyDialog(review)}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Répondre
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Répondre à l'avis</DialogTitle>
            <DialogDescription>
              Répondez à l'avis de {selectedReview?.client.name}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitReply)} className="space-y-4">
              {/* Original Review */}
              {selectedReview && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-0.5">
                      {renderStars(selectedReview.rating)}
                    </div>
                    <span className="text-sm font-medium">{selectedReview.client.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedReview.comment}</p>
                </div>
              )}

              <FormField
                control={form.control}
                name="reply"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Votre réponse</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Écrivez votre réponse..."
                        rows={4}
                        maxLength={500}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0}/500 caractères
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
