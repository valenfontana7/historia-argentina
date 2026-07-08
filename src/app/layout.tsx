import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SiteShellWrapper } from "@/components/SiteShellWrapper";
import { metadataSitio } from "@/lib/seo/metadata";
import { grafoSitioJsonLd } from "@/lib/seo/jsonld";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = metadataSitio;

const jsonLdGlobal = grafoSitioJsonLd();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="grano flex min-h-full flex-col">
        <a
          href="#contenido-principal"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-oro focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-fondo"
        >
          Saltar al contenido
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGlobal) }}
        />
        <SiteShellWrapper>{children}</SiteShellWrapper>
        <Analytics />
      </body>
    </html>
  );
}
