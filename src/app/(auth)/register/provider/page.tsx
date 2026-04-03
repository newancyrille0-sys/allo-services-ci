"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Loader2,
  Check,
  User,
  Phone,
  Mail,
  Building,
  FileText,
  Upload,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
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
import { useAuth } from "@/hooks/useAuth";
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
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Doit contenir au moins un chiffre"),
});

const professionalInfoSchema = z.object({
  businessName: z.string().min(2, "Le nom commercial est requis"),
  description: z.string().min(20, "Description minimale de 20 caractères").max(500),
  categories: z.array(z.string()).min(1, "Sélectionnez au moins une catégorie"),
  hourlyRate: z.number().min(1000, "Tarif minimum: 1000 XOF"),
  city: z.string().min(1, "Sélectionnez une ville"),
  address: z.string().min(5, "Adresse trop courte"),
});

const kycSchema = z.object({
  cniFile: z.any().optional(),
  registreCommerceFile: z.any().optional(),
  profilePhotoFile: z.any().optional(),
});

const subscriptionSchema = z.object({
  subscriptionPlan: z.enum(["FREE", "MONTHLY", "PREMIUM"]),
});

const providerSchema = personalInfoSchema
  .merge(professionalInfoSchema)
  .merge(kycSchema)
  .merge(subscriptionSchema);

type ProviderFormValues = z.infer<typeof providerSchema>;

const STEPS = [
  { id: 1, title: "Informations personnelles", description: "Vos coordonnées" },
  { id: 2, title: "Informations professionnelles", description: "Votre activité" },
  { id: 3, title: "Documents KYC", description: "Vérification d'identité" },
  { id: 4, title: "Choix de l'abonnement", description: "Sélectionnez votre offre" },
];

