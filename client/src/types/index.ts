// src/types/index.ts – shared TypeScript interfaces between client and server

export interface IUser {
  id: string;
  email: string;
}

export interface IVideo {
  _id: string; // MongoDB ObjectId
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number; // seconds
  views: number;
  createdAt: string; // ISO date string
  updatedAt: string;
}

// Auth response shape used by the client
export interface AuthResponse {
  success: boolean;
  data?: {
    id: string;
    email: string;
  };
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}
