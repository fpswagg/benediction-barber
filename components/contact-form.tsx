"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Send } from "lucide-react";

/** Message to the salon: lands in SSS (Retours) and the team is notified. */
export function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "", website: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setState("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) throw new Error(body?.error || "Envoi impossible. Réessayez.");
      setState("sent");
      setForm({ name: "", phone: "", email: "", message: "", website: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Envoi impossible. Réessayez.");
      setState("idle");
    }
  };

  if (state === "sent") {
    return (
      <div className="py-10 text-center space-y-4">
        <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
        <p className="text-xl font-semibold">Message envoyé</p>
        <p className="text-sm text-muted-foreground">Merci ! L&apos;équipe vous répond au plus vite.</p>
        <Button variant="outline" onClick={() => setState("idle")}>
          Nouveau message
        </Button>
      </div>
    );
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });
  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Nom complet *</label>
        <Input id="name" placeholder="Votre nom" value={form.name} onChange={set("name")} required maxLength={160} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">Téléphone / WhatsApp *</label>
          <Input id="phone" type="tel" inputMode="tel" placeholder="6XX XX XX XX" value={form.phone} onChange={set("phone")} required maxLength={40} />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input id="email" type="email" placeholder="votre@email.com" value={form.email} onChange={set("email")} maxLength={160} />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">Message *</label>
        <Textarea id="message" placeholder="Votre message…" rows={5} value={form.message} onChange={set("message")} required maxLength={4000} />
      </div>
      <input type="text" name="website" value={form.website} onChange={set("website")} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" size="lg" disabled={state === "sending"} className="w-full group">
        <Send className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        {state === "sending" ? "Envoi…" : "Envoyer le message"}
      </Button>
    </form>
  );
}
