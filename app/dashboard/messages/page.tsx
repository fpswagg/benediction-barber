import { Mail, MessageCircle, Phone } from "lucide-react";
import { messages, requireDash } from "@/lib/dash";
import { telUrl, whatsappUrl } from "@/lib/config";
import { markMessage } from "../actions";
import { ActionForm, Submit } from "../_ui/forms";
import { Badge, Empty, PageTitle } from "../_ui/fields";

const TYPES: Record<string, string> = {
  booking: "Réservation",
  callback: "Rappel demandé",
  complaint: "Réclamation",
  quote: "Devis",
  feedback: "Avis",
  order_request: "Commande",
};

const when = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", { timeZone: "Africa/Douala", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default async function Messages() {
  const ctx = await requireDash();
  const all = await messages(ctx);
  const open = all.filter((m) => !m.done);
  const closed = all.filter((m) => m.done).slice(0, 20);

  const Item = ({ m }: { m: (typeof all)[number] }) => {
    const wa = whatsappUrl(m.phone, `Bonjour ${m.name}, ici Bénédiction Barber. `);
    const tel = telUrl(m.phone);
    return (
      <li className={`rounded-2xl border border-border bg-card p-4 ${m.done ? "opacity-65" : ""}`}>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium">{m.name}</p>
          {m.type && TYPES[m.type] && <Badge tone="bg-gold-soft text-gold">{TYPES[m.type]}</Badge>}
          <span className="ml-auto text-xs text-muted-foreground">{when(m.at)}</span>
        </div>
        <p className="mt-2 text-sm whitespace-pre-line">{m.message}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3 text-sm">
          {wa && (
            <a href={wa} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-ok hover:underline">
              <MessageCircle className="size-4" /> WhatsApp
            </a>
          )}
          {tel && (
            <a href={tel} className="inline-flex items-center gap-1 hover:underline">
              <Phone className="size-4" /> {m.phone}
            </a>
          )}
          {m.email && (
            <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 hover:underline">
              <Mail className="size-4" /> {m.email}
            </a>
          )}
          <ActionForm action={markMessage} className="ml-auto">
            <input type="hidden" name="id" value={m.id} />
            <input type="hidden" name="done" value={m.done ? "false" : "true"} />
            <Submit variant={m.done ? "ghost" : "line"} className="px-3 py-1.5 text-[13px]">
              {m.done ? "Remettre à traiter" : "Traité"}
            </Submit>
          </ActionForm>
        </div>
      </li>
    );
  };

  return (
    <div className="space-y-5">
      <PageTitle title="Messages" sub="Formulaire de contact, demandes de rappel et réservations reçues par le site ou l'assistant." />
      {open.length ? (
        <ul className="space-y-3">
          {open.map((m) => (
            <Item key={m.id} m={m} />
          ))}
        </ul>
      ) : (
        <Empty>Aucun message à traiter.</Empty>
      )}
      {closed.length > 0 && (
        <details>
          <summary className="cursor-pointer list-none text-sm text-muted-foreground hover:text-foreground">Déjà traités ({closed.length})</summary>
          <ul className="mt-3 space-y-3">
            {closed.map((m) => (
              <Item key={m.id} m={m} />
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
