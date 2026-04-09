"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Power,
  Clock,
  DollarSign,
  Wrench,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { SERVICE_CATEGORIES } from "@/lib/constants/services";
import { formatPrice } from "@/lib/utils/formatters";
import { SUBSCRIPTION_PLANS } from "@/lib/constants/subscription";

// Form schema
const serviceFormSchema = z.object({
  categoryId: z.string().min(1, "Sélectionnez une catégorie"),
  subServiceName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().max(300, "La description ne peut pas dépasser 300 caractères").optional(),
  price: z.number().min(500, "Le prix minimum est de 500 FCFA"),
  duration: z.number().min(15, "La durée minimum est de 15 minutes"),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

interface Service {
  id: string;
  categoryId: string;
  categoryName: string;
  subServiceName: string;
  description?: string;
  price: number;
  duration: number; // in minutes
  isActive: boolean;
  reservationsCount: number;
}

// Mock data
const MOCK_SERVICES: Service[] = [
  {
    id: "service-1",
    categoryId: "1",
    categoryName: "Bricolage & Réparations",
    subServiceName: "Plomberie",
    description: "Intervention pour fuites, installations et dépannages sanitaires",
    price: 8000,
    duration: 60,
    isActive: true,
    reservationsCount: 45,
  },
  {
    id: "service-2",
    categoryId: "1",
    categoryName: "Bricolage & Réparations",
    subServiceName: "Électricité",
    description: "Installation et dépannage électrique, mise aux normes",
    price: 10000,
    duration: 60,
    isActive: true,
    reservationsCount: 32,
  },
  {
    id: "service-3",
    categoryId: "1",
    categoryName: "Bricolage & Réparations",
    subServiceName: "Climatisation",
    description: "Installation et maintenance de climatiseurs",
    price: 15000,
    duration: 120,
    isActive: true,
    reservationsCount: 18,
  },
  {
    id: "service-4",
    categoryId: "1",
    categoryName: "Bricolage & Réparations",
    subServiceName: "Serrurerie",
    description: "Réparation et installation de serrures, portes blindées",
    price: 12000,
    duration: 90,
    isActive: false,
    reservationsCount: 12,
  },
];

const MOCK_SUBSCRIPTION = {
  plan: "STARTER" as const,
  maxServices: SUBSCRIPTION_PLANS.STARTER.limits.maxServices,
};

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h${remainingMinutes}`;
}

export default function ProviderServicesPage() {
  const [services, setServices] = React.useState<Service[]>(MOCK_SERVICES);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      categoryId: "",
      subServiceName: "",
      description: "",
      price: 0,
      duration: 60,
    },
  });

  // Filter services
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.subServiceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || service.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeServicesCount = services.filter((s) => s.isActive).length;
  const canAddService = services.length < MOCK_SUBSCRIPTION.maxServices;

  const handleAddService = (data: ServiceFormValues) => {
    const category = SERVICE_CATEGORIES.find((c) => c.id === data.categoryId);
    if (!category) return;

    const newService: Service = {
      id: `service-${Date.now()}`,
      categoryId: data.categoryId,
      categoryName: category.name,
      subServiceName: data.subServiceName,
      description: data.description,
      price: data.price,
      duration: data.duration,
      isActive: true,
      reservationsCount: 0,
    };

    setServices((prev) => [...prev, newService]);
    setIsAddDialogOpen(false);
    form.reset();
  };

  const handleEditService = (data: ServiceFormValues) => {
    if (!selectedService) return;

    const category = SERVICE_CATEGORIES.find((c) => c.id === data.categoryId);
    if (!category) return;

    setServices((prev) =>
      prev.map((s) =>
        s.id === selectedService.id
          ? {
              ...s,
              categoryId: data.categoryId,
              categoryName: category.name,
              subServiceName: data.subServiceName,
              description: data.description,
              price: data.price,
              duration: data.duration,
            }
          : s
      )
    );
    setIsEditDialogOpen(false);
    setSelectedService(null);
    form.reset();
  };

  const handleDeleteService = () => {
    if (!selectedService) return;

    setServices((prev) => prev.filter((s) => s.id !== selectedService.id));
    setIsDeleteDialogOpen(false);
    setSelectedService(null);
  };

  const handleToggleActive = (serviceId: string) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === serviceId ? { ...s, isActive: !s.isActive } : s
      )
    );
  };

  const openEditDialog = (service: Service) => {
    setSelectedService(service);
    form.reset({
      categoryId: service.categoryId,
      subServiceName: service.subServiceName,
      description: service.description || "",
      price: service.price,
      duration: service.duration,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  // Get sub-services for selected category
  const selectedCategoryId = form.watch("categoryId");
  const selectedCategoryData = SERVICE_CATEGORIES.find(
    (c) => c.id === selectedCategoryId
  );
  const subServices = selectedCategoryData?.subServices || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mes services</h1>
          <p className="text-muted-foreground">
            Gérez les services que vous proposez à vos clients
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!canAddService}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau service</DialogTitle>
                <DialogDescription>
                  Définissez les détails de votre service
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddService)} className="space-y-4">
                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catégorie de service</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une catégorie" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SERVICE_CATEGORIES.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Sub-service */}
                  <FormField
                    control={form.control}
                    name="subServiceName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de service</FormLabel>
                        {subServices.length > 0 ? (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez un type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subServices.map((sub) => (
                                <SelectItem key={sub.name} value={sub.name}>
                                  {sub.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <FormControl>
                            <Input {...field} placeholder="Ex: Plomberie" />
                          </FormControl>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (optionnel)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Décrivez votre service..."
                            rows={2}
                            maxLength={300}
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value?.length || 0}/300 caractères
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Price and Duration */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix (FCFA)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              placeholder="8000"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Durée estimée (min)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              placeholder="60"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">Ajouter le service</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Service Limit Indicator */}
      <Card className="border-gray-200/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              <span className="font-medium">
                {services.length}/{MOCK_SUBSCRIPTION.maxServices === -1 ? "∞" : MOCK_SUBSCRIPTION.maxServices} services
              </span>
            </div>
            {!canAddService && (
              <Button variant="outline" size="sm" asChild>
                <a href="/provider/subscription">
                  <Crown className="h-4 w-4 mr-1" />
                  Augmenter la limite
                </a>
              </Button>
            )}
          </div>
          {MOCK_SUBSCRIPTION.maxServices !== -1 && (
            <Progress
              value={(services.length / MOCK_SUBSCRIPTION.maxServices) * 100}
              className="h-2"
            />
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {activeServicesCount} service(s) actif(s) • {services.length - activeServicesCount} inactif(s)
          </p>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {SERVICE_CATEGORIES.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <Card className="border-gray-200/50">
          <CardContent className="p-8 text-center">
            <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Aucun service trouvé</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== "all"
                ? "Essayez de modifier vos filtres"
                : "Commencez par ajouter votre premier service"}
            </p>
            {!searchQuery && selectedCategory === "all" && canAddService && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un service
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className={`border-gray-200/50 transition-all ${
                !service.isActive ? "opacity-60" : ""
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">
                        {service.subServiceName}
                      </CardTitle>
                      <Badge variant={service.isActive ? "default" : "secondary"}>
                        {service.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {service.categoryName}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(service)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleActive(service.id)}>
                        <Power className="h-4 w-4 mr-2" />
                        {service.isActive ? "Désactiver" : "Activer"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => openDeleteDialog(service)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                {service.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {service.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm">
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                      <span className="font-medium">{formatPrice(service.price)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(service.duration)}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {service.reservationsCount} réservation(s)
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le service</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations de votre service
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditService)} className="space-y-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie de service</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SERVICE_CATEGORIES.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subServiceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de service</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Plomberie" />
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
                    <FormLabel>Description (optionnel)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Décrivez votre service..."
                        rows={2}
                        maxLength={300}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix (FCFA)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
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
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durée (min)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Enregistrer</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le service</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le service "{selectedService?.subServiceName}" ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteService}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
