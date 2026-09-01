'use client';

import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useSearch } from '@/context/SearchContext';
import PromoCarousel from '@/components/PromoCarousel';
import CategoryStrip from '@/components/CategoryStrip';

interface Product {
  id: string;
  name: string;
  price: string;
  unit: string;
  stockQty: number;
  imageUrl: string | null;
  category: { name: string };
}

function SwooshDivider() {
  return (
    <svg viewBox="0 0 200 20" className="h-3 w-32" preserveAspectRatio="none">
      <path d="M0 15 Q 80 0 200 5" fill="none" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addItem } = useCart();
  const { query, categoryId } = useSearch();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading state syncs with an in-flight API fetch triggered by query/category changes, not a render loop
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (categoryId) params.set('category', categoryId);
    const qs = params.toString();
    apiFetch(`/products${qs ? `?${qs}` : ''}`)
      .then(setProducts)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load products'))
      .finally(() => setLoading(false));
  }, [query, categoryId]);

  return (
    <>
      
      <CategoryStrip />
      <PromoCarousel />

      <main className="mx-auto max-w-6xl p-6">
        <div className="mb-6 flex items-center gap-3">
          <h2 className="font-display text-xl font-bold text-ink">
            {query ? `Results for "${query}"` : 'Shop the essentials'}
          </h2>
          <SwooshDivider />
        </div>

        {error && <p className="text-accent">{error}</p>}

        {loading ? (
          <p className="text-ink/60">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-ink/60">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {products.map((p) => (
              <div key={p.id} className="overflow-hidden rounded-xl border border-tint bg-surface shadow-sm">
                <div className="flex h-32 items-center justify-center bg-tint">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <Package size={32} className="text-brand/40" />
                  )}
                </div>
                <div className="p-4">
                  <p className="font-display font-semibold text-ink">{p.name}</p>
                  <p className="text-xs text-ink/50">{p.category.name}</p>
                  <p className="mt-2 font-display font-bold text-brand">
                    MWK {p.price}
                    <span className="text-xs font-normal text-ink/50"> / {p.unit}</span>
                  </p>
                  <p className="text-xs text-ink/40">{p.stockQty} in stock</p>
                  <button
                    onClick={() => addItem({ productId: p.id, name: p.name, price: Number(p.price), unit: p.unit })}
                    disabled={p.stockQty === 0}
                    className="mt-3 w-full rounded-full bg-accent py-1.5 text-sm font-display font-semibold text-white hover:bg-red-700 disabled:bg-gray-300"
                  >
                    {p.stockQty === 0 ? 'Out of stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}