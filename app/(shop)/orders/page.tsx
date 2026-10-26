'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardList, Package, RotateCcw, CreditCard, X, MapPin, Store, Check } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import PageShell from '@/components/PageShell';
import ConfirmDialog from '@/components/ConfirmDialog';

interface OrderProduct { id: string; name: string; price: string; unit: string; imageUrl: string | null; }
interface OrderItem { id: string; quantity: number; unitPrice: string; product: OrderProduct; }
interface Order {
  id: string;
  status: 'pending' | 'confirmed' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress: string | null;
  deliveryFee: string;
  total: string;
  createdAt: string;
  branch?: { name: string } | null;
  payment: { status: 'pending' | 'paid' | 'failed' } | null;
  items: OrderItem[];
}

type Filter = 'all' | 'active' | 'delivered' | 'cancelled';

const ACTIVE: Order['status'][] = ['pending', 'confirmed', 'out_for_delivery'];
const STEP_ORDER: Order['status'][] = ['pending', 'confirmed', 'out_for_delivery', 'delivered'];

const statusStyles: Record<Order['status'], string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-tint text-brand',
  out_for_delivery: 'bg-clearance/10 text-clearance',
  delivered: 'bg-brand text-white',
  cancelled: 'bg-ink/10 text-ink/60',
};

function statusLabel(order: Order) {
  switch (order.status) {
    case 'pending': return order.payment?.status === 'paid' ? 'Pending' : 'Awaiting payment';
    case 'confirmed': return 'Confirmed';
    case 'out_for_delivery': return order.deliveryType === 'delivery' ? 'Out for delivery' : 'Ready for pickup';
    case 'delivered': return order.deliveryType === 'delivery' ? 'Delivered' : 'Collected';
    case 'cancelled': return 'Cancelled';
  }
}

