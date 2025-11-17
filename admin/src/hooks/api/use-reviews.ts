/**
 * Custom hooks for review operations
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { reviewApi } from '@/lib/api-client';
import {
  Review,
  CreateReviewInput,
  UpdateReviewInput,
  ReviewSearchParams,
  PaginatedResponse
} from '@educatedplanet/models';

// Query keys
export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: (params: ReviewSearchParams) => [...reviewKeys.lists(), params] as const,
  details: () => [...reviewKeys.all, 'detail'] as const,
  detail: (id: string) => [...reviewKeys.details(), id] as const,
  stats: () => [...reviewKeys.all, 'stats'] as const,
};

// Hook to fetch reviews with pagination and filters
export const useReviews = (
  params?: ReviewSearchParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<Review>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: reviewKeys.list(params || {}),
    queryFn: () => reviewApi.getReviews(params),
    select: (data) => ({
      ...data,
      data: data.items // Transform items to data for backward compatibility
    }),
    ...options,
  });
};

// Hook to fetch a single review by ID
export const useReview = (
  id: string,
  options?: Omit<UseQueryOptions<Review | null, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: reviewKeys.detail(id),
    queryFn: () => reviewApi.getReviewById(id),
    enabled: !!id,
    ...options,
  });
};

// Hook to fetch review statistics
export const useReviewStats = (
  options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: reviewKeys.stats(),
    queryFn: () => reviewApi.getReviews(),//TODO: getReviewStats(),
    ...options,
  });
};

// Hook to create a new review
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewData: CreateReviewInput) => reviewApi.createReview(reviewData),
    onSuccess: () => {
      // Invalidate and refetch reviews list
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reviewKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to create review:', error);
    },
  });
};

// Hook to update a review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reviewData }: { id: string; reviewData: UpdateReviewInput }) =>
      reviewApi.updateReview(id, reviewData),
    onSuccess: (data, variables) => {
      // Update the specific review in cache
      queryClient.setQueryData(reviewKeys.detail(variables.id), data);
      // Invalidate the list to ensure consistency
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reviewKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to update review:', error);
    },
  });
};

// Hook to delete a review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reviewApi.deleteReview(id),
    onSuccess: (_, deletedId) => {
      // Remove the deleted review from cache
      queryClient.removeQueries({ queryKey: reviewKeys.detail(deletedId) });
      // Invalidate the list
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reviewKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to delete review:', error);
    },
  });
};

// Hook to bulk delete reviews
export const useBulkDeleteReviews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const results = await Promise.allSettled(
        ids.map(id => reviewApi.deleteReview(id))
      );
      const failed = results.filter(r => r.status === 'rejected');
      if (failed.length > 0) {
        throw new Error(`Failed to delete ${failed.length} reviews`);
      }
      return ids.length;
    },
    onSuccess: (_, deletedIds) => {
      // Remove all deleted reviews from cache
      deletedIds.forEach(id => {
        queryClient.removeQueries({ queryKey: reviewKeys.detail(id) });
      });
      // Invalidate the list
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reviewKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to bulk delete reviews:', error);
    },
  });
};