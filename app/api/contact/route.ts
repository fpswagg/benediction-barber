import { NextResponse } from "next/server";
import { sssPublic } from "@/lib/sss";

/** Contact form -> SSS (Retours / Feedback, the team is notified). */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const pick = (k: string, max: number) => (typeof body?.[k] === "string" ? (body[k] as string).trim().slice(0, max) : "");
  if (pick("website", 200)) return NextResponse.json({ data: { ok: true } }, { status: 201 });
  const name = pick("name", 160);
  const message = pick("message", 4000);
  if (!name || !message) return NextResponse.json({ error: "Indiquez votre nom et votre message." }, { status: 400 });
  const r = await sssPublic("/contact", {
    method: "POST",
    body: JSON.stringify({ name, message, phone: pick("phone", 40) || undefined, email: pick("email", 160) || undefined, createClient: true }),
  });
  if (!r.ok) return NextResponse.json({ error: "Envoi impossible pour le moment. Écrivez-nous sur WhatsApp." }, { status: 502 });
  return NextResponse.json({ data: { ok: true } }, { status: 201 });
}
