"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, User, Briefcase, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { confetti } from "@/lib/utils";

export default function RegistrationSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "client";

  React.useEffect(() => {
    // Trigger confetti effect
    const timeout = setTimeout(() => {
      confetti();
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  const isProvider = role === "provider";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                {isProvider ? (
                  <Briefcase className="h-4 w-4 text-white" />
                ) : (
                  <User className="h-4 w-4 text-white" />
                )}
              </div>
            </div>
          </div>

          <CardTitle className="text-2xl font-bold text-gray-900">
            Inscription réussie !
          </CardTitle>
          <CardDescription className="text-gray-600">
            Bienvenue sur Allo Services CI
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
            <p className="text-sm text-green-700">
              {isProvider
                ? "Votre compte prestataire a été créé avec succès. Vous pouvez maintenant configurer votre profil et commencer à recevoir des réservations."
                : "Votre compte client a été créé avec succès. Vous pouvez maintenant découvrir nos prestataires et faire vos premières réservations."}
            </p>
          </div>

          {/* Next Steps */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Prochaines étapes :</h3>
            <ul className="space-y-2">
              {isProvider ? (
                <>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-medium">
                      1
                    </span>
                    Complétez votre profil prestataire
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-medium">
                      2
                    </span>
                    Ajoutez vos services et tarifs
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-medium">
                      3
                    </span>
                    Téléchargez vos documents KYC pour être vérifié
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-medium">
                      1
                    </span>
                    Complétez votre profil client
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-medium">
                      2
                    </span>
                    Parcourez les prestataires disponibles
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-medium">
                      3
                    </span>
                    Faites votre première réservation
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Link href={isProvider ? "/provider/profile" : "/client/profile"}>
                Accéder à mon profil
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                Explorer la plateforme
              </Link>
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-center text-gray-500">
            Des questions ?{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              Contactez notre support
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
