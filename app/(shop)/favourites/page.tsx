'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import ProductCard, { Product } from '@/components/ProductCard';

export default function FavouritesPage() {
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    apiFetch('/favorites').then(setProducts).finally(() => setLoading(false));
  }, [user]);

  if (authLoading) return <p className="p-6 text-ink/60">Loading...</p>;

  if (!user) {
    return (
      <main className="mx-auto max-w-md p-6 text-center">
        <h1 className="mb-4 font-display text-2xl font-bold text-ink">Log in to see your favourites</h1>
        <Link href="/login" className="inline-block rounded-full bg-brand px-6 py-2 font-display font-semibold text-white">Log In</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Your Favourites</h1>
      {loading ? (
        <p className="text-ink/60">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-ink/60">You haven&apos;t favourited any products yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </main>
  );
}