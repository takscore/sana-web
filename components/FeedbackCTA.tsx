import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export default function FeedbackCTA() {
  return (
    <section className="bg-[color:var(--color-tint)]">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 py-12 text-center">
        <MessageCircle size={36} className="text-brand" />
        <h2 className="font-display text-2xl font-bold text-ink">We&apos;d love to hear what you think!</h2>
        <p className="max-w-md text-sm text-ink/60">
          Your feedback helps us make Chipiku Plus better for everyone. It only takes a minute.
        </p>
        <Link
          href="/feedback"
          className="rounded-full bg-accent px-8 py-3 font-display font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-red-700"
        >
          Give Feedback
        </Link>
      </div>
    </section>
  );
}