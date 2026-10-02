import React from 'react';
import Navbar from '@/components/layout/Navbar';

interface Props {
  children: React.ReactNode;
}

const AppLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">{children}</main>
      <footer className="border-t border-slate-800/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>StreamHub — demo de video streaming con React + Tailwind.</p>
          <p>Los videos de ejemplo se cargan desde el backend (`pnpm seed`).</p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
