"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/services", label: "Services & prix" },
  { href: "/equipe", label: "Équipe" },
  { href: "/galerie", label: "Galerie" },
  { href: "/contact", label: "Infos & contact" },
];

export function Navigation({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl || "/logo.png"} alt="" width={36} height={36} className="h-9 w-9 shrink-0 rounded-full border border-border bg-white object-contain" />
          <span className="truncate text-[15px] font-semibold">{name}</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors ${path.startsWith(l.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/reservation" className="btn-dark h-10 px-4">
            Réserver
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link href="/reservation" className="btn-dark h-9 px-4 text-[13px]">
            Réserver
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="h-[calc(100dvh-4rem)] border-t border-border bg-background md:hidden">
          <nav className="wrap flex flex-col py-4">
            {[{ href: "/", label: "Accueil" }, ...navLinks, { href: "/reservation", label: "Réserver un rendez-vous" }].map((l) => (
              <Link key={l.href} href={l.href} className="border-b border-border py-4 text-lg">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
