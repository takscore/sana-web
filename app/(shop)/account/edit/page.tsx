'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') || '';

interface Branch { id: string; name: string; address: string; }

export default function EditProfilePage() {
  const { user, updateProfile, uploadAvatar, deleteAccount } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
    defaultBranchId: user?.defaultBranchId || '',
  });
  const [branches, setBranches] = useState<Branch[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showDeleteSection, setShowDeleteSection] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    apiFetch('/branches').then(setBranches).catch(() => {});
  }, []);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    setError('');
    try {
      await uploadAvatar(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload photo');
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await updateProfile({
        ...form,
        defaultBranchId: form.defaultBranchId || null,
      });
      router.push('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      await deleteAccount();
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      setDeleting(false);
    }
  }

  if (!user) return null;

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="min-h-full bg-tint">
      <main className="mx-auto max-w-md p-6 py-10">
        <div className="rounded-2xl border-t-4 border-accent bg-surface p-8 shadow-lg">
          <h1 className="font-display text-2xl font-bold text-ink">Edit Profile</h1>
          {memberSince && <p className="mt-1 text-sm text-ink/50">Member since {memberSince}</p>}

          <div className="mt-6 flex justify-center">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-tint">
                {user.avatarUrl ? (
                  <img src={`${API_ORIGIN}${user.avatarUrl}`} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="font-display text-3xl font-bold text-brand">{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                aria-label="Change profile photo"
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white shadow-md hover:bg-[color:var(--color-brand-dark)] disabled:opacity-50"
              >
                <Camera size={14} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>
          {uploadingAvatar && <p className="mt-2 text-center text-xs text-ink/50">Uploading...</p>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">{error}</p>}
            <div>
              <label className="mb-1 block font-display text-sm font-medium text-ink">Full name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-tint px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" required />
            </div>
            <div>
              <label className="mb-1 block font-display text-sm font-medium text-ink">Email address</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-tint px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" required />
            </div>
            <div>
              <label className="mb-1 block font-display text-sm font-medium text-ink">Phone number</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-tint px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" required />
            </div>
            <div>
              <label className="mb-1 block font-display text-sm font-medium text-ink">Preferred branch</label>
              <select
                value={form.defaultBranchId}
                onChange={(e) => setForm({ ...form, defaultBranchId: e.target.value })}
                className="w-full rounded-lg border border-tint px-3 py-2.5 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="">No preference</option>
                {branches.map((b) => <option key={b.id} value={b.id}>{b.name} — {b.address}</option>)}
              </select>
              <p className="mt-1 text-xs text-ink/40">Pre-selected automatically at checkout.</p>
            </div>
            <button type="submit" disabled={submitting} className="w-full rounded-full bg-brand py-2.5 font-display font-semibold text-white hover:bg-[color:var(--color-brand-dark)] disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </form>

          <div className="mt-8 border-t border-tint pt-6">
            {!showDeleteSection ? (
              <button
                onClick={() => setShowDeleteSection(true)}
                className="text-sm font-semibold text-accent hover:underline"
              >
                Delete my account
              </button>
            ) : (
              <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
                <p className="font-display text-sm font-bold text-ink">Delete your account?</p>
                <p className="mt-1 text-xs text-ink/60">
                  This removes your personal details and login access permanently. Your past orders stay on
                  record for Chipiku Plus&apos;s business purposes, but are no longer linked to your identity.
                  This cannot be undone.
                </p>
                <p className="mt-3 text-xs font-semibold text-ink">Type DELETE to confirm:</p>
                <input
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-tint px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => { setShowDeleteSection(false); setDeleteConfirmText(''); }}
                    className="flex-1 rounded-full border border-tint py-2 text-sm font-semibold text-ink hover:bg-tint"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== 'DELETE' || deleting}
                    className="flex-1 rounded-full bg-accent py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-40"
                  >
                    {deleting ? 'Deleting...' : 'Delete Permanently'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}