"use server";

import { revalidatePath, updateTag } from "next/cache";
import { actionDash, api, arr, getShowcase, getStore, getProfile, obj, record, str, type DashContext, type Raw } from "@/lib/dash";
import { SSS_TAG } from "@/lib/auth-config";

export type Result = { ok: boolean; message: string; at: number } | null;

const done = (message = "Enregistré"): Result => ({ ok: true, message, at: Date.now() });
const fail = (e: unknown): Result => ({ ok: false, message: e instanceof Error ? e.message : "Erreur inattendue", at: Date.now() });

function refresh() {
  updateTag(SSS_TAG);
  revalidatePath("/", "layout");
}

/** Every action: signed-in context, run, refresh the site and the dashboard. */
async function run(fn: (ctx: DashContext) => Promise<string | void>): Promise<Result> {
  try {
    const ctx = await actionDash();
    const msg = await fn(ctx);
    refresh();
    return done(msg || undefined);
  } catch (e) {
    return fail(e);
  }
}

const f = (fd: FormData, k: string) => str(fd.get(k));
const on = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "true" || fd.get(k) === "1";
const intOr = (v: string, d: number | null) => {
  const n = Number(v.replace(/\s/g, ""));
  return v && Number.isFinite(n) ? Math.round(n) : d;
};
const json = (body: unknown) => JSON.stringify(body);

async function upload(ctx: DashContext, dataUrl: string, base: string): Promise<string> {
  const m = /^data:(image\/[a-z+.-]+);base64,(.+)$/i.exec(dataUrl);
  if (!m) throw new Error("Image illisible.");
  const ext = m[1].split("/")[1].replace("jpeg", "jpg").replace(/\+.*/, "");
  const name = `${base}-${Date.now().toString(36)}.${ext}`;
  const res = obj(await api(ctx, "/files", { method: "POST", body: json({ name, mediaType: m[1], dataBase64: m[2] }) }));
  const url = str(res.url);
  if (!url) throw new Error("L'envoi de l'image a échoué.");
  return url;
}

async function patchRecord(ctx: DashContext, kind: string, id: string, change: (data: Raw) => Raw, extra: Raw = {}) {
  const cur = await record(ctx, kind, id);
  await api(ctx, `/sasto/${kind}/${encodeURIComponent(id)}`, { method: "PATCH", body: json({ data: change({ ...cur.data }), ...extra }) });
}

// ── Today: open / pause / power ─────────────────────────────────────────

export async function setPause(_: Result, fd: FormData) {
  return run(async (ctx) => {
    const paused = on(fd, "paused");
    const hours = intOr(f(fd, "hours"), 0) ?? 0;
    const until = paused && hours > 0 ? new Date(Date.now() + hours * 3600e3).toISOString() : null;
    await api(ctx, "/availability", { method: "PATCH", body: json({ paused, reason: paused ? f(fd, "reason") || null : null, until }) });
    return paused ? "Salon mis en pause" : "Salon rouvert";
  });
}

export async function setDependency(_: Result, fd: FormData) {
  return run(async (ctx) => {
    const ok = on(fd, "ok");
    await api(ctx, "/availability", { method: "PATCH", body: json({ dependency: { id: f(fd, "id"), ok } }) });
    return ok ? "Courant revenu : salon ouvert" : "Signalé : pas de courant";
  });
}

// ── Appointments ────────────────────────────────────────────────────────

const STATUSES = ["requested", "confirmed", "done", "cancelled", "no_show"];

export async function setAppointmentStatus(_: Result, fd: FormData) {
  return run(async (ctx) => {
    const status = f(fd, "status");
    if (!STATUSES.includes(status)) throw new Error("Statut inconnu.");
    await patchRecord(ctx, "appointment", f(fd, "id"), (d) => ({ ...d, status }));
  });
}

// ── Services & prices ───────────────────────────────────────────────────

