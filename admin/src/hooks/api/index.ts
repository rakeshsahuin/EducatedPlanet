/**
 * API hooks exports
 */

// User hooks
export {
  useUsers,
  useUser,
  useUserStats,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useBulkDeleteUsers,
  userKeys
} from './use-users';

// Tutor hooks
export {
  useTutors,
  useTutor,
  useTutorStats,
  useCreateTutor,
  useUpdateTutor,
  useDeleteTutor,
  useVerifyTutor,
  useBulkDeleteTutors,
  useBulkVerifyTutors,
  tutorKeys
} from './use-tutors';

// Review hooks
export {
  useReviews,
  useReview,
  useReviewStats,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
  useBulkDeleteReviews,
  reviewKeys
} from './use-reviews';

// Dashboard hooks
export {
  useDashboardOverview,
  useRecentActivities,
  useRefreshDashboard,
  dashboardKeys
} from './use-dashboard';