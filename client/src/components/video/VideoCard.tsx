import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { IVideo } from '@/types';

interface Props {
  video: IVideo;
}

const formatViews = (cnt: number) => {
  if (cnt >= 1_000_000) return `${(cnt / 1_000_000).toFixed(1)} M vistas`;
  if (cnt >= 1_000) return `${(cnt / 1_000).toFixed(1)} K vistas`;
  return `${cnt} vistas`;
};

const formatDuration = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mins}:${secs}`;
};

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(diff)) return '';
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'ahora mismo';
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `hace ${days} d`;
  const months = Math.floor(days / 30);
  if (months < 12) return `hace ${months} mes`;
  return `hace ${Math.floor(months / 12)} a`;
};

const VideoCard: React.FC<Props> = ({ video }) => {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/watch/${video._id}`)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-slate-900/70 transition duration-200 hover:-translate-y-1 hover:border-fuchsia-500/30 hover:shadow-2xl hover:shadow-fuchsia-950/40"
    >
      <div className="relative aspect-video overflow-hidden bg-slate-800">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <span className="absolute bottom-2 right-2 rounded-md bg-black/85 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-white">
          {formatDuration(video.duration)}
        </span>
        <span className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-sm text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
          ▶
        </span>
      </div>

      <div className="flex gap-3 p-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 text-sm font-black text-white">
          {video.title.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-100" title={video.title}>
            {video.title}
          </h3>
          <p className="mt-1.5 line-clamp-1 text-xs text-slate-400">{video.description}</p>
          <p className="mt-1 text-xs text-slate-500">
            {formatViews(video.views)}
            {video.createdAt ? ` • ${timeAgo(video.createdAt)}` : ''}
          </p>
        </div>
      </div>
    </article>
  );
};

export default VideoCard;
