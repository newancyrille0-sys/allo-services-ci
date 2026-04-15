"use client";

import * as React from "react";
import Link from "next/link";
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
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

      {/* Assurance Allo Services */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Assurance Allo Services
            <Badge className="bg-primary text-white ml-2">Incluse</Badge>
          </CardTitle>
          <CardDescription>
            Votre protection en cas de problème avec un prestataire
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main benefit */}
          <div className="p-4 bg-white rounded-lg border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  2 Agents Gratuits en cas de mauvais travail
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Si le prestataire ne fait pas correctement le travail, nous envoyons 
                  <strong className="text-primary"> 2 agents qualifiés</strong> pour refaire le service gratuitement.
                </p>
              </div>
            </div>
          </div>

          {/* Coverage types */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Types de problèmes couverts :</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Absence du prestataire</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Travail inachevé</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Mauvaise qualité</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Dommages causés</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex items-center gap-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <Clock className="h-5 w-5 text-amber-600" />
            <div className="text-sm">
              <p className="font-medium text-amber-800">Délais importants</p>
              <p className="text-amber-700">
                Réclamation sous <strong>48h</strong> • Intervention sous <strong>24h</strong>
              </p>
            </div>
          </div>

          {/* How to claim */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-2">Comment réclamer ?</p>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1. Allez dans <strong>Mes Réservations</strong></li>
              <li>2. Sélectionnez la réservation concernée</li>
              <li>3. Cliquez sur <strong>"Signaler un problème"</strong></li>
              <li>4. Décrivez le problème avec des photos si possible</li>
            </ol>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-500" />
            <p>
              L'assurance ne s'applique qu'aux services réservés et payés via la plateforme. 
              Les transactions hors plateforme ne sont pas couvertes.
            </p>
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
            <Link href="/terms">
              Conditions générales d'utilisation
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-between" asChild>
            <Link href="/privacy">
              Politique de confidentialité
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-between" asChild>
            <Link href="/about">
              Mentions légales
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-between" asChild>
            <Link href="/help">
              <HelpCircle className="h-4 w-4 mr-2" />
              Centre d'aide
              <ExternalLink className="h-4 w-4" />
            </Link>
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
