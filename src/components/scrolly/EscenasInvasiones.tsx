import {
  BaseMapaPlata,
  ILU_PLATA,
  MarcadorPlata,
  RUTAS_PLATA,
  RutaPlata,
  Velero,
} from "@/components/scrolly/MapaRioPlataIlustrado";

/**
 * Junio de 1806: la flota de Popham remonta el estuario,
 * Beresford desembarca en Quilmes y el virrey huye a Córdoba.
 */
export function InvasionPrimera() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#080b10]">
      <BaseMapaPlata>
        <RutaPlata
          d={RUTAS_PLATA.invasionMar}
          color="var(--carmesi)"
          grosor={2.8}
          punteada
          glow="url(#glow-plata-carmesi)"
        />
        <RutaPlata
          d={RUTAS_PLATA.invasionTierra}
          color="var(--carmesi)"
          grosor={3.2}
          glow="url(#glow-plata-carmesi)"
        />
        <RutaPlata d={RUTAS_PLATA.huidaVirrey} color="#8d8271" grosor={1.8} punteada />
        <Velero x={640} y={238} color="#c07060" />
        <Velero x={480} y={244} color="#c07060" />
        <Velero x={330} y={252} color="#c07060" />
        <text x={36} y={244} fill="#8d8271" fontSize="10" opacity="0.85">
          El virrey huye →
        </text>
        <MarcadorPlata {...ILU_PLATA.buenosAires} etiqueta="arriba" color="var(--oro-claro)" />
        <MarcadorPlata {...ILU_PLATA.quilmes} etiqueta="abajo" color="#c07060" />
        <MarcadorPlata {...ILU_PLATA.montevideo} etiqueta="arriba" color="#a8b4c8" />
      </BaseMapaPlata>
    </div>
  );
}

/**
 * Agosto de 1806: Liniers junta tropas en Montevideo, cruza el río
 * hasta Las Conchas y retoma la ciudad desde el norte.
 */
export function Reconquista() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#080b10]">
      <BaseMapaPlata>
        <RutaPlata
          d={RUTAS_PLATA.reconquistaRio}
          color="var(--celeste)"
          grosor={2.8}
          punteada
          glow="url(#glow-plata-oro)"
        />
        <RutaPlata
          d={RUTAS_PLATA.reconquistaTierra}
          color="var(--oro)"
          grosor={3.4}
          glow="url(#glow-plata-oro)"
        />
        <Velero x={380} y={128} color="var(--celeste)" />
        <Velero x={190} y={168} color="var(--celeste)" />
        <MarcadorPlata {...ILU_PLATA.buenosAires} etiqueta="abajo" color="var(--oro-claro)" />
        <MarcadorPlata {...ILU_PLATA.lasConchas} etiqueta="izq" color="var(--celeste)" />
        <MarcadorPlata {...ILU_PLATA.colonia} etiqueta="arriba" color="#a8b4c8" />
        <MarcadorPlata {...ILU_PLATA.montevideo} etiqueta="arriba" color="var(--celeste)" />
      </BaseMapaPlata>
    </div>
  );
}