export default function ProviderRegisterPage() {
  const router = useRouter();
  const { registerProvider, error, clearError, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{
    cni?: File;
    registreCommerce?: File;
    profilePhoto?: File;
  }>({});

  const cniInputRef = useRef<HTMLInputElement>(null);
  const registreInputRef = useRef<HTMLInputElement>(null);
  const profilePhotoRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
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

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof ProviderFormValues)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ["fullName", "phone", "email", "password"];
        break;
      case 2:
        fieldsToValidate = ["businessName", "description", "categories", "hourlyRate", "city", "address"];
        break;
      case 3:
        // KYC is optional for now
        return true;
      case 4:
        fieldsToValidate = ["subscriptionPlan"];
        break;
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    clearError();
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFileUpload = (type: "cni" | "registreCommerce" | "profilePhoto", file: File) => {
    setUploadedFiles((prev) => ({ ...prev, [type]: file }));
    if (type === "cni") {
      form.setValue("cniFile", file);
    } else if (type === "registreCommerce") {
      form.setValue("registreCommerceFile", file);
    } else {
      form.setValue("profilePhotoFile", file);
    }
  };

  const removeFile = (type: "cni" | "registreCommerce" | "profilePhoto") => {
    setUploadedFiles((prev) => {
      const updated = { ...prev };
      delete updated[type];
      return updated;
    });
  };

  const onSubmit = async (data: ProviderFormValues) => {
    clearError();
    const result = await registerProvider({
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      password: data.password,
      businessName: data.businessName,
      description: data.description,
      categories: data.categories,
      hourlyRate: data.hourlyRate,
      city: data.city,
      address: data.address,
      cniFile: uploadedFiles.cni,
      registreCommerceFile: uploadedFiles.registreCommerce,
      profilePhotoFile: uploadedFiles.profilePhoto,
      subscriptionPlan: data.subscriptionPlan as SubscriptionPlanKey,
    });

    if (result.success) {
      router.push("/verify-otp");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep form={form} showPassword={showPassword} setShowPassword={setShowPassword} />;
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
            profilePhotoRef={profilePhotoRef}
          />
        );
      case 4:
        return <SubscriptionStep form={form} />;
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
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {renderStepContent()}

          {/* Navigation Buttons */}
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
              >
                Suivant
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inscription en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Finaliser mon inscription
                  </>
                )}
              </Button>
            )}
          </div>
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
  showPassword,
  setShowPassword,
}: {
  form: ReturnType<typeof useForm<ProviderFormValues>>;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
}) {
  const password = form.watch("password");
  const passwordRequirements = [
    { label: "Au moins 8 caractères", test: (p: string) => p.length >= 8 },
    { label: "Une majuscule", test: (p: string) => /[A-Z]/.test(p) },
    { label: "Une minuscule", test: (p: string) => /[a-z]/.test(p) },
    { label: "Un chiffre", test: (p: string) => /[0-9]/.test(p) },
  ];

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
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-900">Mot de passe *</FormLabel>
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
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormControl>
            <div className="mt-2 space-y-1">
              {passwordRequirements.map((req, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 text-xs ${
                    req.test(password || "") ? "text-green-600" : "text-gray-400"
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

// Step 3: KYC Documents
// File Upload Card Component (moved outside to fix lint error)
function FileUploadCard({
  title,
  description,
  type,
  file,
  inputRef,
  onFileUpload,
  onRemoveFile,
  accept = "image/*,.pdf",
}: {
  title: string;
  description: string;
  type: "cni" | "registreCommerce" | "profilePhoto";
  file?: File;
  inputRef: React.RefObject<HTMLInputElement>;
  onFileUpload: (type: "cni" | "registreCommerce" | "profilePhoto", file: File) => void;
  onRemoveFile: (type: "cni" | "registreCommerce" | "profilePhoto") => void;
  accept?: string;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-medium text-sm text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        {file && (
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
            Ajouté
          </Badge>
        )}
      </div>
      {file ? (
        <div className="flex items-center gap-2 bg-gray-50 rounded p-2">
          <FileText className="h-4 w-4 text-gray-400" />
          <span className="text-sm truncate flex-1 text-gray-700">{file.name}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemoveFile(type)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full h-20 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50"
          onClick={() => inputRef.current?.click()}
        >
          <div className="text-center">
            <Upload className="h-6 w-6 mx-auto mb-1 text-gray-400" />
            <span className="text-xs text-gray-500">Cliquez pour télécharger</span>
          </div>
        </Button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const uploadedFile = e.target.files?.[0];
          if (uploadedFile) onFileUpload(type, uploadedFile);
        }}
      />
    </div>
  );
}

function KYCStep({
  uploadedFiles,
  onFileUpload,
  onRemoveFile,
  cniInputRef,
  registreInputRef,
  profilePhotoRef,
}: {
  uploadedFiles: { cni?: File; registreCommerce?: File; profilePhoto?: File };
  onFileUpload: (type: "cni" | "registreCommerce" | "profilePhoto", file: File) => void;
  onRemoveFile: (type: "cni" | "registreCommerce" | "profilePhoto") => void;
  cniInputRef: React.RefObject<HTMLInputElement>;
  registreInputRef: React.RefObject<HTMLInputElement>;
  profilePhotoRef: React.RefObject<HTMLInputElement>;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
        <p className="font-medium mb-1">Pourquoi vérifier votre identité ?</p>
        <p className="text-xs">
          Les prestataires vérifiés obtiennent plus de réservations et gagnent la confiance des clients.
        </p>
      </div>

      <FileUploadCard
        title="Carte Nationale d'Identité (CNI) *"
        description="Recto-verso de votre CNI"
        type="cni"
        file={uploadedFiles.cni}
        inputRef={cniInputRef}
        onFileUpload={onFileUpload}
        onRemoveFile={onRemoveFile}
      />

      <FileUploadCard
        title="Registre de Commerce (optionnel)"
        description="Pour les entreprises formelles"
        type="registreCommerce"
        file={uploadedFiles.registreCommerce}
        inputRef={registreInputRef}
        onFileUpload={onFileUpload}
        onRemoveFile={onRemoveFile}
      />

      <FileUploadCard
        title="Photo de profil"
        description="Photo professionnelle"
        type="profilePhoto"
        file={uploadedFiles.profilePhoto}
        inputRef={profilePhotoRef}
        accept="image/*"
        onFileUpload={onFileUpload}
        onRemoveFile={onRemoveFile}
      />
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
        <p className="text-xs mt-1">
          Vous pouvez commencer gratuitement et upgrader plus tard.
        </p>
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
            {plan.popular && (
              <div className="absolute -top-3 left-4">
                <Badge className="bg-blue-600 text-white text-xs">Populaire</Badge>
              </div>
            )}

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === key ? "border-blue-600 bg-blue-600" : "border-gray-300"
                  }`}
                >
                  {selectedPlan === key && <Check className="h-3 w-3 text-white" />}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{plan.name}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {plan.price === 0 ? "Gratuit" : formatXOF(plan.price)}
                    {plan.price > 0 && (
                      <span className="text-sm font-normal text-gray-500">/mois</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <ul className="mt-3 space-y-1 ml-8">
              {plan.features.slice(0, 4).map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="h-3 w-3 text-green-500" />
                  {feature}
                </li>
              ))}
              {plan.features.length > 4 && (
                <li className="text-xs text-gray-400">+{plan.features.length - 4} autres avantages</li>
              )}
            </ul>
          </div>
        ))}
      </div>

      <FormField
        control={form.control}
        name="subscriptionPlan"
        render={() => <FormMessage />}
      />
    </div>
  );
}
