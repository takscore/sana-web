'use client';

import { useEffect, useState } from 'react';
import { Tag } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PageShell from '@/components/PageShell';
import ProductCard, { Product } from '@/components/ProductCard';

type Filter = 'all' | 'deals' | 'drops' | 'clearance';

function hasPriceDrop(p: Product) {
  return !!p.compareAtPrice && Number(p.compareAtPrice) > Number(p.price);
}

const matchers: Record<Filter, (p: Product) => boolean> = {
  all: () => true,
  deals: (p) => !!p.dealTag && !p.isClearance,
  drops: (p) => hasPriceDrop(p),
  clearance: (p) => p.isClearance,
};

const tabs: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All offers' },
  { key: 'deals', label: 'Multi-buy deals' },
  { key: 'drops', label: 'Price drops' },
  { key: 'clearance', label: 'Clearance' },
];

export default function OffersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    apiFetch('/products')
      .then((data: Product[]) => setProducts(data.filter((p) => p.dealTag || p.isClearance || hasPriceDrop(p))))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load offers'))
      .finally(() => setLoading(false));
  }, []);

  const visible = products.filter(matchers[filter]);

  return (
    <PageShell
      title="Offers"
      subtitle="Deals, price drops and clearance across our stores"
      icon={Tag}
      maxWidth="max-w-6xl"
    >
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`shrink-0 rounded-full px-4 py-2 font-display text-sm font-semibold ${
              filter === t.key ? 'bg-brand text-white' : 'bg-surface text-ink hover:bg-white'
            }`}
          >
            {t.label} ({products.filter(matchers[t.key]).length})
          </button>
        ))}
      </div>

      {error && <p className="mb-4 text-sm text-accent">{error}</p>}

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-xl bg-surface" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border-t-4 border-accent bg-surface p-8 text-center shadow-lg">
          <p className="font-display font-bold text-ink">No offers in this category right now</p>
          <p className="mt-1 text-sm text-ink/60">New deals are added regularly, so check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </PageShell>
  );
}