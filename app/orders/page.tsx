'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface OrderItem { id: string; quantity: number; product: { name: string }; }
interface Order { id: string; status: string; total: string; createdAt: string; items: OrderItem[]; }

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  out_for_delivery: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    apiFetch('/orders').then(setOrders).finally(() => setLoading(false));
  }, [user]);

  if (authLoading) return <p className="p-6 text-ink/60">Loading...</p>;

  if (!user) {
    return (
      <main className="mx-auto max-w-md p-6 text-center">
        <h1 className="mb-4 font-display text-2xl font-bold text-ink">Log in to view your orders</h1>
        <Link href="/login" className="inline-block rounded-full bg-brand px-6 py-2 font-display font-semibold text-white">Log In</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">My Orders</h1>
      {loading ? (
        <p className="text-ink/60">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-ink/60">You haven&apos;t placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-tint bg-surface p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs text-ink/50">{new Date(order.createdAt).toLocaleString()}</p>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status] || 'bg-tint text-ink'}`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>
              <ul className="text-sm text-ink/70">
                {order.items.map((item) => <li key={item.id}>{item.quantity} × {item.product.name}</li>)}
              </ul>
              <p className="mt-2 font-display font-bold text-brand">Total: MWK {order.total}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}