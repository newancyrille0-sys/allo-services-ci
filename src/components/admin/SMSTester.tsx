"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Phone, Send, Loader2, CheckCircle, XCircle } from "lucide-react";

const SMS_TEMPLATES = [
  { value: "otp", label: "Code OTP", args: ["Code"] },
  { value: "welcome", label: "Bienvenue", args: ["Nom"] },
  { value: "reservationConfirmed", label: "Confirmation réservation", args: ["Prestataire", "Date", "Service"] },
  { value: "reservationReminder", label: "Rappel RDV", args: ["Prestataire", "Date", "Service"] },
  { value: "providerNewReservation", label: "Nouvelle réservation (Prestataire)", args: ["Client", "Date", "Service"] },
  { value: "paymentConfirmed", label: "Confirmation paiement", args: ["Montant", "Service"] },
  { value: "passwordReset", label: "Réinitialisation mot de passe", args: ["Code"] },
  { value: "kycApproved", label: "KYC Approuvé", args: [] },
  { value: "kycRejected", label: "KYC Rejeté", args: ["Raison"] },
  { value: "referral", label: "Bonus parrainage", args: ["Montant"] },
];

export function SMSTester() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [template, setTemplate] = useState("");
  const [templateArgs, setTemplateArgs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const selectedTemplate = SMS_TEMPLATES.find((t) => t.value === template);

  const handleTemplateChange = (value: string) => {
    setTemplate(value);
    const tpl = SMS_TEMPLATES.find((t) => t.value === value);
    if (tpl) {
      setTemplateArgs(new Array(tpl.args.length).fill(""));
    }
  };

  const handleSendSMS = async () => {
    if (!phone) {
      setResult({ success: false, message: "Veuillez entrer un numéro de téléphone" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const body: Record<string, unknown> = { phone };

      if (template) {
        body.template = template;
        body.templateArgs = templateArgs;
      } else if (message) {
        body.message = message;
      } else {
        setResult({ success: false, message: "Veuillez entrer un message ou sélectionner un template" });
        setLoading(false);
        return;
      }

      const response = await fetch("/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        setResult({ success: true, message: `SMS envoyé avec succès! ID: ${data.messageId || "N/A"}` });
      } else {
        setResult({ success: false, message: data.error || "Erreur lors de l'envoi" });
      }
    } catch (error) {
      setResult({ success: false, message: "Erreur de connexion au serveur" });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!phone) {
      setResult({ success: false, message: "Veuillez entrer un numéro de téléphone" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, type: "register" }),
      });

      const data = await response.json();

      if (data.success) {
        setResult({ success: true, message: `OTP envoyé au ${data.phone}. Expire dans 5 minutes.` });
      } else {
        setResult({ success: false, message: data.error || "Erreur lors de l'envoi" });
      }
    } catch (error) {
      setResult({ success: false, message: "Erreur de connexion au serveur" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Test OTP Rapide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Test OTP Rapide
          </CardTitle>
          <CardDescription>
            Envoyer un code OTP à 6 chiffres pour tester l&apos;API Yellika
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="otp-phone">Numéro de téléphone</Label>
              <Input
                id="otp-phone"
                placeholder="07000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSendOTP} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Envoyer OTP
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test SMS avec Template */}
      <Card>
        <CardHeader>
          <CardTitle>Envoyer un SMS avec Template</CardTitle>
          <CardDescription>
            Utiliser un template prédéfini pour l&apos;envoi de SMS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Template</Label>
            <Select value={template} onValueChange={handleTemplateChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionner un template" />
              </SelectTrigger>
              <SelectContent>
                {SMS_TEMPLATES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTemplate && selectedTemplate.args.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {selectedTemplate.args.map((arg, index) => (
                <div key={index}>
                  <Label>{arg}</Label>
                  <Input
                    value={templateArgs[index] || ""}
                    onChange={(e) => {
                      const newArgs = [...templateArgs];
                      newArgs[index] = e.target.value;
                      setTemplateArgs(newArgs);
                    }}
                    placeholder={arg}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          )}

          <Button onClick={handleSendSMS} disabled={loading || !template}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Envoyer SMS
          </Button>
        </CardContent>
      </Card>

      {/* Test SMS Personnalisé */}
      <Card>
        <CardHeader>
          <CardTitle>Envoyer un SMS Personnalisé</CardTitle>
          <CardDescription>
            Envoyer un message personnalisé (max 500 caractères)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Message</Label>
            <textarea
              className="w-full mt-1 p-3 border rounded-lg min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#004150]"
              placeholder="Votre message ici..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{message.length}/500 caractères</p>
          </div>

          <Button onClick={handleSendSMS} disabled={loading || !message}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Envoyer SMS
          </Button>
        </CardContent>
      </Card>

      {/* Résultat */}
      {result && (
        <Card className={result.success ? "border-green-500" : "border-red-500"}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              {result.success ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
              <span className={result.success ? "text-green-700" : "text-red-700"}>
                {result.message}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
