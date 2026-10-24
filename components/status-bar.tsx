import type { OpenStatus } from "@/lib/site";
import { hh } from "@/lib/format";

/** "Ouvert · jusqu'à 18h" / "Fermé · ouvre à 9h", as SSS sees the salon right now (hours, pause, power cuts). */
export function StatusPill({ status, className = "" }: { status: OpenStatus | null; className?: string }) {
  if (!status) return null;
  const open = status.state === "open";
  const text = open
    ? `Ouvert maintenant${status.closesAt ? ` · jusqu'à ${hh(status.closesAt)}` : ""}`
    : `${status.state === "paused" ? "En pause" : "Fermé"}${status.reason ? ` · ${status.reason}` : ""}${status.opensAt ? ` · ouvre à ${hh(status.opensAt)}` : ""}`;
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium ${className}`}>
      <span className={`h-2 w-2 shrink-0 rounded-full ${open ? "bg-ok" : "bg-destructive"}`} />
      {text}
    </span>
  );
}
