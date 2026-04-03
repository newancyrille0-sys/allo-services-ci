"use client";

import * as React from "react";
import Link from "next/link";
import {
  Wrench,
  Sparkles,
  Scissors,
  GraduationCap,
  Truck,
  PartyPopper,
  Heart,
  Laptop,
  Trees,
  Building,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    providerCount?: number;
  };
}

const iconMap: Record<string, LucideIcon> = {
  Wrench,
  Sparkles,
  Scissors,
  GraduationCap,
  Truck,
  PartyPopper,
  Heart,
  Laptop,
  Trees,
  Building,
};

const colorVariants: Record<string, { bg: string; icon: string }> = {
  Wrench: { bg: "bg-blue-500/10 group-hover:bg-blue-500/20", icon: "text-blue-500" },
  Sparkles: { bg: "bg-pink-500/10 group-hover:bg-pink-500/20", icon: "text-pink-500" },
  Scissors: { bg: "bg-purple-500/10 group-hover:bg-purple-500/20", icon: "text-purple-500" },
  GraduationCap: { bg: "bg-indigo-500/10 group-hover:bg-indigo-500/20", icon: "text-indigo-500" },
  Truck: { bg: "bg-orange-500/10 group-hover:bg-orange-500/20", icon: "text-orange-500" },
  PartyPopper: { bg: "bg-yellow-500/10 group-hover:bg-yellow-500/20", icon: "text-yellow-500" },
  Heart: { bg: "bg-red-500/10 group-hover:bg-red-500/20", icon: "text-red-500" },
  Laptop: { bg: "bg-cyan-500/10 group-hover:bg-cyan-500/20", icon: "text-cyan-500" },
  Trees: { bg: "bg-green-500/10 group-hover:bg-green-500/20", icon: "text-green-500" },
  Building: { bg: "bg-slate-500/10 group-hover:bg-slate-500/20", icon: "text-slate-500" },
};

export function ServiceCard({ service }: ServiceCardProps) {
  const IconComponent = iconMap[service.icon] || Wrench;
  const colors = colorVariants[service.icon] || colorVariants.Wrench;

  return (
    <Link href={`/services/${service.slug}`} className="block">
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-300 cursor-pointer",
          "hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10",
          "border border-gray-200/50 hover:border-primary/20"
        )}
      >
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            {/* Icon Container */}
            <div
              className={cn(
                "rounded-xl p-4 transition-all duration-300",
                colors.bg
              )}
            >
              <IconComponent className={cn("h-8 w-8", colors.icon)} />
            </div>

            {/* Service Name */}
            <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
              {service.name}
            </h3>

            {/* Provider Count */}
            {service.providerCount !== undefined && (
              <span className="text-sm text-muted-foreground">
                {service.providerCount} prestataire
                {service.providerCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
