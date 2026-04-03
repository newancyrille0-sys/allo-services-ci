"use client";

import * as React from "react";
import { Smartphone, CreditCard, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: (transactionId: string) => void;
  paymentType: "subscription" | "reservation";
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "orange_money",
    name: "Orange Money",
    icon: <Smartphone className="h-5 w-5" />,
    color: "#FF6600",
    bgColor: "bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30",
  },
  {
    id: "mtn_money",
    name: "MTN Mobile Money",
    icon: <Smartphone className="h-5 w-5" />,
    color: "#FFCC00",
    bgColor: "bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30",
  },
  {
    id: "wave",
    name: "Wave",
    icon: <Smartphone className="h-5 w-5" />,
    color: "#00AEEF",
    bgColor: "bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30",
  },
  {
    id: "moov",
    name: "Moov Money",
    icon: <Smartphone className="h-5 w-5" />,
    color: "#0099DA",
    bgColor: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30",
  },
  {
    id: "card",
    name: "Carte bancaire",
    icon: <CreditCard className="h-5 w-5" />,
    color: "#1A1A1A",
    bgColor: "bg-gray-500/10 hover:bg-gray-500/20 border-gray-500/30",
  },
];

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-CI", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PaymentModal({
  isOpen,
  onClose,
  amount,
  onSuccess,
  paymentType,
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = React.useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError("Veuillez sélectionner un mode de paiement");
      return;
    }

    if (selectedMethod !== "card" && !phoneNumber) {
      setError("Veuillez entrer votre numéro de téléphone");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate payment processing
    setTimeout(() => {
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setIsLoading(false);
      onSuccess(transactionId);
    }, 2000);
  };

  const handleReset = () => {
    setSelectedMethod(null);
    setPhoneNumber("");
    setError(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const title =
    paymentType === "subscription"
      ? "Paiement de l'abonnement"
      : "Paiement de la réservation";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Choisissez votre mode de paiement préféré
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Amount Display */}
          <div className="text-center py-4 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Montant à payer</span>
            <p className="text-2xl font-bold text-primary">{formatPrice(amount)}</p>
          </div>

          {/* Payment Methods */}
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMethod(method.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all",
                  "text-left",
                  selectedMethod === method.id
                    ? `${method.bgColor} border-2`
                    : "bg-transparent border-gray-200 hover:border-primary/30"
                )}
              >
                <span style={{ color: method.color }}>{method.icon}</span>
                <span className="text-sm font-medium">{method.name}</span>
              </button>
            ))}
          </div>

          {/* Phone Number Input (for mobile money) */}
          {selectedMethod && selectedMethod !== "card" && (
            <div className="space-y-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Ex: 07 00 00 00 00"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-12"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isLoading || !selectedMethod}
            className="w-full h-12 font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Traitement en cours...
              </>
            ) : (
              `Payer ${formatPrice(amount)}`
            )}
          </Button>

          {/* Security Note */}
          <p className="text-xs text-muted-foreground text-center">
            🔒 Paiement sécurisé. Vos données sont protégées.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
