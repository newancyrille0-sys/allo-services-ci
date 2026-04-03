"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Check, User, Phone, Mail } from "lucide-react";
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
  FormDescription,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .max(100, "Le nom est trop long"),
    phone: z
      .string()
      .min(8, "Numéro de téléphone invalide")
      .refine(
        (val) => {
          const phoneRegex = /^(\+225|0)?[0-9]{8,10}$/;
          return phoneRegex.test(val.replace(/\s/g, ""));
        },
        { message: "Format invalide. Ex: +225 XX XX XX XX XX" }
      ),
    email: z
      .string()
      .email("Email invalide")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
      .regex(/[a-z]/, "Doit contenir au moins une minuscule")
      .regex(/[0-9]/, "Doit contenir au moins un chiffre"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Vous devez accepter les conditions d'utilisation",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const passwordRequirements = [
  { label: "Au moins 8 caractères", test: (p: string) => p.length >= 8 },
  { label: "Une majuscule", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Une minuscule", test: (p: string) => /[a-z]/.test(p) },
  { label: "Un chiffre", test: (p: string) => /[0-9]/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, error, clearError, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const password = form.watch("password");

  const onSubmit = async (data: RegisterFormValues) => {
    clearError();
    const result = await registerUser({
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || undefined,
      password: data.password,
    });

    if (result.success) {
      router.push("/verify-otp");
    }
  };

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

          {/* Phone Field */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900">Numéro de téléphone</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="tel"
                      placeholder="+225 XX XX XX XX XX"
                      className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...field}
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </FormControl>
                <FormDescription className="text-gray-600">
                  Nous vous enverrons un code de vérification
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field (Optional) */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900">Email (optionnel)</FormLabel>
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

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900">Mot de passe</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Créez un mot de passe"
                      className="pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                {/* Password Requirements */}
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 text-xs ${
                        req.test(password)
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                      {req.label}
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900">Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirmez votre mot de passe"
                      className="pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
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
                Inscription en cours...
              </>
            ) : (
              "Créer mon compte"
            )}
          </Button>
        </form>
      </Form>

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
