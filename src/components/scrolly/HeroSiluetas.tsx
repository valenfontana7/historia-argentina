import type { VarianteHero } from "@/data/cronicas-visuales";

type SiluetaProps = { className?: string };

/** Siluetas SVG por variante de hero de crónica. */
export function SiluetaHero({ variante, className = "" }: { variante: VarianteHero; className?: string }) {
  switch (variante) {
    case "andes":
      return <SiluetaAndes className={className} />;
    case "rio-plata":
      return <SiluetaRioPlata className={className} />;
    case "mayo":
      return <SiluetaMayo className={className} />;
    case "jujuy":
      return <SiluetaJujuy className={className} />;
    case "tucuman":
      return <SiluetaTucuman className={className} />;
    case "pampa":
      return <SiluetaPampa className={className} />;
    case "atlantico":
      return <SiluetaAtlantico className={className} />;
    default: {
      const _exhaustive: never = variante;
      return _exhaustive;
    }
  }
}

export const gradientesHero: Record<VarianteHero, string> = {
  andes: "linear-gradient(180deg, #05070d 0%, #0a1020 45%, #16202f 78%, #0c0a08 100%)",
  "rio-plata": "linear-gradient(180deg, #050a10 0%, #0a1820 40%, #102830 75%, #0c0a08 100%)",
  mayo: "linear-gradient(180deg, #120e08 0%, #1a1408 35%, #141109 70%, #0c0a08 100%)",
  jujuy: "linear-gradient(180deg, #140f08 0%, #1a140c 40%, #16100a 75%, #0c0a08 100%)",
  tucuman: "linear-gradient(180deg, #120e08 0%, #1a160c 40%, #141109 75%, #0c0a08 100%)",
  pampa: "linear-gradient(180deg, #0e1208 0%, #161a0c 45%, #121408 78%, #0c0a08 100%)",
  atlantico: "linear-gradient(180deg, #050a12 0%, #0a1525 40%, #102035 75%, #0c0a08 100%)",
};

function SiluetaAndes({ className }: SiluetaProps) {
  return (
    <>
      <svg data-capa="fondo" aria-hidden className={`absolute bottom-0 left-0 w-full ${className}`} viewBox="0 0 1200 300" preserveAspectRatio="none">
        <path d="M0 300 L0 190 L90 120 L170 175 L260 90 L350 160 L430 70 L520 150 L610 55 L700 140 L790 85 L880 165 L960 100 L1050 170 L1130 115 L1200 180 L1200 300 Z" fill="#1b2434" />
        <path d="M430 70 L455 95 L470 82 L490 108 L430 108 Z M610 55 L640 88 L660 74 L610 90 Z" fill="#39465c" />
      </svg>
      <svg data-capa="media" aria-hidden className={`absolute -bottom-6 left-0 w-full ${className}`} viewBox="0 0 1200 300" preserveAspectRatio="none">
        <path d="M0 300 L0 220 L120 140 L230 200 L340 105 L470 195 L580 90 L710 190 L830 120 L950 205 L1070 140 L1200 215 L1200 300 Z" fill="#121826" />
        <path d="M340 105 L370 140 L390 122 L410 150 L340 148 Z M580 90 L615 130 L640 112 L580 128 Z" fill="#2a3547" />
      </svg>
      <svg data-capa="frente" aria-hidden className={`absolute -bottom-10 left-0 w-full ${className}`} viewBox="0 0 1200 260" preserveAspectRatio="none">
        <path d="M0 260 L0 210 L150 130 L300 205 L450 110 L620 210 L780 125 L940 215 L1090 150 L1200 205 L1200 260 Z" fill="#080a10" />
      </svg>
    </>
  );
}

