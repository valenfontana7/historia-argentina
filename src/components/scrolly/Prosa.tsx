import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

type ProsaProps = {
  children: ReactNode;
  capitular?: boolean;
};

/** Bloque de texto editorial centrado, usado entre escenas de una crónica. */
export function Prosa({ children, capitular = false }: ProsaProps) {
  return (
    <Reveal className="mx-auto max-w-2xl px-5 py-14">
      <div className={`prosa ${capitular ? "capitular" : ""}`}>{children}</div>
    </Reveal>
  );
}
