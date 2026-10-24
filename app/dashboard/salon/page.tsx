import { arr, DAY_KEYS, getProfile, getShowcase, getStore, obj, PAYMENT_IDS, requireDash, SOCIAL_IDS, str } from "@/lib/dash";
import { doualaToday, frDate, hh } from "@/lib/format";
import { editException, saveExtras, saveFaq, saveHours, saveInfo, savePayments, saveSocials } from "../actions";
import { ActionForm, Submit } from "../_ui/forms";
import { Card, Check, Input, PageTitle, Select, Textarea, inputCls } from "../_ui/fields";

const SECTIONS = [
  ["infos", "Infos & contact"],
  ["horaires", "Horaires"],
  ["jours", "Jours spéciaux"],
  ["paiements", "Paiements"],
  ["reseaux", "Réseaux"],
  ["sur-place", "Sur place"],
  ["faq", "Questions"],
] as const;

const PAY_HINT: Record<string, string> = {
  mtn_momo: "Numéro et nom du compte, ex. : 6XX XX XX XX (Jean Mbarga)",
  orange_money: "Numéro et nom du compte, ex. : 69X XX XX XX (Jean Mbarga)",
  bank_transfer: "Banque, titulaire, RIB",
  card: "Cartes acceptées",
  cash: "",
  other: "Précisez",
};

