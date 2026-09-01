'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

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
    <>
      
      <main className="mx-auto max-w-sm p-6">
        <h1 className="mb-1 font-display text-2xl font-bold text-ink">Log In</h1>
        <p className="mb-6 text-sm text-ink/50">Welcome back to Chipiku Plus.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-accent">{error}</p>}

          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-tint px-3 py-2"
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-tint px-3 py-2"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-brand py-2.5 font-display font-semibold text-white hover:bg-[color:var(--color-brand-dark)] disabled:opacity-50"
          >
            {submitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-ink/50">
          No account? <Link href="/register" className="font-semibold text-brand underline">Register</Link>
        </p>
      </main>
    </>
  );
}