import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

type ProsaProps = {
  children: ReactNode;
  capitular?: boolean;
  fondo?: "default" | "papel";
};

/** Bloque de texto editorial centrado, usado entre escenas de una crónica. */
export function Prosa({ children, capitular = false, fondo = "default" }: ProsaProps) {
  const envoltorio =
    fondo === "papel" ? (
      <section className="textura-papel relative py-14">
        <div className="relative mx-auto max-w-2xl px-5">
          <div className={`prosa ${capitular ? "capitular" : ""}`}>{children}</div>
        </div>
      </section>
    ) : null;

  if (envoltorio) {
    return <Reveal>{envoltorio}</Reveal>;
  }

  return (
    <Reveal className="mx-auto max-w-2xl px-5 py-14">
      <div className={`prosa ${capitular ? "capitular" : ""}`}>{children}</div>
    </Reveal>
  );
}
