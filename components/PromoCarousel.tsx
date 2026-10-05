'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';
import { scrollToFeatureCards } from '@/lib/scrollToFeatureCards';

interface Slide { title: string; subtitle: string; cta: string; action: 'shop' | 'new' | 'stores'; }

const slides: Slide[] = [
  { title: 'Wholesale Prices, Every Day', subtitle: 'Stock up and save on groceries, household goods and more.', cta: 'Shop Now', action: 'shop' },
  { title: 'Free Delivery on Orders Over MWK 50,000', subtitle: 'Order online, we bring it to your door.', cta: 'Learn More', action: 'new' },
  { title: 'New: Order for Pickup', subtitle: 'Skip the queue — order ahead and collect at your nearest branch.', cta: 'Find a Branch', action: 'stores' },
];

export default function PromoCarousel() {
  const [index, setIndex] = useState(0);
  const { setQuery, setCategoryId, setSort } = useSearch();
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  function handleCtaClick(action: Slide['action']) {
    if (action === 'stores') {
      router.push('/stores');
      return;
    }
    setCategoryId('');
    setQuery('');
    setSort(action === 'new' ? 'new' : '');
    router.push('/');
    scrollToFeatureCards();
  }

  return (
    <div className="relative overflow-hidden bg-brand">
      <div className="relative mx-auto h-80 max-w-6xl px-6 py-10 sm:h-64 sm:py-12 md:h-56">
        {slides.map((slide, i) => (
          <div
            key={slide.title}
            aria-hidden={i !== index}
            className={`absolute inset-0 px-6 py-10 pb-16 text-white transition-all duration-700 ease-in-out sm:py-12 sm:pb-14 ${
              i === index
                ? 'translate-x-0 opacity-100 pointer-events-auto'
                : i < index
                  ? '-translate-x-10 opacity-0 pointer-events-none'
                  : 'translate-x-10 opacity-0 pointer-events-none'
            }`}
          >
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">{slide.title}</h2>
            <p className="mt-3 max-w-md text-cream">{slide.subtitle}</p>
            <button
              onClick={() => handleCtaClick(slide.action)}
              tabIndex={i === index ? 0 : -1}
              className="mt-5 rounded-full bg-accent px-6 py-2.5 font-display font-semibold text-white hover:bg-red-700"
            >
              {slide.cta}
            </button>
          </div>
        ))}
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
            className={`h-2 w-2 rounded-full transition-colors duration-300 ${i === index ? 'bg-accent' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}