import { presentToday, type Member } from "@/lib/dash";
import { frDate, initials } from "@/lib/format";
import { setPresence } from "../actions";
import { ActionForm, Submit } from "./forms";
import { Input } from "./fields";

export function MemberAvatar({ m, size = "size-10" }: { m: Member; size?: string }) {
  return m.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={m.image} alt="" className={`${size} shrink-0 rounded-full object-cover`} />
  ) : (
    <span className={`${size} grid shrink-0 place-items-center rounded-full bg-muted text-sm font-semibold`}>{initials(m.name)}</span>
  );
}

/** Present / away switch for one person, with reason and return day when away. */
export function PresenceRow({ m, today }: { m: Member; today: string }) {
  const here = presentToday(m, today);
  return (
    <li className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
      <MemberAvatar m={m} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{m.name}</p>
        <p className={`text-sm ${here ? "text-ok" : "text-destructive"}`}>
          {here ? "Présent" : `Absent${m.awayReason ? ` · ${m.awayReason}` : ""}${m.backOn ? ` · retour ${frDate(m.backOn, { weekday: "short", day: "numeric", month: "short" })}` : ""}`}
        </p>
      </div>
      {here ? (
        <details className="w-full sm:w-auto [&[open]]:w-full">
          <summary className="cursor-pointer list-none text-right text-sm text-muted-foreground hover:text-foreground">Marquer absent</summary>
          <ActionForm action={setPresence} className="mt-3 grid gap-3 sm:grid-cols-[1fr_170px_auto] sm:items-end">
            <input type="hidden" name="id" value={m.id} />
            <input type="hidden" name="available" value="false" />
            <Input label="Raison (facultatif)" name="awayReason" placeholder="Malade, congé…" maxLength={120} />
            <Input label="De retour le" name="backOn" type="date" min={today} />
            <Submit variant="danger" className="border border-destructive/30">
              Absent
            </Submit>
          </ActionForm>
        </details>
      ) : (
        <ActionForm action={setPresence}>
          <input type="hidden" name="id" value={m.id} />
          <input type="hidden" name="available" value="true" />
          <Submit variant="ok" className="px-3 py-1.5 text-[13px]">
            Présent
          </Submit>
        </ActionForm>
      )}
    </li>
  );
}
