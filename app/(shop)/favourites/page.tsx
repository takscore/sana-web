'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import PageShell from '@/components/PageShell';
import ProductCard, { Product } from '@/components/ProductCard';

export default function FavouritesPage() {
  const { user, loading: authLoading } = useAuth();
  const { addItem, openDrawer } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    apiFetch('/favorites').then(setProducts).finally(() => setLoading(false));
  }, [user]);

  function handleAddAll() {
    products.forEach((p) =>
      addItem({ productId: p.id, name: p.name, price: Number(p.price), unit: p.unit, imageUrl: p.imageUrl })
    );
    openDrawer();
  }

  if (authLoading) {
    return (
      <PageShell title="Your Favourites" icon={Heart}>
        <div className="h-40 animate-pulse rounded-2xl bg-surface" />
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell title="Your Favourites" subtitle="Save the products you buy most" icon={Heart} maxWidth="max-w-2xl">
        <div className="rounded-2xl border-t-4 border-accent bg-surface p-8 text-center shadow-lg">
          <p className="font-display text-lg font-bold text-ink">Log in to see your favourites</p>
          <p className="mt-1 text-sm text-ink/60">Tap the heart on any product to save it here for next time.</p>
          <Link
            href="/login"
            className="mt-5 inline-block rounded-full bg-brand px-6 py-2 font-display text-sm font-semibold text-white hover:bg-[color:var(--color-brand-dark)]"
          >
            Log In
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Your Favourites"
      subtitle={loading ? 'Loading...' : `${products.length} saved item${products.length === 1 ? '' : 's'}`}
      icon={Heart}
      maxWidth="max-w-6xl"
      actions={
        products.length > 0 ? (
          <button
            onClick={handleAddAll}
            className="flex items-center gap-2 rounded-full bg-accent px-5 py-2 font-display text-sm font-semibold text-white hover:bg-red-700"
          >
            <ShoppingCart size={16} /> Add all to cart
          </button>
        ) : undefined
      }
    >
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-xl bg-surface" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border-t-4 border-accent bg-surface p-8 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-tint text-brand">
            <Heart size={26} />
          </div>
          <p className="mt-4 font-display text-lg font-bold text-ink">No favourites yet</p>
          <p className="mt-1 text-sm text-ink/60">Tap the heart on any product to save it here.</p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-full bg-brand px-6 py-2 font-display text-sm font-semibold text-white hover:bg-[color:var(--color-brand-dark)]"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </PageShell>
  );
}