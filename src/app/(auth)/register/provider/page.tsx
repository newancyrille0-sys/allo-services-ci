"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Check,
  User,
  Mail,
  Building,
  FileText,
  Upload,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Video,
  RefreshCw,
  AlertCircle,
  Square,
  Clock,
  Shield,
} from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { SERVICE_CATEGORIES } from "@/lib/constants/services";
import { CITIES_CI, POPULAR_CITIES } from "@/lib/constants/cities";
import { SUBSCRIPTION_PLANS, formatXOF } from "@/lib/constants/subscription";
import type { SubscriptionPlanKey } from "@/lib/constants/subscription";

// Step schemas
const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().refine(
    (val) => /^(\+225|0)?[0-9]{8,10}$/.test(val.replace(/\s/g, "")),
    { message: "Format invalide. Ex: +225 XX XX XX XX XX" }
  ),
  email: z.string().email("Email invalide"),
});

const professionalInfoSchema = z.object({
  businessName: z.string().min(2, "Le nom commercial est requis"),
  description: z.string().min(20, "Description minimale de 20 caractères").max(500),
  categories: z.array(z.string()).min(1, "Sélectionnez au moins une catégorie"),
  hourlyRate: z.number().min(1000, "Tarif minimum: 1000 XOF"),
  city: z.string().min(1, "Sélectionnez une ville"),
  address: z.string().min(5, "Adresse trop courte"),
});

const subscriptionSchema = z.object({
  subscriptionPlan: z.enum(["FREE", "MONTHLY", "PREMIUM"]),
});

const providerSchema = personalInfoSchema
  .merge(professionalInfoSchema)
  .merge(subscriptionSchema);

type ProviderFormValues = z.infer<typeof providerSchema>;

const STEPS = [
  { id: 1, title: "Informations personnelles", description: "Vos coordonnées" },
  { id: 2, title: "Informations professionnelles", description: "Votre activité" },
  { id: 3, title: "Documents & Vidéo de vérification", description: "Vérification d'identité" },
  { id: 4, title: "Choix de l'abonnement", description: "Sélectionnez votre offre" },
  { id: 5, title: "Vérification email", description: "Confirmez votre email" },
];

const VIDEO_DURATION = 5; // 5 seconds

