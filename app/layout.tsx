import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { getSite } from "@/lib/sss";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const baseMetadata: Metadata = {
  title: "Bénédiction Barber | Barbershop à Biyem-Assi, Yaoundé",
  description:
    "Barbershop à Biyem-Assi, face au collège Fleming, Yaoundé. Coupes, dégradés, nattes, barbe et soins. Sans rendez-vous, ouvert tous les jours.",
  keywords: "barbier Yaoundé, coiffure homme Yaoundé, barber shop Biyem-Assi, tresses Yaoundé, dégradé Cameroun",
  icons: { icon: "/logo.png", shortcut: "/logo.png", apple: "/logo.png" },
  openGraph: {
    title: "Bénédiction Barber | Barbershop à Yaoundé",
    description: "Coupes, dégradés, nattes, barbe et soins à Biyem-Assi, Yaoundé.",
    locale: "fr_CM",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#faf9f6", width: "device-width", initialScale: 1 };

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  const image = site.gallery[0]?.url ?? site.bannerUrl;
  return {
    ...baseMetadata,
    openGraph: { ...baseMetadata.openGraph, ...(image ? { images: [{ url: image, alt: site.name }] } : {}) },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
