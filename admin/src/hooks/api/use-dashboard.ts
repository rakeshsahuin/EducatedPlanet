/**
 * Custom hooks for dashboard operations
 */

import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api-client';

// Query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  overview: () => [...dashboardKeys.all, 'overview'] as const,
  recentActivities: (limit?: number) => [...dashboardKeys.all, 'recent-activities', limit] as const,
};

// Hook to fetch dashboard overview statistics
export const useDashboardOverview = (
  options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: () => dashboardApi.getOverviewStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

// Hook to fetch recent activities
export const useRecentActivities = (
  limit: number = 10,
  options?: Omit<UseQueryOptions<any[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: dashboardKeys.recentActivities(limit),
    queryFn: () => dashboardApi.getRecentActivities(limit),
    staleTime: 1000 * 60, // 1 minute
    ...options,
  });
};

// Hook to refresh all dashboard data
export const useRefreshDashboard = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    queryClient.refetchQueries({ queryKey: dashboardKeys.overview() });
    queryClient.refetchQueries({ queryKey: dashboardKeys.recentActivities() });
  };
};