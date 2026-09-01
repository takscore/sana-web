'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, User, ShoppingCart, MapPin, HelpCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useSearch } from '@/context/SearchContext';

export default function SiteHeader() {
  const { items } = useCart();
  const { user } = useAuth();
  const { setQuery, setCategoryId } = useSearch();
  const router = useRouter();
  const [input, setInput] = useState('');

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setCategoryId('');
    setQuery(input);
    router.push('/');
  }

  return (
    <header className="bg-brand">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 py-4">
        <Link href="/" className="shrink-0">
          <Image src="/chipiku-logo.png" alt="Chipiku Plus" width={140} height={44} priority className="h-11 w-auto" />
        </Link>

        <form onSubmit={handleSearch} className="order-3 w-full flex-1 sm:order-none sm:w-auto">
          <div className="flex items-center rounded-full bg-white px-4 py-2">
            <Search size={18} className="text-ink/40" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search for products..."
              className="ml-2 w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/40"
            />
          </div>
        </form>

        <div className="flex items-center gap-5">
          <Link href="/stores" className="hidden flex-col items-center text-white sm:flex">
            <MapPin size={22} />
            <span className="font-display text-[11px] font-semibold">Stores</span>
          </Link>
          <Link href="/help" className="hidden flex-col items-center text-white sm:flex">
            <HelpCircle size={22} />
            <span className="font-display text-[11px] font-semibold">Help</span>
          </Link>
          <Link href={user ? '/' : '/login'} className="flex flex-col items-center text-white">
            <User size={22} />
            <span className="font-display text-[11px] font-semibold">
              {user ? user.name.split(' ')[0] : 'Log In'}
            </span>
          </Link>
          <Link href="/cart" className="relative flex flex-col items-center text-white">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
            <span className="font-display text-[11px] font-semibold">Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}