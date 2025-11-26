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

// Validate coordinates
export function validateCoordinates(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !isNaN(lat) &&
    !isNaN(lng)
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

// Extract coordinates from MongoDB GeoJSON
export function extractFromGeoJSON(geojson: {
  type: 'Point';
  coordinates: [number, number];
}): { lat: number; lng: number } {
  const [lng, lat] = geojson.coordinates;
  return { lat, lng };
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

// Format distance for display
export function formatDistance(value: number, unit: 'km' | 'miles'): string {
  if (value < 1) {
    // Convert to meters or yards for very small distances
    const smallerUnit = unit === 'km' ? 'meters' : 'yards';
    const smallerValue = unit === 'km' ? value * 1000 : value * 1760;
    return `${Math.round(smallerValue)} ${smallerUnit}`;
  }
  return `${value.toFixed(1)} ${unit}`;
}