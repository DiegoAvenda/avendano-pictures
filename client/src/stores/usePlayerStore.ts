import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { IVideo } from '@/types';

interface PlayerState {
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isMuted: boolean;
  playbackRate: number;
  activeVideo: IVideo | null;
  setPlaying: (v: boolean) => void;
  setVolume: (v: number) => void;
  setCurrentTime: (v: number) => void;
  setDuration: (v: number) => void;
  setMuted: (v: boolean) => void;
  setPlaybackRate: (v: number) => void;
  setActiveVideo: (v: IVideo | null) => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  devtools(
    persist(
      (set) => ({
        isPlaying: false,
        volume: 1,
        currentTime: 0,
        duration: 0,
        isMuted: false,
        playbackRate: 1,
        activeVideo: null,
        setPlaying: (isPlaying) => set({ isPlaying }),
        setVolume: (volume) => set({ volume: Math.min(1, Math.max(0, volume)) }),
        setCurrentTime: (currentTime) => set({ currentTime }),
        setDuration: (duration) => set({ duration }),
        setMuted: (isMuted) => set({ isMuted }),
        setPlaybackRate: (playbackRate) => set({ playbackRate }),
        setActiveVideo: (activeVideo) =>
          set({ activeVideo, currentTime: 0, duration: 0, isPlaying: false }),
        reset: () =>
          set({
            isPlaying: false,
            volume: 1,
            currentTime: 0,
            duration: 0,
            isMuted: false,
            playbackRate: 1,
            activeVideo: null,
          }),
      }),
      { name: 'player-storage' }
    )
  )
);
