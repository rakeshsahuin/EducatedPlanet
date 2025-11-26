"use client";

import { useState, useCallback, useRef } from "react";
import { useGoogleMaps } from "@/components/providers/GoogleMapsProvider";
import usePlacesAutocomplete, {
  getGeocode,
  getDetails,
} from "use-places-autocomplete";
import { Loader2, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { extractAddressComponents, sessionTokenManager, debounce } from "@/lib/google-maps";
import { Address } from "@/lib/google-maps";

interface LocationSearchProps {
  value?: Address;
  onChange: (address: Address | null) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

export function LocationSearch({
  value,
  onChange,
  placeholder = "Search area or locality...",
  className,
  error,
}: LocationSearchProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(value || null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isLoaded } = useGoogleMaps();

  // Only initialize usePlacesAutocomplete when Google Maps is loaded
  const {
    ready,
    value: searchValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      // Restrict to India for better results
      componentRestrictions: { country: ["in"] },
      // Bias to current location if available
      types: ["address"],
      fields: ["address_components", "formatted_address", "geometry", "place_id"],
    },
    debounce: 300,
    cache: 24 * 60 * 60 * 1000, // 24 hours
    defaultValue: selectedAddress?.locality || "",
    initOnMount: isLoaded, // Initialize only when Google Maps is loaded
  });

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [setValue]
  );

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback(
    async (suggestion: google.maps.places.AutocompletePrediction) => {
      if (!ready) return;

      setIsLoading(true);
      clearSuggestions();

      try {
        // Use session token for billing optimization
        const sessionToken = sessionTokenManager.getToken();

        // Get place details
        const placeDetails = await getDetails({
          placeId: suggestion.place_id,
          fields: ["address_components", "formatted_address", "geometry", "name"],
          sessionToken,
        });

        // Extract structured address
        const address = extractAddressComponents(placeDetails);
        if (address) {
          setSelectedAddress(address);
          onChange(address);
          setValue(address.locality, false);
        }
      } catch (error) {
        console.error("Error fetching place details:", error);
        // Fallback to geocoding
        try {
          const results = await getGeocode({ placeId: suggestion.place_id });
          if (results.length > 0) {
            const place = results[0] as any;
            const address = extractAddressComponents({
              address_components: place.address_components,
              geometry: place.geometry,
              formatted_address: place.formatted_address,
            });
            if (address) {
              setSelectedAddress(address);
              onChange(address);
              setValue(address.locality, false);
            }
          }
        } catch (fallbackError) {
          console.error("Error in fallback geocoding:", fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [ready, clearSuggestions, onChange, setValue]
  );

  // Clear selected location
  const handleClear = useCallback(() => {
    setSelectedAddress(null);
    onChange(null);
    setValue("", false);
    inputRef.current?.focus();
  }, [onChange, setValue]);

  // Keyboard navigation for suggestions
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        clearSuggestions();
      }
    },
    [clearSuggestions]
  );

  return (
    <div className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <Input
          ref={inputRef}
          value={isLoaded ? searchValue : ""}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={isLoaded ? placeholder : "Loading location search..."}
          disabled={!isLoaded || !ready}
          className={cn(
            "pr-20",
            error && "border-destructive focus:ring-destructive"
          )}
        />
        {(!isLoaded || isLoading) && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {!isLoading && isLoaded && selectedAddress && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        {!isLoading && isLoaded && !selectedAddress && (
          <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isLoaded && status === "OK" && data.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <ul className="max-h-60 overflow-auto p-1">
            {data.map((suggestion) => {
              const {
                place_id,
                structured_formatting: {
                  main_text,
                  secondary_text,
                  main_text_matched_substrings,
                },
              } = suggestion;

              return (
                <li key={place_id}>
                  <button
                    type="button"
                    className="w-full rounded-sm px-3 py-2 text-left hover:bg-accent focus:bg-accent focus:outline-none"
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">
                          {highlightMatchedText(main_text, main_text_matched_substrings)}
                        </div>
                        {secondary_text && (
                          <div className="truncate text-xs text-muted-foreground">
                            {secondary_text}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Selected Address Display */}
      {selectedAddress && (
        <div className="mt-2 space-y-1">
          <Badge variant="secondary" className="gap-1">
            <MapPin className="h-3 w-3" />
            <span>{selectedAddress.locality}</span>
          </Badge>
          {selectedAddress.city !== selectedAddress.state && (
            <div className="text-xs text-muted-foreground">
              {selectedAddress.city}, {selectedAddress.state}
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

// Helper to highlight matched text in suggestions
function highlightMatchedText(
  text: string,
  matchedSubstrings?: google.maps.places.AutocompleteStructuredFormatting['main_text_matched_substrings']
): React.ReactNode {
  if (!matchedSubstrings || matchedSubstrings.length === 0) {
    return text;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  matchedSubstrings.forEach(({ offset, length }) => {
    // Add text before match
    if (offset > lastIndex) {
      parts.push(text.slice(lastIndex, offset));
    }
    // Add matched text
    parts.push(
      <span key={offset} className="font-semibold">
        {text.slice(offset, offset + length)}
      </span>
    );
    lastIndex = offset + length;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}