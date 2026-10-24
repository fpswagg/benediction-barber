import { EyeOff, Plus, Star } from "lucide-react";
import { requireDash, services as getServices } from "@/lib/dash";
import { duration, price } from "@/lib/format";
import { deleteService, toggleService } from "../actions";
import { ActionForm, Submit } from "../_ui/forms";
import { Badge, Card, Empty, PageTitle } from "../_ui/fields";
import { ServiceForm } from "../_ui/service-form";

const SUGGESTED = ["Coupes & Coiffures", "Barbe & Rasage", "Soins", "Coiffure femme"];

export default async function Services() {
  const ctx = await requireDash();
  const list = await getServices(ctx);
  const categories = [...new Set([...list.map((s) => s.category), ...SUGGESTED])];
  const groups = [...new Set(list.map((s) => s.category))].map((c) => ({ name: c, items: list.filter((s) => s.category === c) }));
  const hidden = list.filter((s) => !s.active).length;
  const noPrice = list.filter((s) => s.active && s.price === null).length;

  return (
    <div className="space-y-5">
      <PageTitle
        title="Services & prix"
        sub={`${list.length - hidden} prestations affichées${hidden ? ` · ${hidden} masquées` : ""}${noPrice ? ` · ${noPrice} sans prix (« Prix au salon »)` : ""}`}
      />

      <details className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <summary className="flex cursor-pointer list-none items-center gap-2 font-medium">
          <Plus className="size-4" /> Nouvelle prestation
        </summary>
        <div className="mt-4">
          <ServiceForm categories={categories} />
        </div>
      </details>

      {groups.length === 0 && <Empty>Aucune prestation pour l&apos;instant.</Empty>}
      {groups.map((g) => (
        <Card key={g.name} title={`${g.name} · ${g.items.length}`}>
          <ul className="divide-y divide-border">
            {g.items.map((s) => (
              <li key={s.id} className="py-3 first:pt-0 last:pb-0">
                <details>
                  <summary className="flex cursor-pointer list-none items-start gap-3">
                    <div className={`min-w-0 flex-1 ${s.active ? "" : "opacity-55"}`}>
                      <p className="flex flex-wrap items-center gap-2 font-medium">
                        {s.name}
                        {s.popular && <Star className="size-3.5 fill-gold text-gold" />}
                        {!s.active && (
                          <Badge>
                            <EyeOff className="mr-1 size-3" /> masqué
                          </Badge>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {[duration(s.durationMin), s.description].filter(Boolean).join(" · ") || "Pas de description"}
                      </p>
                    </div>
                    <p className={`shrink-0 text-right font-semibold tabular-nums ${s.price === null ? "text-sm font-normal text-muted-foreground" : ""}`}>
                      {price(s.price, s.currency)}
                    </p>
                  </summary>
                  <div className="mt-4 rounded-xl bg-muted/50 p-3 sm:p-4">
                    <ServiceForm s={s} categories={categories} />
                    <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
                      <ActionForm action={toggleService}>
                        <input type="hidden" name="id" value={s.id} />
                        <input type="hidden" name="active" value={s.active ? "false" : "true"} />
                        <Submit variant="line" className="px-3 py-1.5 text-[13px]">
                          {s.active ? "Masquer du site" : "Afficher sur le site"}
                        </Submit>
                      </ActionForm>
                      <ActionForm action={deleteService} confirm={`Supprimer « ${s.name} » ?`}>
                        <input type="hidden" name="id" value={s.id} />
                        <Submit variant="danger" className="px-3 py-1.5 text-[13px]">
                          Supprimer
                        </Submit>
                      </ActionForm>
                    </div>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </Card>
      ))}
      <p className="text-xs text-muted-foreground">Touchez une prestation pour la modifier. Les changements apparaissent sur le site en moins d&apos;une minute.</p>
    </div>
  );
}
