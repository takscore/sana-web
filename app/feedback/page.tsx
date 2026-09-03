'use client';

import { useState } from 'react';
import { Star, CheckCircle2 } from 'lucide-react';

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="mx-auto max-w-md p-6 py-16 text-center">
        <CheckCircle2 size={48} className="mx-auto text-brand" />
        <h1 className="mt-4 font-display text-2xl font-bold text-ink">Thank you!</h1>
        <p className="mt-2 text-ink/60">We appreciate you taking the time to share your feedback.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md p-6 py-12">
      <h1 className="mb-2 font-display text-2xl font-bold text-ink">Give Feedback</h1>
      <p className="mb-6 text-sm text-ink/60">Tell us how we&apos;re doing — the good and the bad.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <p className="mb-2 font-display text-sm font-semibold text-ink">How would you rate your experience?</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`Rate ${star} stars`}
              >
                <Star size={28} className={star <= (hoverRating || rating) ? 'fill-accent text-accent' : 'text-tint'} />
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us more..."
          rows={5}
          className="w-full rounded-lg border border-tint px-3 py-2"
        />

        <button
          type="submit"
          disabled={rating === 0}
          className="w-full rounded-full bg-brand py-2.5 font-display font-semibold text-white hover:bg-[color:var(--color-brand-dark)] disabled:opacity-50"
        >
          Submit Feedback
        </button>
      </form>
    </main>
  );
}