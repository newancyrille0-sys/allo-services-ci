"use client";

import * as React from "react";
import { MapPin, Crosshair, Loader2, Check, AlertCircle, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { POPULAR_CITIES, CITIES_CI } from "@/lib/constants/cities";

// Villes de Côte d'Ivoire avec coordonnées GPS
const CITIES_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Abidjan": { lat: 5.3599, lng: -4.0083 },
  "Abobo": { lat: 5.4292, lng: -4.0167 },
  "Adjamé": { lat: 5.3667, lng: -4.0167 },
  "Attécoubé": { lat: 5.3833, lng: -4.0333 },
  "Cocody": { lat: 5.3333, lng: -3.9833 },
  "Koumassi": { lat: 5.3000, lng: -3.9667 },
  "Marcory": { lat: 5.3167, lng: -4.0000 },
  "Plateau": { lat: 5.3333, lng: -4.0333 },
  "Treichville": { lat: 5.3000, lng: -4.0167 },
  "Yopougon": { lat: 5.2667, lng: -4.0833 },
  "Bingerville": { lat: 5.3500, lng: -3.8833 },
  "Songon": { lat: 5.2167, lng: -4.1500 },
  "Riviera": { lat: 5.3667, lng: -3.9333 },
  "Bouaké": { lat: 7.6892, lng: -5.0308 },
  "Yamoussoukro": { lat: 6.8167, lng: -5.2833 },
  "Daloa": { lat: 6.8778, lng: -6.4494 },
  "San-Pédro": { lat: 4.7500, lng: -6.6333 },
  "Korhogo": { lat: 9.4583, lng: -5.6333 },
  "Man": { lat: 7.4064, lng: -7.5558 },
  "Gagnoa": { lat: 6.1333, lng: -5.9500 },
  "Divo": { lat: 5.8333, lng: -5.3667 },
  "Abengourou": { lat: 6.7333, lng: -3.5000 },
  "Agboville": { lat: 5.9333, lng: -4.2167 },
  "Grand-Bassam": { lat: 5.2167, lng: -3.7333 },
  "Assinie": { lat: 5.1000, lng: -3.4833 },
};

// Coordonnées limites de la Côte d'Ivoire
const IVORY_COAST_BOUNDS = {
  minLat: 4.0,
  maxLat: 10.5,
  minLng: -8.5,
  maxLng: -2.0,
};

// Vérifie si les coordonnées sont en Côte d'Ivoire
function isInIvoryCoast(lat: number, lng: number): boolean {
  return (
    lat >= IVORY_COAST_BOUNDS.minLat &&
    lat <= IVORY_COAST_BOUNDS.maxLat &&
    lng >= IVORY_COAST_BOUNDS.minLng &&
    lng <= IVORY_COAST_BOUNDS.maxLng
  );
}

interface GPSLocationPickerProps {
  value?: {
    latitude: number | null;
    longitude: number | null;
    city?: string;
  };
  onChange: (location: { latitude: number; longitude: number; city?: string }) => void;
  onError?: (error: string) => void;
}

