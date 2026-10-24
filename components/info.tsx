import type React from "react";
import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone, Wallet } from "lucide-react";
import type { ServiceCategory, Site, TeamMember } from "@/lib/site";
import { telUrl, whatsappUrl } from "@/lib/config";
import { doualaToday, duration, frDate, hh, initials, price } from "@/lib/format";

/** Building blocks of the public pages: everything a client needs, written plainly. */

export const place = (site: Site) => [site.address, site.city].filter(Boolean).join(", ");
export const mapsUrl = (site: Site) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([site.address, site.city, site.country].filter(Boolean).join(", "))}`;
export const waLink = (site: Site, text = `Bonjour ${site.name} !`) => whatsappUrl(site.whatsapp, text);

export function SectionHead({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: { href: string; label: string } }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
      <div>
        {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
        <h2 className="section-title">{title}</h2>
      </div>
      {action ? (
        <Link href={action.href} className="shrink-0 text-sm link">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

export function HoursTable({ site }: { site: Site }) {
  const today = doualaToday().key;
  return (
    <div className="space-y-3">
      <ul className="divide-y divide-border text-sm">
        {site.hours.map((d) => (
          <li key={d.key} className={`flex justify-between gap-4 py-2 ${d.key === today ? "font-semibold" : ""}`}>
            <span>
              {d.label}
              {d.key === today ? <span className="ml-2 text-xs font-normal text-gold">aujourd&apos;hui</span> : null}
            </span>
            <span className={d.slots.length ? "" : "text-muted-foreground"}>
              {d.slots.length ? d.slots.map((s) => `${hh(s.from)} – ${hh(s.to)}`).join(", ") : "Fermé"}
            </span>
          </li>
        ))}
      </ul>
      {site.exceptions.length ? (
        <div className="rounded-lg bg-gold-soft px-3 py-2 text-sm">
          {site.exceptions.map((e) => (
            <p key={e.date}>
              <span className="font-medium first-letter:uppercase">{frDate(e.date)}</span> : {e.closed ? "fermé" : "horaires modifiés"}
              {e.note ? ` (${e.note})` : ""}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ContactList({ site }: { site: Site }) {
  const wa = waLink(site);
  return (
    <ul className="space-y-3 text-sm">
      <li className="flex gap-3">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <a href={mapsUrl(site)} target="_blank" rel="noopener noreferrer" className="link">
          {place(site)}
          {site.country ? `, ${site.country}` : ""}
        </a>
      </li>
      {site.phone ? (
        <li className="flex gap-3">
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <a href={telUrl(site.phone) ?? undefined} className="link">
            {site.phone}
          </a>
        </li>
      ) : null}
      {wa ? (
        <li className="flex gap-3">
          <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <a href={wa} target="_blank" rel="noopener noreferrer" className="link">
            WhatsApp{site.whatsapp && site.whatsapp !== site.phone ? ` · ${site.whatsapp}` : ""}
          </a>
        </li>
      ) : null}
      {site.email ? (
        <li className="flex gap-3">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <a href={`mailto:${site.email}`} className="link break-all">
            {site.email}
          </a>
        </li>
      ) : null}
    </ul>
  );
}

export function PaymentList({ site }: { site: Site }) {
  if (!site.paymentMethods.length) return null;
  return (
    <ul className="space-y-2 text-sm">
      {site.paymentMethods.map((m) => (
        <li key={m.id + m.label} className="flex gap-3">
          <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <span>
            {m.label}
            {m.details ? <span className="font-medium"> · {m.details}</span> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Socials({ site, className = "" }: { site: Site; className?: string }) {
  if (!site.socials.length) return null;
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {site.socials.map((s) => (
        <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border bg-card px-3 py-1.5 text-xs hover:border-foreground">
          {s.label}
        </a>
      ))}
    </div>
  );
}

export function Extras({ site }: { site: Site }) {
  if (!site.extras.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-muted-foreground">Sur place :</span>
      {site.extras.map((x) => (
        <span key={x} className="rounded-full bg-muted px-3 py-1">
          {x}
        </span>
      ))}
    </div>
  );
}

export function MapCard({ site }: { site: Site }) {
  const q = encodeURIComponent([site.address, site.city, site.country].filter(Boolean).join(", "));
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-muted">
      <iframe
        title={`Plan : ${place(site)}`}
        src={`https://maps.google.com/maps?q=${q}&z=15&output=embed`}
        className="block h-64 w-full sm:h-full sm:min-h-72"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

