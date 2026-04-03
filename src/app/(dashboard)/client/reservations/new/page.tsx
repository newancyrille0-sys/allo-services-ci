"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  Clock,
  MapPin,
  FileText,
  CreditCard,
  Search,
  Star,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { PaymentModal } from "@/components/payment/PaymentModal";
import { SERVICE_CATEGORIES } from "@/lib/constants/services";
import { POPULAR_CITIES } from "@/lib/constants/cities";

const STEPS = [
  { id: 1, title: "Service", icon: Search },
  { id: 2, title: "Prestataire", icon: Star },
  { id: 3, title: "Date & Heure", icon: Calendar },
  { id: 4, title: "Adresse", icon: MapPin },
  { id: 5, title: "Paiement", icon: CreditCard },
];

// Mock providers
const MOCK_PROVIDERS = [
  {
    id: "provider-1",
    businessName: "Plomberie Express Abidjan",
    averageRating: 4.9,
    totalReviews: 127,
    trustScore: 95,
    hourlyRate: 8000,
    city: "Abidjan",
    badgeVerified: true,
    subscriptionStatus: "PREMIUM" as const,
  },
  {
    id: "provider-2",
    businessName: "Électro Services",
    averageRating: 4.7,
    totalReviews: 89,
    trustScore: 88,
    hourlyRate: 7000,
    city: "Abidjan",
    badgeVerified: true,
    subscriptionStatus: "MONTHLY" as const,
  },
  {
    id: "provider-3",
    businessName: "Multi Services CI",
    averageRating: 4.5,
    totalReviews: 45,
    trustScore: 82,
    hourlyRate: 6000,
    city: "Abidjan",
    badgeVerified: false,
    subscriptionStatus: "FREE" as const,
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

export default function NewReservationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);

  // Form state
  const [selectedService, setSelectedService] = React.useState("");
  const [selectedSubService, setSelectedSubService] = React.useState("");
  const [selectedProvider, setSelectedProvider] = React.useState("");
  const [autoAssign, setAutoAssign] = React.useState(true);
  const [selectedDate, setSelectedDate] = React.useState<Date>();
  const [selectedTime, setSelectedTime] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [estimatedDuration, setEstimatedDuration] = React.useState(2);

  const progress = (currentStep / STEPS.length) * 100;

  // Get available time slots
  const timeSlots = React.useMemo(() => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      slots.push(`${hour}:00`);
      if (hour < 18) slots.push(`${hour}:30`);
    }
    return slots;
  }, []);

  // Calculate estimated price
  const estimatedPrice = React.useMemo(() => {
    const provider = MOCK_PROVIDERS.find((p) => p.id === selectedProvider);
    if (!provider) return 0;
    return provider.hourlyRate * estimatedDuration;
  }, [selectedProvider, estimatedDuration]);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedService && selectedSubService;
      case 2:
        return autoAssign || selectedProvider;
      case 3:
        return selectedDate && selectedTime;
      case 4:
        return address && city;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowPaymentModal(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handlePaymentSuccess = (transactionId: string) => {
    console.log("Payment successful:", transactionId);
    setShowPaymentModal(false);
    // Redirect to reservations
    router.push("/client/reservations");
  };

  const selectedServiceData = SERVICE_CATEGORIES.find(
    (s) => s.id === selectedService
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Nouvelle réservation</h1>
        <p className="text-muted-foreground">
          Réservez un service en quelques étapes
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center gap-2 ${
                index < STEPS.length - 1 ? "flex-1" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  currentStep > step.id
                    ? "bg-primary border-primary text-primary-foreground"
                    : currentStep === step.id
                    ? "border-primary text-primary"
                    : "border-muted text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={`text-xs font-medium ${
                  currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
              {index < STEPS.length - 1 && (
                <div
                  className={`hidden sm:block absolute left-full top-5 w-full h-0.5 -translate-y-1/2 ${
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  }`}
                  style={{ width: "calc(100% - 2.5rem)", left: "calc(50% + 1.25rem)" }}
                />
              )}
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <Card className="border-gray-200/50">
        <CardContent className="pt-6">
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Catégorie de service</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedServiceData && (
                <div className="space-y-2">
                  <Label>Type de service</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedServiceData.subServices.map((subService) => (
                      <button
                        key={subService.name}
                        type="button"
                        onClick={() => setSelectedSubService(subService.name)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedSubService === subService.name
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-primary/50"
                        }`}
                      >
                        <p className="font-medium text-sm">{subService.name}</p>
                        {subService.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {subService.description}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Provider Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto-assign"
                  checked={autoAssign}
                  onCheckedChange={(checked) => setAutoAssign(checked as boolean)}
                />
                <Label htmlFor="auto-assign" className="cursor-pointer">
                  Assigner automatiquement un prestataire disponible
                </Label>
              </div>

              {!autoAssign && (
                <div className="space-y-3">
                  <Label>Choisir un prestataire</Label>
                  <div className="space-y-3">
                    {MOCK_PROVIDERS.map((provider) => (
                      <button
                        key={provider.id}
                        type="button"
                        onClick={() => setSelectedProvider(provider.id)}
                        className={`w-full p-4 rounded-lg border text-left transition-all ${
                          selectedProvider === provider.id
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {provider.businessName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">
                                {provider.businessName}
                              </p>
                              {provider.badgeVerified && (
                                <Badge variant="secondary" className="text-xs">
                                  Vérifié
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span>{provider.averageRating}</span>
                              <span>•</span>
                              <span>{formatPrice(provider.hourlyRate)}/h</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Date & Time */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start h-12">
                      <Calendar className="h-4 w-4 mr-2" />
                      {selectedDate ? (
                        selectedDate.toLocaleDateString("fr-FR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      ) : (
                        "Sélectionnez une date"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Heure</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sélectionnez une heure" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Durée estimée (heures)</Label>
                <Select
                  value={estimatedDuration.toString()}
                  onValueChange={(v) => setEstimatedDuration(parseInt(v))}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
                      <SelectItem key={h} value={h.toString()}>
                        {h} heure{h > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 4: Address */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  placeholder="Ex: Cocody, Rue des Jardins, Maison 45"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sélectionnez une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    {POPULAR_CITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea
                  id="notes"
                  placeholder="Instructions particulières pour le prestataire..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 5: Payment Summary */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold">Récapitulatif</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium">{selectedSubService}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">
                      {selectedDate?.toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Heure</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Durée</span>
                    <span className="font-medium">{estimatedDuration}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Adresse</span>
                    <span className="font-medium">{address}, {city}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{formatPrice(estimatedPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frais de service</span>
                  <span>{formatPrice(2000)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(estimatedPrice + 2000)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentStep === 1 ? "Annuler" : "Retour"}
        </Button>
        <Button onClick={handleNext} disabled={!canProceed() || isLoading}>
          {currentStep === STEPS.length ? (
            <>
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4 mr-2" />
              )}
              Payer {formatPrice(estimatedPrice + 2000)}
            </>
          ) : (
            <>
              Suivant
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={estimatedPrice + 2000}
        paymentType="reservation"
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
