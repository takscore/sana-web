import SiteHeader from '@/components/SiteHeader';
import SecondaryNav from '@/components/SecondaryNav';
import CategoryStrip from '@/components/CategoryStrip';
import SiteFooter from '@/components/SiteFooter';
import CartDrawer from '@/components/CartDrawer';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
      <div className="sticky top-0 z-50">
        <SiteHeader />
        <SecondaryNav />
        <CategoryStrip />
      </div>
      <CartDrawer />
      <div>{children}</div>
      <SiteFooter />
    </div>
  );
}