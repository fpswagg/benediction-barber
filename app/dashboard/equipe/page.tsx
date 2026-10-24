import { Plus } from "lucide-react";
import { requireDash, team as getTeam, type Member } from "@/lib/dash";
import { doualaToday } from "@/lib/format";
import { deleteMember, saveMember } from "../actions";
import { ActionForm, ImageField, Submit } from "../_ui/forms";
import { Badge, Card, Check, Empty, Input, PageTitle, Textarea } from "../_ui/fields";
import { PresenceRow } from "../_ui/presence";

function MemberForm({ m }: { m?: Member }) {
  return (
    <ActionForm action={saveMember} resetOnSuccess={!m} className="grid gap-3 sm:grid-cols-2">
      {m && <input type="hidden" name="id" value={m.id} />}
      <div className="sm:col-span-2">
        <ImageField current={m?.image} label="Ajouter une photo" round removable={Boolean(m)} max={800} />
      </div>
      <Input label="Nom" name="name" defaultValue={m?.name} required placeholder="Prénom Nom" />
      <Input label="Rôle" name="role" defaultValue={m?.role} placeholder="Barbier, coiffeuse, tresseuse…" />
      <Input label="Expérience" name="experience" defaultValue={m?.experience} placeholder="5 ans" />
      <Input label="Téléphone (privé)" name="phone" type="tel" defaultValue={m?.phone} hint="Jamais affiché sur le site." />
      <Input label="Spécialités" name="specialties" defaultValue={m?.specialties} placeholder="Dégradés, Barbe, Nattes" hint="Séparées par des virgules." className="sm:col-span-2" />
      <Textarea label="Présentation" name="bio" rows={3} defaultValue={m?.bio} placeholder="Deux phrases sur lui ou elle" className="sm:col-span-2" />
      <div className="sm:col-span-2">
        <Check label="Fait partie de l'équipe (affiché sur le site)" name="active" defaultChecked={m ? m.active : true} />
      </div>
      <div className="sm:col-span-2">
        <Submit>{m ? "Enregistrer" : "Ajouter à l'équipe"}</Submit>
      </div>
    </ActionForm>
  );
}

export default async function Team() {
  const ctx = await requireDash();
  const today = doualaToday().iso;
  const team = await getTeam(ctx);
  const active = team.filter((m) => m.active);
  const former = team.filter((m) => !m.active);

  return (
    <div className="space-y-5">
      <PageTitle title="Équipe" sub="Noms, photos et présence. L’assistant du site dit aux clients qui est là." />

      <Card title="Présence aujourd'hui">
        {active.length ? (
          <ul className="divide-y divide-border">
            {active.map((m) => (
              <PresenceRow key={m.id} m={m} today={today} />
            ))}
          </ul>
        ) : (
          <Empty>Personne dans l&apos;équipe pour l&apos;instant.</Empty>
        )}
      </Card>

      <Card title="Fiches">
        <ul className="divide-y divide-border">
          {[...active, ...former].map((m) => (
            <li key={m.id} className="py-3 first:pt-0 last:pb-0">
              <details>
                <summary className="flex cursor-pointer list-none items-center gap-3">
                  {m.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.image} alt="" className="size-11 rounded-full object-cover" />
                  ) : (
                    <span className="grid size-11 place-items-center rounded-full bg-muted text-sm font-semibold">
                      {m.name
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join("")}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 font-medium">
                      {m.name} {!m.active && <Badge>ancien</Badge>}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">{[m.role, m.experience].filter(Boolean).join(" · ") || "Rôle non précisé"}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">Modifier</span>
                </summary>
                <div className="mt-4 rounded-xl bg-muted/50 p-3 sm:p-4">
                  <MemberForm m={m} />
                  <ActionForm action={deleteMember} confirm={`Retirer ${m.name} définitivement ?`} className="mt-3 border-t border-border pt-3">
                    <input type="hidden" name="id" value={m.id} />
                    <Submit variant="danger" className="px-3 py-1.5 text-[13px]">
                      Supprimer la fiche
                    </Submit>
                  </ActionForm>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </Card>

      <details className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <summary className="flex cursor-pointer list-none items-center gap-2 font-medium">
          <Plus className="size-4" /> Ajouter une personne
        </summary>
        <div className="mt-4">
          <MemberForm />
        </div>
      </details>
    </div>
  );
}
