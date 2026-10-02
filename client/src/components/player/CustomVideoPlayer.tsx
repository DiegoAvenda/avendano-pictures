import React, { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { IVideo } from '@/types';

interface Props {
  video: IVideo;
}

const CustomVideoPlayer: React.FC<Props> = ({ video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    isPlaying,
    volume,
    currentTime,
    duration,
    isMuted,
    playbackRate,
    setPlaying,
    setVolume,
    setCurrentTime,
    setDuration,
    setMuted,
    setPlaybackRate,
    setActiveVideo,
  } = usePlayerStore();

  // Sync selected video to store when component mounts
  useEffect(() => {
    setActiveVideo(video);
  }, [video, setActiveVideo]);

  // Attach event listeners to video element
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const onLoadedMetadata = () => {
      setDuration(el.duration);
    };
    const onTimeUpdate = () => {
      setCurrentTime(el.currentTime);
    };
    const onEnded = () => {
      setPlaying(false);
    };

    el.addEventListener('loadedmetadata', onLoadedMetadata);
    el.addEventListener('timeupdate', onTimeUpdate);
    el.addEventListener('ended', onEnded);

    return () => {
      el.removeEventListener('loadedmetadata', onLoadedMetadata);
      el.removeEventListener('timeupdate', onTimeUpdate);
      el.removeEventListener('ended', onEnded);
    };
  }, [setDuration, setCurrentTime, setPlaying]);

  // React to store changes (play/pause, volume, mute, rate)
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (isPlaying) {
      el.play().catch(console.error);
    } else {
      el.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.volume = volume;
  }, [volume]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.playbackRate = playbackRate;
  }, [playbackRate]);

  // UI control handlers
  const togglePlay = () => setPlaying(!isPlaying);
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  const toggleMute = () => setMuted(!isMuted);
  const handleRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlaybackRate(parseFloat(e.target.value));
  };
  const toggleFullScreen = async () => {
    const el = videoRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnailUrl}
        controls={false}
        onClick={togglePlay}
        className="aspect-video w-full cursor-pointer bg-black"
      />

      {/* Controls overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-8">
        {/* Progress bar */}
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          className="w-full cursor-pointer"
        />
        <div className="mb-1.5 flex justify-between text-[11px] font-medium tabular-nums text-slate-300">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Bottom row: play, volume, mute, rate, fullscreen */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-white">
          <button
            onClick={togglePlay}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-base font-bold text-slate-950 transition hover:bg-fuchsia-200"
            title={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? '❚❚' : '▶'}
          </button>
          <button
            onClick={toggleMute}
            className="rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-semibold backdrop-blur transition hover:bg-white/20"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 cursor-pointer"
          />
          <select
            value={playbackRate}
            onChange={handleRateChange}
            className="rounded-lg bg-white/10 px-2 py-1.5 text-xs font-semibold backdrop-blur focus:outline-none"
          >
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
              <option key={rate} value={rate} className="bg-slate-900">
                {rate}x
              </option>
            ))}
          </select>
          <button
            onClick={toggleFullScreen}
            className="ml-auto rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-semibold backdrop-blur transition hover:bg-white/20"
          >
            ⛶ Pantalla completa
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomVideoPlayer;
