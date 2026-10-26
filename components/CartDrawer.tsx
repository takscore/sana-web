'use client';

import Link from 'next/link';
import { X, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { items, updateQuantity, removeItem, subtotal, isDrawerOpen, closeDrawer } = useCart();

  return (
    <div
      className={`fixed inset-0 z-[80] transition-opacity duration-300 ${
        isDrawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="absolute inset-0 bg-black/40" onClick={closeDrawer} />
      <div
        className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-surface shadow-xl transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-tint p-4">
          <p className="font-display text-lg font-bold text-ink">Your Cart</p>
          <button onClick={closeDrawer} aria-label="Close cart" className="text-ink/50 hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-sm text-ink/60">Your cart is empty.</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 rounded-xl border border-tint bg-tint/40 p-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-tint">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <Package size={18} className="text-brand/40" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-semibold text-ink">{item.name}</p>
                    <p className="text-xs text-ink/50">MWK {item.price} / {item.unit}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                        className="w-14 rounded-full border border-tint bg-surface px-2 py-0.5 text-center text-xs"
                      />
                      <button onClick={() => removeItem(item.productId)} className="text-xs font-semibold text-accent hover:underline">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-tint p-4">
            <div className="mb-3 flex justify-between font-display font-bold text-ink">
              <span>Subtotal</span>
              <span className="text-brand">MWK {subtotal.toFixed(2)}</span>
            </div>
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="mb-2 block w-full rounded-full border border-brand py-2 text-center font-display text-sm font-semibold text-brand hover:bg-brand hover:text-white"
            >
              View Full Cart
            </Link>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="block w-full rounded-full bg-accent py-2 text-center font-display text-sm font-semibold text-white hover:bg-red-700"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}