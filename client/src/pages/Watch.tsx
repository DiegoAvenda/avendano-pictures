import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useVideoById, useIncrementViews } from '@/hooks/useVideos';
import CustomVideoPlayer from '@/components/player/CustomVideoPlayer';
import AppLayout from '@/components/layout/AppLayout';

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: video, isLoading, isError, error } = useVideoById(id || '');
  const { mutateAsync: incrementViews } = useIncrementViews();

  // Increment view count when video data is successfully loaded
  useEffect(() => {
    if (video?._id) {
      incrementViews(video._id).catch(() => {}); // ignore errors – best‑effort
    }
  }, [video, incrementViews]);

  return (
    <AppLayout>
      <Link to="/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white">
        ← Volver al feed
      </Link>

      {isLoading && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/5 bg-slate-900/70">
          <div className="aspect-video animate-pulse bg-slate-800" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-2/3 animate-pulse rounded bg-slate-800" />
            <div className="h-3 w-full animate-pulse rounded bg-slate-800" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-800" />
          </div>
        </div>
      )}

      {isError && (
        <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-950/30 p-8 text-center">
          <p className="font-bold text-red-300">Error al cargar el video</p>
          <p className="mt-1 text-sm text-red-200/70">{(error as Error).message}</p>
        </div>
      )}

      {video && (
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <CustomVideoPlayer video={video} />
            <div className="mt-4 rounded-2xl border border-white/5 bg-slate-900/70 p-5">
              <h1 className="text-xl font-extrabold text-white sm:text-2xl">{video.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="rounded-full bg-white/5 px-2.5 py-1 font-semibold">
                  👁 {video.views.toLocaleString()} vistas
                </span>
                <span className="rounded-full bg-white/5 px-2.5 py-1">
                  {new Date(video.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{video.description}</p>
            </div>
          </div>
          <aside className="rounded-2xl border border-white/5 bg-slate-900/60 p-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Detalles</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Duración</dt>
                <dd className="font-semibold text-slate-200">{Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, '0')}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">ID</dt>
                <dd className="max-w-[160px] truncate font-mono text-xs text-slate-300">{video._id}</dd>
              </div>
            </dl>
            <Link
              to="/"
              className="mt-5 block rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Ver más videos
            </Link>
          </aside>
        </div>
      )}
    </AppLayout>
  );
};

export default Watch;
