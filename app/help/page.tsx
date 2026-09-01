import { Phone, Mail, Clock } from 'lucide-react';

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Help Centre</h1>

      <div className="space-y-4">
        <div className="rounded-xl border border-tint bg-surface p-4">
          <p className="flex items-center gap-2 font-display font-semibold text-ink"><Phone size={16} /> Call Us</p>
          <p className="mt-1 text-sm text-ink/60">Speak to our customer service team for order help, delivery questions, or general enquiries.</p>
        </div>
        <div className="rounded-xl border border-tint bg-surface p-4">
          <p className="flex items-center gap-2 font-display font-semibold text-ink"><Mail size={16} /> Email Us</p>
          <p className="mt-1 text-sm text-ink/60">Send us a message and we&apos;ll get back to you within 24 hours.</p>
        </div>
        <div className="rounded-xl border border-tint bg-surface p-4">
          <p className="flex items-center gap-2 font-display font-semibold text-ink"><Clock size={16} /> Store Hours</p>
          <p className="mt-1 text-sm text-ink/60">Most branches are open Monday–Saturday, 8am–6pm.</p>
        </div>
      </div>
    </main>
  );
}