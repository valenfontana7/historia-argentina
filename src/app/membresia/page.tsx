import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "@/components/membresia/CheckoutForm";
import { formatearPrecio, planes } from "@/lib/membresia.config";
import { sitio } from "@/lib/site.config";

export const metadata: Metadata = {
  title: "Membresía Mecenas",
  description:
    "Sostené Argent y accedé a exclusivas, anticipos y la carta mensual del mecenas.",
};

const faqs = [
  {
    q: "¿El museo sigue siendo gratis?",
    a: "Sí. Las crónicas públicas, el Panteón y la efeméride diaria siguen abiertos. Mecenas desbloquea exclusivas y anticipos.",
  },
  {
    q: "¿Cómo pago?",
    a: "Con MercadoPago: tarjeta, débito, dinero en cuenta o los medios que ofrezca tu checkout. El plan mensual es una suscripción; el fundador es un pago anual.",
  },
  {
    q: "¿Cómo entro después de pagar?",
    a: "Te mandamos un magic link al email del pago. También podés pedir uno nuevo desde «Ya soy mecenas».",
  },
  {
    q: "¿Puedo cancelar?",
    a: "El plan mensual se cancela cuando quieras desde MercadoPago. El fundador dura un año completo desde el pago.",
  },
];

export default function MembresiaPage() {
  return (
    <div className="pt-24">
      <section className="mx-auto max-w-3xl px-5 pb-16 text-center">
        <p className="kicker">Mecenazgo cultural</p>
        <h1 className="titulo-display mt-4 text-4xl font-semibold leading-tight sm:text-6xl">
          Mecenas de {sitio.nombre}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-tinta-suave">
          No es un streaming barato: es sostener un museo digital que cuenta la
          historia argentina con rigor visual. A cambio, anticipo, exclusivas y
          crédito público.
        </p>
        <p className="mt-4 text-sm text-tinta-tenue">
          ¿Ya sos mecenas?{" "}
          <Link
            href="/membresia/acceder"
            className="text-oro-claro underline-offset-4 hover:underline"
          >
            Pedí tu enlace de acceso
          </Link>
        </p>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-5 pb-20 md:grid-cols-2">
        {([planes.mensual, planes.fundador] as const).map((plan) => (
          <div
            key={plan.id}
            className={`rounded-sm border p-8 ${
              plan.destacado
                ? "border-oro/50 bg-gradient-to-b from-[#1a160f] to-fondo-2"
                : "border-linea bg-fondo-2"
            }`}
          >
            {plan.destacado && (
              <p className="mb-3 text-[0.65rem] uppercase tracking-[0.22em] text-oro">
                Recomendado para el lanzamiento
              </p>
            )}
            <h2 className="titulo-display text-2xl font-semibold">
              {plan.nombre}
            </h2>
            <p className="mt-2 text-sm text-tinta-suave">{plan.descripcion}</p>
            <p className="mt-6">
              <span className="titulo-display text-4xl font-semibold text-oro">
                {formatearPrecio(plan.precio)}
              </span>
              <span className="ml-2 text-sm text-tinta-tenue">
                {plan.periodo}
              </span>
            </p>
            <ul className="mt-6 space-y-2 text-left text-sm text-tinta-suave">
              {plan.beneficios.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="text-oro">✦</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <CheckoutForm
              plan={plan.id}
              destacado={plan.destacado}
              etiqueta={
                plan.id === "fundador"
                  ? "Ser fundador con MercadoPago"
                  : "Suscribirme con MercadoPago"
              }
            />
          </div>
        ))}
      </section>

      <section className="border-y border-linea-suave bg-fondo-2 py-16">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="titulo-display text-center text-2xl font-semibold">
            Preguntas frecuentes
          </h2>
          <dl className="mt-10 space-y-8">
            {faqs.map((f) => (
              <div key={f.q}>
                <dt className="font-medium text-oro-claro">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-tinta-suave">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
