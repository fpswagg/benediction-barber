import Link from "next/link";
import { getSite } from "@/lib/sss";
import { Extras, PageHead, ServiceMenu } from "@/components/info";
import { AskButton } from "@/components/ask-button";

export const revalidate = 60;

export const metadata = {
  title: "Services & prix | Bénédiction Barber Yaoundé",
  description: "Coupes, dégradés, nattes, barbe et soins : tous les prix et durées de Bénédiction Barber à Biyem-Assi, Yaoundé.",
};

export default async function ServicesPage() {
  const site = await getSite();
  return (
    <>
      <PageHead eyebrow="Tarifs" title="Services & prix">
        Tous nos prix, sans surprise. La durée est indicative.
      </PageHead>
      {site.categories.length > 1 ? (
        <nav className="wrap -mt-2 mb-8 flex gap-2 overflow-x-auto pb-1">
          {site.categories.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="shrink-0 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm hover:border-foreground">
              {c.name}
            </a>
          ))}
        </nav>
      ) : null}
      <div className="wrap max-w-3xl pb-16">
        <ServiceMenu categories={site.categories} details />
        <div className="mt-12 space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <Extras site={site} />
          {site.payments.length ? <p className="text-sm text-muted-foreground">Paiement : {site.payments.join(", ")}.</p> : null}
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn-dark">
              Venir au salon
            </Link>
            {site.assistant ? (
              <AskButton prefill="Quel service me conseillez-vous ?" className="btn-line">
                Un conseil ?
              </AskButton>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
