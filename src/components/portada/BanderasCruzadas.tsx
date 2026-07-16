/**
 * Bandera argentina: paño horizontal con Sol de Mayo.
 * Marca del sitio en header y footer.
 */
export function BanderasCruzadas({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 36 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bandera-celeste" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8d0e8" />
          <stop offset="100%" stopColor="#6fa3c4" />
        </linearGradient>
      </defs>

      <rect x="0.5" y="0.5" width="35" height="7.67" fill="url(#bandera-celeste)" />
      <rect x="0.5" y="8.17" width="35" height="7.66" fill="#f7f3eb" />
      <rect x="0.5" y="15.83" width="35" height="7.67" fill="url(#bandera-celeste)" />
      <rect
        x="0.5"
        y="0.5"
        width="35"
        height="23"
        stroke="var(--oro)"
        strokeOpacity="0.35"
        strokeWidth="0.75"
        fill="none"
      />

      {/* Sol de Mayo */}
      <circle cx="18" cy="12" r="2.6" fill="var(--oro)" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * 45 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={18 + Math.cos(a) * 3.2}
            y1={12 + Math.sin(a) * 3.2}
            x2={18 + Math.cos(a) * 4.6}
            y2={12 + Math.sin(a) * 4.6}
            stroke="var(--oro)"
            strokeWidth="0.75"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
