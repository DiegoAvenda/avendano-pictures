// src/App.tsx – Main application with routing
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Watch from '@/pages/Watch';
import { useMe } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

const App = () => {
  const { data: me, isLoading } = useMe();
  const { setUser } = useAuthStore();

  // Populate the auth store if a session cookie is present
  useEffect(() => {
    if (me) {
      setUser({ id: me.id, email: me.email });
    }
  }, [me, setUser]);

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-slate-200">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-500 text-xl font-black text-white">
          ▶
        </div>
        <div className="h-1.5 w-40 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
        </div>
        <p className="text-sm text-slate-400">Cargando StreamHub…</p>
      </div>
    );
  }

  const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { user } = useAuthStore();
    return user ? children : <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/watch/:id"
        element={
          <PrivateRoute>
            <Watch />
          </PrivateRoute>
        }
      />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
