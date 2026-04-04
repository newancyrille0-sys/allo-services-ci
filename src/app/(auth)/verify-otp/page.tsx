"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Phone, CheckCircle2, RefreshCw } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/useAuth";

export default function VerifyOTPPage() {
  const router = useRouter();
  const { verifyOTP, sendOTP, pendingPhone, error, clearError, isLoading } = useAuth();
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer using ref to avoid setState in effect
  useEffect(() => {
    const tick = () => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    };

    if (countdown > 0 && !canResend) {
      timerRef.current = setTimeout(tick, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [countdown, canResend]);

  // Redirect if no pending phone
  useEffect(() => {
    if (!pendingPhone) {
      router.push("/register");
    }
  }, [pendingPhone, router]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return;

    clearError();
    const result = await verifyOTP(otp);

    if (result.success) {
      setIsVerified(true);
      // Redirect to profile after verification success
      setTimeout(() => {
        if (result.role === "CLIENT") {
          router.push("/client/profile");
        } else if (result.role === "PROVIDER") {
          router.push("/provider/profile");
        } else {
          router.push("/");
        }
      }, 2000);
    }
  };

  const handleResendOTP = async () => {
    if (!pendingPhone) return;

    clearError();
    const result = await sendOTP(pendingPhone);

    if (result.success) {
      setCountdown(60);
      setCanResend(false);
      setOtp("");
    }
  };

  // Format phone for display
  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("225") && cleaned.length === 11) {
      return `+225 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9, 11)}`;
    }
    return phone;
  };

  if (!pendingPhone) {
    return null;
  }

  return (
    <AuthLayout
      title="Vérification"
      description="Entrez le code reçu par SMS"
      backHref="/register"
      backLabel="Retour"
      showBackButton={!isVerified}
    >
      {isVerified ? (
        <div className="text-center py-8">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Vérification réussie !
          </h3>
          <p className="text-gray-500">
            Redirection en cours...
          </p>
          <Loader2 className="w-6 h-6 animate-spin mx-auto mt-4 text-primary" />
        </div>
      ) : (
        <>
          {/* Phone Display */}
          <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-gray-50 rounded-lg">
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium">{formatPhone(pendingPhone)}</span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* OTP Input */}
          <div className="flex flex-col items-center space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-500 text-center">
                Entrez le code à 6 chiffres
              </p>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                onComplete={handleVerifyOTP}
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

            {/* Verify Button */}
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              disabled={otp.length !== 6 || isLoading}
              onClick={handleVerifyOTP}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Vérification...
                </>
              ) : (
                "Vérifier"
              )}
            </Button>

            {/* Resend Code */}
            <div className="text-center">
              {canResend ? (
                <Button
                  variant="link"
                  className="text-primary"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Renvoyer le code
                </Button>
              ) : (
                <p className="text-sm text-gray-500">
                  Renvoyer le code dans{" "}
                  <span className="font-medium text-primary">{countdown}s</span>
                </p>
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Vous n&apos;avez pas reçu le code ?</strong>
              <br />
              Vérifiez que votre numéro est correct. Le SMS peut mettre jusqu&apos;à 2 minutes pour arriver.
            </p>
          </div>
        </>
      )}
    </AuthLayout>
  );
}
