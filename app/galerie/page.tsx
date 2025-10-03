"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import galleryData from "@/data/gallery.json"

export default function GalleryPage() {
  const [filter, setFilter] = useState<string>("all")
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const categories = [
    { id: "all", label: "Tout" },
    { id: "coupes", label: "Coupes" },
    { id: "tresses", label: "Tresses" },
    { id: "soins", label: "Soins" },
  ]

  const filteredItems =
    filter === "all" ? galleryData.items : galleryData.items.filter((item) => item.category === filter)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
            <Badge variant="secondary" className="uppercase tracking-wide">
              Galerie
            </Badge>
            <h1 className="font-bebas text-6xl md:text-7xl tracking-wider leading-tight text-balance">AVANT / APRÈS</h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
              Découvrez nos transformations et le savoir-faire de notre équipe
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-background border-b border-border sticky top-20 z-40 backdrop-blur-md bg-background/95">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={filter === category.id ? "default" : "outline"}
                onClick={() => setFilter(category.id)}
                className="uppercase tracking-wide"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <Card
                key={item.id}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative aspect-square overflow-hidden">
                  {/* Before Image */}
                  <div
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
                      hoveredId === item.id ? "opacity-0" : "opacity-100"
                    }`}
                    style={{
                      backgroundImage: `url('/--encodeuricomponent-item-before--.jpg')`,
                    }}
                  />

                  {/* After Image */}
                  <div
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
                      hoveredId === item.id ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      backgroundImage: `url('/--encodeuricomponent-item-after--.jpg')`,
                    }}
                  />

                  {/* Labels */}
                  <div className="absolute top-4 left-4">
                    <Badge
                      className={`transition-opacity duration-300 ${hoveredId === item.id ? "opacity-0" : "opacity-100"}`}
                    >
                      Avant
                    </Badge>
                    <Badge
                      className={`transition-opacity duration-300 ${hoveredId === item.id ? "opacity-100" : "opacity-0"} absolute top-0 left-0`}
                    >
                      Après
                    </Badge>
                  </div>

                  {/* Overlay Info */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end p-6 transition-opacity duration-300 ${
                      hoveredId === item.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="text-white space-y-2">
                      <h3 className="font-bebas text-2xl tracking-wide">{item.title}</h3>
                      <p className="text-sm text-white/80">{item.description}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-bebas text-5xl md:text-6xl tracking-wider">PRÊT POUR VOTRE TRANSFORMATION ?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Rejoignez nos clients satisfaits et découvrez votre nouveau style
            </p>
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
