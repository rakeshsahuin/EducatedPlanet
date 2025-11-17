/**
 * Custom hooks for tutor operations
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { tutorApi } from '@/lib/api-client';
import {
  Tutor,
  CreateTutorInput,
  UpdateTutorInput,
  TutorSearchParams,
  PaginatedResponse
} from '@educatedplanet/models';

// Query keys
export const tutorKeys = {
  all: ['tutors'] as const,
  lists: () => [...tutorKeys.all, 'list'] as const,
  list: (params: TutorSearchParams) => [...tutorKeys.lists(), params] as const,
  details: () => [...tutorKeys.all, 'detail'] as const,
  detail: (id: string) => [...tutorKeys.details(), id] as const,
  stats: () => [...tutorKeys.all, 'stats'] as const,
};

// Hook to fetch tutors with pagination and filters
export const useTutors = (
  params?: TutorSearchParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<Tutor>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: tutorKeys.list(params || {}),
    queryFn: () => tutorApi.getTutors(params),
    select: (data) => ({
      ...data,
      data: data.items // Transform items to data for backward compatibility
    }),
    ...options,
  });
};

// Hook to fetch a single tutor by ID
export const useTutor = (
  id: string,
  options?: Omit<UseQueryOptions<Tutor | null, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: tutorKeys.detail(id),
    queryFn: () => tutorApi.getTutorById(id),
    enabled: !!id,
    ...options,
  });
};

// Hook to fetch tutor statistics
export const useTutorStats = (
  options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: tutorKeys.stats(),
    queryFn: () => tutorApi.getTutorStats(),
    ...options,
  });
};

// Hook to create a new tutor
export const useCreateTutor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tutorData: CreateTutorInput) => tutorApi.createTutor(tutorData),
    onSuccess: () => {
      // Invalidate and refetch tutors list
      queryClient.invalidateQueries({ queryKey: tutorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tutorKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to create tutor:', error);
    },
  });
};

// Hook to update a tutor
export const useUpdateTutor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, tutorData }: { id: string; tutorData: UpdateTutorInput }) =>
      tutorApi.updateTutor(id, tutorData),
    onSuccess: (data, variables) => {
      // Update the specific tutor in cache
      queryClient.setQueryData(tutorKeys.detail(variables.id), data);
      // Invalidate the list to ensure consistency
      queryClient.invalidateQueries({ queryKey: tutorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tutorKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to update tutor:', error);
    },
  });
};

// Hook to delete a tutor
export const useDeleteTutor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tutorApi.deleteTutor(id),
    onSuccess: (_, deletedId) => {
      // Remove the deleted tutor from cache
      queryClient.removeQueries({ queryKey: tutorKeys.detail(deletedId) });
      // Invalidate the list
      queryClient.invalidateQueries({ queryKey: tutorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tutorKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to delete tutor:', error);
    },
  });
};

// Hook to verify a tutor
export const useVerifyTutor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, approvedBy }: { id: string; approvedBy?: string }) => tutorApi.verifyTutor(id, approvedBy || 'admin'),
    onSuccess: (data, variables) => {
      // Update the tutor in cache
      queryClient.setQueryData(tutorKeys.detail(variables.id), data);
      // Invalidate the list to ensure consistency
      queryClient.invalidateQueries({ queryKey: tutorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tutorKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to verify tutor:', error);
    },
  });
};

// Hook to bulk delete tutors
export const useBulkDeleteTutors = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const results = await Promise.allSettled(
        ids.map(id => tutorApi.deleteTutor(id))
      );
      const failed = results.filter(r => r.status === 'rejected');
      if (failed.length > 0) {
        throw new Error(`Failed to delete ${failed.length} tutors`);
      }
      return ids.length;
    },
    onSuccess: (_, deletedIds) => {
      // Remove all deleted tutors from cache
      deletedIds.forEach(id => {
        queryClient.removeQueries({ queryKey: tutorKeys.detail(id) });
      });
      // Invalidate the list
      queryClient.invalidateQueries({ queryKey: tutorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tutorKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to bulk delete tutors:', error);
    },
  });
};

// Hook to bulk verify tutors
export const useBulkVerifyTutors = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const results = await Promise.allSettled(
        ids.map(id => tutorApi.verifyTutor(id, 'admin'))
      );
      const failed = results.filter(r => r.status === 'rejected');
      if (failed.length > 0) {
        throw new Error(`Failed to verify ${failed.length} tutors`);
      }
      return ids.length;
    },
    onSuccess: (_, verifiedIds) => {
      // Invalidate all tutor queries to refresh data
      verifiedIds.forEach(id => {
        queryClient.invalidateQueries({ queryKey: tutorKeys.detail(id) });
      });
      queryClient.invalidateQueries({ queryKey: tutorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tutorKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to bulk verify tutors:', error);
    },
  });
};