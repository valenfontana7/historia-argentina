"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NavMobileInferior } from "@/components/navigation/NavMobileInferior";

type Props = {
  children: React.ReactNode;
};

/**
 * Shell del sitio. El estado mecenas se resuelve en el cliente vía /api/auth/estado
 * para no dinamizar todo el layout con cookies/Prisma.
 */
export function SiteShell({ children }: Props) {
  const pathname = usePathname();
  const esAdmin = pathname.startsWith("/admin");
  const [esMecenas, setEsMecenas] = useState(false);

  useEffect(() => {
    let cancelado = false;
    fetch("/api/auth/estado")
      .then((r) => r.json())
      .then((data: { mecenas?: boolean }) => {
        if (!cancelado) setEsMecenas(Boolean(data.mecenas));
      })
      .catch(() => {
        if (!cancelado) setEsMecenas(false);
      });
    return () => {
      cancelado = true;
    };
  }, [pathname]);

  if (esAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header esMecenas={esMecenas} />
      <main id="contenido-principal" className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>
      <Footer esMecenas={esMecenas} />
      <NavMobileInferior />
    </>
  );
}
