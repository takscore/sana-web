'use client';

import Link from 'next/link';
import { Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-full bg-tint">
        <main className="mx-auto max-w-2xl p-6 py-10">
          <div className="rounded-2xl border-t-4 border-accent bg-surface p-8 text-center shadow-lg">
            <h1 className="mb-4 font-display text-2xl font-bold text-ink">Your Cart</h1>
            <p className="text-ink/60">Your cart is empty.</p>
            <Link href="/" className="mt-4 inline-block font-display font-semibold text-brand underline">
              Continue shopping
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-tint">
      <main className="mx-auto max-w-2xl p-6 py-10">
        <div className="rounded-2xl border-t-4 border-accent bg-surface p-8 shadow-lg">
          <h1 className="mb-6 font-display text-2xl font-bold text-ink">Your Cart</h1>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between rounded-xl border border-tint bg-tint/40 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-tint">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <Package size={20} className="text-brand/40" />
                    )}
                  </div>
                  <div>
                    <p className="font-display font-semibold text-ink">{item.name}</p>
                    <p className="text-sm text-ink/50">MWK {item.price} / {item.unit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                    className="w-16 rounded-full border border-tint bg-surface px-3 py-1 text-center"
                  />
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-sm font-semibold text-accent hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-tint pt-4">
            <p className="font-display text-lg font-bold text-ink">
              Subtotal: <span className="text-brand">MWK {subtotal.toFixed(2)}</span>
            </p>
            <Link
              href="/checkout"
              className="rounded-full bg-accent px-6 py-2 font-display font-semibold text-white hover:bg-red-700"
            >
              Checkout
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}