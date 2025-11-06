import { seedUsers } from '@educatedplanet/dataservice';

let isSeeding = false;

export async function seedDatabase(): Promise<void> {
  // Prevent multiple concurrent seeding attempts
  if (isSeeding) {
    console.log('Database seeding already in progress, skipping...');
    return;
  }

  // Always seed when called (caller handles environment check)
  console.log('Starting database seeding...');

  try {
    isSeeding = true;

    await seedUsers();

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Database seeding failed:', error);
    // Don't throw error to prevent app startup failure
    // Log the error but allow the application to continue
  } finally {
    isSeeding = false;
  }
}