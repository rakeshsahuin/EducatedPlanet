// Interface for structured address
export interface Address {
  maplink?: string;
  address1?: string;
  locality: string;
  city: string;
  state: string;
  country?: string;
  zip?: string;
  digipin?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Extract address components from Google Places result
export function extractAddressComponents(place: google.maps.places.PlaceResult): Address | null {
  if (!place.geometry?.location || !place.address_components) {
    return null;
  }

  const address: Partial<Address> = {
    coordinates: {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    },
  };

  // Extract address components
  for (const component of place.address_components) {
    const types = component.types;
    const long_name = component.long_name;
    const short_name = component.short_name;

    if (types.includes('street_number')) {
      address.address1 = `${long_name} ${address.address1 || ''}`.trim();
    } else if (types.includes('route')) {
      address.address1 = `${address.address1 || ''} ${long_name}`.trim();
    } else if (types.includes('sublocality') || types.includes('locality')) {
      // For Indian addresses, use sublocality as locality
      if (types.includes('sublocality')) {
        address.locality = long_name;
      }
    } else if (types.includes('administrative_area_level_2')) {
      if (!address.locality) address.locality = long_name;
    } else if (types.includes('administrative_area_level_1')) {
      address.state = long_name;
    } else if (types.includes('country')) {
      address.country = short_name;
    } else if (types.includes('postal_code')) {
      address.zip = long_name;
    }
  }

  // Use formatted address as fallback for missing components
  if (!address.locality && place.formatted_address) {
    // Try to extract locality from formatted address
    const parts = place.formatted_address.split(',');
    if (parts.length >= 2) {
      // For Indian addresses: locality is usually the second last part
      const potentialLocality = parts[parts.length - 2]?.trim();
      if (potentialLocality && !address.state) {
        address.locality = potentialLocality;
      }
    }
  }

  // Ensure required fields are present
  if (!address.locality || !address.state) {
    console.error('Missing required address components', place);
    return null;
  }

  // Set city to same as state for now (can be refined later)
  address.city = address.city || address.state;

  // Generate map link
  if (address.coordinates) {
    address.maplink = `https://www.google.com/maps/search/?api=1&query=${address.coordinates.lat},${address.coordinates.lng}`;
  }

  return address as Address;
}

// Create Google Maps link for coordinates
export function createMapLink(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

// Validate coordinates
export function validateCoordinates(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

// Convert coordinates for MongoDB GeoJSON
export function convertToGeoJSON(lat: number, lng: number): {
  type: 'Point';
  coordinates: [number, number];
} {
  return {
    type: 'Point',
    coordinates: [lng, lat], // MongoDB expects [longitude, latitude]
  };
}

// Session token management for billing optimization
class SessionTokenManager {
  private currentToken: google.maps.places.AutocompleteSessionToken | null = null;
  private readonly MAX_USES_PER_TOKEN = 100; // Conservative limit
  private currentUses = 0;

  getToken(): google.maps.places.AutocompleteSessionToken {
    if (!this.currentToken || this.currentUses >= this.MAX_USES_PER_TOKEN) {
      this.currentToken = new google.maps.places.AutocompleteSessionToken();
      this.currentUses = 0;
    }
    this.currentUses++;
    return this.currentToken;
  }

  resetToken(): void {
    this.currentToken = null;
    this.currentUses = 0;
  }
}

export const sessionTokenManager = new SessionTokenManager();

// Debounce function for search input
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Get default map center (Bhubaneswar)
export function getDefaultMapCenter(): { lat: number; lng: number } {
  return {
    lat: 20.2961,
    lng: 85.8245,
  };
}

// Distance conversion utilities
export function convertDistance(
  value: number,
  from: 'km' | 'miles',
  to: 'km' | 'miles'
): number {
  if (from === to) return value;

  // 1 mile = 1.60934 km
  const kmToMile = 0.621371;
  const mileToKm = 1.60934;

  if (from === 'km' && to === 'miles') {
    return value * kmToMile;
  } else {
    return value * mileToKm;
  }
}

// Calculate distance between two points (Haversine formula)
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  unit: 'km' | 'miles' = 'km'
): number {
  const R = unit === 'km' ? 6371 : 3959; // Earth radius in km or miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}