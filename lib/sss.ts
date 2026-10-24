import { cache } from "react";
import { SSS_API_URL, SSS_REVALIDATE, SSS_STORE_SLUG, BUSINESS_NAME } from "./config";
import type { DayHours, GalleryItem, ServiceCategory, Site, TeamMember } from "./site";
import servicesData from "@/data/services.json";
import teamData from "@/data/team.json";

type Raw = Record<string, unknown>;
const obj = (v: unknown): Raw => (v && typeof v === "object" && !Array.isArray(v) ? (v as Raw) : {});
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const num = (v: unknown) => (v === null || v === undefined || v === "" || !Number.isFinite(Number(v)) ? null : Number(v));

const DAYS = [
  ["mon", "Lundi"],
  ["tue", "Mardi"],
  ["wed", "Mercredi"],
  ["thu", "Jeudi"],
  ["fri", "Vendredi"],
  ["sat", "Samedi"],
  ["sun", "Dimanche"],
] as const;

const PAYMENTS: Record<string, string> = {
  cash: "Espèces",
  mtn_momo: "MTN Mobile Money",
  orange_money: "Orange Money",
  card: "Carte bancaire",
  bank: "Virement",
};

/** Look of each category on the site (the list itself comes from SSS). */
const CATEGORY_LOOK = Object.fromEntries(servicesData.categories.map((c) => [c.name.toLowerCase(), { id: c.id, icon: c.icon, description: c.description }]));
const SERVICE_ORDER = servicesData.categories.flatMap((c) => c.services.map((s) => s.name.toLowerCase()));
const slug = (v: string) =>
  v
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

async function fetchShowcase(): Promise<Raw | null> {
  try {
    const res = await fetch(`${SSS_API_URL}/api/v1/stores/${encodeURIComponent(SSS_STORE_SLUG)}/showcase`, {
      headers: { accept: "application/json" },
      next: { revalidate: SSS_REVALIDATE, tags: ["sss"] },
    });
    if (!res.ok) {
      console.error(`[sss] showcase answered ${res.status}`);
      return null;
    }
    return obj(obj(await res.json()).data);
  } catch (err) {
    console.error("[sss] showcase unreachable", err);
    return null;
  }
}

const h = (v: string) => v.replace(/^0/, "").replace(":00", "h").replace(":", "h");

function hoursText(days: DayHours[]): string {
  const open = days.filter((d) => d.slots.length);
  if (!open.length) return "";
  const range = (d: DayHours) => d.slots.map((s) => `${h(s.from)} – ${h(s.to)}`).join(", ");
  if (open.length === 7 && new Set(days.map(range)).size === 1) return `Tous les jours : ${range(days[0])}`;
  return days.map((d) => `${d.label} : ${d.slots.length ? range(d) : "fermé"}`).join(" · ");
}

function categoriesFrom(services: Raw[]): ServiceCategory[] {
  const groups = new Map<string, ServiceCategory>();
  for (const s of services) {
    const data = obj(s.data);
    if (data.active === false) continue;
    const meta = obj(s.metadata);
    const catName = str(meta.category) || str(data.category) || "Services";
    const look = CATEGORY_LOOK[catName.toLowerCase()];
    if (!groups.has(catName)) groups.set(catName, { id: look?.id ?? slug(catName), name: catName, description: look?.description ?? "", icon: look?.icon ?? "scissors", services: [] });
    groups.get(catName)!.services.push({
      id: str(s.id),
      name: str(s.name),
      description: str(data.description),
      price: num(data.price),
      currency: str(data.currency) || "FCFA",
      duration: num(data.durationMin),
      popular: meta.popular === true || data.popular === true,
    });
  }
  const rank = (name: string) => {
    const i = SERVICE_ORDER.indexOf(name.toLowerCase());
    return i < 0 ? 999 : i;
  };
  const catRank = (c: ServiceCategory) => {
    const i = servicesData.categories.findIndex((x) => x.name.toLowerCase() === c.name.toLowerCase());
    return i < 0 ? 999 : i;
  };
  return [...groups.values()]
    .map((c) => ({ ...c, services: c.services.sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name)) }))
    .sort((a, b) => catRank(a) - catRank(b));
}

