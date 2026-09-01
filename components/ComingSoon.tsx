export default function ComingSoon({ title }: { title: string }) {
  return (
    <main className="mx-auto max-w-lg p-6 text-center">
      <h1 className="mb-2 font-display text-2xl font-bold text-ink">{title}</h1>
      <p className="text-ink/60">This feature is coming soon — stay tuned!</p>
    </main>
  );
}