/** The price list: one line per service (name, duration, price), grouped by category. */
export function ServiceMenu({ categories, details = false }: { categories: ServiceCategory[]; details?: boolean }) {
  return (
    <div className={`grid gap-x-12 gap-y-10 ${details ? "" : "md:grid-cols-2"}`}>
      {categories.map((c) => (
        <section key={c.id} id={c.id} className="scroll-mt-24">
          <h3 className="mb-1 text-lg font-semibold">{c.name}</h3>
          {details && c.description ? <p className="mb-2 text-sm text-muted-foreground">{c.description}</p> : null}
          <ul className="divide-y divide-border">
            {c.services.map((s) => (
              <li key={s.id} className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="text-[15px]">
                    {s.name}
                    {s.popular ? <span className="ml-2 rounded-full bg-gold-soft px-2 py-0.5 text-[11px] font-medium text-gold align-middle">Populaire</span> : null}
                  </p>
                  {details && s.description ? <p className="mt-0.5 text-sm text-muted-foreground">{s.description}</p> : null}
                  {s.duration ? <p className="mt-0.5 text-xs text-muted-foreground">{duration(s.duration)}</p> : null}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-[15px] font-semibold tabular-nums">{price(s.price, s.currency)}</span>
                  {details ? (
                    <Link href={`/reservation?service=${encodeURIComponent(s.id)}`} className="text-xs link">
                      Réserver
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function Avatar({ m, size = "h-16 w-16" }: { m: TeamMember; size?: string }) {
  return m.imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={m.imageUrl} alt={m.name} className={`${size} shrink-0 rounded-full object-cover`} />
  ) : (
    <span className={`${size} flex shrink-0 items-center justify-center rounded-full bg-muted text-base font-semibold text-muted-foreground`}>{initials(m.name)}</span>
  );
}

export function Availability({ m }: { m: TeamMember }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={`h-1.5 w-1.5 rounded-full ${m.available ? "bg-ok" : "bg-destructive"}`} />
      {m.available ? "Disponible" : `Absent${m.backOn ? ` · retour le ${frDate(m.backOn, { day: "numeric", month: "long" })}` : ""}`}
    </span>
  );
}

export function TeamGrid({ team, details = false }: { team: TeamMember[]; details?: boolean }) {
  return (
    <div className={`grid gap-4 ${details ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
      {team.map((m) => (
        <article key={m.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
          <Avatar m={m} size={details ? "h-20 w-20" : "h-14 w-14"} />
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="font-semibold leading-tight">{m.name}</h3>
            <p className="text-sm text-muted-foreground">
              {m.role}
              {m.experience ? ` · ${m.experience}` : ""}
            </p>
            <Availability m={m} />
            {details && m.bio ? <p className="pt-1 text-sm leading-relaxed">{m.bio}</p> : null}
            {m.specialties.length ? (
              <p className="pt-1 text-xs text-muted-foreground">{m.specialties.join(" · ")}</p>
            ) : null}
            {details ? (
              <Link href={`/reservation?barber=${encodeURIComponent(m.id)}`} className="inline-block pt-2 text-sm link">
                Réserver avec {m.name.split(" ")[0]}
              </Link>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

export function PageHead({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <section className="wrap pb-8 pt-10 sm:pb-12 sm:pt-16">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h1 className="text-3xl font-semibold sm:text-5xl">{title}</h1>
      {children ? <div className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{children}</div> : null}
    </section>
  );
}
