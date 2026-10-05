'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface FavoritesContextType {
  favoriteIds: Set<string>;
  toggleFavorite: (productId: string) => Promise<void>;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting favorites synchronously on logout; no fetch needed for the empty case
      setFavoriteIds(new Set());
      return;
    }
    apiFetch('/favorites')
      .then((products: { id: string }[]) => setFavoriteIds(new Set(products.map((p) => p.id))))
      .catch(() => {});
  }, [user]);

  async function toggleFavorite(productId: string) {
    if (!user) return;
    setLoading(true);
    const isFavorited = favoriteIds.has(productId);
    try {
      if (isFavorited) {
        await apiFetch(`/favorites/${productId}`, { method: 'DELETE' });
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      } else {
        await apiFetch('/favorites', { method: 'POST', body: JSON.stringify({ productId }) });
        setFavoriteIds((prev) => new Set(prev).add(productId));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}