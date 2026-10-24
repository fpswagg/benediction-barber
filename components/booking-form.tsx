"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Scissors, MessageCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { ServiceCategory, TeamMember } from "@/lib/site";
import { whatsappUrl } from "@/lib/config";

type Slot = { time: string; free: boolean };
type SlotsResp = { durationMin: number; closedReason: string | null; slots: Slot[] };
type Booked = { reference: string; staff: string | null; date: string; time: string };

const pad = (n: number) => String(n).padStart(2, "0");
const isoDay = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const frDay = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

const closedText: Record<string, string> = {
  closed: "Le salon est fermé ce jour-là.",
  past: "Ce jour est passé.",
  staff_away: "Ce barbier est absent ce jour-là. Choisissez « Peu importe » ou un autre barbier.",
  nobody_available: "Personne n'est disponible ce jour-là. Choisissez un autre jour.",
};

const selectCls =
  "w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export function BookingForm({ categories, team, whatsapp }: { categories: ServiceCategory[]; team: TeamMember[]; whatsapp: string | null }) {
  const params = useSearchParams();
  const services = useMemo(
    () => categories.flatMap((c) => c.services.map((s) => ({ ...s, category: c.name }))),
    [categories]
  );
  const pre = (key: string, list: { id: string }[]) => {
    const v = params.get(key);
    return v && list.some((x) => x.id === v) ? v : "";
  };

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: isoDay(new Date()),
    time: "",
    service: pre("service", services),
    barber: pre("barber", team),
    notes: "",
    website: "",
  });
  const [slots, setSlots] = useState<SlotsResp | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booked, setBooked] = useState<Booked | null>(null);
  const top = useRef<HTMLDivElement>(null);

  const service = services.find((s) => s.id === form.service);
  const barber = team.find((m) => m.id === form.barber);

  useEffect(() => {
    if (!form.date) return;
    const ctrl = new AbortController();
    const q = new URLSearchParams({ date: form.date });
    if (barber) q.set("staff", barber.name);
    if (service) q.set("service", service.name);
    setLoadingSlots(true);
    fetch(`/api/slots?${q}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((b: { data?: SlotsResp; error?: string }) => {
        setSlots(b.data ?? { durationMin: 60, closedReason: null, slots: [] });
        setForm((f) => (b.data?.slots.some((s) => s.time === f.time && s.free) ? f : { ...f, time: "" }));
      })
      .catch(() => undefined)
      .finally(() => setLoadingSlots(false));
    return () => ctrl.abort();
  }, [form.date, barber?.name, service?.name]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.time) return setError("Choisissez une heure.");
    setSending(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          service: service?.name,
          staff: barber?.name,
          date: form.date,
          time: form.time,
          notes: form.notes,
          website: form.website,
        }),
      });
      const body = (await res.json().catch(() => null)) as { data?: Booked; error?: string } | null;
      if (!res.ok || !body?.data) throw new Error(body?.error || "Réservation impossible. Réessayez.");
      setBooked(body.data);
      requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Réservation impossible. Réessayez.");
    } finally {
      setSending(false);
    }
  };

  if (booked) {
    const wa = whatsappUrl(
      whatsapp,
      `Bonjour Bénédiction Barber, je viens de demander un rendez-vous (réf. ${booked.reference}) le ${frDay(booked.date)} à ${booked.time}${service ? ` pour ${service.name}` : ""}${booked.staff ? ` avec ${booked.staff}` : ""}. Nom : ${form.name}.`
    );
    return (
      <div ref={top} className="scroll-mt-24">
      <Card className="max-w-2xl mx-auto rounded-2xl">
        <CardContent className="p-8 md:p-12 text-center space-y-6">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Demande envoyée</h2>
            <p className="text-muted-foreground">
              {frDay(booked.date)} à {booked.time}
              {booked.staff ? ` avec ${booked.staff}` : ""}
              {service ? ` · ${service.name}` : ""}
            </p>
            <p className="text-sm">
              Référence : <span className="font-mono font-semibold">{booked.reference}</span>
            </p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            L&apos;équipe confirme votre rendez-vous au {form.phone}. Pour aller plus vite, envoyez-nous un message sur WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {wa ? (
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                <a href={wa} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Confirmer sur WhatsApp
                </a>
              </Button>
            ) : null}
            <Button
              size="lg"
              variant="outline"
              className="uppercase tracking-wide"
              onClick={() => {
                setBooked(null);
                setForm((f) => ({ ...f, time: "", notes: "" }));
              }}
            >
              Autre rendez-vous
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    );
  }

  const free = slots?.slots.filter((s) => s.free) ?? [];
  return (
    <div ref={top} className="scroll-mt-24">
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Votre rendez-vous</CardTitle>
        <CardDescription>Prestation, barbier, puis un créneau libre.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Scissors className="h-5 w-5" />
              Prestation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="service" className="text-sm font-medium">Service</label>
                <select id="service" value={form.service} onChange={set("service")} className={selectCls}>
                  <option value="">Je choisirai au salon</option>
                  {categories.map((c) => (
                    <optgroup key={c.id} label={c.name}>
                      {c.services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                          {s.price ? ` · ${s.price.toLocaleString("fr-FR")} ${s.currency}` : ""}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="barber" className="text-sm font-medium">Barbier</label>
                <select id="barber" value={form.barber} onChange={set("barber")} className={selectCls}>
                  <option value="">Peu importe</option>
                  {team.map((m) => (
                    <option key={m.id} value={m.id} disabled={!m.available}>
                      {m.name}
                      {m.available ? "" : " (absent)"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Date et heure
            </h3>
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">Jour *</label>
              <Input id="date" type="date" min={isoDay(new Date())} value={form.date} onChange={set("date")} required className="max-w-xs" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" /> Heure *
                {loadingSlots ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : null}
              </p>
              {slots && !loadingSlots && slots.closedReason ? (
                <p className="text-sm text-muted-foreground">{closedText[slots.closedReason] ?? "Aucun créneau ce jour-là."}</p>
              ) : slots && !loadingSlots && !free.length ? (
                <p className="text-sm text-muted-foreground">Plus de créneau libre ce jour-là. Essayez le lendemain.</p>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {(slots?.slots ?? []).map((s) => (
                    <button
                      key={s.time}
                      type="button"
                      disabled={!s.free}
                      onClick={() => setForm({ ...form, time: s.time })}
                      className={`h-10 rounded-md border text-sm font-medium transition-colors ${
                        form.time === s.time
                          ? "bg-primary text-primary-foreground border-primary"
                          : s.free
                            ? "border-border hover:border-foreground"
                            : "border-border text-muted-foreground/50 line-through cursor-not-allowed"
                      }`}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Vos coordonnées
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nom complet *</label>
                <Input id="name" placeholder="Votre nom" value={form.name} onChange={set("name")} required maxLength={160} />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Téléphone / WhatsApp *</label>
                <Input id="phone" type="tel" inputMode="tel" placeholder="6XX XX XX XX" value={form.phone} onChange={set("phone")} required maxLength={40} />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" type="email" placeholder="votre@email.com" value={form.email} onChange={set("email")} maxLength={160} />
            </div>
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">Remarques</label>
              <Textarea id="notes" placeholder="Une précision sur la coupe, une photo de référence à montrer…" rows={3} value={form.notes} onChange={set("notes")} maxLength={2000} />
            </div>
            <input type="text" name="website" value={form.website} onChange={set("website")} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" size="lg" disabled={sending} className="w-full">
            {sending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Calendar className="mr-2 h-5 w-5" />}
            {sending ? "Envoi…" : form.time ? `Réserver ${frDay(form.date)} à ${form.time}` : "Réserver"}
          </Button>
        </form>
      </CardContent>
    </Card>
    </div>
  );
}
