"use client";

import { useState } from "react";
import {
  CreditCard,
  Smartphone,
  Ban,
  Check,
  AlertTriangle,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Payment methods configuration
const PAYMENT_METHODS = [
  {
    id: "orange_money",
    label: "Orange Money",
    description: "Paiement mobile Orange Money",
    icon: "🟠",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
  },
  {
    id: "mtn_money",
    label: "MTN Money",
    description: "Paiement mobile MTN Money",
    icon: "🟡",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
  },
  {
    id: "wave",
    label: "Wave",
    description: "Paiement mobile Wave",
    icon: "🔵",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
  },
  {
    id: "moov",
    label: "Moov Money",
    description: "Paiement mobile Moov Money",
    icon: "🔴",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
  {
    id: "card",
    label: "Carte bancaire",
    description: "Visa, Mastercard, etc.",
    icon: "💳",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
  },
  {
    id: "cash",
    label: "Espèces",
    description: "Paiement en espèces à la livraison",
    icon: "💵",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
  },
];

// Payment method status
interface PaymentMethodStatus {
  id: string;
  label: string;
  isEnabled: boolean;
  controlId: string | null;
  disabledAt: Date | null;
  disabledReason: string | null;
  disabledById: string | null;
}

// Provider info
interface ProviderInfo {
  id: string;
  businessName: string | null;
  user: {
    id: string;
    fullName: string | null;
  };
}

interface PaymentControlManagerProps {
  provider: ProviderInfo;
  paymentMethods: PaymentMethodStatus[];
  stats: {
    total: number;
    enabled: number;
    disabled: number;
  };
  onToggleMethod?: (paymentMethod: string, isEnabled: boolean, reason?: string) => Promise<void>;
  onBulkUpdate?: (methods: { paymentMethod: string; isEnabled: boolean }[], reason?: string) => Promise<void>;
}

export function PaymentControlManager({
  provider,
  paymentMethods: initialMethods,
  stats,
  onToggleMethod,
  onBulkUpdate,
}: PaymentControlManagerProps) {
  const [paymentMethods, setPaymentMethods] = useState(initialMethods);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);
  const [disableReason, setDisableReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToggle = async (methodId: string, currentStatus: boolean) => {
    if (currentStatus) {
      // Show disable dialog
      setSelectedMethod(methodId);
      setDisableReason("");
      setIsDisableDialogOpen(true);
    } else {
      // Re-enable directly
      if (!onToggleMethod) return;
      
      setIsProcessing(true);
      try {
        await onToggleMethod(methodId, true);
        setPaymentMethods((prev) =>
          prev.map((m) =>
            m.id === methodId ? { ...m, isEnabled: true } : m
          )
        );
      } catch (error) {
        console.error("Error re-enabling payment method:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const confirmDisable = async () => {
    if (!selectedMethod || !onToggleMethod) return;
    
    setIsProcessing(true);
    try {
      await onToggleMethod(selectedMethod, false, disableReason);
      setPaymentMethods((prev) =>
        prev.map((m) =>
          m.id === selectedMethod
            ? { ...m, isEnabled: false, disabledReason: disableReason, disabledAt: new Date() }
            : m
        )
      );
      setIsDisableDialogOpen(false);
      setSelectedMethod(null);
    } catch (error) {
      console.error("Error disabling payment method:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const enableAllMethods = async () => {
    if (!onBulkUpdate) return;
    
    setIsProcessing(true);
    try {
      const methods = PAYMENT_METHODS.map((m) => ({
        paymentMethod: m.id,
        isEnabled: true,
      }));
      await onBulkUpdate(methods, "Réactivation globale par l'admin");
      setPaymentMethods((prev) =>
        prev.map((m) => ({ ...m, isEnabled: true, disabledReason: null, disabledAt: null }))
      );
    } catch (error) {
      console.error("Error enabling all methods:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const disableAllMethods = async () => {
    if (!onBulkUpdate) return;
    
    setIsProcessing(true);
    try {
      const methods = PAYMENT_METHODS.map((m) => ({
        paymentMethod: m.id,
        isEnabled: false,
      }));
      await onBulkUpdate(methods, "Désactivation globale par l'admin");
      setPaymentMethods((prev) =>
        prev.map((m) => ({ ...m, isEnabled: false }))
      );
    } catch (error) {
      console.error("Error disabling all methods:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getMethodInfo = (id: string) => PAYMENT_METHODS.find((m) => m.id === id);

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-700/50 rounded-lg">
                <CreditCard className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-gray-400 text-sm">Méthodes totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Check className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400">{stats.enabled}</p>
                <p className="text-gray-400 text-sm">Activées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Ban className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-400">{stats.disabled}</p>
                <p className="text-gray-400 text-sm">Désactivées</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Grid */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white text-lg">
            Méthodes de paiement - {provider.businessName}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={enableAllMethods}
              disabled={isProcessing || stats.disabled === 0}
              className="border-gray-700 text-gray-300 hover:bg-gray-700"
            >
              <Check className="w-4 h-4 mr-1" />
              Tout activer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={disableAllMethods}
              disabled={isProcessing || stats.enabled === 0}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <Ban className="w-4 h-4 mr-1" />
              Tout désactiver
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentMethods.map((method) => {
              const info = getMethodInfo(method.id);
              if (!info) return null;

              return (
                <div
                  key={method.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    method.isEnabled
                      ? `${info.bg} ${info.border}`
                      : "bg-gray-900/50 border-gray-700"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{info.icon}</span>
                      <div>
                        <p className={cn("font-medium", method.isEnabled ? info.color : "text-gray-400")}>
                          {info.label}
                        </p>
                        <p className="text-gray-500 text-xs">{info.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={method.isEnabled}
                      onCheckedChange={() => handleToggle(method.id, method.isEnabled)}
                      disabled={isProcessing}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>

                  {!method.isEnabled && (
                    <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs">
                      <div className="flex items-center gap-1 text-red-400 mb-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Désactivée</span>
                      </div>
                      {method.disabledReason && (
                        <p className="text-gray-400">{method.disabledReason}</p>
                      )}
                      {method.disabledAt && (
                        <p className="text-gray-500 mt-1">
                          Le {new Date(method.disabledAt).toLocaleDateString("fr-FR")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Warning Alert */}
      {stats.disabled > 0 && (
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-400 font-medium">Attention</p>
                <p className="text-gray-400 text-sm mt-1">
                  {stats.disabled} méthode(s) de paiement sont désactivées pour ce prestataire. 
                  Cela peut affecter sa capacité à recevoir des paiements.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disable Confirmation Dialog */}
      <Dialog open={isDisableDialogOpen} onOpenChange={setIsDisableDialogOpen}>
        <DialogContent className="max-w-md bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Désactiver le paiement
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Vous êtes sur le point de désactiver {getMethodInfo(selectedMethod || "")?.label} pour{" "}
              {provider.businessName}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-amber-400 text-sm">
                Le prestataire ne pourra plus recevoir de paiements via cette méthode.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Raison de la désactivation (requis)</Label>
              <Textarea
                value={disableReason}
                onChange={(e) => setDisableReason(e.target.value)}
                placeholder="Ex: Fraude suspectée, Problème technique..."
                className="bg-gray-800 border-gray-700 text-white min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsDisableDialogOpen(false)}
              className="text-gray-400"
            >
              Annuler
            </Button>
            <Button
              onClick={confirmDisable}
              disabled={isProcessing || !disableReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? "Désactivation..." : "Confirmer la désactivation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PaymentControlManager;
