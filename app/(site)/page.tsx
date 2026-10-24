import Link from "next/link";
import { ArrowRight, Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { getSite } from "@/lib/sss";
import { telUrl } from "@/lib/config";
import { StatusPill } from "@/components/status-bar";
import { ContactList, Extras, HoursTable, MapCard, PaymentList, SectionHead, ServiceMenu, Socials, TeamGrid, mapsUrl, place, waLink } from "@/components/info";
import { AskButton } from "@/components/ask-button";

export default async function HomePage() {
  const site = await getSite();
  const wa = waLink(site, `Bonjour ${site.name}, je voudrais un renseignement.`);
  const hero = site.bannerUrl ?? site.gallery[0]?.url ?? "/men-haircut.jpg";
  const photos = site.gallery.slice(0, 6);
  const shortHours = site.hoursText.replace("Tous les jours : ", "Tous les jours, ");

  return (
    <>
      {/* Hero: who, where, open or not, how to come */}
      <section className="wrap grid items-center gap-8 pb-12 pt-8 sm:pt-14 md:grid-cols-[1.05fr_1fr] md:gap-12 md:pb-20">
        <div className="space-y-6">
          <StatusPill status={site.status} />
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">{site.name}</h1>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">{site.heroSubtitle}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={mapsUrl(site)} target="_blank" rel="noopener noreferrer" className="btn-dark">
              Itinéraire <ArrowRight className="h-4 w-4" />
            </a>
            {wa ? (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-wa">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            ) : null}
            {site.phone ? (
              <a href={telUrl(site.phone) ?? undefined} className="btn-line">
                <Phone className="h-4 w-4" /> Appeler
              </a>
            ) : null}
          </div>
          <dl className="grid gap-3 border-t border-border pt-5 text-sm sm:grid-cols-2">
            <div className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={mapsUrl(site)} target="_blank" rel="noopener noreferrer" className="link">
                {place(site)}
              </a>
            </div>
            <div className="flex gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>{shortHours}</span>
            </div>
          </dl>
        </div>
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero} alt={`${site.name}, le salon`} className="aspect-[4/3] w-full rounded-3xl object-cover md:aspect-[4/5]" />
        </div>
      </section>

      {/* Services & prices */}
      <section className="border-t border-border bg-card py-14 sm:py-20">
        <div className="wrap">
          <SectionHead eyebrow="Tarifs" title="Services & prix" action={{ href: "/services", label: "Détails" }} />
          <ServiceMenu categories={site.categories} />
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <Extras site={site} />
            <Link href="/#infos" className="btn-dark">
              Venir au salon
            </Link>
          </div>
        </div>
      </section>

      {/* Team */}
      {site.team.length ? (
        <section className="py-14 sm:py-20">
          <div className="wrap">
            <SectionHead eyebrow="L'équipe" title="Vos barbiers" action={{ href: "/equipe", label: "Voir l'équipe" }} />
            <TeamGrid team={site.team} />
          </div>
        </section>
      ) : null}

      {/* Gallery */}
      {photos.length ? (
        <section className="border-t border-border py-14 sm:py-20">
          <div className="wrap">
            <SectionHead eyebrow="Réalisations" title="Le travail du salon" action={{ href: "/galerie", label: `Tout voir (${site.gallery.length})` }} />
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3">
              {photos.map((p) => (
                <Link key={p.url} href="/galerie" className="group overflow-hidden rounded-2xl bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.caption || site.name} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Visit: everything practical in one place */}
      <section id="infos" className="scroll-mt-20 border-t border-border bg-card py-14 sm:py-20">
        <div className="wrap">
          <SectionHead eyebrow="Infos pratiques" title="Venir au salon" />
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr_1.2fr]">
            <div>
              <h3 className="mb-3 text-sm font-semibold">Horaires</h3>
              <HoursTable site={site} />
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="mb-3 text-sm font-semibold">Contact</h3>
                <ContactList site={site} />
              </div>
              {site.paymentMethods.length ? (
                <div>
                  <h3 className="mb-3 text-sm font-semibold">Paiement</h3>
                  <PaymentList site={site} />
                </div>
              ) : null}
              <Socials site={site} />
            </div>
            <MapCard site={site} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      {site.faq.length ? (
        <section className="py-14 sm:py-20">
          <div className="wrap max-w-3xl">
            <SectionHead eyebrow="Questions" title="Bon à savoir" />
            <div className="divide-y divide-border border-y border-border">
              {site.faq.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                    {f.q}
                    <span className="text-xl leading-none text-muted-foreground transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="pt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
            {site.assistant ? (
              <p className="mt-6 text-sm text-muted-foreground">
                Une autre question ?{" "}
                <AskButton className="link text-foreground">Demandez à notre assistant</AskButton>
                {wa ? (
                  <>
                    {" "}ou{" "}
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="link text-foreground">
                      écrivez-nous sur WhatsApp
                    </a>
                  </>
                ) : null}
                .
              </p>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  );
}
