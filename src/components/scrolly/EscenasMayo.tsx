import { BaseMapaMayo, HitoMayo, ILU_MAYO } from "@/components/scrolly/MapaMayoIlustrado";

/**
 * 24 de mayo, madrugada: el arreglo con Cisneros al frente de una Junta
 * que todavía habla en nombre de la corona.
 */
export function MayoVirreinato() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#080b10]">
      <BaseMapaMayo>
        <rect x={628} y={298} width={52} height={36} fill="#1a1420" stroke="#6a3040" strokeWidth="1.2" rx="2" />
        <circle cx={648} cy={318} r={22} fill="#6a3040" opacity="0.12" />
        <text x={648} y={322} fill="#c07060" fontSize="14" textAnchor="middle" fontWeight="bold">
          V
        </text>
        <HitoMayo {...ILU_MAYO.cabildo} color="#c07060" lado="abajo" />
        <HitoMayo {...ILU_MAYO.fuerte} color="#8a94a8" lado="der" />
        <text x={468} y={120} fill="#c07060" fontSize="11" letterSpacing="2" textAnchor="middle">
          JUNTA CON CISNEROS
        </text>
        <text x={468} y={138} fill="#8d8271" fontSize="9" textAnchor="middle" opacity="0.9">
          El virrey sigue siendo el centro del poder
        </text>
        {/* Milicias ausentes o en la periferia, tenues */}
        <circle cx={412} cy={162} r={8} fill="none" stroke="#3a4860" strokeWidth="1" opacity="0.5" />
        <circle cx={198} cy={248} r={8} fill="none" stroke="#3a4860" strokeWidth="1" opacity="0.5" />
      </BaseMapaMayo>
    </div>
  );
}

/**
 * 25 de mayo, mediodía: Primera Junta en el Fuerte, milicias en la Plaza,
 * el virreinato sin dueño legítimo.
 */
export function MayoJunta() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#080b10]">
      <BaseMapaMayo>
        <circle cx={712} cy={278} r={24} fill="var(--oro)" opacity="0.14" />
        <circle
          cx={712}
          cy={278}
          r={14}
          fill="none"
          stroke="var(--oro)"
          strokeWidth="1.5"
          filter="url(#glow-mayo-oro)"
        />
        <HitoMayo {...ILU_MAYO.fuerte} color="var(--oro-claro)" lado="der" />
        <HitoMayo {...ILU_MAYO.cabildo} color="var(--celeste)" lado="abajo" />
        <HitoMayo {...ILU_MAYO.patricios} color="var(--celeste)" lado="arriba" />
        <HitoMayo {...ILU_MAYO.arribeños} color="var(--celeste)" lado="izq" />
        {/* Rutas de milicias ya dibujadas */}
        <path
          d="M412 162 C512 198 612 238 684 268"
          fill="none"
          stroke="var(--celeste)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M198 248 C368 262 528 272 648 282"
          fill="none"
          stroke="var(--celeste)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        <circle cx={684} cy={278} r={32} fill="var(--celeste)" opacity="0.06" />
        <text x={468} y={120} fill="var(--oro-claro)" fontSize="11" letterSpacing="2" textAnchor="middle">
          PRIMERA JUNTA
        </text>
        <text x={468} y={138} fill="#8d8271" fontSize="9" textAnchor="middle" opacity="0.9">
          Nueve vocales · el Fuerte cambia de manos
        </text>
      </BaseMapaMayo>
    </div>
  );
}