/** Built-in demo content, shown only when SSS cannot be reached. */
function fallback(): Site {
  const days: DayHours[] = DAYS.map(([key, label]) => ({ key, label, slots: [{ from: "09:00", to: "18:00" }] }));
  return {
    name: BUSINESS_NAME,
    description: "Barbershop à Yaoundé : coupes, dégradés, nattes, barbe et soins.",
    about: "",
    heroSubtitle: "Coupes, dégradés, nattes et barbe à Biyem-Assi, Yaoundé. Ouvert tous les jours, 9h–18h.",
    logoUrl: "/logo.png",
    bannerUrl: null,
    phone: "+237 691 89 32 41",
    whatsapp: "+237 691 89 32 41",
    email: "franckemile98@gmail.com",
    address: "Biyem-Assi, face au collège Fleming",
    city: "Yaoundé",
    country: "Cameroun",
    extras: [],
    categories: servicesData.categories.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      icon: c.icon,
      services: c.services.map((s) => ({ id: s.id, name: s.name, description: s.description, price: s.price, currency: "FCFA", duration: s.duration, popular: s.popular })),
    })),
    team: teamData.members.map((m) => ({ id: m.id, name: m.name, role: m.role, bio: m.bio, experience: m.experience, specialties: m.specialties, imageUrl: null, available: m.available, backOn: null })),
    gallery: [],
    hours: days,
    hoursText: hoursText(days),
    status: null,
    payments: ["Espèces", "MTN Mobile Money", "Orange Money"],
    faq: [],
    assistant: null,
    live: false,
  };
}

async function load(): Promise<Site> {
  const d = await fetchShowcase();
  if (!d) return fallback();
  const store = obj(d.store);
  const meta = obj(store.metadata);
  const showcase = obj(d.showcase);
  const business = obj(d.business);
  const daysRaw = obj(obj(business.hours).days);
  const hours: DayHours[] = DAYS.map(([key, label]) => ({
    key,
    label,
    slots: arr(daysRaw[key])
      .map(obj)
      .map((s) => ({ from: str(s.from), to: str(s.to) }))
      .filter((s) => s.from && s.to),
  }));
  const status = obj(business.status);
  const team: TeamMember[] = arr(d.members)
    .map(obj)
    .map((m) => ({
      id: str(m.id),
      name: str(m.name),
      role: str(m.role),
      bio: str(m.bio),
      experience: str(m.experience),
      specialties: arr(m.specialties).map(str).filter(Boolean),
      imageUrl: str(m.imageUrl) || null,
      available: m.available !== false,
      backOn: str(m.backOn) || null,
    }));
  const gallery: GalleryItem[] = arr(meta.gallery)
    .map(obj)
    .map((g) => ({ url: str(g.url), caption: str(g.caption), category: str(g.category) || "salon" }))
    .filter((g) => g.url);
  const bot = d.chatbot ? obj(d.chatbot) : null;
  return {
    name: str(store.name) || BUSINESS_NAME,
    description: str(store.description),
    about: str(showcase.aboutMarkdown),
    heroSubtitle: str(showcase.heroSubtitle) || str(store.description),
    logoUrl: str(store.logoUrl) || null,
    bannerUrl: str(showcase.heroImageUrl) || str(store.bannerUrl) || null,
    phone: str(store.phone) || null,
    whatsapp: str(store.whatsapp) || str(store.phone) || null,
    email: str(store.email) || null,
    address: str(store.address) || null,
    city: str(store.city) || "Yaoundé",
    country: str(store.country) || "Cameroun",
    extras: arr(meta.extras).map(str).filter(Boolean),
    categories: categoriesFrom(arr(d.services).map(obj)),
    team,
    gallery,
    hours,
    hoursText: hoursText(hours),
    status: Object.keys(status).length
      ? {
          state: str(status.state) || "open",
          reason: arr(status.reasonsFr).map(str).filter(Boolean)[0] ?? null,
          opensAt: str(status.opensAt) || null,
          closesAt: str(status.closesAt) || null,
        }
      : null,
    payments: arr(obj(business.payments).methods)
      .map((m) => PAYMENTS[str(obj(m).id)] ?? str(obj(m).label))
      .filter(Boolean),
    faq: arr(business.faq)
      .map(obj)
      .map((f) => ({ q: str(f.q), a: str(f.a) }))
      .filter((f) => f.q && f.a),
    assistant:
      bot && str(bot.publicKey)
        ? {
            publicKey: str(bot.publicKey),
            name: str(bot.name) || "Assistant",
            avatarUrl: str(bot.avatarUrl) || null,
            greeting: str(bot.greeting),
            suggestions: arr(bot.suggestions).map(str).filter(Boolean).slice(0, 4),
          }
        : null,
    live: true,
  };
}

/** The salon as SSS publishes it (one request per render, cached SSS_REVALIDATE seconds). */
export const getSite = cache(load);

/** Calls to the public booking and contact endpoints of the showcase. */
export async function sssPublic(path: string, init: RequestInit = {}) {
  const res = await fetch(`${SSS_API_URL}/api/v1/stores/${encodeURIComponent(SSS_STORE_SLUG)}/showcase${path}`, {
    ...init,
    headers: { accept: "application/json", "content-type": "application/json", ...(init.headers ?? {}) },
    cache: "no-store",
  });
  const body = obj(await res.json().catch(() => null));
  return { ok: res.ok, status: res.status, data: body.data, error: obj(body.error) };
}
