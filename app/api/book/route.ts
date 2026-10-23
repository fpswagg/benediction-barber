import { NextResponse } from "next/server";
import { sssPublic } from "@/lib/sss";

/** Appointment request -> SSS (SASTO rendez-vous "demandé" + notification to the team). */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  const pick = (k: string, max = 200) => (typeof body[k] === "string" ? (body[k] as string).trim().slice(0, max) : undefined);
  const payload = {
    name: pick("name", 160),
    phone: pick("phone", 40),
    email: pick("email", 160) || undefined,
    service: pick("service", 160) || undefined,
    staff: pick("staff", 120) || undefined,
    date: pick("date", 10),
    time: pick("time", 5),
    notes: pick("notes", 2000) || undefined,
    website: pick("website", 200) || undefined,
    lang: "fr",
  };
  const r = await sssPublic("/book", { method: "POST", body: JSON.stringify(payload) });
  if (!r.ok) {
    const message = r.status === 400 ? String(r.error.message ?? "Vérifiez le formulaire.") : "Réservation indisponible pour le moment. Contactez-nous sur WhatsApp.";
    return NextResponse.json({ error: message, code: r.error.code ?? null }, { status: r.status === 400 ? 400 : 502 });
  }
  return NextResponse.json({ data: r.data }, { status: 201 });
}
