"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import type { GalleryItem } from "@/lib/site"

const LABELS: Record<string, string> = { coupes: "Coupes", tresses: "Tresses", barbe: "Barbe", soins: "Soins", salon: "Le salon", femmes: "Coiffure femme" }

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState("all")
  const [open, setOpen] = useState<number | null>(null)
  const cats = [...new Set(items.map((i) => i.category))]
  const shown = filter === "all" ? items : items.filter((i) => i.category === filter)

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null)
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % shown.length))
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + shown.length) % shown.length))
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, shown.length])

  return (
    <>
      <section className="py-3 border-b border-border sticky top-16 z-30 backdrop-blur-md bg-background/95">
        <div className="wrap">
          <div className="flex items-center gap-2 overflow-x-auto">
            {[{ id: "all", label: "Tout" }, ...cats.map((c) => ({ id: c, label: LABELS[c] ?? c }))].map((c) => (
              <Button key={c.id} size="sm" variant={filter === c.id ? "default" : "outline"} onClick={() => setFilter(c.id)} >
                {c.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-6">
        <div className="wrap">
          {shown.length ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {shown.map((item, index) => (
                <button
                  key={item.url}
                  type="button"
                  onClick={() => setOpen(index)}
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-muted text-left"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.caption} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-sm text-white">{item.caption}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Les photos arrivent bientôt.</p>
          )}
        </div>
      </section>

      {open !== null && shown[open] ? (
        <div role="dialog" aria-label={shown[open].caption} className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4" onClick={() => setOpen(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shown[open].url} alt={shown[open].caption} className="max-h-[85dvh] max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
          <p className="absolute bottom-6 inset-x-0 text-center text-sm text-white">{shown[open].caption}</p>
          <button type="button" aria-label="Fermer" className="absolute top-4 right-4 p-2 text-white" onClick={() => setOpen(null)}>
            <X className="h-7 w-7" />
          </button>
          {shown.length > 1 ? (
            <>
              <button type="button" aria-label="Précédente" className="absolute left-2 top-1/2 -translate-y-1/2 p-3 text-white" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + shown.length) % shown.length) }}>
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button type="button" aria-label="Suivante" className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-white" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % shown.length) }}>
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  )
}
