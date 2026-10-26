'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ConfirmDialog from '@/components/ConfirmDialog';
import { scrollToProducts } from '@/lib/scrollToProducts';
import { useRouter } from 'next/navigation';  

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const router = useRouter();

  function handleAddMoreItems() {
    router.push('/');
    scrollToProducts();
  }

  if (items.length === 0) {
    return (
      <div className="min-h-full bg-tint">
        <main className="mx-auto max-w-2xl p-6 py-10">
          <div className="rounded-2xl border-t-4 border-accent bg-surface p-8 text-center shadow-lg">
            <h1 className="mb-4 font-display text-2xl font-bold text-ink">Your Cart</h1>
            <p className="text-ink/60">Your shopping cart is empty.</p>
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
          <div className="mb-6 flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-ink">Your Cart</h1>
            <button
            onClick={handleAddMoreItems}
            className="flex items-center gap-1 rounded-full border border-brand px-4 py-1.5 font-display text-sm font-semibold text-brand hover:bg-brand hover:text-white"
          >
            <Plus size={14} /> Add More Items
          </button>
          </div>

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
                    <p className="text-sm font-semibold text-brand">
                      MWK {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-tint bg-surface">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="flex h-8 w-8 items-center justify-center text-ink/60 hover:text-brand"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-ink">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="flex h-8 w-8 items-center justify-center text-ink/60 hover:text-brand"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
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

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1 text-sm font-semibold text-ink/50 hover:text-accent"
            >
              <Trash2 size={14} /> Clear Cart
            </button>
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

      <ConfirmDialog
        open={showClearConfirm}
        title="Clear your cart?"
        message="This removes all items from your cart. This can't be undone."
        confirmLabel="Clear Cart"
        cancelLabel="Cancel"
        onConfirm={() => { clearCart(); setShowClearConfirm(false); }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
}