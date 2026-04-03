"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Bell,
  Mail,
  Smartphone,
  Globe,
  Clock,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Password form schema
const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  newPassword: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

// Mock data
const MOCK_SETTINGS = {
  notifications: {
    newReservation: true,
    reservationReminder: true,
    newReview: true,
    paymentReceived: true,
    marketingEmails: false,
    smsAlerts: true,
  },
  availability: {
    isOnline: true,
    acceptAutoReservations: false,
  },
  workingHours: {
    monday: { enabled: true, start: "08:00", end: "18:00" },
    tuesday: { enabled: true, start: "08:00", end: "18:00" },
    wednesday: { enabled: true, start: "08:00", end: "18:00" },
    thursday: { enabled: true, start: "08:00", end: "18:00" },
    friday: { enabled: true, start: "08:00", end: "18:00" },
    saturday: { enabled: true, start: "09:00", end: "16:00" },
    sunday: { enabled: false, start: "09:00", end: "12:00" },
  },
  paymentMethods: {
    orangeMoney: "+225 07 08 09 10 11",
    mtnMoney: "",
    wave: "",
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

export default function ProviderSettingsPage() {
  const [settings, setSettings] = React.useState(MOCK_SETTINGS);
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [passwordSuccess, setPasswordSuccess] = React.useState(false);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleNotificationChange = (key: keyof typeof settings.notifications, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  const handleAvailabilityChange = (key: keyof typeof settings.availability, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [key]: value,
      },
    }));
  };

  const handleWorkingHoursChange = (day: string, field: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day as keyof typeof prev.workingHours],
          [field]: value,
        },
      },
    }));
  };

  const handlePasswordSubmit = (data: PasswordFormValues) => {
    console.log("Password change:", data);
    setPasswordSuccess(true);
    passwordForm.reset();
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez vos préférences et paramètres de compte
        </p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:flex">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="availability">Disponibilité</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-base">Préférences de notification</CardTitle>
              <CardDescription>
                Choisissez comment vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Reservation Notifications */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Réservations
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Nouvelles réservations</p>
                      <p className="text-xs text-muted-foreground">
                        Recevez une alerte pour chaque nouvelle demande de réservation
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.newReservation}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("newReservation", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Rappels de réservation</p>
                      <p className="text-xs text-muted-foreground">
                        Recevez un rappel 1h avant chaque réservation
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.reservationReminder}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("reservationReminder", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Review Notifications */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Avis
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Nouveaux avis</p>
                      <p className="text-xs text-muted-foreground">
                        Recevez une alerte quand un client laisse un avis
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.newReview}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("newReview", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Payment Notifications */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Paiements
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Paiements reçus</p>
                      <p className="text-xs text-muted-foreground">
                        Recevez une confirmation pour chaque paiement reçu
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.paymentReceived}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("paymentReceived", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Marketing */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Marketing
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Emails marketing</p>
                      <p className="text-xs text-muted-foreground">
                        Recevez des conseils et offres spéciales par email
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.marketingEmails}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("marketingEmails", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* SMS */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  SMS
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Alertes SMS</p>
                      <p className="text-xs text-muted-foreground">
                        Recevez les alertes importantes par SMS
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.smsAlerts}
                      onCheckedChange={(checked) =>
                        handleNotificationChange("smsAlerts", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability" className="space-y-6">
          {/* Online Status */}
          <Card className="border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-base">Disponibilité</CardTitle>
              <CardDescription>
                Gérez votre statut et vos disponibilités
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      settings.availability.isOnline ? "bg-emerald-500" : "bg-gray-400"
                    }`}
                  />
                  <div>
                    <p className="font-medium">
                      {settings.availability.isOnline ? "En ligne" : "Hors ligne"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {settings.availability.isOnline
                        ? "Vous recevez des réservations"
                        : "Les clients ne peuvent pas vous réserver"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.availability.isOnline}
                  onCheckedChange={(checked) =>
                    handleAvailabilityChange("isOnline", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Acceptation automatique</p>
                  <p className="text-sm text-muted-foreground">
                    Accepter automatiquement les nouvelles demandes de réservation
                  </p>
                </div>
                <Switch
                  checked={settings.availability.acceptAutoReservations}
                  onCheckedChange={(checked) =>
                    handleAvailabilityChange("acceptAutoReservations", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card className="border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-base">Horaires de travail</CardTitle>
              <CardDescription>
                Définissez vos horaires de disponibilité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {DAYS.map((day) => {
                const dayHours = settings.workingHours[day.key as keyof typeof settings.workingHours];
                return (
                  <div key={day.key} className="flex items-center gap-4">
                    <div className="w-28 flex items-center gap-2">
                      <Switch
                        checked={dayHours.enabled}
                        onCheckedChange={(checked) =>
                          handleWorkingHoursChange(day.key, "enabled", checked)
                        }
                      />
                      <span className="text-sm">{day.label}</span>
                    </div>
                    {dayHours.enabled ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          type="time"
                          value={dayHours.start}
                          onChange={(e) =>
                            handleWorkingHoursChange(day.key, "start", e.target.value)
                          }
                          className="w-28 h-9 text-xs"
                        />
                        <span className="text-xs text-muted-foreground">à</span>
                        <Input
                          type="time"
                          value={dayHours.end}
                          onChange={(e) =>
                            handleWorkingHoursChange(day.key, "end", e.target.value)
                          }
                          className="w-28 h-9 text-xs"
                        />
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Fermé</span>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <Card className="border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-base">Méthodes de paiement</CardTitle>
              <CardDescription>
                Configurez vos comptes pour recevoir les paiements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FF6600] flex items-center justify-center text-white font-bold text-sm">
                    OM
                  </div>
                  <div>
                    <p className="font-medium">Orange Money</p>
                    <p className="text-sm text-muted-foreground">
                      {settings.paymentMethods.orangeMoney || "Non configuré"}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {settings.paymentMethods.orangeMoney ? "Modifier" : "Configurer"}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FFCC00] flex items-center justify-center text-black font-bold text-sm">
                    MTN
                  </div>
                  <div>
                    <p className="font-medium">MTN Mobile Money</p>
                    <p className="text-sm text-muted-foreground">
                      {settings.paymentMethods.mtnMoney || "Non configuré"}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {settings.paymentMethods.mtnMoney ? "Modifier" : "Configurer"}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#00AEEF] flex items-center justify-center text-white font-bold text-sm">
                    W
                  </div>
                  <div>
                    <p className="font-medium">Wave</p>
                    <p className="text-sm text-muted-foreground">
                      {settings.paymentMethods.wave || "Non configuré"}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {settings.paymentMethods.wave ? "Modifier" : "Configurer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          {/* Password Change */}
          <Card className="border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-base">Changer le mot de passe</CardTitle>
              <CardDescription>
                Mettez à jour votre mot de passe pour sécuriser votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              {passwordSuccess && (
                <div className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-700 flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Mot de passe mis à jour avec succès
                </div>
              )}
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe actuel</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showCurrentPassword ? "text" : "password"}
                              placeholder="••••••••"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nouveau mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showNewPassword ? "text" : "password"}
                              placeholder="••••••••"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Au moins 8 caractères, une majuscule et un chiffre
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="••••••••"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit">
                    Mettre à jour le mot de passe
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Two-Factor Auth */}
          <Card className="border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-base">Authentification à deux facteurs</CardTitle>
              <CardDescription>
                Ajoutez une couche de sécurité supplémentaire à votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Authentification 2FA</p>
                    <p className="text-sm text-muted-foreground">
                      Bientôt disponible - Recevez un code par SMS à chaque connexion
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Bientôt</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-base text-destructive">Zone de danger</CardTitle>
              <CardDescription>
                Actions irréversibles sur votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Désactiver le compte</p>
                  <p className="text-sm text-muted-foreground">
                    Votre profil sera masqué mais vous pourrez le réactiver
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-destructive border-destructive">
                      Désactiver
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Désactiver votre compte ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Votre profil sera masqué et vous ne recevrez plus de réservations.
                        Vous pourrez réactiver votre compte à tout moment.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground">
                        Désactiver
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Supprimer le compte</p>
                  <p className="text-sm text-muted-foreground">
                    Supprimer définitivement votre compte et toutes vos données
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      Supprimer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer définitivement votre compte ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Toutes vos données, réservations et avis seront définitivement supprimés.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground">
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
