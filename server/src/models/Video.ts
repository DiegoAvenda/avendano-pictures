import { Schema, model, Document } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number; // seconds
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    duration: { type: Number, required: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Video = model<IVideo>('Video', videoSchema);
