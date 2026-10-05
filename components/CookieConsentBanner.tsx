'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'cookie-consent';

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) setVisible(true);
  }, []);

  function respond(choice: 'accepted' | 'rejected') {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-tint bg-surface p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-ink/70">
          We use essential browser storage to keep you logged in and remember your cart — this can't be turned off.
          We may add optional analytics in future to help us improve the site. Read our{' '}
          <Link href="/cookies" className="font-semibold text-brand underline">Cookie Policy</Link>.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => respond('rejected')}
            className="rounded-full border border-tint px-5 py-2 font-display text-sm font-semibold text-ink hover:bg-tint"
          >
            Reject Non-Essential
          </button>
          <button
            onClick={() => respond('accepted')}
            className="rounded-full bg-brand px-6 py-2 font-display text-sm font-semibold text-white hover:bg-[color:var(--color-brand-dark)]"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}