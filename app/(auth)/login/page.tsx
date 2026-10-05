'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import PasswordInput from '@/components/PasswordInput';
import { EMAIL_REGEX } from '@/lib/validation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!EMAIL_REGEX.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      router.push('/checkout');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full rounded-2xl border-t-4 border-accent bg-surface p-8 shadow-lg">
      <h1 className="font-display text-2xl font-bold text-ink">Log In</h1>
      <p className="mt-1 text-sm text-ink/50">Welcome back to Chipiku Plus.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p>}

        <div>
          <label className="mb-1 block font-display text-sm font-medium text-ink">Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-tint px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            required
          />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="block font-display text-sm font-medium text-ink">Password</label>
          
          </div>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-tint px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            required
          />
          <div className="mb-1 mt-2 flex items-center justify-end">
            <Link href="/forgot-password" className="text-xs font-semibold text-brand hover:underline">Forgot password?</Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand py-2.5 font-display font-semibold text-white transition-colors hover:bg-[color:var(--color-brand-dark)] disabled:opacity-50"
        >
          {submitting ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/50">
        New to Chipiku Plus? <Link href="/register" className="font-semibold text-brand hover:underline">Register here</Link>
      </p>
    </div>
  );
}