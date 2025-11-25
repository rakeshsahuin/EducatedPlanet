import dotenv from 'dotenv';
import { runMigrations, getMigrations, runMigration } from '../migrations';

// Load environment variables
dotenv.config();

/**
 * Command-line migration runner
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log('='.repeat(60));
  console.log('EducatedPlanet - Database Migration Runner');
  console.log('='.repeat(60));

  try {
    // Check environment
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
      process.exit(1);
    }

    switch (command) {
      case 'list':
        console.log('\n📋 Available migrations:');
        const migrations = getMigrations();
        migrations.forEach(migration => {
          console.log(`   • ${migration.name} (${migration.version})`);
          console.log(`     ${migration.description}`);
        });
        break;

      case 'up':
        console.log('\n🚀 Running all migrations...');
        await runMigrations();
        break;

      case 'run':
        const migrationName = args[1];
        if (!migrationName) {
          console.error('❌ Migration name is required');
          console.log('Usage: npm run migrate run <migration-name>');
          process.exit(1);
        }
        await runMigration(migrationName as any);
        break;

      default:
        console.log('\nUsage:');
        console.log('  npm run migrate list    - List all available migrations');
        console.log('  npm run migrate up      - Run all migrations');
        console.log('  npm run migrate run <name> - Run a specific migration');
        console.log('\nExample:');
        console.log('  npm run migrate run 001-create-tutor-collection');
        process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }

  console.log('\n✅ Migration completed successfully');
  process.exit(0);
}

// Run the script
if (require.main === module) {
  main();
}