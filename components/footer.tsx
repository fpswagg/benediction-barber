import Link from "next/link";
import { Facebook, Instagram, MapPin, Phone, Mail } from "lucide-react";
import {
  PUBLIC_ADDRESS_CITY_COUNTRY,
  PUBLIC_PHONE_PRIMARY,
  PUBLIC_EMAIL_PRIMARY,
  PUBLIC_BUSINESS_NAME,
  PUBLIC_HOURS
} from "@/lib/config";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-bebas text-2xl tracking-wider">
              {PUBLIC_BUSINESS_NAME.toUpperCase()}
            </h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Votre salon de coiffure urbain à Yaoundé. Excellence et style
              depuis toujours.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-semibold uppercase tracking-wide text-sm">
              Navigation
            </h4>
            <ul className="space-y-2">
              {["Accueil", "Services", "Équipe", "Galerie", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href={`/${
                        item.toLowerCase() === "accueil"
                          ? ""
                          : item.toLowerCase()
                      }`}
                      className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold uppercase tracking-wide text-sm">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{PUBLIC_ADDRESS_CITY_COUNTRY}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>{PUBLIC_PHONE_PRIMARY}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>{PUBLIC_EMAIL_PRIMARY}</span>
              </li>
            </ul>
          </div>

          {/* Horaires & Social */}
          <div className="space-y-4">
            <h4 className="font-semibold uppercase tracking-wide text-sm">
              Horaires
            </h4>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
                {PUBLIC_HOURS}
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} {PUBLIC_BUSINESS_NAME}. Tous droits
            réservés. | {PUBLIC_ADDRESS_CITY_COUNTRY}
          </p>
        </div>
      </div>
    </footer>
  );
}
