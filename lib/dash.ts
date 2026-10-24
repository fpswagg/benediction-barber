import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authConfig } from "./auth-config";
import { getAccessToken, getSession, safeNext, type SssBusiness, type SssSession } from "./sss-auth";

/**
 * Manager dashboard (/dashboard). Everything is read and written with the signed-in
 * person's own SSS access (Sign in with SSS): they can do what their role allows in SSS.
 */

export type Raw = Record<string, unknown>;
export const obj = (v: unknown): Raw => (v && typeof v === "object" && !Array.isArray(v) ? (v as Raw) : {});
export const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
export const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
export const num = (v: unknown) => (v === null || v === undefined || v === "" || !Number.isFinite(Number(v)) ? null : Number(v));

const EARLY_REFRESH_MS = 60_000;

export function dashboardBusiness(session: SssSession | null): SssBusiness | null {
  const b = session?.user.business;
  if (!b) return null;
  return b.id === authConfig.storeSlug || b.slug === authConfig.storeSlug ? b : null;
}

export const canWrite = (session: SssSession | null) => Boolean(session?.scope.split(/\s+/).includes("business"));

export type DashContext = { session: SssSession; business: SssBusiness; base: string; token: string; canWrite: boolean };
export type DashState = { kind: "ok"; ctx: DashContext } | { kind: "signed_out" } | { kind: "wrong_business"; session: SssSession };

const baseOf = (b: SssBusiness) => `/api/v1/stores/${encodeURIComponent(b.id)}`;

export async function dashState(): Promise<DashState> {
  const session = await getSession();
  if (!session) return { kind: "signed_out" };
  const business = dashboardBusiness(session);
  if (!business) return { kind: "wrong_business", session };
  if (session.expiresAt - EARLY_REFRESH_MS <= Date.now()) {
    const here = (await headers()).get("x-pathname");
    redirect(`/auth/sss/refresh?next=${encodeURIComponent(safeNext(here))}`);
  }
  return { kind: "ok", ctx: { session, business, base: baseOf(business), token: session.accessToken, canWrite: canWrite(session) } };
}

export async function requireDash(): Promise<DashContext> {
  const state = await dashState();
  if (state.kind !== "ok") redirect("/dashboard");
  return state.ctx;
}

/** For server actions: may refresh the token (cookies are writable there). */
export async function actionDash(): Promise<DashContext> {
  const session = await getSession();
  const business = dashboardBusiness(session);
  const token = await getAccessToken();
  if (!session || !business || !token) throw new Error("Session expirée : reconnectez-vous.");
  if (!canWrite(session)) throw new Error("Votre accès SSS est en lecture seule.");
  return { session, business, base: baseOf(business), token, canWrite: true };
}

const MESSAGES: Record<number, string> = {
  401: "Session expirée : reconnectez-vous.",
  403: "Votre rôle dans SSS ne permet pas cette action.",
  404: "Introuvable (déjà supprimé ?).",
};

export async function api(ctx: DashContext, path: string, init: RequestInit = {}): Promise<unknown> {
  const h = new Headers(init.headers);
  h.set("Authorization", `Bearer ${ctx.token}`);
  h.set("Accept", "application/json");
  if (init.body && !h.has("Content-Type")) h.set("Content-Type", "application/json");
  const res = await fetch(`${authConfig.apiUrl}${ctx.base}${path}`, { ...init, headers: h, cache: "no-store" });
  const body = obj(await res.json().catch(() => null));
  if (!res.ok) throw new Error(MESSAGES[res.status] || str(obj(body.error).message) || `SSS a répondu ${res.status}`);
  return body.data ?? null;
}

const safe = (ctx: DashContext, path: string) => api(ctx, path).catch(() => null);

export type Rec = { id: string; name: string; data: Raw; metadata: Raw; createdAt: string; updatedAt: string };
const toRec = (r: unknown): Rec => {
  const o = obj(r);
  return { id: str(o.id), name: str(o.name), data: obj(o.data), metadata: obj(o.metadata), createdAt: str(o.createdAt), updatedAt: str(o.updatedAt) };
};

export async function records(ctx: DashContext, kind: "service" | "staff" | "appointment" | "feedback"): Promise<Rec[]> {
  const raw = await safe(ctx, `/sasto/${kind}`);
  return (Array.isArray(raw) ? raw : arr(obj(raw).items)).map(toRec);
}

export async function record(ctx: DashContext, kind: string, id: string): Promise<Rec> {
  return toRec(await api(ctx, `/sasto/${kind}/${encodeURIComponent(id)}`));
}

export const getStore = async (ctx: DashContext) => obj(await safe(ctx, ""));
export async function getProfile(ctx: DashContext) {
  const p = obj(await safe(ctx, "/profile"));
  return { profile: obj(p.profile), now: obj(p.now) };
}
export const getShowcase = async (ctx: DashContext) => obj(await safe(ctx, "/showcase"));

// ── Shapes used by the screens ───────────────────────────────────────────

