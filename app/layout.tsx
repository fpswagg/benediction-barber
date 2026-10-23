import type React from "react";
import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Suspense } from "react";
import { Assistant } from "@/components/assistant";
import { getSite } from "@/lib/sss";
import { SSS_API_URL } from "@/lib/config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  const image = site.gallery[0]?.url ?? site.bannerUrl;
  return {
    ...baseMetadata,
    openGraph: { ...baseMetadata.openGraph, ...(image ? { images: [{ url: image, alt: site.name }] } : {}) },
  };
}

const baseMetadata: Metadata = {
  title: "Bénédiction Barber | Salon de Coiffure Urbain à Yaoundé",
  description:
    "Salon de coiffure professionnel à Yaoundé. Coupes, dégradés, nattes, barbe et soins. Ouvert tous les jours de 8h à 22h. Réservez votre rendez-vous en ligne.",
  keywords:
    "barbier Yaoundé, coiffure homme Yaoundé, barber shop Yaoundé, tresses Yaoundé, coupe moderne Cameroun",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Bénédiction Barber | Salon de Coiffure Urbain à Yaoundé",
    description:
      "Salon de coiffure professionnel à Yaoundé. Coupes modernes, tresses, bain de visage.",
    locale: "fr_CM",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getSite();
  return (
    <html lang="fr" className={`${inter.variable} ${bebasNeue.variable}`}>
      <body className="font-sans antialiased">
        <Navigation />
        <Suspense fallback={<div className="min-h-screen" />}>
          <main className="min-h-screen">{children}</main>
        </Suspense>
        <Footer site={site} />
        {site.assistant ? <Assistant apiUrl={SSS_API_URL} assistant={site.assistant} /> : null}
        <Analytics />
      </body>
    </html>
  );
}
