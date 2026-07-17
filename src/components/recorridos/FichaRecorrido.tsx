import Image from "next/image";
import { TransicionLink } from "@/components/navigation/TransicionLink";
import type { Recorrido } from "@/data/recorridos";
import { esRecorridoMecenas } from "@/data/recorridos";
import { imagenDeRecorrido } from "@/lib/recorridos/imagen";
import {
  CTA_INICIAR_VISITA,
  etiquetaEstacionesVisita,
} from "@/lib/copy";
import { EtiquetaCta } from "@/components/ui/FlechaCta";

type Props = {
  recorrido: Recorrido;
  conAudioguia?: boolean;
};

/** Card gráfica de un recorrido guiado (listado). */
export function FichaRecorrido({
  recorrido,
  conAudioguia = false,
}: Props) {
  const imagen = imagenDeRecorrido(recorrido);
  const mecenas = esRecorridoMecenas(recorrido);
  const meta = `${recorrido.duracion} · ${etiquetaEstacionesVisita(recorrido.pasos.length)}`;

  return (
    <TransicionLink
      href={`/recorridos/${recorrido.slug}`}
      className="group relative flex h-full min-h-[280px] flex-col justify-end overflow-hidden rounded-sm border border-linea bg-fondo-3 transition-colors hover:border-oro/45 sm:min-h-[320px]"
    >
      {imagen ? (
        <Image
          src={imagen}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-top opacity-55 sepia-[0.1] brightness-[0.75] transition-transform duration-700 ease-out group-hover:scale-105"
          aria-hidden
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-fondo-3 via-fondo-2 to-fondo" />
      )}
      {/* Velo: foto arriba, texto siempre sobre oscuro */}
      <div className="absolute inset-0 bg-linear-to-t from-fondo via-fondo/70 to-fondo/25" />
      <div className="absolute inset-x-0 bottom-0 h-[65%] bg-linear-to-t from-fondo from-35% via-fondo/90 to-transparent" />

      {(mecenas || conAudioguia) && (
        <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1.5">
          {mecenas && (
            <span className="rounded-full border border-oro/40 bg-fondo/85 px-2.5 py-0.5 text-[0.55rem] uppercase tracking-[0.16em] text-oro backdrop-blur-sm">
              Mecenas
            </span>
          )}
          {conAudioguia && (
            <span className="rounded-full border border-oro/30 bg-fondo/85 px-2.5 py-0.5 text-[0.55rem] uppercase tracking-[0.16em] text-oro-claro backdrop-blur-sm">
              Audioguía
            </span>
          )}
        </div>
      )}

      <div className="relative z-10 p-6 sm:p-7">
        <p className="text-[0.55rem] uppercase tracking-[0.2em] text-oro-claro drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
          {meta}
        </p>
        <h2 className="titulo-display mt-2 text-2xl font-semibold leading-snug text-tinta drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] transition-colors group-hover:text-oro-claro sm:text-3xl">
          {recorrido.titulo}
        </h2>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#e4dcc8]">
          {recorrido.subtitulo}
        </p>
        <p className="mt-5 text-[0.65rem] uppercase tracking-[0.18em] text-oro">
          <EtiquetaCta>{CTA_INICIAR_VISITA}</EtiquetaCta>
        </p>
      </div>
    </TransicionLink>
  );
}
