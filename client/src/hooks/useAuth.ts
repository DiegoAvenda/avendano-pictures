import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { IUser, IVideo } from '@/types';
import { useAuthStore } from '@/stores/useAuthStore';

// ---------- Auth hooks ----------
// NOTE: the axios response interceptor already unwraps the { success, data }
// envelope, so every request resolves to the `data` payload (e.g. `{ id, email }`).

export const useRegister = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  return useMutation<IUser, Error, { email: string; password: string }>({
    mutationFn: (payload) => api.post<IUser>('/auth/register', payload),
    onSuccess: (user) => {
      setUser({ id: user.id, email: user.email });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  return useMutation<IUser, Error, { email: string; password: string }>({
    mutationFn: (payload) => api.post<IUser>('/auth/login', payload),
    onSuccess: (user) => {
      setUser({ id: user.id, email: user.email });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { clearUser } = useAuthStore();
  return useMutation<void, Error, void>({
    mutationFn: () => api.post<void>('/auth/logout'),
    onSuccess: () => {
      clearUser();
      queryClient.clear();
    },
  });
};

export const useMe = () => {
  return useQuery<IUser>({
    queryKey: ['me'],
    queryFn: () => api.get<IUser>('/auth/me'),
    retry: false,
  });
};

// ---------- Video hooks ----------

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
      // Optimistically update the cached view count
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
