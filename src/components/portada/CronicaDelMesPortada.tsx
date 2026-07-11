"use client";

import Link from "next/link";
import { FichaExhibicion } from "@/components/cronicas/FichaExhibicion";
import { useStorageSnapshot } from "@/lib/engagement/client-storage-sync";
import { tieneVisitaOnboarding } from "@/lib/engagement/storage";
import type { CronicaMeta } from "@/content/cronicas/registro";

type Props = {
  cronica: CronicaMeta;
};

export function CronicaDelMesPortada({ cronica }: Props) {
  const mostrar = useStorageSnapshot(tieneVisitaOnboarding, false);

  if (!mostrar) {
    return (
      <section className="mx-auto max-w-6xl px-5 py-12">
        <p className="text-center text-sm text-tinta-tenue">
          También podés empezar por{" "}
          <Link
            href={`/cronicas/${cronica.slug}`}
            className="text-oro-claro underline-offset-4 hover:underline"
          >
            esta exhibición destacada
          </Link>
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <h2 className="titulo-display shrink-0 text-2xl font-medium text-oro">
            Exhibición destacada
          </h2>
          <div className="filete w-full" />
        </div>
      </div>
      <div className="mt-10">
        <FichaExhibicion cronica={cronica} esMecenas={false} variante="destacada" />
      </div>
    </section>
  );
}
