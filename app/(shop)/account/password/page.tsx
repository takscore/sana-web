'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PasswordInput from '@/components/PasswordInput';
import { passwordRequirements, isPasswordValid } from '@/lib/validation';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!isPasswordValid(form.newPassword)) {
      setError('Please meet all password requirements below');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      router.push('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-full bg-tint">
      <main className="mx-auto max-w-md p-6 py-10">
        <div className="rounded-2xl border-t-4 border-accent bg-surface p-8 shadow-lg">
          <h1 className="font-display text-2xl font-bold text-ink">Change Password</h1>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p>}
            <div>
              <label className="mb-1 block font-display text-sm font-medium text-ink">Current password</label>
              <PasswordInput
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                className="w-full rounded-lg border border-tint px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                required
              />
            </div>
            <div>
              <label className="mb-1 block font-display text-sm font-medium text-ink">New password</label>
              <PasswordInput
                placeholder="(min 8 characters)"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="w-full rounded-lg border border-tint px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                required
              />
              <ul className="mt-2 space-y-1">
                {passwordRequirements.map((req) => {
                  const met = req.test(form.newPassword);
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
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full rounded-lg border border-tint px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-brand py-2.5 font-display font-semibold text-white hover:bg-[color:var(--color-brand-dark)] disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}