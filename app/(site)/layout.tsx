import type React from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Assistant } from "@/components/assistant";
import { getSite } from "@/lib/sss";
import { SSS_API_URL } from "@/lib/config";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  return (
    <>
      <Navigation name={site.name} logoUrl={site.logoUrl} />
      <main className="min-h-[70vh] pt-16">{children}</main>
      <Footer site={site} />
      {site.assistant ? <Assistant apiUrl={SSS_API_URL} assistant={site.assistant} /> : null}
    </>
  );
}
