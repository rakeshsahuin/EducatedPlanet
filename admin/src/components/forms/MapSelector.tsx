"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useGoogleMaps } from "@/components/providers/GoogleMapsProvider";
import { Loader2, Crosshair, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Address, extractAddressComponents, getDefaultMapCenter } from "@/lib/google-maps";

interface MapSelectorProps {
  value?: Address;
  onChange: (address: Address | null) => void;
  disabled?: boolean;
  className?: string;
}

// Custom map component
function MapComponent({
  onLocationSelect,
  initialLocation,
  className,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation?: { lat: number; lng: number };
  className?: string;
}) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  // Initialize map
  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    mapRef.current = mapInstance;
    setMap(mapInstance);

    // Initialize geocoder
    const geocoderInstance = new google.maps.Geocoder();
    setGeocoder(geocoderInstance);

    // Set initial marker if location provided
    if (initialLocation) {
      const marker = new google.maps.Marker({
        position: initialLocation,
        map: mapInstance,
        draggable: true,
      });

      marker.addListener("dragend", () => {
        const position = marker.getPosition();
        if (position) {
          onLocationSelect(position.lat(), position.lng());
        }
      });

      markerRef.current = marker;
      mapInstance.setCenter(initialLocation);
    }

    // Add click listener to map
    mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (!e.latLng || !isSelecting) return;

      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      // Move or create marker
      if (markerRef.current) {
        markerRef.current.setPosition({ lat, lng });
      } else {
        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: mapInstance,
          draggable: true,
        });

        marker.addListener("dragend", () => {
          const position = marker.getPosition();
          if (position) {
            onLocationSelect(position.lat(), position.lng());
          }
        });

        markerRef.current = marker;
      }

      onLocationSelect(lat, lng);
    });
  }, [initialLocation, onLocationSelect, isSelecting]);

  // Handle current location
  const handleCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map?.panTo({ lat: latitude, lng: longitude });

        // Update marker
        if (markerRef.current) {
          markerRef.current.setPosition({ lat: latitude, lng: longitude });
        } else {
          const marker = new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: map!,
            draggable: true,
          });

          marker.addListener("dragend", () => {
            const pos = marker.getPosition();
            if (pos) {
              onLocationSelect(pos.lat(), pos.lng());
            }
          });

          markerRef.current = marker;
        }

        onLocationSelect(latitude, longitude);
      },
      (error) => {
        alert("Unable to get your location: " + error.message);
      }
    );
  }, [map, onLocationSelect]);

  const { isLoaded, maps } = useGoogleMaps();

  if (!isLoaded || !maps) {
    return (
      <div className="flex items-center justify-center h-96 w-full bg-muted rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Now that we know Google Maps is loaded, we can render the map
  return <MapComponentInternal />;

  function MapComponentInternal() {
    return (
      <div className={cn("relative h-96 w-full rounded-lg overflow-hidden", className)}>
        <div className="absolute top-4 left-4 z-10 space-y-2">
          <Button
            type="button"
            variant={isSelecting ? "default" : "secondary"}
            size="sm"
            onClick={() => setIsSelecting(!isSelecting)}
            className="shadow-lg"
          >
            <MapPin className="h-4 w-4 mr-2" />
            {isSelecting ? "Click on map to select" : "Enable selection"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleCurrentLocation}
            className="shadow-lg"
          >
            <Crosshair className="h-4 w-4 mr-2" />
            Use my location
          </Button>
        </div>

        {isSelecting && (
          <div className="absolute top-20 left-4 z-10 bg-background border rounded-md p-2 shadow-lg max-w-xs">
            <p className="text-sm">Click anywhere on the map to select location</p>
          </div>
        )}

        <div
          style={{ width: "100%", height: "100%" }}
          ref={(mapElement) => {
            if (mapElement) {
              const mapInstance = new google.maps.Map(mapElement, {
                center: initialLocation || getDefaultMapCenter(),
                zoom: initialLocation ? 15 : 12,
                mapTypeControl: true,
                streetViewControl: true,
                fullscreenControl: false,
                zoomControl: true,
                styles: [
                  {
                      featureType: "poi",
                      elementType: "labels",
                      stylers: [{ visibility: "off" }],
                    },
                  ],
              });
              handleMapLoad(mapInstance);
            }
          }}
        />
      </div>
    );
  }
}

export function MapSelector({ value, onChange, disabled, className }: MapSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    value?.coordinates || null
  );
  const { isLoaded } = useGoogleMaps();

  // Sync internal state with prop value
  useEffect(() => {
    setSelectedLocation(value?.coordinates || null);
  }, [value]);

  // Handle location selection from map
  const handleLocationSelect = useCallback(
    async (lat: number, lng: number) => {
      setIsLoading(true);
      setSelectedLocation({ lat, lng });

      try {
        // Reverse geocode to get address
        const geocoder = new google.maps.Geocoder();
        const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results) {
              resolve(results);
            } else {
              reject(new Error("Geocoding failed"));
            }
          });
        });

        if (result.length > 0) {
          const place = result[0];
          const address = extractAddressComponents({
            address_components: place.address_components,
            geometry: place.geometry,
            formatted_address: place.formatted_address,
          });

          if (address) {
            onChange(address);
          }
        }
      } catch (error) {
        console.error("Error reverse geocoding:", error);
        // Fallback: create minimal address from coordinates
        const fallbackAddress: Address = {
          locality: "Selected Location",
          city: "Unknown",
          state: "Unknown",
          country: "IN",
          coordinates: { lat, lng },
          maplink: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        };
        onChange(fallbackAddress);
      } finally {
        setIsLoading(false);
      }
    },
    [onChange]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild disabled={disabled || !isLoaded}>
        <Button
          type="button"
          variant="outline"
          className={cn("w-full", className)}
        >
          {isLoaded ? (
            <>
              <MapPin className="h-4 w-4 mr-2" />
              {value ? "Change location on map" : "Select from map"}
            </>
          ) : (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading map...
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select Location on Map</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {value && (
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Badge variant="secondary">
                Currently: {value.locality}, {value.city}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Click on the map to update
              </span>
            </div>
          )}

          <Alert>
            <AlertDescription>
              Click the "Enable selection" button, then click anywhere on the map to select a location.
              You can drag the marker to adjust the exact position.
            </AlertDescription>
          </Alert>

          <MapComponent
            onLocationSelect={handleLocationSelect}
            initialLocation={value?.coordinates}
          />

          {selectedLocation && (
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <div className="text-sm">
                Selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </div>
              <Button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Confirm Selection
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}