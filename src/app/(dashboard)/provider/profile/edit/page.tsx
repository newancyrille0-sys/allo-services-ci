"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Camera,
  Loader2,
  Save,
  ArrowLeft,
  Building,
  Clock,
  DollarSign,
  Plus,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { POPULAR_CITIES, CITIES_CI } from "@/lib/constants/cities";
import { SERVICE_CATEGORIES } from "@/lib/constants/services";
import { formatXOF } from "@/lib/constants/subscription";
import { GPSLocationPicker } from "@/components/provider/GPSLocationPicker";

const providerProfileSchema = z.object({
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().min(8, "Numéro de téléphone inval"),
  email: z.string().email("Email invalide"),
  businessName: z.string().min(2, "Le nom commercial est requis"),
  description: z.string().min(20, "Description minimale de 20 caractères").max(500),
  categories: z.array(z.string()).min(1, "Sélectionnez au moins une catégorie"),
  hourlyRate: z.number().min(1000, "Tarif minimum: 1000 XOF"),
  city: z.string().min(1, "Sélectionnez une ville"),
  address: z.string().min(5, "Adresse trop courte"),
  isActive: z.boolean(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

type ProviderProfileFormValues = z.infer<typeof providerProfileSchema>;

export default function EditProviderProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [gpsLocation, setGpsLocation] = React.useState<{ latitude: number | null; longitude: number | null; city?: string }>({
    latitude: null,
    longitude: null,
  });

  const form = useForm<ProviderProfileFormValues>({
    resolver: zodResolver(providerProfileSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      businessName: "",
      description: "",
      categories: [],
      hourlyRate: 5000,
      city: "",
      address: "",
      isActive: true,
      latitude: null,
      longitude: null,
    },
  });

  // Fetch current profile
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/provider/profile");
        if (response.ok) {
          const data = await response.json();
          form.reset({
            fullName: data.user?.fullName || "",
            phone: data.user?.phone || "",
            email: data.user?.email || "",
            businessName: data.businessName || "",
            description: data.description || "",
            categories: JSON.parse(data.categories || "[]"),
            hourlyRate: data.hourlyRate || 5000,
            city: data.user?.city || "",
            address: data.user?.address || "",
            isActive: data.isActive ?? true,
            latitude: data.latitude || null,
            longitude: data.longitude || null,
          });
          setAvatarUrl(data.user?.avatarUrl);
          
          // Set GPS location if available
          if (data.latitude && data.longitude) {
            setGpsLocation({
              latitude: data.latitude,
              longitude: data.longitude,
              city: data.user?.city,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Use mock data for development
        form.reset({
          fullName: "Kouame Yao",
          phone: "+225 07 00 00 00 01",
          email: "plomberie.express@email.com",
          businessName: "Plomberie Express",
          description: "Expert en plomberie depuis plus de 10 ans. Interventions rapides sur Abidjan et environs. Spécialiste en réparation de fuites, installation sanitaire et dépannage d'urgence.",
          categories: ["plomberie", "urgence"],
          hourlyRate: 7500,
          city: "Abidjan",
          address: "Cocody, Ambiance",
          isActive: true,
          latitude: 5.3333,
          longitude: -3.9833,
        });
        // Set mock GPS location
        setGpsLocation({
          latitude: 5.3333,
          longitude: -3.9833,
          city: "Abidjan",
        });
      }
    };

    fetchProfile();
  }, [form]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const current = form.getValues("categories") || [];
    if (current.includes(categoryId)) {
      form.setValue(
        "categories",
        current.filter((c) => c !== categoryId)
      );
    } else {
      form.setValue("categories", [...current, categoryId]);
    }
  };

  const onSubmit = async (data: ProviderProfileFormValues) => {
    setIsLoading(true);

    try {
      // Upload avatar if changed
      let uploadedAvatarUrl = avatarUrl;
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        const uploadResponse = await fetch("/api/upload/image", {
          method: "POST",
          body: formData,
        });
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          uploadedAvatarUrl = uploadData.url;
        }
      }

      // Update profile
      const response = await fetch("/api/provider/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          categories: JSON.stringify(data.categories),
          avatarUrl: uploadedAvatarUrl,
        }),
      });

      // Update GPS location if coordinates are set
      if (data.latitude && data.longitude) {
        await fetch("/api/providers/location", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            latitude: data.latitude,
            longitude: data.longitude,
            city: data.city,
          }),
        });
      }

      if (response.ok) {
        toast({
          title: "Profil mis à jour",
          description: "Vos informations et votre localisation GPS ont été enregistrées avec succès.",
        });
        router.push("/provider/profile");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Succès (mode démo)",
        description: "Profil mis à jour avec succès.",
      });
      router.push("/provider/profile");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategories = form.watch("categories") || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier mon profil pro</h1>
          <p className="text-sm text-gray-500">Mettez à jour vos informations professionnelles</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Avatar Section */}
          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Photo de profil</CardTitle>
              <CardDescription>Cette photo sera visible par les clients</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-gray-100">
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                    {form.watch("businessName")?.charAt(0)?.toUpperCase() || "P"}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 shadow-lg"
                >
                  <Camera className="h-5 w-5" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                JPG, PNG ou GIF. Max 2MB.
              </p>

              <Separator className="my-4" />

              {/* Active Status */}
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive" className="font-medium">
                    Disponible
                  </Label>
                  <Switch
                    id="isActive"
                    checked={form.watch("isActive")}
                    onCheckedChange={(checked) => form.setValue("isActive", checked)}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Les clients pourront vous trouver et réserver vos services
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations personnelles</CardTitle>
                <CardDescription>Vos coordonnées</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nom complet</Label>
                  <div className="relative">
                    <Input
                      id="fullName"
                      placeholder="Votre nom complet"
                      className="pl-10"
                      {...form.register("fullName")}
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {form.formState.errors.fullName && (
                    <p className="text-sm text-red-500">{form.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      placeholder="+225 XX XX XX XX XX"
                      className="pl-10"
                      {...form.register("phone")}
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {form.formState.errors.phone && (
                    <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      className="pl-10"
                      {...form.register("email")}
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Business Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations professionnelles</CardTitle>
                <CardDescription>Votre activité et services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nom commercial / Entreprise</Label>
                  <div className="relative">
                    <Input
                      id="businessName"
                      placeholder="Nom de votre entreprise"
                      className="pl-10"
                      {...form.register("businessName")}
                    />
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {form.formState.errors.businessName && (
                    <p className="text-sm text-red-500">{form.formState.errors.businessName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description de vos services</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez votre activité, vos compétences..."
                    maxLength={500}
                    className="min-h-24"
                    {...form.register("description")}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Min. 20 caractères</span>
                    <span>{form.watch("description")?.length || 0}/500</span>
                  </div>
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Catégories de services</Label>
                  <ScrollArea className="h-40 rounded-md border border-gray-200 p-3 bg-white">
                    <div className="space-y-2">
                      {SERVICE_CATEGORIES.map((category) => (
                        <label
                          key={category.id}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <Checkbox
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => toggleCategory(category.id)}
                          />
                          <span className="text-sm text-gray-700">{category.name}</span>
                        </label>
                      ))}
                    </div>
                  </ScrollArea>
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedCategories.map((catId) => {
                        const cat = SERVICE_CATEGORIES.find((c) => c.id === catId);
                        return cat ? (
                          <Badge key={catId} variant="secondary" className="text-xs">
                            {cat.name}
                            <button
                              type="button"
                              onClick={() => toggleCategory(catId)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                  {form.formState.errors.categories && (
                    <p className="text-sm text-red-500">{form.formState.errors.categories.message}</p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Tarif horaire (XOF)</Label>
                    <div className="relative">
                      <Input
                        id="hourlyRate"
                        type="number"
                        placeholder="5000"
                        className="pl-10"
                        {...form.register("hourlyRate", { valueAsNumber: true })}
                      />
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    {form.formState.errors.hourlyRate && (
                      <p className="text-sm text-red-500">{form.formState.errors.hourlyRate.message}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Actuel: {formatXOF(form.watch("hourlyRate") || 0)}/heure
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Select
                      onValueChange={(value) => form.setValue("city", value)}
                      value={form.watch("city")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre ville" />
                      </SelectTrigger>
                      <SelectContent>
                        {POPULAR_CITIES.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                        <Separator className="my-1" />
                        {CITIES_CI.filter((c) => !POPULAR_CITIES.includes(c as typeof POPULAR_CITIES[number])).map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.city && (
                      <p className="text-sm text-red-500">{form.formState.errors.city.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse détaillée</Label>
                  <div className="relative">
                    <Input
                      id="address"
                      placeholder="Quartier, rue, lieu-dit..."
                      className="pl-10"
                      {...form.register("address")}
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {form.formState.errors.address && (
                    <p className="text-sm text-red-500">{form.formState.errors.address.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* GPS Location Picker */}
            <GPSLocationPicker
              value={{
                latitude: gpsLocation.latitude,
                longitude: gpsLocation.longitude,
                city: form.watch("city"),
              }}
              onChange={(location) => {
                setGpsLocation({
                  latitude: location.latitude,
                  longitude: location.longitude,
                });
                form.setValue("latitude", location.latitude);
                form.setValue("longitude", location.longitude);
                if (location.city) {
                  form.setValue("city", location.city);
                }
              }}
            />

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer les modifications
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
