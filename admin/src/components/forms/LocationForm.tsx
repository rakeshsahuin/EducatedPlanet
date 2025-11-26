"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useGoogleMaps } from "@/components/providers/GoogleMapsProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, AlertCircle, Loader2 } from "lucide-react";
import { LocationSearch } from "./LocationSearch";
import { MapSelector } from "./MapSelector";
import { TravelRadius } from "./TravelRadius";
import { Address } from "@/lib/google-maps";
import { cn } from "@/lib/utils";

interface LocationFormProps {
  className?: string;
}

export function LocationForm({ className }: LocationFormProps) {
  const { setValue, watch, formState: { errors } } = useFormContext();
  const { isLoaded: isMapsLoaded } = useGoogleMaps();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // Watch location field
  const location = watch("location");
  const selectedRange = location?.availabilityRange;

  // Update selectedAddress when form location changes
  useEffect(() => {
    setSelectedAddress(location?.address || null);
  }, [location?.address]);

  // Handle address change
  const handleAddressChange = (address: Address | null) => {
    if (address) {
      setValue("location.address", address, { shouldValidate: true });
      // Update coordinates for geospatial queries
      setValue("location.coordinates", {
        type: "Point",
        coordinates: [address.coordinates.lng, address.coordinates.lat],
      });
    } else {
      setValue("location.address", null);
      setValue("location.coordinates", null);
    }
  };

  // Handle range change
  const handleRangeChange = (range: { value: number; unit: 'km' | 'miles' }) => {
    setValue("location.availabilityRange", range, { shouldValidate: true });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle>Location Information</CardTitle>
          <CardDescription>
            Set your teaching location and availability range
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isMapsLoaded && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading Google Maps API...</span>
            </div>
          )}
          {/* Location Search */}
          <div>
            <Label className="text-base font-medium">Teaching Location</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Search for your area or locality where you provide tutoring
            </p>

            <LocationSearch
              value={selectedAddress ?? undefined}
              onChange={handleAddressChange}
              placeholder="Search for your area, locality, or landmark..."
              error={(errors.location as any)?.address?.message as string}
            />
          </div>

          <Separator />

          {/* Map Selection */}
          <div>
            <Label className="text-base font-medium">
              <MapPin className="h-4 w-4 mr-2 inline" />
              Precise Location Selection
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              Optionally select your exact location on the map for better accuracy
            </p>

            <MapSelector
              value={selectedAddress ?? undefined}
              onChange={handleAddressChange}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Availability Range */}
          <div>
            <TravelRadius
              value={selectedRange}
              onChange={handleRangeChange}
              error={(errors.location as any)?.availabilityRange?.message as string}
            />
          </div>

          {/* Selected Location Summary */}
          {selectedAddress && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label className="text-base font-medium">Selected Location</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedAddress.address1 && `${selectedAddress.address1}, `}
                      {selectedAddress.locality}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">City & State</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedAddress.city}, {selectedAddress.state}
                    </p>
                  </div>
                  {selectedAddress.zip && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">PIN Code</p>
                      <p className="text-sm text-muted-foreground">{selectedAddress.zip}</p>
                    </div>
                  )}
                  {selectedRange && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Travel Range</p>
                      <p className="text-sm text-muted-foreground">
                        Up to {selectedRange.value} {selectedRange.unit}
                      </p>
                    </div>
                  )}
                </div>

                {/* Map Link */}
                {selectedAddress.maplink && (
                  <Alert>
                    <MapPin className="h-4 w-4" />
                    <AlertDescription>
                      View this location on{" "}
                      <a
                        href={selectedAddress.maplink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Google Maps
                      </a>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </>
          )}

          {/* Help Information */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="text-sm">
                <strong>Why location is important:</strong>
              </p>
              <ul className="text-sm mt-1 list-disc list-inside space-y-1">
                <li>Students can find tutors near their area</li>
                <li>Helps us show relevant results based on proximity</li>
                <li>Your location is shared only with interested students</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}