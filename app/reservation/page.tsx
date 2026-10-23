import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MessageCircle, Phone } from "lucide-react";
import { getSite } from "@/lib/sss";
import { telUrl, whatsappUrl } from "@/lib/config";
import { BookingForm } from "@/components/booking-form";
import { StatusPill } from "@/components/status-bar";

export const revalidate = 60;

export const metadata = {
  title: "Réservation | Bénédiction Barber",
  description: "Réservez votre coupe, tresse ou taille de barbe chez Bénédiction Barber : choisissez un créneau libre en ligne.",
};

export default async function ReservationPage() {
  const site = await getSite();
  const wa = whatsappUrl(site.whatsapp, "Bonjour, je souhaite réserver un rendez-vous.");
  return (
    <div className="flex flex-col">
      <section className="pt-32 pb-16 md:pb-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
            <Badge variant="secondary" className="uppercase tracking-wide">Réservation</Badge>
            <h1 className="font-bebas text-6xl md:text-7xl tracking-wider leading-tight text-balance">RÉSERVEZ VOTRE RENDEZ-VOUS</h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
              Choisissez un créneau libre : l&apos;équipe confirme votre rendez-vous par téléphone ou WhatsApp
            </p>
            <StatusPill status={site.status} className="border-primary-foreground/30 text-primary-foreground" />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
            <div className="lg:col-span-2">
              <Suspense fallback={<Card className="h-96 animate-pulse" />}>
                <BookingForm categories={site.categories} team={site.team} whatsapp={site.whatsapp} />
              </Suspense>
            </div>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-5 space-y-2">
                  <h3 className="font-semibold flex items-center gap-2"><Clock className="h-5 w-5" /> Horaires</h3>
                  <p className="text-sm text-muted-foreground">{site.hoursText}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-semibold">Plutôt par message ?</h3>
                  <p className="text-sm text-muted-foreground">Écrivez-nous ou appelez, on vous trouve un créneau.</p>
                  {wa ? (
                    <Button asChild className="w-full uppercase tracking-wide bg-green-600 hover:bg-green-700 text-white">
                      <a href={wa} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 h-4 w-4" /> WhatsApp</a>
                    </Button>
                  ) : null}
                  {site.phone ? (
                    <Button asChild variant="outline" className="w-full uppercase tracking-wide">
                      <a href={telUrl(site.phone) ?? undefined}><Phone className="mr-2 h-4 w-4" /> {site.phone}</a>
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
              {site.payments.length ? (
                <Card>
                  <CardContent className="p-5 space-y-2">
                    <h3 className="font-semibold">Paiement au salon</h3>
                    <p className="text-sm text-muted-foreground">{site.payments.join(" · ")}</p>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
