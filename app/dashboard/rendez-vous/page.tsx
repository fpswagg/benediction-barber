import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { appointments, requireDash, services as getServices, team as getTeam } from "@/lib/dash";
import { doualaToday, frDate } from "@/lib/format";
import { Empty, PageTitle } from "../_ui/fields";
import { AppointmentForm, AppointmentRow } from "../_ui/appointment";

const shift = (iso: string, days: number) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

export default async function Appointments({ searchParams }: { searchParams: Promise<{ d?: string }> }) {
  const ctx = await requireDash();
  const today = doualaToday().iso;
  const q = (await searchParams).d;
  const day = q && /^\d{4}-\d{2}-\d{2}$/.test(q) ? q : today;
  const [appts, services, team] = await Promise.all([appointments(ctx), getServices(ctx), getTeam(ctx)]);
  const ofDay = appts.filter((a) => a.date === day);
  const pending = appts.filter((a) => a.status === "requested" && a.date >= today && a.date !== day);
  const week = Array.from({ length: 7 }, (_, i) => shift(day, i - 3));
  const count = (d: string) => appts.filter((a) => a.date === d && a.status !== "cancelled" && a.status !== "no_show").length;

  return (
    <div className="space-y-5">
      <PageTitle title="Rendez-vous" sub="Réservations du site, de l'assistant et celles que vous ajoutez." />

      <div className="rounded-2xl border border-border bg-card p-2">
        <div className="flex items-center justify-between px-2 pt-1 pb-2">
          <Link href={`?d=${shift(day, -7)}`} className="rounded-full p-2 hover:bg-muted" aria-label="Semaine précédente">
            <ChevronLeft className="size-4" />
          </Link>
          <p className="text-sm font-medium capitalize">{frDate(day, { month: "long", year: "numeric" })}</p>
          <div className="flex items-center gap-1">
            {day !== today && (
              <Link href="?" className="rounded-full px-3 py-1 text-sm hover:bg-muted">
                Aujourd&apos;hui
              </Link>
            )}
            <Link href={`?d=${shift(day, 7)}`} className="rounded-full p-2 hover:bg-muted" aria-label="Semaine suivante">
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {week.map((d) => {
            const n = count(d);
            const sel = d === day;
            return (
              <Link
                key={d}
                href={`?d=${d}`}
                className={`rounded-xl py-2 text-center transition ${sel ? "bg-foreground text-background" : d === today ? "bg-gold-soft" : "hover:bg-muted"}`}
              >
                <span className="block text-[11px] uppercase opacity-70">{frDate(d, { weekday: "short" }).replace(".", "")}</span>
                <span className="block text-base font-semibold tabular-nums">{Number(d.slice(8))}</span>
                <span className={`mx-auto mt-0.5 block h-1.5 w-1.5 rounded-full ${n ? (sel ? "bg-background" : "bg-gold") : "bg-transparent"}`} />
              </Link>
            );
          })}
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold capitalize">
          {frDate(day)} · {ofDay.length} rendez-vous
        </h2>
        {ofDay.length ? (
          <ul className="space-y-3">
            {ofDay.map((a) => (
              <AppointmentRow key={a.id} a={a} services={services} team={team} />
            ))}
          </ul>
        ) : (
          <Empty>Rien de prévu ce jour-là.</Empty>
        )}
        <details className="rounded-2xl border border-border bg-card p-4">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium">
            <Plus className="size-4" /> Ajouter un rendez-vous
          </summary>
          <AppointmentForm services={services} team={team} date={day < today ? today : day} />
        </details>
      </section>

      {pending.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold">Autres demandes à confirmer</h2>
          <ul className="space-y-3">
            {pending.map((a) => (
              <AppointmentRow key={a.id} a={a} showDate services={services} team={team} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
