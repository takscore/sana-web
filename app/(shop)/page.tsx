'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useSearch } from '@/context/SearchContext';
import PromoCarousel from '@/components/PromoCarousel';
//import CategoryStrip from '@/components/CategoryStrip';
import FeatureCards from '@/components/FeatureCards';
import FAQSection from '@/components/FAQSection';
import FeedbackCTA from '@/components/FeedbackCTA';
import ProductCard, { Product } from '@/components/ProductCard';

const PAGE_SIZE = 8;

function SwooshDivider() {
  return (
    <svg viewBox="0 0 200 20" className="h-3 w-32" preserveAspectRatio="none">
      <path d="M0 15 Q 80 0 200 5" fill="none" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { query, categoryId, sort } = useSearch();

    useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- loading state syncs with an in-flight API fetch triggered by query/category/sort changes, not a render loop
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.set('search', query);
      if (categoryId) params.set('category', categoryId);
      if (sort) params.set('sort', sort);
      const qs = params.toString();
      apiFetch(`/products${qs ? `?${qs}` : ''}`)
        .then((data) => {
          setProducts(data);
          setVisibleCount(PAGE_SIZE);
        })
        .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load products'))
        .finally(() => setLoading(false));
    }, [query, categoryId, sort]);

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <>
      
      <PromoCarousel />
      <FeatureCards />

      <main className="mx-auto max-w-6xl p-6">
        <div className="mb-6 flex items-center gap-3">
          <h2 className="font-display text-xl font-bold text-ink">
            {query ? `Results for "${query}"` : sort === 'new' ? 'New & Trending' : 'Shop the essentials'}
          </h2>
          <SwooshDivider />
        </div>

        {error && <p className="text-accent">{error}</p>}

        {loading ? (
          <p className="text-ink/60">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-ink/60">No products found.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {visibleProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {visibleCount < products.length && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="rounded-full border-2 border-brand px-8 py-2.5 font-display font-semibold text-brand transition-all duration-200 hover:scale-105 hover:bg-brand hover:text-white"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <FAQSection />
      <FeedbackCTA />
    </>
  );
}