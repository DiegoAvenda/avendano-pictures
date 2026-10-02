import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLogout } from '@/hooks/useAuth';

const Navbar = () => {
  const { user } = useAuthStore();
  const { mutateAsync: logout, isPending } = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch {
      // noop – store is cleared on success only
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-500 text-lg font-black text-white shadow-lg shadow-fuchsia-500/20">
            ▶
          </span>
          <span className="text-lg font-extrabold tracking-tight text-white">
            Stream<span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Hub</span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 text-sm font-medium md:flex">
          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-slate-200 transition hover:bg-white/5 hover:text-white"
          >
            Inicio
          </Link>
          <span className="rounded-lg px-3 py-2 text-slate-500">Tendencias</span>
          <span className="rounded-lg px-3 py-2 text-slate-500">Suscripciones</span>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden max-w-[220px] truncate rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 sm:block">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                disabled={isPending}
                className="rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:opacity-60"
              >
                {isPending ? 'Saliendo…' : 'Salir'}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-fuchsia-600/25 transition hover:from-violet-500 hover:to-fuchsia-500"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
