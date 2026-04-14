"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Camera,
  MapPin,
  Phone,
  Clock,
  Eye,
  Save,
  ChevronRight,
  Check,
  Star,
  Shield,
  Crown,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { SubscriptionBadge } from "@/components/providers/SubscriptionBadge";
import { TrustScore } from "@/components/providers/TrustScore";
import { SERVICE_CATEGORIES } from "@/lib/constants/services";
import { CITIES_CI, ABIDJAN_COMMUNES } from "@/lib/constants/cities";
import { formatPrice } from "@/lib/utils/formatters";

// Form schema
const profileFormSchema = z.object({
  businessName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().min(20, "La description doit contenir au moins 20 caractères").max(500, "La description ne peut pas dépasser 500 caractères"),
  serviceCategories: z.array(z.string()).min(1, "Sélectionnez au moins une catégorie"),
  hourlyRate: z.number().min(1000, "Le taux horaire minimum est de 1 000 FCFA"),
  city: z.string().min(1, "Sélectionnez une ville"),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  phone: z.string().regex(/^\+225\s\d{2}\s\d{2}\s\d{2}\s\d{2}\s\d{2}$/, "Format: +225 XX XX XX XX XX"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Mock data
const MOCK_PROVIDER = {
  id: "provider-1",
  businessName: "Plomberie Express",
  description: "Expert en plomberie et sanitaires. Intervention rapide 7j/7 sur Abidjan et environs. Plus de 10 ans d'expérience dans le domaine. Devis gratuit et travail garanti.",
  serviceCategories: ["Bricolage & Réparations"],
  hourlyRate: 8000,
  city: "Abidjan",
  address: "Cocody, Rue des Jardins",
  phone: "+225 07 08 09 10 11",
  avatarUrl: "https://i.pravatar.cc/150?img=12",
  coverUrl: undefined,
  gallery: [] as string[],
  videoUrl: undefined,
  averageRating: 4.8,
  totalReviews: 127,
  trustScore: 95,
  subscriptionStatus: "MONTHLY" as const,
  badgeVerified: true,
  workingHours: {
    monday: { enabled: true, start: "08:00", end: "18:00" },
    tuesday: { enabled: true, start: "08:00", end: "18:00" },
    wednesday: { enabled: true, start: "08:00", end: "18:00" },
    thursday: { enabled: true, start: "08:00", end: "18:00" },
    friday: { enabled: true, start: "08:00", end: "18:00" },
    saturday: { enabled: true, start: "09:00", end: "16:00" },
    sunday: { enabled: false, start: "09:00", end: "12:00" },
  },
};

const DAYS = [
  { key: "monday", label: "Lundi" },
  { key: "tuesday", label: "Mardi" },
  { key: "wednesday", label: "Mercredi" },
  { key: "thursday", label: "Jeudi" },
  { key: "friday", label: "Vendredi" },
  { key: "saturday", label: "Samedi" },
  { key: "sunday", label: "Dimanche" },
];

export default function ProviderProfilePage() {
  const [isEditing, setIsEditing] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(MOCK_PROVIDER.serviceCategories);
  const [workingHours, setWorkingHours] = React.useState(MOCK_PROVIDER.workingHours);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      businessName: MOCK_PROVIDER.businessName,
      description: MOCK_PROVIDER.description,
      serviceCategories: MOCK_PROVIDER.serviceCategories,
      hourlyRate: MOCK_PROVIDER.hourlyRate,
      city: MOCK_PROVIDER.city,
      address: MOCK_PROVIDER.address,
      phone: MOCK_PROVIDER.phone,
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    console.log("Form data:", data);
    // Here you would send the data to the API
    setIsEditing(false);
  };

  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleWorkingHoursChange = (day: string, field: string, value: string | boolean) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const isPremium = MOCK_PROVIDER.subscriptionStatus === "PREMIUM";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mon profil</h1>
          <p className="text-muted-foreground">
            Gérez les informations visibles par vos clients
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Aperçu du profil
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Aperçu de votre profil public</DialogTitle>
                <DialogDescription>
                  Voici comment votre profil apparaît aux clients
                </DialogDescription>
              </DialogHeader>
              {/* Profile Preview Content */}
              <div className="space-y-4">
                {/* Cover Photo */}
                <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                  {isPremium ? (
                    <span className="text-sm text-muted-foreground">Photo de couverture (Premium)</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      <Crown className="h-4 w-4 inline mr-1" />
                      Débloquez avec Premium
                    </span>
                  )}
                </div>
                {/* Profile Info */}
                <div className="flex items-start gap-4 -mt-8">
                  <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {MOCK_PROVIDER.businessName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 pt-10">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-bold">{MOCK_PROVIDER.businessName}</h3>
                      {MOCK_PROVIDER.badgeVerified && (
                        <Shield className="h-5 w-5 text-primary" />
                      )}
                      <SubscriptionBadge status={MOCK_PROVIDER.subscriptionStatus} />
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{MOCK_PROVIDER.city}</span>
                      <span>•</span>
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{MOCK_PROVIDER.averageRating} ({MOCK_PROVIDER.totalReviews} avis)</span>
                    </div>
                  </div>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-lg font-bold">{MOCK_PROVIDER.totalReviews}</p>
                    <p className="text-xs text-muted-foreground">Avis</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-lg font-bold">{formatPrice(MOCK_PROVIDER.hourlyRate)}/h</p>
                    <p className="text-xs text-muted-foreground">Tarif</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <TrustScore score={MOCK_PROVIDER.trustScore} size="sm" />
                  </div>
                </div>
                {/* Description */}
                <div>
                  <h4 className="font-medium mb-2">À propos</h4>
                  <p className="text-sm text-muted-foreground">{MOCK_PROVIDER.description}</p>
                </div>
                {/* Services */}
                <div>
                  <h4 className="font-medium mb-2">Services proposés</h4>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_PROVIDER.serviceCategories.map((cat) => (
                      <Badge key={cat} variant="secondary">{cat}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              Modifier le profil
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Annuler
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)}>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Public Profile Preview Card */}
          <Card className="border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-base">Profil public</CardTitle>
              <CardDescription>
                Ces informations sont visibles par les clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={MOCK_PROVIDER.avatarUrl} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {MOCK_PROVIDER.businessName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold">{MOCK_PROVIDER.businessName}</h3>
                    {MOCK_PROVIDER.badgeVerified && (
                      <Shield className="h-5 w-5 text-primary" />
                    )}
                    <SubscriptionBadge status={MOCK_PROVIDER.subscriptionStatus} size="sm" />
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{MOCK_PROVIDER.city}</span>
                    <span>•</span>
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>{MOCK_PROVIDER.averageRating}</span>
                    <span>({MOCK_PROVIDER.totalReviews} avis)</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <TrustScore score={MOCK_PROVIDER.trustScore} size="sm" showLabel />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card className="border-gray-200/50">
                <CardHeader>
                  <CardTitle className="text-base">Informations générales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Business Name */}
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de l'entreprise</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isEditing}
                            placeholder="Nom de votre entreprise"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            disabled={!isEditing}
                            placeholder="Décrivez vos services et votre expérience..."
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

                  {/* Service Categories */}
                  <div className="space-y-2">
                    <Label>Catégories de services</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {SERVICE_CATEGORIES.map((category) => (
                        <label
                          key={category.id}
                          className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                            selectedCategories.includes(category.name)
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-primary/50"
                          } ${!isEditing ? "pointer-events-none opacity-80" : ""}`}
                        >
                          <Checkbox
                            checked={selectedCategories.includes(category.name)}
                            onCheckedChange={() => handleCategoryToggle(category.name)}
                            disabled={!isEditing}
                          />
                          <span className="text-sm">{category.name}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Sélectionnez les catégories correspondant à vos services
                    </p>
                  </div>

                  {/* Hourly Rate */}
                  <FormField
                    control={form.control}
                    name="hourlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taux horaire (FCFA)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            disabled={!isEditing}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="8000"
                          />
                        </FormControl>
                        <FormDescription>
                          Votre tarif de base par heure de travail
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="border-gray-200/50">
                <CardHeader>
                  <CardTitle className="text-base">Localisation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* City */}
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!isEditing}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une ville" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CITIES_CI.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Address */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isEditing}
                            placeholder="Quartier, rue, lieu-dit..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isEditing}
                            placeholder="+225 XX XX XX XX XX"
                          />
                        </FormControl>
                        <FormDescription>
                          Ce numéro sera visible par vos clients pour vous contacter
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>

        {/* Right Column - Media & Settings */}
        <div className="space-y-6">
          {/* Media Upload - Premium Feature */}
          <Card className={`border-gray-200/50 ${!isPremium ? "opacity-75" : ""}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Médias</CardTitle>
                {!isPremium && (
                  <Badge variant="secondary" className="gap-1">
                    <Crown className="h-3 w-3" />
                    Premium
                  </Badge>
                )}
              </div>
              <CardDescription>
                Ajoutez des photos et vidéos à votre profil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cover Photo */}
              <div className="space-y-2">
                <Label>Photo de couverture</Label>
                <div className={`h-24 border-2 border-dashed rounded-lg flex items-center justify-center ${
                  isPremium ? "border-primary/30 hover:border-primary/50 cursor-pointer" : "border-gray-200 bg-muted/50"
                }`}>
                  {isPremium ? (
                    <div className="text-center">
                      <Camera className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">Ajouter une photo</p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      <Crown className="h-4 w-4 inline mr-1" />
                      Débloquez avec Premium
                    </p>
                  )}
                </div>
              </div>

              {/* Gallery */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Galerie photos</Label>
                  <span className="text-xs text-muted-foreground">
                    {MOCK_PROVIDER.gallery.length}/10
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {MOCK_PROVIDER.gallery.map((photo, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-muted rounded-lg relative group"
                    >
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {isPremium && MOCK_PROVIDER.gallery.length < 10 && (
                    <div className="aspect-square border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50">
                      <Plus className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>

              {/* Video */}
              <div className="space-y-2">
                <Label>Vidéo de présentation</Label>
                <div className={`h-20 border-2 border-dashed rounded-lg flex items-center justify-center ${
                  isPremium ? "border-primary/30 hover:border-primary/50 cursor-pointer" : "border-gray-200 bg-muted/50"
                }`}>
                  {isPremium ? (
                    <div className="text-center">
                      <Camera className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">Ajouter une vidéo (max 2 min)</p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      <Crown className="h-4 w-4 inline mr-1" />
                      Débloquez avec Premium
                    </p>
                  )}
                </div>
              </div>

              {!isPremium && (
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/provider/subscription">
                    <Crown className="h-4 w-4 mr-2" />
                    Passer à Premium
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card className="border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-base">Horaires de travail</CardTitle>
              <CardDescription>
                Définissez vos disponibilités
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {DAYS.map((day) => {
                const dayHours = workingHours[day.key as keyof typeof workingHours];
                return (
                  <div key={day.key} className="flex items-center gap-3">
                    <div className="w-24">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={dayHours.enabled}
                          onCheckedChange={(checked) =>
                            handleWorkingHoursChange(day.key, "enabled", checked)
                          }
                          disabled={!isEditing}
                        />
                        <span className="text-sm">{day.label}</span>
                      </div>
                    </div>
                    {dayHours.enabled ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          type="time"
                          value={dayHours.start}
                          onChange={(e) =>
                            handleWorkingHoursChange(day.key, "start", e.target.value)
                          }
                          disabled={!isEditing}
                          className="w-24 h-8 text-xs"
                        />
                        <span className="text-xs text-muted-foreground">à</span>
                        <Input
                          type="time"
                          value={dayHours.end}
                          onChange={(e) =>
                            handleWorkingHoursChange(day.key, "end", e.target.value)
                          }
                          disabled={!isEditing}
                          className="w-24 h-8 text-xs"
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Fermé</span>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Stats Summary */}
          <Card className="border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-base">Performance du profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Vues ce mois</span>
                <span className="font-medium">312</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Demandes reçues</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Taux de conversion</span>
                <span className="font-medium text-emerald-500">18%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Taux de réponse</span>
                <span className="font-medium">98%</span>
              </div>
              <Separator />
              <Button variant="outline" className="w-full" asChild>
                <Link href="/provider/analytics">
                  Voir les analytics
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
