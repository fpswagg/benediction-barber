import type { ServiceItem } from "@/lib/dash";
import { saveService } from "../actions";
import { ActionForm, Submit } from "./forms";
import { Check, Input, Select, Textarea } from "./fields";

export function ServiceForm({ s, categories, defaultCategory }: { s?: ServiceItem; categories: string[]; defaultCategory?: string }) {
  return (
    <ActionForm action={saveService} resetOnSuccess={!s} className="grid gap-3 sm:grid-cols-2">
      {s && <input type="hidden" name="id" value={s.id} />}
      <Input label="Nom" name="name" defaultValue={s?.name} required placeholder="Ex. : Tresses africaines" className="sm:col-span-2" />
      <Input label="Prix (FCFA)" name="price" inputMode="numeric" defaultValue={s?.price ?? ""} placeholder="Vide = « Prix au salon »" />
      <Input label="Durée (minutes)" name="durationMin" inputMode="numeric" defaultValue={s?.durationMin ?? ""} placeholder="30" />
      <Select label="Catégorie" name="category" defaultValue={s?.category ?? defaultCategory ?? categories[0]}>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>
      <Input label="…ou nouvelle catégorie" name="newCategory" placeholder="Ex. : Coiffure femme" />
      <Textarea label="Description" name="description" rows={2} defaultValue={s?.description} placeholder="Ce qui est inclus" className="sm:col-span-2" />
      <div className="flex flex-wrap gap-x-6 sm:col-span-2">
        <Check label="Affiché sur le site" name="active" defaultChecked={s ? s.active : true} />
        <Check label="Populaire (mis en avant)" name="popular" defaultChecked={s?.popular} />
      </div>
      <div className="sm:col-span-2">
        <Submit>{s ? "Enregistrer" : "Ajouter la prestation"}</Submit>
      </div>
    </ActionForm>
  );
}
