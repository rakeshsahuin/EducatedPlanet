/**
 * API Index - Client-side safe API exports
 * Only exports that are safe for client-side consumption
 */

// Re-export API methods that are client-safe
export {
  userApi,
  tutorApi,
  reviewApi,
  dashboardApi
} from './api';

// Types from models are already imported by the API file