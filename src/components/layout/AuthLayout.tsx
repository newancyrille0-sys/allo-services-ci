"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string;
}

export function AuthLayout({
  children,
  title,
  description,
  showBackButton = true,
  backHref = "/",
  backLabel = "Retour à l'accueil",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative Background */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary via-primary to-primary">
        {/* Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <span className="text-white font-bold text-lg">AS</span>
            </div>
            <span className="text-2xl font-bold text-white">
              Allo Services <span className="text-amber-400">CI</span>
            </span>
          </Link>

          {/* Features */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold leading-tight text-white">
              Trouvez les meilleurs prestataires de services en Côte d&apos;Ivoire
            </h2>
            <div className="space-y-4">
              <FeatureItem number="01" title="Des prestataires vérifiés">
                Tous nos prestataires passent par un processus de vérification rigoureux
              </FeatureItem>
              <FeatureItem number="02" title="Paiement sécurisé">
                Payez en toute sécurité avec Orange Money, MTN MoMo, Wave ou Moov
              </FeatureItem>
              <FeatureItem number="03" title="Satisfaction garantie">
                Notre système d&apos;avis vous assure un service de qualité
              </FeatureItem>
            </div>
          </div>

          {/* Footer */}
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Allo Services CI. Fait avec ❤️ en 🇨🇮
          </p>
        </div>

        {/* Decorative Shapes */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
        {/* Back Button */}
        {showBackButton && (
          <div className="p-4 lg:p-6">
            <Button
              variant="ghost"
              asChild
              className="text-gray-600 hover:text-gray-900"
            >
              <Link href={backHref}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {backLabel}
              </Link>
            </Button>
          </div>
        )}

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-white font-bold">AS</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Allo Services <span className="text-primary">CI</span>
                </span>
              </Link>
            </div>

            {/* Auth Card */}
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="space-y-1 text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">{title}</CardTitle>
                {description && (
                  <CardDescription className="text-gray-500">
                    {description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-2">{children}</CardContent>
            </Card>

            {/* Additional Links or Info */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                En continuant, vous acceptez nos{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Conditions d&apos;utilisation
                </Link>{" "}
                et notre{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Politique de confidentialité
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 text-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Allo Services CI. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}

interface FeatureItemProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

function FeatureItem({ number, title, children }: FeatureItemProps) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
        <span className="text-sm font-bold text-amber-400">{number}</span>
      </div>
      <div>
        <h3 className="font-semibold mb-1 text-white">{title}</h3>
        <p className="text-sm text-white/70">{children}</p>
      </div>
    </div>
  );
}

export default AuthLayout;
