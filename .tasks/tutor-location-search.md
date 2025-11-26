# Google Maps Integration for Location Selection - Implementation Plan

## Overview
Replace the current static city/area dropdowns in the tutor form with Google Maps-powered location selection including:
- Single searchable textbox using Google Places API
- "Select from map" interactive selection
- Availability range with unit selection (km/miles)
- Coordinates saved to database (hidden from user)
- New structured address format

## Requirements Summary

### User Flow
1. User types area/locality in searchable textbox
2. Google Places API provides autocomplete suggestions
3. User selects location ’ all address info auto-populated
4. Optional: Click "select from map" to pick location visually
5. User sets availability range (e.g., 5 km)
6. All data saved including coordinates (hidden)

### Address Structure
```typescript
address: {
  maplink?: string;        // Google Maps link
  address1?: string;       // Street address
  locality: string;        // Area/locality (required)
  city: string;           // City (required)
  state: string;          // State (required)
  country?: string;       // Country
  zip?: string;           // ZIP/postal code
  digipin?: string;       // DIGI_PIN (if applicable)
  coordinates: {
    lat: number;          // Latitude (hidden from user)
    lng: number;          // Longitude (hidden from user)
  }
}
```

### Additional Field
```typescript
availabilityRange: {
  value: number;          // e.g., 5
  unit: 'km' | 'miles';   // User's choice
}
```

## Implementation Steps

### Phase 1: Database Schema Updates

#### 1. Update Types (`models/src/tutor/admin.types.ts`)
```typescript
// Around lines 97-106, update location structure
location: {
  // Existing fields for backward compatibility
  areas?: string[];
  city?: string;

  // New structured address
  address: {
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
  };

  // New availability range
  availabilityRange: {
    value: number;
    unit: 'km' | 'miles';
  };

  // Keep existing for geospatial queries
  coordinates?: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
}
```

#### 2. Migration Script (`dataservice/src/migrations/002-update-tutor-location-schema.ts`)
- Create migration to add new address structure
- Migrate existing data: convert city/areas to new format
- Use Google Geocoding API to get coordinates for existing locations
- Set default availability range if not present

### Phase 2: Environment Setup

#### 3. Add Environment Variables (`.env.local`)
```bash
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here

# Optional: Google Maps configuration
NEXT_PUBLIC_MAPS_DEFAULT_LAT=20.2961
NEXT_PUBLIC_MAPS_DEFAULT_LNG=85.8245
NEXT_PUBLIC_MAPS_DEFAULT_ZOOM=12
```

#### 4. Install Dependencies (`admin/package.json`)
```json
{
  "@googlemaps/react-wrapper": "^1.1.35",
  "@googlemaps/js-api-loader": "^1.16.6",
  "use-places-autocomplete": "^4.0.1",
  "@types/google.maps": "^3.55.0"
}
```

### Phase 3: Create Location Components

#### 5. Location Search Component (`admin/src/components/forms/LocationSearch.tsx`)
- Autocomplete textbox using Google Places API
- CMDK integration for keyboard navigation
- Debounced search (300ms delay)
- Session token management for billing optimization
- Extract address components from selected place

#### 6. Map Selector Component (`admin/src/components/forms/MapSelector.tsx`)
- Interactive Google Maps in modal
- Click to select location
- Show current location button
- Marker for selected location
- Confirm selection to update form

#### 7. Travel Radius Component (`admin/src/components/forms/TravelRadius.tsx`)
- Numeric input for range value
- Unit selector (km/miles)
- Preset buttons (1, 2, 5, 10 km/miles)
- Visual radius indicator on map

#### 8. Location Form Wrapper (`admin/src/components/forms/LocationForm.tsx`)
- Combines LocationSearch, MapSelector, and TravelRadius
- Manages form state integration
- Handles coordinate extraction
- Provides "select from map" toggle

### Phase 4: Update Form Integration

#### 9. Update Form Schema (`admin/src/app/(main)/dashboard/tutors/_components/schema.ts`)
```typescript
// Update location validation schema
location: z.object({
  address: z.object({
    locality: z.string().min(1, "Locality is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    })
  }),
  availabilityRange: z.object({
    value: z.number().min(0.1, "Range must be greater than 0"),
    unit: z.enum(['km', 'miles'])
  })
})
```

#### 10. Update Tutor Form (`admin/src/app/(main)/dashboard/tutors/_components/tutor-form.tsx`)
- Replace lines 507-577 with new LocationForm component
- Update form default values
- Handle form submission with new structure
- Remove static city/area dropdowns

### Phase 5: Backend Integration

#### 11. Update Tutor Service (`dataservice/src/services/tutor.service.ts`)
- Handle new location structure in create/update
- Validate coordinates before saving
- Extract coordinates from nested address for geospatial indexing
- Maintain backward compatibility

#### 12. Update API Routes (`admin/src/app/api/admin/tutors/route.ts`)
- Process new location format
- Extract coordinates for MongoDB queries
- Validate required fields

### Phase 6: Utility Functions

#### 13. Google Maps Utilities (`admin/src/lib/google-maps.ts`)
```typescript
export const extractAddressComponents = (place: google.maps.places.PlaceResult) => {
  // Extract street, locality, city, state, etc.
  // Return structured address object
};

export const createMapLink = (lat: number, lng: number) => {
  // Generate Google Maps link for coordinates
};
```

#### 14. Location Utils (`common/src/utils/location.ts`)
```typescript
export const convertDistance = (value: number, from: 'km' | 'miles', to: 'km' | 'miles') => {
  // Convert between km and miles
};

export const validateCoordinates = (lat: number, lng: number) => {
  // Validate coordinate ranges
};
```

## Key Implementation Details

### Google Places API Integration
- Use `fields` parameter to request only needed data
- Implement session tokens for billing optimization
- Cache results to reduce API calls
- Handle rate limiting gracefully

### UI/UX Considerations
- Maintain Nature theme styling
- Responsive design for mobile
- Loading states during API calls
- Error handling for API failures
- Clear visual feedback for selected location

### Performance Optimizations
- Debounce search input (300ms)
- Lazy load map component
- Implement result caching
- Use React.memo for expensive components

## Testing Strategy

### Unit Tests
- Address extraction from Google Places
- Coordinate validation
- Distance conversion utilities
- Form validation

### Integration Tests
- Complete form submission flow
- API integration with new location structure
- Data persistence in MongoDB

### E2E Tests
- User search and selection flow
- Map selection functionality
- Form submission with all location fields

## Migration Plan

### For Existing Data
1. Run migration to add new fields
2. Batch update existing tutors using Geocoding API
3. Maintain backward compatibility during transition
4. Remove old fields after successful migration

### Deployment Strategy
1. Deploy backend changes first (schema update)
2. Deploy frontend changes
3. Run data migration
4. Monitor for errors

## Security Considerations

- API key protection (server-side only for geocoding)
- Input sanitization for address data
- Rate limiting to prevent abuse
- Coordinate validation before storage

## Cost Management

- Monitor Google Maps API usage
- Implement caching to reduce costs
- Use session tokens for autocomplete
- Set up alerts for unusual usage patterns

## Success Metrics
- Reduced form completion time
- Improved location accuracy
- Positive user feedback
- Zero data migration errors
- API costs within budget

---

**Total Files to Modify**: 14
**Estimated Development Time**: 3-4 days
**Testing Time**: 1-2 days
**Deployment Time**: 1 day (including migration)