function SiluetaRioPlata({ className }: SiluetaProps) {
  return (
    <>
      {/* Agua */}
      <svg data-capa="fondo" aria-hidden className={`absolute bottom-0 left-0 w-full ${className}`} viewBox="0 0 1200 300" preserveAspectRatio="none">
        <path d="M0 300 L0 200 Q300 180 600 195 Q900 210 1200 185 L1200 300 Z" fill="#0c1820" />
        <path d="M0 240 Q200 225 400 235 Q600 245 800 230 Q1000 215 1200 225 L1200 300 L0 300 Z" fill="#101e28" opacity="0.6" />
      </svg>
      {/* Costa / edificios */}
      <svg data-capa="media" aria-hidden className={`absolute bottom-0 left-0 w-full ${className}`} viewBox="0 0 1200 280" preserveAspectRatio="none">
        <rect x="0" y="160" width="1200" height="120" fill="#121826" />
        <rect x="40" y="120" width="60" height="80" fill="#1a2230" />
        <rect x="130" y="90" width="50" height="110" fill="#141b28" />
        <rect x="210" y="110" width="70" height="90" fill="#1a2230" />
        <rect x="320" y="80" width="55" height="120" fill="#121826" />
        <rect x="420" y="100" width="80" height="100" fill="#1a2230" />
        <rect x="540" y="70" width="45" height="130" fill="#141b28" />
        <rect x="620" y="95" width="65" height="105" fill="#1a2230" />
        <rect x="730" y="85" width="55" height="115" fill="#121826" />
        <rect x="820" y="105" width="75" height="95" fill="#1a2230" />
        <rect x="930" y="75" width="50" height="125" fill="#141b28" />
        <rect x="1020" y="100" width="70" height="100" fill="#1a2230" />
        <rect x="1120" y="115" width="80" height="85" fill="#121826" />
      </svg>
      <svg data-capa="frente" aria-hidden className={`absolute -bottom-4 left-0 w-full ${className}`} viewBox="0 0 1200 200" preserveAspectRatio="none">
        <path d="M0 200 L0 170 L1200 155 L1200 200 Z" fill="#080a10" />
      </svg>
    </>
  );
}

function SiluetaMayo({ className }: SiluetaProps) {
  return (
    <>
      <svg data-capa="fondo" aria-hidden className={`absolute bottom-0 left-0 w-full ${className}`} viewBox="0 0 1200 300" preserveAspectRatio="none">
        <rect x="0" y="180" width="1200" height="120" fill="#1a1408" />
        <ellipse cx="600" cy="200" rx="400" ry="40" fill="#141109" opacity="0.5" />
      </svg>
      <svg data-capa="media" aria-hidden className={`absolute bottom-0 left-0 w-full ${className}`} viewBox="0 0 1200 300" preserveAspectRatio="none">
        {/* Cabildo central */}
        <rect x="480" y="80" width="240" height="160" fill="#1a2230" />
        <rect x="560" y="30" width="80" height="60" fill="#222c3c" />
        <path d="M550 30 L600 0 L650 30 Z" fill="#2a3547" />
        <rect x="500" y="120" width="35" height="50" rx="16" fill="#141b28" />
        <rect x="555" y="120" width="35" height="50" rx="16" fill="#141b28" />
        <rect x="610" y="120" width="35" height="50" rx="16" fill="#141b28" />
        <rect x="665" y="120" width="35" height="50" rx="16" fill="#141b28" />
        {/* Edificios laterales */}
        <rect x="200" y="130" width="100" height="110" fill="#141b28" />
        <rect x="340" y="110" width="80" height="130" fill="#1a2230" />
        <rect x="820" y="120" width="90" height="120" fill="#141b28" />
        <rect x="960" y="140" width="70" height="100" fill="#1a2230" />
      </svg>
      <svg data-capa="frente" aria-hidden className={`absolute -bottom-6 left-0 w-full ${className}`} viewBox="0 0 1200 200" preserveAspectRatio="none">
        <path d="M0 200 L0 175 L1200 165 L1200 200 Z" fill="#080a10" />
        {/* Faroles */}
        <circle cx="300" cy="170" r="4" fill="#c6a15b" opacity="0.5" />
        <circle cx="900" cy="170" r="4" fill="#c6a15b" opacity="0.5" />
      </svg>
    </>
  );
}

