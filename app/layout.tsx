import type React from "react";
import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Suspense } from "react";

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

export const metadata: Metadata = {
  title: "Bénédiction Barber | Salon de Coiffure Urbain à Yaoundé",
  description:
    "Salon de coiffure professionnel à Yaoundé. Coupes modernes, tresses, bain de visage, pédicure. Réservez votre rendez-vous en ligne.",
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
    images: [
      {
        url: "/logo.png",
        width: 32,
        height: 32,
        alt: "Bénédiction Barber Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${bebasNeue.variable}`}>
      <body className="font-sans antialiased">
        <Navigation />
        <Suspense fallback={<div className="min-h-screen" />}>
          <main className="min-h-screen">{children}</main>
        </Suspense>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
