export default function Loading() {
  return (
    <div className="space-y-4" aria-busy>
      <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
      <div className="h-32 animate-pulse rounded-2xl bg-muted" />
      <div className="h-24 animate-pulse rounded-2xl bg-muted" />
      <div className="h-24 animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}
