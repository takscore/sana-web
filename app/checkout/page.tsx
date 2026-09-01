'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';

interface Branch { id: string; name: string; address: string; }

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchId, setBranchId] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/branches').then(setBranches).catch(() => setError('Failed to load branches'));
  }, []);

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!branchId) return setError('Please select a branch');
    if (deliveryType === 'delivery' && !deliveryAddress) return setError('Please enter a delivery address');

    setSubmitting(true);
    try {
      const order = await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          branchId,
          deliveryType,
          deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : undefined,
          deliveryNotes: deliveryNotes || undefined,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });

      const payment = await apiFetch('/payments/initiate', {
        method: 'POST',
        body: JSON.stringify({ orderId: order.id }),
      });

      clearCart();
      window.location.href = payment.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <>
        
        <p className="p-6 text-ink/60">Loading...</p>
      </>
    );
  }

  if (!user) {
    return (
      <>
        
        <main className="mx-auto max-w-md p-6 text-center">
          <h1 className="mb-4 font-display text-2xl font-bold text-ink">Log in to check out</h1>
          <Link
            href="/login"
            className="inline-block rounded-full bg-brand px-6 py-2 font-display font-semibold text-white hover:bg-[color:var(--color-brand-dark)]"
          >
            Log In
          </Link>
        </main>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
       
        <main className="mx-auto max-w-md p-6 text-center">
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
      
      <main className="mx-auto max-w-lg p-6">
        <h1 className="mb-6 font-display text-2xl font-bold text-ink">Checkout</h1>

        <div className="mb-6 rounded-xl border border-tint bg-surface p-4">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between py-1 text-sm text-ink">
              <span>{item.quantity} × {item.name}</span>
              <span>MWK {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-2 border-t border-tint pt-2 font-display font-bold text-brand">
            Subtotal: MWK {subtotal.toFixed(2)}
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-4">
          {error && <p className="text-sm text-accent">{error}</p>}

          <select
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            className="w-full rounded-lg border border-tint px-3 py-2"
            required
          >
            <option value="">Select branch</option>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name} — {b.address}</option>)}
          </select>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 font-display text-sm font-medium text-ink">
              <input
                type="radio"
                checked={deliveryType === 'delivery'}
                onChange={() => setDeliveryType('delivery')}
                className="accent-brand"
              />
              Delivery
            </label>
            <label className="flex items-center gap-2 font-display text-sm font-medium text-ink">
              <input
                type="radio"
                checked={deliveryType === 'pickup'}
                onChange={() => setDeliveryType('pickup')}
                className="accent-brand"
              />
              Pickup
            </label>
          </div>

          {deliveryType === 'delivery' && (
            <input
              placeholder="Delivery address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full rounded-lg border border-tint px-3 py-2"
            />
          )}

          <textarea
            placeholder="Delivery notes (optional)"
            value={deliveryNotes}
            onChange={(e) => setDeliveryNotes(e.target.value)}
            className="w-full rounded-lg border border-tint px-3 py-2"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-accent py-2.5 font-display font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {submitting ? 'Placing order...' : 'Place Order & Pay'}
          </button>
        </form>
      </main>
    </>
  );
}