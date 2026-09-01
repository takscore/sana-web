import Link from 'next/link';

const links = [
  { label: 'Browse Groceries', href: '/' },
  { label: 'New', href: '/?sort=new' },
  { label: 'Offers', href: '/offers' },
  { label: 'Coupons', href: '/coupons' },
  { label: 'Recipes', href: '/recipes' },
  { label: 'Favourites', href: '/favourites' },
];

export default function SecondaryNav() {
  return (
    <div className="bg-[color:var(--color-brand-dark)]">
      <div className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-6 py-2.5">
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="shrink-0 font-display text-sm font-medium text-white/90 hover:text-white"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}