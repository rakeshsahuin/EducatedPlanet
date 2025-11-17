/**
 * Database seeding functionality
 * Note: Seeders are not exported from dataservice package for client-side safety
 * Use this file only for server-side operations
 */

let isSeeding = false;

export async function seedDatabase(): Promise<void> {
  // Prevent multiple concurrent seeding attempts
  if (isSeeding) {
    console.log('Database seeding already in progress, skipping...');
    return;
  }

  // Always seed when called (caller handles environment check)
  console.log('Database seeding is disabled in production build...');

  try {
    isSeeding = true;

    // Seeding is disabled for now
    // To enable seeding, run it manually from the dataservice package

    console.log('Database seeding skipped');
  } catch (error) {
    console.error('Database seeding failed:', error);
    // Don't throw error to prevent app startup failure
    // Log the error but allow the application to continue
  } finally {
    isSeeding = false;
  }
}