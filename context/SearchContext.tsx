'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  query: string;
  setQuery: (q: string) => void;
  categoryId: string;
  setCategoryId: (id: string) => void;
  sort: string;
  setSort: (s: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sort, setSort] = useState('');
  return (
    <SearchContext.Provider value={{ query, setQuery, categoryId, setCategoryId, sort, setSort }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
}