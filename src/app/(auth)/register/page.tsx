"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Loader2, Shield, CheckCircle, User } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

// Step 1: Registration schema
const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom est trop long"),
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Veuillez entrer une adresse email valide"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions d'utilisation",
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

type RegisterStep = "form" | "otp" | "success";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<RegisterStep>("form");
  const [formData, setFormData] = useState<RegisterFormValues | null>(null);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      acceptTerms: false,
    },
  });

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-verify when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && step === "otp") {
      verifyOTP();
    }
  }, [otp]);

  // Send OTP code
  const sendOTP = async (email: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/email-otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erreur lors de l'envoi du code");
        return false;
      }

      setCountdown(60);
      return true;
    } catch (err) {
      setError("Erreur de connexion. Veuillez réessayer.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP code
  const verifyOTP = async () => {
    if (otp.length !== 6 || !formData) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/email-otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp,
          fullName: formData.fullName,
          role: "CLIENT",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Code invalide");
        setOtp("");
        return;
      }

      // Success
      setStep("success");

      setTimeout(() => {
        router.push("/client");
      }, 1500);
    } catch (err) {
      setError("Erreur de vérification. Veuillez réessayer.");
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submit
  const onSubmit = async (data: RegisterFormValues) => {
    setFormData(data);
    const success = await sendOTP(data.email);
    if (success) {
      setStep("otp");
    }
  };

  // Resend OTP
  const resendOTP = async () => {
    if (countdown > 0 || !formData) return;
    setOtp("");
    await sendOTP(formData.email);
  };

  // Render success state
  if (step === "success") {
    return (
      <AuthLayout
        title="Compte créé !"
        description=""
        backHref="/"
        backLabel="Retour à l'accueil"
      >
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Bienvenue sur Allo Services CI !
          </h3>
          <p className="text-gray-600 text-center">
            Votre compte a été créé avec succès. Redirection vers votre espace...
          </p>
        </div>
      </AuthLayout>
    );
  }

  // Render OTP step
  if (step === "otp") {
    return (
      <AuthLayout
        title="Vérification"
        description="Entrez le code à 6 chiffres"
        backHref="/register"
        backLabel=""
        onBack={() => {
          setStep("form");
          setOtp("");
          setError("");
        }}
      >
        <div className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Email Info */}
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm text-gray-600">
              Code envoyé à
            </p>
            <p className="font-medium text-gray-900">{formData?.email}</p>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              disabled={isLoading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Vérification en cours...
            </div>
          )}

          {/* Resend */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Vous n'avez pas reçu le code ?
            </p>
            <Button
              variant="ghost"
              className="text-primary"
              onClick={resendOTP}
              disabled={countdown > 0 || isLoading}
            >
              {countdown > 0
                ? `Renvoyer dans ${countdown}s`
                : "Renvoyer le code"}
            </Button>
          </div>

          {/* Security note */}
          <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
            <Shield className="w-4 h-4 text-gray-400 mt-0.5" />
            <p className="text-xs text-gray-500">
              Pour votre sécurité, le code expire dans 10 minutes. Ne partagez jamais ce code.
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Render form step (default)
  return (
    <AuthLayout
      title="Créer un compte"
      description="Rejoignez Allo Services CI en tant que client"
      backHref="/login"
      backLabel="Retour à la connexion"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Full Name Field */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900">Nom complet</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Votre nom complet"
                      className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...field}
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900">Adresse email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="votre@email.com"
                      className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...field}
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Terms Checkbox */}
          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-200 p-4 bg-gray-50">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-normal text-gray-700">
                    J&apos;accepte les{" "}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-700 hover:underline">
                      conditions d&apos;utilisation
                    </Link>{" "}
                    et la{" "}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-700 hover:underline">
                      politique de confidentialité
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi du code...
              </>
            ) : (
              "Créer mon compte"
            )}
          </Button>
        </form>
      </Form>

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700 text-center">
          💡 Un code de vérification à 6 chiffres sera envoyé à votre email.
        </p>
      </div>

      {/* Login Link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-blue-600 font-medium hover:text-blue-700 hover:underline">
          Se connecter
        </Link>
      </p>

      {/* Provider Registration Link */}
      <p className="mt-2 text-center text-sm text-gray-600">
        Vous êtes un prestataire ?{" "}
        <Link href="/register/provider" className="text-blue-600 font-medium hover:text-blue-700 hover:underline">
          Devenir prestataire
        </Link>
      </p>
    </AuthLayout>
  );
}
