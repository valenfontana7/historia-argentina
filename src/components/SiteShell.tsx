"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type Props = {
  children: React.ReactNode;
  esMecenas: boolean;
};

export function SiteShell({ children, esMecenas }: Props) {
  const pathname = usePathname();
  const esAdmin = pathname.startsWith("/admin");

  if (esAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header esMecenas={esMecenas} />
      <main id="contenido-principal" className="flex-1">
        {children}
      </main>
      <Footer esMecenas={esMecenas} />
    </>
  );
}
