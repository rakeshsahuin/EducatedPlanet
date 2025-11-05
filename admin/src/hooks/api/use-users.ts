/**
 * Custom hooks for user operations
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { userApi } from '@/lib/static-api';
import {
  User,
  CreateUserInput,
  UpdateUserInput,
  UserSearchParams,
  PaginatedResponse
} from '@educatedplanet/models';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: UserSearchParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  stats: () => [...userKeys.all, 'stats'] as const,
};

// Hook to fetch users with pagination and filters
export const useUsers = (
  params?: UserSearchParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<User>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: userKeys.list(params || {}),
    queryFn: () => userApi.getUsers(params),
    select: (data) => ({
      ...data,
      data: data.items // Transform items to data for backward compatibility
    }),
    ...options,
  });
};

// Hook to fetch a single user by ID
export const useUser = (
  id: string,
  options?: Omit<UseQueryOptions<User | null, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getUserById(id),
    enabled: !!id,
    ...options,
  });
};

// Hook to fetch user statistics
export const useUserStats = (
  options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: () => userApi.getUserStats(),
    ...options,
  });
};

// Hook to create a new user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserInput) => userApi.createUser(userData),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
    },
  });
};

// Hook to update a user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: UpdateUserInput }) =>
      userApi.updateUser(id, userData),
    onSuccess: (data, variables) => {
      // Update the specific user in cache
      queryClient.setQueryData(userKeys.detail(variables.id), data);
      // Invalidate the list to ensure consistency
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to update user:', error);
    },
  });
};

// Hook to delete a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: (_, deletedId) => {
      // Remove the deleted user from cache
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) });
      // Invalidate the list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to delete user:', error);
    },
  });
};

// Hook to bulk delete users
export const useBulkDeleteUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const results = await Promise.allSettled(
        ids.map(id => userApi.deleteUser(id))
      );
      const failed = results.filter(r => r.status === 'rejected');
      if (failed.length > 0) {
        throw new Error(`Failed to delete ${failed.length} users`);
      }
      return ids.length;
    },
    onSuccess: (_, deletedIds) => {
      // Remove all deleted users from cache
      deletedIds.forEach(id => {
        queryClient.removeQueries({ queryKey: userKeys.detail(id) });
      });
      // Invalidate the list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to bulk delete users:', error);
    },
  });
};