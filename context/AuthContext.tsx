'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  defaultAddress?: string | null;
  defaultNotes?: string | null;
  defaultBranchId?: string | null;
  defaultLatitude?: string | null;
  defaultLongitude?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (fields: Partial<Pick<User, 'name' | 'email' | 'phone' | 'defaultAddress' | 'defaultNotes' | 'defaultBranchId' | 'defaultLatitude' | 'defaultLongitude'>>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!accessToken && !refreshToken) {
        setLoading(false);
        return;
      }

      let res: Response | null = null;

      // Only attempt /auth/me directly if we actually have an access token
      if (accessToken) {
        res = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${accessToken}` } });
      }

      // If there was no access token at all, OR the one we had got rejected,
      // fall back to the refresh token before giving up.
      if ((!res || res.status === 401) && refreshToken) {
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        if (refreshRes.ok) {
          const { accessToken: newAccessToken } = await refreshRes.json();
          localStorage.setItem('accessToken', newAccessToken);
          res = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${newAccessToken}` } });
        }
      }

      if (res && res.ok) {
        setUser(await res.json());
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      setLoading(false);
    }

    restoreSession();
  }, []);

  async function updateProfile(fields: Partial<Pick<User, 'name' | 'email' | 'phone' | 'defaultAddress' | 'defaultNotes' | 'defaultBranchId'>>) {
    const updated = await apiFetch('/auth/me', { method: 'PATCH', body: JSON.stringify(fields) });
    setUser(updated);
  }

  async function uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    const updated = await apiFetch('/auth/avatar', { method: 'POST', body: formData });
    setUser(updated);
  }

  async function deleteAccount() {
    await apiFetch('/auth/me', { method: 'DELETE' });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }


  async function login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(err.error || 'Login failed');
    }
    const data = await res.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
  }

  async function register(name: string, email: string, phone: string, password: string) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Registration failed' }));
      throw new Error(err.error || 'Registration failed');
    }
    const data = await res.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, uploadAvatar, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
