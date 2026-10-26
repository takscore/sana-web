import Link from 'next/link';
import { HelpCircle, ClipboardList, Store, User, MessageCircle, Phone, Mail, Clock } from 'lucide-react';
import PageShell from '@/components/PageShell';
import FAQSection from '@/components/FAQSection';

const quickLinks = [
  { icon: ClipboardList, title: 'Track my order', description: 'Check an order’s status, pay for a pending one, or cancel it.', href: '/orders' },
  { icon: Store, title: 'Find a store', description: 'Branch addresses, opening hours and pickup details.', href: '/stores' },
  { icon: User, title: 'My account', description: 'Update your details, password and saved delivery address.', href: '/account' },
  { icon: MessageCircle, title: 'Give feedback', description: 'Tell us how we’re doing, the good and the bad.', href: '/feedback' },
];

export default function HelpPage() {
  return (
    <PageShell
      title="Help Centre"
      subtitle="Answers, contact details and quick links"
      icon={HelpCircle}
      maxWidth="max-w-4xl"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {quickLinks.map(({ icon: Icon, title, description, href }) => (
          <Link
            key={title}
            href={href}
            className="group rounded-2xl border border-tint bg-surface p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-tint text-brand transition-colors duration-200 group-hover:bg-brand group-hover:text-white">
              <Icon size={20} />
            </div>
            <h2 className="mt-3 font-display font-bold text-ink">{title}</h2>
            <p className="mt-1 text-sm text-ink/60">{description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border-t-4 border-accent bg-surface p-8 shadow-lg">
        <h2 className="font-display text-xl font-bold text-ink">Contact us</h2>
        <p className="mt-1 text-sm text-ink/60">Can&apos;t find what you need? Our team is happy to help.</p>

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tint text-brand"><Phone size={18} /></div>
            <p className="mt-2 font-display font-semibold text-ink">Call us</p>
            <p className="text-sm text-ink/60">+265 XXX XXX XXX</p>
            <p className="text-xs text-ink/40">Mon–Sat, 8am–6pm</p>
          </div>
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tint text-brand"><Mail size={18} /></div>
            <p className="mt-2 font-display font-semibold text-ink">Email us</p>
            <p className="text-sm text-ink/60">support@chipikuplus.mw</p>
            <p className="text-xs text-ink/40">We reply within 24 hours</p>
          </div>
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tint text-brand"><Clock size={18} /></div>
            <p className="mt-2 font-display font-semibold text-ink">Store hours</p>
            <p className="text-sm text-ink/60">Hours vary by branch</p>
            <Link href="/stores" className="text-xs font-semibold text-brand hover:underline">See all branches →</Link>
          </div>
        </div>
      </div>

      <FAQSection />
    </PageShell>
  );
}