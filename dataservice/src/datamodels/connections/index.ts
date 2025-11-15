/**
 * Database connection exports
 */

import { databaseConnection } from './database';

export {
  DatabaseConnection,
  databaseConnection,
  initializeDatabase,
  closeDatabase,
  defaultConfig,
  type DatabaseConfig,
} from './database';

// Re-export model getter methods for convenience
export const getModel = {
  user: () => databaseConnection.getUserModel(),
  tutor: () => databaseConnection.getTutorModel(),
  review: () => databaseConnection.getReviewModel(),
  class: () => databaseConnection.getClassModel(),
  subject: () => databaseConnection.getSubjectModel(),
};