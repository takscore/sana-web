'use client';

import { useEffect, useState } from 'react';
import { MapPin, Phone, Clock, PackageCheck, Navigation, Search, Check, Store } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import PageShell from '@/components/PageShell';

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') || '';

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  latitude: string | null;
  longitude: string | null;
  operatingHours: string | null;
  pickupInstructions: string | null;
  imageUrl: string | null;
}

// Google's "Maps URLs" links need no API key or billing account.
function directionsUrl(b: Branch) {
  if (b.latitude && b.longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${b.latitude},${b.longitude}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.name} ${b.address}`)}`;
}

export default function StoresPage() {
  const { user, updateProfile } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/branches')
      .then(setBranches)
      .catch(() => setError('Failed to load branches'))
      .finally(() => setLoading(false));
  }, []);

  async function handleSetMyBranch(id: string) {
    setSavingId(id);
    setError('');
    try {
      await updateProfile({ defaultBranchId: id });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your branch');
    } finally {
      setSavingId(null);
    }
  }

  const query = search.trim().toLowerCase();
  const visible = branches.filter((b) => `${b.name} ${b.address}`.toLowerCase().includes(query));

  return (
    <PageShell
      title="Find a Store"
      subtitle="Chipiku Plus branches near you"
      icon={Store}
      maxWidth="max-w-4xl"
    >
      <div className="mb-6 flex items-center rounded-full bg-surface px-4 py-2.5 shadow-sm">
        <Search size={18} className="text-ink/40" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by branch name or area..."
          className="ml-2 w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/40"
        />
      </div>

      {error && <p className="mb-4 text-sm text-accent">{error}</p>}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-surface" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border-t-4 border-accent bg-surface p-8 text-center shadow-lg">
          <p className="font-display font-bold text-ink">
            {branches.length === 0 ? 'No branches listed yet' : 'No branches match your search'}
          </p>
          <p className="mt-1 text-sm text-ink/60">
            {branches.length === 0 ? 'Check back soon.' : 'Try a different name or area.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {visible.map((b) => {
            const isMine = user?.defaultBranchId === b.id;
            return (
              <div key={b.id} className="relative min-h-48 overflow-hidden rounded-2xl border border-tint bg-surface shadow-sm">
                {b.imageUrl ? (
                  <img
                    src={`${API_ORIGIN}${b.imageUrl}`}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <Store size={90} className="absolute -bottom-4 -right-4 text-brand/10" />
                )}
                {/* White on the left (where the text sits), fading to reveal the branch photo on the right */}
                <div className="absolute inset-0 bg-linear-to-r from-surface via-surface/85 to-surface/40" />

                <div className="relative z-10 flex h-full flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-display text-lg font-bold text-ink">{b.name}</p>
                    {isMine && (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-brand px-2.5 py-1 font-display text-[10px] font-bold uppercase text-white">
                        <Check size={10} /> My branch
                      </span>
                    )}
                  </div>

                  <div className="mt-2 space-y-1 text-sm text-ink/70">
                    <p className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0" /> {b.address}</p>
                    {b.phone && <p className="flex items-center gap-2"><Phone size={14} /> {b.phone}</p>}
                    {b.operatingHours && <p className="flex items-center gap-2"><Clock size={14} /> {b.operatingHours}</p>}
                    {b.pickupInstructions && (
                      <p className="flex items-start gap-2 text-ink/60">
                        <PackageCheck size={14} className="mt-0.5 shrink-0" /> {b.pickupInstructions}
                      </p>
                    )}
                  </div>

                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    <a
                      href={directionsUrl(b)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-full bg-brand px-4 py-1.5 font-display text-xs font-semibold text-white hover:bg-[color:var(--color-brand-dark)]"
                    >
                      <Navigation size={12} /> Directions
                    </a>
                    {b.phone && (
                      <a
                        href={`tel:${b.phone.replace(/\s+/g, '')}`}
                        className="flex items-center gap-1 rounded-full border border-brand bg-surface px-4 py-1.5 font-display text-xs font-semibold text-brand hover:bg-brand hover:text-white"
                      >
                        <Phone size={12} /> Call
                      </a>
                    )}
                    {user && !isMine && (
                      <button
                        onClick={() => handleSetMyBranch(b.id)}
                        disabled={savingId === b.id}
                        className="flex items-center gap-1 rounded-full border border-ink/20 bg-surface px-4 py-1.5 font-display text-xs font-semibold text-ink/70 hover:border-brand hover:text-brand disabled:opacity-50"
                      >
                        {savingId === b.id ? 'Saving...' : 'Set as my branch'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}