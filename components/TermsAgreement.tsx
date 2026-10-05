import Link from 'next/link';

export default function TermsAgreement() {
  return (
    <p className="text-xs text-ink/50">
      By creating an account, you agree to our{' '}
      <Link href="/terms" className="font-semibold text-brand underline">Terms of Service</Link>. See how we
      process your data in our{' '}
      <Link href="/privacy" className="font-semibold text-brand underline">Privacy Policy</Link>.
    </p>
  );
}