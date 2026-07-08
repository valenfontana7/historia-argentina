import { sitio } from "@/lib/site.config";

type Props = {
  tamano: number;
  radio?: number;
};

/** Marca «A» para favicon, apple-icon y manifest. */
export function MarcaArgentIcono({ tamano, radio = Math.round(tamano * 0.18) }: Props) {
  const letra = Math.round(tamano * 0.58);
  return (
    <div
      style={{
        width: tamano,
        height: tamano,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, #0c0a08 0%, #141b28 100%)",
        borderRadius: radio,
        border: `${Math.max(1, Math.round(tamano / 24))}px solid #c6a15b`,
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: letra,
          fontWeight: 700,
          color: "#c6a15b",
          fontFamily: "serif",
          lineHeight: 1,
          marginTop: -Math.round(tamano * 0.04),
        }}
      >
        {sitio.nombre.charAt(0)}
      </div>
    </div>
  );
}
