import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useVideoFeed } from '@/hooks/useVideos';
import VideoGrid from '@/components/video/VideoGrid';
import AppLayout from '@/components/layout/AppLayout';

const CATEGORIES = ['Todos', 'Animación', 'Cortos', 'Aventura', 'Promos'];

const SkeletonGrid = () => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900/70"
      >
        <div className="aspect-video animate-pulse bg-slate-800" />
        <div className="flex gap-3 p-3.5">
          <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-slate-800" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 animate-pulse rounded bg-slate-800" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-slate-800" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Home: React.FC = () => {
  const { data: videos, isLoading, isError, error, refetch, isFetching } = useVideoFeed();
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('Todos');

  const filtered = useMemo(() => {
    const list = videos ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q)
    );
  }, [videos, query]);

  const featured = videos?.[0];

  return (
    <AppLayout>
      {/* Hero */}
      <section className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950 via-slate-900 to-fuchsia-950 p-6 sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-fuchsia-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            {isLoading ? 'Cargando catálogo…' : `${videos?.length ?? 0} videos disponibles`}
          </p>
          <h1 className="mt-4 max-w-2xl text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
            Descubre, mira y comparte{' '}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-rose-300 bg-clip-text text-transparent">
              grandes historias
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Explora el feed de videos de ejemplo. Busca por título, filtra por categoría
            y entra a cada video para ver el reproductor personalizado con control de
            velocidad, volumen y pantalla completa.
          </p>

          <div className="mt-6 flex max-w-xl items-center gap-2 rounded-2xl border border-white/10 bg-black/40 p-2 backdrop-blur">
            <span className="pl-2 text-slate-400">⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar videos… (ej. Sintel, Bunny)"
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="rounded-lg px-2 py-1 text-xs text-slate-400 hover:bg-white/10 hover:text-white"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  activeCat === c
                    ? 'bg-white text-slate-950 shadow'
                    : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Destacado */}
      {!isLoading && featured && !query && (
        <section className="mt-6 overflow-hidden rounded-2xl border border-white/5 bg-slate-900/60">
          <div className="flex flex-col sm:flex-row">
            <div className="relative aspect-video w-full overflow-hidden sm:w-2/5">
              <img src={featured.thumbnailUrl} alt={featured.title} className="h-full w-full object-cover" />
              <span className="absolute left-3 top-3 rounded-full bg-fuchsia-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow">
                Destacado
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-center p-5 sm:p-7">
              <h2 className="text-xl font-extrabold text-white sm:text-2xl">{featured.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400">{featured.description}</p>
              <div>
                <Link
                  to={`/watch/${featured._id}`}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-fuchsia-600/25 transition hover:from-violet-500 hover:to-fuchsia-500"
                >
                  ▶ Ver ahora
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Feed */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-white">Video Feed</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {isFetching ? 'Actualizando…' : query ? `${filtered.length} resultado(s) para “${query}”` : 'Últimos videos publicados'}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            ↻ Recargar
          </button>
        </div>

        {isLoading && <SkeletonGrid />}

        {isError && (
          <div className="rounded-2xl border border-red-500/20 bg-red-950/30 p-6 text-center">
            <p className="text-sm font-bold text-red-300">No se pudo cargar el feed</p>
            <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-red-200/70">
              {(error as Error).message} — verifica que el backend esté corriendo en
              `http://localhost:5000` y que el proxy de Vite (`/api`) apunte bien.
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
            >
              Reintentar
            </button>
          </div>
        )}

        {!isLoading && !isError && <VideoGrid videos={filtered} />}

        {!isLoading && !isError && query && filtered.length === 0 && (videos?.length ?? 0) > 0 && (
          <p className="mt-4 text-center text-xs text-slate-500">
            Sin coincidencias. Prueba con otro término o <button className="underline" onClick={() => setQuery('')}>limpia la búsqueda</button>.
          </p>
        )}
      </section>
    </AppLayout>
  );
};

export default Home;
