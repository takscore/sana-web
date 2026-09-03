'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/context/SearchContext';

const links = [
  { label: 'New', href: '/?sort=new' },
  { label: 'Offers', href: '/offers' },
  { label: 'Coupons', href: '/coupons' },
  { label: 'Recipes', href: '/recipes' },
  { label: 'Favourites', href: '/favourites' },
];

const categoryMenu = [
  { label: 'New & Trending' },
  { label: 'Fresh & Chilled', subcategories: ['Fruits & Vegetables', 'Dairy & Eggs', 'Meat & Poultry', 'Fish & Seafood'] },
  { label: 'Treats & Snacks', subcategories: ['Sweets & Chocolates', 'Chips & Crisps', 'Biscuits & Cookies'] },
  { label: 'Bakery' },
  { label: 'Frozen Food' },
  { label: 'Soft Drinks & Tea', subcategories: ['Soft Drinks', 'Tea & Coffee', 'Juice'] },
  { label: 'Beer, Wine & Spirits' },
  { label: 'Beauty & Toiletries', subcategories: ['Skincare', 'Haircare', 'Oral Care'] },
  { label: 'Baby & Toddlers' },
  { label: 'Household & Cleaning' },
  { label: 'Pets' },
  { label: 'Home & Garden' },
  { label: 'Occasion & Entertaining' },
];

export default function SecondaryNav() {
  const { setQuery, setCategoryId } = useSearch();
  const router = useRouter();

  function handleCategoryClick(name: string) {
    setCategoryId('');
    setQuery(name);
    router.push('/');
  }

  const linkClass =
    'shrink-0 font-display text-sm font-medium text-white/90 transition-all duration-200 hover:scale-105 hover:text-white hover:[text-shadow:0_0_8px_rgba(255,255,255,0.7)]';

  return (
    <div className="bg-[color:var(--color-brand-dark)]">
      <div className="mx-auto flex max-w-6xl items-center gap-6 overflow-visible px-6 py-2.5">
        <div className="group relative">
          <Link href="/" className={`flex items-center gap-1 ${linkClass}`}>
            Browse Groceries <ChevronDown size={14} />
          </Link>

          <div className="invisible absolute left-0 top-full z-50 w-[640px] translate-y-2 rounded-xl bg-surface p-6 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
            <div className="grid grid-cols-3 gap-5">
              {categoryMenu.map((cat) => (
                <div key={cat.label}>
                  <button
                    onClick={() => handleCategoryClick(cat.label)}
                    className="text-left font-display text-sm font-bold text-brand hover:underline"
                  >
                    {cat.label}
                  </button>
                  {cat.subcategories && (
                    <ul className="mt-1.5 space-y-1">
                      {cat.subcategories.map((sub) => (
                        <li key={sub}>
                          <button
                            onClick={() => handleCategoryClick(sub)}
                            className="text-left text-sm text-ink/70 hover:text-brand hover:underline"
                          >
                            {sub}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {links.map((l) => (
          <Link key={l.label} href={l.href} className={linkClass}>
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}