export type Appointment = {
  id: string;
  clientName: string;
  phone: string;
  service: string;
  staff: string;
  date: string;
  time: string;
  durationMin: number;
  status: string;
  channel: string;
  notes: string;
  createdAt: string;
};

export const toAppointment = (r: Rec): Appointment => ({
  id: r.id,
  clientName: str(r.data.clientName) || r.name.split(" — ")[0] || "Client",
  phone: str(r.data.phone),
  service: str(r.data.service),
  staff: str(r.data.staff),
  date: str(r.data.date),
  time: str(r.data.time),
  durationMin: num(r.data.durationMin) ?? 60,
  status: str(r.data.status) || "requested",
  channel: str(r.data.channel),
  notes: str(r.data.notes),
  createdAt: r.createdAt,
});

export const APPT_STATUS: Record<string, { label: string; tone: string }> = {
  requested: { label: "À confirmer", tone: "bg-gold-soft text-gold" },
  confirmed: { label: "Confirmé", tone: "bg-ok/10 text-ok" },
  done: { label: "Terminé", tone: "bg-muted text-muted-foreground" },
  cancelled: { label: "Annulé", tone: "bg-destructive/10 text-destructive" },
  no_show: { label: "Absent", tone: "bg-destructive/10 text-destructive" },
};

export const CHANNELS: Record<string, string> = { web: "Site", website: "Site", shop: "Au salon", whatsapp: "WhatsApp", telegram: "Telegram", phone: "Téléphone" };

export async function appointments(ctx: DashContext): Promise<Appointment[]> {
  return (await records(ctx, "appointment")).map(toAppointment).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

export type Member = {
  id: string;
  name: string;
  role: string;
  bio: string;
  experience: string;
  specialties: string;
  phone: string;
  image: string;
  active: boolean;
  available: boolean;
  awayReason: string;
  backOn: string;
  data: Raw;
};

export const toMember = (r: Rec): Member => ({
  id: r.id,
  name: r.name,
  role: str(r.data.role),
  bio: str(r.data.bio),
  experience: str(r.data.experience),
  specialties: Array.isArray(r.data.specialties) ? r.data.specialties.map(String).join(", ") : str(r.data.specialties),
  phone: str(r.data.phone),
  image: str(r.data.image),
  active: r.data.active !== false,
  available: r.data.available !== false,
  awayReason: str(r.data.awayReason),
  backOn: str(r.data.backOn),
  data: r.data,
});

/** Away with a "back on" day already reached = back. */
export const presentToday = (m: Member, today: string) => m.available || Boolean(m.backOn && m.backOn <= today);

export async function team(ctx: DashContext): Promise<Member[]> {
  return (await records(ctx, "staff")).map(toMember).sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name));
}

export type ServiceItem = {
  id: string;
  name: string;
  price: number | null;
  currency: string;
  description: string;
  durationMin: number | null;
  active: boolean;
  category: string;
  popular: boolean;
  data: Raw;
  metadata: Raw;
};

export const toService = (r: Rec): ServiceItem => ({
  id: r.id,
  name: r.name,
  price: num(r.data.price),
  currency: str(r.data.currency) || "FCFA",
  description: str(r.data.description),
  durationMin: num(r.data.durationMin),
  active: r.data.active !== false,
  category: str(r.metadata.category) || str(r.data.category) || "Services",
  popular: r.metadata.popular === true || r.data.popular === true,
  data: r.data,
  metadata: r.metadata,
});

export async function services(ctx: DashContext): Promise<ServiceItem[]> {
  return (await records(ctx, "service")).map(toService).sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
}

export type Message = { id: string; name: string; phone: string; email: string; message: string; type: string; done: boolean; at: string; data: Raw };

export async function messages(ctx: DashContext): Promise<Message[]> {
  return (await records(ctx, "feedback"))
    .map((r) => ({
      id: r.id,
      name: str(r.data.name) || r.name,
      phone: str(r.data.phone),
      email: str(r.data.email),
      message: str(r.data.message),
      type: str(r.data.type),
      done: str(r.data.status) === "done",
      at: r.createdAt,
      data: r.data,
    }))
    .sort((a, b) => b.at.localeCompare(a.at));
}

export const DAY_KEYS = [
  ["mon", "Lundi"],
  ["tue", "Mardi"],
  ["wed", "Mercredi"],
  ["thu", "Jeudi"],
  ["fri", "Vendredi"],
  ["sat", "Samedi"],
  ["sun", "Dimanche"],
] as const;

export const PAYMENT_IDS = [
  ["cash", "Espèces"],
  ["mtn_momo", "MTN Mobile Money"],
  ["orange_money", "Orange Money"],
  ["card", "Carte bancaire"],
  ["bank_transfer", "Virement bancaire"],
  ["other", "Autre"],
] as const;

export const SOCIAL_IDS = [
  ["instagram", "Instagram"],
  ["facebook", "Facebook"],
  ["tiktok", "TikTok"],
  ["youtube", "YouTube"],
  ["x", "X (Twitter)"],
  ["telegram", "Telegram"],
] as const;