function SiluetaJujuy({ className }: SiluetaProps) {
  return (
    <>
      <svg data-capa="fondo" aria-hidden className={`absolute bottom-0 left-0 w-full ${className}`} viewBox="0 0 1200 300" preserveAspectRatio="none">
        <path d="M0 300 L0 160 L150 100 L300 140 L450 70 L600 120 L750 50 L900 110 L1050 60 L1200 100 L1200 300 Z" fill="#2a2018" opacity="0.7" />
        <path d="M0 300 L0 200 L200 150 L400 180 L600 130 L800 170 L1000 140 L1200 175 L1200 300 Z" fill="#1a1408" />
      </svg>
      <svg data-capa="media" aria-hidden className={`absolute -bottom-4 left-0 w-full ${className}`} viewBox="0 0 1200 280" preserveAspectRatio="none">
        <path d="M0 280 L0 210 L180 170 L360 200 L540 160 L720 195 L900 155 L1080 185 L1200 165 L1200 280 Z" fill="#16100a" />
        <path d="M450 70 L480 110 L510 85 L540 120 L450 115 Z" fill="#3a2a1a" opacity="0.5" />
        <path d="M750 50 L780 90 L810 70 L840 100 L750 95 Z" fill="#3a2a1a" opacity="0.4" />
      </svg>
      <svg data-capa="frente" aria-hidden className={`absolute -bottom-8 left-0 w-full ${className}`} viewBox="0 0 1200 220" preserveAspectRatio="none">
        <path d="M0 220 L0 195 L1200 180 L1200 220 Z" fill="#080a10" />
        <ellipse cx="600" cy="175" rx="300" ry="20" fill="#b8864a" opacity="0.08" />
      </svg>
    </>
  );
}

function SiluetaTucuman({ className }: SiluetaProps) {
  return (
    <>
      <svg data-capa="fondo" aria-hidden className={`absolute bottom-0 left-0 w-full ${className}`} viewBox="0 0 1200 300" preserveAspectRatio="none">
        <path d="M0 300 L0 180 L200 140 L400 160 L600 120 L800 150 L1000 110 L1200 145 L1200 300 Z" fill="#1a160c" />
        <ellipse cx="600" cy="190" rx="350" ry="35" fill="#141109" opacity="0.5" />
      </svg>
      <svg data-capa="media" aria-hidden className={`absolute bottom-0 left-0 w-full ${className}`} viewBox="0 0 1200 280" preserveAspectRatio="none">
        <rect x="420" y="90" width="360" height="140" fill="#1a2230" />
        <rect x="480" y="120" width="40" height="55" rx="18" fill="#141b28" />
        <rect x="560" y="120" width="40" height="55" rx="18" fill="#141b28" />
        <rect x="640" y="120" width="40" height="55" rx="18" fill="#141b28" />
        <rect x="720" y="120" width="40" height="55" rx="18" fill="#141b28" />
        <path d="M410 90 L600 40 L790 90 Z" fill="#2a3547" />
        <rect x="200" y="140" width="90" height="90" fill="#141b28" />
        <rect x="910" y="135" width="100" height="95" fill="#141b28" />
      </svg>
      <svg data-capa="frente" aria-hidden className={`absolute -bottom-6 left-0 w-full ${className}`} viewBox="0 0 1200 200" preserveAspectRatio="none">
        <path d="M0 200 L0 175 L1200 165 L1200 200 Z" fill="#080a10" />
        <circle cx="350" cy="168" r="3" fill="#c6a15b" opacity="0.45" />
        <circle cx="850" cy="168" r="3" fill="#c6a15b" opacity="0.45" />
      </svg>
    </>
  );
}

function SiluetaPampa({ className }: SiluetaProps) {
  return (
    <>
      <svg data-capa="fondo" aria-hidden className={`absolute bottom-0 left-0 w-full ${className}`} viewBox="0 0 1200 300" preserveAspectRatio="none">
        <path d="M0 300 L0 200 Q300 185 600 195 Q900 205 1200 180 L1200 300 Z" fill="#1a2010" />
        <path d="M0 240 Q400 220 800 235 Q1000 242 1200 225 L1200 300 L0 300 Z" fill="#141808" opacity="0.7" />
      </svg>
      <svg data-capa="media" aria-hidden className={`absolute -bottom-2 left-0 w-full ${className}`} viewBox="0 0 1200 260" preserveAspectRatio="none">
        <path d="M0 260 L0 210 Q200 195 450 205 Q700 215 950 190 Q1100 180 1200 195 L1200 260 Z" fill="#121608" />
        <ellipse cx="400" cy="200" rx="80" ry="12" fill="#2a3018" opacity="0.4" />
        <ellipse cx="780" cy="195" rx="60" ry="10" fill="#2a3018" opacity="0.35" />
      </svg>
      <svg data-capa="frente" aria-hidden className={`absolute -bottom-8 left-0 w-full ${className}`} viewBox="0 0 1200 200" preserveAspectRatio="none">
        <path d="M0 200 L0 185 L1200 175 L1200 200 Z" fill="#080a10" />
      </svg>
    </>
  );
}

