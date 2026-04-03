"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Home, 
  Search, 
  Wrench, 
  Users, 
  ArrowLeft,
  MapPin 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/services?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const popularServices = [
    { name: "Bricolage", icon: Wrench, href: "/services/bricolage" },
    { name: "Ménage", icon: Home, href: "/services/menage" },
    { name: "Jardinage", icon: MapPin, href: "/services/jardinage" },
    { name: "Prestataires", icon: Users, href: "/providers" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">AS</span>
            </div>
            <span className="font-bold text-xl">
              Allo<span className="text-primary">Services</span>
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center">
                {/* 404 Illustration */}
                <div className="relative mb-8">
                  <div className="text-[120px] md:text-[180px] font-bold text-muted/20 leading-none select-none">
                    404
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-primary/10 rounded-full p-6">
                      <Search className="w-16 h-16 md:w-20 md:h-20 text-primary animate-bounce-subtle" />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold mb-3">
                  Page non trouvée
                </h1>

                {/* Description */}
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  La page que vous recherchez n&apos;existe pas ou a été déplacée. 
                  Ne vous inquiétez pas, nous pouvons vous aider à trouver ce que vous cherchez.
                </p>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="mb-8">
                  <div className="flex gap-2 max-w-md mx-auto">
                    <Input
                      type="text"
                      placeholder="Rechercher un service..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit">
                      <Search className="w-4 h-4 mr-2" />
                      Rechercher
                    </Button>
                  </div>
                </form>

                {/* Quick Links */}
                <div className="mb-8">
                  <p className="text-sm text-muted-foreground mb-4">
                    Pages populaires
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {popularServices.map((service) => (
                      <Link
                        key={service.name}
                        href={service.href}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <service.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-sm font-medium">{service.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Back to Home */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="lg">
                    <Link href="/">
                      <Home className="w-4 h-4 mr-2" />
                      Retour à l&apos;accueil
                    </Link>
                  </Button>
                  <Button variant="outline" asChild size="lg">
                    <Link href="/services">
                      <Search className="w-4 h-4 mr-2" />
                      Voir les services
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Text */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Besoin d&apos;aide ?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contactez notre support
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Allo Services CI. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
