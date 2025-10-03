import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Scissors, Sparkles, Crown, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import servicesData from "@/data/services.json"

const iconMap = {
  scissors: Scissors,
  sparkles: Sparkles,
  sparkle: Sparkles,
  crown: Crown,
}

export const metadata = {
  title: "Services & Tarifs | Bénédiction Barber Yaoundé",
  description:
    "Découvrez nos services de coiffure professionnelle : coupes modernes, tresses, bain de visage, pédicure. Tarifs transparents à Yaoundé.",
}

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
            <Badge variant="secondary" className="uppercase tracking-wide">
              Nos Services
            </Badge>
            <h1 className="font-bebas text-6xl md:text-7xl tracking-wider leading-tight text-balance">
              SERVICES & TARIFS
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
              Des prestations professionnelles adaptées à tous vos besoins. Tarifs transparents, qualité garantie.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="space-y-20">
            {servicesData.categories.map((category, categoryIndex) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Scissors

              return (
                <div
                  key={category.id}
                  className="space-y-8 animate-fade-in-up"
                  style={{ animationDelay: `${categoryIndex * 0.1}s` }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-4 pb-4 border-b-2 border-border">
                    <div className="h-12 w-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="font-bebas text-4xl tracking-wide">{category.name}</h2>
                      <p className="text-muted-foreground">{category.description}</p>
                    </div>
                  </div>

                  {/* Services Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.services.map((service) => (
                      <Card
                        key={service.id}
                        className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden ${
                          service.popular ? "border-primary border-2" : ""
                        }`}
                      >
                        {service.popular && (
                          <div className="absolute top-4 right-4 z-10">
                            <Badge className="bg-primary text-primary-foreground uppercase text-xs">Populaire</Badge>
                          </div>
                        )}

                        <CardHeader>
                          <CardTitle className="font-bebas text-2xl tracking-wide">{service.name}</CardTitle>
                          <CardDescription className="text-sm leading-relaxed">{service.description}</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <div className="flex items-baseline gap-2">
                            <span className="font-bebas text-4xl text-foreground">
                              {service.price.toLocaleString()}
                            </span>
                            <span className="text-muted-foreground text-sm">FCFA</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{service.duration} minutes</span>
                          </div>
                        </CardContent>

                        <CardFooter>
                          <Button asChild className="w-full group/btn uppercase tracking-wide">
                            <Link href={`/reservation?service=${service.id}`}>
                              Réserver
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-bebas text-5xl md:text-6xl tracking-wider">BESOIN D'UN CONSEIL ?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Notre équipe est là pour vous conseiller et vous aider à choisir le service adapté à vos besoins
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="uppercase tracking-wide">
                <Link href="/contact">Nous contacter</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="uppercase tracking-wide bg-transparent">
                <Link href="/equipe">Rencontrer l'équipe</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
