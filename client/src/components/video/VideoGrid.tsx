import React from 'react';
import type { IVideo } from '@/types';
import VideoCard from '@/components/video/VideoCard';

interface Props {
  videos: IVideo[];
}

const VideoGrid: React.FC<Props> = ({ videos }) => {
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 text-3xl">
          🎬
        </div>
        <h3 className="mt-5 text-lg font-bold text-white">Aún no hay videos</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
          La colección de videos está vacía. Si eres desarrollador, ejecuta el seed del backend
          (<code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-fuchsia-300">pnpm seed</code>) para
          cargar los videos de ejemplo y ver el feed en acción.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-300">
            1. Levanta MongoDB
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-300">
            2. pnpm seed en /server
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-300">
            3. Recarga esta página
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
};

export default VideoGrid;
