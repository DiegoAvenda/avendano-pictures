import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { IVideo } from '@/types';

// ---------- Video hooks ----------
// NOTE: the axios response interceptor unwraps the { success, data } envelope,
// so `api.get`/`api.post` resolve to the `data` payload directly.

export const useVideoFeed = () => {
  return useQuery<IVideo[]>({
    queryKey: ['videos', 'feed'],
    queryFn: () => api.get<IVideo[]>('/videos/feed'),
    staleTime: 60_000,
  });
};

export const useVideoById = (id: string) => {
  return useQuery<IVideo>({
    queryKey: ['videos', id],
    queryFn: () => api.get<IVideo>(`/videos/${id}`),
    enabled: !!id,
  });
};

export const useIncrementViews = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => api.post<void>(`/videos/${id}/views`),
    onSuccess: (_, id) => {
      // Optimistic update of view count
      queryClient.setQueryData<IVideo>(['videos', id], (old) =>
        old ? { ...old, views: old.views + 1 } : old
      );
    },
  });
};

export const useCreateVideo = () => {
  const queryClient = useQueryClient();
  return useMutation<IVideo, Error, Omit<IVideo, '_id' | 'createdAt' | 'updatedAt'>>({
    mutationFn: (payload) => api.post<IVideo>('/videos', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos', 'feed'] });
    },
  });
};

export const useUpdateVideo = () => {
  const queryClient = useQueryClient();
  return useMutation<IVideo, Error, { id: string; data: Partial<IVideo> }>({
    mutationFn: ({ id, data }) => api.patch<IVideo>(`/videos/${id}`, data),
    onSuccess: (updated) => {
      queryClient.setQueryData<IVideo>(['videos', updated._id], updated);
      queryClient.invalidateQueries({ queryKey: ['videos', 'feed'] });
    },
  });
};