function OrderProgress({ order }: { order: Order }) {
  if (order.status === 'cancelled') return null;
  const current = STEP_ORDER.indexOf(order.status);
  const isDelivery = order.deliveryType === 'delivery';
  const labels = ['Placed', 'Confirmed', isDelivery ? 'On the way' : 'Ready', isDelivery ? 'Delivered' : 'Collected'];

  return (
    <div className="mt-4 flex items-start">
      {labels.map((label, i) => (
        <div key={label} className="flex flex-1 items-start last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                i <= current ? 'bg-brand text-white' : 'bg-tint text-ink/40'
              }`}
            >
              {i <= current ? <Check size={12} /> : i + 1}
            </div>
            <span className="mt-1 text-[10px] text-ink/50">{label}</span>
          </div>
          {i < labels.length - 1 && <div className={`mx-1 mt-3 h-0.5 flex-1 ${i < current ? 'bg-brand' : 'bg-tint'}`} />}
        </div>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const { addItem, openDrawer } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    apiFetch('/orders')
      .then(setOrders)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, [user]);

  async function handleCancel() {
    if (!cancelId) return;
    setBusyId(cancelId);
    setError('');
    try {
      await apiFetch(`/orders/${cancelId}/cancel`, { method: 'PATCH' });
      setOrders(await apiFetch('/orders'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel order');
    } finally {
      setBusyId(null);
      setCancelId(null);
    }
  }

  async function handlePayNow(orderId: string) {
    setBusyId(orderId);
    setError('');
    try {
      const payment = await apiFetch('/payments/initiate', {
        method: 'POST',
        body: JSON.stringify({ orderId }),
      });
      window.location.href = payment.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start payment');
      setBusyId(null);
    }
  }

  function handleReorder(order: Order) {
    order.items.forEach((item) =>
      addItem(
        {
          productId: item.product.id,
          name: item.product.name,
          price: Number(item.product.price),
          unit: item.product.unit,
          imageUrl: item.product.imageUrl,
        },
        item.quantity
      )
    );
    openDrawer();
  }

  if (authLoading) {
    return (
      <PageShell title="My Orders" icon={ClipboardList} maxWidth="max-w-3xl">
        <div className="h-40 animate-pulse rounded-2xl bg-surface" />
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell title="My Orders" subtitle="Track and manage your orders" icon={ClipboardList} maxWidth="max-w-2xl">
        <div className="rounded-2xl border-t-4 border-accent bg-surface p-8 text-center shadow-lg">
          <p className="font-display text-lg font-bold text-ink">Log in to view your orders</p>
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

  const counts = {
    all: orders.length,
    active: orders.filter((o) => ACTIVE.includes(o.status)).length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };
  const tabs: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'In progress' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
  ];
  const visible = orders.filter((o) =>
    filter === 'all' ? true : filter === 'active' ? ACTIVE.includes(o.status) : o.status === filter
  );

  return (
    <PageShell
      title="My Orders"
      subtitle="Track, pay for, cancel or reorder your orders"
      icon={ClipboardList}
      maxWidth="max-w-3xl"
    >
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`shrink-0 rounded-full px-4 py-2 font-display text-sm font-semibold ${
              filter === t.key ? 'bg-brand text-white' : 'bg-surface text-ink hover:bg-white'
            }`}
          >
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>

      {error && <p className="mb-4 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p>}

      {loading ? (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-2xl bg-surface" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border-t-4 border-accent bg-surface p-8 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-tint text-brand">
            <ClipboardList size={26} />
          </div>
          <p className="mt-4 font-display text-lg font-bold text-ink">
            {orders.length === 0 ? 'No orders yet' : 'No orders in this view'}
          </p>
          <p className="mt-1 text-sm text-ink/60">
            {orders.length === 0 ? 'When you place an order it will show up here.' : 'Try a different filter.'}
          </p>
          {orders.length === 0 && (
            <Link
              href="/"
              className="mt-5 inline-block rounded-full bg-brand px-6 py-2 font-display text-sm font-semibold text-white hover:bg-[color:var(--color-brand-dark)]"
            >
              Start shopping
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((order) => {
            const awaitingPayment = order.status === 'pending' && order.payment?.status !== 'paid';
            const busy = busyId === order.id;
            const shownItems = order.items.slice(0, 3);
            const extra = order.items.length - shownItems.length;
            const fee = Number(order.deliveryFee);

            return (
              <div key={order.id} className="rounded-2xl border-t-4 border-accent bg-surface p-6 shadow-lg">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-display font-bold text-ink">Order #{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-ink/50">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 font-display text-xs font-semibold ${statusStyles[order.status]}`}>
                    {statusLabel(order)}
                  </span>
                </div>

                <ul className="mt-4 space-y-2">
                  {shownItems.map((item) => (
                    <li key={item.id} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-tint">
                        {item.product.imageUrl ? (
                          <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
                        ) : (
                          <Package size={16} className="text-brand/40" />
                        )}
                      </div>
                      <span className="flex-1 text-sm text-ink">{item.quantity} × {item.product.name}</span>
                      <span className="text-sm text-ink/60">MWK {(Number(item.unitPrice) * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                {extra > 0 && <p className="mt-1 text-xs text-ink/40">+ {extra} more item{extra > 1 ? 's' : ''}</p>}

                <div className="mt-4 space-y-1 rounded-xl bg-tint/40 p-3 text-sm text-ink/70">
                  <p className="flex items-center gap-2">
                    <Store size={14} /> {order.branch?.name ?? 'Branch'} · {order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}
                  </p>
                  {order.deliveryType === 'delivery' && order.deliveryAddress && (
                    <p className="flex items-start gap-2">
                      <MapPin size={14} className="mt-0.5 shrink-0" /> {order.deliveryAddress}
                    </p>
                  )}
                </div>

                <OrderProgress order={order} />

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-tint pt-4">
                  <div>
                    <p className="font-display text-lg font-bold text-brand">MWK {Number(order.total).toFixed(2)}</p>
                    <p className="text-xs text-ink/40">
                      {fee > 0 ? `Includes MWK ${fee.toFixed(2)} delivery · ` : ''}
                      {order.payment?.status === 'paid' ? 'Paid' : order.status === 'cancelled' ? 'Cancelled' : 'Payment pending'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {awaitingPayment && (
                      <button
                        onClick={() => handlePayNow(order.id)}
                        disabled={busy}
                        className="flex items-center gap-1 rounded-full bg-accent px-4 py-2 font-display text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        <CreditCard size={14} /> {busy ? 'Redirecting...' : 'Pay now'}
                      </button>
                    )}
                    {awaitingPayment && (
                      <button
                        onClick={() => setCancelId(order.id)}
                        disabled={busy}
                        className="flex items-center gap-1 rounded-full border border-ink/20 px-4 py-2 font-display text-sm font-semibold text-ink/70 hover:border-accent hover:text-accent disabled:opacity-50"
                      >
                        <X size={14} /> Cancel
                      </button>
                    )}
                    {order.status !== 'pending' && (
                      <button
                        onClick={() => handleReorder(order)}
                        className="flex items-center gap-1 rounded-full border border-brand px-4 py-2 font-display text-sm font-semibold text-brand hover:bg-brand hover:text-white"
                      >
                        <RotateCcw size={14} /> Reorder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={cancelId !== null}
        title="Cancel this order?"
        message="The items will be returned to stock and this order will be cancelled. If you've already paid, please contact the branch instead."
        confirmLabel="Cancel Order"
        cancelLabel="Keep Order"
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
      />
    </PageShell>
  );
}