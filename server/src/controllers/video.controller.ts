import { Request, Response } from 'express';
import { Video, IVideo } from '../models/Video';
import { CreateVideoInput, UpdateVideoInput } from '../schemas/video.schema';

// Get feed of videos (paginated optional)
export const getFeed = async (req: Request, res: Response) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json({ success: true, data: videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single video by ID
export const getVideoById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    res.status(200).json({ success: true, data: video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create new video (protected)
export const createVideo = async (req: Request<{}, {}, CreateVideoInput>, res: Response) => {
  try {
    const video = await Video.create(req.body);
    res.status(201).json({ success: true, data: video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update existing video (protected)
export const updateVideo = async (req: Request<{ id: string }, {}, UpdateVideoInput>, res: Response) => {
  const { id } = req.params;
  try {
    const video = await Video.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    res.status(200).json({ success: true, data: video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Increment view count (public)
export const incrementViews = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const video = await Video.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    res.status(200).json({ success: true, data: { views: video.views } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
