'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useSearch } from '@/context/SearchContext';
import { scrollToFeatureCards } from '@/lib/scrollToFeatureCards';

interface Category { id: string; name: string; }

const links = [
  { label: 'Offers', href: '/offers' },
  { label: 'Coupons', href: '/coupons' },
  { label: 'Recipes', href: '/recipes' },
  { label: 'Favourites', href: '/favourites' },
  { label: 'My Orders', href: '/orders' },
];

const categoryMenu: { label: string; subcategories?: string[] }[] = [
  { label: 'Groceries', subcategories: ['Pantry Staples', 'Rice & Grains', 'Cooking Oil', 'Sugar & Sweeteners', 'Flour & Baking Supplies', 'Canned & Tinned Goods', 'Pasta & Noodles', 'Sauces & Condiments'] },
  { label: 'Fresh & Chilled', subcategories: ['Fruits & Vegetables', 'Dairy & Eggs', 'Meat & Poultry', 'Fish & Seafood', 'Cheese', 'Deli & Cold Meats', 'Ready Meals'] },
  { label: 'Bakery', subcategories: ['Bread & Rolls', 'Cakes & Pastries', 'Pies & Sausage Rolls', 'Bakery Snacks'] },
  { label: 'Frozen Foods', subcategories: ['Frozen Vegetables', 'Frozen Meat & Poultry', 'Frozen Fish & Seafood', 'Ice Cream & Desserts', 'Frozen Ready Meals'] },
  { label: 'Beverages', subcategories: ['Soft Drinks', 'Juices', 'Water', 'Tea & Coffee', 'Energy & Sports Drinks'] },
  { label: 'Beer, Wine & Spirits', subcategories: ['Beer & Cider', 'Wine', 'Spirits & Liqueurs', 'Ready-to-Drink'] },
  { label: 'Snacks & Confectionery', subcategories: ['Sweets & Chocolates', 'Chips & Crisps', 'Biscuits & Cookies', 'Nuts & Dried Fruit'] },
  { label: 'Beauty & Toiletries', subcategories: ['Skincare', 'Haircare', 'Oral Care', 'Personal Hygiene', 'Fragrances', "Men's Grooming"] },
  { label: 'Baby & Toddler', subcategories: ['Nappies & Wipes', 'Baby Food & Formula', 'Baby Care', 'Toys & Accessories'] },
  { label: 'Household & Cleaning', subcategories: ['Laundry Care', 'Dishwashing', 'Surface Cleaners', 'Air Fresheners', 'Paper & Disposables'] },
  { label: 'Pets', subcategories: ['Dog Food & Treats', 'Cat Food & Treats', 'Pet Accessories'] },
  { label: 'Home & Garden', subcategories: ['Kitchenware', 'Garden Tools', 'Storage & Organisation', 'Outdoor Living'] },
  { label: 'Occasion & Entertaining', subcategories: ['Party Supplies', 'Gift Sets', 'Candles & Décor'] },
  { label: 'New & Trending' },
];

export default function SecondaryNav() {
  const { setQuery, setCategoryId, setSort } = useSearch();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    apiFetch('/categories').then(setCategories).catch(() => {});
  }, []);

  function handleNewClick() {
    setCategoryId('');
    setQuery('');
    setSort('new');
    router.push('/');
    scrollToFeatureCards();
  }

  function handleCategoryClick(label: string) {
    if (label === 'New & Trending') {
      handleNewClick();
      return;
    }
    const match = categories.find((c) => c.name.toLowerCase() === label.toLowerCase());
    setSort('');
    if (match) {
      setCategoryId(match.id);
      setQuery('');
    } else {
      setCategoryId('');
      setQuery(label);
    }
    router.push('/');
    scrollToFeatureCards();
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

          <div className="absolute left-0 top-full z-50 hidden max-h-[75vh] w-[min(880px,90vw)] overflow-y-auto rounded-xl bg-surface p-6 shadow-lg group-hover:block">
            <div className="grid grid-cols-4 gap-5">
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

        <button onClick={handleNewClick} className={linkClass}>New</button>

        {links.map((l) => (
          <Link key={l.label} href={l.href} className={linkClass}>
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}