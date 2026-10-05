'use client';

import { useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="w-full rounded-2xl border-t-4 border-accent bg-surface p-8 text-center shadow-lg">
        <h1 className="font-display text-2xl font-bold text-ink">Check your email</h1>
        <p className="mt-2 text-sm text-ink/60">
          If an account exists for {email}, we&apos;ve sent instructions to reset your password.
        </p>
        <Link
            href="/login"
            className="mt-6 inline-block rounded-full border border-brand bg-white px-6 py-2.5 font-display font-semibold text-brand transition-all duration-300 hover:bg-brand hover:text-white"
            >
            Back to Log In
            </Link>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border-t-4 border-accent bg-surface p-8 shadow-lg">
      <h1 className="font-display text-2xl font-bold text-ink">Forgot Password</h1>
      <p className="mt-1 text-sm text-ink/50">Enter your email and we&apos;ll send you instructions to reset it.</p>

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
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand py-2.5 font-display font-semibold text-white hover:bg-[color:var(--color-brand-dark)] disabled:opacity-50"
        >
          {submitting ? 'Sending...' : 'Send Reset Instructions'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/50">
        Remembered your password? <Link href="/login" className="font-semibold text-brand hover:underline">Log in</Link>
      </p>
    </div>
  );
}