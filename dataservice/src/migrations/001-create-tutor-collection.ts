import mongoose from 'mongoose';
import { databaseConnection } from '../datamodels/connections';

/**
 * Migration: Create tutor collection with enhanced schema
 * Version: 001
 * Description: Creates the tutors collection with all required indexes and validation rules
 */
export async function up(): Promise<void> {
  try {
    // Ensure database is connected
    await databaseConnection.connect();
    const db = databaseConnection.getDb();

    console.log('Creating tutors collection...');

    // Check if collection already exists
    const collections = await db.listCollections({ name: 'tutors' }).toArray();

    if (collections.length === 0) {
      // Create the tutors collection with schema validation
      await db.createCollection('tutors', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['userId', 'approved', 'status', 'analytics', 'rating', 'createdAt', 'updatedAt'],
            properties: {
              userId: { bsonType: 'objectId' },
              'status.current': {
                enum: ['pending', 'approved', 'rejected', 'suspended']
              },
              isActive: { bsonType: 'bool' },
              isDeleted: { bsonType: 'bool' },
              isVerified: { bsonType: 'bool' },
              isFeatured: { bsonType: 'bool' },
              'rating.average': { bsonType: 'number', minimum: 0, maximum: 5 },
              'rating.count': { bsonType: 'number', minimum: 0 }
            }
          }
        }
      });
      console.log('✅ Tutors collection created successfully');
    } else {
      console.log('Tutors collection already exists, skipping creation');
    }

    // Get the collection to create indexes
    const tutorCollection = db.collection('tutors');

    // Create all required indexes
    const indexes = [
      // Single field indexes
      { key: { userId: 1 }, options: { unique: true } },
      { key: { 'status.current': 1 }, options: {} },
      { key: { isActive: 1 }, options: {} },
      { key: { isDeleted: 1 }, options: {} },
      { key: { isVerified: 1 }, options: {} },
      { key: { isFeatured: 1 }, options: {} },

      // Geospatial index for location search
      { key: { 'approved.location.coordinates': '2dsphere' }, options: { name: 'tutor_location_2dsphere' } },

      // City-based location index
      { key: { 'approved.location.city': 1 }, options: {} },

      // Subject search indexes
      { key: { 'approved.subjects.subjectId': 1, 'status.current': 1 }, options: {} },

      // Teaching mode indexes
      { key: { 'approved.teachingModes': 1, 'status.current': 1 }, options: {} },

      // Rating-based indexes for sorting
      { key: { 'rating.average': -1, 'status.current': 1, isActive: 1 }, options: {} },

      // Analytics indexes
      { key: { 'analytics.connects': -1, 'status.current': 1 }, options: {} },

      // Pricing search indexes
      { key: { 'approved.pricing.oneToOne.hourlyRate': 1, 'status.current': 1 }, options: {} },

      // Compound indexes for common queries
      {
        key: { 'status.current': 1, isActive: 1, isVerified: 1, 'rating.average': -1 },
        options: {}
      },
      {
        key: { 'approved.location.city': 1, 'approved.subjects.subjectId': 1, 'status.current': 1, 'rating.average': -1 },
        options: {}
      },
      {
        key: { 'status.current': 1, isFeatured: 1, 'rating.average': -1 },
        options: {}
      },

      // Admin approval workflow indexes
      {
        key: { 'status.current': 1, 'status.submittedAt': -1, isActive: 1 },
        options: {}
      },

      // Text search index for searching by name, title, description
      {
        key: {
          'approved.basicInfo.firstName': 'text',
          'approved.basicInfo.lastName': 'text',
          'approved.basicInfo.title': 'text',
          'approved.basicInfo.shortDescription': 'text',
          'approved.basicInfo.longDescription': 'text'
        },
        options: {
          weights: {
            'approved.basicInfo.title': 10,
            'approved.basicInfo.firstName': 8,
            'approved.basicInfo.lastName': 8,
            'approved.basicInfo.shortDescription': 5,
            'approved.basicInfo.longDescription': 3
          },
          name: 'tutor_text_search'
        }
      },

      // Update tracking index
      { key: { updatedAt: -1 }, options: {} },

      // Last active tracking for recommendations
      { key: { 'analytics.lastActive': -1, 'status.current': 1, isActive: 1 }, options: {} }
    ];

    // Create indexes one by one with error handling
    for (const index of indexes) {
      try {
        await tutorCollection.createIndex(index.key as any, index.options);
        console.log(`✅ Created index: ${JSON.stringify(index.key)}`);
      } catch (error: any) {
        if (error.codeName === 'IndexKeySpecsConflict') {
          console.log(`⚠️ Index already exists: ${JSON.stringify(index.key)}`);
        } else {
          console.error(`❌ Error creating index ${JSON.stringify(index.key)}:`, error);
        }
      }
    }

    // Verify indexes were created
    const indexInfo = await tutorCollection.indexInformation();
    console.log(`✅ Total indexes created: ${Object.keys(indexInfo).length}`);

    // Create sample data if collection is empty (for development)
    const count = await tutorCollection.countDocuments();
    if (count === 0 && process.env.NODE_ENV === 'development') {
      console.log('Collection is empty. You can add sample data here if needed.');
    }

    console.log('✅ Tutor collection migration completed successfully');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Rollback migration
 * Drops the tutors collection and all its indexes
 */
export async function down(): Promise<void> {
  try {
    // Ensure database is connected
    await databaseConnection.connect();
    const db = databaseConnection.getDb();

    console.log('Dropping tutors collection...');

    // Check if collection exists
    const collections = await db.listCollections({ name: 'tutors' }).toArray();

    if (collections.length > 0) {
      await db.collection('tutors').drop();
      console.log('✅ Tutors collection dropped successfully');
    } else {
      console.log('Tutors collection does not exist, skipping drop');
    }

  } catch (error) {
    console.error('❌ Rollback failed:', error);
    throw error;
  }
}

/**
 * Run migration directly
 */
if (require.main === module) {
  (async () => {
    try {
      await up();
      console.log('Migration completed successfully');
      process.exit(0);
    } catch (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    }
  })();
}