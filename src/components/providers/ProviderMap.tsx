"use client";

import * as React from "react";
import { MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export interface ProviderMapProps {
  city: string;
  address?: string;
  lat?: number;
  lng?: number;
  className?: string;
}

export function ProviderMap({ city, address, lat, lng, className }: ProviderMapProps) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // For now, this is a placeholder component
  // In the future, we can integrate Leaflet or OpenStreetMap

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        <div
          ref={mapRef}
          className="relative h-64 bg-gradient-to-br from-blue-50 to-blue-100"
        >
          {/* Map Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
            <div className="relative">
              {/* Pulse Animation */}
              <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping" />
              <div className="relative bg-primary text-white p-2 rounded-full shadow-lg">
                <MapPin className="h-6 w-6" />
              </div>
              {/* Arrow pointing down */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-primary" />
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-3 border-t">
            <div className="flex items-start gap-2">
              <Navigation className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">{city}</p>
                {address && (
                  <p className="text-xs text-muted-foreground">{address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Zoom Controls Placeholder */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <button className="w-8 h-8 bg-white rounded shadow flex items-center justify-center text-gray-600 hover:bg-gray-50">
              +
            </button>
            <button className="w-8 h-8 bg-white rounded shadow flex items-center justify-center text-gray-600 hover:bg-gray-50">
              −
            </button>
          </div>

          {/* Map Attribution */}
          <div className="absolute bottom-12 right-2 text-xs text-gray-500 bg-white/80 px-1 rounded">
            © OpenStreetMap
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProviderMap;
