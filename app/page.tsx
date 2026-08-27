'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  name: string;
  price: string;
  unit: string;
  stockQty: number;
  category: { name: string };
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addItem, items } = useCart();

  useEffect(() => {
    apiFetch('/products')
      .then(setProducts)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sana Cash 'n' Carry</h1>
        <Link href="/cart" className="rounded bg-black px-4 py-2 text-white">
          Cart ({cartCount})
        </Link>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((p) => (
            <div key={p.id} className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-gray-500">{p.category.name}</p>
              <p className="mt-2 font-bold">MWK {p.price} <span className="text-xs font-normal text-gray-500">/ {p.unit}</span></p>
              <p className="text-xs text-gray-400">{p.stockQty} in stock</p>
              <button
                onClick={() => addItem({ productId: p.id, name: p.name, price: Number(p.price), unit: p.unit })}
                disabled={p.stockQty === 0}
                className="mt-3 w-full rounded bg-black py-1.5 text-sm text-white disabled:bg-gray-300"
              >
                {p.stockQty === 0 ? 'Out of stock' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}