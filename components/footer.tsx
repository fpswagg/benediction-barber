import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import type { Site } from "@/lib/site";
import { telUrl, whatsappUrl } from "@/lib/config";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/equipe", label: "Équipe" },
  { href: "/galerie", label: "Galerie" },
  { href: "/reservation", label: "Réservation" },
  { href: "/contact", label: "Contact" },
];

export function Footer({ site }: { site: Site }) {
  const place = [site.address, `${site.city}, ${site.country}`].filter(Boolean).join(" — ");
  const wa = whatsappUrl(site.whatsapp, "Bonjour Bénédiction Barber !");
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-bebas text-2xl tracking-wider">{site.name.toUpperCase()}</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Votre barbershop à {site.city}. Coupes, nattes, barbe et soins{site.extras.length ? `, avec ${site.extras.join(", ").toLowerCase()} sur place` : ""}.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold uppercase tracking-wide text-sm">Navigation</h4>
            <ul className="space-y-2">
              {links.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold uppercase tracking-wide text-sm">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{place}</span>
              </li>
              {site.phone ? (
                <li className="flex items-center gap-2 text-sm text-primary-foreground/80">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <a href={telUrl(site.phone) ?? undefined} className="hover:text-primary-foreground">{site.phone}</a>
                </li>
              ) : null}
              {wa ? (
                <li className="flex items-center gap-2 text-sm text-primary-foreground/80">
                  <MessageCircle className="h-4 w-4 flex-shrink-0" />
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground">WhatsApp</a>
                </li>
              ) : null}
              {site.email ? (
                <li className="flex items-center gap-2 text-sm text-primary-foreground/80">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <a href={`mailto:${site.email}`} className="hover:text-primary-foreground">{site.email}</a>
                </li>
              ) : null}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold uppercase tracking-wide text-sm">Horaires</h4>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">{site.hoursText}</p>
            {site.payments.length ? (
              <p className="text-xs text-primary-foreground/60 leading-relaxed">Paiement : {site.payments.join(", ")}</p>
            ) : null}
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} {site.name}. Tous droits réservés. | {site.city}, {site.country}
          </p>
        </div>
      </div>
    </footer>
  );
}
