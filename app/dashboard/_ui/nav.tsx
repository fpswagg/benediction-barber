"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Images, Inbox, LayoutDashboard, Scissors, Store, Users } from "lucide-react";

const LINKS = [
  { href: "/dashboard", label: "Aujourd'hui", icon: LayoutDashboard },
  { href: "/dashboard/services", label: "Services & prix", icon: Scissors },
  { href: "/dashboard/equipe", label: "Équipe", icon: Users },
  { href: "/dashboard/photos", label: "Photos", icon: Images },
  { href: "/dashboard/salon", label: "Infos du salon", icon: Store },
  { href: "/dashboard/messages", label: "Messages", icon: Inbox },
];

export function DashNav({ counts = {} }: { counts?: Record<string, number> }) {
  const path = usePathname();
  const active = (href: string) => (href === "/dashboard" ? path === href : path.startsWith(href));
  return (
    <nav className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const n = counts[href] ?? 0;
        return (
          <Link
            key={href}
            href={href}
            className={`flex shrink-0 items-center gap-2.5 rounded-full px-3.5 py-2 text-sm whitespace-nowrap transition lg:rounded-xl ${
              active(href) ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="size-4" />
            {label}
            {n > 0 && (
              <span className={`ml-auto rounded-full px-1.5 text-xs font-semibold ${active(href) ? "bg-background text-foreground" : "bg-gold text-white"}`}>{n}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
