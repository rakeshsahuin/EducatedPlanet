import { up as migrateTutorCollection } from './001-create-tutor-collection';

/**
 * Migration registry
 */
const migrations = {
  '001-create-tutor-collection': {
    up: migrateTutorCollection,
    version: '001',
    description: 'Create tutor collection with enhanced schema'
  }
};

/**
 * Run all pending migrations
 */
export async function runMigrations(): Promise<void> {
  console.log('🚀 Starting database migrations...');

  for (const [name, migration] of Object.entries(migrations)) {
    try {
      console.log(`\n📝 Running migration: ${name}`);
      console.log(`   Description: ${migration.description}`);
      await migration.up();
      console.log(`✅ Migration ${name} completed successfully`);
    } catch (error) {
      console.error(`❌ Migration ${name} failed:`, error);
      throw error;
    }
  }

  console.log('\n✅ All migrations completed successfully!');
}

/**
 * Run a specific migration
 */
export async function runMigration(name: keyof typeof migrations): Promise<void> {
  if (!migrations[name]) {
    throw new Error(`Migration ${name} not found`);
  }

  console.log(`🚀 Running migration: ${name}`);
  console.log(`   Description: ${migrations[name].description}`);

  try {
    await migrations[name].up();
    console.log(`✅ Migration ${name} completed successfully`);
  } catch (error) {
    console.error(`❌ Migration ${name} failed:`, error);
    throw error;
  }
}

/**
 * Get list of all available migrations
 */
export function getMigrations(): Array<{ name: string; version: string; description: string }> {
  return Object.entries(migrations).map(([name, migration]) => ({
    name,
    version: migration.version,
    description: migration.description
  }));
}

// Export migration names for type safety
export type MigrationName = keyof typeof migrations;