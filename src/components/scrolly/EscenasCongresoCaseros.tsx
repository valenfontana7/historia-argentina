import { BaseMapaCongreso, HitoCongreso, ILU_CONGRESO } from "@/components/scrolly/MapaCongresoIlustrado";
import { BaseMapaCaseros, HitoCaseros, ILU_CASEROS } from "@/components/scrolly/MapaCaserosIlustrado";

/** Antes del Acta: provincias sin un centro político común. */
export function CongresoAntes() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#080b10]">
      <BaseMapaCongreso>
        <HitoCongreso {...ILU_CONGRESO.buenosAires} color="#6a3040" lado="abajo" />
        <HitoCongreso {...ILU_CONGRESO.salta} color="#8d8271" lado="arriba" />
        <HitoCongreso {...ILU_CONGRESO.cuyano} color="#8d8271" lado="izq" />
        <HitoCongreso {...ILU_CONGRESO.litoral} color="#8d8271" lado="der" />
        <text x={450} y={180} fill="#c07060" fontSize="11" letterSpacing="2" textAnchor="middle">
          SIN ACTA
        </text>
        <text x={450} y={198} fill="#8d8271" fontSize="9" textAnchor="middle" opacity="0.9">
          Guerra sí · independencia formal, no
        </text>
      </BaseMapaCongreso>
    </div>
  );
}

/** Después del 9 de julio: el Acta une el mapa. */
export function CongresoIndependencia() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#080b10]">
      <BaseMapaCongreso>
        <circle cx={450} cy={275} r={32} fill="var(--oro)" opacity="0.14" />
        <path
          d="M720 420 C620 380 520 320 470 295"
          fill="none"
          stroke="var(--oro)"
          strokeWidth="2"
          opacity="0.7"
        />
        <path
          d="M280 140 C340 180 400 240 430 270"
          fill="none"
          stroke="var(--oro)"
          strokeWidth="2"
          opacity="0.7"
        />
        <path
          d="M200 360 C300 330 380 300 430 285"
          fill="none"
          stroke="var(--oro)"
          strokeWidth="2"
          opacity="0.7"
        />
        <HitoCongreso {...ILU_CONGRESO.casa} color="var(--oro-claro)" lado="abajo" />
        <text x={450} y={180} fill="var(--oro-claro)" fontSize="11" letterSpacing="2" textAnchor="middle">
          9 DE JULIO
        </text>
        <text x={450} y={198} fill="#8d8271" fontSize="9" textAnchor="middle" opacity="0.9">
          Las Provincias Unidas se declaran independientes
        </text>
      </BaseMapaCongreso>
    </div>
  );
}

/** Rosas domina el mapa antes de Caseros. */
export function CaserosRosas() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#080b10]">
      <BaseMapaCaseros>
        <circle cx={520} cy={260} r={40} fill="var(--carmesi)" opacity="0.12" />
        <HitoCaseros {...ILU_CASEROS.rosas} color="var(--carmesi)" lado="arriba" />
        <HitoCaseros {...ILU_CASEROS.buenosAires} color="#8d8271" lado="der" />
        <text x={450} y={180} fill="var(--carmesi)" fontSize="11" letterSpacing="2" textAnchor="middle">
          ORDEN ROSISTA
        </text>
        <text x={450} y={198} fill="#8d8271" fontSize="9" textAnchor="middle" opacity="0.9">
          Veinte años de poder concentrado en Buenos Aires
        </text>
      </BaseMapaCaseros>
    </div>
  );
}

/** Urquiza y el Ejército Grande rompen el orden. */
export function CaserosUrquiza() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#080b10]">
      <BaseMapaCaseros>
        <path
          d="M180 300 C300 290 380 285 450 275"
          fill="none"
          stroke="var(--oro)"
          strokeWidth="2.5"
          opacity="0.85"
        />
        <circle cx={420} cy={280} r={28} fill="var(--oro)" opacity="0.12" />
        <HitoCaseros {...ILU_CASEROS.urquiza} color="var(--celeste)" lado="abajo" />
        <HitoCaseros {...ILU_CASEROS.campo} color="var(--oro)" lado="arriba" />
        <HitoCaseros {...ILU_CASEROS.buenosAires} color="var(--oro-claro)" lado="der" />
        <text x={450} y={180} fill="var(--oro-claro)" fontSize="11" letterSpacing="2" textAnchor="middle">
          CASEROS
        </text>
        <text x={450} y={198} fill="#8d8271" fontSize="9" textAnchor="middle" opacity="0.9">
          El Ejército Grande abre el camino a otra Argentina
        </text>
      </BaseMapaCaseros>
    </div>
  );
}