function SiluetaAtlantico({ className }: SiluetaProps) {
  return (
    <>
      <svg data-capa="fondo" aria-hidden className={`absolute bottom-0 left-0 w-full ${className}`} viewBox="0 0 1200 300" preserveAspectRatio="none">
        <path d="M0 300 L0 180 Q200 160 400 175 Q600 190 800 165 Q1000 140 1200 155 L1200 300 Z" fill="#0c1828" />
        <path d="M0 240 Q300 220 600 235 Q900 250 1200 220 L1200 300 L0 300 Z" fill="#101e30" opacity="0.6" />
      </svg>
      <svg data-capa="media" aria-hidden className={`absolute bottom-4 left-0 w-full ${className}`} viewBox="0 0 1200 280" preserveAspectRatio="none">
        <ellipse cx="900" cy="200" rx="55" ry="18" fill="#1a3048" opacity="0.7" />
        <ellipse cx="950" cy="195" rx="25" ry="10" fill="#243850" opacity="0.6" />
        <ellipse cx="920" cy="210" rx="15" ry="6" fill="#1a3048" opacity="0.5" />
        <path d="M0 260 Q400 245 800 255 Q1000 260 1200 248 L1200 300 L0 300 Z" fill="#081420" opacity="0.5" />
      </svg>
      <svg data-capa="frente" aria-hidden className={`absolute -bottom-6 left-0 w-full ${className}`} viewBox="0 0 1200 200" preserveAspectRatio="none">
        <path d="M0 200 L0 185 L1200 175 L1200 200 Z" fill="#080a10" />
      </svg>
    </>
  );
}

/** Mini silueta para cards del índice (versión compacta). */
export function MiniSiluetaHero({ variante }: { variante: VarianteHero }) {
  const viewBoxes: Record<VarianteHero, { path: string; fill: string }> = {
    andes: {
      path: "M0 80 L0 50 L30 25 L60 45 L90 15 L130 40 L160 10 L200 35 L240 5 L280 30 L320 0 L360 25 L400 15 L440 35 L480 20 L520 40 L560 25 L600 35 L640 15 L680 30 L720 10 L760 35 L800 20 L840 40 L880 25 L920 35 L960 15 L1000 30 L1040 20 L1080 35 L1120 25 L1160 40 L1200 30 L1200 80 Z",
      fill: "#1b2434",
    },
    "rio-plata": {
      path: "M0 80 L0 55 Q300 45 600 50 Q900 55 1200 48 L1200 80 Z M0 80 L40 40 L80 55 L120 30 L160 50 L200 35 L240 55 L280 40 L320 50 L360 30 L400 50 L440 35 L480 55 L520 40 L560 50 L600 30 L640 50 L680 35 L720 55 L760 40 L800 50 L840 30 L880 50 L920 35 L960 55 L1000 40 L1040 50 L1080 30 L1120 50 L1160 35 L1200 55 L1200 80 Z",
      fill: "#121826",
    },
    mayo: {
      path: "M0 80 L0 50 L480 20 L520 0 L560 20 L600 0 L640 20 L680 0 L720 20 L1200 50 L1200 80 Z",
      fill: "#1a2230",
    },
    jujuy: {
      path: "M0 80 L0 45 L100 25 L200 40 L300 15 L400 35 L500 10 L600 30 L700 5 L800 25 L900 10 L1000 30 L1100 15 L1200 35 L1200 80 Z",
      fill: "#2a2018",
    },
    tucuman: {
      path: "M0 80 L0 55 L420 35 L480 15 L600 5 L720 15 L780 35 L1200 55 L1200 80 Z",
      fill: "#1a2230",
    },
    pampa: {
      path: "M0 80 L0 50 Q300 40 600 48 Q900 55 1200 42 L1200 80 Z",
      fill: "#1a2010",
    },
    atlantico: {
      path: "M0 80 L0 55 Q300 48 600 52 Q900 45 1200 50 L1200 80 Z",
      fill: "#0c1828",
    },
  };
  const { path, fill } = viewBoxes[variante];
  return (
    <svg aria-hidden className="absolute bottom-0 left-0 w-full opacity-70" viewBox="0 0 1200 80" preserveAspectRatio="none">
      <path d={path} fill={fill} />
    </svg>
  );
}
