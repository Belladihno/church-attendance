import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import redeemLogo from '@/assets/redeem-logo.png';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setError('');
    try {
      await login(values.email, values.password);
      navigate('/');
    } catch (e: any) {
      if (!e.response) {
        setError('Cannot reach the server. Please check your connection and try again.');
      } else if (e.response.status === 429) {
        setError(e.response.data?.message || 'Too many attempts. Please wait a minute and try again.');
      } else if (e.response.status >= 500) {
        setError('Something went wrong on our end. Please try again later.');
      } else {
        setError(e.response.data?.message || 'Invalid email or password');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-base">
      <header className="w-full py-3 sm:py-4 px-4 sm:px-8 flex items-center justify-between gap-3 border-b border-border bg-bg-card">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <img src={redeemLogo} alt="RCCG Logo" className="w-8 h-8 rounded-full object-contain shrink-0" />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-text-primary truncate">RCCG Grace Chapel Area</div>
            <div className="text-[11px] text-text-secondary truncate">Parish Attendance & Pastoral Care Portal</div>
          </div>
        </div>
        <span className="text-[11px] sm:text-xs text-brand-green font-medium shrink-0 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green sm:hidden" />
          System Operational
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-[420px] flex flex-col items-center">
          <div className="flex flex-col items-center text-center mb-6">
            <img src={redeemLogo} alt="RCCG Logo" className="w-24 h-24 rounded-full object-contain bg-bg-card border border-border shadow-card p-1 mb-3" />
            <h1 className="text-[20px] font-bold text-text-primary">The Redeemed Christian Church of God</h1>
            <p className="text-sm font-semibold text-brand-purple">Grace Chapel Area</p>
          </div>

          <div className="w-full bg-bg-card rounded-xl border border-border shadow-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-text-primary">Attendance Management System</h2>
            <p className="text-sm text-text-secondary mt-1">Sign in with your administrative credentials</p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-6">
              <Input label="Email address" placeholder="pastor.name@gracechapel.org" {...register('email')} error={errors.email?.message} />
              <Input label="Password" type="password" placeholder="Enter password" {...register('password')} error={errors.password?.message} />
              {error && <div className="p-3 rounded-lg bg-absent-bg border border-brand-red/20 text-xs text-absent">{error}</div>}
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Sign in to your account'}</Button>
            </form>
          </div>
        </div>
      </main>

      <footer className="w-full py-4 px-4 border-t border-border text-center text-xs text-text-secondary bg-bg-card/40">
        © 2026 RCCG Grace Chapel Area
      </footer>
    </div>
  );
}
