"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Image as ImageIcon,
  Video,
  Eye,
  Trash2,
  MoreVertical,
  Calendar,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { PublicationCard } from "@/components/publications";

interface Publication {
  id: string;
  type: "photo" | "video";
  mediaUrl: string;
  caption?: string;
  expiresAt?: string;
  viewCount: number;
  isActive: boolean;
  createdAt: string;
}

// Mock publications for demo
const MOCK_PUBLICATIONS: Publication[] = [
  {
    id: "1",
    type: "photo",
    mediaUrl: "/placeholder.jpg",
    caption: "Avant/après réparation de plomberie",
    viewCount: 127,
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "2",
    type: "video",
    mediaUrl: "/placeholder.mp4",
    caption: "Tutoriel: Comment réparer une fuite",
    viewCount: 342,
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export default function ProviderPublicationsPage() {
  const { toast } = useToast();
  const [publications, setPublications] = React.useState<Publication[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [newPublication, setNewPublication] = React.useState({
    type: "photo" as "photo" | "video",
    caption: "",
    isStory: false,
  });
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    // Simulate fetching publications
    setTimeout(() => {
      setPublications(MOCK_PUBLICATIONS);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newPub: Publication = {
      id: Date.now().toString(),
      type: newPublication.type,
      mediaUrl: URL.createObjectURL(selectedFile),
      caption: newPublication.caption,
      expiresAt: newPublication.isStory
        ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        : undefined,
      viewCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setPublications([newPub, ...publications]);
    setIsSubmitting(false);
    setIsDialogOpen(false);
    setNewPublication({ type: "photo", caption: "", isStory: false });
    setSelectedFile(null);

    toast({
      title: "Publication créée",
      description: "Votre publication a été publiée avec succès.",
    });
  };

  const handleDelete = (id: string) => {
    setPublications(publications.filter((p) => p.id !== id));
    toast({
      title: "Publication supprimée",
      description: "La publication a été supprimée.",
    });
  };

  const photos = publications.filter((p) => p.type === "photo");
  const videos = publications.filter((p) => p.type === "video");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Publications</h1>
          <p className="text-sm text-gray-500">
            Gérez vos photos et vidéos pour attirer plus de clients
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle publication
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Créer une publication</DialogTitle>
              <DialogDescription>
                Partagez votre travail avec vos clients potentiels
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Type de publication</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={newPublication.type === "photo" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setNewPublication({ ...newPublication, type: "photo" })}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Photo
                  </Button>
                  <Button
                    type="button"
                    variant={newPublication.type === "video" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setNewPublication({ ...newPublication, type: "video" })}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Vidéo
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Fichier</Label>
                <Input
                  id="file"
                  type="file"
                  accept={newPublication.type === "photo" ? "image/*" : "video/*"}
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <p className="text-xs text-gray-500">{selectedFile.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="caption">Légende</Label>
                <Textarea
                  id="caption"
                  placeholder="Décrivez votre publication..."
                  value={newPublication.caption}
                  onChange={(e) =>
                    setNewPublication({ ...newPublication, caption: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="story">Story (24h)</Label>
                  <p className="text-xs text-gray-500">
                    Disparaît après 24 heures
                  </p>
                </div>
                <Switch
                  id="story"
                  checked={newPublication.isStory}
                  onCheckedChange={(checked) =>
                    setNewPublication({ ...newPublication, isStory: checked })
                  }
                />
              </div>

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
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publication...
                    </>
                  ) : (
                    "Publier"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total publications</CardDescription>
            <CardTitle className="text-3xl">{publications.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total vues</CardDescription>
            <CardTitle className="text-3xl">
              {publications.reduce((sum, p) => sum + p.viewCount, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Publications actives</CardDescription>
            <CardTitle className="text-3xl">
              {publications.filter((p) => p.isActive).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Publications List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Toutes ({publications.length})</TabsTrigger>
          <TabsTrigger value="photos">Photos ({photos.length})</TabsTrigger>
          <TabsTrigger value="videos">Vidéos ({videos.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {isLoading ? (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-lg bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : publications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Aucune publication</h3>
                <p className="text-sm text-gray-500 mt-1 text-center">
                  Commencez à publier pour montrer votre travail aux clients
                </p>
                <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer une publication
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {publications.map((pub) => (
                <PublicationItem
                  key={pub.id}
                  publication={pub}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="photos" className="mt-4">
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((pub) => (
              <PublicationItem
                key={pub.id}
                publication={pub}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="mt-4">
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {videos.map((pub) => (
              <PublicationItem
                key={pub.id}
                publication={pub}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Publication Item Component
function PublicationItem({
  publication,
  onDelete,
}: {
  publication: Publication;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
      {/* Placeholder for image */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
        {publication.type === "video" ? (
          <Video className="h-12 w-12 text-gray-400" />
        ) : (
          <ImageIcon className="h-12 w-12 text-gray-400" />
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Top Badge */}
      <div className="absolute top-2 left-2">
        <Badge
          variant="secondary"
          className={publication.type === "video" ? "bg-purple-600 text-white" : "bg-blue-600 text-white"}
        >
          {publication.type === "video" ? "Vidéo" : "Photo"}
        </Badge>
      </div>

      {/* View Count */}
      <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 rounded-full px-2 py-0.5 text-white text-xs">
        <Eye className="h-3 w-3" />
        {publication.viewCount}
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
        {publication.caption && (
          <p className="text-xs line-clamp-2 mb-1">{publication.caption}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <Calendar className="h-3 w-3" />
          {new Date(publication.createdAt).toLocaleDateString("fr-FR")}
        </div>
      </div>

      {/* Actions */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Voir</DropdownMenuItem>
            <DropdownMenuItem>Modifier</DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(publication.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
