import Link from "next/link";
import { ArrowRight, Plus, Zap, ZapOff } from "lucide-react";
import { appointments, getProfile, obj, arr, str, requireDash, services as getServices, team as getTeam, presentToday } from "@/lib/dash";
import { doualaToday, frDate, hh } from "@/lib/format";
import { setDependency, setPause } from "./actions";
import { ActionForm, Submit } from "./_ui/forms";
import { Card, Empty, Input, PageTitle, Select } from "./_ui/fields";
import { AppointmentForm, AppointmentRow } from "./_ui/appointment";
import { PresenceRow } from "./_ui/presence";

export default async function Today() {
  const ctx = await requireDash();
  const today = doualaToday().iso;
  const [appts, { profile, now }, team, services] = await Promise.all([appointments(ctx), getProfile(ctx), getTeam(ctx), getServices(ctx)]);
  const todays = appts.filter((a) => a.date === today);
  const live = todays.filter((a) => a.status === "requested" || a.status === "confirmed");
  const pending = appts.filter((a) => a.status === "requested" && a.date > today);
  const staff = team.filter((m) => m.active);
  const present = staff.filter((m) => presentToday(m, today));

  const availability = obj(profile.availability);
  const paused = availability.paused === true;
  const power = arr(availability.dependencies).map(obj).find((d) => str(d.kind) === "power" || str(d.id) === "power");
  const noPower = power ? power.ok === false : false;
  const state = str(now.state);
  const reasons = arr(now.reasons).map(obj).map((r) => str(r.text)).filter(Boolean);
  const openNow = state === "open";
  const label = openNow ? "Ouvert" : state === "limited" ? "Service réduit" : "Fermé";

  return (
    <div className="space-y-5">
      <PageTitle title="Aujourd'hui" sub={<span className="capitalize">{frDate(today)}</span>} />

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-lg font-semibold">
              <span className={`size-2.5 rounded-full ${openNow ? "bg-ok" : "bg-destructive"}`} />
              {label} pour les clients
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {reasons[0] ??
                (openNow && str(now.closesAt) ? `Ferme à ${hh(str(now.closesAt))}` : str(now.opensAt) ? `Ouvre à ${hh(str(now.opensAt))}` : "Selon les horaires")}
            </p>
          </div>
          {power && (
            <ActionForm action={setDependency}>
              <input type="hidden" name="id" value={str(power.id)} />
              <input type="hidden" name="ok" value={noPower ? "true" : "false"} />
              <Submit variant={noPower ? "ok" : "line"}>
                {noPower ? <Zap className="size-4" /> : <ZapOff className="size-4" />}
                {noPower ? "Le courant est revenu" : "Pas de courant"}
              </Submit>
            </ActionForm>
          )}
        </div>

        <div className="mt-4 border-t border-border pt-4">
          {paused ? (
            <ActionForm action={setPause} className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm">
                Salon en pause{str(availability.reason) ? ` : ${str(availability.reason)}` : ""}
                {str(availability.until) ? ` (jusqu'à ${new Date(str(availability.until)).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Douala" })})` : ""}
              </p>
              <input type="hidden" name="paused" value="false" />
              <Submit variant="ok">Rouvrir maintenant</Submit>
            </ActionForm>
          ) : (
            <details>
              <summary className="cursor-pointer list-none text-sm text-muted-foreground hover:text-foreground">Fermer exceptionnellement (pause)…</summary>
              <ActionForm action={setPause} className="mt-3 grid gap-3 sm:grid-cols-[1fr_180px_auto] sm:items-end">
                <input type="hidden" name="paused" value="true" />
                <Input label="Raison (vue par les clients)" name="reason" placeholder="Ex. : fermé pour un deuil, de retour demain" maxLength={200} />
                <Select label="Pendant" name="hours" defaultValue="0">
                  <option value="1">1 heure</option>
                  <option value="2">2 heures</option>
                  <option value="4">4 heures</option>
                  <option value="0">Jusqu&apos;à réouverture</option>
                </Select>
                <Submit variant="danger" className="border border-destructive/30">
                  Mettre en pause
                </Submit>
              </ActionForm>
            </details>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        {[
          [String(live.length), "RDV aujourd'hui"],
          [String(appts.filter((a) => a.status === "requested" && a.date >= today).length), "À confirmer"],
          [`${present.length}/${staff.length}`, "Coiffeurs présents"],
        ].map(([n, l]) => (
          <div key={l} className="rounded-2xl border border-border bg-card p-3 sm:p-4">
            <p className="text-2xl font-semibold tabular-nums">{n}</p>
            <p className="text-xs text-muted-foreground sm:text-sm">{l}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Rendez-vous du jour</h2>
          <Link href="/dashboard/rendez-vous" className="link text-sm">
            Tout voir
          </Link>
        </div>
        {todays.length ? (
          <ul className="space-y-3">
            {todays.map((a) => (
              <AppointmentRow key={a.id} a={a} services={services} team={team} />
            ))}
          </ul>
        ) : (
          <Empty>Aucun rendez-vous aujourd&apos;hui.</Empty>
        )}
        <details className="rounded-2xl border border-border bg-card p-4">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium">
            <Plus className="size-4" /> Ajouter un rendez-vous (client au salon ou au téléphone)
          </summary>
          <AppointmentForm services={services} team={team} date={today} />
        </details>
      </section>

      {pending.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold">Demandes à confirmer (prochains jours)</h2>
          <ul className="space-y-3">
            {pending.slice(0, 6).map((a) => (
              <AppointmentRow key={a.id} a={a} showDate services={services} team={team} />
            ))}
          </ul>
          {pending.length > 6 && (
            <Link href="/dashboard/rendez-vous" className="link inline-flex items-center gap-1 text-sm">
              {pending.length - 6} autres <ArrowRight className="size-4" />
            </Link>
          )}
        </section>
      )}

      <Card title="Qui est là aujourd'hui ?" action={<Link href="/dashboard/equipe" className="link text-sm">Équipe</Link>}>
        {staff.length ? (
          <ul className="divide-y divide-border">
            {staff.map((m) => (
              <PresenceRow key={m.id} m={m} today={today} />
            ))}
          </ul>
        ) : (
          <Empty>Ajoutez votre équipe dans l&apos;onglet Équipe.</Empty>
        )}
        <p className="mt-3 text-xs text-muted-foreground">Un coiffeur absent n&apos;est plus proposé à la réservation en ligne.</p>
      </Card>
    </div>
  );
}
