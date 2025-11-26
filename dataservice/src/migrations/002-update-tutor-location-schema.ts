import { Tutor } from '@educatedplanet/models';
import tutorModel, { TutorDocument } from '../datamodels/schemas/tutor-clean.schema';
import mongoose from 'mongoose';

/**
 * Migration 002: Update tutor location schema
 *
 * This migration:
 * 1. Adds new structured address fields to tutor documents
 * 2. Adds availabilityRange field
 * 3. Migrates existing data to new format
 * 4. Uses Google Geocoding API to get coordinates for existing locations
 */

interface Address {
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

interface AvailabilityRange {
  value: number;
  unit: 'km' | 'miles';
}

// Default coordinates for Bhubaneswar (fallback)
const DEFAULT_COORDINATES = {
  lat: 20.2961,
  lng: 85.8245,
};

// Geocode city and area to get coordinates
async function geocodeLocation(city: string, area?: string): Promise<{ lat: number; lng: number }> {
  try {
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    if (!API_KEY) {
      console.warn('Google Maps API key not found, using default coordinates');
      return DEFAULT_COORDINATES;
    }

    const query = area ? `${area}, ${city}, India` : `${city}, India`;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      console.warn(`Geocoding failed for ${query}:`, data.status);
      return DEFAULT_COORDINATES;
    }
  } catch (error) {
    console.error('Error geocoding location:', error);
    return DEFAULT_COORDINATES;
  }
}

// Create address object from existing data
async function createAddressFromLegacy(
  city: string,
  areas: string[] = [],
  fullAddress?: string
): Promise<Address> {
  // Use first area as locality, or city if no areas
  const locality = areas.length > 0 ? areas[0] : city;

  // Geocode to get coordinates
  const coordinates = await geocodeLocation(city, locality);

  return {
    locality,
    city,
    state: 'Odisha', // Default state for existing data
    country: 'IN',
    coordinates,
    address1: fullAddress,
    maplink: `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`,
  };
}

export async function up(): Promise<void> {
  console.log('Starting migration 002: Update tutor location schema');

  try {
    // Get all tutors
    const tutors = await tutorModel.find({}) as TutorDocument[];

    console.log(`Found ${tutors.length} tutors to migrate`);

    for (const tutor of tutors) {
      const updateData: any = {
        $set: {
          // Add default availability range
          'location.availabilityRange': {
            value: 5,
            unit: 'km',
          },
        },
      };

      // Check if tutor has existing location data
      if (tutor.location && tutor.location.city) {
        const address = await createAddressFromLegacy(
          tutor.location.city,
          tutor.location.areas || [],
          (tutor as any).location?.fullAddress
        );

        updateData.$set['location.address'] = address;

        // Update coordinates for geospatial queries
        updateData.$set['location.coordinates'] = {
          type: 'Point',
          coordinates: [address.coordinates.lng, address.coordinates.lat],
        };
      } else {
        // Create minimal address for tutors without location data
        const defaultAddress = {
          locality: 'Unknown',
          city: 'Bhubaneswar',
          state: 'Odisha',
          country: 'IN',
          coordinates: DEFAULT_COORDINATES,
          maplink: `https://www.google.com/maps/search/?api=1&query=${DEFAULT_COORDINATES.lat},${DEFAULT_COORDINATES.lng}`,
        };

        updateData.$set['location.address'] = defaultAddress;
        updateData.$set['location.city'] = 'Bhubaneswar';
        updateData.$set['location.areas'] = [];
      }

      // Update the tutor document
      await tutorModel.updateOne(
        { _id: tutor._id },
        updateData
      );

      console.log(`Migrated tutor: ${tutor.name || tutor._id}`);
    }

    console.log('Migration 002 completed successfully');
  } catch (error) {
    console.error('Migration 002 failed:', error);
    throw error;
  }
}

export async function down(): Promise<void> {
  console.log('Rolling back migration 002: Update tutor location schema');

  try {
    // Remove new fields and keep old structure
    await tutorModel.updateMany(
      {},
      {
        $unset: {
          'location.address': '',
          'location.availabilityRange': '',
        },
        $set: {
          'location.coordinates': undefined,
        },
      }
    );

    console.log('Rollback of migration 002 completed');
  } catch (error) {
    console.error('Rollback of migration 002 failed:', error);
    throw error;
  }
}

// Run migration if called directly
if (require.main === module) {
  const mongooseConnection = async () => {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/educatedplanet';
    await mongoose.connect(MONGODB_URI);
  };

  const command = process.argv[2];

  mongooseConnection()
    .then(async () => {
      if (command === 'up') {
        await up();
      } else if (command === 'down') {
        await down();
      } else {
        console.log('Usage: npm run migration 002 up|down');
      }
      await mongoose.disconnect();
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}