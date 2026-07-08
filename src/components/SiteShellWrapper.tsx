import { SiteShell } from "@/components/SiteShell";
import { puedeVerContenidoMecenas } from "@/lib/auth";

type Props = {
  children: React.ReactNode;
};

export async function SiteShellWrapper({ children }: Props) {
  const esMecenas = await puedeVerContenidoMecenas();
  return <SiteShell esMecenas={esMecenas}>{children}</SiteShell>;
}
