"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, Phone, CheckCircle2, ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const forgotPasswordSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, "Ce champ est requis")
    .refine(
      (val) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^(\+225|0)?[0-9]{8,10}$/;
        return emailRegex.test(val) || phoneRegex.test(val.replace(/\s/g, ""));
      },
      { message: "Veuillez entrer un email ou numéro de téléphone valide" }
    ),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedValue, setSubmittedValue] = useState("");

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      emailOrPhone: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setSubmittedValue(data.emailOrPhone);

    try {
      const isEmail = data.emailOrPhone.includes("@");
      
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEmail 
            ? { email: data.emailOrPhone }
            : { phone: data.emailOrPhone }
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Une erreur est survenue");
      }

      setIsSuccess(true);
    } catch (error) {
      form.setError("emailOrPhone", {
        type: "manual",
        message: error instanceof Error ? error.message : "Une erreur est survenue",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Email envoyé"
        description="Vérifiez votre boîte de réception"
        showBackButton={false}
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>

          <p className="text-gray-600 mb-6">
            Nous avons envoyé un lien de réinitialisation à :
            <br />
            <span className="font-medium text-gray-900">{submittedValue}</span>
          </p>

          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Vous n&apos;avez pas reçu l&apos;email ? Vérifiez vos spams ou
            </p>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsSuccess(false);
                form.reset();
              }}
            >
              Renvoyer le lien
            </Button>

            <Link href="/login">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la connexion
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Mot de passe oublié"
      description="Entrez votre email ou numéro de téléphone"
      backHref="/login"
      backLabel="Retour à la connexion"
    >
      <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-700">
          Nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="emailOrPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email ou téléphone</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Email ou numéro +225 XX XX XX XX XX"
                      className="pl-10"
                      {...field}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {field.value.includes("@") ? (
                        <Mail className="h-4 w-4" />
                      ) : (
                        <Phone className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Envoyer le lien"
            )}
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Vous vous souvenez de votre mot de passe ?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  );
}
