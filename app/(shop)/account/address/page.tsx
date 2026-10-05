'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
import { useState, useRef, useEffect } from 'react';

const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false });

export default function SavedAddressPage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    defaultAddress: user?.defaultAddress || '',
    defaultNotes: user?.defaultNotes || '',
    defaultLatitude: user?.defaultLatitude ? Number(user.defaultLatitude) : null as number | null,
    defaultLongitude: user?.defaultLongitude ? Number(user.defaultLongitude) : null as number | null,
  });

  function handleMapSelect(lat: number, lng: number, address: string) {
    setForm((f) => ({ ...f, defaultLatitude: lat, defaultLongitude: lng, defaultAddress: address }));
  }
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (error) {
      errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);
  

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await updateProfile({
        ...form,
        defaultLatitude: form.defaultLatitude !== null ? String(form.defaultLatitude) : null,
        defaultLongitude: form.defaultLongitude !== null ? String(form.defaultLongitude) : null,
      });
      router.push('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save address');
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) return null;

  return (
    <div className="min-h-full bg-tint">
      <main className="mx-auto max-w-md p-6 py-10">
        <div className="rounded-2xl border-t-4 border-accent bg-surface p-8 shadow-lg">
          <h1 className="font-display text-2xl font-bold text-ink">Saved Delivery Address</h1>
          <p className="mt-1 text-sm text-ink/50">This will be pre-filled at checkout so you don&apos;t have to type it every time.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && <p ref={errorRef} className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p>}
            <div>
              <label className="mb-1 block font-display text-sm font-medium text-ink">Delivery address</label>
              <input value={form.defaultAddress} onChange={(e) => setForm({ ...form, defaultAddress: e.target.value })} className="w-full rounded-lg border border-tint px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
              <div>
                <label className="mb-1 block font-display text-sm font-medium text-ink">Or pin it on the map</label>
                <MapPicker latitude={form.defaultLatitude} longitude={form.defaultLongitude} onSelect={handleMapSelect} />
                <p className="mt-1 text-xs text-ink/40">Click the map, or drag the pin, to set your exact location — the address above updates automatically.</p>
              </div>
            </div>
            <div>
              <label className="mb-1 block font-display text-sm font-medium text-ink">Delivery notes (optional)</label>
              <textarea value={form.defaultNotes} onChange={(e) => setForm({ ...form, defaultNotes: e.target.value })} className="w-full rounded-lg border border-tint px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" rows={3} />
            </div>
            <button type="submit" disabled={submitting} className="w-full rounded-full bg-brand py-2.5 font-display font-semibold text-white hover:bg-[color:var(--color-brand-dark)] disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save Address'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}