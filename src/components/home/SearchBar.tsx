"use client";

import * as React from "react";
import { Search, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SearchBarProps {
  onSearch: (query: { service: string; city: string }) => void;
  services: { id: string; name: string; slug: string }[];
  cities: string[];
}

export function SearchBar({ onSearch, services, cities }: SearchBarProps) {
  const [selectedService, setSelectedService] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState("");
  const [searchInput, setSearchInput] = React.useState("");

  const handleSearch = () => {
    onSearch({
      service: selectedService || searchInput,
      city: selectedCity,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className={cn(
          "flex flex-col md:flex-row gap-3 p-3 md:p-4",
          "bg-white rounded-2xl shadow-lg border border-gray-200/50",
          "transition-all duration-300"
        )}
      >
        {/* Service Input/Select */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger
              className={cn(
                "w-full pl-10 h-12 md:h-14",
                "border-0 bg-gray-50 hover:bg-gray-100",
                "focus:ring-2 focus:ring-primary/20",
                "text-base"
              )}
            >
              <SelectValue placeholder="Quel service recherchez-vous ?" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {services.map((service) => (
                <SelectItem key={service.id} value={service.slug}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City Select */}
        <div className="relative md:w-64">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger
              className={cn(
                "w-full pl-10 h-12 md:h-14",
                "border-0 bg-gray-50 hover:bg-gray-100",
                "focus:ring-2 focus:ring-primary/20",
                "text-base"
              )}
            >
              <SelectValue placeholder="Ville" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className={cn(
            "h-12 md:h-14 px-8",
            "bg-primary hover:bg-primary/90",
            "text-white font-semibold",
            "rounded-xl shadow-md hover:shadow-lg",
            "transition-all duration-200"
          )}
        >
          <Search className="h-5 w-5 mr-2" />
          Rechercher
        </Button>
      </div>
    </div>
  );
}
