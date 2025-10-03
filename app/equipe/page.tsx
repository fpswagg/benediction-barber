import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Clock, CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"
import teamData from "@/data/team.json"

export const metadata = {
  title: "Notre Équipe | Bénédiction Barber Yaoundé",
  description:
    "Rencontrez notre équipe de barbiers professionnels à Yaoundé. Experts en coupes modernes, tresses, et soins capillaires.",
}

export default function TeamPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
            <Badge variant="secondary" className="uppercase tracking-wide">
              Notre Équipe
            </Badge>
            <h1 className="font-bebas text-6xl md:text-7xl tracking-wider leading-tight text-balance">
              DES EXPERTS PASSIONNÉS
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
              Une équipe de professionnels dévoués à votre style et votre satisfaction
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamData.members.map((member, index) => (
              <Card
                key={member.id}
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Photo */}
                <div className="relative h-80 overflow-hidden bg-muted">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `url('/--encodeuricomponent-member-image--.jpg')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Status Badge */}
                  {member.available && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-600 text-white border-0 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Disponible
                      </Badge>
                    </div>
                  )}

                  {/* Experience Badge */}
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1.5 rounded-full">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">{member.experience}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  {/* Name & Role */}
                  <div className="space-y-1">
                    <h3 className="font-bebas text-2xl tracking-wide">{member.name}</h3>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide">{member.role}</p>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>

                  {/* Specialties */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Award className="h-4 w-4 text-primary" />
                      <span>Spécialités</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <Button asChild className="w-full uppercase tracking-wide group/btn mt-4">
                    <Link href={`/reservation?barber=${member.id}`}>
                      Réserver avec {member.name.split(" ")[0]}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="font-bebas text-5xl md:text-6xl tracking-wider">NOS VALEURS</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">Ce qui nous guide au quotidien</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Excellence",
                  description: "Nous visons la perfection dans chaque coupe, chaque service, chaque interaction.",
                },
                {
                  title: "Passion",
                  description: "Notre amour pour notre métier se reflète dans la qualité de notre travail.",
                },
                {
                  title: "Respect",
                  description: "Chaque client est unique et mérite une attention personnalisée et respectueuse.",
                },
              ].map((value, index) => (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="space-y-3 p-0">
                    <h3 className="font-bebas text-3xl tracking-wide">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-bebas text-5xl md:text-6xl tracking-wider">REJOIGNEZ-NOUS</h2>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">
              Vous êtes un barbier passionné ? Nous recherchons toujours de nouveaux talents pour rejoindre notre équipe
            </p>
            <Button asChild size="lg" variant="secondary" className="uppercase tracking-wide">
              <Link href="/contact">Postuler maintenant</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
