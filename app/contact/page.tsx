import { Phone, Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-md p-6 py-12">
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Contact Us</h1>
      <div className="space-y-4">
        <p className="flex items-center gap-3 text-ink/70"><Phone size={18} className="text-brand" /> +265 XXX XXX XXX</p>
        <p className="flex items-center gap-3 text-ink/70"><Mail size={18} className="text-brand" /> support@chipikuplus.mw</p>
        <p className="flex items-center gap-3 text-ink/70"><MapPin size={18} className="text-brand" /> Find your nearest branch on our Store Locator page.</p>
      </div>
    </main>
  );
}