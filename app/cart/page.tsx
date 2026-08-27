'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="mb-4 text-2xl font-bold">Your Cart</h1>
        <p className="text-gray-500">Your cart is empty.</p>
        <Link href="/" className="mt-4 inline-block text-blue-600 underline">Continue shopping</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Your Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between rounded-lg border bg-white p-4">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">MWK {item.price} / {item.unit}</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                className="w-16 rounded border px-2 py-1 text-center"
              />
              <button onClick={() => removeItem(item.productId)} className="text-sm text-red-600 hover:underline">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between border-t pt-4">
        <p className="text-lg font-bold">Subtotal: MWK {subtotal.toFixed(2)}</p>
        <Link href="/checkout" className="rounded bg-black px-6 py-2 text-white">
          Checkout
        </Link>
      </div>
    </main>
  );
}