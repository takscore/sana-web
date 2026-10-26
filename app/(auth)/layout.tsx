import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
      <header className="bg-brand px-6 py-4">
        <div className="mx-auto max-w-6xl flex justify-center">
          <Link href="/">
            <Image src="/chipiku-logo.png" alt="Chipiku Plus" width={130} height={40} priority className="h-12 w-auto"/>
          </Link>
        </div>
      </header>

      <div className="relative flex items-center justify-center overflow-hidden bg-tint px-6 py-10">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative z-10 w-full max-w-sm">{children}</div>
      </div>

      <footer className="border-t border-tint bg-surface px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-xs text-ink/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Chipiku Plus. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-brand">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-brand">Privacy Policy</Link>
            <Link href="/cookies" className="hover:text-brand">Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}