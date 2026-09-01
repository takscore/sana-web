'use client';

import { useEffect, useState } from 'react';
import { MapPin, Phone } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface Branch { id: string; name: string; address: string; phone: string | null; }

export default function StoresPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/branches').then(setBranches).finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-2 font-display text-2xl font-bold text-ink">Find a Store</h1>
      <p className="mb-6 text-ink/60">Chipiku Plus branches near you.</p>

      {loading ? (
        <p className="text-ink/60">Loading branches...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {branches.map((b) => (
            <div key={b.id} className="rounded-xl border border-tint bg-surface p-4">
              <p className="font-display font-semibold text-ink">{b.name}</p>
              <p className="mt-1 flex items-center gap-2 text-sm text-ink/60">
                <MapPin size={14} /> {b.address}
              </p>
              {b.phone && (
                <p className="mt-1 flex items-center gap-2 text-sm text-ink/60">
                  <Phone size={14} /> {b.phone}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}