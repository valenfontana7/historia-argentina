import {
  KICKER_EFEMERIDE_SUGERIDA,
  mensajeEfemerideSugerida,
} from "@/lib/copy";

type Props = {
  fechaConsultada: string;
  fechaEfemeride: string;
};

export function AvisoEfemerideSugerida({ fechaConsultada, fechaEfemeride }: Props) {
  return (
    <div
      className="rounded-sm border border-oro/30 bg-fondo-2 px-5 py-4 text-center"
      role="status"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-oro">
        {KICKER_EFEMERIDE_SUGERIDA}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-tinta-suave">
        {mensajeEfemerideSugerida(fechaConsultada, fechaEfemeride)}
      </p>
    </div>
  );
}
