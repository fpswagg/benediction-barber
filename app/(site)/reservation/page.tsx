import { Suspense } from "react";
import { getSite } from "@/lib/sss";
import { BookingForm } from "@/components/booking-form";
import { StatusPill } from "@/components/status-bar";
import { ContactList, HoursTable, PageHead, PaymentList } from "@/components/info";

export const revalidate = 60;

export const metadata = {
  title: "Réservation | Bénédiction Barber",
  description: "Réservez votre coupe, vos nattes ou votre barbe chez Bénédiction Barber : choisissez un créneau libre en ligne.",
};

export default async function ReservationPage() {
  const site = await getSite();
  return (
    <>
      <PageHead eyebrow="Réservation" title="Prendre rendez-vous">
        Choisissez un créneau libre. L&apos;équipe vous confirme le rendez-vous par téléphone ou WhatsApp.
      </PageHead>
      <div className="wrap grid gap-8 pb-16 lg:grid-cols-[1fr_320px] lg:gap-12">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-muted" />}>
          <BookingForm categories={site.categories} team={site.team} whatsapp={site.whatsapp} />
        </Suspense>
        <aside className="space-y-8 lg:pt-1">
          <StatusPill status={site.status} />
          <div>
            <h2 className="mb-3 text-sm font-semibold">Horaires</h2>
            <HoursTable site={site} />
          </div>
          <div>
            <h2 className="mb-3 text-sm font-semibold">Plutôt par message ou par appel ?</h2>
            <ContactList site={site} />
          </div>
          {site.paymentMethods.length ? (
            <div>
              <h2 className="mb-3 text-sm font-semibold">Paiement</h2>
              <PaymentList site={site} />
            </div>
          ) : null}
        </aside>
      </div>
    </>
  );
}
