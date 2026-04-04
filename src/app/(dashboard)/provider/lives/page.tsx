"use client";

import * as React from "react";
import Link from "next/link";
import {
  Radio,
  Plus,
  Play,
  Square,
  Eye,
  Calendar,
  Clock,
  Loader2,
  Video,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LiveIndicator } from "@/components/publications";
import { useToast } from "@/hooks/use-toast";

interface LiveSession {
  id: string;
  title: string;
  description?: string;
  status: "scheduled" | "live" | "ended";
  viewerCount: number;
  startedAt?: string;
  endedAt?: string;
  scheduledAt?: string;
  duration?: number;
}

// Mock data
const MOCK_LIVES: LiveSession[] = [
  {
    id: "1",
    title: "Démonstration de plomberie",
    description: "Je vous montre comment réparer une fuite",
    status: "ended",
    viewerCount: 127,
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    endedAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
    duration: 60,
  },
  {
    id: "2",
    title: "Conseils plomberie en direct",
    status: "scheduled",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    viewerCount: 0,
  },
];

export default function ProviderLivesPage() {
  const { toast } = useToast();
  const [lives, setLives] = React.useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [newLive, setNewLive] = React.useState({
    title: "",
    description: "",
    scheduledAt: "",
    isNow: true,
  });

  React.useEffect(() => {
    setTimeout(() => {
      setLives(MOCK_LIVES);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCreateLive = async () => {
    if (!newLive.title.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un titre",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const live: LiveSession = {
      id: Date.now().toString(),
      title: newLive.title,
      description: newLive.description,
      status: newLive.isNow ? "live" : "scheduled",
      scheduledAt: newLive.isNow ? undefined : newLive.scheduledAt,
      startedAt: newLive.isNow ? new Date().toISOString() : undefined,
      viewerCount: 0,
    };

    setLives([live, ...lives]);
    setIsSubmitting(false);
    setIsDialogOpen(false);
    setNewLive({ title: "", description: "", scheduledAt: "", isNow: true });

    toast({
      title: newLive.isNow ? "Live démarré" : "Live programmé",
      description: newLive.isNow
        ? "Votre live est maintenant en cours !"
        : "Votre live a été programmé avec succès.",
    });
  };

  const handleEndLive = (id: string) => {
    setLives(
      lives.map((live) =>
        live.id === id
          ? {
              ...live,
              status: "ended",
              endedAt: new Date().toISOString(),
            }
          : live
      )
    );
    toast({
      title: "Live terminé",
      description: "Votre live a été terminé avec succès.",
    });
  };

  const liveLives = lives.filter((l) => l.status === "live");
  const scheduledLives = lives.filter((l) => l.status === "scheduled");
  const endedLives = lives.filter((l) => l.status === "ended");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Lives</h1>
          <p className="text-sm text-gray-500">
            Interagissez avec vos clients en temps réel
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Radio className="mr-2 h-4 w-4" />
              Nouveau Live
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un live</DialogTitle>
              <DialogDescription>
                Lancez un live maintenant ou programmez-le pour plus tard
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du live</Label>
                <Input
                  id="title"
                  placeholder="Ex: Démonstration de mes services"
                  value={newLive.title}
                  onChange={(e) =>
                    setNewLive({ ...newLive, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optionnel)</Label>
                <Textarea
                  id="description"
                  placeholder="De quoi allez-vous parler ?"
                  value={newLive.description}
                  onChange={(e) =>
                    setNewLive({ ...newLive, description: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Commencer maintenant</Label>
                  <p className="text-xs text-gray-500">
                    Ou programmez pour plus tard
                  </p>
                </div>
                <Button
                  type="button"
                  variant={newLive.isNow ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNewLive({ ...newLive, isNow: true })}
                >
                  Maintenant
                </Button>
                <Button
                  type="button"
                  variant={!newLive.isNow ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNewLive({ ...newLive, isNow: false })}
                >
                  Programmer
                </Button>
              </div>

              {!newLive.isNow && (
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">Date et heure</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={newLive.scheduledAt}
                    onChange={(e) =>
                      setNewLive({ ...newLive, scheduledAt: e.target.value })
                    }
                  />
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={handleCreateLive}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création...
                    </>
                  ) : newLive.isNow ? (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Démarrer
                    </>
                  ) : (
                    <>
                      <Calendar className="mr-2 h-4 w-4" />
                      Programmer
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Live Banner */}
      {liveLives.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                <Radio className="h-6 w-6 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">
                    {liveLives[0].title}
                  </h3>
                  <Badge className="bg-red-600 text-white">
                    <LiveIndicator pulsing={false} className="mr-1" />
                    EN DIRECT
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {liveLives[0].viewerCount} spectateurs
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    En cours
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/live/${liveLives[0].id}`}>
                  Voir le live
                </Link>
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleEndLive(liveLives[0].id)}
              >
                <Square className="mr-2 h-4 w-4" />
                Terminer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total lives</CardDescription>
            <CardTitle className="text-3xl">{lives.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Vues totales</CardDescription>
            <CardTitle className="text-3xl">
              {lives.reduce((sum, l) => sum + l.viewerCount, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Durée moyenne</CardDescription>
            <CardTitle className="text-3xl">
              {endedLives.length > 0
                ? Math.round(
                    endedLives.reduce((sum, l) => sum + (l.duration || 0), 0) /
                      endedLives.length
                  )
                : 0}
              <span className="text-sm font-normal text-gray-500 ml-1">min</span>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Lives Lists */}
      <Tabs defaultValue="scheduled" className="w-full">
        <TabsList>
          <TabsTrigger value="scheduled">
            Programmés ({scheduledLives.length})
          </TabsTrigger>
          <TabsTrigger value="ended">
            Terminés ({endedLives.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="mt-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="py-4">
                    <div className="h-6 bg-gray-100 rounded animate-pulse w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : scheduledLives.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  Aucun live programmé
                </h3>
                <p className="text-sm text-gray-500 mt-1 text-center">
                  Programmez un live pour interagir avec vos clients
                </p>
                <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Programmer un live
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {scheduledLives.map((live) => (
                <Card key={live.id}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {live.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(live.scheduledAt!).toLocaleString("fr-FR", {
                            dateStyle: "full",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button size="sm">
                        <Play className="mr-2 h-4 w-4" />
                        Démarrer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ended" className="mt-4">
          {endedLives.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Video className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  Aucun live terminé
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Vos lives terminés apparaîtront ici
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {endedLives.map((live) => (
                <Card key={live.id}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <Video className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {live.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {live.viewerCount} vues
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {live.duration} min
                          </span>
                          <span>
                            {new Date(live.startedAt!).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Voir les statistiques
                    </Button>
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
