import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { IVideo } from '@/types';

interface PlayerState {
  isPlaying: boolean;
  volume: number; // 0 - 1
  currentTime: number; // seconds
  duration: number; // seconds
  isMuted: boolean;
  playbackRate: number; // e.g., 1.0
  activeVideo: IVideo | null;

  // Actions
  setPlaying: (playing: boolean) => void;
  setVolume: (vol: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (dur: number) => void;
  setMuted: (muted: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  setActiveVideo: (video: IVideo | null) => void;
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
        setPlaying: (playing) => set({ isPlaying: playing }),
        setVolume: (vol) => set({ volume: Math.min(1, Math.max(0, vol)) }),
        setCurrentTime: (time) => set({ currentTime: time }),
        setDuration: (dur) => set({ duration: dur }),
        setMuted: (muted) => set({ isMuted: muted }),
        setPlaybackRate: (rate) => set({ playbackRate: rate }),
        setActiveVideo: (video) => set({ activeVideo: video, currentTime: 0, duration: 0, isPlaying: false }),
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
