import Link from "next/link";
import { getSite } from "@/lib/sss";
import { PageHead, TeamGrid } from "@/components/info";

export const revalidate = 60;

export const metadata = {
  title: "L'équipe | Bénédiction Barber Yaoundé",
  description: "Les barbiers et coiffeurs de Bénédiction Barber : spécialités, expérience et disponibilité.",
};

export default async function TeamPage() {
  const site = await getSite();
  return (
    <>
      <PageHead eyebrow="L'équipe" title="Vos barbiers">
        Choisissez votre barbier à la réservation, ou laissez-nous vous placer avec le premier disponible.
      </PageHead>
      <div className="wrap pb-16">
        {site.team.length ? <TeamGrid team={site.team} details /> : <p className="text-muted-foreground">L&apos;équipe sera bientôt présentée ici.</p>}
        <div className="mt-10">
          <Link href="/reservation" className="btn-dark">
            Réserver
          </Link>
        </div>
      </div>
    </>
  );
}
