'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

const shopLinks = [
  { label: 'Groceries', href: '/' },
  { label: 'Fresh & Chilled', href: '/' },
  { label: 'Bakery', href: '/' },
  { label: 'Household & Cleaning', href: '/' },
  { label: 'Offers', href: '/offers' },
];

const helpLinks = [
  { label: 'Help Centre', href: '/help' },
  { label: 'Store Locator', href: '/stores' },
  { label: 'FAQs', href: '/#faq' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Give Feedback', href: '/feedback' },
];

const accountLinks = [
  { label: 'Login / Register', href: '/login' },
  { label: 'My Orders', href: '/orders' },
  { label: 'Cart', href: '/cart' },
  { label: 'Favourites', href: '/favourites' },
];

export default function SiteFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setSubscribed(true);
  }

  return (
    <footer className="bg-brand text-white">
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <div>
            <p className="font-display text-lg font-bold">Stay in the loop</p>
            <p className="text-sm text-cream/80">Get the latest offers and promotions straight to your inbox.</p>
          </div>
          {subscribed ? (
            <p className="font-display text-sm font-semibold text-cream">Thanks for subscribing!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full max-w-sm gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full rounded-full px-4 py-2 text-sm text-ink outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent transition-transform duration-200 hover:scale-110"
              >
                <Send size={16} />
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-10 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <p className="font-display text-lg font-extrabold">CHiPiKU <span className="font-bold text-cream/90">PLUS</span></p>
          <p className="mt-2 text-sm text-cream/70">Malawi&apos;s Home of Wholesale Savings.</p>
          <div className="mt-4 flex gap-3">
            <Link href="https://www.facebook.com/p/Chipiku-Plus-100046368596770/" aria-label="Facebook" className="transition-transform duration-200 hover:scale-110">
                <FacebookIcon />
            </Link>
            <Link href="#" aria-label="Instagram" className="transition-transform duration-200 hover:scale-110">
               <InstagramIcon />
            </Link>
          </div>
        </div>

        <div>
          <p className="font-display text-sm font-bold uppercase tracking-wide text-cream/90">Shop</p>
          <ul className="mt-3 space-y-2">
            {shopLinks.map((l) => (
              <li key={l.label}><Link href={l.href} className="text-sm text-cream/70 hover:text-white">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-bold uppercase tracking-wide text-cream/90">Help</p>
          <ul className="mt-3 space-y-2">
            {helpLinks.map((l) => (
              <li key={l.label}><Link href={l.href} className="text-sm text-cream/70 hover:text-white">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-bold uppercase tracking-wide text-cream/90">My Account</p>
          <ul className="mt-3 space-y-2">
            {accountLinks.map((l) => (
              <li key={l.label}><Link href={l.href} className="text-sm text-cream/70 hover:text-white">{l.label}</Link></li>
            ))}
          </ul>
          <div className="mt-4 space-y-1.5 text-sm text-cream/70">
            <p className="flex items-center gap-2"><Phone size={14} /> +265 XXX XXX XXX</p>
            <p className="flex items-center gap-2"><Mail size={14} /> support@chipikuplus.mw</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-cream/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Chipiku Plus. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}