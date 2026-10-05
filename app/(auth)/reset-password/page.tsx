'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PasswordInput from '@/components/PasswordInput';
import { passwordRequirements, isPasswordValid } from '@/lib/validation';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('This reset link is missing or invalid. Please request a new one.');
      return;
    }
    if (!isPasswordValid(newPassword)) {
      setError('Please meet all password requirements below.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="w-full rounded-2xl border-t-4 border-accent bg-surface p-8 text-center shadow-lg">
        <h1 className="font-display text-2xl font-bold text-ink">Password Reset</h1>
        <p className="mt-2 text-sm text-ink/60">Your password has been updated. You can now log in.</p>
        <Link href="/login" className="mt-6 inline-block rounded-full bg-brand px-6 py-2 font-display font-semibold text-white">
          Go to Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border-t-4 border-accent bg-surface p-8 shadow-lg">
      <h1 className="font-display text-2xl font-bold text-ink">Reset Password</h1>
      <p className="mt-1 text-sm text-ink/50">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p>}
        <div>
          <label className="mb-1 block font-display text-sm font-medium text-ink">New password</label>
          <PasswordInput
            placeholder="(min 8 characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-tint px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            required
          />
          <ul className="mt-2 space-y-1">
            {passwordRequirements.map((req) => {
              const met = req.test(newPassword);
              return (
                <li key={req.label} className={`flex items-center gap-1.5 text-xs ${met ? 'text-brand' : 'text-ink/40'}`}>
                  {met ? <Check size={12} /> : <X size={12} />} {req.label}
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <label className="mb-1 block font-display text-sm font-medium text-ink">Confirm new password</label>
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-tint px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand py-2.5 font-display font-semibold text-white hover:bg-[color:var(--color-brand-dark)] disabled:opacity-50"
        >
          {submitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-ink/60">Loading...</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}