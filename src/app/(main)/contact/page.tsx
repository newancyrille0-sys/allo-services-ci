"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  MessageCircle,
  Send,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Veuillez sélectionner un sujet"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const subjects = [
  { value: "general", label: "Question générale" },
  { value: "support", label: "Support technique" },
  { value: "partnership", label: "Partenariat" },
  { value: "provider", label: "Devenir prestataire" },
  { value: "complaint", label: "Réclamation" },
  { value: "other", label: "Autre" },
];

const contactInfo = [
  {
    icon: MapPin,
    title: "Adresse",
    content: "Abidjan, Plateau\nCôte d'Ivoire",
  },
  {
    icon: Phone,
    title: "Téléphone",
    content: "+225 07 00 00 00 00\n+225 01 00 00 00 00",
  },
  {
    icon: Mail,
    title: "Email",
    content: "contact@alloservices.ci\nsupport@alloservices.ci",
  },
  {
    icon: Clock,
    title: "Horaires",
    content: "Lun - Ven: 8h - 18h\nSam: 9h - 14h",
  },
];

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://facebook.com/alloservicesci" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/alloservicesci" },
  { name: "WhatsApp", icon: MessageCircle, href: "https://wa.me/2250700000000" },
];

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Form data:", data);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    form.reset();
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-blue-600 hover:text-blue-700">Accueil</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900">Contact</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Contactez-nous
          </h1>
          <p className="text-gray-600">
            Vous avez une question, une suggestion ou besoin d&apos;aide ? Notre équipe
            est là pour vous accompagner. Remplissez le formulaire ci-dessous et nous
            vous répondrons dans les plus brefs délais.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      Message envoyé !
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Merci pour votre message. Notre équipe vous répondra dans les
                      plus brefs délais.
                    </p>
                    <Button variant="outline" onClick={handleReset} className="border-gray-200">
                      Envoyer un autre message
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-900">Nom complet *</FormLabel>
                              <FormControl>
                                <Input placeholder="Votre nom" className="border-gray-200 focus:border-blue-500 focus:ring-blue-500" {...field} />
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
                                <Input
                                  type="email"
                                  placeholder="votre@email.com"
                                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-900">Téléphone</FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="+225 07 00 00 00 00"
                                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-900">Sujet *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                                    <SelectValue placeholder="Sélectionnez un sujet" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {subjects.map((subject) => (
                                    <SelectItem key={subject.value} value={subject.value}>
                                      {subject.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900">Message *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Décrivez votre demande en détail..."
                                className="min-h-[150px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Envoyer le message
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Contact Cards */}
            {contactInfo.map((info) => (
              <Card key={info.title} className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <info.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">{info.title}</h3>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {info.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Social Links */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 mb-4">Suivez-nous</h3>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors"
                      aria-label={social.name}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FAQ Link */}
            <Card className="bg-blue-50 border border-blue-100">
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 mb-2">Besoin d&apos;aide rapide ?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Consultez notre FAQ pour trouver des réponses aux questions les plus
                  fréquentes.
                </p>
                <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-100" asChild>
                  <a href="/faq">Consulter la FAQ</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
