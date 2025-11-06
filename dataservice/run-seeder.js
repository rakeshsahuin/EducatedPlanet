#!/usr/bin/env node

/**
 * Test script to run the user seeder
 * This script helps test the fixed seeder functionality
 */

import { seedUsers } from './dist/dataservice/src/seeder/userseeder.js';
import 'dotenv/config';

async function runSeeder() {
  console.log('🚀 Starting user seeder test...\n');

  try {
    await seedUsers();
    console.log('\n✅ User seeder completed successfully!');
  } catch (error) {
    console.error('\n❌ User seeder failed:', error);
    process.exit(1);
  }
}

// Run the seeder
runSeeder();