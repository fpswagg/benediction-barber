import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, MessageCircle, Sparkles } from "lucide-react";
import { getSite } from "@/lib/sss";
import { telUrl, whatsappUrl } from "@/lib/config";
import { ContactForm } from "@/components/contact-form";
import { AskButton } from "@/components/ask-button";
import { StatusPill } from "@/components/status-bar";

export const revalidate = 60;

export const metadata = {
  title: "Contact | Bénédiction Barber Yaoundé",
  description: "Appelez, écrivez sur WhatsApp ou envoyez un message à Bénédiction Barber. Ouvert tous les jours de 8h à 22h.",
};

function Info({ icon: Icon, title, children }: { icon: typeof MapPin; title: string; children: React.ReactNode }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-5 flex items-start gap-4">
        <div className="h-12 w-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-1 min-w-0">
          <h3 className="font-semibold">{title}</h3>
          <div className="text-sm text-muted-foreground leading-relaxed break-words">{children}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function ContactPage() {
  const site = await getSite();
  const wa = whatsappUrl(site.whatsapp, "Bonjour, je souhaite obtenir plus d'informations sur vos services.");
  const mapQuery = encodeURIComponent([site.address, site.city, site.country].filter(Boolean).join(", "));
  return (
    <div className="flex flex-col">
      <section className="pt-32 pb-16 md:pb-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
            <Badge variant="secondary" className="uppercase tracking-wide">Contact</Badge>
            <h1 className="font-bebas text-6xl md:text-7xl tracking-wider leading-tight text-balance">CONTACTEZ-NOUS</h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">Une question ? Un conseil ? Notre équipe est à votre écoute</p>
            <StatusPill status={site.status} className="border-primary-foreground/30 text-primary-foreground" />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="font-bebas text-4xl tracking-wide">INFORMATIONS</h2>
                <p className="text-muted-foreground leading-relaxed">Passez au salon, appelez-nous ou écrivez-nous sur WhatsApp.</p>
              </div>
              <div className="space-y-4">
                <Info icon={MapPin} title="Adresse">
                  {site.address ? <>{site.address}<br /></> : null}
                  {site.city}, {site.country}
                </Info>
                {site.phone ? (
                  <Info icon={Phone} title="Téléphone">
                    <a href={telUrl(site.phone) ?? undefined} className="hover:text-foreground">{site.phone}</a>
                  </Info>
                ) : null}
                {site.email ? (
                  <Info icon={Mail} title="Email">
                    <a href={`mailto:${site.email}`} className="hover:text-foreground">{site.email}</a>
                  </Info>
                ) : null}
                <Info icon={Clock} title="Horaires">
                  {site.hoursText}
                  {site.payments.length ? <><br />Paiement : {site.payments.join(", ")}</> : null}
                </Info>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {wa ? (
                  <Button asChild size="lg" className="w-full uppercase tracking-wide bg-green-600 hover:bg-green-700 text-white">
                    <a href={wa} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      WhatsApp
                    </a>
                  </Button>
                ) : null}
                {site.assistant ? (
                  <AskButton className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border px-6 text-sm font-medium uppercase tracking-wide hover:bg-muted">
                    <Sparkles className="h-4 w-4" />
                    Assistant
                  </AskButton>
                ) : null}
              </div>
            </div>

            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="font-bebas text-3xl tracking-wide">ENVOYEZ-NOUS UN MESSAGE</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="font-bebas text-5xl md:text-6xl tracking-wider">NOUS TROUVER</h2>
              <p className="text-muted-foreground text-lg">{site.address ? `${site.address}, ${site.city}` : `À ${site.city} : demandez-nous l'itinéraire sur WhatsApp`}</p>
            </div>
            <Card className="overflow-hidden shadow-xl">
              <div className="relative h-80 md:h-96 bg-muted">
                <iframe
                  src={`https://maps.google.com/maps?q=${mapQuery}&z=${site.address ? 16 : 12}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bénédiction Barber, plan"
                />
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
