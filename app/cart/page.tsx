'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <>
        
        <main className="mx-auto max-w-2xl p-6 text-center">
          <h1 className="mb-4 font-display text-2xl font-bold text-ink">Your Cart</h1>
          <p className="text-ink/60">Your cart is empty.</p>
          <Link href="/" className="mt-4 inline-block font-display font-semibold text-brand underline">
            Continue shopping
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="mb-6 font-display text-2xl font-bold text-ink">Your Cart</h1>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between rounded-xl border border-tint bg-surface p-4"
            >
              <div>
                <p className="font-display font-semibold text-ink">{item.name}</p>
                <p className="text-sm text-ink/50">MWK {item.price} / {item.unit}</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                  className="w-16 rounded-full border border-tint px-3 py-1 text-center"
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
      </main>
    </>
  );
}