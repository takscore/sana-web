'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Clock, Phone, PackageCheck, PencilLine } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';

const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false });

const ESTIMATED_DELIVERY_FEE = 1500; // matches the flat fee sana-api applies to delivery orders

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  operatingHours: string | null;
  pickupInstructions: string | null;
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchId, setBranchId] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [deliveryLatitude, setDeliveryLatitude] = useState<number | null>(null);
  const [deliveryLongitude, setDeliveryLongitude] = useState<number | null>(null);

  function handleMapSelect(lat: number, lng: number, address: string) {
    setDeliveryLatitude(lat);
    setDeliveryLongitude(lng);
    setDeliveryAddress(address);
  }

  useEffect(() => {
    apiFetch('/branches').then(setBranches).catch(() => setError('Failed to load branches'));
  }, []);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time pre-fill of checkout fields from the user's saved profile, guarded against overwriting typed input, not a render loop */
    if (user?.defaultBranchId && !branchId) setBranchId(user.defaultBranchId);
    if (user?.defaultAddress && !deliveryAddress) setDeliveryAddress(user.defaultAddress);
    if (user?.defaultNotes && !deliveryNotes) setDeliveryNotes(user.defaultNotes);
    if (user?.defaultLatitude && !deliveryLatitude) setDeliveryLatitude(Number(user.defaultLatitude));
    if (user?.defaultLongitude && !deliveryLongitude) setDeliveryLongitude(Number(user.defaultLongitude));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [user]);

  const selectedBranch = branches.find((b) => b.id === branchId);
  const hasBranchDetails =
    !!selectedBranch &&
    (!!selectedBranch.phone || !!selectedBranch.operatingHours || (deliveryType === 'pickup' && !!selectedBranch.pickupInstructions));
  const estimatedFee = deliveryType === 'delivery' ? ESTIMATED_DELIVERY_FEE : 0;
  const estimatedTotal = subtotal + estimatedFee;

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!branchId) return setError('Please select a branch');
    if (deliveryType === 'delivery' && !deliveryAddress) return setError('Please enter a delivery address');
    if (!agreedToTerms) return setError('Please agree to the Terms of Service to continue');

    setSubmitting(true);
    try {
      const order = await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          branchId,
          deliveryType,
          deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : undefined,
          deliveryLatitude: deliveryType === 'delivery' ? deliveryLatitude : undefined,
          deliveryLongitude: deliveryType === 'delivery' ? deliveryLongitude : undefined,
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
      <div className="min-h-full bg-tint">
        <p className="p-6 text-ink/60">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-full bg-tint">
        <main className="mx-auto max-w-md p-6 py-10">
          <div className="rounded-2xl border-t-4 border-accent bg-surface p-8 text-center shadow-lg">
            <h1 className="mb-4 font-display text-2xl font-bold text-ink">Log in to check out</h1>
            <Link
              href="/login"
              className="inline-block rounded-full bg-brand px-6 py-2 font-display font-semibold text-white hover:bg-[color:var(--color-brand-dark)]"
            >
              Log In
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-full bg-tint">
        <main className="mx-auto max-w-md p-6 py-10">
          <div className="rounded-2xl border-t-4 border-accent bg-surface p-8 text-center shadow-lg">
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
      <main className="mx-auto max-w-lg p-6 py-10">
        <div className="rounded-2xl border-t-4 border-accent bg-surface p-8 shadow-lg">
          <h1 className="mb-6 font-display text-2xl font-bold text-ink">Checkout</h1>

          <div className="mb-6 rounded-xl border border-tint bg-tint/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-display text-sm font-bold text-ink">Order Summary</p>
              <Link href="/cart" className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
                <PencilLine size={12} /> Edit Cart
              </Link>
            </div>
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between py-1 text-sm text-ink">
                <span>{item.quantity} × {item.name}</span>
                <span>MWK {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="mt-2 space-y-1 border-t border-tint pt-2 text-sm">
              <div className="flex justify-between text-ink/70">
                <span>Subtotal</span>
                <span>MWK {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink/70">
                <span>Estimated delivery fee</span>
                <span>{estimatedFee > 0 ? `MWK ${estimatedFee.toFixed(2)}` : 'Free'}</span>
              </div>
              <div className="flex justify-between font-display font-bold text-brand">
                <span>Estimated Total</span>
                <span>MWK {estimatedTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-ink/40">Final total is confirmed once your order is placed.</p>
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

            {hasBranchDetails && (
              <div className="rounded-lg border border-tint bg-tint/40 p-3 text-sm text-ink/70">
                {selectedBranch!.phone && (
                  <p className="flex items-center gap-2"><Phone size={14} /> {selectedBranch!.phone}</p>
                )}
                {selectedBranch!.operatingHours && (
                  <p className="mt-1 flex items-center gap-2"><Clock size={14} /> {selectedBranch!.operatingHours}</p>
                )}
                {deliveryType === 'pickup' && selectedBranch!.pickupInstructions && (
                  <p className="mt-1 flex items-start gap-2">
                    <PackageCheck size={14} className="mt-0.5 shrink-0" /> {selectedBranch!.pickupInstructions}
                  </p>
                )}
              </div>
            )}

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
              <>
                <input
                  placeholder="Delivery address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full rounded-lg border border-tint px-3 py-2"
                />
                <MapPicker latitude={deliveryLatitude} longitude={deliveryLongitude} onSelect={handleMapSelect} />
              </>
            )}

            <textarea
              placeholder="Delivery notes (optional)"
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              className="w-full rounded-lg border border-tint px-3 py-2"
            />

            <label className="flex items-center gap-2 text-sm text-ink/70">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="accent-brand"
              />
              <span>
                I agree to the <Link href="/terms" className="font-semibold text-brand underline">Terms of Service</Link> and confirm the details above are correct.
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-accent py-2.5 font-display font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {submitting ? 'Placing order...' : 'Place Order & Pay'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}