"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CreditCard,
  Calendar,
  Download,
  RefreshCcw,
  Crown,
  Check,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubscriptionPlanCard } from "@/components/subscription/SubscriptionPlanCard";
import { PaymentModal } from "@/components/payment/PaymentModal";
import {
  SUBSCRIPTION_PLANS,
  SUBSCRIPTION_COMPARISON,
  PAYMENT_METHODS,
  formatXOF,
  type SubscriptionPlanKey,
} from "@/lib/constants/subscription";
import { formatDate, getRelativeTime } from "@/lib/utils/formatters";

// Mock data
const MOCK_SUBSCRIPTION = {
  plan: "MONTHLY" as SubscriptionPlanKey,
  status: "ACTIVE" as const,
  startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20), // 20 days ago
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10 days from now
  autoRenew: true,
  paymentMethod: "orange_money" as const,
  features: {
    servicesUsed: 8,
    servicesMax: 15,
    hasAnalytics: true,
    hasPrioritySupport: false,
  },
};

const MOCK_PAYMENTS = [
  {
    id: "pay-1",
    amount: 15000,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    method: "Orange Money",
    status: "SUCCESS",
    reference: "OM123456789",
  },
  {
    id: "pay-2",
    amount: 15000,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
    method: "MTN Money",
    status: "SUCCESS",
    reference: "MTN987654321",
  },
  {
    id: "pay-3",
    amount: 15000,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
    method: "Orange Money",
    status: "SUCCESS",
    reference: "OM456789123",
  },
];

