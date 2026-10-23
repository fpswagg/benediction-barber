import type { OpenStatus } from "@/lib/site";

const h = (v: string) => v.replace(/^0/, "").replace(":00", "h").replace(":", "h");

/** "Ouvert maintenant" / "Fermé" line, as SSS sees the salon right now (hours, pause, power cuts). */
export function StatusPill({ status, className = "" }: { status: OpenStatus | null; className?: string }) {
  if (!status) return null;
  const open = status.state === "open";
  const text = open
    ? `Ouvert maintenant${status.closesAt ? ` · jusqu'à ${h(status.closesAt)}` : ""}`
    : `${status.state === "paused" ? "Pause" : "Fermé"}${status.reason ? ` · ${status.reason}` : ""}${status.opensAt ? ` · ouvre à ${h(status.opensAt)}` : ""}`;
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide ${className}`}>
      <span className={`h-2 w-2 rounded-full ${open ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
      {text}
    </span>
  );
}
