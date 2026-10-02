import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createVideoSchema, updateVideoSchema } from '../schemas/video.schema';
import {
  getFeed,
  getVideoById,
  createVideo,
  updateVideo,
  incrementViews,
} from '../controllers/video.controller';

const router = Router();

// Public routes
router.get('/feed', getFeed);
router.get('/:id', getVideoById);
router.post('/:id/views', incrementViews); // increment view count

// Protected routes (require auth)
router.post('/', protect, validate(createVideoSchema), createVideo);
router.patch('/:id', protect, validate(updateVideoSchema), updateVideo);

export default router;
