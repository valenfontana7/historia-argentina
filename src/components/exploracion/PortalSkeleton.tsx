/**
 * Skeleton elegante del portal mientras hidrata media / rieles.
 */
export function PortalSkeleton() {
  return (
    <div
      className="relative flex min-h-svh animate-pulse flex-col justify-end bg-fondo-2 px-5 pb-28 pt-32"
      aria-hidden
    >
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <div className="h-3 w-28 rounded-full bg-fondo-3" />
        <div className="h-12 w-full max-w-xl rounded-sm bg-fondo-3 sm:h-16" />
        <div className="h-4 w-full max-w-md rounded-full bg-fondo-3" />
        <div className="h-4 w-3/4 max-w-sm rounded-full bg-fondo-3" />
        <div className="mt-6 h-12 w-48 rounded-full bg-oro/20" />
      </div>
    </div>
  );
}
