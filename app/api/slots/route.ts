import { NextResponse } from "next/server";
import { sssPublic } from "@/lib/sss";

/** Free start times of a day (SSS showcase), for the booking form. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = new URLSearchParams();
  for (const key of ["date", "staff", "service", "durationMin"]) {
    const v = url.searchParams.get(key);
    if (v) q.set(key, v);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(q.get("date") ?? "")) return NextResponse.json({ error: "Choisissez un jour." }, { status: 400 });
  const r = await sssPublic(`/slots?${q}`);
  if (!r.ok) return NextResponse.json({ error: String(r.error.message ?? "Horaires indisponibles.") }, { status: r.status });
  return NextResponse.json({ data: r.data }, { headers: { "cache-control": "no-store" } });
}
