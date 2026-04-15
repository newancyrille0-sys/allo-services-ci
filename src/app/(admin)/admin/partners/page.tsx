"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Plus, 
  Trash2, 
  Edit, 
  ExternalLink,
  Upload,
  Eye,
  EyeOff,
  Bell,
  Home,
  Monitor,
  Tv,
  Loader2,
  ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  showInNotification: boolean;
  notificationMessage?: string;
  notificationStartAt?: string;
  showOnHome: boolean;
  showOnPublicite: boolean;
  showOnDashboard: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

interface AdminImage {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  title?: string;
  altText?: string;
  category?: string;
  uploadedAt: string;
}

export default function PartnersAdminPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [partners, setPartners] = useState<Partner[]>([]);
  const [images, setImages] = useState<AdminImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("partners");
  
  // Partner form state
  const [showPartnerDialog, setShowPartnerDialog] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [partnerForm, setPartnerForm] = useState({
    name: "",
    logoUrl: "",
    websiteUrl: "",
    description: "",
    displayOrder: 0,
    isActive: true,
    showInNotification: false,
    notificationMessage: "",
    notificationStartAt: "",
    showOnHome: true,
    showOnPublicite: true,
    showOnDashboard: true,
    startDate: "",
    endDate: "",
  });
  const [isSavingPartner, setIsSavingPartner] = useState(false);
  
  // Image upload state
  const [isUploading, setIsUploading] = useState(false);
  const [imageCategory, setImageCategory] = useState("general");
  const [imageTitle, setImageTitle] = useState("");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [partnersRes, imagesRes] = await Promise.all([
          fetch("/api/admin/partners"),
          fetch("/api/admin/images"),
        ]);
        
        const partnersData = await partnersRes.json();
        const imagesData = await imagesRes.json();
        
        if (partnersData.success) {
          setPartners(partnersData.data);
        }
        if (imagesData.success) {
          setImages(imagesData.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Open partner dialog for editing
  const openEditPartner = (partner: Partner) => {
    setEditingPartner(partner);
    setPartnerForm({
      name: partner.name,
      logoUrl: partner.logoUrl,
      websiteUrl: partner.websiteUrl || "",
      description: partner.description || "",
      displayOrder: partner.displayOrder,
      isActive: partner.isActive,
      showInNotification: partner.showInNotification,
      notificationMessage: partner.notificationMessage || "",
      notificationStartAt: partner.notificationStartAt ? partner.notificationStartAt.slice(0, 16) : "",
      showOnHome: partner.showOnHome,
      showOnPublicite: partner.showOnPublicite,
      showOnDashboard: partner.showOnDashboard,
      startDate: partner.startDate ? partner.startDate.slice(0, 10) : "",
      endDate: partner.endDate ? partner.endDate.slice(0, 10) : "",
    });
    setShowPartnerDialog(true);
  };

  // Open partner dialog for new
  const openNewPartner = () => {
    setEditingPartner(null);
    setPartnerForm({
      name: "",
      logoUrl: "",
      websiteUrl: "",
      description: "",
      displayOrder: 0,
      isActive: true,
      showInNotification: false,
      notificationMessage: "",
      notificationStartAt: "",
      showOnHome: true,
      showOnPublicite: true,
      showOnDashboard: true,
      startDate: "",
      endDate: "",
    });
    setShowPartnerDialog(true);
  };

  // Save partner
  const savePartner = async () => {
    if (!partnerForm.name || !partnerForm.logoUrl) {
      toast({
        title: "Erreur",
        description: "Le nom et le logo sont requis",
        variant: "destructive",
      });
      return;
    }

    setIsSavingPartner(true);
    try {
      const url = editingPartner
        ? `/api/admin/partners/${editingPartner.id}`
        : "/api/admin/partners";
      const method = editingPartner ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partnerForm),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: editingPartner ? "Partenaire modifié" : "Partenaire créé",
          description: "Les modifications ont été enregistrées",
        });
        setShowPartnerDialog(false);
        
        // Refresh partners list
        const partnersRes = await fetch("/api/admin/partners");
        const partnersData = await partnersRes.json();
        if (partnersData.success) {
          setPartners(partnersData.data);
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'enregistrer le partenaire",
        variant: "destructive",
      });
    } finally {
      setIsSavingPartner(false);
    }
  };

  // Delete partner
  const deletePartner = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce partenaire ?")) return;

    try {
      const response = await fetch(`/api/admin/partners/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Partenaire supprimé",
        });
        setPartners(partners.filter((p) => p.id !== id));
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le partenaire",
        variant: "destructive",
      });
    }
  };

  // Toggle partner active status
  const togglePartnerActive = async (partner: Partner) => {
    try {
      const response = await fetch(`/api/admin/partners/${partner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...partner, isActive: !partner.isActive }),
      });

      const data = await response.json();

      if (data.success) {
        setPartners(partners.map((p) =>
          p.id === partner.id ? { ...p, isActive: !p.isActive } : p
        ));
        toast({
          title: partner.isActive ? "Partenaire désactivé" : "Partenaire activé",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive",
      });
    }
  };

  // Upload image
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", imageCategory);
      formData.append("title", imageTitle);

      const response = await fetch("/api/admin/images", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Image uploadée",
          description: "L'image a été ajoutée avec succès",
        });
        setImages([data.data, ...images]);
        setImageTitle("");
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'uploader l'image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Use image URL for partner logo
  const useImageAsLogo = (url: string) => {
    setPartnerForm({ ...partnerForm, logoUrl: url });
    setShowPartnerDialog(true);
  };

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#001e40]" />
      </div>
    );
  }

  return (
    <div className="p-8 pt-24 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#001e40]">
              Gestion des Partenaires & Images
            </h1>
            <p className="text-sm text-[#43474f] mt-1">
              Gérez vos partenaires et vos images uploadées
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-[#f2f4f6]">
            <TabsTrigger value="partners" className="data-[state=active]:bg-white">
              Partenaires ({partners.length})
            </TabsTrigger>
            <TabsTrigger value="images" className="data-[state=active]:bg-white">
              Images ({images.length})
            </TabsTrigger>
          </TabsList>

          {/* Partners Tab */}
          <TabsContent value="partners" className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={openNewPartner} className="bg-[#001e40] hover:bg-[#003366]">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau partenaire
              </Button>
            </div>

            {partners.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">Aucun partenaire enregistré</p>
                  <Button onClick={openNewPartner} variant="outline">
                    Ajouter un partenaire
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {partners.map((partner) => (
                  <Card key={partner.id} className={`${!partner.isActive ? "opacity-60" : ""}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <Image
                            src={partner.logoUrl}
                            alt={partner.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-[#001e40] truncate">{partner.name}</h3>
                            {partner.websiteUrl && (
                              <a
                                href={partner.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-[#001e40]"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                          {partner.description && (
                            <p className="text-sm text-gray-500 truncate">{partner.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              Ordre: {partner.displayOrder}
                            </Badge>
                            {partner.showOnHome && (
                              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                <Home className="w-3 h-3" /> Accueil
                              </Badge>
                            )}
                            {partner.showOnPublicite && (
                              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                <Tv className="w-3 h-3" /> Publicité
                              </Badge>
                            )}
                            {partner.showOnDashboard && (
                              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                <Monitor className="w-3 h-3" /> Dashboard
                              </Badge>
                            )}
                            {partner.showInNotification && (
                              <Badge className="text-xs flex items-center gap-1 bg-[#003c27]">
                                <Bell className="w-3 h-3" /> Notification
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePartnerActive(partner)}
                            title={partner.isActive ? "Désactiver" : "Activer"}
                          >
                            {partner.isActive ? (
                              <Eye className="w-4 h-4 text-green-600" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditPartner(partner)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deletePartner(partner.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Uploader une image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="imageCategory">Catégorie</Label>
                    <select
                      id="imageCategory"
                      value={imageCategory}
                      onChange={(e) => setImageCategory(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-lg"
                    >
                      <option value="general">Général</option>
                      <option value="logo">Logo</option>
                      <option value="banner">Bannière</option>
                      <option value="partner">Partenaire</option>
                      <option value="promotion">Promotion</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="imageTitle">Titre (optionnel)</Label>
                    <Input
                      id="imageTitle"
                      value={imageTitle}
                      onChange={(e) => setImageTitle(e.target.value)}
                      placeholder="Titre de l'image"
                    />
                  </div>
                  <div className="flex items-end">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={uploadImage}
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full bg-[#001e40] hover:bg-[#003366]"
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      {isUploading ? "Upload en cours..." : "Choisir une image"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images Grid */}
            {images.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Aucune image uploadée</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {images.map((image) => (
                  <Card key={image.id} className="overflow-hidden group">
                    <div className="relative aspect-video bg-gray-100">
                      <Image
                        src={image.url}
                        alt={image.altText || image.filename}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            navigator.clipboard.writeText(image.url);
                            toast({ title: "URL copiée !", duration: 2000 });
                          }}
                        >
                          Copier l&apos;URL
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            useImageAsLogo(image.url);
                            setActiveTab("partners");
                          }}
                        >
                          Utiliser comme logo
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <p className="font-medium text-sm truncate">{image.title || image.filename}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                          {image.category && (
                            <Badge variant="outline" className="text-xs">
                              {image.category}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">{formatSize(image.size)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Partner Dialog */}
        <Dialog open={showPartnerDialog} onOpenChange={setShowPartnerDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPartner ? "Modifier le partenaire" : "Nouveau partenaire"}
              </DialogTitle>
              <DialogDescription>
                Remplissez les informations du partenaire
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Nom *</Label>
                  <Input
                    id="name"
                    value={partnerForm.name}
                    onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                    placeholder="Nom du partenaire"
                  />
                </div>
                <div>
                  <Label htmlFor="websiteUrl">Site web</Label>
                  <Input
                    id="websiteUrl"
                    value={partnerForm.websiteUrl}
                    onChange={(e) => setPartnerForm({ ...partnerForm, websiteUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="logoUrl">URL du logo *</Label>
                <div className="flex gap-2">
                  <Input
                    id="logoUrl"
                    value={partnerForm.logoUrl}
                    onChange={(e) => setPartnerForm({ ...partnerForm, logoUrl: e.target.value })}
                    placeholder="https://... ou /uploads/admin/..."
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPartnerDialog(false);
                      setActiveTab("images");
                    }}
                    type="button"
                  >
                    Parcourir
                  </Button>
                </div>
                {partnerForm.logoUrl && (
                  <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={partnerForm.logoUrl}
                      alt="Preview"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={partnerForm.description}
                  onChange={(e) => setPartnerForm({ ...partnerForm, description: e.target.value })}
                  placeholder="Description courte"
                  rows={2}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="displayOrder">Ordre d&apos;affichage</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={partnerForm.displayOrder}
                    onChange={(e) => setPartnerForm({ ...partnerForm, displayOrder: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    id="isActive"
                    checked={partnerForm.isActive}
                    onCheckedChange={(checked) => setPartnerForm({ ...partnerForm, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Actif</Label>
                </div>
              </div>

              {/* Display Locations */}
              <div>
                <Label>Afficher sur</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="showOnHome"
                      checked={partnerForm.showOnHome}
                      onCheckedChange={(checked) => setPartnerForm({ ...partnerForm, showOnHome: checked })}
                    />
                    <Label htmlFor="showOnHome" className="flex items-center gap-1">
                      <Home className="w-4 h-4" /> Accueil
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="showOnPublicite"
                      checked={partnerForm.showOnPublicite}
                      onCheckedChange={(checked) => setPartnerForm({ ...partnerForm, showOnPublicite: checked })}
                    />
                    <Label htmlFor="showOnPublicite" className="flex items-center gap-1">
                      <Tv className="w-4 h-4" /> Publicité
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="showOnDashboard"
                      checked={partnerForm.showOnDashboard}
                      onCheckedChange={(checked) => setPartnerForm({ ...partnerForm, showOnDashboard: checked })}
                    />
                    <Label htmlFor="showOnDashboard" className="flex items-center gap-1">
                      <Monitor className="w-4 h-4" /> Dashboard
                    </Label>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Switch
                    id="showInNotification"
                    checked={partnerForm.showInNotification}
                    onCheckedChange={(checked) => setPartnerForm({ ...partnerForm, showInNotification: checked })}
                  />
                  <Label htmlFor="showInNotification" className="flex items-center gap-1">
                    <Bell className="w-4 h-4" /> Afficher en notification (après 3h de session)
                  </Label>
                </div>
                
                {partnerForm.showInNotification && (
                  <div className="grid gap-4 md:grid-cols-2 pl-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="notificationMessage">Message de notification</Label>
                      <Input
                        id="notificationMessage"
                        value={partnerForm.notificationMessage}
                        onChange={(e) => setPartnerForm({ ...partnerForm, notificationMessage: e.target.value })}
                        placeholder="Message personnalisé (optionnel)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notificationStartAt">Date de début de notification</Label>
                      <Input
                        id="notificationStartAt"
                        type="datetime-local"
                        value={partnerForm.notificationStartAt}
                        onChange={(e) => setPartnerForm({ ...partnerForm, notificationStartAt: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="border-t pt-4">
                <Label className="mb-2 block">Dates du partenariat (optionnel)</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="startDate">Date de début</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={partnerForm.startDate}
                      onChange={(e) => setPartnerForm({ ...partnerForm, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Date de fin</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={partnerForm.endDate}
                      onChange={(e) => setPartnerForm({ ...partnerForm, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPartnerDialog(false)}>
                Annuler
              </Button>
              <Button
                onClick={savePartner}
                disabled={isSavingPartner}
                className="bg-[#001e40] hover:bg-[#003366]"
              >
                {isSavingPartner && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingPartner ? "Modifier" : "Créer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
