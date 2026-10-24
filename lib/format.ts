/** Small display helpers shared by the site and the dashboard (safe on client and server). */

export const hh = (v: string) => v.replace(/^0(\d)/, "$1").replace(":00", "h").replace(":", "h");

export function price(value: number | null | undefined, currency = "FCFA"): string {
  if (value === null || value === undefined) return "Prix au salon";
  return `${value.toLocaleString("fr-FR").replace(/ | /g, " ")} ${currency === "XAF" ? "FCFA" : currency}`;
}

export function duration(min: number | null | undefined): string {
  if (!min) return "";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

/** Today in Douala (YYYY-MM-DD) and its weekday key (mon…sun). */
export function doualaToday(offsetDays = 0): { iso: string; key: string } {
  const d = new Date(Date.now() + 3600e3 + offsetDays * 86400e3);
  const keys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return { iso: d.toISOString().slice(0, 10), key: keys[d.getUTCDay()] };
}

export function frDate(iso: string, opts: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" }) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("fr-FR", { ...opts, timeZone: "UTC" });
}
