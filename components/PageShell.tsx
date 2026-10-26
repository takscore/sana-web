import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface PageShellProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  maxWidth?: 'max-w-md' | 'max-w-2xl' | 'max-w-3xl' | 'max-w-4xl' | 'max-w-6xl';
  children: ReactNode;
}

export default function PageShell({
  title,
  subtitle,
  icon: Icon,
  actions,
  maxWidth = 'max-w-4xl',
  children,
}: PageShellProps) {
  return (
    <div className="min-h-full bg-tint">
      <main className={`mx-auto ${maxWidth} p-6 py-10`}>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                <Icon size={22} />
              </div>
            )}
            <div>
              <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
              {subtitle && <p className="mt-0.5 text-sm text-ink/60">{subtitle}</p>}
            </div>
          </div>
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
}