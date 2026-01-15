import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scissors, Clock, Award, MapPin, ArrowRight, Star } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url('/barber-tools-pattern-black-and-white.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
            {/* Main Heading */}
            <h1 className="font-bebas text-6xl md:text-8xl lg:text-9xl text-primary-foreground tracking-wider leading-none text-balance pt-32 pb-8 md:pt-40 md:pb-12">
              STYLE
              <br />
              EXCELLENCE
              <br />
              CONFIANCE
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed text-pretty">
              Votre destination pour des coupes modernes et un service
              professionnel au cœur de Yaoundé
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="uppercase tracking-wide text-base px-8 group"
              >
                <Link href="/reservation">
                  Réserver maintenant
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="uppercase tracking-wide text-base px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Link href="/services">Nos services</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 py-12 max-w-2xl mx-auto">
              <div className="space-y-2">
                <div className="font-bebas text-4xl md:text-5xl text-primary-foreground">
                  5+
                </div>
                <div className="text-sm text-primary-foreground/70 uppercase tracking-wide">
                  Ans d'expérience
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-bebas text-4xl md:text-5xl text-primary-foreground">
                  4.8/5
                </div>
                <div className="text-sm text-primary-foreground/70 uppercase tracking-wide">
                  Note moyenne
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-bebas text-4xl md:text-5xl text-primary-foreground">
                  3
                </div>
                <div className="text-sm text-primary-foreground/70 uppercase tracking-wide">
                  Barbiers experts
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-primary-foreground/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-bebas text-5xl md:text-6xl text-foreground tracking-wider">
              POURQUOI NOUS CHOISIR
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Excellence, professionnalisme et style urbain au service de votre
              image
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Scissors,
                title: "Expertise",
                description:
                  "Barbiers professionnels formés aux techniques modernes et traditionnelles",
              },
              {
                icon: Award,
                title: "Qualité Premium",
                description:
                  "Produits haut de gamme et équipements professionnels pour un résultat parfait",
              },
              {
                icon: Clock,
                title: "Flexibilité",
                description:
                  "Horaires étendus et système de réservation simple pour votre confort",
              },
              {
                icon: MapPin,
                title: "Localisation",
                description: "Situé au cœur de Yaoundé, facilement accessible",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="h-14 w-14 bg-primary text-primary-foreground rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-bebas text-2xl tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-bebas text-5xl md:text-6xl text-foreground tracking-wider">
              NOS SERVICES
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Des coupes classiques aux styles les plus modernes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Coupes & Coiffures",
                services: [
                  "Coupe simple",
                  "Coupe avec black",
                  "Taper fade",
                  "Coiffure personnalisée",
                ],
                image: "/men-haircut.jpg",
              },
              {
                title: "Soins & Beauté",
                services: [
                  "Soins de visage",
                  "Lavage de cheveux",
                  "Pédicure",
                  "Manicure"
                ],
                image: "/care.jpg",
              },
              {
                title: "Tresses & Styles",
                services: [
                  "Tresses",
                  "Nattes",
                  "Locks",
                  "Styles personnalisés",
                ],
                image: "/tresses.jpg",
              },
            ].map((category, index) => (
              <Card
                key={index}
                className="overflow-hidden group hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `url('${category.image}')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-bebas text-3xl text-white tracking-wide">
                      {category.title}
                    </h3>
                  </div>
                </div>
                <CardContent className="p-6 space-y-3">
                  {category.services.map((service, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <div className="h-1.5 w-1.5 bg-foreground rounded-full" />
                      <span>{service}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="uppercase tracking-wide">
              <Link href="/services">
                Voir tous les services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="font-bebas text-5xl md:text-7xl tracking-wider leading-tight text-balance">
              PRÊT POUR UN NOUVEAU STYLE ?
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Réservez votre rendez-vous dès maintenant et découvrez
              l'excellence du service Bénédiction Barber
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="uppercase tracking-wide text-base px-8"
              >
                <Link href="/reservation">Réserver en ligne</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="uppercase tracking-wide text-base px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
