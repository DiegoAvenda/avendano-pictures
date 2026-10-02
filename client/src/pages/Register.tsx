import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/schemas/auth.schema';
import { useRegister } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import type { RegisterInput } from '@/schemas/auth.schema';
import AppLayout from '@/components/layout/AppLayout';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending, error } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      await mutateAsync(data);
      navigate('/');
    } catch (e) {
      // error handling is done via TanStack Query error
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl">
        <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6">
          <h2 className="text-2xl font-black text-white">Crea tu cuenta</h2>
          <p className="mt-1 text-sm text-white/80">Únete a StreamHub en segundos.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-200">Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              {...register('email')}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-200">Password</label>
            <input
              type="password"
              placeholder="Mínimo 8 caracteres"
              {...register('password')}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
            />
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-fuchsia-600/25 transition hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-60"
          >
            {isPending ? 'Creando cuenta…' : 'Registrarse'}
          </button>
          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-950/40 px-3 py-2 text-xs text-red-300">
              {(error as Error).message}
            </p>
          )}
          <p className="text-center text-xs text-slate-400">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-semibold text-fuchsia-300 hover:text-fuchsia-200">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </AppLayout>
  );
};

export default Register;