export default function ProviderSubscriptionPage() {
  const [subscription, setSubscription] = React.useState(MOCK_SUBSCRIPTION);
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<SubscriptionPlanKey | null>(null);
  const [isUpgrading, setIsUpgrading] = React.useState(false);

  const currentPlan = SUBSCRIPTION_PLANS[subscription.plan];
  const daysUntilExpiration = Math.ceil(
    (subscription.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const isExpiringSoon = daysUntilExpiration <= 5;

  const handlePlanSelect = (planKey: SubscriptionPlanKey) => {
    setSelectedPlan(planKey);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    if (selectedPlan) {
      setSubscription((prev) => ({
        ...prev,
        plan: selectedPlan,
        startDate: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        features: {
          ...prev.features,
          servicesMax: SUBSCRIPTION_PLANS[selectedPlan].limits.maxServices,
          hasAnalytics: SUBSCRIPTION_PLANS[selectedPlan].limits.hasAnalytics,
          hasPrioritySupport: SUBSCRIPTION_PLANS[selectedPlan].limits.hasPrioritySupport,
        },
      }));
    }
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  const handleToggleAutoRenew = (enabled: boolean) => {
    setSubscription((prev) => ({ ...prev, autoRenew: enabled }));
  };

  const selectedPlanData = selectedPlan ? SUBSCRIPTION_PLANS[selectedPlan] : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Abonnement</h1>
          <p className="text-muted-foreground">
            Gérez votre abonnement et vos paiements
          </p>
        </div>
        {subscription.plan !== "PREMIUM" && (
          <Button onClick={() => handlePlanSelect("PREMIUM")}>
            <Crown className="h-4 w-4 mr-2" />
            Passer à Premium
          </Button>
        )}
      </div>

      {/* Expiration Warning */}
      {isExpiringSoon && subscription.status === "ACTIVE" && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-amber-800">
                  Votre abonnement expire dans {daysUntilExpiration} jour{daysUntilExpiration > 1 ? "s" : ""}
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Renouvelez votre abonnement pour continuer à bénéficier de tous les avantages.
                </p>
              </div>
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700" asChild>
                <span onClick={() => handlePlanSelect(subscription.plan)}>
                  Renouveler
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Plan */}
      <Card className="border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-base">Plan actuel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-xl ${
                subscription.plan === "PREMIUM"
                  ? "bg-gradient-to-br from-amber-500 to-yellow-400 text-white"
                  : subscription.plan === "MONTHLY"
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-gray-500/10 text-gray-600"
              }`}
            >
              {subscription.plan === "PREMIUM" ? (
                <Crown className="h-6 w-6" />
              ) : subscription.plan === "MONTHLY" ? (
                <CreditCard className="h-6 w-6" />
              ) : (
                <CreditCard className="h-6 w-6" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{currentPlan.name}</h3>
                <Badge
                  variant={subscription.status === "ACTIVE" ? "default" : "secondary"}
                  className={subscription.status === "ACTIVE" ? "bg-emerald-500" : ""}
                >
                  {subscription.status === "ACTIVE" ? "Actif" : "Expiré"}
                </Badge>
              </div>
              <p className="text-2xl font-bold mt-1">
                {formatXOF(currentPlan.price)}
                {currentPlan.price > 0 && <span className="text-sm font-normal text-muted-foreground">/mois</span>}
              </p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Expire le {formatDate(subscription.expiresAt)}
                </div>
              </div>

              {/* Features Usage */}
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Services utilisés</span>
                    <span>
                      {subscription.features.servicesUsed}/{subscription.features.servicesMax === -1 ? "∞" : subscription.features.servicesMax}
                    </span>
                  </div>
                  {subscription.features.servicesMax !== -1 && (
                    <Progress
                      value={(subscription.features.servicesUsed / subscription.features.servicesMax) * 100}
                      className="h-2"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Comparer les plans</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
            <SubscriptionPlanCard
              key={plan.key}
              plan={plan}
              isCurrentPlan={subscription.plan === plan.key}
              onSelect={() => handlePlanSelect(plan.key)}
            />
          ))}
        </div>
      </div>

      {/* Settings & Payment History */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Auto-Renew Setting */}
        <Card className="border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-base">Paramètres de renouvellement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RefreshCcw className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Renouvellement automatique</p>
                  <p className="text-sm text-muted-foreground">
                    Votre abonnement sera automatiquement renouvelé
                  </p>
                </div>
              </div>
              <Switch
                checked={subscription.autoRenew}
                onCheckedChange={handleToggleAutoRenew}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Méthode de paiement</p>
                  <p className="text-sm text-muted-foreground">
                    {PAYMENT_METHODS.find((m) => m.id === subscription.paymentMethod)?.name || "Non définie"}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Modifier
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card className="border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-base">Historique des paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_PAYMENTS.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{formatXOF(payment.amount)}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.method} • {formatDate(payment.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                      Réussi
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Comparison Table */}
      <Card className="border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-base">Comparatif des fonctionnalités</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Fonctionnalité</th>
                  <th className="text-center py-3 px-4 font-medium">Gratuit</th>
                  <th className="text-center py-3 px-4 font-medium">Standard</th>
                  <th className="text-center py-3 px-4 font-medium bg-amber-50">Premium</th>
                </tr>
              </thead>
              <tbody>
                {SUBSCRIPTION_COMPARISON.map((row, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-3 px-4">{row.feature}</td>
                    <td className="text-center py-3 px-4">
                      {typeof row.FREE === "boolean" ? (
                        row.FREE ? (
                          <Check className="h-5 w-5 mx-auto text-emerald-500" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )
                      ) : (
                        row.FREE
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {typeof row.MONTHLY === "boolean" ? (
                        row.MONTHLY ? (
                          <Check className="h-5 w-5 mx-auto text-emerald-500" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )
                      ) : (
                        row.MONTHLY
                      )}
                    </td>
                    <td className="text-center py-3 px-4 bg-amber-50">
                      {typeof row.PREMIUM === "boolean" ? (
                        row.PREMIUM ? (
                          <Check className="h-5 w-5 mx-auto text-amber-500" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )
                      ) : (
                        row.PREMIUM
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {selectedPlanData && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPlan(null);
          }}
          amount={selectedPlanData.price}
          title={`Souscrire au plan ${selectedPlanData.name}`}
          description={`Vous serez débité de ${formatXOF(selectedPlanData.price)} pour le plan ${selectedPlanData.name}`}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
