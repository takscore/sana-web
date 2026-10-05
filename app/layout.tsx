import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { SearchProvider } from '@/context/SearchContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import CookieConsentBanner from '@/components/CookieConsentBanner';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata = {
  title: "Chipiku Plus — Malawi's Home of Wholesale Savings",
  description: 'Shop wholesale groceries and essentials online for delivery or pickup.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable} font-body bg-cream text-ink antialiased`}>
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <SearchProvider>
                {children}
                <CookieConsentBanner />
              </SearchProvider>
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}