export default async function Salon() {
  const ctx = await requireDash();
  const [store, { profile }, showcase] = await Promise.all([getStore(ctx), getProfile(ctx), getShowcase(ctx)]);
  const meta = obj(store.metadata);
  const hours = obj(profile.hours);
  const days = obj(hours.days);
  const today = doualaToday().iso;
  const exceptions = arr(hours.exceptions)
    .map(obj)
    .filter((e) => str(e.date) >= today)
    .sort((a, b) => str(a.date).localeCompare(str(b.date)));
  const methods = arr(obj(profile.payments).methods).map(obj);
  const method = (id: string) => methods.find((m) => str(m.id) === id);
  const socials = obj(obj(showcase.design).socials);
  const faq = arr(profile.faq).map(obj);

  return (
    <div className="space-y-5">
      <PageTitle title="Infos du salon" sub="Tout ce que les clients voient sur le site et ce que l'assistant répond." />

      <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        {SECTIONS.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:border-foreground">
            {label}
          </a>
        ))}
      </nav>

      <Card id="infos" title="Infos & contact" className="scroll-mt-28">
        <ActionForm action={saveInfo} className="grid gap-3 sm:grid-cols-2">
          <Input label="Nom du salon" name="name" defaultValue={str(store.name)} required className="sm:col-span-2" />
          <Input label="Téléphone" name="phone" type="tel" defaultValue={str(store.phone)} />
          <Input label="WhatsApp" name="whatsapp" type="tel" defaultValue={str(store.whatsapp)} hint="Le bouton WhatsApp du site ouvre ce numéro." />
          <Input label="E-mail" name="email" type="email" defaultValue={str(store.email)} />
          <Input label="Ville" name="city" defaultValue={str(store.city)} />
          <Input label="Adresse / repère" name="address" defaultValue={str(store.address)} placeholder="Quartier, repère connu" className="sm:col-span-2" />
          <Input label="Phrase d'accueil" name="heroSubtitle" defaultValue={str(showcase.heroSubtitle)} maxLength={240} hint="Sous le nom, en haut de la page d'accueil." className="sm:col-span-2" />
          <Textarea label="Description courte" name="description" rows={3} defaultValue={str(store.description)} hint="Utilisée par Google et l'assistant." className="sm:col-span-2" />
          <Textarea label="À propos" name="aboutMarkdown" rows={4} defaultValue={str(showcase.aboutMarkdown)} hint="Texte de présentation. **gras** possible." className="sm:col-span-2" />
          <div className="sm:col-span-2">
            <Submit>Enregistrer</Submit>
          </div>
        </ActionForm>
      </Card>

      <Card id="horaires" title="Horaires" className="scroll-mt-28">
        <ActionForm action={saveHours} className="space-y-1">
          {DAY_KEYS.map(([key, label]) => {
            const slots = arr(days[key]).map(obj);
            const s1 = slots[0];
            const s2 = slots[1];
            return (
              <div key={key} className="grid grid-cols-[96px_1fr] items-center gap-2 border-b border-border py-2 last:border-0 sm:grid-cols-[120px_1fr]">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" name={`${key}_open`} defaultChecked={slots.length > 0} className="size-[18px] accent-[#141414]" />
                  {label}
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <input type="time" name={`${key}_from1`} defaultValue={str(s1?.from) || "09:00"} className={`${inputCls} w-[8.5rem]!`} />
                  <span className="text-muted-foreground">–</span>
                  <input type="time" name={`${key}_to1`} defaultValue={str(s1?.to) || "18:00"} className={`${inputCls} w-[8.5rem]!`} />
                  <details className="w-full sm:w-auto" open={Boolean(s2)}>
                    <summary className="cursor-pointer list-none text-xs text-muted-foreground hover:text-foreground">+ coupure</summary>
                    <div className="mt-2 flex items-center gap-2">
                      <input type="time" name={`${key}_from2`} defaultValue={str(s2?.from)} className={`${inputCls} w-[8.5rem]!`} />
                      <span className="text-muted-foreground">–</span>
                      <input type="time" name={`${key}_to2`} defaultValue={str(s2?.to)} className={`${inputCls} w-[8.5rem]!`} />
                    </div>
                  </details>
                </div>
              </div>
            );
          })}
          <Input label="Note sur les horaires (facultatif)" name="note" defaultValue={str(hours.note)} placeholder="Ex. : ouvert plus tard les veilles de fête" className="pt-3" />
          <div className="pt-3">
            <Submit>Enregistrer les horaires</Submit>
          </div>
          <p className="pt-1 text-xs text-muted-foreground">Décochez un jour pour le marquer fermé. « + coupure » ajoute une deuxième plage (ex. pause à midi).</p>
        </ActionForm>
      </Card>

      <Card id="jours" title="Jours spéciaux (fériés, fermetures, horaires différents)" className="scroll-mt-28">
        {exceptions.length > 0 && (
          <ul className="mb-4 divide-y divide-border">
            {exceptions.map((e) => {
              const slot = obj(arr(e.slots)[0]);
              return (
                <li key={str(e.date)} className="flex items-center gap-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium capitalize">{frDate(str(e.date))}</p>
                    <p className="text-sm text-muted-foreground">
                      {e.closed === false ? `Ouvert ${hh(str(slot.from))} – ${hh(str(slot.to))}` : "Fermé"}
                      {str(e.note) ? ` · ${str(e.note)}` : ""}
                    </p>
                  </div>
                  <ActionForm action={editException}>
                    <input type="hidden" name="date" value={str(e.date)} />
                    <input type="hidden" name="op" value="delete" />
                    <Submit variant="danger" className="px-3 py-1.5 text-[13px]">
                      Retirer
                    </Submit>
                  </ActionForm>
                </li>
              );
            })}
          </ul>
        )}
        <ActionForm action={editException} resetOnSuccess className="grid gap-3 sm:grid-cols-2">
          <Input label="Date" name="date" type="date" min={today} required />
          <Select label="Ce jour-là" name="kind" defaultValue="closed">
            <option value="closed">Fermé</option>
            <option value="special">Ouvert, horaires spéciaux</option>
          </Select>
          <Input label="Ouverture (si spécial)" name="from" type="time" defaultValue="10:00" />
          <Input label="Fermeture (si spécial)" name="to" type="time" defaultValue="16:00" />
          <Input label="Message aux clients" name="note" maxLength={120} placeholder="Ex. : Fête nationale" className="sm:col-span-2" />
          <div className="sm:col-span-2">
            <Submit variant="line">Ajouter ce jour</Submit>
          </div>
        </ActionForm>
      </Card>

      <Card id="paiements" title="Paiements acceptés" className="scroll-mt-28">
        <ActionForm action={savePayments} className="space-y-3">
          {PAYMENT_IDS.map(([id, label]) => {
            const m = method(id);
            return (
              <div key={id} className="rounded-xl border border-border p-3">
                <Check label={label} name={`${id}_on`} defaultChecked={Boolean(m)} />
                {id === "other" && <input name="other_label" defaultValue={str(m?.label)} placeholder="Nom du moyen de paiement" maxLength={60} className={`${inputCls} mt-2`} />}
                {id !== "cash" && (
                  <input name={`${id}_details`} defaultValue={str(m?.details)} placeholder={PAY_HINT[id] || "Détails (facultatif)"} maxLength={200} className={`${inputCls} mt-2`} />
                )}
              </div>
            );
          })}
          <Submit>Enregistrer les paiements</Submit>
          <p className="text-xs text-muted-foreground">Les numéros Mobile Money sont affichés sur le site et donnés par l&apos;assistant.</p>
        </ActionForm>
      </Card>

      <Card id="reseaux" title="Réseaux sociaux" className="scroll-mt-28">
        <ActionForm action={saveSocials} className="grid gap-3 sm:grid-cols-2">
          {SOCIAL_IDS.map(([id, label]) => (
            <Input key={id} label={label} name={id} defaultValue={str(socials[id])} placeholder="@compte ou lien" />
          ))}
          <div className="sm:col-span-2">
            <Submit>Enregistrer</Submit>
          </div>
        </ActionForm>
      </Card>

      <Card id="sur-place" title="Sur place" className="scroll-mt-28">
        <ActionForm action={saveExtras} className="space-y-3">
          <Textarea label="Un élément par ligne" name="extras" rows={4} defaultValue={arr(meta.extras).map(str).join("\n")} placeholder={"Jeux vidéo (PS4)\nBoissons fraîches\nWi-Fi"} />
          <Submit>Enregistrer</Submit>
        </ActionForm>
      </Card>

      <Card id="faq" title="Questions fréquentes" className="scroll-mt-28">
        <ActionForm action={saveFaq} className="space-y-3">
          {[...faq, {}, {}].map((x, i) => (
            <div key={i} className="space-y-2 rounded-xl border border-border p-3">
              <input name="q" defaultValue={str(x.q)} placeholder={i >= faq.length ? "Nouvelle question" : "Question"} maxLength={200} className={`${inputCls} font-medium`} />
              <textarea name="a" defaultValue={str(x.a)} placeholder="Réponse" rows={2} maxLength={1200} className={`${inputCls} resize-y`} />
            </div>
          ))}
          <Submit>Enregistrer les questions</Submit>
          <p className="text-xs text-muted-foreground">Videz une question pour la supprimer. L&apos;assistant utilise aussi ces réponses.</p>
        </ActionForm>
      </Card>
    </div>
  );
}
