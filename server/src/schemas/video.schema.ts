import { z } from 'zod';

export const createVideoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  videoUrl: z.string().url(),
  thumbnailUrl: z.string().url(),
  duration: z.number().positive(),
});

export const updateVideoSchema = createVideoSchema.partial();

export type CreateVideoInput = z.infer<typeof createVideoSchema>;
export type UpdateVideoInput = z.infer<typeof updateVideoSchema>;
