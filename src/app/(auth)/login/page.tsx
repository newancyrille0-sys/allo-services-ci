"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Loader2, ArrowLeft, Shield, CheckCircle } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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
import { signIn } from "next-auth/react";

// Step 1: Email schema
const emailSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Veuillez entrer une adresse email valide"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

type LoginStep = "email" | "otp" | "new-user" | "success";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState<"CLIENT" | "PROVIDER">("CLIENT");
  const [googleLoading, setGoogleLoading] = useState(false);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
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
  const sendOTP = async (emailAddress: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/email-otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailAddress }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erreur lors de l'envoi du code");
        return false;
      }

      setIsNewUser(data.isNewUser);
      setCountdown(60); // 60 seconds cooldown
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
    if (otp.length !== 6) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/email-otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          fullName: isNewUser ? newUserName : undefined,
          role: isNewUser ? newUserRole : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Code invalide");
        setOtp("");
        return;
      }

      // Success - redirect based on role
      setStep("success");

      setTimeout(() => {
        if (data.user?.role === "PROVIDER") {
          router.push("/provider");
        } else {
          router.push("/client");
        }
      }, 1000);
    } catch (err) {
      setError("Erreur de vérification. Veuillez réessayer.");
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email form submit
  const onEmailSubmit = async (data: EmailFormValues) => {
    setEmail(data.email);
    const success = await sendOTP(data.email);
    if (success) {
      setStep("otp");
    }
  };

  // Handle new user form submit
  const onNewUserSubmit = async () => {
    if (!newUserName.trim()) {
      setError("Veuillez entrer votre nom complet");
      return;
    }

    setStep("otp");
    await sendOTP(email);
  };

  // Resend OTP
  const resendOTP = async () => {
    if (countdown > 0) return;
    setOtp("");
    await sendOTP(email);
  };

  // Google login
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await signIn("google", {
        callbackUrl: "/client",
        redirect: true,
      });

      if (result?.error) {
        console.error("Google login error:", result.error);
      }
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      setGoogleLoading(false);
    }
  };

  // Render success state
  if (step === "success") {
    return (
      <AuthLayout
        title="Connexion réussie !"
        description=""
        backHref="/"
        backLabel="Retour à l'accueil"
      >
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-gray-600 text-center">
            Redirection en cours...
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
        backHref="/login"
        backLabel=""
        onBack={() => {
          setStep("email");
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
            <p className="font-medium text-gray-900">{email}</p>
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

  // Render new user step
  if (step === "new-user") {
    return (
      <AuthLayout
        title="Créer votre compte"
        description="Complétez votre profil"
        backHref="/login"
        backLabel=""
        onBack={() => {
          setStep("email");
          setError("");
        }}
      >
        <div className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Nom complet
            </label>
            <Input
              type="text"
              placeholder="Votre nom complet"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Type de compte
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setNewUserRole("CLIENT")}
                className={`p-4 border rounded-lg text-center transition-all ${
                  newUserRole === "CLIENT"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="block text-2xl mb-1">👤</span>
                <span className="font-medium">Client</span>
                <span className="block text-xs text-gray-500 mt-1">
                  Je cherche des services
                </span>
              </button>
              <button
                type="button"
                onClick={() => setNewUserRole("PROVIDER")}
                className={`p-4 border rounded-lg text-center transition-all ${
                  newUserRole === "PROVIDER"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="block text-2xl mb-1">🔧</span>
                <span className="font-medium">Prestataire</span>
                <span className="block text-xs text-gray-500 mt-1">
                  J'offre des services
                </span>
              </button>
            </div>
          </div>

          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={onNewUserSubmit}
            disabled={isLoading || !newUserName.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inscription en cours...
              </>
            ) : (
              "Continuer"
            )}
          </Button>
        </div>
      </AuthLayout>
    );
  }

  // Render email step (default)
  return (
    <AuthLayout
      title="Connexion"
      description="Connectez-vous à votre compte Allo Services CI"
      backHref="/"
      backLabel="Retour à l'accueil"
    >
      <Form {...emailForm}>
        <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Email Field */}
          <FormField
            control={emailForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="votre@email.com"
                      className="pl-10"
                      {...field}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail className="h-4 w-4" />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi du code...
              </>
            ) : (
              "Recevoir un code de connexion"
            )}
          </Button>
        </form>
      </Form>

      {/* Divider */}
      <div className="relative my-6">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
          ou continuer avec
        </span>
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          Continuer avec Google
        </Button>
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700 text-center">
          💡 Un code à 6 chiffres sera envoyé à votre email pour vous connecter en toute sécurité.
        </p>
      </div>

      {/* Register Link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Pas encore de compte ?{" "}
        <Link href="/register" className="text-primary font-medium hover:underline">
          S&apos;inscrire
        </Link>
      </p>

      {/* Provider Registration Link */}
      <p className="mt-2 text-center text-sm text-gray-600">
        Vous êtes un prestataire ?{" "}
        <Link href="/register/provider" className="text-primary font-medium hover:underline">
          Devenir prestataire
        </Link>
      </p>
    </AuthLayout>
  );
}
