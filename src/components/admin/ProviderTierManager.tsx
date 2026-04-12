"use client";

import { useState } from "react";
import {
  Crown,
  Star,
  Zap,
  Check,
  X,
  TrendingUp,
  CreditCard,
  Calendar,
  Users,
  Shield,
  BarChart3,
  Gift,
  FileText,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Provider Tier type
type ProviderTier = "GRATUIT" | "BASIC" | "PREMIUM" | "ELITE";

// Tier configuration
interface TierConfig {
  tier: ProviderTier;
  monthlyPrice: number;
  yearlyPrice: number;
  commissionRate: number;
  maxPublications: number;
  maxLives: number;
  maxServices: number;
  canViewPhone: boolean;
  canPriority: boolean;
  canAnalytics: boolean;
  canPromo: boolean;
  canInvoice: boolean;
  canInsurance: boolean;
  visibilityBoost: number;
  badgeColor: string | null;
  badgeIcon: string | null;
}

// Provider info
interface ProviderInfo {
  id: string;
  businessName: string | null;
  providerTier: ProviderTier;
  tierExpiresAt: Date | null;
  user: {
    id: string;
    fullName: string | null;
    email: string | null;
  };
}

interface ProviderTierManagerProps {
  provider: ProviderInfo;
  currentTierConfig?: TierConfig;
  onTierChange?: (tier: ProviderTier, expiresAt?: string, reason?: string) => Promise<void>;
}

// Tier display configurations
const TIER_CONFIGS = {
  GRATUIT: {
    label: "Gratuit",
    color: "text-gray-400",
    bg: "bg-gray-500/10",
    border: "border-gray-500/30",
    icon: Users,
    description: "Accès de base à la plateforme",
  },
  BASIC: {
    label: "Basic",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: Zap,
    description: "10 000 FCFA/mois - Idéal pour débuter",
  },
  PREMIUM: {
    label: "Premium",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: Star,
    description: "25 000 FCFA/mois - Croissance accélérée",
  },
  ELITE: {
    label: "Elite",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    icon: Crown,
    description: "50 000 FCFA/mois - Accès complet",
  },
};

// Format price in FCFA
const formatPrice = (value: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(value) + " FCFA";
};

export function ProviderTierManager({
  provider,
  currentTierConfig,
  onTierChange,
}: ProviderTierManagerProps) {
  const [selectedTier, setSelectedTier] = useState<ProviderTier>(provider.providerTier);
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [reason, setReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentConfig = TIER_CONFIGS[provider.providerTier];
  const TierIcon = currentConfig.icon;

  const handleTierChange = async () => {
    if (!onTierChange) return;
    
    setIsProcessing(true);
    try {
      await onTierChange(selectedTier, expiresAt || undefined, reason || undefined);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error changing tier:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getTierBadge = (tier: ProviderTier, size: "sm" | "md" = "md") => {
    const config = TIER_CONFIGS[tier];
    const Icon = config.icon;
    
    return (
      <Badge
        variant="outline"
        className={cn(
          "font-medium",
          config.color,
          config.bg,
          config.border,
          size === "md" ? "px-3 py-1" : "px-2 py-0.5 text-xs"
        )}
      >
        <Icon className={cn("mr-1", size === "md" ? "w-4 h-4" : "w-3 h-3")} />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Current Tier Display */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <TierIcon className="w-5 h-5" />
            Niveau actuel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getTierBadge(provider.providerTier)}
              <div>
                <p className="text-white font-medium">{provider.businessName || "Sans nom"}</p>
                <p className="text-gray-400 text-sm">{provider.user.email}</p>
              </div>
            </div>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              Modifier le niveau
            </Button>
          </div>

          {provider.tierExpiresAt && (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              Expire le: {new Date(provider.tierExpiresAt).toLocaleDateString("fr-FR")}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tier Comparison */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Comparaison des niveaux</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(Object.keys(TIER_CONFIGS) as ProviderTier[]).map((tier) => {
              const config = TIER_CONFIGS[tier];
              const Icon = config.icon;
              const isSelected = tier === provider.providerTier;
              
              return (
                <div
                  key={tier}
                  className={cn(
                    "p-4 rounded-lg border transition-all cursor-pointer",
                    isSelected
                      ? `${config.bg} ${config.border} border-2`
                      : "bg-gray-900/50 border-gray-700 hover:border-gray-600"
                  )}
                  onClick={() => {
                    setSelectedTier(tier);
                    setIsDialogOpen(true);
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className={cn("w-5 h-5", config.color)} />
                    <span className={cn("font-semibold", isSelected ? config.color : "text-white")}>
                      {config.label}
                    </span>
                    {isSelected && (
                      <Badge className="ml-auto bg-primary/20 text-primary text-xs">
                        Actuel
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-400 text-xs mb-3">{config.description}</p>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Commission</span>
                      <span className="text-white">
                        {tier === "GRATUIT" ? "20%" : 
                         tier === "BASIC" ? "15%" : 
                         tier === "PREMIUM" ? "12%" : "10%"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Publications</span>
                      <span className="text-white">
                        {tier === "ELITE" ? "Illimité" : 
                         tier === "PREMIUM" ? "25" :
                         tier === "BASIC" ? "10" : "3"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Visibilité</span>
                      <span className="text-white">
                        x{tier === "ELITE" ? "3.0" : 
                           tier === "PREMIUM" ? "2.0" :
                           tier === "BASIC" ? "1.5" : "1.0"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tier Benefits */}
      {currentTierConfig && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Avantages du niveau {currentConfig.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <BenefitCard
                icon={Eye}
                label="Voir téléphone client"
                enabled={currentTierConfig.canViewPhone}
              />
              <BenefitCard
                icon={TrendingUp}
                label="Affichage prioritaire"
                enabled={currentTierConfig.canPriority}
              />
              <BenefitCard
                icon={BarChart3}
                label="Statistiques avancées"
                enabled={currentTierConfig.canAnalytics}
              />
              <BenefitCard
                icon={Gift}
                label="Créer des promotions"
                enabled={currentTierConfig.canPromo}
              />
              <BenefitCard
                icon={FileText}
                label="Générer des factures"
                enabled={currentTierConfig.canInvoice}
              />
              <BenefitCard
                icon={Shield}
                label="Assurance prestation"
                enabled={currentTierConfig.canInsurance}
              />
              <BenefitCard
                icon={CreditCard}
                label="Commission réduite"
                value={`${(currentTierConfig.commissionRate * 100).toFixed(0)}%`}
              />
              <BenefitCard
                icon={Users}
                label="Boost de visibilité"
                value={`x${currentTierConfig.visibilityBoost}`}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Change Tier Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Modifier le niveau</DialogTitle>
            <DialogDescription className="text-gray-400">
              Changer le niveau du prestataire {provider.businessName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Nouveau niveau</Label>
              <Select value={selectedTier} onValueChange={(v) => setSelectedTier(v as ProviderTier)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {(Object.keys(TIER_CONFIGS) as ProviderTier[]).map((tier) => {
                    const config = TIER_CONFIGS[tier];
                    const Icon = config.icon;
                    return (
                      <SelectItem key={tier} value={tier}>
                        <div className="flex items-center gap-2">
                          <Icon className={cn("w-4 h-4", config.color)} />
                          <span>{config.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Date d&apos;expiration (optionnel)</Label>
              <Input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <p className="text-xs text-gray-500">
                Laisser vide pour une durée illimitée
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Raison du changement</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Promotion exceptionnelle, Upgrade payé..."
                className="bg-gray-800 border-gray-700 text-white min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(false)}
              className="text-gray-400"
            >
              Annuler
            </Button>
            <Button
              onClick={handleTierChange}
              disabled={isProcessing || selectedTier === provider.providerTier}
              className="bg-primary hover:bg-primary/90"
            >
              {isProcessing ? "Modification..." : "Confirmer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Benefit Card Component
function BenefitCard({ 
  icon: Icon, 
  label, 
  enabled, 
  value 
}: { 
  icon: React.ElementType; 
  label: string; 
  enabled?: boolean; 
  value?: string;
}) {
  return (
    <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={cn(
          "w-4 h-4",
          enabled === false ? "text-gray-500" : "text-primary"
        )} />
        {enabled !== undefined && (
          enabled ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <X className="w-4 h-4 text-gray-500" />
          )
        )}
      </div>
      <p className="text-gray-400 text-xs">{label}</p>
      {value && (
        <p className="text-white font-medium text-sm mt-1">{value}</p>
      )}
    </div>
  );
}

export default ProviderTierManager;
