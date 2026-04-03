"use client";

import * as React from "react";
import {
  Bell,
  Mail,
  Smartphone,
  Globe,
  Shield,
  FileText,
  HelpCircle,
  ExternalLink,
  Save,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = React.useState(false);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [smsNotifications, setSmsNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(false);

  // Preferences
  const [language, setLanguage] = React.useState("fr");

  // Privacy
  const [showProfile, setShowProfile] = React.useState(true);
  const [showActivity, setShowActivity] = React.useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez vos préférences et paramètres de compte
        </p>
      </div>

      {/* Notification Preferences */}
      <Card className="border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Préférences de notifications
          </CardTitle>
          <CardDescription>
            Choisissez comment vous souhaitez recevoir les notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <Label className="cursor-pointer">Notifications par email</Label>
                <p className="text-sm text-muted-foreground">
                  Recevez les mises à jour par email
                </p>
              </div>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Smartphone className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <Label className="cursor-pointer">Notifications SMS</Label>
                <p className="text-sm text-muted-foreground">
                  Recevez les alertes importantes par SMS
                </p>
              </div>
            </div>
            <Switch
              checked={smsNotifications}
              onCheckedChange={setSmsNotifications}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Bell className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <Label className="cursor-pointer">Notifications push</Label>
                <p className="text-sm text-muted-foreground">
                  Recevez les notifications push sur votre appareil
                </p>
              </div>
            </div>
            <Switch
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Language Preferences */}
      <Card className="border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Langue et région
          </CardTitle>
          <CardDescription>
            Définissez votre langue préférée
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Langue</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Confidentialité
          </CardTitle>
          <CardDescription>
            Gérez vos paramètres de confidentialité
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="cursor-pointer">Profil visible</Label>
              <p className="text-sm text-muted-foreground">
                Les prestataires peuvent voir votre profil
              </p>
            </div>
            <Switch checked={showProfile} onCheckedChange={setShowProfile} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="cursor-pointer">Afficher l'activité</Label>
              <p className="text-sm text-muted-foreground">
                Afficher vos réservations passées sur votre profil
              </p>
            </div>
            <Switch checked={showActivity} onCheckedChange={setShowActivity} />
          </div>
        </CardContent>
      </Card>

      {/* Legal */}
      <Card className="border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Mentions légales
          </CardTitle>
          <CardDescription>
            Consultez nos politiques et conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-between" asChild>
            <a href="/cgu" target="_blank">
              Conditions générales d'utilisation
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" className="w-full justify-between" asChild>
            <a href="/confidentialite" target="_blank">
              Politique de confidentialité
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" className="w-full justify-between" asChild>
            <a href="/mentions-legales" target="_blank">
              Mentions légales
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" className="w-full justify-between" asChild>
            <a href="/aide" target="_blank">
              <HelpCircle className="h-4 w-4 mr-2" />
              Centre d'aide
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Enregistrer les paramètres
        </Button>
      </div>
    </div>
  );
}