export async function saveService(_: Result, fd: FormData) {
  return run(async (ctx) => {
    const id = f(fd, "id");
    const name = f(fd, "name");
    if (!name) throw new Error("Nom de la prestation manquant.");
    const category = f(fd, "newCategory") || f(fd, "category") || "Services";
    const priceRaw = f(fd, "price");
    const fields: Raw = {
      price: priceRaw ? intOr(priceRaw, null) : null,
      currency: "FCFA",
      description: f(fd, "description"),
      durationMin: intOr(f(fd, "durationMin"), null),
      active: on(fd, "active"),
    };
    if (id) {
      const cur = await record(ctx, "service", id);
      await api(ctx, `/sasto/service/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: json({ name, data: { ...cur.data, ...fields }, metadata: { ...cur.metadata, category, popular: on(fd, "popular") } }),
      });
      return "Prestation modifiée";
    }
    await api(ctx, "/sasto/service", { method: "POST", body: json({ name, data: fields, metadata: { category, popular: on(fd, "popular") } }) });
    return "Prestation ajoutée";
  });
}

export async function toggleService(_: Result, fd: FormData) {
  return run(async (ctx) => {
    const active = on(fd, "active");
    await patchRecord(ctx, "service", f(fd, "id"), (d) => ({ ...d, active }));
    return active ? "Prestation affichée" : "Prestation masquée";
  });
}

export async function deleteService(_: Result, fd: FormData) {
  return run(async (ctx) => {
    await api(ctx, `/sasto/service/${encodeURIComponent(f(fd, "id"))}`, { method: "DELETE" });
    return "Prestation supprimée";
  });
}

// ── Team ────────────────────────────────────────────────────────────────

export async function saveMember(_: Result, fd: FormData) {
  return run(async (ctx) => {
    const id = f(fd, "id");
    const name = f(fd, "name");
    if (!name) throw new Error("Nom manquant.");
    const fields: Raw = {
      role: f(fd, "role"),
      bio: f(fd, "bio"),
      experience: f(fd, "experience"),
      specialties: f(fd, "specialties"),
      phone: f(fd, "phone"),
      active: on(fd, "active"),
    };
    const img = f(fd, "imageData");
    if (img) fields.image = await upload(ctx, img, "equipe");
    if (on(fd, "removeImage")) fields.image = "";
    if (id) {
      await patchRecord(ctx, "staff", id, (d) => ({ ...d, ...fields }), { name });
      return "Fiche modifiée";
    }
    await api(ctx, "/sasto/staff", { method: "POST", body: json({ name, data: { ...fields, available: true } }) });
    return "Membre ajouté";
  });
}

export async function setPresence(_: Result, fd: FormData) {
  return run(async (ctx) => {
    const available = on(fd, "available");
    await patchRecord(ctx, "staff", f(fd, "id"), (d) => ({
      ...d,
      available,
      awayReason: available ? "" : f(fd, "awayReason"),
      backOn: available ? "" : f(fd, "backOn"),
    }));
    return available ? "Présent aujourd'hui" : "Marqué absent";
  });
}

export async function deleteMember(_: Result, fd: FormData) {
  return run(async (ctx) => {
    await api(ctx, `/sasto/staff/${encodeURIComponent(f(fd, "id"))}`, { method: "DELETE" });
    return "Membre retiré";
  });
}

// ── Photos (store.metadata.gallery), logo, banner ───────────────────────

type Photo = { url: string; caption: string; category: string };

async function editGallery(ctx: DashContext, change: (g: Photo[]) => Photo[]) {
  const store = await getStore(ctx);
  const meta = obj(store.metadata);
  const gallery = arr(meta.gallery).map(obj).map((g) => ({ url: str(g.url), caption: str(g.caption), category: str(g.category) || "salon" }));
  await api(ctx, "", { method: "PATCH", body: json({ metadata: { ...meta, gallery: change(gallery).filter((g) => g.url) } }) });
}

export async function addPhoto(_: Result, fd: FormData) {
  return run(async (ctx) => {
    const url = await upload(ctx, f(fd, "imageData"), "photo");
    await editGallery(ctx, (g) => [{ url, caption: f(fd, "caption"), category: f(fd, "category") || "salon" }, ...g]);
    return "Photo ajoutée";
  });
}

export async function editPhoto(_: Result, fd: FormData) {
  return run(async (ctx) => {
    const url = f(fd, "url");
    const op = f(fd, "op");
    await editGallery(ctx, (g) => {
      const i = g.findIndex((p) => p.url === url);
      if (i < 0) throw new Error("Photo introuvable.");
      if (op === "delete") return g.filter((_, j) => j !== i);
      if (op === "up" || op === "down") {
        const j = op === "up" ? i - 1 : i + 1;
        if (j < 0 || j >= g.length) return g;
        const next = [...g];
        [next[i], next[j]] = [next[j], next[i]];
        return next;
      }
      return g.map((p, j) => (j === i ? { ...p, caption: f(fd, "caption"), category: f(fd, "category") || p.category } : p));
    });
    return op === "delete" ? "Photo retirée" : op === "up" || op === "down" ? "Ordre modifié" : "Photo modifiée";
  });
}

export async function setBrandImage(_: Result, fd: FormData) {
  return run(async (ctx) => {
    const which = f(fd, "which");
    const url = await upload(ctx, f(fd, "imageData"), which === "logo" ? "logo" : "banniere");
    if (which === "logo") {
      await api(ctx, "", { method: "PATCH", body: json({ logoUrl: url }) });
      return "Logo changé";
    }
    await api(ctx, "", { method: "PATCH", body: json({ bannerUrl: url }) });
    await api(ctx, "/showcase", { method: "PATCH", body: json({ heroImageUrl: url }) });
    return "Photo d'accueil changée";
  });
}

// ── Salon: info, hours, payments, socials, extras, FAQ ──────────────────

export async function saveInfo(_: Result, fd: FormData) {
  return run(async (ctx) => {
    const name = f(fd, "name");
    if (!name) throw new Error("Nom du salon manquant.");
    await api(ctx, "", {
      method: "PATCH",
      body: json({
        name,
        phone: f(fd, "phone") || null,
        whatsapp: f(fd, "whatsapp") || null,
        email: f(fd, "email") || null,
        address: f(fd, "address") || null,
        city: f(fd, "city") || null,
        description: f(fd, "description") || null,
      }),
    });
    await api(ctx, "/showcase", { method: "PATCH", body: json({ heroSubtitle: f(fd, "heroSubtitle") || null, aboutMarkdown: f(fd, "aboutMarkdown") }) });
  });
}

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export async function saveHours(_: Result, fd: FormData) {
  return run(async (ctx) => {
    const { profile } = await getProfile(ctx);
    const hours = obj(profile.hours);
    const days: Record<string, { from: string; to: string }[]> = {};
    for (const d of DAYS) {
      if (!on(fd, `${d}_open`)) {
        days[d] = [];
        continue;
      }
      const slots = [1, 2]
        .map((n) => ({ from: f(fd, `${d}_from${n}`), to: f(fd, `${d}_to${n}`) }))
        .filter((s) => HHMM.test(s.from) && HHMM.test(s.to));
      if (!slots.length) throw new Error("Heures manquantes pour un jour ouvert.");
      if (slots.some((s) => s.from >= s.to)) throw new Error("L'heure de fermeture doit être après l'ouverture.");
      days[d] = slots;
    }
    await api(ctx, "/profile", { method: "PUT", body: json({ hours: { ...hours, days, note: f(fd, "note") || undefined } }) });
    return "Horaires enregistrés";
  });
}

export async function editException(_: Result, fd: FormData) {
  return run(async (ctx) => {
    const { profile } = await getProfile(ctx);
    const hours = obj(profile.hours);
    const date = f(fd, "date");
    let list = arr(hours.exceptions).map(obj).filter((e) => str(e.date) !== date);
    if (f(fd, "op") !== "delete") {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Date invalide.");
      const closed = f(fd, "kind") !== "special";
      const slot = { from: f(fd, "from"), to: f(fd, "to") };
      if (!closed && !(HHMM.test(slot.from) && HHMM.test(slot.to) && slot.from < slot.to)) throw new Error("Heures spéciales invalides.");
      list = [...list, { date, closed, ...(closed ? {} : { slots: [slot] }), ...(f(fd, "note") ? { note: f(fd, "note").slice(0, 120) } : {}) }];
    }
    const today = new Date(Date.now() + 3600e3).toISOString().slice(0, 10);
    list = list.filter((e) => str(e.date) >= today).sort((a, b) => str(a.date).localeCompare(str(b.date)));
    await api(ctx, "/profile", { method: "PUT", body: json({ hours: { days: obj(hours.days), ...hours, exceptions: list } }) });
    return f(fd, "op") === "delete" ? "Jour retiré" : "Jour spécial ajouté";
  });
}

const PAYMENT_LIST = ["cash", "mtn_momo", "orange_money", "card", "bank_transfer", "other"];

export async function savePayments(_: Result, fd: FormData) {
  return run(async (ctx) => {
    const { profile } = await getProfile(ctx);
    const payments = obj(profile.payments);
    const methods = PAYMENT_LIST.filter((id) => on(fd, `${id}_on`)).map((id) => {
      const details = f(fd, `${id}_details`).slice(0, 200);
      const label = id === "other" ? f(fd, "other_label").slice(0, 60) : "";
      return { id, ...(details ? { details } : {}), ...(label ? { label } : {}) };
    });
    await api(ctx, "/profile", { method: "PUT", body: json({ payments: methods.length ? { ...payments, methods } : null }) });
    return "Paiements enregistrés";
  });
}

const SOCIALS = ["instagram", "facebook", "tiktok", "youtube", "x", "telegram"];

function socialUrl(id: string, v: string) {
  const s = v.trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s) || /\.[a-z]{2,}\//i.test(s)) return s;
  const handle = s.replace(/^@/, "");
  const base: Record<string, string> = {
    instagram: "https://instagram.com/",
    tiktok: "https://www.tiktok.com/@",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/@",
    x: "https://x.com/",
    telegram: "https://t.me/",
  };
  return (base[id] ?? "https://") + handle;
}

export async function saveSocials(_: Result, fd: FormData) {
  return run(async (ctx) => {
    const sc = await getShowcase(ctx);
    const design = obj(sc.design);
    const socials: Raw = { ...obj(design.socials) };
    for (const id of SOCIALS) {
      const url = socialUrl(id, f(fd, id));
      if (url) socials[id] = url;
      else delete socials[id];
    }
    await api(ctx, "/showcase", { method: "PATCH", body: json({ design: { ...design, socials } }) });
    return "Réseaux enregistrés";
  });
}

export async function saveExtras(_: Result, fd: FormData) {
  return run(async (ctx) => {
    const store = await getStore(ctx);
    const extras = f(fd, "extras")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 12);
    await api(ctx, "", { method: "PATCH", body: json({ metadata: { ...obj(store.metadata), extras } }) });
    return "Sur place : enregistré";
  });
}

export async function saveFaq(_: Result, fd: FormData) {
  return run(async (ctx) => {
    const qs = fd.getAll("q").map(str);
    const as = fd.getAll("a").map(str);
    const faq = qs.map((q, i) => ({ q: q.slice(0, 200), a: (as[i] ?? "").slice(0, 1200) })).filter((x) => x.q && x.a);
    await api(ctx, "/profile", { method: "PUT", body: json({ faq: faq.length ? faq : null }) });
    return "Questions enregistrées";
  });
}

// ── Messages ────────────────────────────────────────────────────────────

export async function markMessage(_: Result, fd: FormData) {
  return run(async (ctx) => {
    const isDone = on(fd, "done");
    await patchRecord(ctx, "feedback", f(fd, "id"), (d) => ({ ...d, status: isDone ? "done" : "new" }));
    return isDone ? "Marqué traité" : "Remis à traiter";
  });
}
