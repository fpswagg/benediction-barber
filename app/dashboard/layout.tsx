import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { appointments, dashState, messages } from "@/lib/dash";
import { authProblem } from "@/lib/sss-auth";
import { authConfig } from "@/lib/auth-config";
import { doualaToday } from "@/lib/format";
import { DashNav } from "./_ui/nav";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Espace gérant", robots: { index: false, follow: false } };

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-background px-5 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 sm:p-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="" className="mb-5 size-14 rounded-full" />
        {children}
      </div>
    </div>
  );
}

function SignIn() {
  const problem = authProblem();
  return (
    <Center>
      <p className="eyebrow">Espace gérant</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Bénédiction Barber</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Gérez les rendez-vous, les prix, l&apos;équipe, les photos et les infos du salon. Connectez-vous avec votre compte SSS.
      </p>
      {problem ? (
        <p className="mt-6 rounded-xl bg-muted p-3 text-sm text-muted-foreground">La connexion n&apos;est pas encore activée sur ce site.</p>
      ) : (
        <a href="/auth/sss?next=/dashboard" className="btn btn-dark mt-6 w-full">
          Se connecter avec SSS
        </a>
      )}
      <Link href="/" className="link mt-5 block text-center text-sm">
        Retour au site
      </Link>
    </Center>
  );
}

function WrongBusiness({ name }: { name: string }) {
  return (
    <Center>
      <h1 className="text-xl font-semibold">Mauvais compte</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Ce compte SSS{name ? ` (${name})` : ""} n&apos;a pas accès à Bénédiction Barber. Reconnectez-vous en choisissant le salon.
      </p>
      <form action="/auth/sss/sign-out" method="post" className="mt-6">
        <button type="submit" className="btn btn-dark w-full">
          Changer de compte
        </button>
      </form>
    </Center>
  );
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const state = await dashState();
  if (state.kind === "signed_out") return <SignIn />;
  if (state.kind === "wrong_business") return <WrongBusiness name={state.session.user.business?.name ?? ""} />;

  const { ctx } = state;
  const today = doualaToday().iso;
  const [appts, msgs] = await Promise.all([appointments(ctx), messages(ctx)]);
  const counts = {
    "/dashboard/rendez-vous": appts.filter((a) => a.status === "requested" && a.date >= today).length,
    "/dashboard/messages": msgs.filter((m) => !m.done && m.type !== "booking").length,
  };
  const who = ctx.session.user.name ?? ctx.session.user.email ?? "";

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 pt-4 pb-24 sm:px-6 lg:grid-cols-[220px_1fr] lg:gap-10 lg:pt-8">
        <aside className="sticky min-w-0 top-0 z-30 -mx-4 bg-background/95 px-4 pt-1 pb-2 backdrop-blur lg:static lg:mx-0 lg:h-fit lg:p-0 lg:sticky lg:top-8">
          <div className="mb-3 flex items-center justify-between gap-3 lg:mb-6">
            <Link href="/dashboard" className="flex min-w-0 items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" className="size-9 rounded-full" />
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-sm font-semibold">Bénédiction Barber</span>
                <span className="block text-xs text-muted-foreground">Espace gérant</span>
              </span>
            </Link>
            <div className="flex items-center gap-1 lg:hidden">
              <a href="/" target="_blank" className="rounded-full p-2 text-muted-foreground hover:bg-muted" aria-label="Voir le site">
                <ExternalLink className="size-4" />
              </a>
              <form action="/auth/sss/sign-out" method="post">
                <button className="rounded-full p-2 text-muted-foreground hover:bg-muted" aria-label="Se déconnecter">
                  <LogOut className="size-4" />
                </button>
              </form>
            </div>
          </div>
          <DashNav counts={counts} />
          <div className="mt-8 hidden space-y-2 border-t border-border pt-4 text-sm lg:block">
            <p className="truncate text-xs text-muted-foreground">
              {who}
              {ctx.canWrite ? "" : " · lecture seule"}
            </p>
            <a href="/" target="_blank" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ExternalLink className="size-4" /> Voir le site
            </a>
            <a href={authConfig.appUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ExternalLink className="size-4" /> Ouvrir SSS
            </a>
            <form action="/auth/sss/sign-out" method="post">
              <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <LogOut className="size-4" /> Se déconnecter
              </button>
            </form>
          </div>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
