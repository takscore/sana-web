'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, User, ShoppingCart, MapPin, HelpCircle, X } from 'lucide-react';
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

  function handleClear() {
    setInput('');
    setQuery('');
  }

  const iconLinkClass =
    'flex flex-col items-center text-white transition-transform duration-200 hover:-translate-y-0.5 hover:scale-110';

  return (
    <header className="bg-brand">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 py-4">
        <Link href="/" className="shrink-0">
          <Image src="/chipiku-logo.png" alt="Chipiku Plus" width={140} height={44} priority className="h-11 w-auto" />
        </Link>

        <form onSubmit={handleSearch} className="order-3 w-full flex-1 sm:order-none sm:w-auto">
          <div className="flex items-center rounded-full bg-white py-1.5 pl-4 pr-1.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search for products..."
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/40"
            />
            {input && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="mr-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-ink/40 transition-colors duration-150 hover:bg-tint hover:text-ink"
              >
                <X size={14} />
              </button>
            )}
            <button
              type="submit"
              aria-label="Search"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-all duration-200 hover:scale-110 hover:bg-[color:var(--color-brand-dark)]"
            >
              <Search size={16} />
            </button>
          </div>
        </form>

        <div className="flex items-center gap-5">
          <Link href="/stores" className={`hidden sm:flex ${iconLinkClass}`}>
            <MapPin size={22} />
            <span className="font-display text-[11px] font-semibold">Stores</span>
          </Link>
          <Link href="/help" className={`hidden sm:flex ${iconLinkClass}`}>
            <HelpCircle size={22} />
            <span className="font-display text-[11px] font-semibold">Help</span>
          </Link>
          <Link href={user ? '/' : '/login'} className={iconLinkClass}>
            <User size={22} />
            <span className="font-display text-[11px] font-semibold">
              {user ? user.name.split(' ')[0] : 'Log In'}
            </span>
          </Link>
          <Link href="/cart" className={`relative ${iconLinkClass}`}>
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span
                key={cartCount}
                className="absolute -right-2 -top-1 flex h-4 w-4 animate-[pop_0.2s_ease-out] items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white"
              >
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