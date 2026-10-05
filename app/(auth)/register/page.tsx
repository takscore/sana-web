'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import PasswordInput from '@/components/PasswordInput';
import TermsAgreement from '@/components/TermsAgreement';
import { EMAIL_REGEX, passwordRequirements, isPasswordValid } from '@/lib/validation';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!EMAIL_REGEX.test(form.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!isPasswordValid(form.password)) {
      setError('Please meet all password requirements below');
      return;
    }

    setSubmitting(true);
    try {
      await register(form.name, form.email, form.phone, form.password);
      router.push('/checkout');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full rounded-2xl border-t-4 border-accent bg-surface p-8 shadow-lg">
      <h1 className="font-display text-2xl font-bold text-ink">Create Account</h1>
      <p className="mt-1 text-sm text-ink/50">Join Chipiku Plus to shop online, choose your store, and get your order delivered or ready for pickup.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p>}

        <div>
          <label className="mb-1 block font-display text-sm font-medium text-ink">Full name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-tint px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            required
          />
        </div>
        <div>
          <label className="mb-1 block font-display text-sm font-medium text-ink">Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-tint px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            required
          />
        </div>
        <div>
          <label className="mb-1 block font-display text-sm font-medium text-ink">Phone number</label>
          <input
            placeholder="e.g. 0999123456"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-lg border border-tint px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            required
          />
        </div>
        <div>
          <label className="mb-1 block font-display text-sm font-medium text-ink">Password</label>
          <PasswordInput
            placeholder="(min 8 characters)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border border-tint px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            required
          />
          <ul className="mt-2 space-y-1">
            {passwordRequirements.map((req) => {
              const met = req.test(form.password);
              return (
                <li key={req.label} className={`flex items-center gap-1.5 text-xs ${met ? 'text-brand' : 'text-ink/40'}`}>
                  {met ? <Check size={12} /> : <X size={12} />} {req.label}
                </li>
              );
            })}
          </ul>
        </div>

        <TermsAgreement />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand py-2.5 font-display font-semibold text-white transition-colors hover:bg-[color:var(--color-brand-dark)] disabled:opacity-50"
        >
          {submitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/50">
        Already have an account? <Link href="/login" className="font-semibold text-brand underline">Log in</Link>
      </p>
    </div>
  );
}