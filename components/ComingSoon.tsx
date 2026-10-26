import Link from 'next/link';
import { Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import PageShell from '@/components/PageShell';

interface ComingSoonProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  description: string;
  features?: string[];
}

export default function ComingSoon({ title, subtitle, icon, description, features = [] }: ComingSoonProps) {
  return (
    <PageShell title={title} subtitle={subtitle} icon={icon} maxWidth="max-w-2xl">
      <div className="rounded-2xl border-t-4 border-accent bg-surface p-8 shadow-lg">
        <span className="inline-block rounded-full bg-accent/10 px-3 py-1 font-display text-xs font-bold uppercase text-accent">
          Coming soon
        </span>
        <p className="mt-4 text-ink/70">{description}</p>

        {features.length > 0 && (
          <>
            <p className="mt-6 font-display text-sm font-bold text-ink">What to expect</p>
            <ul className="mt-2 space-y-2">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-ink/70">
                  <Check size={16} className="mt-0.5 shrink-0 text-brand" /> {f}
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-brand px-6 py-2 font-display text-sm font-semibold text-white hover:bg-[color:var(--color-brand-dark)]"
          >
            Start shopping
          </Link>
          <Link
            href="/feedback"
            className="rounded-full border border-brand px-6 py-2 font-display text-sm font-semibold text-brand hover:bg-brand hover:text-white"
          >
            Tell us what you&apos;d like to see
          </Link>
        </div>
      </div>
    </PageShell>
  );
}