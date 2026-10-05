'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Star, Heart, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import { apiFetch } from '@/lib/api';

export interface Product {
  id: string;
  name: string;
  price: string;
  compareAtPrice: string | null;
  unit: string;
  imageUrl: string | null;
  avgRating: number;
  ratingCount: number;
  dealTag: string | null;
  isClearance: boolean;
  category: { name: string };
}

export default function ProductCard({ product: p }: { product: Product }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const router = useRouter();

  const [avgRating, setAvgRating] = useState(p.avgRating);
  const [ratingCount, setRatingCount] = useState(p.ratingCount);
  const [myRating, setMyRating] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [popupOpen, setPopupOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const isFavorited = favoriteIds.has(p.id);
  const hasDiscount = p.compareAtPrice && Number(p.compareAtPrice) > Number(p.price);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setPopupOpen(false);
      }
    }
    if (popupOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [popupOpen]);

  function handleRatingClick(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    if (!popupOpen) {
      apiFetch(`/products/${p.id}/my-rating`)
        .then((data) => setMyRating(data.value))
        .catch(() => {});
    }
    setPopupOpen((open) => !open);
  }

  async function submitRating(value: number) {
    setSubmitting(true);
    try {
      const result = await apiFetch(`/products/${p.id}/rate`, {
        method: 'POST',
        body: JSON.stringify({ value }),
      });
      setAvgRating(result.avgRating);
      setRatingCount(result.ratingCount);
      setMyRating(value);
      setTimeout(() => setPopupOpen(false), 500);
    } finally {
      setSubmitting(false);
    }
  }

  function handleFavoriteClick(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    toggleFavorite(p.id);
  }

  return (
    <div className="relative overflow-visible rounded-xl border border-tint bg-surface shadow-sm">
      <button
        onClick={handleFavoriteClick}
        aria-label={isFavorited ? 'Remove from favourites' : 'Add to favourites'}
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-transform duration-150 hover:scale-110"
      >
        <Heart size={16} className={isFavorited ? 'fill-accent text-accent' : 'text-ink/40'} />
      </button>

      {p.isClearance && (
        <span className="absolute left-2 top-2 z-10 rounded-full bg-clearance px-2.5 py-1 text-[10px] font-display font-bold uppercase text-white">
          Clearance
        </span>
      )}
      {!p.isClearance && p.dealTag && (
        <span className="absolute left-2 top-2 z-10 rounded-full bg-accent px-2.5 py-1 text-[10px] font-display font-bold uppercase text-white">
          {p.dealTag}
        </span>
      )}

      <div className="overflow-hidden rounded-t-xl">
        <div className="flex aspect-square items-center justify-center bg-tint">
          {p.imageUrl ? (
            <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
          ) : (
            <Package size={32} className="text-brand/40" />
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          <button onClick={handleRatingClick} className="flex items-center gap-1">
            <Star size={12} className="fill-accent text-accent" />
            <span className="text-xs font-semibold text-ink">{avgRating.toFixed(1)}</span>
            <span className="text-xs text-ink/40">({ratingCount})</span>
          </button>

          {popupOpen && (
            <div
              ref={popupRef}
              className="absolute left-0 top-full z-20 mt-2 w-44 rounded-xl border border-tint bg-surface p-3 shadow-lg"
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-display text-xs font-semibold text-ink">Rate this product</span>
                <button onClick={() => setPopupOpen(false)} aria-label="Close">
                  <X size={14} className="text-ink/40" />
                </button>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    disabled={submitting}
                    onClick={() => submitRating(star)}
                    onMouseEnter={() => setHoverStar(star)}
                    onMouseLeave={() => setHoverStar(0)}
                  >
                    <Star
                      size={20}
                      className={star <= (hoverStar || myRating) ? 'fill-accent text-accent' : 'text-tint'}
                    />
                  </button>
                ))}
              </div>
              {myRating > 0 && <p className="mt-1.5 text-[11px] text-ink/50">Your rating: {myRating}/5</p>}
            </div>
          )}
        </div>

        <p className="mt-1 font-display font-semibold text-ink">{p.name}</p>
        <p className="text-xs text-ink/50">{p.category.name}</p>

        {hasDiscount ? (
          <p className="mt-2 font-display font-bold text-brand">
            Now MWK {p.price}
            <span className="ml-2 text-xs font-normal text-ink/40 line-through">was {p.compareAtPrice}</span>
          </p>
        ) : (
          <p className="mt-2 font-display font-bold text-brand">
            MWK {p.price}
            <span className="text-xs font-normal text-ink/50"> / {p.unit}</span>
          </p>
        )}

        <button
          onClick={() => addItem({ productId: p.id, name: p.name, price: Number(p.price), unit: p.unit, imageUrl: p.imageUrl })}
          className="mt-3 w-full rounded-full bg-accent py-1.5 text-sm font-display font-semibold text-white hover:bg-red-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}