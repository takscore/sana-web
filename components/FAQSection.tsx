'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'What areas do you deliver to?', a: 'We deliver from participating branches across Malawi. Check the Store Locator page to see branches near you and their delivery coverage.' },
  { q: 'How much does delivery cost?', a: 'Delivery fees are calculated at checkout based on your branch and delivery type. Pickup orders have no delivery fee.' },
  { q: 'Can I pick up my order instead of getting it delivered?', a: "Yes — choose 'Pickup' at checkout and collect your order at your selected branch once it's ready." },
  { q: 'What payment methods do you accept?', a: 'We accept mobile money, card, and cash on delivery, processed securely through PayChangu.' },
  { q: 'Can I change or cancel my order after placing it?', a: "Orders can be cancelled while they're still pending. Once an order has been confirmed, please contact our Help Centre for assistance." },
  { q: 'Do I need an account to place an order?', a: 'Yes — creating a free account lets us confirm your order, keep you updated on delivery, and lets you track your order history.' },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-12">
      <h2 className="mb-6 text-center font-display text-2xl font-bold text-ink">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {faqs.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.q} className="overflow-hidden rounded-xl border border-tint bg-surface">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-display font-semibold text-ink">{item.q}</span>
                <ChevronDown size={18} className={`shrink-0 text-brand transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className={`grid transition-all duration-200 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden px-5 pb-4 text-sm text-ink/70">{item.a}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}