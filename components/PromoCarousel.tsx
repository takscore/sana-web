'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide { title: string; subtitle: string; cta: string; }

const slides: Slide[] = [
  { title: 'Wholesale Prices, Every Day', subtitle: 'Stock up and save on groceries, household goods and more.', cta: 'Shop Now' },
  { title: 'Free Delivery on Orders Over MWK 50,000', subtitle: 'Order online, we bring it to your door.', cta: 'Learn More' },
  { title: 'New: Order for Pickup', subtitle: 'Skip the queue — order ahead and collect at your nearest branch.', cta: 'Find a Branch' },
];

export default function PromoCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[index];

  return (
    <div className="relative overflow-hidden bg-brand">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="text-white">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">{slide.title}</h2>
          <p className="mt-3 max-w-md text-cream">{slide.subtitle}</p>
          <button className="mt-5 rounded-full bg-accent px-6 py-2.5 font-display font-semibold text-white hover:bg-red-700">
            {slide.cta}
          </button>
        </div>
      </div>

      <button
        onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => setIndex((i) => (i + 1) % slides.length)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 w-2 rounded-full ${i === index ? 'bg-accent' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}