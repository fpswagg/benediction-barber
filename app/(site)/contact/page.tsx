import { getSite } from "@/lib/sss";
import { ContactForm } from "@/components/contact-form";
import { AskButton } from "@/components/ask-button";
import { StatusPill } from "@/components/status-bar";
import { ContactList, Extras, HoursTable, MapCard, PageHead, PaymentList, Socials } from "@/components/info";

export const revalidate = 60;

export const metadata = {
  title: "Infos & contact | Bénédiction Barber Yaoundé",
  description: "Adresse, horaires, téléphone, WhatsApp et paiements de Bénédiction Barber, à Biyem-Assi face au collège Fleming, Yaoundé.",
};

export default async function ContactPage() {
  const site = await getSite();
  return (
    <>
      <PageHead eyebrow="Infos pratiques" title="Infos & contact">
        <StatusPill status={site.status} />
      </PageHead>
      <div className="wrap space-y-12 pb-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h2 className="mb-3 text-sm font-semibold">Adresse & contact</h2>
            <ContactList site={site} />
            <Socials site={site} className="mt-5" />
          </div>
          <div>
            <h2 className="mb-3 text-sm font-semibold">Horaires</h2>
            <HoursTable site={site} />
          </div>
          <div className="space-y-6">
            {site.paymentMethods.length ? (
              <div>
                <h2 className="mb-3 text-sm font-semibold">Paiement</h2>
                <PaymentList site={site} />
              </div>
            ) : null}
            <Extras site={site} />
          </div>
        </div>
        <MapCard site={site} />
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <h2 className="mb-1 text-lg font-semibold">Écrivez-nous</h2>
            <p className="mb-5 text-sm text-muted-foreground">On vous répond par téléphone ou WhatsApp.</p>
            <ContactForm />
          </div>
          {site.assistant ? (
            <div className="space-y-3 rounded-2xl bg-muted p-5 sm:p-6">
              <h2 className="text-lg font-semibold">Réponse immédiate</h2>
              <p className="text-sm text-muted-foreground">
                Notre assistant connaît les prix, les horaires et les créneaux libres. Il peut aussi réserver pour vous.
              </p>
              <AskButton className="btn-dark">Poser une question</AskButton>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
