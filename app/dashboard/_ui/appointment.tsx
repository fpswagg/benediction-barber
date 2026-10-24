import { MessageCircle, Phone } from "lucide-react";
import { APPT_STATUS, CHANNELS, type Appointment, type Member, type ServiceItem } from "@/lib/dash";
import { frDate, hh, duration } from "@/lib/format";
import { telUrl, whatsappUrl } from "@/lib/config";
import { deleteAppointment, saveAppointment, setAppointmentStatus } from "../actions";
import { ActionForm, Submit } from "./forms";
import { Badge, Input, Select, Textarea } from "./fields";

function StatusButton({ id, status, label, variant = "line" }: { id: string; status: string; label: string; variant?: "line" | "ok" | "ghost" | "danger" | "dark" }) {
  return (
    <ActionForm action={setAppointmentStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <Submit variant={variant} className="px-3 py-1.5 text-[13px]">
        {label}
      </Submit>
    </ActionForm>
  );
}

function confirmText(a: Appointment) {
  return `Bonjour ${a.clientName}, votre rendez-vous chez Bénédiction Barber est confirmé : ${frDate(a.date)} à ${hh(a.time)}${a.service ? ` (${a.service})` : ""}${a.staff ? ` avec ${a.staff}` : ""}. À bientôt !`;
}

export function AppointmentRow({ a, showDate = false, services, team }: { a: Appointment; showDate?: boolean; services: ServiceItem[]; team: Member[] }) {
  const st = APPT_STATUS[a.status] ?? APPT_STATUS.requested;
  const wa = whatsappUrl(a.phone, a.status === "requested" || a.status === "confirmed" ? confirmText(a) : undefined);
  const tel = telUrl(a.phone);
  const closed = a.status === "done" || a.status === "cancelled" || a.status === "no_show";
  return (
    <li className={`rounded-2xl border border-border bg-card p-4 ${closed ? "opacity-70" : ""}`}>
      <div className="flex gap-4">
        <div className="w-14 shrink-0 text-center">
          <p className="text-lg font-semibold tabular-nums leading-none">{hh(a.time)}</p>
          {a.durationMin ? <p className="mt-1 text-xs text-muted-foreground">{duration(a.durationMin)}</p> : null}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{a.clientName}</p>
            <Badge tone={st.tone}>{st.label}</Badge>
            {a.channel && <span className="text-xs text-muted-foreground">via {CHANNELS[a.channel] ?? a.channel}</span>}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {showDate && <span className="capitalize">{frDate(a.date, { weekday: "short", day: "numeric", month: "short" })} · </span>}
            {a.service || "Prestation non précisée"}
            {a.staff ? ` · avec ${a.staff}` : " · coiffeur libre"}
          </p>
          {a.notes && <p className="mt-1 text-sm">« {a.notes} »</p>}
          {a.phone && (
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <span className="tabular-nums">{a.phone}</span>
              {wa && (
                <a href={wa} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-ok hover:underline">
                  <MessageCircle className="size-4" /> WhatsApp
                </a>
              )}
              {tel && (
                <a href={tel} className="inline-flex items-center gap-1 hover:underline">
                  <Phone className="size-4" /> Appeler
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
        {a.status === "requested" && <StatusButton id={a.id} status="confirmed" label="Confirmer" variant="ok" />}
        {(a.status === "requested" || a.status === "confirmed") && (
          <>
            <StatusButton id={a.id} status="done" label="Terminé" />
            <StatusButton id={a.id} status="no_show" label="Absent" variant="ghost" />
            <StatusButton id={a.id} status="cancelled" label="Annuler" variant="danger" />
          </>
        )}
        {closed && <StatusButton id={a.id} status="confirmed" label="Rétablir" variant="ghost" />}
        <details className="group ml-auto w-full sm:w-auto [&[open]]:w-full">
          <summary className="cursor-pointer list-none text-right text-[13px] text-muted-foreground hover:text-foreground">Modifier</summary>
          <AppointmentForm a={a} services={services} team={team} />
          <ActionForm action={deleteAppointment} confirm="Supprimer ce rendez-vous ?" className="mt-2 text-right">
            <input type="hidden" name="id" value={a.id} />
            <Submit variant="danger" className="px-3 py-1.5 text-[13px]">
              Supprimer
            </Submit>
          </ActionForm>
        </details>
      </div>
    </li>
  );
}

export function AppointmentForm({ a, services, team, date }: { a?: Appointment; services: ServiceItem[]; team: Member[]; date?: string }) {
  const active = services.filter((s) => s.active);
  return (
    <ActionForm action={saveAppointment} resetOnSuccess={!a} className="mt-3 grid gap-3 sm:grid-cols-2">
      {a && <input type="hidden" name="id" value={a.id} />}
      <Input label="Client" name="clientName" defaultValue={a?.clientName} required placeholder="Nom du client" />
      <Input label="Téléphone" name="phone" type="tel" defaultValue={a?.phone} placeholder="6XX XX XX XX" />
      <Input label="Date" name="date" type="date" defaultValue={a?.date ?? date} required />
      <Input label="Heure" name="time" type="time" step={900} defaultValue={a?.time ?? "10:00"} required />
      <Select label="Prestation" name="service" defaultValue={a?.service ?? ""}>
        <option value="">Non précisée</option>
        {active.map((s) => (
          <option key={s.id} value={s.name}>
            {s.name}
          </option>
        ))}
        {a?.service && !active.some((s) => s.name === a.service) && <option value={a.service}>{a.service}</option>}
      </Select>
      <Select label="Coiffeur" name="staff" defaultValue={a?.staff ?? ""}>
        <option value="">Le premier libre</option>
        {team
          .filter((m) => m.active)
          .map((m) => (
            <option key={m.id} value={m.name}>
              {m.name}
            </option>
          ))}
      </Select>
      <Select label="Durée" name="durationMin" defaultValue={String(a?.durationMin ?? 30)}>
        {[15, 30, 45, 60, 90, 120, 180, 240].map((m) => (
          <option key={m} value={m}>
            {duration(m)}
          </option>
        ))}
      </Select>
      {!a && (
        <Select label="Statut" name="status" defaultValue="confirmed">
          <option value="confirmed">Confirmé</option>
          <option value="requested">À confirmer</option>
        </Select>
      )}
      <Textarea label="Note" name="notes" rows={2} defaultValue={a?.notes} placeholder="Ex. : dégradé bas, vient avec son fils" className="sm:col-span-2" />
      <div className="sm:col-span-2">
        <Submit>{a ? "Enregistrer" : "Ajouter le rendez-vous"}</Submit>
      </div>
    </ActionForm>
  );
}
