import {
  BaseMapaConoSur,
  BrújulaDecorativa,
  ILU,
  MarcadorBatalla,
  MarcadorCiudad,
  RUTAS_ILU,
  RutaIlustrada,
} from "@/components/scrolly/MapaConoSurIlustrado";

/**
 * Camino del norte: tres ejércitos hacia el Alto Perú. Tres derrotas.
 * La ruta sube desde Buenos Aires, pasa por Salta y se pierde en la meseta boliviana.
 */
export function PlanNorte() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#080b10]">
      <BaseMapaConoSur>
        <RutaIlustrada
          d={RUTAS_ILU.planNorte}
          color="var(--carmesi)"
          grosor={2.8}
          punteada
          glow="url(#glow-carmesi)"
        />
        <MarcadorCiudad {...ILU.buenosAires} etiqueta="der" />
        <MarcadorCiudad {...ILU.salta} etiqueta="arriba" color="#a8b4c8" />
        <MarcadorCiudad {...ILU.lima} etiqueta="izq" color="#a8b4c8" />
        <MarcadorBatalla
          x={ILU.huaqui.x}
          y={ILU.huaqui.y}
          anio="1811"
          nombre="Huaqui"
          lx={72}
          ly={48}
        />
        <MarcadorBatalla
          x={ILU.vilcapugio.x}
          y={ILU.vilcapugio.y}
          anio="1813"
          nombre="Vilcapugio"
          lx={228}
          ly={148}
        />
        <MarcadorBatalla
          x={ILU.ayohuma.x}
          y={ILU.ayohuma.y}
          anio="1813"
          nombre="Ayohuma"
          lx={268}
          ly={62}
        />
        <BrújulaDecorativa />
      </BaseMapaConoSur>
    </div>
  );
}

/**
 * Plan de San Martín: Cuyo → cordillera → Chile → Lima por mar.
 */
export function PlanAndes() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#080b10]">
      <BaseMapaConoSur>
        <RutaIlustrada d={RUTAS_ILU.planTierra} color="var(--oro)" grosor={3} glow="url(#glow-oro)" />
        <RutaIlustrada d={RUTAS_ILU.planCruce} color="var(--oro-claro)" grosor={3.5} glow="url(#glow-oro)" />
        <RutaIlustrada
          d={RUTAS_ILU.planMar}
          color="var(--celeste)"
          grosor={2.5}
          punteada
        />
        <text x={155} y={138} fill="var(--celeste)" fontSize="16" opacity="0.7">
          ⛵
        </text>
        <MarcadorCiudad {...ILU.buenosAires} etiqueta="der" />
        <MarcadorCiudad {...ILU.mendoza} etiqueta="arriba" color="var(--oro-claro)" />
        <MarcadorCiudad {...ILU.santiago} etiqueta="izq" color="var(--oro-claro)" />
        <MarcadorCiudad {...ILU.lima} etiqueta="izq" />
        <BrújulaDecorativa />
      </BaseMapaConoSur>
    </div>
  );
}