export default function ProviderRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<{
    cni?: File;
    registreCommerce?: File;
  }>({});
  
  // Video recording state
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [cameraPermissionRequested, setCameraPermissionRequested] = useState(false);
  
  // OTP state
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const cniInputRef = useRef<HTMLInputElement>(null);
  const registreInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      businessName: "",
      description: "",
      categories: [],
      hourlyRate: 5000,
      city: "",
      address: "",
      subscriptionPlan: "FREE",
    },
    mode: "onChange",
  });

  const progress = (currentStep / STEPS.length) * 100;

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-verify when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && currentStep === 5) {
      verifyOTP();
    }
  }, [otp]);

  // Camera functions
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      setCameraPermissionRequested(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user", 
          width: { ideal: 640 }, 
          height: { ideal: 480 } 
        },
        audio: true,
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera error:", err);
      let errorMessage = "Impossible d'accéder à la caméra. ";
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = "Accès à la caméra refusé. Veuillez autoriser l'accès dans les paramètres de votre navigateur.";
        } else if (err.name === 'NotFoundError') {
          errorMessage = "Aucune caméra détectée. Veuillez connecter une caméra.";
        } else if (err.name === 'NotReadableError') {
          errorMessage = "La caméra est utilisée par une autre application.";
        }
      }
      
      setCameraError(errorMessage);
      setIsCameraActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsRecording(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Start recording
  const startRecording = useCallback(() => {
    if (!streamRef.current || !videoRef.current) return;
    
    chunksRef.current = [];
    
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
      ? 'video/webm;codecs=vp9,opus'
      : MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
      ? 'video/webm;codecs=vp8,opus'
      : MediaRecorder.isTypeSupported('video/webm')
      ? 'video/webm'
      : 'video/mp4';
    
    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setVideoBlob(blob);
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        stopCamera();
      };
      
      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= VIDEO_DURATION) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (err) {
      console.error("Recording error:", err);
      setCameraError("Erreur lors du démarrage de l'enregistrement. Veuillez réessayer.");
    }
  }, [stopCamera]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRecording(false);
  }, []);

  // Retake video
  const retakeVideo = useCallback(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoBlob(null);
    setVideoUrl(null);
    setRecordingTime(0);
    startCamera();
  }, [videoUrl, startCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [stopCamera, videoUrl]);

  // Start camera when entering step 3
  useEffect(() => {
    if (currentStep === 3 && !videoUrl && !cameraPermissionRequested) {
      startCamera();
    } else if (currentStep !== 3) {
      stopCamera();
    }
  }, [currentStep, videoUrl, cameraPermissionRequested, startCamera, stopCamera]);

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof ProviderFormValues)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ["fullName", "phone", "email"];
        break;
      case 2:
        fieldsToValidate = ["businessName", "description", "categories", "hourlyRate", "city", "address"];
        break;
      case 3:
        if (!videoBlob) {
          setCameraError("Veuillez enregistrer une vidéo de vérification de 5 secondes");
          return false;
        }
        return true;
      case 4:
        fieldsToValidate = ["subscriptionPlan"];
        break;
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    setError("");
    const isValid = await validateStep(currentStep);
    if (isValid) {
      if (currentStep === 4) {
        // Send OTP before going to step 5
        const sent = await sendOTP();
        if (sent) {
          setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
        }
      } else {
        setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep === 3) {
      stopCamera();
    }
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFileUpload = (type: "cni" | "registreCommerce", file: File) => {
    setUploadedFiles((prev) => ({ ...prev, [type]: file }));
  };

  const removeFile = (type: "cni" | "registreCommerce") => {
    setUploadedFiles((prev) => {
      const updated = { ...prev };
      delete updated[type];
      return updated;
    });
  };

  // Send OTP
  const sendOTP = async () => {
    const email = form.getValues("email");
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

  // Verify OTP
  const verifyOTP = async () => {
    if (otp.length !== 6) return;

    const formData = form.getValues();
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
          role: "PROVIDER",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Code invalide");
        setOtp("");
        return;
      }

      // Success - redirect to provider dashboard
      router.push("/provider");
    } catch (err) {
      setError("Erreur de vérification. Veuillez réessayer.");
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const resendOTP = async () => {
    if (countdown > 0) return;
    setOtp("");
    await sendOTP();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep form={form} />;
      case 2:
        return <ProfessionalInfoStep form={form} />;
      case 3:
        return (
          <KYCStep
            uploadedFiles={uploadedFiles}
            onFileUpload={handleFileUpload}
            onRemoveFile={removeFile}
            cniInputRef={cniInputRef}
            registreInputRef={registreInputRef}
            videoRef={videoRef}
            previewVideoRef={previewVideoRef}
            videoUrl={videoUrl}
            isCameraActive={isCameraActive}
            isRecording={isRecording}
            recordingTime={recordingTime}
            cameraError={cameraError}
            onStartCamera={startCamera}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onRetakeVideo={retakeVideo}
          />
        );
      case 4:
        return <SubscriptionStep form={form} />;
      case 5:
        return (
          <OTPStep
            email={form.getValues("email")}
            otp={otp}
            setOtp={setOtp}
            error={error}
            isLoading={isLoading}
            countdown={countdown}
            onResend={resendOTP}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout
      title="Devenir prestataire"
      description="Rejoignez Allo Services CI en tant que prestataire de services"
      backHref="/register"
      backLabel="Retour"
      showBackButton={currentStep === 1}
    >
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`flex items-center ${
                step.id < currentStep
                  ? "text-blue-600"
                  : step.id === currentStep
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id < currentStep
                    ? "bg-blue-600 text-white"
                    : step.id === currentStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span className="hidden md:block ml-2 text-xs text-gray-600">{step.title}</span>
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-gray-500 mt-2 text-center">
          Étape {currentStep}: {STEPS[currentStep - 1].title}
        </p>
      </div>

      {/* Error Message */}
      {error && currentStep !== 5 && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Form */}
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          {renderStepContent()}

          {/* Navigation Buttons */}
          {currentStep !== 5 && (
            <div className="flex gap-3 mt-6">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex-1 border-gray-200"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Précédent
                </Button>
              )}

              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Suivant
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : null}
            </div>
          )}
        </form>
      </Form>

      {/* Login Link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-blue-600 font-medium hover:text-blue-700 hover:underline">
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  );
}

// Step 1: Personal Information
function PersonalInfoStep({
  form,
}: {
  form: ReturnType<typeof useForm<ProviderFormValues>>;
}) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-900">Nom complet *</FormLabel>
            <FormControl>
              <div className="relative">
                <Input placeholder="Votre nom complet" className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500" {...field} />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-900">Numéro de téléphone *</FormLabel>
            <FormControl>
              <div className="relative">
                <Input placeholder="+225 XX XX XX XX XX" className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-900">Email *</FormLabel>
            <FormControl>
              <div className="relative">
                <Input type="email" placeholder="votre@email.com" className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500" {...field} />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </FormControl>
            <FormDescription>
              Un code de vérification sera envoyé à cet email
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// Step 2: Professional Information
function ProfessionalInfoStep({ form }: { form: ReturnType<typeof useForm<ProviderFormValues>> }) {
  const selectedCategories = form.watch("categories") || [];

  const toggleCategory = (categoryId: string) => {
    const current = form.getValues("categories") || [];
    if (current.includes(categoryId)) {
      form.setValue(
        "categories",
        current.filter((c) => c !== categoryId)
      );
    } else {
      form.setValue("categories", [...current, categoryId]);
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="businessName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-900">Nom commercial / Entreprise *</FormLabel>
            <FormControl>
              <div className="relative">
                <Input placeholder="Nom de votre entreprise" className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500" {...field} />
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-900">Description de vos services *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Décrivez votre activité, vos compétences et vos services..."
                className="min-h-24 resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                maxLength={500}
                {...field}
              />
            </FormControl>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Min. 20 caractères</span>
              <span>{field.value?.length || 0}/500</span>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <Label className="text-gray-900">Catégories de services *</Label>
        <FormDescription className="mb-2 text-gray-600">
          Sélectionnez les catégories dans lesquelles vous intervenez
        </FormDescription>
        <ScrollArea className="h-40 rounded-md border border-gray-200 p-3 bg-white">
          <div className="space-y-2">
            {SERVICE_CATEGORIES.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => toggleCategory(category.id)}
                />
                <span className="text-sm text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
        </ScrollArea>
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedCategories.map((catId) => {
              const cat = SERVICE_CATEGORIES.find((c) => c.id === catId);
              return cat ? (
                <Badge key={catId} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                  {cat.name}
                </Badge>
              ) : null;
            })}
          </div>
        )}
        <FormField
          control={form.control}
          name="categories"
          render={() => <FormMessage />}
        />
      </div>

      <FormField
        control={form.control}
        name="hourlyRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-900">Tarif horaire (XOF) *</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="5000"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-900">Ville *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Sélectionnez votre ville" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <ScrollArea className="h-48">
                  {POPULAR_CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                  <div className="px-2 py-1.5 text-sm font-semibold text-gray-500">
                    Autres villes
                  </div>
                  {CITIES_CI.filter((c) => !POPULAR_CITIES.includes(c as typeof POPULAR_CITIES[number])).map(
                    (city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    )
                  )}
                </ScrollArea>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-900">Adresse détaillée *</FormLabel>
            <FormControl>
              <Input placeholder="Quartier, rue, lieu-dit..." className="border-gray-200 focus:border-blue-500 focus:ring-blue-500" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// Step 3: KYC Documents with Video Recording
function KYCStep({
  uploadedFiles,
  onFileUpload,
  onRemoveFile,
  cniInputRef,
  registreInputRef,
  videoRef,
  previewVideoRef,
  videoUrl,
  isCameraActive,
  isRecording,
  recordingTime,
  cameraError,
  onStartCamera,
  onStartRecording,
  onStopRecording,
  onRetakeVideo,
}: {
  uploadedFiles: { cni?: File; registreCommerce?: File };
  onFileUpload: (type: "cni" | "registreCommerce", file: File) => void;
  onRemoveFile: (type: "cni" | "registreCommerce") => void;
  cniInputRef: React.RefObject<HTMLInputElement>;
  registreInputRef: React.RefObject<HTMLInputElement>;
  videoRef: React.RefObject<HTMLVideoElement>;
  previewVideoRef: React.RefObject<HTMLVideoElement>;
  videoUrl: string | null;
  isCameraActive: boolean;
  isRecording: boolean;
  recordingTime: number;
  cameraError: string | null;
  onStartCamera: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onRetakeVideo: () => void;
}) {
  const remainingTime = VIDEO_DURATION - recordingTime;
  const progress = (recordingTime / VIDEO_DURATION) * 100;

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
        <p className="font-medium mb-1">Vérification d'identité requise</p>
        <p className="text-xs">
          Enregistrez une vidéo de 5 secondes pour vérifier votre identité.
        </p>
      </div>

      {/* Video Recording Section */}
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-medium text-sm text-gray-900 flex items-center gap-2">
              <Video className="h-4 w-4" />
              Vidéo de vérification *
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Enregistrez une vidéo de 5 secondes face caméra
            </p>
          </div>
          {videoUrl && (
            <Badge className="bg-green-50 text-green-700 border-green-200">
              <Check className="h-3 w-3 mr-1" />
              Enregistré
            </Badge>
          )}
        </div>

        {cameraError && (
          <Alert variant="destructive" className="mb-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{cameraError}</AlertDescription>
          </Alert>
        )}

        <div className="relative aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden">
          {videoUrl ? (
            <div className="relative w-full h-full">
              <video
                ref={previewVideoRef}
                src={videoUrl}
                controls
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={onRetakeVideo}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réenregistrer
                </Button>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
              
              {isRecording && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    REC {remainingTime}s
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-800">
                    <div 
                      className="h-full bg-red-600 transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {isCameraActive && !isRecording && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-white/50 rounded-full" />
                  </div>
                </div>
              )}

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {isCameraActive && !isRecording && (
                  <Button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={onStartRecording}
                  >
                    <Video className="h-5 w-5 mr-2" />
                    Démarrer
                  </Button>
                )}
                
                {isRecording && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onStopRecording}
                  >
                    <Square className="h-5 w-5 mr-2" />
                    Arrêter
                  </Button>
                )}
              </div>

              {!isCameraActive && !cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 gap-3">
                  <Video className="h-12 w-12 text-gray-400" />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onStartCamera}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Activer la caméra
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* CNI Upload */}
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <p className="font-medium text-sm text-gray-900">CNI (optionnel)</p>
        {uploadedFiles.cni ? (
          <div className="flex items-center gap-2 bg-gray-50 rounded p-2 mt-2">
            <FileText className="h-4 w-4 text-gray-400" />
            <span className="text-sm truncate flex-1 text-gray-700">{uploadedFiles.cni.name}</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => onRemoveFile("cni")}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 mt-2 border-dashed"
            onClick={() => cniInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        )}
        <input
          ref={cniInputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileUpload("cni", file);
          }}
        />
      </div>
    </div>
  );
}

// Step 4: Subscription Selection
function SubscriptionStep({ form }: { form: ReturnType<typeof useForm<ProviderFormValues>> }) {
  const selectedPlan = form.watch("subscriptionPlan");

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-700">
        <p className="font-medium">Choisissez votre formule d'abonnement</p>
        <p className="text-xs mt-1">Vous pouvez commencer gratuitement et upgrader plus tard.</p>
      </div>

      <div className="grid gap-4">
        {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
          <div
            key={key}
            className={`relative border rounded-lg p-4 cursor-pointer transition-all bg-white ${
              selectedPlan === key
                ? "border-blue-600 ring-2 ring-blue-100"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => form.setValue("subscriptionPlan", key as SubscriptionPlanKey)}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                <p className="text-2xl font-bold text-blue-600">{formatXOF(plan.price)}<span className="text-sm font-normal text-gray-500">/mois</span></p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${selectedPlan === key ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}>
                {selectedPlan === key && <Check className="w-3 h-3 text-white m-auto" />}
              </div>
            </div>
            <p className="text-xs text-gray-500">{plan.features?.slice(0, 3).join(" • ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Step 5: OTP Verification
function OTPStep({
  email,
  otp,
  setOtp,
  error,
  isLoading,
  countdown,
  onResend,
}: {
  email: string;
  otp: string;
  setOtp: (v: string) => void;
  error: string;
  isLoading: boolean;
  countdown: number;
  onResend: () => void;
}) {
  return (
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
        <p className="text-sm text-gray-600">Code envoyé à</p>
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
        <p className="text-sm text-gray-600 mb-2">Vous n'avez pas reçu le code ?</p>
        <Button
          variant="ghost"
          className="text-primary"
          onClick={onResend}
          disabled={countdown > 0 || isLoading}
        >
          {countdown > 0 ? `Renvoyer dans ${countdown}s` : "Renvoyer le code"}
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
  );
}
