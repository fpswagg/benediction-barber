import Link from "next/link";
import { getSite } from "@/lib/sss";
import { PageHead } from "@/components/info";
import { GalleryGrid } from "@/components/gallery-grid";

export const revalidate = 60;

export const metadata = {
  title: "Galerie | Bénédiction Barber Yaoundé",
  description: "Coupes, dégradés, nattes, twists et barbe : les réalisations de Bénédiction Barber, photographiées au salon.",
};

export default async function GalleryPage() {
  const site = await getSite();
  return (
    <>
      <PageHead eyebrow="Réalisations" title="Galerie">
        De vraies coupes, faites et photographiées au salon.
      </PageHead>
      <GalleryGrid items={site.gallery} />
      <div className="wrap py-12">
        <Link href="/contact" className="btn-dark">
          Envie du même style ? Passez au salon
        </Link>
      </div>
    </>
  );
}
