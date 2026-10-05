'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useSearch } from '@/context/SearchContext';
import { scrollToFeatureCards } from '@/lib/scrollToFeatureCards';

interface Category { id: string; name: string; }

export default function CategoryStrip() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const { categoryId, setCategoryId, setQuery, setSort } = useSearch();

  useEffect(() => {
    apiFetch('/categories').then(setCategories).catch(() => {});
  }, []);

  if (pathname !== '/' || categories.length === 0) return null;

  return (
    <div className="border-b border-tint bg-surface">
      <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto px-6 py-4">
        <button
          onClick={() => { setCategoryId(''); setQuery(''); setSort(''); scrollToFeatureCards(); }}
          className={`shrink-0 rounded-full px-4 py-2 font-display text-sm font-semibold ${
            categoryId === '' ? 'bg-brand text-white' : 'bg-tint text-ink'
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => { setCategoryId(c.id); setQuery(''); setSort(''); scrollToFeatureCards(); }}
            className={`shrink-0 rounded-full px-4 py-2 font-display text-sm font-semibold ${
              categoryId === c.id ? 'bg-brand text-white' : 'bg-tint text-ink'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}