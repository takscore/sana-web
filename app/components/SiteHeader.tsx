'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function SiteHeader() {
  const { items } = useCart();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="bg-brand">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="rounded-full border-2 border-white bg-white px-4 py-1.5">
            <span className="font-display text-xl font-extrabold text-accent">CHiPiKU</span>
            <span className="ml-1 font-display text-sm font-bold text-brand">PLUS</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="font-display text-sm font-semibold text-white hover:text-cream">Shop</Link>
          <Link
            href="/cart"
            className="rounded-full bg-accent px-4 py-2 font-display text-sm font-semibold text-white hover:bg-red-700"
          >
            Cart ({cartCount})
          </Link>
        </nav>
      </div>
    </header>
  );
}