export function GPSLocationPicker({ value, onChange, onError }: GPSLocationPickerProps) {
  const [isLocating, setIsLocating] = React.useState(false);
  const [locationError, setLocationError] = React.useState<string | null>(null);
  const [selectedCity, setSelectedCity] = React.useState<string>(value?.city || "");
  const [manualLat, setManualLat] = React.useState<string>(
    value?.latitude?.toString() || ""
  );
  const [manualLng, setManualLng] = React.useState<string>(
    value?.longitude?.toString() || ""
  );

  // Géolocalisation automatique
  const handleGetCurrentLocation = async () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      const error = "La géolocalisation n'est pas supportée par votre navigateur";
      setLocationError(error);
      onError?.(error);
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Vérifier que les coordonnées sont en Côte d'Ivoire
        if (!isInIvoryCoast(latitude, longitude)) {
          const error = "Votre position n'est pas en Côte d'Ivoire. Les prestataires doivent être situés en Côte d'Ivoire.";
          setLocationError(error);
          onError?.(error);
          setIsLocating(false);
          return;
        }

        setManualLat(latitude.toFixed(6));
        setManualLng(longitude.toFixed(6));
        onChange({ latitude, longitude, city: selectedCity });
        setLocationError(null);
        setIsLocating(false);
      },
      (error) => {
        let errorMessage = "Erreur lors de la géolocalisation";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Accès à la localisation refusé. Veuillez autoriser l'accès dans les paramètres de votre navigateur.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Position non disponible. Veuillez réessayer.";
            break;
          case error.TIMEOUT:
            errorMessage = "Délai d'attente dépassé. Veuillez réessayer.";
            break;
        }
        setLocationError(errorMessage);
        onError?.(errorMessage);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Sélection de ville avec coordonnées prédéfinies
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    const coords = CITIES_COORDINATES[city];
    if (coords) {
      setManualLat(coords.lat.toFixed(6));
      setManualLng(coords.lng.toFixed(6));
      onChange({ latitude: coords.lat, longitude: coords.lng, city });
    }
  };

  // Saisie manuelle des coordonnées
  const handleManualCoordinates = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng)) {
      setLocationError("Coordonnées GPS invalides");
      return;
    }

    if (!isInIvoryCoast(lat, lng)) {
      setLocationError("Les coordonnées doivent être situées en Côte d'Ivoire");
      return;
    }

    setLocationError(null);
    onChange({ latitude: lat, longitude: lng, city: selectedCity });
  };

  // Vérifier si les coordonnées actuelles sont valides
  const hasValidCoordinates = 
    value?.latitude && 
    value?.longitude && 
    isInIvoryCoast(value.latitude, value.longitude);

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Localisation GPS
        </CardTitle>
        <CardDescription>
          Définissez votre position exacte pour apparaître sur la carte. Obligatoire pour les prestataires.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* État actuel */}
        {hasValidCoordinates && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <Check className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">Position enregistrée</p>
              <p className="text-xs text-green-600">
                Lat: {value?.latitude?.toFixed(6)}, Lng: {value?.longitude?.toFixed(6)}
                {value?.city && ` - ${value.city}`}
              </p>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
              Côte d'Ivoire ✓
            </Badge>
          </div>
        )}

        {/* Message d'erreur */}
        {locationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{locationError}</AlertDescription>
          </Alert>
        )}

        {/* Option 1: Géolocalisation automatique */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Option 1: Utiliser ma position actuelle</Label>
          <Button
            type="button"
            variant="outline"
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="w-full"
          >
            {isLocating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Localisation en cours...
              </>
            ) : (
              <>
                <Crosshair className="mr-2 h-4 w-4" />
                Me géolocaliser automatiquement
              </>
            )}
          </Button>
          <p className="text-xs text-gray-500">
            Nécessite l'autorisation d'accès à votre position
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Ou</span>
          </div>
        </div>

        {/* Option 2: Sélection de ville */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Option 2: Sélectionner ma ville</Label>
          <Select onValueChange={handleCitySelect} value={selectedCity}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une ville..." />
            </SelectTrigger>
            <SelectContent>
              {POPULAR_CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            Les coordonnées GPS seront automatiquement définies pour le centre de la ville
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Ou</span>
          </div>
        </div>

        {/* Option 3: Coordonnées manuelles */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Option 3: Entrer les coordonnées GPS</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="latitude" className="text-xs text-gray-500">Latitude</Label>
              <Input
                id="latitude"
                placeholder="Ex: 5.359900"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                onBlur={handleManualCoordinates}
              />
            </div>
            <div>
              <Label htmlFor="longitude" className="text-xs text-gray-500">Longitude</Label>
              <Input
                id="longitude"
                placeholder="Ex: -4.008300"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                onBlur={handleManualCoordinates}
              />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Format décimal (ex: 5.3599, -4.0083 pour Abidjan)
          </p>
        </div>

        {/* Aperçu sur la carte */}
        {hasValidCoordinates && (
          <div className="mt-4">
            <Label className="text-sm font-medium mb-2 block">Aperçu de votre position</Label>
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${value?.latitude},${value?.longitude}&zoom=15&maptype=roadmap`}
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        )}

        {/* Informations sur les limites */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <p className="text-xs text-blue-700 flex items-start gap-2">
            <Navigation className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Important:</strong> Votre position doit être située en Côte d'Ivoire 
              (Latitude: {IVORY_COAST_BOUNDS.minLat}° à {IVORY_COAST_BOUNDS.maxLat}°, 
              Longitude: {IVORY_COAST_BOUNDS.minLng}° à {IVORY_COAST_BOUNDS.maxLng}°).
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default GPSLocationPicker;
