import { SiteShell } from "@/components/SiteShell";

type Props = {
  children: React.ReactNode;
};

/** Shell estático: sin lookup de auth en el layout (performance / ISR). */
export function SiteShellWrapper({ children }: Props) {
  return <SiteShell>{children}</SiteShell>;
}
