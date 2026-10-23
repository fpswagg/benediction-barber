import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { getSite } from "@/lib/sss"
import { GalleryGrid } from "@/components/gallery-grid"

export const revalidate = 60

export const metadata = {
  title: "Galerie | Bénédiction Barber Yaoundé",
  description: "Coupes, dégradés, nattes, twists et barbe : les réalisations de Bénédiction Barber, photographiées au salon.",
}

export default async function GalleryPage() {
  const site = await getSite()
  return (
    <div className="flex flex-col">
      <section className="pt-32 pb-16 md:pb-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
            <Badge variant="secondary" className="uppercase tracking-wide">
              Galerie
            </Badge>
            <h1 className="font-bebas text-6xl md:text-7xl tracking-wider leading-tight text-balance">NOS RÉALISATIONS</h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
              Des vraies coupes, faites et photographiées au salon
            </p>
          </div>
        </div>
      </section>

      <GalleryGrid items={site.gallery} />

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-bebas text-5xl md:text-6xl tracking-wider">ENVIE DU MÊME STYLE ?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">Réservez votre place, on s&apos;occupe du reste</p>
            <Button asChild size="lg" className="uppercase tracking-wide group">
              <Link href="/reservation">
                Réserver maintenant
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
