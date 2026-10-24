import Link from "next/link";
import { CalendarDays, MessageCircle, Phone } from "lucide-react";
import type { Site } from "@/lib/site";
import { telUrl } from "@/lib/config";
import { Socials, mapsUrl, place, waLink } from "@/components/info";

const links = [
  { href: "/services", label: "Services & prix" },
  { href: "/equipe", label: "Équipe" },
  { href: "/galerie", label: "Galerie" },
  { href: "/reservation", label: "Réservation" },
  { href: "/contact", label: "Infos & contact" },
];

export function Footer({ site }: { site: Site }) {
  const wa = waLink(site);
  return (
    <>
      <footer className="border-t border-border pb-24 pt-12 md:pb-10">
        <div className="wrap grid gap-8 text-sm sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-3">
            <p className="text-base font-semibold">{site.name}</p>
            <p className="max-w-xs leading-relaxed text-muted-foreground">
              Barbershop à{" "}
              <a href={mapsUrl(site)} target="_blank" rel="noopener noreferrer" className="link">
                {place(site)}
              </a>
              . {site.hoursText}.
            </p>
            <Socials site={site} />
          </div>
          <nav className="grid grid-cols-2 content-start gap-2 sm:grid-cols-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-muted-foreground hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="space-y-2 text-muted-foreground">
            {site.phone ? (
              <a href={telUrl(site.phone) ?? undefined} className="block hover:text-foreground">
                {site.phone}
              </a>
            ) : null}
            {site.email ? (
              <a href={`mailto:${site.email}`} className="block break-all hover:text-foreground">
                {site.email}
              </a>
            ) : null}
            {site.payments.length ? <p>Paiement : {site.payments.join(", ")}</p> : null}
          </div>
        </div>
        <div className="wrap mt-10 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {site.name} · {site.city}, {site.country}
          </p>
          <Link href="/dashboard" className="hover:text-foreground">
            Espace gérant
          </Link>
        </div>
      </footer>

      {/* Mobile: the three ways to book, always at hand */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md gap-2">
          <Link href="/reservation" className="btn-dark h-11 flex-1">
            <CalendarDays className="h-4 w-4" /> Réserver
          </Link>
          {wa ? (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-wa h-11 flex-1">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          ) : null}
          {site.phone ? (
            <a href={telUrl(site.phone) ?? undefined} className="btn-line h-11 w-11 shrink-0 px-0" aria-label="Appeler">
              <Phone className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      </div>
    </>
  );
}
