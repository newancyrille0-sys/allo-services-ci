"use client";

import { useState } from "react";
import {
  Settings as SettingsIcon,
  Globe,
  CreditCard,
  Bell,
  Shield,
  Mail,
  Phone,
  Percent,
  Save,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSecretCode, setShowSecretCode] = useState(false);

  // General settings
  const [platformName, setPlatformName] = useState("Allo Services CI");
  const [contactEmail, setContactEmail] = useState("contact@alloservices.ci");
  const [supportPhone, setSupportPhone] = useState("+225 07 00 00 00 00");
  const [commissionRate, setCommissionRate] = useState("10");

  // Subscription settings
  const [monthlyPrice, setMonthlyPrice] = useState("15000");
  const [premiumPrice, setPremiumPrice] = useState("500000");

  // Payment settings
  const [cinetPayApiKey, setCinetPayApiKey] = useState("••••••••••••••••");
  const [cinetPaySiteId, setCinetPaySiteId] = useState("SITE_123456");

  // Security settings
  const [adminSecretCode, setAdminSecretCode] = useState("");
  const [allowedIps, setAllowedIps] = useState("");

  // Notification settings
  const [emailTemplateNewReservation, setEmailTemplateNewReservation] = useState(
    "Bonjour {client_name}, votre réservation a été confirmée..."
  );
  const [smsTemplateNewReservation, setSmsTemplateNewReservation] = useState(
    "AlloServices: Votre réservation #{reservation_id} est confirmée."
  );

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Paramètres</h1>
          <p className="text-gray-400 mt-1">Configuration de la plateforme</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="general" className="data-[state=active]:bg-primary">
            <Globe className="w-4 h-4 mr-2" />
            Général
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="data-[state=active]:bg-primary">
            <CreditCard className="w-4 h-4 mr-2" />
            Abonnements
          </TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-primary">
            <Wallet className="w-4 h-4 mr-2" />
            Paiements
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary">
            <Shield className="w-4 h-4 mr-2" />
            Sécurité
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Paramètres généraux</CardTitle>
              <CardDescription className="text-gray-400">
                Configuration de base de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Nom de la plateforme</Label>
                  <Input
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Email de contact</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="pl-10 bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Téléphone support</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      value={supportPhone}
                      onChange={(e) => setSupportPhone(e.target.value)}
                      className="pl-10 bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Taux de commission (%)</Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      type="number"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(e.target.value)}
                      className="pl-10 bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                  <p className="text-gray-500 text-xs">Pourcentage prélevé sur chaque réservation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Settings */}
        <TabsContent value="subscriptions">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Paramètres des abonnements</CardTitle>
              <CardDescription className="text-gray-400">
                Tarification et fonctionnalités des plans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Monthly Plan */}
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      Plan Standard (Mensuel)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Prix mensuel (XOF)</Label>
                      <Input
                        type="number"
                        value={monthlyPrice}
                        onChange={(e) => setMonthlyPrice(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Fonctionnalités incluses</Label>
                      <div className="space-y-2">
                        {["Profil complet", "Réponses illimitées", "Statistiques de base", "Support prioritaire"].map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <Switch defaultChecked />
                            <span className="text-gray-300 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Premium Plan */}
                <Card className="bg-gray-900/50 border-amber-500/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      Plan Premium (Annuel)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Prix annuel (XOF)</Label>
                      <Input
                        type="number"
                        value={premiumPrice}
                        onChange={(e) => setPremiumPrice(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Fonctionnalités incluses</Label>
                      <div className="space-y-2">
                        {["Tout Standard", "Badge Premium", "Mise en avant", "Statistiques avancées", "Support dédié"].map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <Switch defaultChecked />
                            <span className="text-gray-300 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Configuration des paiements</CardTitle>
              <CardDescription className="text-gray-400">
                Paramètres CinetPay et méthodes de paiement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">CinetPay API Key</Label>
                  <Input
                    type="password"
                    value={cinetPayApiKey}
                    onChange={(e) => setCinetPayApiKey(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">CinetPay Site ID</Label>
                  <Input
                    value={cinetPaySiteId}
                    onChange={(e) => setCinetPaySiteId(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white font-mono"
                  />
                </div>
              </div>

              <Separator className="bg-gray-700" />

              <div>
                <Label className="text-gray-300 mb-4 block">Méthodes de paiement actives</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { id: "orange_money", name: "Orange Money", color: "orange" },
                    { id: "mtn_money", name: "MTN Money", color: "yellow" },
                    { id: "wave", name: "Wave", color: "blue" },
                    { id: "moov", name: "Moov Money", color: "cyan" },
                    { id: "card", name: "Carte bancaire", color: "purple" },
                  ].map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700"
                    >
                      <span className="text-gray-300">{method.name}</span>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Modèles d&apos;emails</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Email - Nouvelle réservation</Label>
                  <Textarea
                    value={emailTemplateNewReservation}
                    onChange={(e) => setEmailTemplateNewReservation(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white min-h-[100px]"
                  />
                  <p className="text-gray-500 text-xs">
                    Variables disponibles: {`{client_name}, {provider_name}, {service}, {date}, {reservation_id}`}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Modèles SMS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">SMS - Nouvelle réservation</Label>
                  <Textarea
                    value={smsTemplateNewReservation}
                    onChange={(e) => setSmsTemplateNewReservation(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white min-h-[80px]"
                  />
                  <p className="text-gray-500 text-xs">Max 160 caractères</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Paramètres de sécurité</CardTitle>
              <CardDescription className="text-gray-400">
                Configuration de la sécurité administrateur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-300">Code secret administrateur</Label>
                <div className="relative">
                  <Input
                    type={showSecretCode ? "text" : "password"}
                    value={adminSecretCode}
                    onChange={(e) => setAdminSecretCode(e.target.value)}
                    placeholder="Nouveau code secret"
                    className="bg-gray-900 border-gray-700 text-white font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretCode(!showSecretCode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showSecretCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-gray-500 text-xs">
                  Laissez vide pour conserver le code actuel
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">IPs autorisées (optionnel)</Label>
                <Textarea
                  value={allowedIps}
                  onChange={(e) => setAllowedIps(e.target.value)}
                  placeholder="Une IP par ligne, ex:&#10;192.168.1.1&#10;41.202.45.123"
                  className="bg-gray-900 border-gray-700 text-white font-mono min-h-[100px]"
                />
                <p className="text-gray-500 text-xs">
                  Laissez vide pour autoriser toutes les IPs
                </p>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-amber-400 text-sm">
                  <strong>Attention:</strong> Les modifications de sécurité peuvent affecter l&apos;accès au panel d&apos;administration.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Wallet({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4Z" />
    </svg>
  );
}
