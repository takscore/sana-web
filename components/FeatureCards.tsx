'use client';

import Link from 'next/link';
import { LogIn, Truck, Tag, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function FeatureCards() {
  const { user } = useAuth();

  const cards = [
    {
      icon: LogIn,
      title: user ? 'Welcome Back' : "Let's Get Started",
      description: user
        ? 'Manage your account, track orders and checkout faster.'
        : 'Create an account or log in for faster checkout and order tracking.',
      href: user ? '/orders' : '/login',
      cta: user ? 'View My Orders' : 'Login / Register',
    },
    {
      icon: Truck,
      title: 'Do We Deliver to You?',
      description: 'Find your nearest branch and see delivery or pickup options in your area.',
      href: '/stores',
      cta: 'Check Delivery',
    },
    {
      icon: Tag,
      title: 'Latest Offers',
      description: 'Browse the newest promotions and wholesale deals across all branches.',
      href: '/offers',
      cta: 'See Offers',
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-5 sm:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-2xl border border-tint bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tint text-brand transition-colors duration-200 group-hover:bg-brand group-hover:text-white">
                <Icon size={22} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">{card.title}</h3>
              <p className="mt-1 text-sm text-ink/60">{card.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 font-display text-sm font-semibold text-brand">
                {card.cta} <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}