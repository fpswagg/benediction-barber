"use client";

export default function DashError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h1 className="text-lg font-semibold">Cette page n&apos;a pas pu se charger</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message || "SSS ne répond pas pour l'instant."}</p>
      <div className="mt-4 flex gap-2">
        <button onClick={reset} className="btn btn-dark">
          Réessayer
        </button>
        <a href="/auth/sss?next=/dashboard" className="btn btn-line">
          Se reconnecter
        </a>
      </div>
    </div>
  );
}
