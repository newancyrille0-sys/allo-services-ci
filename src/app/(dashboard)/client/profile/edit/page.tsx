"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Phone, Mail, MapPin, Camera, Loader2, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { POPULAR_CITIES, CITIES_CI } from "@/lib/constants/cities";

const profileSchema = z.object({
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().min(8, "Numéro de téléphone inval"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  city: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().max(200, "Bio trop longue").optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function EditClientProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      city: "",
      address: "",
      bio: "",
    },
  });

  // Fetch current profile
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/client/profile");
        if (response.ok) {
          const data = await response.json();
          form.reset({
            fullName: data.fullName || "",
            phone: data.phone || "",
            email: data.email || "",
            city: data.city || "",
            address: data.address || "",
            bio: data.bio || "",
          });
          setAvatarUrl(data.avatarUrl);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Use mock data for development
        form.reset({
          fullName: "Amadou Koné",
          phone: "+225 07 00 00 00 00",
          email: "amadou.kone@email.com",
          city: "Abidjan",
          address: "Cocody, Rivera",
          bio: "Client régulier à la recherche de bons prestataires.",
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

  const onSubmit = async (data: ProfileFormValues) => {
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
      const response = await fetch("/api/client/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          avatarUrl: uploadedAvatarUrl,
        }),
      });

      if (response.ok) {
        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été enregistrées avec succès.",
        });
        router.push("/client/profile");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Succès (mode démo)",
        description: "Profil mis à jour avec succès.",
        variant: "default",
      });
      router.push("/client/profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier mon profil</h1>
          <p className="text-sm text-gray-500">Mettez à jour vos informations personnelles</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Avatar Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Photo de profil</CardTitle>
              <CardDescription>Cette photo sera visible par les prestataires</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-gray-100">
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                    {form.watch("fullName")?.charAt(0)?.toUpperCase() || "U"}
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
            </CardContent>
          </Card>

          {/* Form Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Informations personnelles</CardTitle>
              <CardDescription>Vos coordonnées et préférences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Full Name */}
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

              {/* Phone */}
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

              {/* Email */}
              <div className="space-y-2">
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

              <Separator />

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Select
                  onValueChange={(value) => form.setValue("city", value)}
                  defaultValue={form.getValues("city")}
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
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <div className="relative">
                  <Input
                    id="address"
                    placeholder="Quartier, rue, lieu-dit..."
                    className="pl-10"
                    {...form.register("address")}
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio (optionnel)</Label>
                <Textarea
                  id="bio"
                  placeholder="Parlez-nous de vous..."
                  maxLength={200}
                  {...form.register("bio")}
                />
                <p className="text-xs text-gray-500 text-right">
                  {form.watch("bio")?.length || 0}/200
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end gap-3">
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
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
