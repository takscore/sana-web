'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Package, Clock, CheckCircle2, XCircle, LogOut, History, Pencil, KeyRound, MapPin, RotateCcw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { apiFetch } from '@/lib/api';
import ConfirmDialog from '@/components/ConfirmDialog';

interface OrderProduct { id: string; name: string; price: string; unit: string; imageUrl: string | null; }
interface OrderItem { id: string; quantity: number; product: OrderProduct; }
interface Order { id: string; status: string; total: string; createdAt: string; items: OrderItem[]; }

export default function AccountPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [reorderedId, setReorderedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    apiFetch('/orders').then(setOrders).finally(() => setLoading(false));
  }, [user]);

  function handleLogout() {
    logout();
    router.push('/');
  }

  function handleQuickReorder(product: OrderProduct) {
    addItem({ productId: product.id, name: product.name, price: Number(product.price), unit: product.unit, imageUrl: product.imageUrl });
    setReorderedId(product.id);
    setTimeout(() => setReorderedId(null), 1500);
  }

  if (authLoading) return <p className="p-6 text-ink/60">Loading...</p>;

  if (!user) {
    return (
      <main className="mx-auto max-w-md p-6 text-center">
        <h1 className="mb-4 font-display text-2xl font-bold text-ink">Log in to view your account</h1>
        <Link href="/login" className="inline-block rounded-full bg-brand px-6 py-2 font-display font-semibold text-white">Log In</Link>
      </main>
    );
  }

  const total = orders.length;
  const inProgress = orders.filter((o) => ['pending', 'confirmed', 'out_for_delivery'].includes(o.status)).length;
  const delivered = orders.filter((o) => o.status === 'delivered').length;
  const cancelled = orders.filter((o) => o.status === 'cancelled').length;

  const productStats = new Map<string, { product: OrderProduct; qty: number }>();
  orders.forEach((o) => o.items.forEach((item) => {
    const existing = productStats.get(item.product.id);
    if (existing) {
      existing.qty += item.quantity;
    } else {
      productStats.set(item.product.id, { product: item.product, qty: item.quantity });
    }
  }));
  const topProducts = [...productStats.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : null;

  const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') || '';

  return (
    <div className="min-h-full bg-tint">
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="mb-6 font-display text-2xl font-bold text-ink">My Account</h1>

        <div className="relative mb-6 flex items-center gap-4 rounded-xl border border-tint bg-surface p-5">
          <Link
            href="/account/edit"
            aria-label="Edit profile"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-tint text-brand transition-colors hover:bg-brand hover:text-white"
          >
            <Pencil size={16} />
          </Link>
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-tint text-brand">
            {user.avatarUrl ? (
              <img src={`${API_ORIGIN}${user.avatarUrl}`} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <UserIcon size={26} />
            )}
          </div>
          <div>
            <p className="font-display text-lg font-bold text-ink">{user.name}</p>
            <p className="text-sm text-ink/60">{user.email}</p>
            <p className="text-sm text-ink/60">{user.phone}</p>
            {memberSince && <p className="mt-1 text-xs text-ink/40">Member since {memberSince}</p>}
          </div>
        </div>

        {loading ? (
          <p className="text-ink/60">Loading your order summary...</p>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-tint bg-surface p-4 text-center">
                <Package className="mx-auto text-brand" size={22} />
                <p className="mt-2 font-display text-xl font-bold text-ink">{total}</p>
                <p className="text-xs text-ink/50">Total Orders</p>
              </div>
              <div className="rounded-xl border border-tint bg-surface p-4 text-center">
                <Clock className="mx-auto text-brand" size={22} />
                <p className="mt-2 font-display text-xl font-bold text-ink">{inProgress}</p>
                <p className="text-xs text-ink/50">In Progress</p>
              </div>
              <div className="rounded-xl border border-tint bg-surface p-4 text-center">
                <CheckCircle2 className="mx-auto text-brand" size={22} />
                <p className="mt-2 font-display text-xl font-bold text-ink">{delivered}</p>
                <p className="text-xs text-ink/50">Delivered</p>
              </div>
              <div className="rounded-xl border border-tint bg-surface p-4 text-center">
                <XCircle className="mx-auto text-brand" size={22} />
                <p className="mt-2 font-display text-xl font-bold text-ink">{cancelled}</p>
                <p className="text-xs text-ink/50">Cancelled</p>
              </div>
            </div>

            {topProducts.length > 0 && (
              <div className="mb-6 rounded-xl border border-tint bg-surface p-5">
                <p className="mb-3 font-display font-bold text-ink">Your Most Ordered</p>
                <ul className="space-y-2">
                  {topProducts.map(({ product, qty }) => (
                    <li key={product.id} className="flex items-center justify-between text-sm text-ink/70">
                      <span>{product.name} <span className="font-semibold text-ink">({qty}×)</span></span>
                      <button
                        onClick={() => handleQuickReorder(product)}
                        className="flex shrink-0 items-center gap-1 rounded-full bg-tint px-3 py-1 text-xs font-display font-semibold text-brand hover:bg-brand hover:text-white"
                      >
                        <RotateCcw size={12} /> {reorderedId === product.id ? 'Added!' : 'Reorder'}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        <div className="mb-6 space-y-3">
          <Link href="/orders" className="flex items-center justify-between rounded-xl border border-tint bg-surface p-5 transition-colors hover:bg-white">
            <span className="flex items-center gap-3 font-display font-semibold text-ink"><History size={20} className="text-brand" /> Purchase History</span>
            <span className="text-sm text-ink/50">→</span>
          </Link>
          <Link href="/account/password" className="flex items-center justify-between rounded-xl border border-tint bg-surface p-5 transition-colors hover:bg-white">
            <span className="flex items-center gap-3 font-display font-semibold text-ink"><KeyRound size={20} className="text-brand" /> Change Password</span>
            <span className="text-sm text-ink/50">→</span>
          </Link>
          <Link href="/account/address" className="flex items-center justify-between rounded-xl border border-tint bg-surface p-5 transition-colors hover:bg-white">
            <span className="flex items-center gap-3 font-display font-semibold text-ink"><MapPin size={20} className="text-brand" /> Saved Delivery Address</span>
            <span className="text-sm text-ink/50">→</span>
          </Link>
        </div>

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-accent py-2.5 font-display font-semibold text-accent hover:bg-accent/10"
        >
          <LogOut size={18} /> Log Out
        </button>
      </main>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Log out of Chipiku Plus?"
        message="You'll need to log in again to place orders or view your account."
        confirmLabel="Log Out"
        cancelLabel="Stay Logged In"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
} 