import { diasConEfemerideEnArchivo } from "@/data/efemerides";

type Props = {
  fechaConsultada: string;
  fechaEfemeride: string;
};

/** Aviso cuando la efeméride mostrada no corresponde al día consultado en el archivo. */
export function AvisoEfemerideSugerida({ fechaConsultada, fechaEfemeride }: Props) {
  const total = diasConEfemerideEnArchivo();

  return (
    <div
      className="rounded-sm border border-oro/30 bg-fondo-2 px-5 py-4 text-center"
      role="status"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-oro">Del archivo · rotación editorial</p>
      <p className="mt-2 text-sm leading-relaxed text-tinta-suave">
        {fechaConsultada} todavía no tiene efeméride propia en el archivo ({total}{" "}
        historias). Para este día elegimos una rotación curada:{" "}
        <span className="text-tinta">{fechaEfemeride}</span>.
      </p>
    </div>
  );
}
