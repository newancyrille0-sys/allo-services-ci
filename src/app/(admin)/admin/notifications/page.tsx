"use client";

import { useState } from "react";
import {
  Bell,
  Send,
  Users,
  UserCheck,
  User,
  Megaphone,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Mock notification history
const mockNotifications = [
  {
    id: "1",
    title: "Maintenance programmée",
    message: "Une maintenance est prévue le 15 mai de 2h à 4h.",
    type: "system",
    target: "all",
    targetLabel: "Tous",
    sentAt: new Date("2024-05-10T10:00:00"),
    status: "sent",
    recipientCount: 3500,
  },
  {
    id: "2",
    title: "Nouveau service disponible",
    message: "Découvrez notre nouvelle catégorie de services!",
    type: "promo",
    target: "clients",
    targetLabel: "Clients",
    sentAt: new Date("2024-05-08T14:30:00"),
    status: "sent",
    recipientCount: 2890,
  },
  {
    id: "3",
    title: "Rappel: KYC en attente",
    message: "Vos documents KYC sont en attente de validation.",
    type: "alert",
    target: "providers",
    targetLabel: "Prestataires",
    sentAt: new Date("2024-05-07T09:00:00"),
    status: "sent",
    recipientCount: 15,
  },
  {
    id: "4",
    title: "Offre spéciale Premium",
    message: "-20% sur l'abonnement Premium ce mois-ci!",
    type: "promo",
    target: "providers",
    targetLabel: "Prestataires",
    sentAt: new Date("2024-05-05T16:00:00"),
    status: "sent",
    recipientCount: 450,
  },
];

const typeConfig = {
  system: { label: "Système", color: "text-blue-400 bg-blue-500/10 border-blue-500/30", icon: Bell },
  promo: { label: "Promotion", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", icon: Megaphone },
  alert: { label: "Alerte", color: "text-amber-400 bg-amber-500/10 border-amber-500/30", icon: AlertTriangle },
};

const targetConfig = {
  all: { label: "Tous les utilisateurs", icon: Users },
  clients: { label: "Tous les clients", icon: User },
  providers: { label: "Tous les prestataires", icon: UserCheck },
  specific: { label: "Utilisateur spécifique", icon: User },
};

export default function AdminNotificationsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  
  // Form state
  const [target, setTarget] = useState<string>("all");
  const [type, setType] = useState<string>("system");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [specificUserId, setSpecificUserId] = useState("");

  // Filter notifications
  const filteredNotifications = mockNotifications.filter((notif) =>
    notif.title.toLowerCase().includes(search.toLowerCase()) ||
    notif.message.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    // Reset form
    setTitle("");
    setMessage("");
    setActionUrl("");
    setSpecificUserId("");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications globales</h1>
          <p className="text-gray-400 mt-1">Envoyez des notifications aux utilisateurs</p>
        </div>
      </div>

      <Tabs defaultValue="send" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="send" className="data-[state=active]:bg-primary">
            <Send className="w-4 h-4 mr-2" />
            Envoyer
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-primary">
            <Clock className="w-4 h-4 mr-2" />
            Historique
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-primary">
            <Bell className="w-4 h-4 mr-2" />
            Modèles
          </TabsTrigger>
        </TabsList>

        {/* Send Tab */}
        <TabsContent value="send">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Nouvelle notification</CardTitle>
              <CardDescription className="text-gray-400">
                Envoyez une notification à un ou plusieurs utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Target Selection */}
              <div className="space-y-2">
                <Label className="text-gray-300">Destinataires</Label>
                <Select value={target} onValueChange={setTarget}>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Tous les utilisateurs
                      </div>
                    </SelectItem>
                    <SelectItem value="clients">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Tous les clients
                      </div>
                    </SelectItem>
                    <SelectItem value="providers">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        Tous les prestataires
                      </div>
                    </SelectItem>
                    <SelectItem value="specific">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Utilisateur spécifique
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {target === "specific" && (
                  <Input
                    placeholder="ID ou email de l'utilisateur"
                    value={specificUserId}
                    onChange={(e) => setSpecificUserId(e.target.value)}
                    className="mt-2 bg-gray-900 border-gray-700 text-white"
                  />
                )}

                {/* Recipient count preview */}
                {target !== "specific" && (
                  <p className="text-gray-500 text-sm mt-1">
                    Environ{" "}
                    <span className="text-white font-medium">
                      {target === "all" && "3 500"}
                      {target === "clients" && "2 890"}
                      {target === "providers" && "450"}
                    </span>{" "}
                    destinataires
                  </p>
                )}
              </div>

              {/* Type Selection */}
              <div className="space-y-2">
                <Label className="text-gray-300">Type de notification</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-blue-400" />
                        Système
                      </div>
                    </SelectItem>
                    <SelectItem value="promo">
                      <div className="flex items-center gap-2">
                        <Megaphone className="w-4 h-4 text-emerald-400" />
                        Promotion
                      </div>
                    </SelectItem>
                    <SelectItem value="alert">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        Alerte
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label className="text-gray-300">Titre</Label>
                <Input
                  placeholder="Titre de la notification"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label className="text-gray-300">Message</Label>
                <Textarea
                  placeholder="Contenu de la notification..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white min-h-[120px]"
                />
              </div>

              {/* Action URL (optional) */}
              <div className="space-y-2">
                <Label className="text-gray-300">URL d&apos;action (optionnel)</Label>
                <Input
                  placeholder="https://alloservices.ci/..."
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white"
                />
                <p className="text-gray-500 text-xs">
                  L&apos;utilisateur sera redirigé vers cette URL en cliquant sur la notification
                </p>
              </div>

              {/* Preview */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-4">
                  <p className="text-gray-400 text-sm mb-2">Aperçu:</p>
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg shrink-0",
                        type === "system" && "bg-blue-500/20",
                        type === "promo" && "bg-emerald-500/20",
                        type === "alert" && "bg-amber-500/20"
                      )}
                    >
                      {type === "system" && <Bell className="w-4 h-4 text-blue-400" />}
                      {type === "promo" && <Megaphone className="w-4 h-4 text-emerald-400" />}
                      {type === "alert" && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium">{title || "Titre de la notification"}</p>
                      <p className="text-gray-400 text-sm mt-1">{message || "Message de la notification..."}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Send Button */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300"
                  onClick={() => {
                    setTitle("");
                    setMessage("");
                    setActionUrl("");
                  }}
                >
                  Réinitialiser
                </Button>
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !title.trim() || !message.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isLoading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer la notification
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Historique des notifications</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher dans l'historique..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-gray-900 border-gray-700 text-white"
                />
              </div>

              {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-transparent">
                    <TableHead className="text-gray-400">Notification</TableHead>
                    <TableHead className="text-gray-400">Type</TableHead>
                    <TableHead className="text-gray-400">Cible</TableHead>
                    <TableHead className="text-gray-400">Destinataires</TableHead>
                    <TableHead className="text-gray-400">Date</TableHead>
                    <TableHead className="text-gray-400">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.map((notif) => {
                    const typeConf = typeConfig[notif.type as keyof typeof typeConfig];
                    const TypeIcon = typeConf.icon;
                    const targetConf = targetConfig[notif.target as keyof typeof targetConfig];
                    return (
                      <TableRow key={notif.id} className="border-gray-700 hover:bg-gray-700/30">
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">{notif.title}</p>
                            <p className="text-gray-400 text-sm truncate max-w-xs">
                              {notif.message}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={typeConf.color}>
                            <TypeIcon className="w-3 h-3 mr-1" />
                            {typeConf.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-gray-300">
                            <targetConf.icon className="w-3 h-3" />
                            {notif.targetLabel}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {notif.recipientCount.toLocaleString("fr-FR")}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {notif.sentAt.toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500/20 text-emerald-400">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Envoyé
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Modèles de notifications</CardTitle>
              <CardDescription className="text-gray-400">
                Modèles prédéfinis pour des envois rapides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Maintenance",
                    message: "Une maintenance est programmée le {date} de {start} à {end}.",
                    type: "system",
                  },
                  {
                    title: "Bienvenue",
                    message: "Bienvenue sur Allo Services CI ! Découvrez nos services.",
                    type: "system",
                  },
                  {
                    title: "Offre spéciale",
                    message: "Profitez de {discount}% de réduction avec le code {code} !",
                    type: "promo",
                  },
                  {
                    title: "Rappel KYC",
                    message: "Vos documents KYC sont en attente. Veuillez les soumettre.",
                    type: "alert",
                  },
                ].map((template, index) => {
                  const typeConf = typeConfig[template.type as keyof typeof typeConfig];
                  const TypeIcon = typeConf.icon;
                  return (
                    <Card key={index} className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <TypeIcon className={cn("w-4 h-4", typeConf.color.split(" ")[0])} />
                            <span className="text-white font-medium">{template.title}</span>
                          </div>
                          <Badge className={typeConf.color}>{typeConf.label}</Badge>
                        </div>
                        <p className="text-gray-400 text-sm">{template.message}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 border-gray-700 text-gray-300 hover:bg-gray-800"
                          onClick={() => {
                            setType(template.type);
                            setTitle(template.title);
                            setMessage(template.message);
                          }}
                        >
                          Utiliser ce modèle
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
